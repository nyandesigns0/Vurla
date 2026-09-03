import { describe, expect, it } from "vitest";
import { getProjectBySlug, listProjects, listServiceTags, validateContent } from "@/content/testing";
describe("content server loaders", () => {
 it("returns the authored projects and a known slug", () => { expect(listProjects().length).toBeGreaterThan(0); expect(getProjectBySlug("atrium-hall")?.title).toBe("Atrium Hall"); });
 it("returns null for a missing project", () => { expect(getProjectBySlug("not-a-project")).toBeNull(); });
 it("exposes unique service tags and validates the corpus", () => { const tags = listServiceTags(); expect(new Set(tags).size).toBe(tags.length); expect(validateContent()).toEqual({ valid: true, errors: [] }); });
});
