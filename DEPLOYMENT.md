# Deployment Guide

This portfolio is a **Next.js 15 + Payload CMS v3** application backed by **SQLite**.
The Docker image is multi-stage, runs as a non-root user, and uses a named volume for
database persistence.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `PAYLOAD_SECRET` | **Yes** | Random secret for signing sessions/tokens. Generate with `openssl rand -base64 32`. |
| `NEXT_PUBLIC_SITE_URL` | **Yes** | Full public URL (e.g. `https://ade.dev`). Compiled into the client bundle at build time — must match your real domain. |
| `DATABASE_URI` | **Yes** | SQLite path inside the container. Use `file:/data/payload.db` to target the named volume. |
| `PORT` | No | Port the server listens on (default `3000`). |

> **Security note:** Never commit `.env` files. Use `.env.example` as a template.

---

## Local Development with Docker

```bash
# 1. Copy and fill in the env file
cp .env.example .env

# 2. Build and start
docker compose up --build

# 3. Open http://localhost:3000
```

The first run applies all Payload migrations automatically via the container entrypoint.

---

## Deploying on Coolify

Coolify is a self-hosted PaaS that builds your image from source and manages containers.

### Prerequisites

- A Coolify instance (v4+) with a server attached.
- Your repository pushed to GitHub / GitLab / Bitbucket (or accessible via SSH).

### Step-by-step

#### 1. Create a new Resource

1. In the Coolify dashboard go to **Projects → your project → New Resource**.
2. Choose **Application** → **Docker Compose** or **Dockerfile** (choose **Dockerfile**).
3. Connect your Git repository and select the branch to deploy (e.g. `main`).

#### 2. Configure the Build

| Setting | Value |
|---|---|
| **Build Pack** | `Dockerfile` |
| **Dockerfile path** | `Dockerfile` |
| **Docker Context** | `.` (project root) |
| **Exposed Port** | `3000` |

#### 3. Set Build Arguments

Coolify lets you pass build-time arguments (under **Build Variables**):

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://yourdomain.com` |
| `PAYLOAD_SECRET` | *(your secret — keep this the same as the runtime env var)* |

> `NEXT_PUBLIC_SITE_URL` is compiled into the client bundle, so it **must** be set as a
> build arg as well as a runtime env var.

#### 4. Set Runtime Environment Variables

Under **Environment Variables**, add:

```
PAYLOAD_SECRET=<your-secret>
DATABASE_URI=file:/data/payload.db
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NODE_ENV=production
```

#### 5. Configure Persistent Storage (Volumes)

Coolify supports Docker volume mounts. Under **Storages** / **Persistent Volumes**, add:

| Volume Name | Mount Path | Purpose |
|---|---|---|
| `payload_data` | `/data` | SQLite database file |
| `payload_media` | `/app/public/media` | User-uploaded media |

> Without these volumes, all data is lost on every redeploy.

#### 6. Set the Domain

Under **Domains**, enter your domain (e.g. `ade.dev`). Coolify automatically provisions
a Let's Encrypt TLS certificate.

#### 7. Health Check

Coolify uses the `HEALTHCHECK` instruction in the Dockerfile. No extra configuration
is needed — it polls `http://localhost:3000/` every 30 s with a 90 s grace period for
the first start (migrations + Next.js cold boot).

#### 8. Deploy

Click **Deploy**. Coolify will:
1. Clone your repo.
2. Build the Docker image using the multi-stage `Dockerfile`.
3. Run the container, which automatically runs `payload migrate` on startup.
4. Route traffic through its reverse proxy (Caddy/Traefik) with TLS.

---

## Subsequent Deployments

Every push to the configured branch (or a manual redeploy in Coolify):

1. Coolify rebuilds the image.
2. The new container starts and runs `payload migrate` — new migrations are applied
   automatically against the persisted SQLite volume.
3. The old container is stopped only after the new one passes the health check (zero-
   downtime rolling replacement).

---

## Backup Strategy (SQLite)

Because the database is a single file you can back it up simply by copying it:

```bash
# On the Coolify host — find the volume path
docker volume inspect payload_data

# Create a timestamped backup
cp /var/lib/docker/volumes/<volume-id>/_data/payload.db \
   /backups/payload-$(date +%Y%m%d-%H%M%S).db
```

Automate this with a cron job or use Coolify's scheduled backup feature if available.

---

## SQLite Concurrency Note

SQLite supports **one writer at a time**. This deployment runs a single container
replica which is perfectly safe. Do **not** run multiple replicas of this service
simultaneously — they would compete on the same SQLite file and cause corruption.
If you need horizontal scaling in the future, migrate to PostgreSQL/MySQL via
`@payloadcms/db-postgres`.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `PAYLOAD_SECRET` error on startup | Secret not set | Add env var in Coolify |
| Admin panel shows wrong domain in live-preview | `NEXT_PUBLIC_SITE_URL` mismatch | Rebuild with correct build arg |
| Database not persisting after redeploy | Volume not mounted | Add `/data` volume in Coolify Storages |
| `SQLITE_CANTOPEN` on startup | `/data` not writable by `nextjs` user | Ensure volume is owned by uid 1001 |
| Image fails to build | Lockfile mismatch | Run `npm install` locally, commit updated `package-lock.json` |
