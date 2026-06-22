# Write Operations

Checked: 2026-05-26

This is the personal `zaydiscold/alltrails-cli-mcp-api` package. It is live-capable by default.

## Behavior

- Reads execute live when auth is present.
- Writes execute live when auth is present.
- `--dry-run` is the opt-in non-mutating mode for tests and rehearsals.
- `write-mutate` and `write-destructive` operations emit `[WRITES TO LIVE ALLTRAILS]` to stderr before the request is sent.

## Examples

```bash
ALLTRAILS_ACCESS_TOKEN=... pnpm cli write execute favorite-add 10027248 --dry-run --json
ALLTRAILS_ACCESS_TOKEN=... pnpm cli write execute favorite-add 10027248 --json
ALLTRAILS_COOKIE='...' ALLTRAILS_CSRF_TOKEN=... pnpm cli request DELETE /api/alltrails/v3/favorites/10027248 --json
```

## MCP Tools

The MCP server separates read tools (`alltrails_api_map_summary`, `alltrails_routes`, the `*_plan` tools, `alltrails_live_read`) from the write tools (`alltrails_live_write`, `alltrails_live_request`). Write tools take a `dryRun` flag so agents can rehearse a mutation before sending it.
