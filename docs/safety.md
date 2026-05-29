# Safety And Authorization

Checked: 2026-05-26

AllTrails has useful web/mobile route surfaces, but no public developer API contract was found. This personal package is built around explicit account authorization, live reads/writes, sanitized evidence, and opt-in dry-run testing.

## Hard Boundaries

- Do not solve CAPTCHA, impersonate browser TLS fingerprints, or bypass DataDome.
- Do not store raw cookies, bearer tokens, refresh tokens, localStorage, request bodies, or private account ids in fixtures or proofs.
- Mutations are live by default in this personal repo. Use `--dry-run` when testing.
- Rate-limit capture flows and prefer current logged-in browser state over direct unauthenticated scraping.
- Label route confidence clearly.

## Why This Matters

AllTrails robots and community history show strong automation boundaries. The useful CLI shape is still valuable if it maps and executes the user's own account surfaces without storing secrets or turning into a scraping or bypass tool.
