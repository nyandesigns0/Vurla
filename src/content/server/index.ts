import "server-only";

import type { FaqItem, Project, Service, SiteConfig } from "@/content/contracts";
import { projects } from "@/content/internal/projects";
import { services } from "@/content/internal/services";
import { faqItems, siteConfig } from "@/content/internal/site";

export function listProjects(): Project[] { return projects; }
export function getProjectBySlug(slug: string): Project | null { return projects.find((project) => project.slug === slug) ?? null; }
export function listServices(): Service[] { return services; }
export function listServiceTags(): string[] { return [...new Set(services.flatMap((service) => service.subItems.map((item) => item.name)))]; }
export function getSiteConfig(): SiteConfig { return siteConfig; }
export function listFaqItems(): FaqItem[] { return faqItems; }

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
