export type ProjectCategory = "residential" | "commercial" | "public" | "interior" | "fabrication" | "digital";

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
  | "building-2" | "palette" | "tree-pine" | "wrench" | "home" | "monitor"
  | "file-text" | "layout" | "settings" | "check-circle" | "paintbrush"
  | "lightbulb" | "map-pin" | "users" | "zap" | "calendar" | "hard-hat"
  | "hammer" | "box" | "layers" | "eye" | "code";

export interface ServiceSubItem { name: string; icon: ServiceIconName; }
export interface Service { title: string; icon: ServiceIconName; subItems: ServiceSubItem[]; }
export interface NavigationLink { href: string; label: string; }
export interface SiteConfig {
  navigation: NavigationLink[];
  email: string;
  phone: string;
  address: string[];
  hours: string[];
}
export interface FaqItem { question: string; answer: string; }
