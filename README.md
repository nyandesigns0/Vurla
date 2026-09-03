# Vurla

Vurla is a light-only Next.js design-practice site built around graphite, paper, mineral surfaces, hard edges, and Geist typography.

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

```bash
npm run dev
npm run lint
npm run typecheck
npm run test
npm run build
npm run verify
```
