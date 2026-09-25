#!/usr/bin/env bash
# Idempotent local env setup for Alloy sessions.
set -euo pipefail
cd "$(dirname "$0")/.."

ENV_FILE=".env.local"
touch "$ENV_FILE"

set_var() {
  local key="$1" value="$2"
  local existing
  existing="$(grep -E "^${key}=" "$ENV_FILE" | tail -n1 | cut -d= -f2- || true)"
  if [ -n "${existing:-}" ] && [ "$existing" != "REPLACE_ME" ]; then
    return 0
  fi
  if [ -z "$value" ]; then
    return 0
  fi
  if grep -qE "^${key}=" "$ENV_FILE"; then
    sed -i "s|^${key}=.*|${key}=${value}|" "$ENV_FILE"
  else
    printf '%s=%s\n' "$key" "$value" >> "$ENV_FILE"
  fi
}

set_var IS_ALLOY "${IS_ALLOY:-true}"
set_var GEMINI_API_KEY "${GEMINI_API_KEY:-}"
