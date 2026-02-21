#!/bin/sh
set -e

# Derive the filesystem path from DATABASE_URI (strip the "file:" prefix)
DB_URI="${DATABASE_URI:-file:/data/payload.db}"
DB_PATH="${DB_URI#file:}"

# On first run the volume is empty — copy the seed DB (which already has
# the correct schema from build-time payload migrate) so the app starts
# with all tables in place without needing tsx at runtime.
if [ ! -f "$DB_PATH" ]; then
  echo "==> First run: initialising database from build-time seed..."
  mkdir -p "$(dirname "$DB_PATH")"
  cp /app/seed.db "$DB_PATH"
  echo "==> Database ready."
fi

echo "==> Starting Next.js production server..."
exec ./node_modules/.bin/next start -p "${PORT:-3000}"
