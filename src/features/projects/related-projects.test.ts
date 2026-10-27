import { describe, expect, it } from "vitest";
import { listProjects } from "@/content/testing";
import { getRelatedProjects } from "./related-projects";

const projects = listProjects();

describe("getRelatedProjects", () => {
  it("returns four distinct projects without recommending the current one", () => {
    for (const project of projects) {
      const related = getRelatedProjects(project, projects);
      expect(related).toHaveLength(4);
      expect(new Set(related.map((entry) => entry.slug)).size).toBe(4);
      expect(related.some((entry) => entry.slug === project.slug)).toBe(false);
    }
  });

  it("prioritizes linked disciplines over catalog position", () => {
    const residence = projects.find((entry) => entry.slug === "baker-house")!;
    const related = getRelatedProjects(residence, projects);
    expect(related[0].slug).toBe("terraced-garden-retreat");
    expect(related.some((entry) => entry.slug === "la-puente-residence-renewal")).toBe(true);
  });
});
