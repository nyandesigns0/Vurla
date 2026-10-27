import { beforeEach, describe, expect, it } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { ProjectsPageClient } from "./projects-page-client";
import type { Project } from "@/content/contracts";
const project: Project = { slug: "a", title: "Example", category: "residential", services: ["Conceptual Design"], year: 2024, description: "A project", image: "https://placehold.co/800" };
beforeEach(() => window.history.replaceState(null, "", "/projects"));
describe("project filtering", () => {
  it("renders supplied serializable projects", () => {
    render(<ProjectsPageClient projects={[project]} />);
    expect(screen.getByText("Example")).toBeInTheDocument();
  });
  it("opens with an Our Work rail and a six-discipline tagline", () => {
    const { container } = render(<ProjectsPageClient projects={[project]} />);
    expect(screen.getByRole("heading", { level: 1, name: "Work across six disciplines" })).toBeInTheDocument();
    expect(container.querySelector(".page-plate-kicker")).toHaveTextContent("Our Work");
  });
});
