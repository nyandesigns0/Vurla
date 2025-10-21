export type Project = {
	slug: string;
	title: string;
	category: "residential" | "commercial" | "public" | "interior" | "fabrication" | "digital";
	services: string[];
	location?: string;
	client?: string;
	year: number;
	description: string;
	image: string;
	blurDataURL?: string;
};

export const projects: Project[] = [
  {
    slug: "atrium-hall",
    title: "Atrium Hall",
    category: "commercial",
    services: ["Conceptual Design", "Schematic Design", "BIM Services", "3D Visualization"],
    location: "New York",
    client: "Tech Corp",
    year: 2024,
    description:
      "A contemporary office complex featuring soaring atrium spaces, natural light integration, and sustainable design principles.",
    image:
      "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?q=80&w=1600&auto=format&fit=crop",
    blurDataURL:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMzAwJyBoZWlnaHQ9JzIwMCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48cmVjdCBmaWxsPSIjZTVlNWU1IiB3aWR0aD0nMzAwJyBoZWlnaHQ9JzIwMCcvPjwvc3ZnPg==",
  },
  {
    slug: "cliff-house",
    title: "Cliff House",
    category: "residential",
    services: ["Conceptual Design", "Space Planning", "Material Selection", "Site Planning", "Planting Design"],
    location: "California Coast",
    client: "Private",
    year: 2023,
    description:
      "Luxury residence perched on dramatic coastal terrain, featuring panoramic ocean views and seamless indoor-outdoor living.",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1600&auto=format&fit=crop",
    blurDataURL:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMzAwJyBoZWlnaHQ9JzIwMCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48cmVjdCBmaWxsPSIjZGRkZGRkIiB3aWR0aD0nMzAwJyBoZWlnaHQ9JzIwMCcvPjwvc3ZnPg==",
  },
  {
    slug: "urban-plaza",
    title: "Urban Plaza",
    category: "public",
    services: ["Site Planning", "Hardscape Design", "Planting Design", "Project Management"],
    location: "Downtown",
    client: "City Council",
    year: 2022,
    description:
      "Vibrant public space that activates the heart of the city with innovative landscape design and community gathering areas.",
    image:
      "https://images.unsplash.com/photo-1453873531674-2151bcd01707?q=80&w=1600&auto=format&fit=crop",
    blurDataURL:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMzAwJyBoZWlnaHQ9JzIwMCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48cmVjdCBmaWxsPSIjZWVlZWVlIiB3aWR0aD0nMzAwJyBoZWlnaHQ9JzIwMCcvPjwvc3ZnPg==",
  },
  {
    slug: "market-square",
    title: "Market Square",
    category: "public",
    services: ["Schematic Design", "Hardscape Design", "Project Management", "Quality Control"],
    location: "Historic District",
    client: "Heritage Foundation",
    year: 2023,
    description:
      "Historic market reimagined for modern community gathering with adaptive reuse and contemporary amenities.",
    image:
      "https://images.unsplash.com/photo-1544198365-3c37b1d4f7c3?q=80&w=1600&auto=format&fit=crop",
  },
  {
    slug: "residential-tower",
    title: "Residential Tower",
    category: "residential",
    services: ["Design Development", "Construction Documents", "Project Management", "Site Supervision"],
    location: "Metropolitan Area",
    client: "Urban Development Corp",
    year: 2024,
    description:
      "Luxury mixed-use tower with panoramic city views, sustainable features, and premium amenities.",
    image:
      "https://images.unsplash.com/photo-1502005229762-cf1b2da7c52f?q=80&w=1600&auto=format&fit=crop",
  },
  {
    slug: "office-campus",
    title: "Office Campus",
    category: "commercial",
    services: ["Space Programming", "Site Planning", "BIM Services", "3D Visualization"],
    location: "Business District",
    client: "Global Tech Inc",
    year: 2023,
    description:
      "Expansive corporate campus promoting innovation and collaboration through thoughtful design and flexible spaces.",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop",
  },
  {
    slug: "luxury-penthouse",
    title: "Luxury Penthouse",
    category: "interior",
    services: ["Space Planning", "Material Selection", "Custom Furniture", "Millwork"],
    location: "Penthouse Level",
    client: "Private Residence",
    year: 2024,
    description:
      "Sophisticated interior design featuring custom millwork, premium materials, and seamless integration of technology.",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1600&auto=format&fit=crop",
  },
	{
		slug: "custom-furniture-collection",
		title: "Custom Furniture Collection",
		category: "fabrication",
		services: ["Custom Furniture", "Millwork", "Joinery", "Finishing & Installation"],
		location: "Workshop",
		client: "Design Studio",
		year: 2023,
		description:
			"Handcrafted furniture pieces showcasing innovative joinery techniques and sustainable materials.",
		image:
			"https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1600&auto=format&fit=crop",
	},
	{
		slug: "virtual-reality-showroom",
		title: "Virtual Reality Showroom",
		category: "digital",
		services: ["3D Visualization", "VR Walkthroughs", "Custom Scripting"],
		location: "Innovation Center",
		client: "VR Technologies",
		year: 2024,
		description:
			"Immersive VR experience showcasing architectural designs with interactive walkthroughs and real-time customization.",
		image:
			"https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=1600&auto=format&fit=crop",
	},
];


