export type ProjectCategory =
  | "residential"
  | "commercial"
  | "public"
  | "interior"
  | "fabrication"
  | "digital";

export interface ProjectImage {
  src: string;
  alt: string;
  presentation?: "photograph" | "document";
}

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
  gallery?: ProjectImage[];
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

export const capabilityIconIds = [
  "architecture-conceptual-design",
  "architecture-space-programming",
  "architecture-schematic-design",
  "architecture-design-development",
  "architecture-construction-documents",
  "architecture-building-permits",
  "interior-space-planning",
  "interior-material-selection",
  "interior-ffe-specification",
  "interior-interior-styling",
  "interior-color-consultation",
  "interior-lighting-design",
  "landscape-site-planning",
  "landscape-hardscape-design",
  "landscape-planting-design",
  "landscape-playground-design",
  "landscape-irrigation-systems",
  "landscape-sustainable-landscapes",
  "construction-project-management",
  "construction-quality-control",
  "construction-site-supervision",
  "construction-cost-estimation",
  "construction-construction-documentation",
  "construction-contract-administration",
  "fabrication-custom-furniture",
  "fabrication-millwork",
  "fabrication-metalwork",
  "fabrication-joinery",
  "fabrication-prototyping",
  "fabrication-finishing-installation",
  "digital-bim-services",
  "digital-3d-visualization",
  "digital-vr-walkthroughs",
  "digital-custom-scripting",
  "digital-ai-integration",
  "digital-digital-fabrication",
] as const;
export type CapabilityIconId = (typeof capabilityIconIds)[number];

export interface ServiceSubItem {
  name: string;
  icon: ServiceIconName;
  capabilityIcon: CapabilityIconId;
  previewImage?: ServiceImage;
}
export type ServiceId =
  | "architecture"
  | "interior"
  | "landscape"
  | "construction"
  | "fabrication"
  | "digital-solutions";
export interface ServiceImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}
export interface Service {
  id: ServiceId;
  image: ServiceImage;
  title: string;
  icon: ServiceIconName;
  subItems: ServiceSubItem[];
}
export interface NavigationLink {
  href: string;
  label: string;
}
export interface SocialLink {
  label: string;
  href: string;
}
export interface SiteConfig {
  navigation: NavigationLink[];
  email: string;
  phone: string;
  address: string[];
  hours: string[];
  socialLinks: SocialLink[];
}
export interface FaqItem {
  question: string;
  answer: string;
}

export type ChapterId = "hero" | "projects" | "services" | "new-work";
export interface StatisticMetric { id: "projects" | "experience" | "awards" | "satisfaction"; value: number; suffix: "+" | "%"; label: string; iconId: "plan" | "axis" | "award" | "signal"; }
export interface HeroProjectMeta { slug: string; title: string; location: string | null; year: number; href: `/projects/${string}`; imageSrc: string; imageAlt: string; }
export interface CapabilityRecord { id: string; label: string; iconId: CapabilityIconId; }
export interface ServiceDossierRecord { id: ServiceId; index: number; title: string; subtitle: string; description: string; projectCount: number; imageSrc: string; href: `/services#${string}`; capabilities: readonly [CapabilityRecord, CapabilityRecord, CapabilityRecord, CapabilityRecord, CapabilityRecord, CapabilityRecord]; }
export interface HomeContent { chapters: readonly ChapterId[]; heroProjects: HeroProjectMeta[]; selectedProjects: Project[]; statistics: StatisticMetric[]; services: ServiceDossierRecord[]; }
