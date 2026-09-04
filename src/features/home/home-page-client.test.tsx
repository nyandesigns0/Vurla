import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { listProjects, listServices } from "@/content/testing";
import { HomePageClient } from "./home-page-client";
import { ServicesPageClient } from "@/features/services/services-page-client";

describe("HomePageClient", () => {
  it("uses the migrated estimate CTA", () => {
    render(<HomePageClient projects={listProjects()} services={listServices()} />);

    expect(screen.getByRole("link", { name: "Request an estimate" })).toHaveAttribute("href", "/contact");
    expect(screen.getByText("Vision and uniqueness in real living areas.")).toBeInTheDocument();
  });

  it("links all six service summaries to matching service sections", () => {
    const services = listServices();
    const { rerender } = render(<HomePageClient projects={listProjects()} services={services} />);
    const hrefs = screen.getAllByRole("link", { name: "Learn more" }).map((link) => link.getAttribute("href"));

    expect(hrefs).toEqual([
      "/services#architecture",
      "/services#interior",
      "/services#landscape",
      "/services#construction",
      "/services#fabrication",
      "/services#digital-solutions",
    ]);
    expect(screen.getAllByRole("listitem")).toHaveLength(36);

    rerender(<ServicesPageClient services={services} />);
    for (const href of hrefs) {
      expect(document.getElementById(href!.split("#")[1])).toBeInTheDocument();
    }
  });
});
