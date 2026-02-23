#!/bin/sh
set -e

echo "==> Starting Next.js production server..."
exec ./node_modules/.bin/next start -p "${PORT:-3000}"
