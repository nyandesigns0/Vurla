import { afterEach, beforeEach, describe, it, expect, vi } from "vitest";
import { readFileSync } from "node:fs";
import { fireEvent, render, screen, act, within } from "@testing-library/react";
import { ProjectsPageClient, categoriesFromSearch } from "./projects-page-client";
import { categoryValues } from "@/components/site/FilterBar";
import { listProjects } from "@/content/testing";
import { designTokens } from "@/lib/design-system/tokens";
beforeEach(() => window.history.replaceState(null, "", "/projects"));
afterEach(() => vi.unstubAllGlobals());
describe("catalog behavior", () => {
  it("uses only the site's red and blue for the transparent project mark", () => {
    const mark = readFileSync("public/brand/project-end-mark.svg", "utf8");
    const colors = [...mark.matchAll(/fill="(#[0-9A-Fa-f]{6})"/g)].map((match) => match[1]);
    expect(new Set(colors)).toEqual(new Set([designTokens.color.blue, designTokens.color.red]));
    expect(mark).not.toMatch(/<rect[^>]*width="306"/);
    expect(mark).toContain('viewBox="-120 24 402 54"');
    expect(mark).toContain('<rect x="-120" y="48.5" width="262" height="2.5"/>');
    expect(mark).not.toContain('width="138"');
    expect(mark).toContain("M226 48H241V67H238V51H226Z");
    const sharedCss = readFileSync("src/components/site/page-family.css", "utf8");
    expect(sharedCss).toMatch(/\.page-band-mark \{[^}]*width: clamp\(155px, 18\.8vw, 235px\);[^}]*height: 40px;[^}]*project-end-mark\.svg\?v=8/);
    const plateCss = readFileSync("src/components/site/page-family.css", "utf8");
    expect(plateCss).toMatch(/\.page-plate--roomy \.page-plate-band \{[^}]*padding-block: 2rem/);
    expect(plateCss).toMatch(/\.page-plate-crosshair \{[^}]*top: 50%;[^}]*right: var\(--pf-inset\)/);
  });

  it("renders the catalog without decorative page rails", () => {
    const { container } = render(
      <ProjectsPageClient projects={listProjects()} />,
    );
    expect(container.querySelectorAll(".page-rail")).toHaveLength(0);
    expect(container.querySelector(".catalog-results")).toBeInTheDocument();
    expect(container.querySelector(".closing-panel")).toBeInTheDocument();
    expect(container.querySelector(".closing-panel")).toHaveClass("closing-panel--chapter");
    expect(container.querySelector(".closing-chapter-plate > .closing-chapter-border")).toBeInTheDocument();
    expect(container.querySelector(".closing-panel-scroll-cue")).toBeNull();
    expect(container.querySelector(".projects-page")?.lastElementChild).toHaveClass("closing-chapter");
    expect(container.querySelector(".projects-top-rule")).toBeNull();
    expect(container.querySelector(".projects-opening-frame > .page-plate")).toBeInTheDocument();
    expect(container.querySelector(".projects-opening-frame .page-plate-field--crosshair")).toBeInTheDocument();
    expect(container.querySelector(".projects-opening-frame .page-plate-crosshair-mark")).toBeInTheDocument();
    expect(container.querySelector(".projects-opening-frame .page-band-mark")).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelector(".projects-opening-sides")).toBeNull();
    expect(container.querySelector(".catalog-grid")).toHaveAttribute("data-layout", "editorial");
    expect(container.querySelector('[data-catalog-shape="portrait"]')).toHaveAttribute("href", "/projects/circular-energy-exchange");
    expect(container.querySelector('[data-catalog-shape="wide"]')).toHaveAttribute("href", "/projects/stitching-west-baltimore");
    const source = container.querySelector(".projects-page > .closing-chapter-source");
    expect(source?.querySelector(":scope > .projects-source-sides.shell")).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelectorAll(".projects-source-sides")).toHaveLength(1);
    expect(source?.querySelector(":scope > .projects-background-grain")).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelectorAll(".projects-background-grain")).toHaveLength(1);
    expect(source?.lastElementChild).toHaveClass("chapter-scroll-bar");
    expect(source?.querySelector(".chapter-scroll-cue")).toHaveTextContent("Scroll to explore");
    expect(source?.querySelector(".chapter-scroll-bar .services-scroll-divider")).toBeInTheDocument();
  });

  it("ends stationary side rails above the borderless scroll cue", () => {
    const css = readFileSync("src/components/site/project-catalog.css", "utf8");
    expect(css).toMatch(/\.projects-page\.page-family \{[^}]*--projects-scroll-panel-height: clamp\(6rem, 10vw, 10rem\)/);
    expect(css).toMatch(/\.projects-source-sides\.shell \{[^}]*bottom: var\(--projects-scroll-panel-height\)/);
    const sharedCss = readFileSync("src/components/site/page-family.css", "utf8");
    expect(sharedCss).toMatch(/\.page-side-borders\.shell \{[^}]*position: absolute;[^}]*border-inline: var\(--pf-rule\) solid var\(--mineral\)/);
    expect(css).toMatch(/\.projects-page \.chapter-scroll-panel \{[^}]*min-height: var\(--projects-scroll-panel-height\)/);
    expect(css).toMatch(/\.catalog-console \{[^}]*position: sticky/);
    expect(css).not.toContain(".projects-opening-sides.shell");
  });

  it("initializes valid URL categories and defaults invalid values to All", () => {
    expect(categoriesFromSearch("?category=unknown")).toEqual(categoryValues);
    expect(categoriesFromSearch("")).toEqual(categoryValues);
    expect(categoriesFromSearch("?category=all")).toEqual(categoryValues);
    expect(categoriesFromSearch("?category=all&category=residential")).toEqual(categoryValues);
    expect(categoriesFromSearch("?category=digital&category=residential&category=digital&category=unknown"))
      .toEqual(["residential", "digital"]);
    expect(categoriesFromSearch("?category=none")).toEqual([]);
    window.history.replaceState(null, "", "/projects?category=digital");
    render(
      <ProjectsPageClient
        projects={listProjects()}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /^Filter projects/ }));
    expect(screen.getByRole("button", { name: "Digital" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByText("Lunar Habitat Immersion")).toBeInTheDocument();
    expect(screen.queryByText("Baker House")).not.toBeInTheDocument();
  });
  it("toggles categories independently and All presses every category", () => {
    window.history.replaceState(null, "", "/projects?category=residential");
    render(
      <ProjectsPageClient
        projects={listProjects()}
      />,
    );
    if (!screen.queryByRole("group", { name: "Project categories" })) fireEvent.click(screen.getByRole("button", { name: /^Filter projects/ }));
    fireEvent.click(screen.getByRole("button", { name: "Commercial" }));
    expect(window.location.search).toBe("?category=residential&category=commercial");
    expect(screen.getByText("Baker House")).toBeInTheDocument();
    expect(screen.getByText("Storyworks Campus")).toBeInTheDocument();
    expect(screen.queryByText("Flock House")).not.toBeInTheDocument();
    if (!screen.queryByRole("group", { name: "Project categories" })) fireEvent.click(screen.getByRole("button", { name: /^Filter projects/ }));
    fireEvent.click(screen.getByRole("button", { name: "Residential" }));
    expect(window.location.search).toBe("?category=commercial");
    expect(screen.queryByText("Baker House")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "All" }));
    expect(window.location.search).toBe("");
    for (const name of ["All", "Residential", "Commercial", "Urban Planning", "Interior", "Fabrication", "Digital"]) {
      expect(within(screen.getByRole("group", { name: "Project categories" })).getByRole("button", { name })).toHaveAttribute("aria-pressed", "true");
    }
    expect(screen.getByText("Flock House")).toBeInTheDocument();
  });
  it("treats the first category click from All as an exclusive choice", () => {
    render(<ProjectsPageClient projects={listProjects()} />);
    fireEvent.click(screen.getByRole("button", { name: "Filter projects" }));
    fireEvent.click(screen.getByRole("button", { name: "Urban Planning" }));
    expect(window.location.search).toBe("?category=public");
    expect(screen.getByText("Stitching West Baltimore")).toBeInTheDocument();
    expect(screen.queryByText("Baker House")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Residential" }));
    expect(window.location.search).toBe("?category=residential&category=public");
    expect(screen.getByText("Baker House")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "All" }));
    expect(window.location.search).toBe("");
  });
  it("returns to the results when filtering a long catalog from its bottom", () => {
    const { container } = render(<ProjectsPageClient projects={listProjects()} />);
    const status = container.querySelector<HTMLElement>(".catalog-status")!;
    const console = container.querySelector<HTMLElement>(".catalog-console")!;
    vi.spyOn(status, "getBoundingClientRect").mockReturnValue({ top: -500 } as DOMRect);
    vi.spyOn(console, "getBoundingClientRect").mockReturnValue({ height: 100 } as DOMRect);
    vi.stubGlobal("scrollY", 1600);
    const scrollTo = vi.fn();
    vi.stubGlobal("scrollTo", scrollTo);

    fireEvent.click(screen.getByRole("button", { name: "Filter projects" }));
    fireEvent.click(screen.getByRole("button", { name: "Digital" }));

    expect(screen.getByText("Lunar Habitat Immersion")).toBeInTheDocument();
    expect(scrollTo).toHaveBeenCalledWith(expect.objectContaining({ top: expect.any(Number), behavior: "instant" }));
    expect(scrollTo.mock.calls[0][0].top).toBeLessThan(1600);
  });
  it("stores an empty selection explicitly and restores all categories on reset", () => {
    window.history.replaceState(null, "", "/projects?category=residential");
    render(<ProjectsPageClient projects={listProjects()} />);
    if (!screen.queryByRole("group", { name: "Project categories" })) fireEvent.click(screen.getByRole("button", { name: /^Filter projects/ }));
    fireEvent.click(screen.getByRole("button", { name: "Residential" }));
    expect(window.location.search).toBe("?category=none");
    expect(screen.getByText("No projects found")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "All" })).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(screen.getByRole("button", { name: "Clear All Filters" }));
    expect(window.location.search).toBe("");
    expect(screen.getByText("Storyworks Campus")).toBeInTheDocument();
  });
  it("keeps category, clear and browser history consistent while preserving other URL state", () => {
    window.history.replaceState(null, "", "/projects?view=compact&category=residential#catalog");
    render(<ProjectsPageClient projects={listProjects()} />);
    if (!screen.queryByRole("group", { name: "Project categories" })) fireEvent.click(screen.getByRole("button", { name: /^Filter projects/ }));
    fireEvent.click(screen.getByRole("button", { name: "Digital" }));
    expect(window.location.search).toBe("?view=compact&category=residential&category=digital");
    expect(window.location.hash).toBe("#catalog");
    expect(screen.queryByText("Storyworks Campus")).not.toBeInTheDocument();
    act(() => {
      window.history.replaceState(null, "", "/projects?view=compact&category=interior#catalog");
      window.dispatchEvent(new PopStateEvent("popstate"));
    });
    expect(screen.getByText("La Puente Residence Renewal")).toBeInTheDocument();
    expect(within(screen.getByRole("group", { name: "Project categories" })).getByRole("button", { name: "Interior" })).toHaveAttribute("aria-pressed", "true");
    act(() => {
      window.history.replaceState(null, "", "/projects?view=compact&category=none#catalog");
      window.dispatchEvent(new PopStateEvent("popstate"));
    });
    expect(screen.getByText("No projects found")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Reset filters" }));
    expect(window.location.search).toBe("?view=compact");
    expect(window.location.hash).toBe("#catalog");
    expect(screen.getByText("Storyworks Campus")).toBeInTheDocument();
  });
  it("searches metadata and recovers from empty results", () => {
    render(<ProjectsPageClient projects={listProjects()} />);
    const search = screen.getByRole("textbox", { name: "Search projects" });
    fireEvent.change(search, { target: { value: "no matching project" } });
    expect(screen.getByText("No projects found")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Clear All Filters" }));
    fireEvent.change(search, { target: { value: "Baker" } });
    expect(screen.getByText("Baker House")).toBeInTheDocument();
    expect(screen.queryByText("Flock House")).not.toBeInTheDocument();
  });
  it("combines category OR matches and search without a subcategory filter", () => {
    window.history.replaceState(null, "", "/projects?category=residential&category=commercial");
    const { container } = render(<ProjectsPageClient projects={listProjects()} />);
    expect(screen.queryByRole("button", { name: "Subcategories" })).toBeNull();
    expect(screen.getByText("Baker House")).toBeInTheDocument();
    expect(screen.getByText("Storyworks Campus")).toBeInTheDocument();
    fireEvent.change(screen.getByRole("textbox", { name: "Search projects" }), {
      target: { value: "Los Angeles" },
    });
    expect(screen.queryByText("Baker House")).not.toBeInTheDocument();
    expect(screen.getByText("Storyworks Campus")).toBeInTheDocument();
    if (!screen.queryByRole("group", { name: "Project categories" })) fireEvent.click(screen.getByRole("button", { name: /^Filter projects/ }));
    fireEvent.click(screen.getByRole("button", { name: "Commercial" }));
    expect(screen.getByText("No projects found")).toBeInTheDocument();
    expect(container.querySelector(".active-filters")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Clear All Filters" }));
    expect(screen.getByRole("textbox", { name: "Search projects" })).toHaveValue("");
    expect(screen.getByText("Flock House")).toBeInTheDocument();
  });
});
