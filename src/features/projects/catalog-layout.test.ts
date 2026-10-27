import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { listProjects } from "@/content/testing";
import { composeCatalog } from "./catalog-layout";

describe("editorial catalog composition", () => {
  it("leads with the two half-width projects and preserves the remaining composition without mutating content", () => {
    const projects = listProjects();
    const original = projects.map((project) => project.slug);
    const { editorial, cards } = composeCatalog(projects);
    expect(editorial).toBe(true);
    expect(cards.map(({ project }) => project.slug)).toEqual([
      "la-puente-residence-renewal", "terraced-garden-retreat",
      "baker-house", "flock-house", "circular-energy-exchange",
      "boba-friend-pop-up", "storyworks-campus", "stitching-west-baltimore", "lunar-habitat-immersion",
    ]);
    expect(cards.map(({ shape }) => shape)).toEqual([
      "medium", "medium", "standard", "standard", "portrait", "standard", "standard", "wide", "standard",
    ]);
    const area = { standard: 1, portrait: 2, medium: 1.5, wide: 2 };
    expect(cards.reduce((total, card) => total + area[card.shape], 0)).toBe(12);
    expect(projects.map((project) => project.slug)).toEqual(original);
    expect(new Set(cards.map(({ project }) => project.slug)).size).toBe(9);
    const css = readFileSync("src/components/site/project-catalog.css", "utf8");
    expect(css).toMatch(/\[data-catalog-shape="portrait"\] \{\s*grid-column: 9 \/ span 4;\s*grid-row: 2 \/ span 2/);
  });

  it("reflows every filtered subset without reserved portrait or wide slots", () => {
    const projects = listProjects();
    for (let count = 0; count < 9; count++) {
      const subset = projects.slice(0, count);
      const result = composeCatalog(subset);
      expect(result.editorial).toBe(false);
      expect(result.cards.map(({ project }) => project)).toEqual(subset);
      expect(result.cards.every(({ shape }) => shape === "standard")).toBe(true);
    }
  });

  it("does not impose authored positions on a different nine-project collection", () => {
    const projects = listProjects().map((project) => ({ ...project, slug: `other-${project.slug}` }));
    expect(composeCatalog(projects).editorial).toBe(false);
  });
});
