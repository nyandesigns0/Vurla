# Vurla website architecture charter

This charter is extracted from the active [website architecture refactor plan](../plans/active/website-architecture-refactor-implementation-plan.md) §3 and records the shipped ownership boundaries.

- **Source of truth:** typed authored records live in `src/content/internal/`, and are reached only through the server-only `@/content/server` facade.
- **Web Product:** owns thin App Router routes, feature composition, components, browser interactions, CSS, and `POST /api/contact`.
- **Site Content:** owns public contracts, authored records, loaders, validation, and content tests.
- **Repository Data:** is the static source beneath `src/content/internal/`; it is never imported by client modules.
- **No ports:** Vurla has no CMS, database, provider integration, or persistence layer. Contact validation simulates processing only; it does not send mail or create CRM records.

## Dependency direction

```text
Client islands -> @/content/contracts -> site/ui components
Server features/routes -> @/content/server -> contracts -> internal records
```

Client modules may not import `@/content/server` or `@/content/internal`. Server Components call loaders directly rather than fetching Vurla’s own API. `/services` is a first-class feature and permanently replaces the retired `/team` route.

## Product hardlines

Vurla remains one light-only Next.js app. It has no user-selectable theme, global loading/transition/debug shell, projects read API, generic shared package, or unused provider abstraction. The design authority is `docs/architecture/design.md`, synchronized with TypeScript tokens and CSS custom properties by tests.
