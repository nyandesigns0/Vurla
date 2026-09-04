import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { listProjects } from "@/content/testing";
import ProjectDetailPage from "./project-detail-page";

describe("ProjectDetailPage", () => {
  it.each([
    "baker-house",
    "stitching-west-baltimore",
    "circular-energy-exchange",
    "storyworks-campus",
  ])("shows the complete technical drawing and original-size link for %s", async (slug) => {
    const project = listProjects().find((entry) => entry.slug === slug)!;
    const drawing = project.gallery!.find((image) => image.presentation === "document")!;
    render(await ProjectDetailPage({ params: Promise.resolve({ slug }) }));

    expect(screen.getByRole("img", { name: drawing.alt })).toHaveClass("object-contain");
    expect(screen.getByRole("link", { name: `View full-size image: ${drawing.alt} (opens in a new tab)` }))
      .toHaveAttribute("href", drawing.src);
  });
});
