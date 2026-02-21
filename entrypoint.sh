#!/bin/sh
set -e

# Schema is synced automatically on startup via `push: true` in the
# SQLite adapter — no separate `payload migrate` step needed.
echo "==> Starting Next.js production server..."
exec ./node_modules/.bin/next start -p "${PORT:-3000}"
