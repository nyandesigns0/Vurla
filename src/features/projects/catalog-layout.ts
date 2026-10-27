import type { Project } from "@/content/contracts";

export type CatalogShape = "standard" | "portrait" | "medium" | "wide";

/** Compose the authored nine-project edition in reading order, not CSS order. */
export function composeCatalog(projects: Project[]) {
  const portrait = projects.find((project) => project.slug === "circular-energy-exchange");
  const wide = projects.find((project) => project.slug === "stitching-west-baltimore");
  if (projects.length !== 9 || !portrait || !wide) {
    return { editorial: false, cards: projects.map((project) => ({ project, shape: "standard" as CatalogShape })) };
  }
  const remaining = projects.filter((project) => project !== portrait && project !== wide);
  const [first, second, retreat, campus, flock, popup, last] = remaining;
  const ordered = [second, retreat, first, flock, portrait, popup, campus, wide, last];
  const shapes: CatalogShape[] = ["medium", "medium", "standard", "standard", "portrait", "standard", "standard", "wide", "standard"];
  return {
    editorial: true,
    cards: ordered.map((project, index) => ({
      project,
      shape: shapes[index],
    })),
  };
}
