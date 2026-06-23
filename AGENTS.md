# AGENTS.md — AllTrails CLI (MCP + API) developer/maintainer runbook

This is the in-repo runbook for anyone (human or agent) working **on** this codebase. For *operating*
the tool — the actual command/tool surface, auth, and worked examples — read [`SKILL.md`](./SKILL.md)
and [`README.md`](./README.md). This file stays deliberately small.

> **Generic baseline.** The build/test and layout below are verified for this repo, but the per-command
> and per-MCP-tool specifics are intentionally **not** duplicated here — they live in `SKILL.md`,
> `README.md`, the `api-map/`, `--help`, and the live MCP `tools/list`. Trust those over any list a doc
> might hardcode.

## What this repo is

An unofficial **API map + CLI + MCP server** for the AllTrails surface. The headline artifact is the
hand-mapped surface in [`api-map/`](./api-map/); the CLI and the MCP server are two front ends that drive
the same map.

## Repository layout

```
api-map/   the mapped surface (OpenAPI / per-endpoint docs / curl) — the product
cli/       the TypeScript CLI            (package @zaydiscold/alltrails-cli)
mcp/       the MCP server                (package @zaydiscold/alltrails-cli-mcp)
docs/      reference docs
scripts/   helper scripts
```

## Build / test / typecheck

```bash
pnpm install
pnpm build       # build the CLI + MCP
pnpm test        # vitest
pnpm typecheck   # type-only check
```

Requires **Node ≥ 20** and **pnpm**. The MCP package consumes the CLI's built output, so the CLI must be
built before the MCP typechecks — the root `build`/`typecheck` scripts already order this.

> **Rebuild after editing the route map.** The runtime reads `cli/dist/` (the build copies `api-map/`
> into dist). Editing source without `pnpm build` is a silent no-op.

## MCP

The MCP server mirrors the CLI over the same map and write gates. **Live tool truth is the MCP
`tools/list`** — never a hardcoded count. The built entry point is `mcp/dist/server.js`; for the exact
registration command and any required env, see [`SKILL.md`](./SKILL.md) / [`README.md`](./README.md).

## Adding to the map

1. Add the route to the spec under `api-map/` (+ a per-endpoint doc).
2. Wire the capability so both the CLI and the MCP can drive it (keep the two surfaces in step).
3. `pnpm build && pnpm test`; live-verify only with reversible actions.

## Naming convention & lineage

**Convention (shared across the personal CLI repos).** The GitHub slug is `<venue>-cli-mcp-api` and the
README H1 reads **"<Venue> CLI (MCP + API)"** — e.g. AllTrails CLI (MCP + API), plus the Goodreads /
Robinhood / GoDaddy / Squarespace siblings. The npm package and bin names stay `@zaydiscold/<venue>-cli`
/ `<venue>-cli`; only the GitHub slug and the README title carry the `(MCP + API)` branding, and GitHub
auto-redirects the old slugs.

**Lineage — Printing Press is a starting point, not a cage.** The CLI + skill + MCP trio pattern is
borrowed from [Matt Van Horn's Printing Press](https://github.com/mvanhorn/cli-printing-press), and these
repos use it as a *seed* — not a spec we only follow. The map here is hand-extended past anything a
generator produced, and we may spin up separate repos to keep building on top of what's here rather than
conforming back to the generator. The map is the product; Printing Press just gave us a good place to start.

## House rules

- Keep secrets and raw captures out of the committed tree; promote only sanitized, tested behavior to
  `cli/`, `mcp/`, and `docs/`.
- Match the repo's existing style; verify command and tool names with `--help` and `tools/list` rather
  than guessing.
- Keep the read-vs-write safety posture intact (writes default to dry-run / are gated).
