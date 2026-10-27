# Vurla website architecture charter

This charter is extracted from the completed [website architecture refactor plan](../plans/complete/website-architecture-refactor/website-architecture-refactor-implementation-plan.md) §3 and records the shipped ownership boundaries.

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

Vurla remains one Next.js app with one fixed dark architectural theme and no user-selectable theme. `SiteShell` owns the single shared header, main landmark, footer, and decorative `RouteTransition`; route and chapter transitions may not replace native navigation, scrolling, focus, or history behavior. The homepage has exactly four chapters: hero plus its full-width statistics bar, Services, Selected Projects, and New Work plus the single shared footer. Vurla has no projects read API, generic shared package, or unused provider abstraction. The design authority is `docs/architecture/design.md`, synchronized with TypeScript tokens and CSS custom properties by tests.

The spatial hero and New Work use the shared bounded Three.js/WebGL room renderer and lifecycle. The approved endless hallway, grid, lighting, and project exhibits are decorative enhancements; semantic DOM copy and ordinary project/contact links remain usable without JavaScript or WebGL. Reduced motion, coarse pointers, compact viewports, context loss, and unavailable enhancement preserve those controls. GSAP remains scoped to chapter enhancement. Renderer imports stay lazy, pixel density is bounded, and frame loops suspend when hidden or offscreen.

Development artifacts use `.next-dev`; production build/start use `.next`. Stop development before a production build. `npm run verify` resolves tools from this checkout and runs lint, types, component tests, the image-cancellation regression, generated grain consistency, and the production build. The temporary Next 15.5.28 image-cancellation backport is version-checked at npm postinstall and covered by the Node regression in `npm test`.

All authored project slugs are pre-rendered at build time. Their full content must be visible without JavaScript rather than remaining behind a streamed loading shell. Local review recordings and screenshots are excluded from source control; content preservation fixtures and asset provenance are committed independently.
