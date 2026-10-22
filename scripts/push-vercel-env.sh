#!/usr/bin/env bash
# Copies the settings from .env into the momo-smart Vercel project
# (Production), then deploys it. Run from the momo.com folder.
set -e
cd "$(dirname "$0")/.."
for k in AUTH_SECRET DATABASE_URL DEMO_MODE CRON_SECRET; do
  v=$(grep "^$k=" .env | sed -E "s/^$k=\"?//; s/\"$//")
  npx -y vercel@latest env rm "$k" production --yes >/dev/null 2>&1 || true
  printf '%s' "$v" | npx -y vercel@latest env add "$k" production >/dev/null
  echo "set $k"
done
npx -y vercel@latest deploy --prod --yes
