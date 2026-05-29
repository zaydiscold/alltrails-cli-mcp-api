#!/usr/bin/env bash
set -euo pipefail

: "${ALLTRAILS_BASE_URL:=https://www.alltrails.com}"

trail_id="${1:-10027248}"

printf '# Trail detail live read; provide caller-owned auth when the route requires it.\\n'
printf 'curl -sS %q -H "Authorization: Bearer ${ALLTRAILS_ACCESS_TOKEN}"\\n' "${ALLTRAILS_BASE_URL}/api/alltrails/v3/trails/${trail_id}?detail=offline"

printf '\\n# Static map shape observed from browser resources.\\n'
printf 'curl -sS %q\\n' "${ALLTRAILS_BASE_URL}/api/alltrails/v3/trails/${trail_id}/static_map?size=1280x582&scale=2&show_3d=yes"

printf '\\n# Personal live write shape; this mutates the caller account when auth is valid.\\n'
printf 'curl -sS -X POST %q -H "Authorization: Bearer ${ALLTRAILS_ACCESS_TOKEN}"\\n' "${ALLTRAILS_BASE_URL}/api/alltrails/v3/favorites/${trail_id}"
