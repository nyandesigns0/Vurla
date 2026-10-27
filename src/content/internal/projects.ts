import type { Project } from "@/content/contracts";

export const projects: Project[] = [
  {
    slug: "baker-house",
    title: "Baker House",
    category: "residential",
    services: ["Conceptual Design", "Schematic Design", "Design Development", "Construction Documents"],
    location: "San Diego, CA",
    client: "Private residence",
    year: 2024,
    description:
      "A quiet recalibration of a 1952 residence, carefully reworking the social core to create more generous interior order while respecting the neighborhood and existing structure.",
    image: "/media/projects/baker-house/editorial-exterior.png",
    gallery: [
      {
        src: "/media/projects/baker-house/editorial-exterior.png",
        alt: "Baker House modernized residence exterior in San Diego",
      },
      {
        src: "/media/projects/baker-house/proposed-plan-set.png",
        alt: "Baker House proposed site and floor plan set",
        presentation: "document",
      },
    ],
    blurDataURL:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMzAwJyBoZWlnaHQ9JzIwMCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48cmVjdCBmaWxsPSIjZTVlNWU1IiB3aWR0aD0nMzAwJyBoZWlnaHQ9JzIwMCcvPjwvc3ZnPg==",
  },
  {
    slug: "la-puente-residence-renewal",
    title: "La Puente Residence Renewal",
    category: "interior",
    services: ["Space Planning", "Material Selection", "Interior Styling", "Lighting Design"],
    location: "La Puente, CA",
    client: "Private residence",
    year: 2025,
    description:
      "A custom interior renovation combining smart shelving, a handcrafted table, a bespoke vanity, and considered lighting for a more functional, personal space.",
    image: "/media/projects/la-puente-residence-renewal/editorial-entry.png",
    gallery: [
      { src: "/media/projects/la-puente-residence-renewal/editorial-entry.png", alt: "Refined La Puente residence entry, shelving, and work nook" },
      { src: "/media/projects/la-puente-residence-renewal/editorial-bedroom-v4.png", alt: "Refined La Puente residence bedroom with custom storage" },
    ],
    blurDataURL:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMzAwJyBoZWlnaHQ9JzIwMCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48cmVjdCBmaWxsPSIjZGRkZGRkIiB3aWR0aD0nMzAwJyBoZWlnaHQ9JzIwMCcvPjwvc3ZnPg==",
  },
  {
    slug: "terraced-garden-retreat",
    title: "Terraced Garden Retreat",
    category: "residential",
    services: ["Site Planning", "Hardscape Design", "Planting Design", "Sustainable Landscapes"],
    location: "La Puente, CA",
    client: "Private residence",
    year: 2025,
    description:
      "An elevated residential garden shaped through terraced stonework, planted levels, soft turf paths, and a privacy fence framing a relaxed view.",
    image: "/media/projects/terraced-garden-retreat/editorial-overview.png",
    gallery: [
      {
        src: "/media/projects/terraced-garden-retreat/editorial-overview.png",
        alt: "Terraced garden retreat with stone terraces, planting, and turf paths",
      },
      {
        src: "/media/projects/terraced-garden-retreat/editorial-detail.png",
        alt: "Terraced garden retreat masonry, planting, and gravel detail",
      },
    ],
    blurDataURL:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMzAwJyBoZWlnaHQ9JzIwMCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48cmVjdCBmaWxsPSIjZWVlZWVlIiB3aWR0aD0nMzAwJyBoZWlnaHQ9JzIwMCcvPjwvc3ZnPg==",
  },
  {
    slug: "stitching-west-baltimore",
    title: "Stitching West Baltimore",
    category: "public",
    services: ["Schematic Design", "Hardscape Design", "Project Management", "Quality Control"],
    location: "Baltimore, MD",
    client: "CPP Architecture",
    year: 2023,
    description:
      "A mixed-use renewal proposal that connects housing, retail, public space, and pedestrian pathways while preserving local heritage and supporting a more equitable West Baltimore.",
    image: "/media/projects/stitching-west-baltimore/editorial-model.png",
    gallery: [
      {
        src: "/media/projects/stitching-west-baltimore/editorial-model.png",
        alt: "Stitching West Baltimore physical architecture model",
      },
      {
        src: "/media/projects/stitching-west-baltimore/context-diagram.png",
        alt: "Stitching West Baltimore context diagram",
        presentation: "document",
      },
    ],
  },
  {
    slug: "circular-energy-exchange",
    title: "Circular Energy Exchange",
    category: "commercial",
    services: ["Design Development", "Construction Documents", "Project Management", "Site Supervision"],
    location: "Downtown Los Angeles, CA",
    client: "Concept proposal",
    year: 2024,
    description:
      "An EV battery recycling and materials-recovery center envisioned for Downtown Los Angeles, pairing transparent processing with adaptable workspaces and public-facing circular-economy education.",
    image: "/media/projects/circular-energy-exchange/editorial-dtla-cover.png",
    gallery: [
      {
        src: "/media/projects/circular-energy-exchange/editorial-dtla-cover.png",
        alt: "Circular Energy Exchange EV battery recycling center in Downtown Los Angeles",
      },
      {
        src: "/media/projects/circular-energy-exchange/section-01.png",
        alt: "Circular Energy Exchange technical building section drawing",
        presentation: "document",
      },
    ],
  },
  {
    slug: "storyworks-campus",
    title: "Storyworks Campus",
    category: "commercial",
    services: ["Space Programming", "Site Planning", "BIM Services", "3D Visualization"],
    location: "Los Angeles, CA",
    client: "Creative studio concept",
    year: 2025,
    description:
      "A vertical, collaborative production campus that brings research, making, pre-production, soundstage, and post-production spaces into one adaptable civic-facing environment.",
    image: "/media/projects/storyworks-campus/editorial-pavilion.png",
    gallery: [
      {
        src: "/media/projects/storyworks-campus/editorial-pavilion.png",
        alt: "Storyworks Campus production-campus pavilion in Downtown Los Angeles",
      },
      {
        src: "/media/projects/storyworks-campus/site-plan.png",
        alt: "Storyworks Campus site plan",
        presentation: "document",
      },
    ],
  },
  {
    slug: "flock-house",
    title: "Flock House",
    category: "fabrication",
    services: ["Custom Furniture", "Joinery", "Finishing & Installation"],
    location: "La Puente, CA",
    client: "Private residence",
    year: 2025,
    description:
      "Two custom-built coops with ventilation, secure fencing, and practical feeding and cleaning access, designed for durable everyday use.",
    image: "/media/projects/flock-house/cover.jpg",
  },
	{
		slug: "boba-friend-pop-up",
		title: "Boba Friend Pop-Up",
		category: "fabrication",
		services: ["Custom Furniture", "Millwork", "Joinery", "Finishing & Installation"],
		location: "La Puente, CA",
		client: "Boba Friend",
		year: 2025,
		description:
			"A custom-built event pop-up combining display, service, and playful branded details for an inviting, durable customer experience.",
		image: "/media/projects/boba-friend-pop-up/cover.jpg",
	},
	{
		slug: "lunar-habitat-immersion",
		title: "Lunar Habitat Immersion",
		category: "digital",
		services: ["3D Visualization", "VR Walkthroughs", "Custom Scripting"],
		location: "Cal Poly Pomona, CA",
		client: "NASA MUREP partnership proposal",
		year: 2024,
		description:
			"An immersive lunar-habitat proposal combining AI, virtual and augmented reality tools to support adaptable research, scientific activity, and future exploration workflows.",
		image: "/media/projects/lunar-habitat-immersion/editorial-interior.png",
		gallery: [
			{
				src: "/media/projects/lunar-habitat-immersion/editorial-interior.png",
				alt: "Lunar habitat interior with a participant using a VR headset",
			},
			{
				src: "/media/projects/lunar-habitat-immersion/editorial-exterior.png",
				alt: "Lunar habitat immersion module exterior concept elevation",
			},
		],
	},
];
