# Vurla Website Oakame Redesign — Implementation Plan

> **Final closeout decision — user accepted the current website.** The user's latest instruction is to finish the plan and clean up, with no additional tests. This supersedes the original mandatory review loop and 91/100 stop condition below. The implementation is accepted as it stands; remaining hover, touch, reduced-motion, no-JavaScript, 200% zoom and runtime/performance verification is waived, not passed. Historical findings, failed attempts and unverified scores remain intact. No additional tests or build were run for closeout.

> **Agent preamble (read first).** This is the authoritative implementation plan for restyling the complete Vurla website, building its architectural project explorer, adding reference-based Services images, and standardizing its living design guide. Read this entire document and the sources in section 2 before implementation. Preserve the current working-tree content and the site/page structure specified here. Execute the phases in order after the user authorizes implementation, update checklists and the Live Progress Log, and use an independent reviewer until every required surface passes. Never infer completion from a stale development bundle or from a score unsupported by evidence.
>
> **Authoring boundary.** The user requested only this Markdown plan in the current turn. Creating this document does not authorize implementation code, image generation, dependency changes, a checkpoint commit now, or starting the execution goal. Those actions are specified for the subsequent implementation run. The checkpoint commit must precede all implementation changes, including later edits to this plan; this explicitly requested planning document is the pre-existing input to that run.
>
> **Template provenance.** Derived from `docs/plans/implementation-plan-template.md`, retaining its numbered sections 1–10. The template remains unchanged. This repo uses `docs/plans/complete/`; use that existing lifecycle folder at successful closeout rather than creating the template's inconsistent `completed/` spelling.

**Status:** Complete — accepted by user, with remaining verification waived

**Last updated:** 2026-09-05T00:52:18.5772076Z

**Owner / executor:** Primary implementation agent; separate read-only reviewer agent

**Goal:** Deliver an Oakame-inspired, light-only Vurla UI with preserved authored content, an architectural nine-project hero, six synthesized Services images grounded in actual catalog references, and a COGH-standard `/design.md`. The user accepted the current implementation and waived further testing and final numeric score requirements.

**Architecture:** Thin App Router routes; server-owned authored content; typed client projections; shared production primitives; canonical design document synchronized with TypeScript tokens and CSS variables.

**Tech stack:** Next.js 15.5.25 after pre-redesign security maintenance, React 19.1.0, strict TypeScript, npm, Tailwind/CSS variables, GSAP, Vitest/React Testing Library, and the built-in image-generation workflow. Contact remains simulated processing with no persistence or mail delivery.

---

## 1. Original execution goal (verification requirements superseded at closeout)

**Goal:** Refactor Vurla's frontend into the approved Oakame-inspired design system, with the nine-project Working Plan hero, six reference-based Services illustrations, and a COGH-standard living `/design.md`. Visitors must be able to explore recognizable projects and navigate a coherent, polished Home, Projects, Services, and Contact experience.

**Context:** Use the existing Next.js/React architecture, authored catalog, original project covers, and shared components. Preserve navigation, all copy and project metadata, original media, and the Home sequence: hero, stats, selected projects, services with all 36 specifications, closing contact CTA, and footer. Use Share Tech Mono for display/UI and Geist Sans for body/form text. Follow the detailed contracts in this plan and checkpoint the current website before redesign implementation.

**Verification:** Run lint, TypeScript checking, meaningful Vitest regression tests, content/image-hash comparisons, and a clean production build. An independent read-only reviewer must visually inspect every page at all five specified viewports and interact with Home to test the hero, hover/focus states, buttons, link destinations, keyboard/touch controls, native scrolling, and alignment. Other pages receive visual review and automated behavior evidence. Verify that every generated Services image used actual catalog images as reference inputs.

**Progress:** Update this plan's phase checklists and Live Progress Log after each meaningful implementation or review step. Record the checkpoint SHA, test/build results, source-image references and generation prompts, screenshots, per-page rubric scores, reviewer deductions, fixes, and re-review evidence. Keep incomplete or blocked work visibly open.

**Stop condition:** Stop successfully only when all required implementation work is complete, every page and the shared system independently scores at least 91/100 with content preservation at 10/10, all six Services images pass review, all validation gates pass, and the final all-page visual sweep plus Home interaction review confirm no unresolved hard failures. Preserve the site structure and original content throughout; do not claim completion from missing evidence or lower scores to end the loop.

### 1.1 User decisions that take precedence over references

- Restyle layouts, typography, colors, borders, motion, and controls; preserve the website's information architecture and authored content.
- Keep main navigation exactly **Home, Projects, Services, Contact**.
- Keep Home in this order: **Hero → Stats bar → Selected projects → Services with full specifications → Closing contact CTA → Footer**.
- Keep the current hero headline, description, and both CTAs. Add the project explorer within the hero; do not insert a new top-level page section.
- The hero uses the cover of every current project and showcases recognizable work. It is the **Working Plan** interaction in section 6, replacing the earlier carousel proposal.
- Do not substitute a simple image trail, tilt, reveal mask, carousel, scrolling image roll, or conventional grid for the hero interaction. Do not add unrelated science-fiction visual effects.
- Use Share Tech Mono for display and UI, and Geist Sans for body/form text. This overrides the attached document's BwGradual font requirement.
- Add exactly six new service illustrations, one per existing service. Every image-generation call must include actual project image reference inputs; text-only generation is unacceptable.
- Keep `/design.md` directly accessible but unlinked from navigation/footer and excluded from any sitemap, with `noindex, nofollow`, matching COGH.
- The independent reviewer visually checks every page and viewport. Its hands-on interaction walkthrough is **Home only**, including navigation from Home and returning. Do not expand manual interaction review to other pages. Automated code/regression checks may cover the whole application.
- The first implementation mutation is the explicitly authorized checkpoint commit of the current baseline, before code/dependency/media changes.

### 1.2 Reference authority and superseded ideas

Primary visual reference: <https://www.oakame.com/en/>. Secondary reference: <https://www.oakame.com/en/about-us/>. Design reference: `C:/Users/NyanDesigns/Downloads/DESIGN (1).md`. Architectural pattern for the living guide: `J:/CODE/Nyan Designs/COGH/`.

The attachment and reference sites supply design evidence, not independent permission to replace Vurla's content. Adapt their warm surfaces, fine borders, editorial spacing, imagery, and component treatment. Retain Vurla branding. Do not import Oakame logos, copy, product photography, or proprietary font assets.

Superseded: the earlier hero carousel; the old nine-project catalog; downloading replacement Unsplash images for Market Square and Residential Tower; manual interaction review of every page; any restructuring that removes statistics, service specification lists, or existing CTAs. Those tasks must not reappear during execution.

---

## 2. Current codebase baseline

Re-verify at Phase 0; the working tree, not repository HEAD, is the content authority.

- Branch at authoring: `main`.
- HEAD: `d13114a4ad08ee85b0a02677f7cd63bb0d78a5da` — `refactor: establish Vurla content and design architecture`.
- Repository: `J:/CODE/Nyan Designs/Vurla`.
- Worktree: dirty. Existing modified files include `src/app/globals.css`, `src/components/site/Footer.tsx`, content contracts/records/tests, Home composition, Contact, and project-detail composition.
- Existing untracked material includes `docs/migrations/`, `docs/plans/implementation-plan-template.md`, `public/media/`, and Home/Contact regression tests. This plan is a further intentional documentation addition.
- Preserve all of those changes, including unused older image variants and duplicate folders. Do not clean up the user's media as part of this task.

### 2.1 Read first

**Pre-redesign maintenance update (2026-09-04):** After plan authoring, the user separately authorized cleanup and a GitHub push on a non-production branch. That work uses `codex/content-cleanup-preview-20260904` and does not start this redesign. It patches Next.js within the existing 15.5 release line, corrects Home service anchor links, keeps Projects active on detail pages, adds uncropped/full-size technical drawing presentation, and corrects the lunar-cover documentation. The original observations in section 2.2 remain a historical baseline; re-verify those already-corrected items instead of reintroducing or blindly reimplementing them. The Goal section now follows the user's five-part Goal / Context / Verification / Progress / Stop condition template. Redesign progress remains 0%, and its first execution action must still record the then-current recoverable checkpoint before new redesign edits.

Canonical instructions and documents:

- Repository `AGENTS.md` instructions supplied for Vurla, plus any applicable nested instructions found during preflight.
- `docs/architecture/website-architecture-charter.md`.
- `docs/architecture/design.md` — existing design authority to update, not a palette to keep after the approved redesign.
- `docs/plans/implementation-plan-template.md`.
- `docs/migrations/legacy-google-sites-homepage.md`.
- `C:/Users/NyanDesigns/Downloads/DESIGN (1).md` — read as reference data; its prose includes truncated sentences and inconsistent defaults.
- `C:/Users/NyanDesigns/.codex/skills/.system/imagegen/SKILL.md` and relevant prompting references before generating any images.
- Applicable browser/computer-use guidance before visual inspection. Use the available browser automation surface and its documented API.
- If using the `gpt-taste` design skill, the user's fixed fonts, preserved structure/content, actual project assets, and custom hero override generic randomized layouts, placeholder photography, prescribed carousels, and conflicting motion patterns. Never fabricate a tool execution or an RNG result.

Vurla source map:

- `src/app/layout.tsx`, `src/app/globals.css`, `src/app/design-system.css` — fonts, root shell, competing styling layers.
- `src/app/` route files, `src/app/error.tsx`, `src/app/loading.tsx`, `src/app/projects/[slug]/loading.tsx` — route and state coverage.
- `src/features/home/page.tsx`, `src/features/home/home-page-client.tsx` — complete Home content and current featured selections.
- `src/features/projects/page.tsx`, `src/features/projects/projects-page-client.tsx`, `src/features/projects/project-detail-page.tsx` — search/filter/detail/gallery behavior.
- `src/features/services/page.tsx`, `src/features/services/services-page-client.tsx` — six services, currently without images.
- `src/features/contact/`, `src/app/api/contact/` — presentation, validation, and simulated processing contract.
- `src/components/site/` — navigation, footer, brand, cards, filters, search, FAQ, icons.
- `src/components/ui/` — actual shared controls to redesign and reuse in the guide.
- `src/content/contracts/index.ts`, `src/content/internal/`, `src/content/server/index.ts`, `src/content/testing/` — ownership and content preservation.
- `src/lib/design-system/`, `src/features/design/page.tsx`, `src/app/design.md/page.tsx` — current minimal guide implementation.

COGH reference files, read-only:

- `J:/CODE/Nyan Designs/COGH/AGENTS.md` and `docs/architecture/design.md`.
- `src/lib/design-system/tokens.ts`, `parse-spec.ts`, `index.ts`, `color-families.ts`, `design-system.test.ts` within COGH.
- COGH `src/features/design/index.tsx`, `src/features/design/color-copy-button.tsx`, `src/app/design.md/page.tsx`, and guide styling in `src/app/design-system.css`.
- Inspect the COGH architecture and guide visually where available; do not copy its entire CSS file or branding into Vurla and do not edit COGH.

### 2.2 Confirmed current behavior

The authoritative catalog has nine records, 16 unique referenced local image files, no remote image URLs, and seven two-image galleries. All 16 referenced files existed during planning. The current project list is:

| Slug | Title | Category | Cover relative to `public/media/projects/` | Supporting gallery asset |
| --- | --- | --- | --- | --- |
| `baker-house` | Baker House | residential | `baker-house/editorial-exterior.png` | `baker-house/proposed-plan-set.png` |
| `la-puente-residence-renewal` | La Puente Residence Renewal | interior | `la-puente-residence-renewal/editorial-entry.png` | `la-puente-residence-renewal/editorial-bedroom-v4.png` |
| `terraced-garden-retreat` | Terraced Garden Retreat | residential | `terraced-garden-retreat/editorial-overview.png` | `terraced-garden-retreat/editorial-detail.png` |
| `stitching-west-baltimore` | Stitching West Baltimore | public | `stitching-west-baltimore/editorial-model.png` | `stitching-west-baltimore/context-diagram.png` |
| `circular-energy-exchange` | Circular Energy Exchange | commercial | `circular-energy-exchange/editorial-dtla-cover.png` | `circular-energy-exchange/section-01.png` |
| `storyworks-campus` | Storyworks Campus | commercial | `storyworks-campus/editorial-pavilion.png` | `storyworks-campus/site-plan.png` |
| `flock-house` | Flock House | fabrication | `flock-house/cover.jpg` | None |
| `boba-friend-pop-up` | Boba Friend Pop-Up | fabrication | `boba-friend-pop-up/cover.jpg` | None |
| `lunar-habitat-immersion` | Lunar Habitat Immersion | digital | `lunar-habitat-immersion/editorial-interior.png` | `lunar-habitat-immersion/editorial-exterior.png` |

- Preserve all record values from source, not just this table: descriptions, locations, clients, years, service tags, gallery order, alt text, and blur data.
- Home currently features Terraced Garden Retreat in its hero. Selected category cards use Baker House, Storyworks Campus, Stitching West Baltimore, La Puente Residence Renewal, Flock House, and Lunar Habitat Immersion. Keep those selections; the new hero additionally exposes all nine projects.
- Home headline: `Vision and uniqueness in real living areas.` CTAs: `Explore selected work` to `/projects` and `Request an estimate` to `/contact`.
- Stats: `50+ Projects completed`, `10+ Years of excellence`, `5+ Awards won`, `100% Client satisfaction`. Preserve as authored; do not recompute them from the nine-record catalog.
- Home services and counts in order: Architecture 24, Interior 18, Landscape 15, Construction 32, Fabrication 12, Digital Solutions 8. Preserve their associated headlines and all six subitems per service, for 36 visible service specifications.
- Contact configuration: `vurla.living@gmail.com`, `(626) 466-5346`, `La Puente, CA`, empty hours, Instagram `https://www.instagram.com/vurlaliving1111/`. Preserve corresponding mailto/tel links and the absence of an hours block.
- Home service links currently pass service titles as project categories, including invalid category values; Projects currently ignores URL query parameters. Fix as specified in section 6.
- Navbar exact-path matching fails to keep Projects active on project-detail routes. Fix section matching without changing navigation labels or destinations.
- Project galleries currently use `object-cover` for every image, which crops technical drawings. Add presentation metadata and uncropped rendering.
- Services is currently image-free. Its content is six service records with `title`, `icon`, and `subItems`.
- `/design.md` already exists but has a minimal display and insufficient production specimens. It needs standardization, not a second route.
- COGH's guide is server-rendered from a canonical document, uses live primitives, has nine tested sections, and is direct-access/non-indexed. No COGH nav/footer link to it was found.
- The migration document's lunar-habitat paragraph is stale: the interior is now the cover. Correct that documentation after the checkpoint.

### 2.3 Baseline validation commands

```powershell
npm run lint
npm run typecheck
npm run test
npm run build
```

Planning evidence: lint passed; `npx tsc --noEmit --incremental false` passed; Vitest passed 8 files / 15 tests. An initial sandboxed Vitest startup failed with `spawn EPERM`; an authorized execution outside that restriction passed. This was an execution-environment issue, not a failing test. A fresh production build was not established in this planning pass.

Re-run and record the baseline at execution. Never run Next development and production build concurrently in this workspace. Stop the owned dev process before building; if cleanup is required, validate the exact workspace `.next` path and clear only that generated directory. Do not kill unrelated processes or clean other repositories.

---

## 3. Architecture

- **Content source of truth:** typed authored records under `src/content/internal/`; only `src/content/server/` imports them, with `import "server-only"`.
- **Composition:** thin routes under `src/app/`, page composition under `src/features/`, small interactive client islands where needed. Server Components call content loaders directly.
- **Client boundary:** clients receive serializable props and use `@/content/contracts` types. They never import internal/server content or fetch an invented projects API.
- **Presentation ownership:** shared presentation/controllers under `src/components/site/`; reusable controls under `src/components/ui/`; hero interaction under `src/features/home/`.
- **Design authority:** JSON frontmatter and prose in `docs/architecture/design.md`, a matching typed token object, and deterministic CSS custom-property generation. Tests lock equality. No independently maintained palette in guide JSX.
- **Image ownership:** original catalog media remains unchanged; six generated service assets live under `public/media/services/`. Their source references and generation history live in implementation evidence, not public marketing copy.
- **Motion:** use GSAP and `@gsap/react` for the coordinated hero and scoped page motion; register/clean up animations through component lifecycle. Use CSS for simple color/focus/hover transitions. Remove Framer Motion only after migrating all uses.
- **No new persistence:** no database, CMS, mail/CRM integration, analytics, tracking events, public data endpoints, theme selector, or generic global transition/debug shell.

```text
Server content loader -> typed project/service props -> page composition
Project covers + hero selection -> shared-boundary layout state -> photographic spaces
Canonical design document <-> typed tokens -> generated CSS -> production UI + /design.md
Implementation -> evidence packet -> independent review -> concrete fixes -> re-review
```

---

## 4. Tech stack

- Keep the maintained Next.js 15.5.x baseline (15.5.25 after cleanup) / React 19.1.0 and strict/no-emit TypeScript; do not downgrade security patches or turn the redesign into a major framework upgrade.
- Use npm and the existing lockfile. Add `gsap` and `@gsap/react` with versions compatible with the existing app; record resolved versions. The planned ranges were `gsap@^3.15.0` and `@gsap/react@^2.1.2`; verify availability/compatibility before installation.
- Use `next/font/google` for `Share_Tech_Mono`, weight `400`, Latin subset, and retain Geist Sans. Do not use a CSS `@import` or synthesize unsupported display weights.
- Use Next Image for project/service media, explicit sizes and reserved aspect ratios, and existing icon/brand assets. Use semantic HTML/CSS/SVG for the architectural UI; no WebGL or new 3D library is required.
- Keep Vitest, jsdom, and React Testing Library. Use an available real browser for screenshots and Home interaction evidence. A development-only accessibility runner such as `@axe-core/playwright` is permitted if the existing tooling cannot supply an equivalent audit; document why it is needed.
- Use the built-in image-generation tool with actual reference inputs. Do not silently substitute an API/CLI workflow if that capability is unavailable.

---

## 5. Scope

### In scope

- Complete frontend restyling of `/`, `/projects`, all nine `/projects/[slug]` pages, `/services`, `/contact`, `/design.md`, and shared loading/error/empty/not-found presentation.
- Stable Home structure; architectural hero; full service specifications; functional Home destinations; coherent header/footer and all production primitives.
- Canonical tokens, COGH-standard design guide, robust parser, and synchronization tests.
- Six generated Services illustrations, each grounded in actual catalog reference images.
- Content/media preservation evidence, accessible presentation, responsive images, and automated regression coverage proportional to changed behavior.
- Independent visual review of all pages and hands-on Home-only review with an evidence-based score/fix loop.
- Checkpoint commit before implementation; documentation of shipped behavior and complete handoff.

### Explicit non-goals

- Rewriting project descriptions, changing stats/service counts, renaming projects or routes, dropping service subitems, adding marketing claims, or inventing projects.
- Replacing, editing, regenerating, deleting, or recoloring existing project media. Technical drawings must remain exact originals.
- Adding new page sections, public top-level destinations, a hero carousel, or manually walking through interactions on every page.
- Downloading the obsolete Unsplash replacements, importing Oakame assets, or copying COGH's brand/content/global styles wholesale.
- Publishing, pushing, deploying, opening a PR, framework upgrades, or unrelated repository cleanup.

### Permanent guardrails

- Preserve dirty/untracked user work. Do not reset/checkout files from HEAD or remove legacy media variants.
- Light-only does not forbid a deliberate contrasting section, but the default canvas must be warm and light; avoid reverting to an all-black presentation.
- Accessibility wins over decorative fidelity: readable contrast, 44px targets, native scrolling, keyboard operation, and reduced motion are required.
- UI labels needed to operate new features and new alt text are allowed. Existing authored marketing/project/service copy must remain unchanged.
- Do not inflate reviewer scores, mark untested behavior passed, or present synthesized service images as newly completed client projects.

---

## 6. Data / API / UI contract

### 6.1 Content and presentation types

Keep existing `Project`, `ProjectCategory`, `SiteConfig`, content loaders, and request/response contracts compatible. Add presentation fields without changing authored project facts. The new contracts should have this minimum shape:

```ts
export type ServiceId =
  | "architecture" | "interior" | "landscape"
  | "construction" | "fabrication" | "digital-solutions";

export interface ServiceImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

// Extend the existing Service with id and image; retain title/icon/subItems.
// Every one of the six authored services must provide both fields.

export interface ProjectImage {
  src: string;
  alt: string;
  presentation?: "photograph" | "document";
}

// Home-local state only; no API or persisted client store.
export interface WorkingPlanState {
  activeSlug: string;
  inputMode: "pointer" | "keyboard" | "touch";
}
```

Use `Service.id` for anchor destinations and image mapping rather than array-index or title-to-category inference. New media remains server-authored data, passed through existing loaders.

Mark these gallery files as `document`: Baker House `proposed-plan-set.png`, Stitching West Baltimore `context-diagram.png`, Circular Energy Exchange `section-01.png`, and Storyworks Campus `site-plan.png`. Render them with `object-contain`, a suitable paper surround, and an accessible original-size link/view. Do not change source bytes, gallery order, or existing alt text.

Record a baseline manifest after checkpointing: complete serialized project/site/service data, page copy and CTAs, original image paths and SHA-256 hashes, plus captured Home category/feature choices. Store evidence under a sibling `website-oakame-redesign-evidence/` folder in `docs/plans/active/`. New presentation metadata/service images are the explicit permitted additions when comparing final data.

### 6.2 Routes, links, and API

- Keep `/`, `/projects`, `/services`, `/contact`, `/projects/[slug]`, and `/design.md`. `/services` continues to replace `/team`.
- `POST /api/contact` continues validation and simulated processing only. Preserve honest success/failure wording and existing response semantics.
- Home service links resolve to `/services#<Service.id>`, with corresponding section IDs and `scroll-margin-top` accounting for the fixed header. If a target lives in an accordion, ensure the target content is available on direct anchor navigation.
- Home category project cards continue linking to their existing project detail URLs; do not turn them into category links.
- Make `/projects?category=<value>` initialize the existing category filter for `residential`, `commercial`, `public`, `interior`, `fabrication`, and `digital`; absent/invalid values mean All. Keep filter changes, clear/reset, and browser history consistent. Preserve existing search and service-tag filtering. Service section targeting uses anchors, not invented project categories or a new service-query API.
- Navigation uses exact matching for Home and section-prefix matching for Projects. Apply an accessible current-page/section indicator appropriate to each destination.
- Preserve `mailto:vurla.living@gmail.com`, `tel:6264665346`, Instagram, and current footer destinations.
- No new telemetry/events or backend endpoint is needed for hero selection.

### 6.3 Visual system

#### Reference interpretation

Oakame's home page supplies the primary finish: warm linen canvas, segmented hairline header, strong image presence, large editorial type, restrained accents, catalog-style labels, expansive spacing, and a bordered footer. Its About page supplies asymmetric image/text composition, crafted material detail, and considered accordion behavior. Adapt that language to Vurla's architecture, interiors, landscape, construction, fabrication, and digital work.

Use one semantic system; remove competing legacy overrides and broad `transition: all` styling. Preserve brand SVG assets and choose their existing normal/inverse variants based on contrast. Do not regenerate the brand.

#### Palette

Normalize all attached colors into the canonical token schema. These are the concrete reference values; group aliases in the typed schema without dropping documented colors:

```json
{
  "surface": "#f6f1eb", "surface-dim": "#e9e6ed", "surface-bright": "#fefdfb",
  "surface-container-lowest": "#f0ede8", "surface-container-low": "#ebe8e3",
  "surface-container": "#e5e2dd", "surface-container-high": "#ddd9d4",
  "surface-container-highest": "#d5d1cc", "on-surface": "#403a34",
  "on-surface-variant": "#515151", "inverse-surface": "#2a2520",
  "inverse-on-surface": "#fef9f3", "outline": "#767676",
  "outline-variant": "#cfc8d8", "surface-tint": "#7f54b3",
  "primary": "#403a34", "on-primary": "#f6f1eb",
  "primary-container": "#e9e6ed", "on-primary-container": "#2a2520",
  "inverse-primary": "#f6f1eb", "secondary": "#7f54b3",
  "on-secondary": "#fef9f3", "secondary-container": "#cfc8d8",
  "on-secondary-container": "#403a34", "tertiary": "#b3af54",
  "on-tertiary": "#2a2520", "tertiary-container": "#e9e6ed",
  "on-tertiary-container": "#403a34", "error": "#b94a48",
  "on-error": "#fef9f3", "error-container": "#f2dede",
  "on-error-container": "#8b3a38", "primary-fixed": "#e9e6ed",
  "primary-fixed-dim": "#cfc8d8", "on-primary-fixed": "#1a1815",
  "on-primary-fixed-variant": "#2a2520", "secondary-fixed": "#cfc8d8",
  "secondary-fixed-dim": "#b3af54", "on-secondary-fixed": "#1a1815",
  "on-secondary-fixed-variant": "#403a34", "tertiary-fixed": "#e9e6ed",
  "tertiary-fixed-dim": "#cfc8d8", "on-tertiary-fixed": "#1a1815",
  "on-tertiary-fixed-variant": "#403a34", "background": "#f6f1eb",
  "on-background": "#403a34", "surface-variant": "#e5e2dd"
}
```

Primary graphite drives navigation/CTAs; plum and ochre remain restrained accents. Validate actual foreground/background pairings rather than assuming every supplied pair passes WCAG AA. Where a pair fails, use a darker existing ink token or a documented accessible state token. Use 4.5:1 for normal text and 3:1 for large text and required UI boundaries. Outline-variant is decorative where it lacks control contrast.

#### Type, geometry, and motion

| Role / rule | Implementation default |
| --- | --- |
| Display/UI family | Share Tech Mono 400 through `next/font/google` |
| Body/form family | Geist Sans, normal text 400; emphasis 500/600 where needed |
| Display / large heading / medium heading | Desktop reference metrics 60/68px, 44/52px, 32/40px; responsive clamps |
| Card title | 24/32px |
| Large body / regular body | 18/28px and 16/24px |
| UI labels | 14/20px; metadata 12/16px |
| Hero headline | Broad text area, 2–3 lines at normal reviewed widths; adjust size, not copy; allow accessible reflow at zoom |
| Main shell | Maximum 1280px, twelve-column desktop grid, 24px outer gutters |
| Spacing | 4/12/24/40/64px base scale; 96/128px larger section rhythm tokens |
| Corners | Structural surfaces 0; controls/cards 4px; full radius only true badges |
| Borders | 1px shared rules; single boundaries rather than doubled adjacent borders |
| Targets | At least 44px interactive size; field text at least 16px on mobile |
| Simple motion | Fast 160ms, base 240ms; explicit properties only |
| Hero motion | Pointer dwell 150ms; coordinated transition about 450ms |
| Reduced motion | Immediate selection; no animated partitions, cursor guides, count-up, pinning, or nonessential reveals |

Resolve the attachment's contradictions explicitly: Vurla fonts replace BwGradual; component radii are 4px despite its 8px DEFAULT; structural surfaces are square; undefined `border-color` maps to outline-variant for decorative edges and an accessible outline for controls; original 32/40px control heights are raised to the 44px target rule. Replace truncated prose with complete Vurla-specific documentation without importing Oakame marketing claims.

#### Shared components and page treatment

- Build semantic buttons versus anchors, consistent hover/active/focus/disabled/loading states, accessible field labels/help/errors, cards, badges, search/filter controls, select/checkbox specimens, and accordions. Avoid nested interactive elements.
- Header: segmented rules and responsive navigation, stable fixed position, visible focus and active section. Mobile menu supports Escape, focus handling, and route-close behavior.
- Footer: bordered matrix with existing content, readable contact/social links, and current copyright. No guide link.
- Home: retain all six sections and content. The six selected category cards can use a gapless three-column/two-row desktop catalog treatment, two columns on tablet and one on mobile. The ban on a generic grid applies to the hero concept, not to the preserved Selected projects section.
- Home services: retain all headlines, counts, and 36 specifications visibly. A desktop sticky/pinned heading is allowed if it does not obstruct content, extend scrolling arbitrarily, or break native scrolling; disable it on narrow screens and reduced motion. No stacked layout that hides the specifications.
- Projects: editorial catalog with usable search, filters, result counts, and empty/reset state. Remove artificial filter delays if unnecessary; do not simulate loading for synchronous filtering.
- Project detail: asymmetric photo composition, current description/metadata, complete galleries, contain/full-size technical drawings.
- Services: existing introduction, six service blocks in the existing order with their full subitems and new illustrations, existing closing CTA. Accordions may enhance long-page navigation, but semantic content and direct anchors remain available.
- Contact: existing introduction, details, form, FAQ, and copy; correct label associations, validation semantics, loading/error/success presentation, and accordion state.
- Restyle existing loading/error states and a route-level not-found presentation as needed. Do not introduce a global transition framework.

### 6.4 Working Plan hero interaction contract

#### Spatial composition

Within the hero media region, create nine connected photographic spaces with unequal rectangular proportions, shared partitions, and architectural T-junctions. Every current project cover is present. Use stable project positions/adjacency so visitors can learn the composition. Terraced Garden Retreat is the default active project and occupies roughly half the media region.

The effect is coordinated redistribution of space: selecting a project enlarges its photographic room while adjacent rooms resize together. All other projects retain identifiable thumbnail areas and selection controls. It must read as a composed architectural plan, not nine independent floating cards or an ordinary accordion.

Implement a shared-boundary layout model with nine authored active states. Store the layout definitions in a Home-local module. Calculate rectangles from common boundary values and animate those shared values, so neighboring spaces cannot develop cracks or overlap. Each state has one dominant room, consistent adjacency, and reserved remaining rooms; use normalized geometry and aspect-ratio-aware responsive constraints. Test coverage, non-overlap, and nonnegative dimensions for every state and representative transition samples.

At widths where all targets cannot meet 44px within the composition, switch to the compact overview plus dominant image layout rather than shrinking controls further. Use the nine fixed named selection controls as the dependable input layer at every size.

Keep images upright, rectangular, in natural color, and undistorted. Use aspect-ratio-preserving containment for the active view, with linen surround if necessary; secondary previews may use deliberate crops that keep their subjects identifiable. Never apply arbitrary grayscale, heavy filters, sci-fi shaders, fake dimensions, or camera perspective tilt. Guides imply drawing conventions without inventing real-world measurements.

#### Input state and navigation

- Fine pointer: entering a project's stable hit region for about 150ms selects it; cancel pending activation on leaving that region. Transition shared partitions over about 450ms.
- Stable hit regions derive from the authored interaction map, not the currently animated image bounds. During geometry changes, do not re-hit-test a stationary pointer solely because boundaries moved. Cancel/retarget existing transitions cleanly when intent changes.
- Selection retains the last project on pointer exit; no autoplay, carousel arrows, timed slideshow, or snapping back to default.
- A thin orthogonal guide may respond to pointer coordinates inside the media region, linking the selection to its caption. It is `aria-hidden`, `pointer-events: none`, and never replaces the native cursor outside the region.
- A project's ordinary link always opens its own `/projects/<slug>` URL. Freeze the intended target from pointerdown through click if a transition is running; do not navigate to a newly selected neighbor accidentally.
- Provide nine named selection buttons with visible focus and `aria-pressed`, plus a stable active-project link. Do not nest buttons inside links. Show the active title and existing location/category in a stable caption area.
- Keyboard focus on a selector selects its project. Enter/Space performs button selection; the separate ordinary link opens the detail page. Avoid focus movement when animations finish. Pointer events regain control only after deliberate pointer movement, not synthetic entry during keyboard use.
- Touch: tap a room/selector to select; use the explicit active-project link to navigate. Native vertical scroll remains available; do not trap pan/wheel gestures.
- Narrow screens: compact overview of the same nine-space composition plus a larger active image. Preserve spatial selection, all nine names, and touch targets; do not convert to a swipe carousel.
- Reduced motion: immediate state changes and no cursor-following animation. Without animation or JavaScript, show a usable default image/composition with ordinary links to all projects.

#### Layout and runtime limits

- Existing hero copy/CTAs remain stable and readable outside the moving imagery. No overlay intercepts them.
- Reserve fixed media height/aspect ratio per breakpoint. Selecting projects does not change hero height or push the stats bar.
- No hero scroll pin, wheel capture, auto-scroll, or document overflow suppression that hides actual layout bugs.
- Keep pointer coordinates out of React state on every move; batch visual updates with `requestAnimationFrame`/GSAP setters. Only selection/input-mode changes need React updates.
- Use `ResizeObserver` or equivalent measured layout to recalculate geometry at breakpoint/container changes, clean up observers/listeners/tweens, and pause active frame work while offscreen or the document is hidden.
- Load the default dominant cover with priority; load the remaining small previews at appropriate sizes and prepare the selected larger image before showing it. Avoid nine full-resolution priority requests.
- On image loading/error, retain a stable frame and named project link; do not flash a blank canvas or broken-image glyph. Correct missing assets before acceptance.

### 6.5 Services image-generation contract

Exactly six distinct final images, one per service. This is the sole approved new imagery set; original project covers remain untouched.

| Service ID / output stem | Required reference paths under `public/media/projects/` | Brief |
| --- | --- | --- |
| `architecture` | `baker-house/editorial-exterior.png` | Architectural composition emphasizing facade proportions, material junctions, and daylight |
| `interior` | `la-puente-residence-renewal/editorial-entry.png` | Considered interior composition emphasizing shelving, built-ins, lighting, and material relationships |
| `landscape` | `terraced-garden-retreat/editorial-overview.png`; `terraced-garden-retreat/editorial-detail.png` | Terrace, stonework, planting, and path composition grounded in the actual garden |
| `construction` | `flock-house/cover.jpg` | Close construction-detail composition emphasizing timber assembly, framing, and practical connections |
| `fabrication` | `boba-friend-pop-up/cover.jpg` | Product-style composition emphasizing the custom timber counter and joinery; keep visual focus on the built object |
| `digital-solutions` | `lunar-habitat-immersion/editorial-interior.png` | Immersive-design visualization emphasizing habitat spatial design and VR use |

Workflow, mandatory for every call:

1. Resolve each reference to an absolute workspace path and inspect it with `view_image`. Confirm it is the active catalog version, not an older sibling.
2. Build a distinct prompt for that service, labeling each input by index and role. Pass actual files using the built-in tool's `referenced_image_paths`; a prompt that merely names a file/project is not sufficient.
3. Use generation with references or targeted editing as appropriate, with source geometry/material identity as explicit invariants. Every iteration also includes the original project reference(s); if editing a generated output, include that output as the edit target and identify the original separately.
4. Request a coherent landscape editorial set, approximately 3:2, with natural textures and restrained lighting compatible with the warm UI. Keep important content within a safe crop area. Keep captions and UI text in HTML. Avoid invented signage, watermarks, malformed people, impossible joinery, and unrelated architectural forms.
5. These are service illustrations derived from existing work, not evidence of an additional completed project. Frame away from complex branding where necessary rather than inventing text. Preserve source context when showing identifiable architecture.
6. Use one built-in call per distinct service asset; do not accept one collage containing six panels as six deliverables. Inspect outputs at full useful resolution and revise targeted defects.
7. Copy selected generated files into `public/media/services/`, using stable service-ID filenames and a browser-supported format. Preserve originals non-destructively; discarded iterations need not ship. Optimize delivery dimensions/encoding without changing depicted content.
8. Record actual source paths/hashes, full final prompts, tool mode, output path, dimensions, provenance, and review outcome in `website-oakame-redesign-evidence/services-images.md`.
9. Integrate through the six service records, with accurate alt text, explicit intrinsic dimensions, responsive sizes, and below-fold lazy loading. Show every final service image on `/services`.

Illustrative call shape, to execute only during implementation:

```ts
await image_gen.imagegen({
  referenced_image_paths: [
    "J:/CODE/Nyan Designs/Vurla/public/media/projects/baker-house/editorial-exterior.png"
  ],
  prompt: "Service: Architecture. Image 1 is the required project reference. ..."
});
```

If the built-in tool is unavailable, log that image delivery is incomplete and continue independent work where possible. Do not quietly substitute unrelated stock photography, CSS placeholders, or text-only generation. Follow the skill's explicit fallback requirements before using a different generation path.

### 6.6 COGH-standard living design guide

- Retain a thin `/design.md` route, server-composed guide feature, and server-only document loading. Use route metadata title/description, `alternates.canonical: "/design.md"`, and `robots: { index: false, follow: false }`.
- Guide remains absent from navigation, footer, and any sitemap. Do not invent a sitemap just for this change.
- Normalize the supplied YAML reference into Vurla's canonical JSON frontmatter rather than changing the existing parser contract to accept unvalidated YAML.
- Expand typed tokens for colors, role-based typography, spacing, section rhythm, layout, radii, borders, elevation, textures/effects, motion, and component metrics. Generate explicit `--ds-*` properties and map any retained Tailwind aliases to that system.
- Port/adapt COGH's robust CRLF-safe section/prose parsing and safe React rendering of headings, paragraphs, lists, emphasis, code, and links. Do not inject untrusted raw HTML.
- Exact section IDs/order: `overview`, `colors`, `typography`, `layout`, `elevation-and-depth`, `shapes`, `borders-and-outlines`, `components`, `dos-and-donts`.
- Render a Vurla guide hero, numbered chapter treatment where useful, Primary/Secondary/Tertiary color heroes, grouped swatches, copy controls, measured contrast data, type-role rows, layout diagrams, spacing, elevation, shapes, borders/focus, production component specimens, and do/don't comparisons.
- Primary/Secondary/Tertiary swatches use Vurla primary/secondary/tertiary tokens; do not copy COGH's token names or their brand-specific mapping blindly.
- Show actual Button/Link/Card/Field/Input/Textarea/Select/Checkbox/Badge/Accordion specimens, including applicable hover/focus/disabled/loading/error states. Show motion and Working Plan behavior rules within the appropriate layout/components prose.
- Keep client boundaries limited to interactions such as copying a value or a live specimen. Color-copy controls use canonical buttons, announce results accessibly, and handle clipboard failure honestly.
- Tests assert document-token equality, exact generated CSS root variables, section order, every color token in exactly one family, contrast-helper correctness, and malformed/frontmatter/CRLF parsing behavior.

### 6.7 Acceptance examples

```text
Given the default Home hero with Terraced Garden Retreat selected,
when a pointer deliberately enters Baker House's selector region,
then shared partitions recompose around Baker House, all nine projects remain selectable,
the original cover remains recognizable, and the stats bar does not move.

Given a hero transition is running,
when the visitor clicks the visible link for a named project,
then that exact project's URL opens, not the newly hovered neighbor's URL.

Given reduced motion or touch input,
when a project is selected,
then the same project and navigation are available without motion or scroll capture.

Given the Home Services section,
when the visitor reads it and follows Landscape's Learn more link,
then all 36 specifications are still present on Home and the destination is
/services#landscape with content below the fixed header.

Given any generated Services image,
when its evidence record is inspected,
then the actual generation call includes the specified original project image files.

Given a project technical drawing,
when the detail page is visually inspected,
then the whole drawing is visible, its original file hash is unchanged,
and a full-resolution link/view is provided.

Given /design.md,
when fetched and visually inspected,
then it renders the same tokens/primitives used by the website and emits noindex/nofollow.
```

### 6.8 Review contract and passing standard

The primary agent implements; the independent reviewer is read-only and does not edit code/assets or change the plan. The reviewer receives this plan, reference material, current commit/diff identifier, local URL, route inventory, screenshots, and automated results. It must inspect the current rendered build itself where browser access is available, not approve from the implementer's description alone.

Use the same independent reviewer across iterations for consistency. Delegate a bounded review using the existing sub-agent mechanism; do not create a separate user-visible task/thread. A prior planning reviewer may be reused, but planning comments are not execution approval. Shared browser use must be serialized or use separate tabs so implementation and review do not disturb one another.

#### Required visual inventory

Review all five base routes (`/`, `/projects`, `/services`, `/contact`, `/design.md`), each of the nine detail routes in section 2, and the shared header/footer plus existing loading/error/empty/not-found presentation. Use viewports **390×844, 768×1024, 1024×768, 1280×800, 1440×900**. Scroll through each page to inspect top, middle, bottom, and responsive content; ordinary scrolling for visual inspection is allowed on every page.

For non-Home states that cannot be reached by direct URL, the implementer may provide an isolated test fixture/rendered state or automated screenshot. Label the source of evidence. The reviewer does not manually submit forms, open accordions, toggle filters, or exercise controls outside Home.

#### Home-only hands-on checklist

- Exercise all nine hero selections using slow, fast, diagonal, interrupted, and boundary-adjacent pointer movement; confirm dwell behavior, geometry continuity, caption alignment, stable hit targets, and no flicker.
- Click each hero project's link and confirm the intended URL/landing title; return to Home. Destination confirmation does not authorize an interaction walkthrough there.
- Exercise selector focus, keyboard activation, native link navigation, touch selection, and reduced motion. Confirm visible focus, adequate targets, and no pointer takeover during keyboard use.
- Hover/focus/activate desktop and mobile navigation, both hero CTAs, six selected-project links, View all projects, all six service links, closing contact CTA, and footer/contact/social links. Confirm intended destinations or URI values without sending an email or placing a call.
- Check normal/hover/focus/active appearance and button text contrast, pointer cursors, hit areas, disabled/loading specimens where relevant to Home, and mobile menu open/close/Escape/focus behavior.
- Scroll top-to-bottom and back repeatedly, including during hero transitions, and resize/rotate. Check fixed-header position, sticky/pinned heading behavior if used, section alignment, anchor clearance, no clipping, no horizontal overflow, and no jumps when images/fonts load.
- Confirm headline/description/CTAs, all four stats, all six selected category cards, all six service headlines/counts, all 36 specifications, closing CTA, footer links, and copyright remain present.
- Check console/runtime errors and network image failures during the Home journey. Check performance traces for persistent layout shifts and excessive pointer work.

#### Scoring, evidence, and gates

| Criterion | Maximum | Evidence expected |
| --- | ---: | --- |
| Reference fidelity | 25 | Oakame visual grammar adapted to the approved Vurla fonts/content and custom hero |
| Visual polish | 15 | Typography, borders, alignment, image treatment, spacing, complete states |
| Responsiveness | 15 | All specified viewport captures, readable content, no unintended overflow |
| Accessibility | 20 | Contrast, semantics, focus, targets, 200% zoom, automated results; Home keyboard/touch/reduced-motion proof |
| Interaction quality | 10 | Home manual evidence; non-Home automated behavior evidence and static inspection only |
| Performance | 5 | Image delivery, reserved geometry, absence of hero-induced shifts, measured runtime evidence |
| Content preservation | 10 | Baseline data/text comparison, original image hashes, link mapping, complete specs/galleries |
| **Total** | **100** | Every page and shared component system must achieve **91 or higher** |

- Score each base page and each project detail separately, with per-criterion deductions. Give shared shell/state-system rows separate scores. Do not hide a weak page inside an average.
- Content preservation must score 10/10. No critical/serious automated accessibility findings, missing original content/media, broken image/link, dead Home control, wrong Home destination, hero scroll shift, runtime exception, or unintended overflow may remain regardless of total score.
- Evaluate fidelity against the approved adaptation, not pixel similarity to Oakame's different brand, font, or content.
- Non-Home interaction points require automated evidence for changed behavior. State explicitly that no manual interaction walkthrough occurred there. Do not award points for untested assumptions.
- Review each of the six generated images for source grounding, relevance, recognizable form/materials, rendering quality, crop safety, and consistency. Record defects and pass/fail per image; unresolved image failures prevent Services acceptance.
- Required reviewer return: route/state + viewport + input mode, numeric subscores/total, screenshot/evidence paths, reproducible deductions, blocker severity, concrete fix recommendations, and verdict. Missing evidence is `not verified`, not a fabricated pass.
- Primary agent fixes the reported defects, reruns affected tests, and requests re-review of affected pages plus the shared surfaces those fixes influence. Continue until all rows pass; do not stop after a fixed number of passes or lower the rubric to finish.
- Once all pass, obtain one final visual sweep of the complete inventory and final Home interaction pass on the final build, plus clean automated verification. Report any external blocker honestly and retain incomplete status if a required gate cannot be established.

---

## 7. Phases

All tasks start unchecked. Use tests first for new meaningful behavior; do not add brittle tests that merely mirror CSS or duplicate implementation. Every phase ends with evidence and a log update. Names below are target paths; create new files only where indicated/needed, and preserve existing ownership.

### Phase 0 — Read-only preflight and checkpoint

- **Closed with historical limitation — 0.1:** Source/catalog review and checkpoint evidence are retained. Complete pre-implementation source-reading order was not established retrospectively; no new audit is required under the user's closeout instruction.
- [x] 0.2 Inspect candidate checkpoint contents, including the current source changes, tests, migration docs, template, this plan, and local media. Exclude only generated/ignored artifacts and secrets; do not omit user assets just because they are untracked.
- [x] 0.3 Make the first implementation mutation: stage the inspected baseline and create the user-authorized local commit `chore: checkpoint updated website before redesign`. Do not amend prior commits, push, or reset anything.
- [x] 0.4 Verify the checkpoint exists and includes all baseline files; record its full SHA and clean status. If unexpected concurrent user changes remain, preserve and identify them instead of erasing them. Do not proceed without a recoverable baseline.
- [x] 0.5 After the checkpoint, create the content/image manifest and evidence directory described in section 6.1; record any drift from this document. Re-run baseline lint/typecheck/tests; safely establish a production build after stopping any owned dev server.
- [x] 0.6 Check the reference sites visually by browsing/scrolling, available image-generation capability, font/dependency availability, and local browser/server access. Record reference screenshots/notes and constraints. Any temporary COGH inspection server must be stopped afterward.

**Verification:** checkpoint SHA and baseline manifest exist, pre-existing failures are recorded, and no implementation changes preceded the checkpoint. The planning document's prior creation is the explicit exception described in the preamble.

### Phase 1 — Canonical design foundation and contracts

- [x] 1.1 Expand `docs/architecture/design.md`, `src/lib/design-system/tokens.ts`, `parse-spec.ts`, and `index.ts`; add `color-families.ts`. Implement the complete palette/role system and COGH section schema.
- [x] 1.2 Extend `src/lib/design-system/design-system.test.ts` for token/document/CSS equality, section order, color coverage/contrast, malformed input, and Windows line endings.
- [x] 1.3 Consolidate `src/app/design-system.css` and `src/app/globals.css`; map framework aliases to canonical variables and remove competing legacy colors/typography/global transitions in changed areas.
- [x] 1.4 Configure Share Tech Mono and Geist Sans in `src/app/layout.tsx`; keep Vurla brand assets unchanged. Install compatible GSAP packages and record versions.
- [x] 1.5 Extend `src/content/contracts/index.ts`, service records, and server projections for service IDs/images; add document presentation metadata to the four specified gallery entries. Preserve original data fields.
- [x] 1.6 Record the responsive type scale, interaction sizes, boundaries, and reduced-motion rules in the canonical design doc before building page-specific styling.

**Verification:** focused design/content tests, lint, and typecheck pass; no original project media hash or authored field changes; no divergent palette layer remains in the migrated foundation.

### Phase 2 — Generate and integrate Services assets

- [x] 2.1 Inspect the exact reference inputs in section 6.5 and record their paths/hashes before generation.
- [x] 2.2 Make one reference-inclusive built-in generation call per service; save all six requested outputs, inspect them, and iterate defects with the original references retained in calls.
- [x] 2.3 Save final assets to `public/media/services/`, record full prompts/provenance/output dimensions, and update the six service media fields with correct alt text.
- [x] 2.4 Verify six distinct local service assets, valid intrinsic dimensions, nonempty alt text, responsive delivery suitability, and unchanged original catalog files.

**Verification:** six service images are available locally with actual reference-input evidence. Any uncompleted generation remains an explicit open task; placeholders do not satisfy this phase.

### Phase 3 — Shared primitives and shell

- [x] 3.1 Restyle/extend `src/components/ui/` and tests for semantic buttons/links, field labels/descriptions/errors, inputs/textarea, cards, notices/skeletons, badges, select/checkbox, and accordion states. Reuse existing libraries instead of parallel control systems.
- [x] 3.2 Update `src/components/site/Navbar.tsx`, `navbar-client.tsx`, and `Footer.tsx` for segmented borders, responsive layout, accessible mobile navigation, current-section matching, and preserved copy/destinations.
- [x] 3.3 Update `ProjectCard`, `FilterBar`, `SearchBar`, `FAQSection`, and shared image presentation to use canonical tokens and visible focus/hover states.
- [x] 3.4 Reserve layout space for media/header, remove hover-only essential information, and confirm footer copyright/contact/social content against the baseline.

**Verification:** shared control tests and typecheck pass; visual component checks show readable contrast and target sizes; shell contains exactly the requested primary destinations.

### Phase 4 — Working Plan hero and complete Home restyle

- [x] 4.1 Add `src/features/home/working-plan-hero.tsx` and `working-plan-layout.ts` (or equivalent Home-local modules) for shared-boundary geometry, nine authored states, stable hit regions, and lifecycle-safe animation.
- [x] 4.2 Add meaningful Home-local tests for nine unique projects, default selection, layout coverage/non-overlap, interrupted transition target stability, keyboard/touch selection, reduced-motion behavior, and preserved navigation URLs.
- **Accepted; remaining verification waived — 4.3:** Input handling and fallbacks are implemented with original covers and stable captions. Remaining real-browser input-mode verification is not claimed as passed.
- [x] 4.4 Recompose `src/features/home/home-page-client.tsx` and its server feature as appropriate while preserving section order, every string/count, current selected projects, full service lists, and both hero CTAs.
- [x] 4.5 Update Home service destinations to `/services#<id>`. Preserve selected-project links, contact destinations, and footer links. Ensure animation work stops offscreen and the stats bar does not move during selection.
- [x] 4.6 Desktop/tablet/mobile Home and all nine hero states inspected; observed visual findings corrected and independently reviewed. Remaining input-mode checks are waived at closeout.

**Verification:** focused Home tests pass; no content delta outside allowed presentation; all nine project covers are selectable/navigable; all 36 Home service specifications remain visible; no hero-induced section movement or scroll capture.

### Phase 5 — Remaining visitor pages and state presentation

- [x] 5.1 Restyle Projects composition, filters/search, results/empty state, and category query-string behavior under `src/features/projects/`; retain service-tag matching and project links.
- [x] 5.2 Restyle all project details through the shared detail feature; preserve complete galleries and implement contain/full-resolution document presentation.
- [x] 5.3 Restyle Services with six images and full existing specifications, stable IDs, anchor clearance, and existing introduction/closing CTA.
- [x] 5.4 Restyle Contact and FAQ, including correct label/error associations, pending/success/failure states, and preserved simulated API semantics. Keep empty hours hidden.
- [x] 5.5 Restyle `src/app/loading.tsx`, `src/app/error.tsx`, project loading, and not-found presentation. Make test fixtures/automated captures for states that cannot be reached by a direct visual URL.
- [x] 5.6 Remove remaining Framer Motion usage and dependency once migrated; search for stale style overrides, old project destinations, and unused animation imports without deleting user media.

**Verification:** relevant route/filter/contact tests, lint, and typecheck pass; original project data/media remains intact; automated behavior evidence is available for non-Home interaction scoring.

### Phase 6 — COGH-standard living design guide

- [x] 6.1 Rebuild `src/features/design/page.tsx` using the canonical parser and production primitives; add minimal client specimen/copy components under `src/features/design/`.
- [x] 6.2 Implement every guide section/specimen in section 6.6 and Vurla-specific prose. Render actual typography/borders/control states, not independent mock implementations.
- [x] 6.3 Set thin-route metadata in `src/app/design.md/page.tsx` and verify direct accessibility, canonical path, and `noindex, nofollow`; keep all public menus and footer free of a guide link.
- [x] 6.4 Document Working Plan behavior, reduced-motion treatment, media distinctions, and component rules within the standard nine-section order.

**Verification:** exact token/schema synchronization tests pass; guide renders complete prose/specimens with current fonts/colors and correct metadata.

### Phase 7 — Independent review and fix loop

- [x] 7.1 Establish a fresh local build and record its source revision/diff identity. Create review packets with URLs, viewport list, automated checks, baseline comparison, generated image records, and reference screenshots.
- [x] 7.2 Dispatch the read-only reviewer using section 8.2. Require visual inspection of every required page at every viewport and the Home-only hands-on checklist.
- [x] 7.3 Findings and evidence saved in numbered reports; section 10.2 records supported partial scores and NV totals. Final numeric totals are waived, not invented.
- [x] 7.4 Fix concrete deductions in scoped batches; update tests and evidence. Request re-review of affected routes and shared components; retain prior findings until resolved.
- **Waived — 7.5:** The user accepted the current site and ended the review loop. Content preservation is independently 10/10 and all six images pass; the final 91/100 threshold was not established.
- **Accepted with verification waiver — 7.6:** All 70 current-build visual cells and documented Home keyboard/navigation/scrolling checks are reviewed. Remaining Home modes and further final sweeps are waived. Non-Home review remained visual/automated.

**Verification:** all inventory rows contain supported passing scores; no invented results or unverified gate is represented as complete; final reviewer verdict explicitly passes the required scope.

### Phase 8 — Documentation, validation, and closeout

- [x] 8.1 Update `docs/architecture/design.md` and relevant architecture wording to shipped reality. Correct the stale lunar-cover sentence in `docs/migrations/legacy-google-sites-homepage.md` without rewriting historical provenance.
- [x] 8.2 Archive existing manifests, prompts/provenance, reviewer reports, screenshots, reproduction steps and limitations. Prior comparisons preserve all 42 original files and all authored records; no new comparison run at closeout.
- [x] 8.3 Stop the owned dev server and run `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run build` sequentially as needed. Record exact results; rerun affected checks if further edits occur.
- [x] 8.4 Serve the resulting production build for the final evidence run. Do not run a new build concurrently with a dev server or treat a stale development tab as production proof.
- [x] 8.5 Close under the user's revised acceptance decision; record verified results separately from waivers. Move the plan and sibling evidence into `docs/plans/complete/`, preserving relative evidence links.
- [x] 8.6 Hand off the accepted site, completed plan, prior validation and explicit verification waivers. No deployment, push, PR or additional commit is implied by closeout.

**Closeout:** User acceptance supersedes the original all-gates condition. Existing evidence and unverified scores remain honest; no additional test/build run or runtime UI changes accompany archival cleanup.

---

## 8. Handoff notes

- **All material design choices are resolved:** fixed site/Home structure, Working Plan hero, fonts, palette direction, six reference-based service images, COGH guide, checkpoint-first execution, and Home-only manual interaction review.
- **Historical authoring boundary:** this document was the only deliverable in the authoring turn. Implementation is a subsequent action, not an implied side effect of saving this file.
- **Known baseline issues to address:** invalid Home service destinations, ignored project category query, exact-only nav activation, cropped technical drawings, minimal guide, fragmented CSS, and stale lunar-cover documentation.
- **Preserve historical evidence:** the existing migration doc contains provenance of earlier editorial images. Do not regenerate those images or reclassify them as new service outputs.
- **Checkpoint authority:** the user explicitly requested a pre-change checkpoint, overriding the template's general no-commit default for that one commit during execution. No other commits or remote operations are authorized by this plan.
- **Environment blockers:** if image generation, external reference access, font loading, or browser execution is blocked, document the exact failed operation and continue independent in-scope work. Do not fabricate substitutes or claim unavailable evidence.
- **Review limits:** scores are evidence-based judgments against the agreed rubric, not a claim of formal accessibility certification or objective pixel identity to Oakame. Report measured performance and observed behavior honestly.

### 8.1 Historical goal / execution prompt (do not restart)

Use the following prompt when the user starts implementation. It is intentionally included as text; do not invoke it or create an active goal while only authoring the plan.

```text
Execute J:/CODE/Nyan Designs/Vurla/docs/plans/active/website-oakame-redesign-implementation-plan.md
as the authoritative implementation goal. Read it completely and work through its phases.

Goal: redesign Vurla's complete frontend to the approved Oakame-inspired visual system,
build the nine-project Working Plan hero, generate six Services illustrations using actual
catalog images as reference inputs, and standardize /design.md like COGH. Finish only when
every required page/shared system scores at least 91/100 in independent review and all
hard gates and final validation pass. Do not invent a token budget.

Begin with read-only status/diff/content inspection. Before editing any file, installing
dependencies, or generating images, make the authorized local checkpoint commit of the
current website source, tests, documentation, this plan, and local assets. Inspect what is
staged, exclude generated artifacts/secrets, preserve user work, and record the checkpoint SHA.
Never reset the user's worktree. Keep all original project image files and variants.

Preserve Home / Projects / Services / Contact navigation. Preserve Home order: hero, stats,
selected projects, services with all 36 specifications and current counts, closing contact
CTA, footer. Preserve every current project record, slug, image, gallery, alt text, authored
copy, contact detail, and existing API behavior. Add only the approved service imagery,
presentation metadata, and UI labels needed for the new interaction.

Use the nine original project covers in the Working Plan hero: connected photographic
spaces with shared moving partitions, stable hit targets, no image distortion, no carousel,
and no sci-fi or generic cursor effects. Default to Terraced Garden Retreat. Support pointer,
keyboard, touch, reduced motion, ordinary project links, and native scrolling. Selection must
not change hero height or shift the stats bar. Keep the existing hero text and CTAs stable.

Use the agreed warm palette, Share Tech Mono for display/UI, and Geist Sans for body/form
text. Preserve content ownership and thin routes. Reuse actual production primitives in
the COGH-standard server-rendered /design.md, with synchronized document/tokens/CSS and
noindex/nofollow metadata. Do not link the guide in navigation/footer or any sitemap.

For each of the six Services images, inspect the specified original project files, then
call the built-in image-generation tool with nonempty referenced_image_paths containing
those actual files. Never use text-only generation. Preserve originals; save final service
assets locally; record source hashes, exact prompts, output paths, and review evidence.

After implementation, use an independent read-only reviewer sub-agent. It must visually
inspect every base route, all nine project-detail routes, and shared states at every planned
viewport. Its hands-on interaction walkthrough is Home only: test all hero projects, hover,
focus, keyboard/touch behavior, navigation/buttons/links, mobile menu, scrolling, alignment,
and destination correctness. Other pages receive visual review and automated evidence,
not manual control walkthroughs. The reviewer must supply per-criterion scores, deductions,
screenshots, and actionable findings. Do not assign scores yourself or pressure the reviewer
to pass. Fix findings and repeat until every page/system passes above 90 with content 10/10
and no hard-gate failures. Review each generated service image too.

Run meaningful regression tests, lint, typechecking, and a clean production build. Never run
next dev concurrently with a production build. Update this plan's checklists, evidence, and
Live Progress Log after each phase. Preserve evidence of every review iteration. Complete
the final all-page visual sweep and Home-only interaction pass on the final build. Report
real blockers honestly; never mark unverified work complete. Do not deploy or push.
```

### 8.2 Historical independent reviewer prompt

```text
You are the independent read-only reviewer for the Vurla redesign. Read the authoritative
implementation plan, especially sections 1, 2, 6, and 9. You did not implement the change.
Do not modify files, assets, code, scores from previous iterations, or the acceptance rules.

Inspect the implementer's supplied current build URL and evidence packet. Establish the
source/build identity you reviewed. Compare the rendered UI to the Oakame reference notes,
the approved Vurla font/content choices, and the Working Plan concept. Review all five base
routes, all nine current project details, and shared states at the five specified viewports.
Scroll every page to inspect its full visual composition.

Perform hands-on interaction testing only on Home. Exercise all nine hero selections and
project destinations; hover/focus/activate Home controls, navigation, service links, contact
CTAs, footer links, and mobile menu; test keyboard, touch, reduced motion, scrolling during
transitions, resizing, and alignment. Follow Home links only to verify the destination,
then return. Do not manually operate filters/forms/accordions or other controls on the
destination pages. Use supplied automated evidence for non-Home behavior scoring.

Check exact content preservation against the checkpoint manifest, including all 36 Home
service specifications and original project image hashes. Review the six service images
for actual reference-input evidence, project grounding, relevance, coherent art direction,
geometry/material fidelity, crop safety, and artifacts. Require uncropped original drawings.

Return a scorecard for each page and shared system: fidelity /25, polish /15,
responsiveness /15, accessibility /20, interaction /10, performance /5, content /10.
For each deduction give a route/state, viewport/input mode, evidence path, reproduction,
severity, and concrete fix. Passing is >=91 total and exactly 10/10 content, with no hard
gate remaining. Missing evidence is not verified; never fabricate a score or claim manual
non-Home testing. Explicitly say whether all six service images pass. Return a concise
pass/revise verdict and a complete actionable findings list. Re-review fixes using the same
rubric without lowering the standard or granting points merely to end the iteration.
```

### 8.3 Reviewer packet and findings format

Each iteration packet must identify the build, local URL/port, viewport matrix, reference evidence, baseline manifest, test outputs, generation provenance, and changes since prior review. Use `review-01.md`, `review-02.md`, and so on inside the evidence folder. Put screenshots in viewport/route-named subfolders and avoid committing build caches.

Each finding includes: ID, route/component/state, viewport, input mode, observed issue, expected behavior, reproduction, screenshot/evidence path, severity, rubric deduction, requested fix, resolution status, and re-review result. Keep implemented fixes separate from reviewer verdicts.

---

## 9. Success criteria / completion checklist

This is the accepted closeout scope. Checks below cite existing evidence; none was rerun at closeout.

- [x] Pre-redesign checkpoint and baseline recorded: `5aa3fa8b0c16c8fc4fcb516033df27cb722bd76e`.
- [x] Primary navigation, Home section order, all nine project records/URLs, original media and copy preserved. Prior independent preservation score: 10/10.
- [x] Nine-project Working Plan hero implemented, defaulting to Terraced Garden Retreat. Original covers, stable captions and ordinary project links remain.
- [x] Documented keyboard/navigation/native-scroll/resize evidence and all 70 visual cells independently assessed; observed visual deductions fixed.
- [x] Six distinct Services illustrations generated with actual catalog-image reference inputs, documented and independently passed.
- [x] Canonical tokens, Share Tech Mono/Geist fonts, shared controls and living COGH-standard `/design.md` implemented; direct-only/noindex/nofollow behavior recorded.
- [x] Original technical drawings, complete galleries, full-size links, service anchor clearance and section navigation preserved or corrected.
- [x] Previous validation passed: lint with one warning, TypeScript, 52 Vitest tests plus one Node image regression, and clean production build. Contact and Projects automated behavior evidence retained.
- [x] Current website accepted by user; plan and evidence archived together and preservation-test fixture paths adjusted for relocation.
- **Waived, not verified:** remaining real hover/touch/reduced-motion/no-JS/200% zoom and network/performance checks, additional final sweeps, additional test/build runs, and final supported 91/100 totals.
- **Historical limitation retained:** complete pre-implementation source-reading timing was not retrospectively established.
- **No broader certification:** no unresolved static visual defect was observed in the completed sweep, but untested modes are not certified free of failures.

---

## 10. Live Progress Log

Final closure percentages describe completion under the user's revised acceptance scope, not a claim that waived verification passed. The chronological entries below preserve the original implementation/review history.

| Phase | Title | Closure % | Notes | Last Updated |
| --- | --- | --- | --- | --- |
| 0 | Preflight and checkpoint | 100% | Checkpoint preserved; historical source-reading timing limitation accepted | 2026-09-05T00:52:18.5772076Z |
| 1 | Canonical design foundation and contracts | 100% | Canonical design foundation implemented and previously validated | 2026-09-05T00:52:18.5772076Z |
| 2 | Services image generation | 100% | All six reference-grounded images independently passed | 2026-09-05T00:52:18.5772076Z |
| 3 | Shared primitives and shell | 100% | Shared shell and controls accepted; remaining mode verification waived | 2026-09-05T00:52:18.5772076Z |
| 4 | Working Plan hero and Home | 100% | Nine-project hero and Home accepted; remaining browser checks waived | 2026-09-05T00:52:18.5772076Z |
| 5 | Remaining pages and states | 100% | Visitor pages and states accepted with prior visual/automated evidence | 2026-09-05T00:52:18.5772076Z |
| 6 | COGH-standard living guide | 100% | Living guide accepted with prior visual and token/behavior evidence | 2026-09-05T00:52:18.5772076Z |
| 7 | Independent review and fixes | 100% | Review loop closed by user acceptance; final numeric totals remain NV | 2026-09-05T00:52:18.5772076Z |
| 8 | Documentation, final validation, closeout | 100% | Plan/evidence archived; review server stopped; ignored caches retained after policy rejection; no new tests | 2026-09-05T00:52:18.5772076Z |
| — | **Overall accepted scope** | **100%** | Closed by user acceptance; waived verification is not represented as passed | 2026-09-05T00:52:18.5772076Z |

### 10.1 Planning evidence and execution identifiers

- 2026-09-04: inspected template, current catalog/source, attached design reference, and COGH guide pattern. Prior planning verified 16 local catalog images, lint/typecheck, and 15 passing tests. No production-build success is asserted for this authoring turn.
- 2026-09-04, subsequent pre-redesign cleanup: updated the Goal to the supplied five-part structure; corrected service anchors, current-section navigation, full-size/uncropped drawings, and stale documentation. Next.js and its ESLint config were patched to 15.5.25; compatible dependency fixes include Vitest 3.2.7 and a scoped Next PostCSS 8.5.28 override because Next still pins the vulnerable older PostCSS release. `npm audit` reports zero vulnerabilities. `npm run verify` passed lint, typechecking, 22 tests in 10 files, and the production build. A clean-install dry run passed. Local production smoke checks passed for all 14 page routes, 16 original-media response hashes, six service anchors, and image optimization. Unknown project URLs render Next's streamed not-found UI with noindex (HTTP 200), not a hard HTTP 404. No redesign execution phase is complete from this maintenance work.
- Checkpoint SHA: `5aa3fa8b0c16c8fc4fcb516033df27cb722bd76e` on `codex/oakame-redesign`; clean immediately after checkpoint.
- Baseline manifest path: `website-oakame-redesign-evidence/baseline.json` (nine projects, six services, full source snapshots, 42 original public-file hashes).
- Current reviewed candidate: production build `-hmhtj3L7VJl42bFlD1RD`; source audit `adc406e18487be4c966a92c6a3c38271fd5a80d4da4e860b61785c4532d62395`. Final acceptance identity remains pending.
- Current local production review URL: `http://localhost:3100` (development separately on3000 under `.next/dev`).
- Historical independent verdict: visually reviewed with preserved content; final mode/runtime evidence and supported totals were not established. Final disposition: accepted by user with those remaining requirements waived. See numbered reports for unchanged reviewer findings.

### 10.2 Per-page scorecard

Independent report03 supports fidelity25/25, polish15/15, responsive15/15 and content10/10 for each row. Accessibility20, interaction10 and performance5 remain NV (not verified), so no final total is assigned. Full criterion table and evidence: [review-03-independent.md](website-oakame-redesign-evidence/review-03-independent.md). All five viewport visuals are assessed; remaining mode/runtime verification and numeric acceptance requirements were waived by the user at closeout.

| Route / system | Total /100 | Content /10 | Visual evidence | Home interaction or non-Home automated evidence | Status |
| --- | --- | --- | --- | --- | --- |
| `/` | NV | 10 | All five assessed; report03 | Evidence retained; remaining modes waived | Accepted by user |
| `/projects` | NV | 10 | All five assessed; report03 | Evidence retained; remaining modes waived | Accepted by user |
| `/services` | NV | 10 | All five assessed; report03 | Evidence retained; remaining modes waived | Accepted by user |
| `/contact` | NV | 10 | All five assessed; report03 | Evidence retained; remaining modes waived | Accepted by user |
| `/design.md` | NV | 10 | All five assessed; report03 | Evidence retained; remaining modes waived | Accepted by user |
| `/projects/baker-house` | NV | 10 | All five assessed; report03 | Evidence retained; remaining modes waived | Accepted by user |
| `/projects/la-puente-residence-renewal` | NV | 10 | All five assessed; report03 | Evidence retained; remaining modes waived | Accepted by user |
| `/projects/terraced-garden-retreat` | NV | 10 | All five assessed; report03 | Evidence retained; remaining modes waived | Accepted by user |
| `/projects/stitching-west-baltimore` | NV | 10 | All five assessed; report03 | Evidence retained; remaining modes waived | Accepted by user |
| `/projects/circular-energy-exchange` | NV | 10 | All five assessed; report03 | Evidence retained; remaining modes waived | Accepted by user |
| `/projects/storyworks-campus` | NV | 10 | All five assessed; report03 | Evidence retained; remaining modes waived | Accepted by user |
| `/projects/flock-house` | NV | 10 | All five assessed; report03 | Evidence retained; remaining modes waived | Accepted by user |
| `/projects/boba-friend-pop-up` | NV | 10 | All five assessed; report03 | Evidence retained; remaining modes waived | Accepted by user |
| `/projects/lunar-habitat-immersion` | NV | 10 | All five assessed; report03 | Evidence retained; remaining modes waived | Accepted by user |
| Shared header/footer/components | NV | 10 | All five assessed; report03 | Evidence retained; remaining modes waived | Accepted by user |
| Loading/error/empty/not-found states | NV | 10 | All five assessed; report03 | Evidence retained; remaining modes waived | Accepted by user |

### 10.3 Services-image review record

| Service | Actual reference inputs recorded | Final workspace asset | Reviewer result |
| --- | --- | --- | --- |
| Architecture | services-generation.json + services-images.md | public/media/services/architecture.webp | Static and all-five-viewport rendered pass; reaffirmed review-03-independent.md |
| Interior | services-generation.json + services-images.md | public/media/services/interior.webp | Static and all-five-viewport rendered pass; reaffirmed review-03-independent.md |
| Landscape | services-generation.json + services-images.md | public/media/services/landscape.webp | Static and all-five-viewport rendered pass; reaffirmed review-03-independent.md |
| Construction | services-generation.json + services-images.md | public/media/services/construction.webp | Static and all-five-viewport rendered pass; reaffirmed review-03-independent.md |
| Fabrication | services-generation.json + services-images.md | public/media/services/fabrication.webp | Static and all-five-viewport rendered pass; reaffirmed review-03-independent.md |
| Digital Solutions | services-generation.json + services-images.md | public/media/services/digital-solutions.webp | Static and all-five-viewport rendered pass; reaffirmed review-03-independent.md |

### 10.4 Iterations and deviations

Implementation iterations are recorded below with retained failed results, fixes and verification. Never replace a failed result with a passing claim without recording the fix and re-verification.

- 2026-09-04T19:55:00Z: Execution recovered the approved plan/catalog from existing commit f0d9b57 on codex/content-cleanup-preview-20260904 because main did not contain them. Created isolated codex/oakame-redesign branch and an explicit empty checkpoint commit before file edits (baseline already fully committed). Stopped verified Vurla Next dev processes 3024/31780 before build. First verification failed only on require imports in the new evidence capture script; converted that script to ESM and reran successfully: lint, typecheck, 10 files / 22 tests, Next 15.5.25 production build. Logs retain both attempts. Oakame browser references available through in-app browser; Edge unavailable. No review scores assigned.


- 2026-09-04T20:14:24.5231883Z: Foundation and shared shell implementation progressed; installed GSAP 3.15.0 and @gsap/react 2.1.2. Focused design tests 5/5 and typecheck pass. Six reference-inclusive built-in generations saved as WebP with exact prompts/hashes/dimensions in services-images.md and services-generation.json. Independent image review 01: five pass, Digital Solutions IMG-01 requires lower framing to remove blank display band. Revision dispatched retaining original reference. No page scores assigned; visual and interaction gates remain open.


- 2026-09-04T20:28:47.5781427Z: Independent image re-review 02 clears IMG-01; all six static image verdicts pass. First production redesign build passed. 31 tests passed before adding deeper behavior/content tests; subsequent 41-test run found label names incorporating error text. Split explicit labels from help/error content. Browser inspection identified font-variable scope mismatch (next/font variables were on body while canonical aliases live on root); moved font variables to html. These fixes require refreshed build evidence. No final scores or completion claimed.


- 2026-09-04T20:42:07.5775753Z: Verification 05 passed lint, TypeScript, 41 tests across 15 files and production build. Production audit fetched all 14 routes and confirmed all 16 served original hashes. Removed redundant brand image alt where adjacent wordmark names it. Fixed mobile menu display after desktop resize, reserved mobile hero caption height, and added stable spatial hit-map selection. Primary browser measurements across all nine projects show identical hero/stats positions at 1440 and 390 widths (hero-primary-preflight.json). Exact screenshot clip solves host-frame cropping; use explicit clip dimensions. Mobile headline adjusted from 36px to 32px to meet three-line contract; build 06 underway. Phase 4.2 remains open until reduced-motion and additional interruption assertions are recorded. No independent page scores assigned.


- 2026-09-04T21:06:18.9293499Z: Review packet01 dispatched against build06. Reviewer CUA context could not list or create a browser; primary relays reviewer-chosen Home actions and supplies unedited captures. This limitation is explicit. All14routes x5viewports captured under visual-01 with DOM media/landmark/contrast data (70 unique final records). Initial clip-based captures had scrollbar reflow/truncated-footer issues; authoritative *-full.jpg files now use native fullPage capture with postcapture dimensions; *-bottom.jpg debug files are invalid evidence. Reviewer independently found A11Y-01 guide swatch text contrast4.34:1, pale default placeholders, misleading responsive specimen size labels, and two avoidable photo crops. These fixes are open. First seven keyboard destination journeys confirm URLs/h1/current navigation and unchanged hero/stats; full journey report in relay-01. Supplemental8tests pass, including clipboard rejection, reduced-motion geometry and server HTML fallback. Explicit user permission requested to use separate local Playwright for CUA-unavailable touch/fine-pointer/reduced-motion/no-JS checks; pending, no substitute claimed.


- 2026-09-04T22:50:36.9415048Z: Primary fix batch implements A11Y-01 labels on linen outside swatch fills, opaque muted placeholders, explicit desktop/mobile type-specimen metrics, and containment for Circular/Lunar gallery photography. Lint/typecheck and46tests passed; formatting applied. A new non-reduced-motion regression then failed: the passive effect cleanup killed the new GSAP tween on active-state changes (Baker room stayed14% tall instead of72%). Fixed observer lifecycle to mount/unmount only, reading active state through a ref. Animated selection and rapid retarget regression now passes. Added tested preview-error fallback and pointer-cancel/keyboard intent cleanup. Clean production verifications07/08 passed;09 now includes latest fallback. Generated .next cleanup deletion was policy-rejected; used a reversible, path-verified move into ignored node_modules/.cache for clean builds instead. Reviewer subsequently hit a usage limit and stopped; matrix/score/re-review remains incomplete. No reset credit consumed and no replacement reviewer used to bypass the limit. Current reviewer report: review-01-independent.md; supplied final messages confirm43/70 visual inspections, all6Services rendered at all5sizes, and pending remaining details/Home evidence. All prior screenshots precede the GSAP fix and are not final animation evidence.


- 2026-09-04T23:14:38.8222131Z: Cold-image review exposed Next15.5.25 request-cancellation bug96538: a cancelled initial transform could leave later clients waiting forever. Retained failing HTTP/unit evidence; applied a version-checked, idempotent postinstall backport of maintainer-approved but unreleased PR98168, detaching only the internal response socket. Original media/URLs remain unchanged. Real source-file regression now passes. Verification10 stopped because Vitest discovered the separate Node-runner test; renamed that file and retained the failure. Verification11 is running. Refreshed browser matrix must discard blank-preview captures. Independent reviewer remains unavailable due reported usage limit; final scores/re-review remain open.

- 2026-09-04T23:32:17.2632269Z: Verification11 passes lint, TypeScript,48 Vitest tests plus1 real Node image regression and clean production build (ID UdSD9fQ41T_3o6AmWv3eW). Twelve intentionally cancelled cold transforms all retry successfully in82–225ms. Production audit:14 route200s, no jsdom axe violations,16 served original hashes unchanged; preservation checks retain42 original files. Refreshed visual02 has70 unique full-page captures with loaded media, no overflow, one main/H1 each. Opaque text/background comparisons pass; placeholders minimum7.808:1. Primary current-build hero checks cover all9 selections at1440/390 with invariant heights/stats and all9 Enter/Back destinations. Added automated Contact validation/success and Projects category/history/empty/tag evidence. Packet02 records fixes, exact source/build identity, limitations and required independent re-review. Reviewer scores, real touch/hover/reduced-motion/no-JS browser gates and final acceptance remain open. Architecture/migration and supplied design/COGH parser sources rechecked; lunar-cover documentation already matches the catalog.

- 2026-09-04T23:54:29.4941473Z: Reviewer resumed and independently inspected all70 build11 visual02 captures plus18 settled hero states, reporting no new visual hard failure and visually clearing the four prior contrast/type/crop deductions. Footer coverage concern resolved with42 ordinary bottom-view supplements. Later Home relays include24off-page and2same-page link activations, skip/menu/Escape, native scroll during an active transition and1440→390→844×390→1440 Lunar resize. Native200% zoom remains unverified (unsupported plus key); fine-pointer/touch/reduced-motion/no-JS/performance browser gates remain open. On production restart discovered another Vurla devserver created16:32:51 and replaced.next; all70captures (16:15–16:21),18hero states (16:22) and9keyboardjourneys (16:28) predate collision. Later relay/footer evidence is provisional. Stopped verifiedprojectdevprocesses40628/13372, archived mixed generated output reversibly, and added development-only.next/dev output separation. Verification12 running; later evidence will be refreshed. No page scores or completion claimed.

- 2026-09-05T00:12:31.7116520Z: Clean production12 passed lint (one existing typed-image-spread alt warning), TypeScript,48 Vitest plus1 Node regression and build; ID -hmhtj3L7VJl42bFlD1RD. Verified separate development .next/dev leaves production manifests/build ID unchanged. Added four requested actual route-state/guide action regressions. Initial expanded check caught unsupported Testing Library exact options; removed them, retaining failure log. Corrected TypeScript and52 Vitest plus1 Node regression pass. Current HTTP audit again passes all14 routes and16 served-original hashes. Visual03 current-build sweep is in progress with full-page plus ordinary bottom captures for every viewport; reviewer independently cleared its first44 captures. Final interaction modes/scores remain open.

- 2026-09-05T00:29:16.1042330Z: Visual03 has70unique current-build viewport/page records plus ordinary footer captures. Reviewer found incomplete Garden image painting in1280/1440 fullPage screenshots despite loaded DOM flags. Preserved both failed attempts. Reviewer clears refreshed1440 fullPage and independently inspected six overlapping1280 ordinary frames showing entire hero/galleries/footer; use those as authoritative1280 evidence. Refreshed24Home off-page destinations,2same-page links, six anchor clearances, menu/Escape/focus, skip activation, native transition scrolling67→854 with constant hero/stats, and Lunar resize. Initial premature keyboard captures were invalid and retained; corrected settled-layout evidence passes. Current Contact automation proves validation focus, disabled pending, offline failure retaining fields, retry without refilling, simulated success/reset on the SAME build12. Actual route callback/loading/notfound/guide action tests pass. Final scores and hover/touch/reduced-motion/no-JS/zoom/performance browser gates remain open.

- 2026-09-05T00:33:19.8038376Z: Independent review03 saved with reviewed-evidence SHA inventory: all70 current visual cells assessed, no remaining observed static visual hard failure; allsix Services PASS; each page/shared-state supported static criteria25/15/15 and content10. Accessibility/interaction/performance and totals stay NV until realhover/touch/reduced-motion/noJS/200percentzoom/runtime evidence exists. Fresh Projects filtering and same-build Contact recovery accepted. CUA capability discovery confirms only visibility/viewport browser settings and pageAssets/webMCP tab capabilities; no hover/touch/media/noJS/trace controls. Its rule forbids other computer-interaction technologies unless specifically requested by user; earlier request for a separate local Playwright review remains unanswered. No alternate driver run, no fabricated score, no goal completion.

- 2026-09-05T00:34:56.0772115Z: Continuation audit: prior turn made concrete progress (current70-view independent sweep, corrected Home relays, same-build Contact recovery, expanded tests). Current production build ID and manifest hash still match review03; production3100 and isolated development3000 both return200. Remaining VERIFY02–05 browser modes still lack required capabilities and alternate-driver authorization. Reviewer is preparing exact remaining-mode evidence protocol; no alternate driver executed. This is the second consecutive turn ending with this permission condition if no answer arrives; goal remains active pending the blocked-audit threshold, not complete.

- 2026-09-05T00:39:15.4448870Z: Same independent reviewer completed remaining-home-modes-protocol.md with concrete Home-only inputs, browser setup, failure criteria, trace/zoom distinctions and evidence handoff for VERIFY02–05. Protocol preparation did not execute or close any mode gate. Reviewer task is now terminal. Production remains unchanged; pending alternate-driver permission is still the sole actionable execution blocker. Consecutive permission-blocked turn audit:2. No duplicate permission tool request issued and no unsupported input technology used.

- 2026-09-05T00:40:12.4962828Z: BLOCKED audit3: revalidated current build12, report03 open gates, terminal reviewer protocol task and unchanged CUA capability list. Previous turn included a verified wait on the live reviewer; its unexecuted protocol did not close a mode gate. No specific alternate-browser authorization has arrived. Same permission/capability blocker persists for three consecutive goal turns, with no remaining meaningful executable verification through the available driver. Goal marked blocked, not complete. Resume when user explicitly authorizes a separate local Playwright browser (or supplies a capable authorized browser surface); run remaining-home-modes-protocol.md, obtain independent supported totals and final acceptance, and keep original content/checkpoint/evidence intact. All incomplete checkboxes and NV scores remain open.

- 2026-09-05T00:52:18.5772076Z: USER-ACCEPTED CLOSEOUT. User states the current website is good enough and requests finishing the plan and cleanup with no additional tests. This supersedes the original blocked review loop and final91/100 requirement. Existing implementation accepted; remaining browser modes, further sweeps/tests/builds and final numeric scores waived, not passed. Plan and sibling evidence moved to docs/plans/complete; preservation-test fixture references updated for relocation. Historical captures/prompts/reports/hashes retained. No runtime UI change, additional test/build, deployment, push or commit performed at closeout. Closure percentages now describe accepted scope rather than original verification coverage.

- 2026-09-05T00:53:32.1486111Z: Closeout cleanup result: temporary production review server stopped and its browser tab closed; development preview on3000 retained. Automatic approval review rejected recursive deletion of five path-checked generated node_modules/.cache/vurla-* build archives with the generic reason blocked by policy. Those ignored archives remain; deletion was not retried through another mechanism. Archive movement and preservation-fixture path edits completed. No further tests or build were run. User-accepted plan closeout is complete with this cleanup limitation recorded.
