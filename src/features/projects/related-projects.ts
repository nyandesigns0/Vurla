import type { Project, ProjectCategory } from "@/content/contracts";

const relatedCategories: Record<ProjectCategory, readonly ProjectCategory[]> = {
  residential: ["interior", "fabrication", "public"],
  interior: ["residential", "fabrication", "commercial"],
  fabrication: ["interior", "residential", "commercial"],
  commercial: ["public", "digital", "fabrication"],
  public: ["commercial", "residential", "digital"],
  digital: ["commercial", "public", "interior"],
};

export function getRelatedProjects(project: Project, projects: readonly Project[], count = 4): Project[] {
  const services = new Set(project.services.map((service) => service.toLowerCase()));
  const affinities = relatedCategories[project.category];

  return projects
    .map((candidate, order) => ({
      candidate,
      order,
      score:
        (candidate.category === project.category ? 12 : 0) +
        (affinities.includes(candidate.category) ? 6 - affinities.indexOf(candidate.category) : 0) +
        candidate.services.filter((service) => services.has(service.toLowerCase())).length * 4,
    }))
    .filter(({ candidate }) => candidate.slug !== project.slug)
    .sort((a, b) => b.score - a.score || a.order - b.order)
    .slice(0, count)
    .map(({ candidate }) => candidate);
}
