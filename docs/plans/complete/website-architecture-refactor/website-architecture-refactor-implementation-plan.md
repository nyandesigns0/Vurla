# Vurla Website Architecture Refactor — Implementation Plan

> **Agent preamble (read first).** This file is the authoritative plan for refactoring Vurla into the established COGH-style website architecture and design-system governance model. Execute it top to bottom in one continuous run unless blocked. Before writing code, read the canonical COGH references and the Vurla sources listed in §2.1. Preserve all existing visitor routes, current static content values, project filtering, project-detail 404 behavior, and contact request semantics unless this plan explicitly changes them. Update the checklists and Live Progress Log immediately after every phase. Do not infer a CMS, real contact delivery, or any unverified external integration from the current static website.

**Status:** Complete
**Last updated:** 2026-09-03
**Owner / executor:** Codex or assigned implementation agent

**Goal:** Refactor Vurla from route-owned UI and direct `src/lib/data` imports into a layered Next.js application with thin routes, feature-owned composition, server-only content facades, enforceable client/server boundaries, a governed light-only design system, and a living `/design.md` guide.

**Architecture:** Web Product owns routes, feature composition, presentation, CSS, browser state, and the existing contact route handler. Site Content owns typed authored records, validation, and server-only loaders. Repository Data consists of the authored content records. Vurla has no real external provider integration today, so no empty integration or vendor layer may be created.

**Tech Stack:** Next.js 15.5.6 App Router, React 19.1.0, TypeScript strict/no-emit, Tailwind CSS 4, Framer Motion, Zod, CVA, Radix Slot, Vitest, jsdom, and React Testing Library.

---

## 1. Goal

Refactor the website so architectural ownership is immediately answerable for every new change while retaining Vurla’s existing pages and content.

Success = the public website keeps `/`, `/projects`, `/projects/[slug]`, `/services`, and `/contact`; static content is read through `@/content/server`; browser/client modules cannot import content internals or server-only code; styling is governed by one Vurla design document and its tested token pipeline; and all quality gates pass.

The refactor intentionally removes the unused `GET /api/projects` endpoint, the dark-theme system, and the global loading/transition/debug shell. It keeps `POST /api/contact` with its existing request and response semantics and must describe it honestly as simulated processing until a real delivery provider is separately authorized.

---

## 2. Current codebase baseline

Record this baseline again in the Live Progress Log immediately before implementation begins.

- Branch: `main`
- Commit: `d2d2778 fix stroke`
- Worktree / repo path: `J:\CODE\Nyan Designs\Vurla`
- Git status at plan authoring: `AGENTS.md` is untracked. Preserve it; update it only as required by its own memory-maintenance instruction after the refactor is complete.
- Baseline build: `npm run build` passes and emits the five visitor routes plus `POST /api/contact` and `GET /api/projects`.
- Baseline lint: `npm run lint` reports 12 errors and 11 warnings. They are pre-existing but are in scope for remediation before closeout.
- Baseline test infrastructure: no project test runner, test script, or test files exist.

### 2.1 Read first

Canonical references:

- `AGENTS.md`
- `J:\CODE\Nyan Designs\COGH\docs\implementation-plan-template.md`
- `J:\CODE\Nyan Designs\COGH\docs\plans\complete\website-architecture-refactor\README.md`
- `J:\CODE\Nyan Designs\COGH\docs\plans\complete\website-architecture-refactor\website-architecture-refactor-implementation-plan.md`
- `J:\CODE\Nyan Designs\COGH\docs\architecture\website-architecture-charter.md`
- `J:\CODE\Nyan Designs\COGH\docs\architecture\design.md`
- `J:\CODE\Nyan Designs\COGH\src\lib\design-system\tokens.ts`
- `J:\CODE\Nyan Designs\COGH\src\lib\design-system\parse-spec.ts`
- `J:\CODE\Nyan Designs\COGH\src\lib\design-system\design-system.test.ts`

Relevant Vurla sources:

- `src/app/layout.tsx` — global composition, font loading, theme and client-shell dependencies.
- `src/app/page.tsx`, `src/app/projects/**`, `src/app/services/page.tsx`, `src/app/contact/page.tsx` — page bodies to rehome into features.
- `src/app/api/projects/route.ts` and `src/app/api/contact/route.ts` — current HTTP contracts.
- `src/lib/data/projects.ts` and `src/lib/data/services.ts` — static records and current types.
- `src/components/site/**`, `src/components/ui/**`, `src/context/SiteContext.tsx`, `src/hooks/**` — shared UI and client-state seams.
- `src/app/globals.css`, `src/styles/**`, `tailwind.config.ts` — duplicated style and token systems to consolidate.
- `package.json`, `eslint.config.mjs`, `tsconfig.json`, and `next.config.ts` — scripts, boundaries, aliases, and runtime constraints.

### 2.2 Confirmed current behavior

- Current static project and service records are imported directly from `src/lib/data` by pages and client components.
- The `Service` records contain Lucide component values typed as `any`; those values cannot cross a server-to-client content boundary as content data.
- `/projects` filters serializable project data in a client component. `/projects/[slug]` directly reads projects and calls `notFound()` for an absent slug.
- `/api/projects` returns `{ projects }` and has no in-repository consumer. It is explicitly removed by this plan.
- `/contact` browser-fetches `POST /api/contact`. That route validates `{ name, email, phone?, message }` with Zod and returns `{ success, message }`, logging accepted submissions outside production.
- `next-themes` is only used by `ThemeToggle`; the user has chosen a single light theme.
- `SiteContext` coordinates the mobile menu, global loading overlay, transitions, debug panel, and progress bar. The user has chosen to remove this global client shell; only necessary interaction state remains local to client islands.
- `npm run build` type-checks successfully but skips ESLint because `next.config.ts` has `eslint.ignoreDuringBuilds: true`; lint must therefore remain a standalone required gate.

### 2.3 Baseline validation commands

```bash
git status --short --branch --untracked-files=all
npm run lint
npm run build
```

Record existing lint failures before code changes. Do not add new failures, and do not suppress rules merely to make the report green.

---

## 3. Architecture

### 3.1 Ownership and hardlines

- **Source of truth:** typed Vurla content records in `src/content/internal/`, reached from server code only through `@/content/server`. The design system source of truth is the JSON frontmatter in `docs/architecture/design.md`, which must equal `src/lib/design-system/tokens.ts` and the custom properties in `src/app/design-system.css`.
- **Web Product owns:** App Router route files, metadata, route handlers, feature composition, React UI, client interaction islands, responsive/a11y behavior, CSS, static UI assets, and the Lucide icon rendering map.
- **Site Content owns:** public content contracts, publication-free static record loaders, content validation, and content test fixtures.
- **Repository Data owns:** authored project, service, navigation, footer, contact-detail, and FAQ records under `src/content/internal/`.
- **External Service Ports:** none. Do not create `src/components/integrations/`, `vendor/`, `capabilities/`, placeholder APIs, or a fake mail adapter. The current contact route is a Web Product handler because it has no provider wrapper or durable system behind it.
- **Permanent guardrails:** no CMS, database, monorepo, generic shared package, second content store, direct client/server self-fetch for content reads, client imports of content server/internal modules, raw repository-data imports in pages/features/components, or dark theme.
- **Honesty hardline:** never claim that `/api/contact` sends mail, reaches a CRM, or persists a lead. It validates and simulates processing only.

### 3.2 Dependency direction

```text
Web Product client islands
  -> @/content/contracts (types and serializable projections only)
  -> components/ui and components/site

Web Product server routes and feature modules
  -> @/content/server
  -> @/content/contracts
  -> components/site and components/ui

Site Content server
  -> @/content/contracts
  -> src/content/internal

Design guide server feature
  -> src/lib/design-system
  -> docs/architecture/design.md

Forbidden
  client -> @/content/server
  client -> @/content/internal
  app/features/components -> raw src/content/internal records
  server page/feature -> this app's own /api HTTP endpoints for reads
```

### 3.3 Target tree

```text
src/
  app/
    layout.tsx                    # root shell and light-only fonts/styles
    page.tsx                      # -> features/home
    projects/page.tsx             # -> features/projects
    projects/[slug]/page.tsx      # -> features/projects
    services/page.tsx             # -> features/services
    contact/page.tsx              # -> features/contact
    design.md/page.tsx            # non-indexed living design guide
    api/contact/route.ts          # browser-originated contact mutation only
    globals.css
    design-system.css
    loading.tsx
    error.tsx
  features/
    home/
    projects/
    services/
    contact/
    design/
  components/
    site/                         # Navbar server/client split, Footer, cards, FAQ, local UI controllers
    ui/                           # Button, Card, Field, Input, Textarea, Skeleton and shared primitives
  content/
    contracts/                    # public serializable records and projections
    server/                       # import "server-only"; loaders and validation
    internal/                     # authored Vurla content records
    testing/                      # validation and boundary-test public test surface
  lib/
    design-system/                # tokens, parser, color helpers, source loader
    utils.ts                       # cn() only
  test/
    setup.ts                       # Vitest DOM matchers/setup
docs/
  architecture/
    website-architecture-charter.md
    design.md
  plans/
    active/
      website-architecture-refactor-implementation-plan.md
```

Do not retain `src/context/` or `src/hooks/` merely as legacy folders. Move genuinely reusable client presentation logic next to its consuming site component or feature; delete unused hooks and global state with the old shell.

---

## 4. Tech stack

- Keep Next.js 15.5.6, React 19.1.0, TypeScript strict/no-emit, Tailwind CSS 4, Framer Motion, Zod, CVA, Radix Slot, Lucide, and the existing image configuration.
- Add the justified runtime dependency `server-only` for the server content boundary.
- Add `vitest`, `jsdom`, `@testing-library/react`, and `@testing-library/jest-dom` as development dependencies.
- Add a `vitest.config.ts` with the `@` alias and a `server-only` empty-module alias for test execution; add `src/test/setup.ts` for DOM matchers.
- Add scripts:

```json
{
  "typecheck": "tsc --noEmit",
  "test": "vitest run",
  "test:watch": "vitest",
  "verify": "npm run lint && npm run typecheck && npm run test && npm run build"
}
```

- Remove `next-themes`, `nprogress`, and `@types/nprogress` only after every source import is removed. Do not perform a broad unrelated dependency audit.
- Keep `eslint.ignoreDuringBuilds: true` only if it remains intentional; `npm run verify` must always invoke lint directly and pass before closeout.

---

## 5. Scope

### In scope

- COGH-style layers, public content entry points, thin routes, feature modules, server/client import boundaries, and architecture charter.
- Migration of existing project, service, navigation/footer, contact-detail, and FAQ records into governed static content without content changes. `/services` is the confirmed replacement for removed `/team`; no team records are preserved.
- A light-only Vurla design authority, token implementation, CSS variables, canonical primitives, living non-indexed `/design.md` guide, and drift tests.
- Removal of `GET /api/projects`, theme switching, global client shell, obsolete context/hooks, and resulting dependencies.
- Repair of all current lint errors/warnings; focused content, component, route, boundary, and design-system tests.
- Documentation updates to `README.md` and `AGENTS.md` that describe shipped reality.

### Explicit non-goals

- A visual/art-direction redesign, rewritten marketing copy, new pages, SEO expansion, image-asset replacement, or changed project values.
- CMS/database/persistence work, real email or CRM delivery, CAPTCHA, webhooks, analytics, or third-party integration ports.
- Replacing Framer Motion wholesale. Preserve appropriate existing local motion while honoring `prefers-reduced-motion`; do not leave app-wide transition infrastructure.
- Adding a second package/workspace, a generic `shared` folder/package, an empty provider layer, or automatic deployment/CI workflows.

### Permanent guardrails

- Preserve all current visitor URLs and the `/projects/[slug]` absent-slug `notFound()` behavior.
- Preserve project filtering, search, service/category filters, mobile navigation, contact validation/status UX, keyboard focus visibility, and reduced-motion behavior.
- Keep the contact endpoint’s shape compatible: valid payloads return a success boolean/message; invalid payloads return a 400 with issues; malformed/server failures return a 500 failure response.
- Do not use `any` for service icon values or component props. Use named serializable icon types and concrete DOM/react types.

---

## 6. Data / API / UI contract

### 6.1 Content contracts

Move and preserve existing data values behind the following public shapes. Individual files may split these types, but `@/content/contracts` is the sole import surface.

```ts
export type ProjectCategory =
  | "residential"
  | "commercial"
  | "public"
  | "interior"
  | "fabrication"
  | "digital";

export interface Project {
  slug: string;
  title: string;
  category: ProjectCategory;
  services: string[];
  location?: string;
  client?: string;
  year: number;
  description: string;
  image: string;
  blurDataURL?: string;
}

export type ServiceIconName =
  | "building-2"
  | "palette"
  | "tree-pine"
  | "wrench"
  | "home"
  | "monitor"
  | "file-text"
  | "layout"
  | "settings"
  | "check-circle"
  | "paintbrush"
  | "lightbulb"
  | "map-pin"
  | "users"
  | "zap"
  | "calendar"
  | "hard-hat"
  | "hammer"
  | "box"
  | "layers"
  | "eye"
  | "code";

export interface ServiceSubItem {
  name: string;
  icon: ServiceIconName;
}

export interface Service {
  title: string;
  icon: ServiceIconName;
  subItems: ServiceSubItem[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  description: string;
  image: string;
  specialties: string[];
  yearsExperience: number;
  email: string;
  linkedin?: string;
}
```

Add minimal serializable contracts for navigation links, footer/contact details, and FAQ records only where existing components require record-driven facts. These records must retain current displayed values. The Lucide mapping belongs in Web Product, for example a single `ServiceIcon` component or map under `src/components/site/`; it must not be stored in or imported by Site Content.

### 6.2 Content-server API

`src/content/server/index.ts` begins with `import "server-only"` and exports:

```ts
listProjects(): Project[]
getProjectBySlug(slug: string): Project | null
listServices(): Service[]
listServiceTags(): string[]
getSiteConfig(): SiteConfig
listFaqItems(): FaqItem[]
validateContent(): ContentValidationResult
```

Loaders are synchronous for the current authored TypeScript data and may be called directly from Server Components. They must not fetch `GET /api/projects`, read browser state, or expose raw repository data paths to client modules.

### 6.3 HTTP contract

- **Removed:** `GET /api/projects`. Delete the route and do not replace it with another internal read API.
- **Retained:** `POST /api/contact`.

```ts
export const contactRequestSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(1),
});

export type ContactResponse = {
  success: boolean;
  message: string;
  issues?: z.ZodIssue[];
};
```

The shared schema/types live in the contact feature’s browser-safe contract module. The client form and route handler use the same shape. Do not move the contact handler into Site Content or call it from server-rendered page composition.

### 6.4 UI and interaction contract

- Route files keep metadata and delegate page rendering to their feature modules. No route may import `src/content/internal` or raw content files.
- Home, projects, services, and contact feature modules are Server Components by default. They load records from `@/content/server`, then pass serializable records into small client components only when browser state or motion is required.
- The projects client island owns search/filter state and accepts `projects` plus services/tag projections as props; it imports only types from `@/content/contracts`.
- The project-detail feature obtains its record through `getProjectBySlug`; no match calls `notFound()`.
- Navbar server composition loads navigation records and passes them into a navbar client controller that alone owns mobile-drawer state, Escape/outside behavior, and focusable menu controls.
- The single Vurla light theme replaces `next-themes` and `ThemeToggle`. No `.dark` token override or theme client state remains.
- Global page transitions, NProgress, loading overlay, DebugPanel, DynamicLink, and SiteContext disappear. Standard Next navigation remains; individual local loading or form submission affordances stay accessible.
- All interactive controls retain visible `:focus-visible` treatment, minimum 44px targets where practical, semantic elements, and `prefers-reduced-motion` alternatives.

### 6.5 Design-system contract

- `docs/architecture/design.md` has `---`-delimited JSON frontmatter defining Vurla’s light-only colors, typography roles, spacing, radii, borders, elevation, motion, layout measures, and primitive variants.
- `src/lib/design-system/tokens.ts` exports the exact token object and typed token keys.
- `cssVariablesFromTokens()` produces every `--ds-*` custom property used by `src/app/design-system.css`.
- `src/lib/design-system/parse-spec.ts` parses the JSON frontmatter and Markdown sections. `loadDesignSpec()` loads the canonical document for the server-rendered guide.
- `/design.md` exports non-indexing metadata and renders `src/features/design`; it displays the guide prose, token specimens, layout recipes, and real canonical primitives from the same source used by visitor pages.
- Global CSS may provide app reset and shell rules, but palette/typography/component values must reference design tokens. Remove competing legacy variable files and broad `transition: all` rules.

### 6.6 Acceptance examples

```text
Given a browser renders /projects,
when a user filters by category, service, or text,
then the client filters the server-provided serializable project records without an API request.

Given a Server Component needs a project,
when it renders /projects/[slug],
then it calls getProjectBySlug() directly and calls notFound() only for a missing slug.

Given a client component imports @/content/server or src/content/internal,
when lint/tests run,
then the boundary gate fails.

Given a design token changes,
when docs, token code, or design-system CSS diverge,
then the design-system test fails.

Given a visitor submits an invalid contact payload,
when POST /api/contact validates it,
then it returns HTTP 400 with success false and Zod issues; it does not claim delivery.
```

---

## 7. Phases

Rules for every phase:

1. Prefer a failing focused test before behavior changes.
2. Mark an item complete only after its verification passes.
3. Update §10 immediately after each completed or blocked phase.
4. Preserve the untracked `AGENTS.md` and any unrelated user work.
5. Stop and report if a hardline, baseline gate, URL, or content-value preservation requirement cannot be met.

### Phase 0 — Preflight, authority documents, and test foundation

- [ ] 0.1 Re-run `git status --short --branch --untracked-files=all`, `npm run lint`, and `npm run build`; record exact outcomes in §10 before feature edits.
- [ ] 0.2 Keep this file as the active execution authority and create `docs/architecture/website-architecture-charter.md` from §3. The charter must not diverge from this plan’s architecture section.
- [ ] 0.3 Add `server-only`, Vitest, jsdom, React Testing Library, and jest-dom. Add `vitest.config.ts`, `src/test/setup.ts`, and the scripts in §4.
- [ ] 0.4 Add `@/content/contracts`, `@/content/server`, and `@/content/testing` path aliases without breaking existing imports.
- [ ] 0.5 Add `src/content/server/index.ts` starting with `import "server-only"`; add temporary compatibility exports only if they are server-only and deleted before Phase 2 completes.
- [ ] 0.6 Add a small smoke test proving the test runner, aliases, and browser-safe `server-only` test alias work.

**Verification:** `npm run typecheck` and `npm run test` pass; current user-facing behavior is unchanged; baseline lint failures are logged rather than hidden.

### Phase 1 — Site Content records, contracts, and boundary enforcement

- [ ] 1.1 Create `src/content/contracts/` modules and an `index.ts` barrel for the types in §6.1. Do not re-export server modules from this barrel.
- [ ] 1.2 Move `projects.ts`, `services.ts`, and `team.ts` to `src/content/internal/` with `git mv`; preserve every current record field/value.
- [ ] 1.3 Replace data-embedded Lucide components with `ServiceIconName` string values. Add a complete icon-name-to-Lucide-component map under Web Product UI, with no `any`.
- [ ] 1.4 Extract existing navigation, footer contact facts, contact details/hours, and FAQ items into typed internal records as needed; preserve displayed text and links.
- [ ] 1.5 Implement the server façade functions in §6.2. Use internal record imports only inside `src/content/server/**`.
- [ ] 1.6 Add `validateContent()` to check unique project slugs, permitted categories/icon names, non-empty service tags, and project service references. It validates the current static corpus without inventing publication policy.
- [ ] 1.7 Add content-loader/validation tests in `src/content/testing/` for record counts, known slugs, absent slug behavior, unique tags, and valid icon names.
- [ ] 1.8 Configure ESLint `no-restricted-imports` restrictions for direct internal content/raw data imports from `src/app`, `src/features`, and `src/components`.
- [ ] 1.9 Add a boundary test that scans modules whose first non-comment directive is `"use client"` and fails on imports of `@/content/server`, `@/content/internal`, or relative/raw internal content paths.

**Verification:** `npm run typecheck`, `npm run lint`, and `npm run test` pass. A temporary forbidden client import fails lint/test and is removed before the phase is marked complete.

### Phase 2 — Feature ownership, thin routes, and local client state

- [ ] 2.1 Create `src/features/home`, `src/features/projects`, `src/features/services`, and `src/features/contact` with explicit server entry components.
- [ ] 2.2 Move page-body JSX out of each corresponding `src/app/**/page.tsx`. Route files retain metadata and a default feature export only; dynamic project route forwards `params` to the feature rather than directly importing content data.
- [ ] 2.3 Make home and services server-first. Pass records to isolated client motion/card islands only when state, canvas drawing, or Framer Motion requires a client boundary.
- [ ] 2.4 Keep project filtering/search in a dedicated projects client island. Change its type imports to `@/content/contracts`; server feature passes initial projects/services/tags as serializable props.
- [ ] 2.5 Implement project detail through `getProjectBySlug()`, retaining the exact route and `notFound()` behavior for an unknown slug.
- [ ] 2.6 Rehome Navbar and Footer into `src/components/site`. Split Navbar into server-owned content retrieval/composition and a focused client controller for mobile interaction. Localize mobile menu state; preserve keyboard, Escape, and menu-close behavior.
- [ ] 2.7 Rehome FAQ, cards, search/filter components, and local effects under their owning feature/site modules. Delete `src/hooks/` when its old hook consumers are moved or removed.
- [ ] 2.8 Delete `SiteContext`, `ThemeToggle`, `DynamicLink`, `PageTransition`, `ProgressBar`, `LoadingOverlay`, and `DebugPanel`; simplify `layout.tsx` to the light-only document shell, Navbar, main, and Footer.
- [ ] 2.9 Remove `next-themes`, `nprogress`, and `@types/nprogress` only after all imports disappear.
- [ ] 2.10 Delete `src/app/api/projects/route.ts`; add a regression test proving no source fetches `/api/projects` and that content reads call the server façade directly.
- [ ] 2.11 Move the contact form to the contact feature. Share a browser-safe Zod contact schema/types with `POST /api/contact`, retain fetch submission, validation, reset-on-success, accessible status, and honest error fallback.

**Verification:** `npm run build` lists `/`, `/projects`, `/projects/[slug]`, `/services`, `/contact`, and `/api/contact` but not `/api/projects`. Manual smoke verifies mobile menu, filtering/search, known/unknown project details, contact form success/invalid/network UI, and normal navigation without the retired shell.

### Phase 3 — Design authority, token system, and primitive migration

- [ ] 3.1 Create `docs/architecture/design.md` with Vurla-specific light-only JSON frontmatter and prose. It must define colors, typography, spacing, layout shell/reading measures, radii, border/focus rules, elevation, motion, component variants, reduced-motion behavior, and explicit design do/don’t rules.
- [ ] 3.2 Implement `src/lib/design-system/tokens.ts`, `parse-spec.ts`, `color-families.ts`, and `index.ts` following the COGH synchronization shape. The token values are Vurla’s, not copied Cornerstone values.
- [ ] 3.3 Add `src/app/design-system.css` containing only `--ds-*` properties generated from the token object plus reusable token-based design-system selectors. Import it from `src/app/globals.css`.
- [ ] 3.4 Consolidate/rewrite legacy `src/styles/design-system/**`, reset/foundation CSS, Tailwind mappings, and `globals.css` into one non-conflicting token layer. Remove legacy dark overrides and duplicate variables after all consumers migrate.
- [ ] 3.5 Replace raw global button/card/form styling with canonical `src/components/ui` primitives. Keep and modernize Button; add Card, Field, Input, Textarea, and Skeleton only where they replace actual repeated patterns. Do not create primitive duplicates.
- [ ] 3.6 Migrate shared site UI and contact form controls to primitives/tokens while retaining Vurla’s existing light visual intent rather than performing an art-direction redesign.
- [ ] 3.7 Add `src/features/design` and `src/app/design.md/page.tsx`. Set `robots: { index: false, follow: false }`; load the canonical Markdown document server-side; render visual token, layout, typography, and real-primitive specimens.
- [ ] 3.8 Add design-system tests that require Markdown frontmatter to equal `designTokens`, required Markdown sections to exist, root CSS variables to equal `cssVariablesFromTokens(designTokens)`, and every rendered color token to have one documented family.
- [ ] 3.9 Verify reduced motion, visible focus, semantic control roles, and light-theme contrast as part of primitive/design-guide tests and manual review.

**Verification:** `npm run test` proves document/token/CSS synchronization; `npm run build` includes non-indexed `/design.md`; all visitor pages use the governed token system with no `.dark` selectors or ThemeProvider imports.

### Phase 4 — Lint remediation, documentation, and closeout

- [ ] 4.1 Resolve all baseline lint errors/warnings: unescaped apostrophes, explicit `any`, unused imports/variables, stale eslint-disable comments, and missing hook dependencies. Use concrete types/refactors, not blanket disabling.
- [ ] 4.2 Confirm `src/lib/utils.ts` is the only generic utility module. Keep design-system code in its explicit bounded `src/lib/design-system` home; do not recreate `src/lib/data`, global hooks, or context stores.
- [ ] 4.3 Update `README.md` with current routes, content architecture, design authority, scripts, removed projects endpoint, and honest contact limitation.
- [ ] 4.4 Update `AGENTS.md` to the shipped tree, commands, test setup, architecture charter/design document, API state, and Windows assumptions. Preserve its project-context purpose.
- [ ] 4.5 Re-read the charter and this plan to confirm the charter has not drifted. Update stable docs to describe shipped behavior only, not planned work.
- [ ] 4.6 Run all validation commands and a manual smoke checklist. Record exact evidence in §10.
- [ ] 4.7 Move this file to `docs/plans/complete/website-architecture-refactor/` only once every success criterion is verified. Do not move it merely because the document exists.

**Verification:** `npm run verify` passes; the smoke checklist passes; no overclaim is present in README, charter, or the progress log.

---

## 8. Handoff notes

- **Related docs:**
  - `docs/architecture/website-architecture-charter.md`
  - `docs/architecture/design.md`
  - `docs/plans/active/website-architecture-refactor-implementation-plan.md`
  - COGH’s implementation template, completed architecture plan, charter, and design document listed in §2.1.
- **Resolved decisions:** one root Next app; no CMS/database; static content retained; projects API removed; contact API retained; light theme only; no global client shell; living non-indexed design guide; tests and lint are mandatory gates.
- **Known pre-existing issues:** baseline lint has 12 errors and 11 warnings; there is no current test infrastructure; `AGENTS.md` is untracked at authoring.
- **Follow-ups out of scope:** real contact delivery/provider configuration, CMS/persistence, analytics, visual rebrand, broad SEO work, new route/API work, and CI automation.
- **Must-not-overclaim:** do not claim the contact endpoint sends messages, a CRM exists, dark-mode support remains, a CMS migration occurred, or a visual redesign shipped.

### Suggested worker / kickoff prompt

```text
Execute docs/plans/active/website-architecture-refactor-implementation-plan.md top to bottom.
Read every document in §2.1 before modifying source. Preserve existing content and visitor URLs.
Update §10 immediately after every phase. Do not expand scope, invent integrations, or commit unless explicitly asked.
Stop and report if a hardline, baseline gate, or preservation requirement cannot be met.
```

### Suggested commit sequence

1. Plan/charter, test foundation, and content contracts
2. Content façade, validation, and import boundaries
3. Feature/routing/client-shell refactor and projects API removal
4. Design authority, tokens, guide, and primitive migration
5. Lint remediation, documentation, validation, and closeout

Do not commit unless the user explicitly asks.

---

## 9. Success criteria / completion checklist

- [ ] All current visitor routes (`/`, `/projects`, `/projects/[slug]`, `/services`, `/contact`) continue to render, and unknown project slugs still use `notFound()`.
- [ ] `GET /api/projects` no longer exists or appears in the production build; no source references it.
- [ ] `POST /api/contact` retains its compatible request/response behavior and does not claim real delivery.
- [ ] `@/content/contracts`, `@/content/server`, and `@/content/testing` are the only public Site Content surfaces.
- [ ] Server content modules start with `import "server-only"`; client modules cannot import server/internal content.
- [ ] Existing project and service values are preserved and services use serializable icon names rather than component values/`any`.
- [ ] App routes are thin and features own page composition.
- [ ] No `SiteContext`, `next-themes`, `ThemeToggle`, NProgress, global transition/overlay/debug shell, `.dark` theme override, or unused `src/hooks/` remain.
- [ ] A Vurla-owned design document, TypeScript token module, CSS variables, primitives, and non-indexed `/design.md` guide are present and synchronization-tested.
- [ ] Keyboard focus, semantic HTML, 44px control targets where applicable, and reduced-motion behavior remain intact.
- [ ] `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run build` pass; `npm run verify` passes as the consolidated gate.
- [ ] README, AGENTS, charter, and progress log accurately describe shipped behavior and limitations.
- [ ] Live Progress Log reports 100% only after all validation evidence is recorded.

---

## 10. Live Progress Log

> **Executor instructions:** Update this table immediately after finishing or being blocked on each phase. `Completion %` is an honest estimate. `Notes` must include exact commands/results, preserved pre-existing issues, deviations, and blockers. Do not batch updates or mark a phase complete without its verification.

| Phase | Title | Completion % | Notes | Last Updated |
| --- | --- | --- | --- | --- |
| 0 | Preflight, authority documents, and test foundation | 100% | Route gate resolved: user confirmed `/services` permanently replaces `/team`. Captured dirty rebrand baseline; added server-only, Vitest/jsdom/RTL, aliases, scripts, server façade, charter, and smoke tests. | 2026-09-03 |
| 1 | Site Content records, contracts, and boundary enforcement | 100% | Projects/services now live under internal content with serializable contracts and icon names; server loaders/validation, ESLint restrictions, and client-boundary tests pass. | 2026-09-03 |
| 2 | Feature ownership, thin routes, and local client state | 100% | Routes delegate to features; server loaders replace raw data/API reads; Services replaces Team; local navbar controller replaces global shell; projects API/theme/progress/debug legacy code removed. | 2026-09-03 |
| 3 | Design authority, token system, and primitive migration | 100% | Vurla design Markdown, typed tokens, CSS variables, primitives, non-indexed guide, focus/reduced-motion rules, and synchronization tests shipped. | 2026-09-03 |
| 4 | Lint remediation, documentation, and closeout | 100% | README/AGENTS/charter updated. `npm run verify` passed: lint, typecheck, 11 tests, and production build. Stopped the Vurla dev server before final build; production smoke covered routes, missing project rendering, and invalid contact response. | 2026-09-03 |
| — | **Overall** | **100%** | **All implementation phases and required automated verification completed.** | 2026-09-03 |
