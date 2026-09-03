import { describe, expect, it } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { ProjectsPageClient } from "./projects-page-client";
import type { Project } from "@/content/contracts";
const project: Project = { slug: "a", title: "Example", category: "residential", services: ["Conceptual Design"], year: 2024, description: "A project", image: "https://placehold.co/800" };
describe("project filtering", () => { it("renders supplied serializable projects", () => { render(<ProjectsPageClient projects={[project]} services={[]} />); expect(screen.getByText("Example")).toBeInTheDocument(); }); });
