export type TeamMember = {
  id: string;
  name: string;
  role: string;
  description: string;
  image: string;
  specialties: string[];
  yearsExperience: number;
  email: string;
  linkedin?: string;
};

export const teamMembers: TeamMember[] = [
  {
    id: "vurla",
    name: "A. Vurla",
    role: "Principal Architect",
    description: "Founder and principal architect with over 20 years of experience in sustainable design and urban planning. Leads our vision for innovative, environmentally conscious architecture.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
    specialties: ["Sustainable Design", "Urban Planning", "Leadership"],
    yearsExperience: 20,
    email: "a.vurla@vurla.com",
    linkedin: "https://linkedin.com/in/avurla"
  },
  {
    id: "kaya",
    name: "B. Kaya",
    role: "Senior Project Manager",
    description: "Oversees complex multi-phase projects from conception to completion. Specializes in coordinating large-scale commercial and residential developments with exceptional attention to detail.",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=800&auto=format&fit=crop",
    specialties: ["Project Management", "Commercial Development", "Client Relations"],
    yearsExperience: 15,
    email: "b.kaya@vurla.com",
    linkedin: "https://linkedin.com/in/bkaya"
  },
  {
    id: "demir",
    name: "C. Demir",
    role: "Lead Designer",
    description: "Creative director responsible for design excellence across all project types. Brings fresh perspectives to residential, commercial, and public realm projects.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop",
    specialties: ["Creative Direction", "Interior Design", "Concept Development"],
    yearsExperience: 12,
    email: "c.demir@vurla.com",
    linkedin: "https://linkedin.com/in/cdemir"
  },
  {
    id: "ozturk",
    name: "D. Ozturk",
    role: "Landscape Architect",
    description: "Specializes in creating harmonious outdoor spaces that complement architectural design. Expert in sustainable landscaping and environmental integration.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=800&auto=format&fit=crop",
    specialties: ["Landscape Design", "Environmental Integration", "Sustainable Practices"],
    yearsExperience: 10,
    email: "d.ozturk@vurla.com",
    linkedin: "https://linkedin.com/in/dozturk"
  },
  {
    id: "yilmaz",
    name: "E. Yilmaz",
    role: "Construction Manager",
    description: "Ensures seamless execution of architectural designs with expertise in construction methodologies, quality control, and timeline management.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop",
    specialties: ["Construction Management", "Quality Control", "Timeline Optimization"],
    yearsExperience: 14,
    email: "e.yilmaz@vurla.com",
    linkedin: "https://linkedin.com/in/eyilmaz"
  },
  {
    id: "sahin",
    name: "F. Sahin",
    role: "Digital Design Specialist",
    description: "Pioneers the use of cutting-edge technology in architectural visualization and design. Expert in BIM, VR walkthroughs, and parametric design.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop",
    specialties: ["BIM Technology", "VR Visualization", "Parametric Design"],
    yearsExperience: 8,
    email: "f.sahin@vurla.com",
    linkedin: "https://linkedin.com/in/fsahin"
  },
  {
    id: "akbas",
    name: "G. Akbas",
    role: "Fabrication Specialist",
    description: "Bridges the gap between design and construction with expertise in custom fabrication, millwork, and innovative material applications.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop",
    specialties: ["Custom Fabrication", "Millwork", "Material Innovation"],
    yearsExperience: 11,
    email: "g.akbas@vurla.com",
    linkedin: "https://linkedin.com/in/gakbas"
  },
  {
    id: "koc",
    name: "H. Koc",
    role: "Client Relations Manager",
    description: "Ensures exceptional client experience throughout the project lifecycle. Coordinates communication, manages expectations, and builds lasting relationships.",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=800&auto=format&fit=crop",
    specialties: ["Client Relations", "Communication", "Project Coordination"],
    yearsExperience: 9,
    email: "h.koc@vurla.com",
    linkedin: "https://linkedin.com/in/hkoc"
  }
];
