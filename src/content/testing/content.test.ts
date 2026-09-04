import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import path from "node:path";
import { getProjectBySlug, getSiteConfig, listProjects, listServiceTags, validateContent } from "@/content/testing";
describe("content server loaders", () => {
 it("returns the authored projects and a known slug", () => { expect(listProjects().length).toBeGreaterThan(0); expect(getProjectBySlug("baker-house")?.title).toBe("Baker House"); });
 it("includes the migrated Vurla work with local covers", () => {
   const migratedProjects = ["baker-house", "la-puente-residence-renewal", "terraced-garden-retreat", "stitching-west-baltimore", "flock-house", "boba-friend-pop-up", "lunar-habitat-immersion", "circular-energy-exchange", "storyworks-campus"];
   for (const slug of migratedProjects) expect(getProjectBySlug(slug)?.image).toMatch(new RegExp(`^/media/projects/${slug}/`));
   expect(getProjectBySlug("la-puente-residence-renewal")?.gallery).toHaveLength(2);
   expect(getProjectBySlug("terraced-garden-retreat")?.gallery).toHaveLength(2);
   expect(getProjectBySlug("lunar-habitat-immersion")?.gallery).toHaveLength(2);
   expect(getProjectBySlug("lunar-habitat-immersion")?.image).toBe("/media/projects/lunar-habitat-immersion/editorial-interior.png");
   expect(getProjectBySlug("circular-energy-exchange")?.gallery).toHaveLength(2);
   expect(getProjectBySlug("baker-house")?.gallery).toHaveLength(2);
   expect(getProjectBySlug("storyworks-campus")?.gallery).toHaveLength(2);
   expect(getProjectBySlug("stitching-west-baltimore")?.gallery).toHaveLength(2);
 });
 it("exposes verified legacy contact and social details", () => {
   expect(getSiteConfig()).toMatchObject({ email: "vurla.living@gmail.com", phone: "(626) 466-5346", address: ["La Puente, CA"], socialLinks: [{ label: "Instagram", href: "https://www.instagram.com/vurlaliving1111/" }] });
 });
 it("returns null for a missing project", () => { expect(getProjectBySlug("not-a-project")).toBeNull(); });
 it("keeps every catalog cover and gallery reference backed by a local file", () => {
   const imagePaths = new Set(listProjects().flatMap((project) => [project.image, ...(project.gallery ?? []).map((image) => image.src)]));
   expect(listProjects()).toHaveLength(9);
   expect(imagePaths.size).toBe(16);
   for (const imagePath of imagePaths) {
     expect(imagePath).toMatch(/^\/media\/projects\//);
     expect(existsSync(path.join(process.cwd(), "public", imagePath.slice(1))), imagePath).toBe(true);
   }
 });
 it("exposes unique service tags and validates the corpus", () => { const tags = listServiceTags(); expect(new Set(tags).size).toBe(tags.length); expect(validateContent()).toEqual({ valid: true, errors: [] }); });
});
