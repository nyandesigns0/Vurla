# Vurla

Vurla is a Next.js design-practice site with one fixed dark architectural theme, six color primitives, square geometry, and Chakra Petch / Share Tech Mono typography.

## Routes

- `/` — home
- `/projects` and `/projects/[slug]` — portfolio and project detail
- `/services` — Vurla services (permanently replaces the retired Team route)
- `/contact` — contact form
- `/design.md` — non-indexed design-system guide

`POST /api/contact` validates a contact request and simulates processing. It does not deliver email, persist submissions, or create CRM records. There is no projects read API.

## Architecture

Authored static content lives in `src/content/internal/`. Server Components load it through `@/content/server`; client code may only use serializable types from `@/content/contracts`. Routes are intentionally thin and page composition is owned by `src/features/`.

The Vurla design authority is [docs/architecture/design.md](docs/architecture/design.md), synchronized with `src/lib/design-system/tokens.ts` and `src/app/design-system.css` by tests.

## Commands

Use Node.js 22.12 or newer and install the locked dependencies with `npm ci`.

```bash
npm run dev
npm run lint
npm run typecheck
npm run test
npm run build
npm run verify
npx playwright install chromium
npm run test:browser
```

Stop the development server before running the production build or verification.
Development uses `.next-dev`; production uses `.next`. The verification runner
resolves tools from this checkout, including when launched from another folder.
Browser checks start and stop their own production server on port 4100; set
`BROWSER_BASE_URL` to check an already-running production server instead.

Screenshots, recordings, and historical design experiments remain in ignored
local archives under `output/` and the completed redesign evidence folders.
Committed preservation fixtures and asset provenance remain self-contained.
