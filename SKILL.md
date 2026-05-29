# AllTrails CLI Skill

Use this package when a task needs an AllTrails route inventory, dry-run URL/form plan, or MCP-facing map of AllTrails trail/account/activity surfaces.

Default to:

1. `alltrails-cli api-map search <query>`
2. `alltrails-cli <surface> plan ... --json`
3. browser-backed capture only when the user has explicitly supplied an authenticated browser session

Never persist raw cookies, tokens, request bodies, private account ids, or localStorage.

