# ============================================================
# Stage 1: Install ALL dependencies (needed for build)
# ============================================================
FROM node:20-alpine AS deps

WORKDIR /app

# libc6-compat for native binaries (sharp, libsql)
RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json ./

# Install all deps including devDeps (needed for next build)
RUN npm ci --frozen-lockfile


# ============================================================
# Stage 2: Build the Next.js application
# ============================================================
FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

# NEXT_PUBLIC_SITE_URL is compiled into the client bundle — pass your real
# domain via --build-arg NEXT_PUBLIC_SITE_URL=https://yourdomain.com
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3000
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL

# PAYLOAD_SECRET is runtime-only — never needed during next build.
# The payload.config.ts fallback ('YOUR_SECRET_HERE') is used here safely.
# Point Payload at a throw-away file; the real DB lives in the runtime volume.
ENV DATABASE_URI=file:/tmp/build-placeholder.db

# The root page uses `force-dynamic` so Next.js will NOT attempt to
# statically prerender it (which would require a live DB connection).
RUN npx next build


# ============================================================
# Stage 3: Production runner
# ============================================================
FROM node:20-alpine AS runner

WORKDIR /app

RUN apk add --no-cache libc6-compat

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser  --system --uid 1001 nextjs

# Persistent volume mount-point for the SQLite database
RUN mkdir -p /data && chown nextjs:nodejs /data

# Install production-only dependencies
COPY package.json package-lock.json ./
RUN npm ci --frozen-lockfile --omit=dev && npm cache clean --force

# Copy built Next.js output
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Copy source files required by `payload migrate` at runtime
# (Payload v3 loads payload.config.ts via its internal TypeScript loader)
COPY --from=builder --chown=nextjs:nodejs /app/src ./src
COPY --from=builder --chown=nextjs:nodejs /app/next.config.ts ./
COPY --from=builder --chown=nextjs:nodejs /app/tsconfig.json ./
COPY --from=builder --chown=nextjs:nodejs /app/postcss.config.mjs ./

# Entrypoint: runs migrations then starts Next.js
COPY --chown=nextjs:nodejs entrypoint.sh ./
RUN chmod +x entrypoint.sh

USER nextjs

EXPOSE 3000

# Health check — give 90s for first start (migrations + Next.js cold start)
HEALTHCHECK --interval=30s --timeout=10s --start-period=90s --retries=3 \
  CMD wget -qO- http://localhost:3000/ > /dev/null 2>&1 || exit 1

ENTRYPOINT ["./entrypoint.sh"]
