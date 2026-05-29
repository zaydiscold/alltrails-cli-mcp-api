# Auth Notes

Checked: 2026-05-26

Known community evidence suggests an email/password login flow around `/api/alltrails/v3/auth/login` that returns bearer and refresh material, while the web app can also rely on browser cookies and local client state.

This repo does not extract tokens from a browser. The intended safe flow is:

1. User logs in manually in a browser.
2. Capture route shapes and status codes from the live tab.
3. Store only sanitized route evidence.
4. Put caller-owned auth into environment variables only for the process that is about to execute.

Live commands read either `ALLTRAILS_ACCESS_TOKEN` or `ALLTRAILS_COOKIE`. Some write routes may also need `ALLTRAILS_CSRF_TOKEN`; the CLI forwards it when present.

Mutating commands are real in this personal repo. Use `--dry-run` to rehearse a write without sending it.

```bash
ALLTRAILS_ACCESS_TOKEN=... pnpm cli write execute favorite-add 10027248 --dry-run --json
ALLTRAILS_ACCESS_TOKEN=... pnpm cli write execute favorite-add 10027248 --json
ALLTRAILS_COOKIE='...' ALLTRAILS_CSRF_TOKEN=... pnpm cli request POST /api/alltrails/v3/favorites/10027248 --json
```
