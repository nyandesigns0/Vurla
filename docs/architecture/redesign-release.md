# Redesign release verification

The accepted Vurla redesign is preserved across Home, Services, Projects, all nine
project detail pages, Contact, and the design guide. This closeout supersedes the
historical verification waivers in the completed design plans.

## Finalization changes

- Shared page frames, grain, typography, hover behavior, and chapter transitions
  retain the approved appearance. The finalized hallway no longer carries an
  experimental switch or an unused back-wall branch.
- Project detail routes are pre-rendered and have no streaming loading boundary:
  complete content is visible even when JavaScript is disabled.
- Contact validation loads on submission. First-load JavaScript decreased from
  137 kB before cleanup to 124 kB, while retaining validation and attachment behavior.
- Removed unused `@gsap/react`, `swr`, and `types-registry` dependencies. Updated
  Next.js to 15.5.28, Vitest to 5.0.5, and affected transitive dependencies. React
  stays on 19.1.0. Node.js 22.12+ is required.
- The Next image-cancellation backport remains necessary on 15.5.28: its regression
  fails without the patch and passes with it. Postinstall remains version-checked.
- Nineteen superseded preview images (4,992,642 bytes), old icon alternatives, and
  one-off capture scripts remain locally under `output/local-archive/`. They are
  excluded from the release. Original project media and approved images are preserved.
- Preservation tests use committed fixtures rather than local evidence archives.
  Asset hashes and original generation records are in `docs/imagery/`.

## Reproducible gates

Use `npm ci`, then `npm run verify` with development stopped. Verification runs
lint, TypeScript, 379 component/behavior tests, the image-cancellation regression,
generated grain consistency, and a production build. A clean installation and
the complete verification pipeline passed locally. The dependency audit reported
zero known vulnerabilities at closeout.

Run `npx playwright install chromium` and `npm run test:browser` for production
browser checks. The script starts its own server, checks all 13 visitor pages at
desktop/mobile sizes with JavaScript enabled/disabled, and exercises filtering,
stationary hover, history, reversible service transitions, contact validation,
image submission, FAQ controls, the maps link, 404 handling, delayed scripts, and
missing canvas/WebGL. Component tests additionally cover context recovery,
visibility pauses, resizing, reduced motion, and cleanup. Local screenshots and
logs are retained under `output/finalization/`; CI uploads browser evidence on failure.

Production first-load JavaScript after cleanup: Home 129 kB; Services 124 kB;
Projects 125 kB; project detail 118 kB; Contact 124 kB. All nine authored project
routes are static HTML. The 3D renderer remains a separate lazy-loaded module.

## Boundaries

No content, route names, public component interfaces, or delivery integration was
added. `POST /api/contact` still validates and simulates processing; it sends no
mail and stores neither contact information nor uploaded images. Browser checks
use synthetic data. Windows Chrome is checked locally and Linux Chromium in CI;
Safari and Firefox are not part of this release's automated matrix.

The original checkout's uncommitted work and the older unrelated pull request
remain untouched. Release integration uses a merge commit to retain the prior
architecture and content history.
