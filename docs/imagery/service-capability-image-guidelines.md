# Service capability image generation guidelines

Updated 2026-10-26 after the final Fabrication and Digital Solutions release: all 36 Services previews are integrated.

## Scope and review gate

These rules apply only to the 36 sub-service preview illustrations for the Services page and the explicitly approved Construction replacement default. They are not global rules for Vurla photography, project galleries, homepage imagery, or the website design system. Keep other service defaults unchanged. Do not change homepage imagery or project tags.

Work category by category unless the user explicitly combines categories. All six categories are now implemented on Services only. Fabrication and Digital Solutions were reviewed together at the user's request. For subsequent revisions, preserve approved images and revise only the requested subjects; approval of an earlier batch does not approve unrelated new images.

## Final Fabrication and Digital Solutions release

The user accepted the remaining images and requested website completion on 2026-10-26, correcting wood CNC to wood laser cutting. Eleven round-two review assets are copied byte-for-byte. Digital Fabrication v3 replaces only the wood process with a laser head, thin plywood, narrow cut kerfs and a honeycomb bed, retaining the metal CNC and 3D-printing composition. The final three captions are **WOOD LASER CUTTING / METAL CNC / 3D PRINTING**. Do not revert the wood panel to routing or relabel it without changing the depicted process.

`docs/imagery/fabrication-digital-release.json` records all twelve public mappings, hashes, original review provenance and the exact built-in image-generator correction prompt. The new master and optimized asset remain alongside it; historical reviews are preserved. The user-authorized correction is distinguished from the eleven unchanged approved images. The generative edit preserves the other panels' composition but does not claim pixel-identical unchanged regions.

All 36 capabilities now use server-owned `previewImage` records. Fabrication and Digital Solutions retain their original default images. The shared runtime supplies vertical slides, footer scan labels, grayscale/color interaction, decode-first switching, keyboard/Escape restoration, stationary-pointer targeting, failure fallbacks, and smooth conversation links. No new motion controller or design tokens were introduced. Homepage images and project tags are unchanged. Final pixel hashes and all-category completeness are covered by `service-preview.test.tsx`; The historical capture helper is retained locally in `output/local-archive/`; `npm run test:browser` performs the reproducible release checks.

## Fabrication and Digital Solutions: round-two corrections (historical)

The user approved all six Fabrication images and Digital Solutions' BIM Services, 3D Visualization and VR Walkthroughs. Preserve these nine masters and WebP files byte-for-byte. Revise only Custom Scripting, AI Integration and Digital Fabrication. The new review is `output/imagegen/service-capability-fabrication-digital-v2/review.html`; `approval-status.json` records the nine approvals separately from the three pending revisions. No public assets or website mappings change at this stage.

- **Custom Scripting:** show Rhino/Grasshopper-style parametric modeling and a connected visual definition. Use Storyworks' curved shell and tessellation as the geometric subject, with shaded/wireframe work and meaningful nodes, sliders and wires. A generic input/rule/output diagram or repeated Lunar panels does not communicate this service. The visual definition is illustrative, not an executable script or proof of native software assets; example slider values are not measured project dimensions.
- **AI Integration:** integrate AI into work, not architectural form. Address architecture firms using AI in document retrieval, comparison, extraction and human review, alongside individual clients using a tailored assistant to organize requests and produce practical next steps. The Baker House plan and La Puente room are contextual attachments rather than AI redesign targets. Show useful digital work artifacts without a staged desk, material palette, botanical decoration or generic technology symbols. Interface counts, schedules and records remain illustrative examples, not claims of deployed software or actual project changes.
- **Digital Fabrication:** explicitly distinguish **WOOD CNC**, **METAL CNC** and **3D PRINTING** in three full-bleed process panels. Show subtractive wood routing, subtractive metal milling and additive polymer printing with recognizable machines and material behavior. Boba Friend supplies the plywood/connection context; Storyworks supplies a curved shell study for the printed model. These processes and parts are conceptual service examples, not documented fabrication events or manufacturing instructions.

These directions supersede the three corresponding round-one entries below. The nine approved images stay unchanged, including the earlier relabeling of the approved pilot to 3D Visualization. Save all new prompts, edit attempts and source roles. In this round the AI draft added unwanted plants/swatches and hid the right caption; reject that draft. The selected correction removes the decoration and aligns both captions on one near-midpoint ribbon (about 49% height), without claiming exact pixel alignment. Inspect full and centered wide crops; small application text is secondary to the main service captions and visual purpose.

## Fabrication and Digital Solutions: combined first review (historical)

Review package: `output/imagegen/service-capability-fabrication-digital-v1/review.html`. Ten new studies plus two byte-preserved approved pilots; no live website assets, mappings, defaults, effects or homepage content changed. The combined batch is explicitly authorized by the user, not a general removal of category approval gates.

| Capability | Project and distinct visual job |
| --- | --- |
| Custom Furniture | La Puente fitted desk/cabinet context with component assembly and elevation studies, not an FF&E selection board. |
| Millwork | Boba Friend plywood carcass, fascia, edges and flat cutting profiles. |
| Metalwork | Boba Friend-inspired formed strap and blank-to-folded-part study; the proposed bracket is not documented existing hardware. |
| Joinery | Approved pilot v4 retained without regeneration or re-encoding. |
| Prototyping | Boba Friend partial counter-corner test assembly, clearance sketch and connection crops. |
| Finishing & Installation | La Puente matched fit-up/finished cabinet views; inferred installation, not photographed events. |
| BIM Services | Storyworks source plan and curved shell interpreted as a coordinated cutaway model with service routing. |
| 3D Visualization | Approved pilot v3 retained unchanged under its corrected assignment, despite the historical `digital-ai-integration` filename. |
| VR Walkthroughs | Lunar Habitat first-person spatial view, navigation trace and headset; no human figure or staged office. |
| Custom Scripting | Lunar panel geometry and controlled variations with a short input/rule/output chain. |
| AI Integration | Lunar fixed-context, reference-conditioned bay alternatives with human review; distinct from ordinary 3D rendering and VR. |
| Digital Fabrication | Boba Friend-derived rectangular sheet-part nesting and corresponding cut pieces. |

Source limits: La Puente provides editorial room images, not furniture shop drawings; Boba Friend provides a project photograph and existing editorial detail, not measured hardware or CNC files. Storyworks supplies an authored plan and pavilion view, not a BIM model or coordinated building systems. Lunar supplies concept views and a description mentioning AI/VR/AR, not native assets, code, an actual AI session or measured navigation geometry. All added assembly stages, hardware, models, toolpaths and workflows are illustrative. Do not imply manufacturing readiness, verified structural performance, safety approval or actual software deliverables.

Carry-forward checks: keep workflow imagery capability-specific; remove unrelated botanical decorations and material swatches; do not let cutting studies invent cup-holder holes in simple counter panels. A headset or other defining object must remain visible in center-cover crops. Captions can cross images at their midpoint instead of sitting below them, but verify actual generated placement. In this first review, Custom Scripting's strip remains slightly above the midpoint (approximately 46% height); this is explicitly flagged for review rather than represented as pixel-perfect. Keep complete generation/edit history, including unselected attempts. The two retained pilots must pass byte checks against both original masters and existing WebP assets.

## Construction direction: practical building work

The first Construction review contained five capability studies plus a Baker House-based default and the retained approved Quality Control pilot. The second review revises five items and preserves Quality Control and the now-accepted Site Supervision unchanged. The latest default direction supersedes Baker House: use a substantial La Puente whole-room renovation. The new default is an explicit exception to preserving every service default, subject to review before integration.

Project Management should show coherent whole-house framing/sheathing and coordination. Never combine a finished facade with one arbitrarily exposed framing bay to imply a construction sequence. The default should feel like a walk inside a substantial renovation, with broad opened walls and furniture/cabinetry removed, not a minor shelf installation. Keep recognizable openings and room proportions without staging tools or adding people.

Site Supervision v1 is accepted: shallow excavation, base preparation and partially installed garden walls. Retain its exact pixels. Cost Estimation needs a realistic full spreadsheet with thin cell rules and organized photoreal procurement-item tiles, not cartoon objects or random finished-project crops. Leave unknown quantities, rates and amounts blank or as em dashes. Construction Documentation should be led by an overall authored architectural plan with orthographic roof/wall/floor sections, not 3D exploded joinery or small interior installation details. Storyworks supplies an alternate actual plan; its generated sections are inferred, not verified construction details. The approved Architecture Construction Documents image is a hierarchy/style reference, not permission to transfer its geometry to another project.

Contract Administration uses Baker House at building scale: overall plan/context with drawing, submittal, query and change registers. Avoid an interior-shelf scope, arbitrary construction details, cartoon styling, staged signing, legal clauses or false approvals. These document panels are illustrative templates, not actual project records. No source photographs document the proposed construction events or actual schedules, contracts or costs. Preserve no-hands/no-people, source geometry, purposeful graphics, middle-aligned caption bands and wide-crop checks. Do not add invented monetary values or measured quantities. Construction round two is now approved and integrated as recorded below; the later midpoint experiments are not part of this release.

## Intended visual language

### Approved Construction release and alignment lesson

The user subsequently approved the Construction imagery and requested integration while viewing `service-capability-construction-v2/review.html`. Integrate that exact seven-image set: La Puente renovation default v2, Project Management v2, Quality Control pilot v3, Site Supervision v1, Cost Estimation v2, Construction Documentation v2 and Contract Administration v2. `output/imagegen/service-capability-construction-v2/approval.json` records the approval, public paths and hashes without rewriting the historical review manifest. Public WebP copies preserve the approved review bytes.

Round-three caption-alignment attempts were not selected. The generator repeatedly missed exact midpoint placement even with a guide; do not describe the approved round-two spines as pixel-perfect or silently substitute those attempts. Future alignment work must distinguish a band's center from its lower edge and verify actual placement against 50% canvas height. Caption-only requests do not authorize a redesign. No precise pixel-editing pass was authorized or performed here.

The Services default is now `/media/services/construction-default-v2.webp`; the original `/media/services/construction.webp` remains preserved and continues serving the homepage dossier through a server-owned homepage image override. The six capability previews reuse the existing slide transition, scan labels, decode-first selection, keyboard/Escape, failure fallback and smooth conversation links. No new global tokens or runtime interaction changes were needed. `scripts/construction-preview-evidence.mjs` checks desktop/mobile, all six images, keyboard, rapid switching, touch navigation, reduced motion, failed loading and no-JavaScript defaults. Evidence is saved under `output/verification/construction-previews/`; approved hashes are frozen in `service-preview.test.tsx`.

Create project-grounded editorial images: a purposeful mix of photography, collage, overlays, drawings, models and process studies. The image should give a quick, credible example of the capability. Use diagrams when they are the work itself: Space Programming specifically calls for bubble diagrams, adjacency relationships and area planning. Avoid generic infographic decoration, not meaningful planning diagrams.

“Experienced” means believable spatial use, material connections, assembly decisions and working processes. It does not mean adding dirt, rustic distressing, staged plants, stock-office props or generic luxury styling. Not every element must exist in one realistic photographed scene. A room and its material palette can be separate graphic elements.

Use square-edged composition, restrained paper/graphite, and selective red/blue accents that suit the website. The red corner and blue graphic layer in the approved Conceptual Design image are useful style references. Do not impose identical blocks or a split layout on every image. Natural material colors should remain visible.

Detailed drawings are welcome where they communicate the service. Conceptual does not mean vague or simplified: the user explicitly preferred retaining detailed plans. Avoid dense infographic layouts, decorative technical overlays and fabricated documentary authority.

## Reference selection and fidelity

1. Read the project's authored description, service tags, gallery captions and image/document classification.
2. Inspect the exact files before generation. Distinguish a photographed-looking view from a plan, section, model or other authored document.
3. Supply actual project files to the generator. Identify each input as a subject reference, document reference, approved style reference or edit target.
4. Keep the recognizable geometry, openings, materials, scale and setting. Prefer an existing room view or a meaningful crop over inventing an awkward new corner.
5. Derive plausible process states from real assemblies. A removed panel can expose how the original object fits together; do not redesign the object beyond recognition.
6. Record conceptual additions explicitly in provenance. Generated detail studies are not proof of built features, actual site events, structural adequacy or permit compliance.

## Composition and image content

- Keep the main subject legible. A floor plan must not disappear beneath a facade overlay.
- Collage should feel edited and intentional, not like a physical cutout casting an inexplicable shadow.
- Detail crops can fill a whole panel. Do not float a small image inside a large black surround.
- Palettes can occupy a full-height strip or a purposeful grid, rather than sitting on a table inside the room or awkwardly offset over a corner.
- Material swatches belong only where the service concerns materials. Do not add palettes to Space Programming or Building Permits; those images must communicate spatial planning and submission/review coordination respectively.
- Every swatch must read as a material. Pale samples need visible surface grain or aggregate, not a blank white rectangle.
- Use botanical textures for planting imagery. Do not substitute concrete, gravel or generic paper texture when the graphic element is meant to communicate plants.
- No people or hands in these generated sub-service studies. Remove them from derived scenes rather than introducing malformed hands or posed figures.
- Do not use rulers, tools or desk accessories as arbitrary symbols of “work.” Quality control should read through credible fit, alignment and connections.
- Digital visualization may combine shaded geometry, wireframe, in-process views and finished imagery. Avoid repeating the same polished rendering everywhere.
- Do not fabricate prominent technical text, approval stamps, seals, signatures or endorsements. Keep any necessary labels short and intentional.
- Preserve natural-color 3:2 landscape compositions, normally 1536×1024. Keep important subjects away from extreme edges and inspect narrow crops.
- Each sub-service must communicate a different purpose, not simply recrop the service default.

## Lessons from the pilot revisions

| Capability | What did not work | Approved direction |
| --- | --- | --- |
| Conceptual Design | Facade obscured the plan; raised stair-shaped cutout and shadow looked artificial; later revision lost the graphic accents. | Detailed plan stays visible; facade is collaged; real entry stair and retaining wall remain part of the project; restrained blue graphic and red corner restored. |
| Material Selection | Invented room corner felt wrong; samples on a staged table or offset floating palette felt forced; pale sample read as a blank block. | Recognizable existing La Puente room view; full-height palette strip; olive finish, upholstery and wood textures; visible pale mineral texture. |
| Planting Design | Graphic texture inserts read as building materials instead of plants. | Existing terraces and planting composition with botanical/grass/leaf textures; approved third-round image retained. |
| Quality Control | Strange hand and ruler arrangement; overly literal reuse of the source without a convincing inspection idea. | Hands-free, project-grounded assembly and connection details; approved third-round image retained. |
| Joinery | Invented scene drifted too far from the source; hands looked wrong; small inset floated on black margins. | Original pop-up composition adapted into a plausible intermediate assembly state; removed panel reveals construction; full-bleed close-up fills its panel. |
| 3D Visualization | Artificially pristine office, human figure, repeated render-quality views; incorrect label “AI Integration.” | Retain the third-round dual-monitor image with mixed shaded, textured and wireframe views; relabel it 3D Visualization without changing its pixels. |

The fourth-round AI replacement was generated because of a misunderstanding and is not selected. The user's request was to change the label of the existing image, not invent a new AI workflow. AI Integration remains a separate sub-service needing its own future image; the approved digital pilot now covers 3D Visualization. Do not remove or rename the live AI Integration service.

## Approved reference register

Paths are relative to the repository root. Historical filenames remain intact for provenance.

| Current assignment | Approved master |
| --- | --- |
| Conceptual Design | output/imagegen/service-capability-pilot-v4/masters/architecture-conceptual-design.png |
| Material Selection | output/imagegen/service-capability-pilot-v4/masters/interior-material-selection.png |
| Planting Design | output/imagegen/service-capability-pilot-v3/masters/landscape-planting-design.png |
| Quality Control | output/imagegen/service-capability-pilot-v3/masters/construction-quality-control.png |
| Joinery | output/imagegen/service-capability-pilot-v4/masters/fabrication-joinery.png |
| 3D Visualization | output/imagegen/service-capability-pilot-v3/masters/digital-ai-integration.png |

## Reusable generation brief

Read this guideline before every batch. Prepend [the reusable brief](service-capability-prompt-prefix.txt) to each capability-specific prompt and save that complete assembled prompt in the asset manifest. Then supply:

- Exact capability and its distinct visual purpose.
- Project description, relevant tags and source classifications.
- Reference roles by input-image number.
- Composition, medium and the detail that should receive focus.
- What must remain unchanged and what is a conceptual extension.
- Any user-requested correction; do not reinterpret a label change as an image change.

## Architecture batch direction

| Capability | Project | Distinct purpose |
| --- | --- | --- |
| Conceptual Design | Baker House | Approved plan and facade collage; retain unchanged. |
| Space Programming | Storyworks Campus | Bubble diagrams, adjacency and area allocation grounded in Storyworks' plan. Retain the base project context but remove material swatches. Program groupings are illustrative; do not invent measured project areas. |
| Schematic Design | Baker House | Plan-led organization of the two levels and living spaces, rather than another facade-led collage. |
| Design Development | Circular Energy Exchange | Building section and a focused envelope/floor-edge study showing design resolution; inferred connection details remain illustrative. |
| Construction Documents | Baker House | Coordinated plan and construction-detail drawing study; not an issued drawing set. |
| Building Permits | Baker House | Retain selected site/floor drawings; replace material palettes with submission-set organization, review comments and response-document cues. Communicate coordination with a city review process without literal signatures, approval marks or official forms. |

## Architecture review corrections

The latest floor-specific clarification takes precedence over broad Storyworks project tags: the main flowing spaces shown in this plan are predominantly exhibition spaces; the restaurant is at the bottom dining area, with kitchen, storage and back-of-house support in the left service-room strip. The production stage is upstairs, not one of the ground-floor bubbles. The Lucas Museum comparison describes the type of exhibition-led program; it does not identify this project as that museum. Keep area bars illustrative rather than inventing measured allocations. Building Permits from Architecture round two is accepted and must remain unchanged.

The user accepted all six Architecture images on 2026-10-25 after the third Architecture review. Use Conceptual Design v4, Space Programming v3, Schematic Design v1, Design Development v1, Construction Documents v1 and Building Permits v2. Do not regenerate these approved images without a new request.

Space Programming looked too much like a material study. The same base image is usable, but the emphasis must be bubble diagrams, identifying what spaces are for, adjacency and area planning. Bubble diagrams are explicitly appropriate here; the earlier blanket restriction on diagrams does not apply. Avoid unverified numerical area claims; use relative areas or clearly labeled illustrative targets if needed.

Building Permits can retain some of its drawings, but material swatches are the wrong cue. Focus on organizing documentation for submission, comments, responses and coordination with city review. This does not mean inserting a literal signature, an approval stamp or a staged meeting. Use neutral process-document cues without implying an actual filing or approval.

## Transferable lessons from the completed Architecture category

- **Show the service, not just the project.** Space Programming needed adjacency, use and allocation rather than material samples; Building Permits needed submission/review documents rather than a palette. Give each Interior capability an equally specific visual job.
- **Accurate meaning matters as much as graphic quality.** Storyworks' attractive first diagram still had incorrect uses. User-confirmed, floor-specific information overrides broad tags. An analogy is not the project's identity. Do not infer room functions, measured plans, product specifications or compliance from appearance alone.
- **Separate known features from proposals.** Preserve source geometry and materials. Label any inferred layout, alternative color, furniture selection or lighting condition as an illustrative study in the review and manifest. If there is no source plan, do not pass a new drawing off as a measured/as-built plan.
- **Use diagrams selectively.** Bubble diagrams belong to program/planning work. Specifications benefit from objects and a selection register; styling benefits from arrangements; lighting benefits from light on surfaces. Do not use one diagram or palette template for every service.
- **Keep detail but establish a focus.** Detailed plans and construction studies were approved; a dominant drawing must remain unobscured. At preview size the purpose should be apparent without reading a page of small labels.
- **Retain graphic character without imposing a formula.** Restrained red/blue marks, editorial overlays and purposeful crops work. Do not force all images into equally sized split panels, faux desk photographs or material grids.
- **Review in the actual image frame.** Masters are 3:2. The current desktop Architecture frame is wider (approximately 1.9:1), while mobile shows 3:2. Keep essential information within the central height; include a desktop-wide crop check, not just full masters or square crops. No black letterboxing, image warping or baked-in UI transitions.
- **Freeze approved versions.** Preserve approved files and complete provenance; revise only the requested image or label. Integration occurs only after category approval. Architecture uses the approved images without regeneration.

## Interior batch direction and source limits

Use La Puente Residence Renewal: the authored project description covers smart shelving, a handcrafted table, a bespoke vanity and considered lighting. Its current gallery provides two editorial interior views, not measured plans or product schedules: `editorial-entry.png` (entry, shelving and work nook) and `editorial-bedroom-v4.png` (bedroom with custom storage). Only visible features are evidence; do not invent a visible vanity, a complete home plan, brand/SKU, dimensions, price, illuminance or electrical certification.

| Capability | Distinct purpose and composition |
| --- | --- |
| Space Planning | Source-based entry/work/seating relationships and usable circulation; an edited room view with restrained planning overlays or an explicitly inferred local layout study. No invented whole-home plan, room sizes or material swatches. |
| Material Selection | Retain approved pilot v4 exactly, including the textured pale mineral sample and full-height palette strip. |
| FF&E Specification | Recognizable furniture, equipment and fixture selections derived from the source work nook/daybed/lighting; object silhouettes or elevations and a concise selection register, not another material palette. No invented brands, SKUs, quantities, dimensions or pricing. |
| Interior Styling | Preserve the source bedroom/daybed geometry; emphasize the composition of upholstery, cushions, throw and existing storage, using a room-led editorial crop and purposeful detail crops. No staged plants, hands, people or generic luxury props. |
| Color Consultation | Compare controlled finish alternatives on the same recognizable cabinet/trim crop, with unchanged camera, geometry and illumination. Keep natural wood and upholstery stable. Alternatives are proposals, not claims about the built project. |
| Lighting Design | Make daylight, task illumination and ambient reflected light visually legible in source-based views. Preserve openings, shelves and room geometry; show plausible light effects, not decorative beam cones or fabricated photometric values. |

The new Interior images are illustrative generated studies. FF&E and Color Consultation are capability interpretations derived from this project, not claims that the authored project tags or gallery document those deliverables.

## Delivery and quality checks

### Interior second-review correction: shared label spine

The user approved all six after round two. Space Planning v1, Material Selection pilot v4 and Interior Styling v1 remain unchanged. FF&E Specification v2, Color Consultation v2 and Lighting Design v2 use the approved crop-safe horizontal label spine near the image's vertical midpoint. FF&E places its task-chair, daybed, fitted-desk and wall-light labels on one row; Color Consultation uses OLIVE / STONE / CLAY; Lighting Design uses DAYLIGHT / TASK + AMBIENT. Keep text inset from the sides, avoid scattered captions near the top/bottom, and show the full 3:2 image plus center-cover crops at 1.9:1 and 2.4:1. Matching the caption height does not require replacing the distinct imagery with one generic template. Generation can vary a few pixels; review the visible alignment rather than claiming pixel-perfect registration.

### Lessons carried forward from Interior

- Preserve approved photographic content when only typography or framing needs revision. Do not regenerate a whole room or reinterpret the capability unnecessarily.
- A good full image can still fail inside the website frame. Scattered FF&E captions and low color/lighting labels risked being cropped; central caption spines solved that problem without changing the site's layout.
- Align related comparison captions at a consistent height. Keep object labels directly associated with their objects and keep color/light labels tied to their respective views.
- A furniture-selection collage, controlled color alternatives and paired lighting conditions have different jobs. A shared label spine gives consistency without making their imagery identical.
- Source-based space planning, the full-height textured material palette and room-led styling were accepted; retain those choices rather than adding more diagrams, props or overlays.
- Keep botanical references botanical in Landscape. Use meaningful spatial/site relationships, masonry connections and planting/water relationships rather than reusing Interior material-board layouts.

### Approved Interior release

The six approved masters and exact generation/edit prompts remain under `output/imagegen/service-capability-interior-v2/`. The review manifest is a historical snapshot; `approval.json` records the subsequent user approval and final public mapping. Public WebP copies are byte-identical to the approved review assets. Do not regenerate or modify these accepted images without a new user request.

### Landscape caption-spine correction: round four

The user requested matching midpoint alignment for Irrigation Systems (DRIP LINE / ROOT ZONE) and Sustainable Landscapes (PLANTING / PERMEABLE PATH). Both off-white caption bands must be centered at 50% of the image height, with text vertically centered inside each band; the earlier strips sat at different heights below center. Edit these two images only, preserving their distinct photo/cutaway subjects. Review side-by-side at full 3:2 and centered wide crops, and allow for small local differences from generative edits rather than claiming pixel-identical surrounding imagery. Round four at `output/imagegen/service-capability-landscape-v4/` retains all four other images unchanged. No category approval or live replacement is implied.

### Landscape Site Planning correction: round three

Site Planning must show actual spatial planning in a flat orthographic plan, not a perspective or axonometric garden with arrows laid over it. Use conceptual open-space bubbles, access/circulation and planted boundaries to explain how site form shapes and connects spaces. Remove visible vertical wall faces and fence elevations; retain the recognizable curved terrace language as flat plan traces. The arrangement is inferred from editorial garden views, not a measured survey. Avoid invented areas, property dimensions or undocumented room functions. Place concise labels inside their associated bubbles when a central caption strip would obscure the plan; keep them safe for wide crops. A first intermediate generation still had wall faces and was rejected before delivery; the final has flat plan symbols and crop-safe open-garden captions. Round three at `output/imagegen/service-capability-landscape-v3/` changes only Site Planning and retains the residential Playground Design from round two plus the other four images. No live website changes or approval assumed.

### Landscape playground correction: round two

The user replaced the Storyworks playground direction with three supplied residential references: a full site-plan sheet, an enlarged playground plan and an existing-house photograph. Round two is saved at `output/imagegen/service-capability-landscape-v2/`. Revise only Playground Design; preserve the other five images and their approval states. The new study pairs a refined colored plan with a full-bleed proposed view at the tan stucco, gray-shingle house. Keep the plan's flowing surface zones, curved perimeter and equipment organization legible; use the photograph for materials, residential scale, palm/fence and play-equipment context. Do not reuse the civic pavilion. Remove CAD titleblock/annotation clutter rather than inventing labels or approval information. The visualization is an interpretation of the proposal, not an as-built record or a safety/compliance claim. Stable copies of all three supplied files, complete prompt and hashes accompany the review. No Landscape integration until approval.

### Landscape round one: historical review

The user requested five new Landscape studies. Round one is saved at `output/imagegen/service-capability-landscape-v1/`; the approved `service-capability-pilot-v3/masters/landscape-planting-design.png` is retained unchanged. Nothing from this new Landscape batch is integrated before approval.

| Capability | Round-one composition | Evidence boundary |
| --- | --- | --- |
| Site Planning | Oblique terrace-arrangement drawing with circulation tracing beside the source garden view; restrained red corner and blue tracing seam. | Local arrangement inferred from editorial views, not a measured survey or complete property plan. |
| Hardscape Design | Dominant masonry/path photo joined to a flush paper section-perspective panel. | Visible block texture and curves are source-grounded; below-grade junction is illustrative, not engineering documentation. |
| Planting Design | Previously approved botanical collage, unchanged. | Preserve pilot v3 pixels and original generation provenance. |
| Playground Design | Storyworks pavilion context with low play terrain plus a clay-model panel. | Conceptual civic play-space addition, not an existing playground or a safety/compliance claim. Remove source people, robots and spacecraft. |
| Irrigation Systems | Slim drip-line planting-bed study paired with a root-zone cutaway and central caption band. | No irrigation installation is documented in the garden source images; proposed tubing and connections must be described as illustrative. |
| Sustainable Landscapes | Continuous planted/path relationship with a selective soil/aggregate section overlay and muted blue infiltration marks. | Do not infer measured environmental performance or verified drainage specifications. |

All references were read for tags, descriptions and gallery classification and visually inspected before generation. Terraced Garden supplies the garden studies; Storyworks supplies the pavilion and authored plan context for the play-space proposal. The shared caption-spine lesson is applied where labels are useful, not imposed on the unlabeled site/hardscape/play studies. Review all six with full 3:2 images and centered 1.9:1 and 2.4:1 crop options before integration.

Save versioned masters, optimized WebP assets, exact prompts, reference paths/roles, source-project rationale, descriptive alt text, generated-study status and review notes. Preserve previous rounds. Stable capability identifiers govern current assignments even when historical source filenames differ.

Review every output for reference fidelity, capability distinction, credible material/connection details, no hands/people, legible composition, and desktop/mobile crop risks. Verify files, dimensions and checksums. Show all six images for the current category together with their project references and explain which are retained versus new. Pause for user confirmation.

All six categories are integrated on Services only, with six previews per category through server-owned `previewImage` records. Construction uses its approved renovation default; the other five retain their original defaults. Homepage imagery and project tags remain unchanged.

### Approved Landscape release and workflow

The user approved all six Landscape images after round four on 2026-10-25. Use Site Planning v2 (flat orthographic plan and spatial bubbles), Hardscape Design v1, Planting Design v3, Playground Design v2 (supplied residential plan/house), Irrigation Systems v2 and Sustainable Landscapes v2 (middle-aligned caption bands). Preserve approved review pixels; public copies are checksum-identical to `output/imagegen/service-capability-landscape-v4/optimized/`. The historical review manifest stays unchanged; `approval.json` records authorization, final mappings and hashes. Masters, original references and generation/edit prompts remain alongside the review.

For each subsequent category: read these lessons; inspect source images and classifications; retain any approved pilot; generate only the remaining capabilities; review full and wide crops together; revise only requested images; wait for explicit approval; then copy approved assets without regeneration, add server-owned mappings, freeze checksum tests, verify shared interactions and update approval/evidence records. Do not promote an earlier version over the latest approved review.

Landscape lessons: planning diagrams must communicate spatial use in plan rather than decorate a perspective; user-supplied plans override loosely related project imagery; paired caption bands must share the image midpoint. Conceptual plans, play-area realizations, irrigation and subsurface studies are illustrative rather than surveyed, as-built or engineered claims.

Landscape integration evidence uses `node scripts/landscape-preview-evidence.mjs`, saved under `output/verification/landscape-previews/`. It covers six images, scan labels, preview restoration, keyboard/Escape, rapid switching, conversation navigation, touch, reduced motion, failed-image fallback, no-JavaScript defaults and responsive overflow. `service-preview.test.tsx` freezes all six approved public checksums. No new global design tokens or runtime effect implementations are required.

The latest user request supersedes the crossfade-only treatment: use a 320ms vertical slide with a subtle opacity blend (up for previews, down when restoring the default). Reuse the footer's three-band red label scan, without distorting the image. Keep the current image until the requested asset loads and decodes; stale loads cannot replace a newer choice. Nearby sections warm at most two assets concurrently, with requested assets prioritized over queued warming. Load/decode failures restore the default; stalled loads time out after 12 seconds.

Hover or keyboard focus selects a capability preview. Selection persists while pointer or keyboard focus remains within the section. Escape restores the default without moving focus. Stationary pointer hit testing follows native scrolling. The later navigation request supersedes persistent tap-only selection: clicking, tapping or pressing Enter on any subcategory scrolls to and centers the conversation panel over 1.3 seconds, with focus moved on arrival. Manual input can interrupt it. Reduced motion uses immediate image changes, static label emphasis and instant centered navigation. Without JavaScript the original image, readable capability links and native anchor destination remain. Existing borders and responsive grid are unchanged; ordinary closing-chapter scrolling retains its transition. These are runtime implementation constraints, not effects to bake into raster artwork.

Regression coverage lives in `src/features/services/service-preview.test.tsx` and `services-page-client.test.tsx`; live browser evidence can be refreshed with `node scripts/architecture-preview-evidence.mjs` against the development server on port 4000. Screenshots and results are saved to `output/verification/architecture-previews/`.

Interior integration evidence uses `node scripts/interior-preview-evidence.mjs`, with screenshots/results in `output/verification/interior-previews/`. It verifies all six previews, keyboard/Escape, rapid switching, touch-to-conversation navigation, reduced motion, failed-image fallback, no-JavaScript defaults and responsive overflow. Frozen SHA-256 checks in the content/preview regression test protect the approved Interior WebP pixels.
