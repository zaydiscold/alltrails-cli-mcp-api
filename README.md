# AllTrails CLI (MCP + API)

I wanted my AllTrails data — trails, maps, GPS routes, my own recordings and activities — reachable from the terminal and from agents instead of locked inside the app. AllTrails has no public developer API, so I mapped the routes the web and mobile clients actually use, then built a small TypeScript CLI and MCP server on top of that map.

This is unofficial and not affiliated with AllTrails. It maps and drives my own account surfaces; it stores no cookies, tokens, or private ids.

## What it does

- **Search trails** by name, location, or map bounds.
- **Trail details + weather** — full trail payloads plus the weather overview surface.
- **Maps & GPS routes** — static maps, offline-map metadata, GPX, and route geometry.
- **Recordings & activities** — community recordings, your activity list, and activity detail/upload.
- **Lists** — saved and custom lists.
- **Reviews & photos** — trail reviews and the trail/photo surfaces.

```bash
pnpm install
pnpm build
pnpm cli api-map summary --json
pnpm cli trail get 10027248 --detail offline --json
pnpm cli search plan "Half Dome" --lat 37.746 --lng -119.533 --radius 25 --limit 3 --json
```

Live commands read caller-owned auth from environment variables set outside this repo (`ALLTRAILS_ACCESS_TOKEN`, or `ALLTRAILS_COOKIE` with an optional `ALLTRAILS_CSRF_TOKEN`). Writes are real by default and print a stderr warning before mutating; pass `--dry-run` to rehearse without sending. There is no CAPTCHA solving, bot-bypass, TLS impersonation, or stealth code here.

## The map is the point

The headline artifact lives in [`api-map/`](api-map/): an OpenAPI spec, a Markdown route reference, and runnable curl recipes covering roughly 120 endpoints across trails, maps, recordings, activities, lists, reviews, and account surfaces. Every route carries a source label (`browser_observed`, `community_inferred`, `subscription_gated`, `unverified`, and so on) so you can tell evidence quality apart from permission. The CLI and MCP server are just two convenient front-ends for that map.

## Extending it

New routes go in `api-map/` first (OpenAPI + the Markdown table), then surface in the CLI via `cli/src/lib.ts`. Run `pnpm cli api-map routes` to see everything currently wired up, and `pnpm cli request <METHOD> <path>` to drive a freshly captured route before it gets a dedicated command.

---

Built on the trio pattern (CLI + skill + MCP) pioneered by [Matt Van Horn's Printing Press](https://github.com/mvanhorn/cli-printing-press).

Mapped & built by Zayd Khan ([@ColdCooks](https://twitter.com/ColdCooks) / [zaydiscold](https://github.com/zaydiscold)). MIT © Zayd Khan.
