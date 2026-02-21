# ============================================================
# Stage 1: Install ALL dependencies (needed for build)
# ============================================================
FROM node:24-alpine AS deps

WORKDIR /app

# libc6-compat for native binaries (sharp, libsql)
RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json ./

RUN npm ci --frozen-lockfile


# ============================================================
# Stage 2: Build — runs payload migrate + next build
# All devDeps (including typescript) are available here, so tsx
# can resolve extensionless TypeScript imports correctly.
# ============================================================
FROM node:24-alpine AS builder

WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

# NEXT_PUBLIC_SITE_URL is compiled into the client bundle — pass your
# real domain via --build-arg NEXT_PUBLIC_SITE_URL=https://yourdomain.com
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3000
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL

# Use a temp DB for the build-time migration.
# The resulting file is copied into the image as seed.db and used to
# initialise fresh production volumes (see entrypoint.sh).
ENV DATABASE_URI=file:/tmp/build-placeholder.db

# npm run build = "payload migrate && next build"
# Running both here (with full devDeps) avoids having to run the
# tsx-based migrate step at runtime where typescript is absent.
RUN npm run build

# Capture the migrated schema as a seed database
RUN cp /tmp/build-placeholder.db /app/seed.db


# ============================================================
# Stage 3: Production runner
# ============================================================
FROM node:24-alpine AS runner

WORKDIR /app

RUN apk add --no-cache libc6-compat

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser  --system --uid 1001 nextjs

# Persistent mount-point for the SQLite database
RUN mkdir -p /data && chown nextjs:nodejs /data

# Production-only dependencies
COPY package.json package-lock.json ./
RUN npm ci --frozen-lockfile --omit=dev && npm cache clean --force

# Built Next.js output
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Seed DB — used to initialise the volume on first run
COPY --from=builder --chown=nextjs:nodejs /app/seed.db ./seed.db

COPY --chown=nextjs:nodejs entrypoint.sh ./
RUN chmod +x entrypoint.sh

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget -qO- http://localhost:3000/ > /dev/null 2>&1 || exit 1

ENTRYPOINT ["./entrypoint.sh"]
