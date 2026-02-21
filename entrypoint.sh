#!/bin/sh
set -e

echo "==> Running Payload CMS database migrations..."
./node_modules/.bin/payload migrate

echo "==> Starting Next.js production server..."
exec ./node_modules/.bin/next start -p "${PORT:-3000}"
