import type { Service } from "@/content/contracts";

export const services: Service[] = [
  {
    id: "architecture",
    title: "Architecture",
    image: {
      src: "/media/services/architecture.webp",
      alt: "Baker House stucco facade, black-framed windows and timber entry",
      width: 1536,
      height: 1024,
    },
    icon: "building-2",
    subItems: [
      { name: "Conceptual Design", icon: "file-text", capabilityIcon: "architecture-conceptual-design", previewImage: {
        src: "/media/services/capabilities/architecture-conceptual-design-v4.webp",
        alt: "Detailed Baker House floor-plan and facade collage with blue sky graphics and a brick-red lower-right corner.", width: 1536, height: 1024,
      } },
      { name: "Space Programming", icon: "layout", capabilityIcon: "architecture-space-programming", previewImage: {
        src: "/media/services/capabilities/architecture-space-programming-v3.webp",
        alt: "Storyworks exhibition-led floor-program study with restaurant, kitchen, storage and back-of-house zones and a separate upstairs production-stage note.", width: 1536, height: 1024,
      } },
      { name: "Schematic Design", icon: "building-2", capabilityIcon: "architecture-schematic-design", previewImage: {
        src: "/media/services/capabilities/architecture-schematic-design-v1.webp",
        alt: "Baker House schematic study pairing detailed first- and second-floor plans with restrained blue and red tracing overlays.", width: 1536, height: 1024,
      } },
      { name: "Design Development", icon: "settings", capabilityIcon: "architecture-design-development", previewImage: {
        src: "/media/services/capabilities/architecture-design-development-v1.webp",
        alt: "Circular Energy Exchange design-development collage combining a staggered-floor section, curved facade crop and conceptual floor-edge detail.", width: 1536, height: 1024,
      } },
      { name: "Construction Documents", icon: "file-text", capabilityIcon: "architecture-construction-documents", previewImage: {
        src: "/media/services/capabilities/architecture-construction-documents-v1.webp",
        alt: "Baker House construction-document study with a detailed plan crop, opening elevation, conceptual wall/window section and material strip.", width: 1536, height: 1024,
      } },
      { name: "Building Permits", icon: "check-circle", capabilityIcon: "architecture-building-permits", previewImage: {
        src: "/media/services/capabilities/architecture-building-permits-v2.webp",
        alt: "Baker House site and floor drawings paired with a submission-set index, annotated review sheet and response log, without signatures or approvals.", width: 1536, height: 1024,
      } },
    ],
  },
  {
    id: "interior",
    title: "Interior",
    image: {
      src: "/media/services/interior.webp",
      alt: "La Puente interior with olive built-ins, pale desk and paneled door",
      width: 1535,
      height: 1024,
    },
    icon: "palette",
    subItems: [
      { name: "Space Planning", icon: "layout", capabilityIcon: "interior-space-planning", previewImage: {
        src: "/media/services/capabilities/interior-space-planning-v1.webp",
        alt: "La Puente work nook and seating view with blue work-zone tracing, chair clearance and a red passage overlay toward the entry door.", width: 1536, height: 1024,
      } },
      { name: "Material Selection", icon: "paintbrush", capabilityIcon: "interior-material-selection", previewImage: {
        src: "/media/services/capabilities/interior-material-selection-v4.webp",
        alt: "La Puente room photograph paired with olive paint, woven upholstery, wood and textured pale mineral-surface samples.", width: 1536, height: 1024,
      } },
      { name: "FF&E Specification", icon: "home", capabilityIcon: "interior-ffe-specification", previewImage: {
        src: "/media/services/capabilities/interior-ffe-specification-v2.webp",
        alt: "Project-derived task chair, daybed, fitted desk and wall-light collage with four aligned labels across a central white spine.", width: 1536, height: 1024,
      } },
      { name: "Interior Styling", icon: "palette", capabilityIcon: "interior-interior-styling", previewImage: {
        src: "/media/services/capabilities/interior-interior-styling-v1.webp",
        alt: "La Puente bedroom styling study with cream and olive cushions, woven throw and flush textile detail crops.", width: 1536, height: 1024,
      } },
      { name: "Color Consultation", icon: "paintbrush", capabilityIcon: "interior-color-consultation", previewImage: {
        src: "/media/services/capabilities/interior-color-consultation-v2.webp",
        alt: "Matching La Puente room views in olive, stone and clay finishes with labels on a central white spine.", width: 1536, height: 1024,
      } },
      { name: "Lighting Design", icon: "lightbulb", capabilityIcon: "interior-lighting-design", previewImage: {
        src: "/media/services/capabilities/interior-lighting-design-v2.webp",
        alt: "La Puente work nook under daylight and warm task-plus-ambient light, with both labels aligned on a central white spine.", width: 1536, height: 1024,
      } },
    ],
  },
  {
    id: "landscape",
    title: "Landscape",
    image: {
      src: "/media/services/landscape.webp",
      alt: "Terraced Garden Retreat stone walls, planting and garden paths",
      width: 1537,
      height: 1023,
    },
    icon: "tree-pine",
    subItems: [
      { name: "Site Planning", icon: "map-pin", capabilityIcon: "landscape-site-planning", previewImage: {
        src: "/media/services/capabilities/landscape-site-planning-v2.webp",
        alt: "Top-down conceptual garden site plan with two blue open-garden bubbles shaped by curved planting beds, a planted perimeter buffer and red circulation from the access point.", width: 1536, height: 1024,
      } },
      { name: "Hardscape Design", icon: "settings", capabilityIcon: "landscape-hardscape-design", previewImage: {
        src: "/media/services/capabilities/landscape-hardscape-design-v1.webp",
        alt: "Gray split-face masonry and gravel-path detail paired with a conceptual wall, soil and aggregate section-perspective on a paper drawing field.", width: 1536, height: 1024,
      } },
      { name: "Planting Design", icon: "tree-pine", capabilityIcon: "landscape-planting-design", previewImage: {
        src: "/media/services/capabilities/landscape-planting-design-v3.webp",
        alt: "Terraced Garden planting collage with grasses, succulents and flowers against curved gray masonry, framed by botanical texture panels.", width: 1536, height: 1024,
      } },
      { name: "Playground Design", icon: "users", capabilityIcon: "landscape-playground-design", previewImage: {
        src: "/media/services/capabilities/landscape-playground-design-v2.webp",
        alt: "Refined colored playground plan beside a proposed play area with flowing blue and coral surfacing, play equipment, palms and a tan stucco house with a gray gabled roof.", width: 1536, height: 1024,
      } },
      { name: "Irrigation Systems", icon: "zap", capabilityIcon: "landscape-irrigation-systems", previewImage: {
        src: "/media/services/capabilities/landscape-irrigation-systems-v2.webp",
        alt: "Proposed slim drip tubing in a Terraced Garden planting bed above a root-zone cutaway, connected by a central DRIP LINE and ROOT ZONE caption band.", width: 1536, height: 1024,
      } },
      { name: "Sustainable Landscapes", icon: "tree-pine", capabilityIcon: "landscape-sustainable-landscapes", previewImage: {
        src: "/media/services/capabilities/landscape-sustainable-landscapes-v2.webp",
        alt: "Terraced planting and proposed permeable gravel path combined with an illustrative soil/root and aggregate section and blue infiltration marks.", width: 1536, height: 1024,
      } },
    ],
  },
  {
    id: "construction",
    title: "Construction",
    image: {
      src: "/media/services/construction-default-v2.webp",
      alt: "Illustrative whole-room La Puente renovation with broad exposed wall framing, retained window and central doorway.",
      width: 1536,
      height: 1024,
    },
    icon: "wrench",
    subItems: [
      { name: "Project Management", icon: "calendar", capabilityIcon: "construction-project-management", previewImage: {
        src: "/media/services/capabilities/construction-project-management-v2.webp",
        alt: "Baker House-inspired whole-house timber framing beside a sequencing schedule and proposed-plan crop.", width: 1536, height: 1024,
      } },
      { name: "Quality Control", icon: "check-circle", capabilityIcon: "construction-quality-control", previewImage: {
        src: "/media/services/capabilities/construction-quality-control-v3.webp",
        alt: "Approved Flock House quality-control collage with timber and mesh connection details and aligned plywood access doors.", width: 1536, height: 1024,
      } },
      { name: "Site Supervision", icon: "hard-hat", capabilityIcon: "construction-site-supervision", previewImage: {
        src: "/media/services/capabilities/construction-site-supervision-v1.webp",
        alt: "Terraced Garden construction study showing shallow excavation, aggregate base and partially installed curved retaining walls.", width: 1536, height: 1024,
      } },
      { name: "Cost Estimation", icon: "users", capabilityIcon: "construction-cost-estimation", previewImage: {
        src: "/media/services/capabilities/construction-cost-estimation-v2.webp",
        alt: "Detailed estimating worksheet with quantity, rate and amount columns alongside a six-item construction-material procurement grid.", width: 1536, height: 1024,
      } },
      { name: "Construction Documentation", icon: "file-text", capabilityIcon: "construction-construction-documentation", previewImage: {
        src: "/media/services/capabilities/construction-construction-documentation-v2.webp",
        alt: "Storyworks overall architectural plan with coordinated orthographic roof-edge and wall/floor section studies.", width: 1536, height: 1024,
      } },
      { name: "Contract Administration", icon: "settings", capabilityIcon: "construction-contract-administration", previewImage: {
        src: "/media/services/capabilities/construction-contract-administration-v2.webp",
        alt: "Baker House plan and facade context coordinated with drawing, submittal, query and change registers.", width: 1536, height: 1024,
      } },
    ],
  },
  {
    id: "fabrication",
    title: "Fabrication",
    image: {
      src: "/media/services/fabrication.webp",
      alt: "Boba Friend plywood counter panel and hinged timber upright",
      width: 1536,
      height: 1024,
    },
    icon: "home",
    subItems: [
      { name: "Custom Furniture", icon: "home", capabilityIcon: "fabrication-custom-furniture", previewImage: {
        src: "/media/services/capabilities/fabrication-custom-furniture-v1.webp",
        alt: "Project-derived fitted pale desk and olive shelving beside an illustrative furniture elevation and component assembly study.", width: 1536, height: 1024,
      } },
      { name: "Millwork", icon: "hammer", capabilityIcon: "fabrication-millwork", previewImage: {
        src: "/media/services/capabilities/fabrication-millwork-v1.webp",
        alt: "Honey-colored plywood counter carcass and loose fascia with exposed layered edges, paired with flat cutting-profile drawings.", width: 1536, height: 1024,
      } },
      { name: "Metalwork", icon: "wrench", capabilityIcon: "fabrication-metalwork", previewImage: {
        src: "/media/services/capabilities/fabrication-metalwork-v1.webp",
        alt: "Project-inspired folded steel strap at a plywood upright beside a flat metal blank and formed bracket.", width: 1536, height: 1024,
      } },
      { name: "Joinery", icon: "settings", capabilityIcon: "fabrication-joinery", previewImage: {
        src: "/media/services/capabilities/fabrication-joinery-v4.webp",
        alt: "Boba Friend plywood pop-up during illustrative assembly, alongside a full-height connection close-up.", width: 1536, height: 1024,
      } },
      { name: "Prototyping", icon: "box", capabilityIcon: "fabrication-prototyping", previewImage: {
        src: "/media/services/capabilities/fabrication-prototyping-v1.webp",
        alt: "Plywood counter-corner prototype with a hinged upright, an open-position sketch and connection-detail crops.", width: 1536, height: 1024,
      } },
      { name: "Finishing & Installation", icon: "check-circle", capabilityIcon: "fabrication-finishing-installation", previewImage: {
        src: "/media/services/capabilities/fabrication-finishing-installation-v1.webp",
        alt: "Matching La Puente built-in views showing inferred cabinet fit-up and completed olive finish, labeled across the image center.", width: 1536, height: 1024,
      } },
    ],
  },
  {
    id: "digital-solutions",
    title: "Digital Solutions",
    image: {
      src: "/media/services/digital-solutions.webp",
      alt: "Lunar Habitat interior with VR participant, faceted walls and yellow alcove",
      width: 1536,
      height: 1024,
    },
    icon: "monitor",
    subItems: [
      { name: "BIM Services", icon: "layers", capabilityIcon: "digital-bim-services", previewImage: {
        src: "/media/services/capabilities/digital-bim-services-v1.webp",
        alt: "Storyworks-derived architectural model with curved shell, pale floors and a blue service layer beside the source-based plan.", width: 1536, height: 1024,
      } },
      { name: "3D Visualization", icon: "eye", capabilityIcon: "digital-3d-visualization", previewImage: {
        src: "/media/services/capabilities/digital-3d-visualization-v3.webp",
        alt: "Dual-monitor Lunar Habitat visualization study combining shaded geometry, wireframe and rendered views.", width: 1536, height: 1024,
      } },
      { name: "VR Walkthroughs", icon: "monitor", capabilityIcon: "digital-vr-walkthroughs", previewImage: {
        src: "/media/services/capabilities/digital-vr-walkthroughs-v1.webp",
        alt: "Unoccupied Lunar Habitat eye-level walkthrough view with a discreet destination marker, a headset and a small navigation trace.", width: 1536, height: 1024,
      } },
      { name: "Custom Scripting", icon: "code", capabilityIcon: "digital-custom-scripting", previewImage: {
        src: "/media/services/capabilities/digital-custom-scripting-v2.webp",
        alt: "Rhino-style curved pavilion model and Grasshopper-style connected nodes illustrating parametric scripting.", width: 1536, height: 1024,
      } },
      { name: "AI Integration", icon: "settings", capabilityIcon: "digital-ai-integration", previewImage: {
        src: "/media/services/capabilities/digital-ai-integration-v2.webp",
        alt: "Paired AI workflow studies for an architecture firm's drawing and review tasks and an individual client's request and action plan.", width: 1536, height: 1024,
      } },
      { name: "Digital Fabrication", icon: "zap", capabilityIcon: "digital-digital-fabrication", previewImage: {
        src: "/media/services/capabilities/digital-digital-fabrication-v3.webp",
        alt: "Wood laser cutting plywood over a honeycomb bed, metal CNC milling an aluminum connector, and 3D printing a curved pavilion model.", width: 1536, height: 1024,
      } },
    ],
  },
];
