# Vurla — Codex project context

## Application

- Vurla is a Next.js 15.5.6 App Router site using React 19.1.0 and TypeScript strict/no-emit.
- `@/*` maps to `src/*`; npm is the dependency manager on this Windows worktree.
- Vurla is light-only. The current graphite/paper/mineral rebrand, hard-edge treatment, and brand SVG assets in `public/brand/` are the visual baseline.

## Architecture

- Thin routes live in `src/app/`; page composition belongs in `src/features/`.
- Static authored records live in `src/content/internal/`; only `src/content/server/` may import them, and it starts with `import "server-only"`.
- Client modules may use only `@/content/contracts` types/projections. They must never import server or internal content.
- `src/components/site/` owns site presentation/local controllers; `src/components/ui/` owns reusable controls.
- `docs/architecture/website-architecture-charter.md` and `docs/architecture/design.md` govern ownership and design tokens.

## Routes and API

- Visitor routes: `/`, `/projects`, `/projects/[slug]`, `/services`, `/contact`, and non-indexed `/design.md`.
- `/services` permanently replaced `/team`.
- Only `POST /api/contact` remains. It validates and simulates processing; it does not send mail, persist leads, or contact a CRM.

## Commands

```bash
npm run dev
npm run lint
npm run typecheck
npm run test
npm run build
npm run verify
```

Vitest uses jsdom and React Testing Library. Do not run `next dev` concurrently with a production build; if a clean build is needed, only the generated `.next` directory may be cleared.
