#!/usr/bin/env bash
set -euo pipefail

# Dry-run recipe templates only. Replace placeholders after browser capture verifies
# the exact method/query/body and after auth has been stored outside the repo.

BASE_URL="${ALLTRAILS_BASE_URL:-https://www.alltrails.com}"

printf 'Trail detail offline plan:\n'
printf 'curl -sS "%s/api/alltrails/v3/trails/{trail_id}?detail=offline" -H "Authorization: Bearer $ALLTRAILS_ACCESS_TOKEN"\n' "$BASE_URL"

printf '\nTrail search plan:\n'
printf 'curl -sS "%s/api/alltrails/v3/trails/search?q={query}&lat={lat}&lng={lng}&radius={radius_km}" -H "Authorization: Bearer $ALLTRAILS_ACCESS_TOKEN"\n' "$BASE_URL"

printf '\nCurrent user plan:\n'
printf 'curl -sS "%s/api/alltrails/v3/user/me/" -H "Authorization: Bearer $ALLTRAILS_ACCESS_TOKEN"\n' "$BASE_URL"

