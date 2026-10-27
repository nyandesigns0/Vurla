import "server-only";

import type { FaqItem, HomeContent, Project, Service, SiteConfig } from "@/content/contracts";
import { projects } from "@/content/internal/projects";
import { services } from "@/content/internal/services";
import { faqItems, siteConfig } from "@/content/internal/site";
import { homeChapters, homeHeroSlugs, homeSelectedSlugs, homeStatistics, homeServiceImageOverrides, servicePositioning } from "@/content/internal/home";

export function listProjects(): Project[] { return projects; }
export function getProjectBySlug(slug: string): Project | null { return projects.find((project) => project.slug === slug) ?? null; }
export function listServices(): Service[] { return services; }
export function listServiceTags(): string[] { return [...new Set(services.flatMap((service) => service.subItems.map((item) => item.name)))]; }
export function getSiteConfig(): SiteConfig { return siteConfig; }
export function listFaqItems(): FaqItem[] { return faqItems; }
export function getHomeContent(): HomeContent {
  const project = (slug: string) => { const found = projects.find((item) => item.slug === slug); if (!found) throw new Error(`Missing homepage project: ${slug}`); return found; };
  return {
    chapters: homeChapters,
    heroProjects: homeHeroSlugs.map((slug) => { const item = project(slug); return { slug, title: item.title, location: item.location ?? null, year: item.year, href: `/projects/${slug}` as const, imageSrc: item.image, imageAlt: item.gallery?.[0]?.alt ?? item.title }; }),
    selectedProjects: homeSelectedSlugs.map(project),
    statistics: homeStatistics,
    services: services.map((service, index) => { if (service.subItems.length !== 6) throw new Error(`Service ${service.id} must have six capabilities.`); return { id: service.id, index: index + 1, title: service.title, subtitle: servicePositioning[service.id][0], description: servicePositioning[service.id][1], projectCount: projects.filter((item) => item.services.some((tag) => service.subItems.some((capability) => capability.name === tag))).length, imageSrc: homeServiceImageOverrides[service.id] ?? service.image.src, href: `/services#${service.id}` as const, capabilities: service.subItems.map((item, capabilityIndex) => ({ id: `${service.id}-${capabilityIndex + 1}`, label: item.name, iconId: item.capabilityIcon })) as unknown as HomeContent["services"][number]["capabilities"] }; }),
  };
}

export interface ContentValidationResult { valid: boolean; errors: string[]; }
export function validateContent(): ContentValidationResult {
  const errors: string[] = [];
  if (new Set(projects.map((project) => project.slug)).size !== projects.length) errors.push("Project slugs must be unique.");
  const tags = listServiceTags();
  if (tags.some((tag) => !tag.trim())) errors.push("Service tags must not be empty.");
  const knownTags = new Set(tags);
  for (const project of projects) for (const service of project.services) if (!knownTags.has(service)) errors.push(`Unknown service '${service}' on ${project.slug}.`);
  return { valid: errors.length === 0, errors };
}
