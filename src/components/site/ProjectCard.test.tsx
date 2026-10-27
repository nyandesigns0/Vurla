import { readFileSync } from "node:fs";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProjectCard } from "./ProjectCard";

describe("ProjectCard featured layout", () => {
  it("hides the entire sibling caption over a full-bleed photo on desktop hover and focus", () => {
    const css = readFileSync("src/components/site/project-catalog.css", "utf8");
    expect(css).toMatch(/\.catalog-grid > \.project-card--catalog::after \{[^}]*pointer-events: none;[^}]*transition: opacity 200ms/);
    expect(css).toMatch(/\.catalog-grid\[data-layout\] > \.project-card--catalog \.project-card-image \{[^}]*position: absolute;[^}]*inset: 0/);
    expect(css).toMatch(/\.catalog-grid\[data-layout\] > \.project-card--catalog \.project-card-copy \{[^}]*position: absolute;[^}]*inset: auto 0 0/);
    expect(css).toContain('.catalog-grid:has(> .project-card--catalog:focus-visible)');
    expect(css).toContain(':hover:not([data-pointer-hover="false"])');
    expect(css).toContain('[data-pointer-hover="true"]');
    expect(css).toMatch(/:not\(:focus-visible\)::after \{\s*opacity: 0\.12;\s*transition-duration: 180ms/);
    expect(css).toMatch(/:not\(:is\([^\n]*\)\) \.project-card-copy \{\s*opacity: 0/);
    expect(css).toMatch(/\.project-card--catalog \.project-card-copy \{[^}]*transform: translateY\(0\);[^}]*opacity 380ms[^}]*transform 380ms/);
    expect(css.match(/transform: translateY\(calc\(100% \+ 1px\)\)/g)).toHaveLength(2);
    expect(css).not.toMatch(/\.project-card--featured[^}]*opacity: 0\.12/);
  });

  it("removes only the last two desktop editorial tile bottom borders", () => {
    const css = readFileSync("src/components/site/project-catalog.css", "utf8");
    expect(css).toMatch(/@media \(min-width: 1024px\) \{\s*\.catalog-grid\[data-layout="editorial"\] > \.project-card:nth-last-of-type\(-n \+ 2\) \{ border-bottom: 0; \}/);
    expect(css).toMatch(/\.project-card--catalog \{[^}]*border-right: var\(--pf-rule\) solid var\(--mineral\);[^}]*border-bottom: var\(--pf-rule\) solid var\(--mineral\)/);
  });

  it("increases catalog rows by 30% and gives compact photos and captions proportionate extra height", () => {
    const css = readFileSync("src/components/site/project-catalog.css", "utf8");
    expect(css).toContain("--catalog-row-height: clamp(23.4rem, 32.5vw, 28.6rem)");
    expect(css.match(/grid-auto-rows: var\(--catalog-row-height\)/g)).toHaveLength(2);
    expect(css).toMatch(/\.catalog-grid\[data-layout\] \.project-card-image \{[^}]*aspect-ratio: 8 \/ 6\.8/);
    expect(css).toMatch(/\.catalog-grid\[data-layout\] \.project-card-copy \{[^}]*padding-block: 1\.25rem 1\.5rem/);
  });

  it("keeps catalog cards compact and reveals only retained details on interaction", () => {
    render(
      <ProjectCard
        slug="baker-house"
        title="Baker House"
        category="residential"
        year={2024}
        location="San Diego, CA"
        client="Private residence"
        services={["Conceptual Design"]}
        description="A quiet recalibration of a residence."
        image="/media/projects/baker-house/hero.png"
      />,
    );

    const card = screen.getByRole("link", { name: "View Baker House project" });
    expect(card).toHaveAttribute("href", "/projects/baker-house");
    expect(card.querySelector(".project-card-copy")).toHaveTextContent("Baker House");
    expect(card.querySelector(".project-card-copy .project-card-meta")).toBeNull();
    expect(card.querySelector(".project-card-image .project-card-meta")).toHaveTextContent("Residential2024");
    expect(card.querySelector(".project-card-copy")).not.toHaveTextContent("A quiet recalibration");
    expect(card.querySelector(".project-card-reveal")).toBeNull();
    expect(card).not.toHaveTextContent("A quiet recalibration");
    expect(card).not.toHaveTextContent("San Diego, CA");
    expect(card.querySelector(".project-card-index, .project-tags, .project-location, .project-card-action")).not.toBeInTheDocument();
    expect(card).not.toHaveTextContent("Private residence");
    expect(card).not.toHaveTextContent("Conceptual Design");
    expect(card).not.toHaveTextContent("View Project");

    const css = readFileSync("src/components/site/project-catalog.css", "utf8");
    expect(css).toMatch(/\.project-card--catalog \.project-card-image \{[^}]*aspect-ratio: 8 \/ 5/);
    expect(css).toMatch(/\.project-card--catalog:is\(:hover:not\(\[data-pointer-hover="false"\]\), :focus-visible, \[data-pointer-hover="true"\]\) \.project-card-meta \{[^}]*opacity: 1/);
    expect(css).not.toContain("linear-gradient");
  });

  it("uses 30px horizontal padding in every featured footer", () => {
    const css = readFileSync("src/app/globals.css", "utf8");
    expect(css).toMatch(/\.project-card--featured \.project-card-footer\{[^}]*padding:15px 30px 20px/);
  });

  it("keeps project details in one footer without a middle divider or separate arrow", () => {
    render(
      <ProjectCard
        slug="storyworks-campus"
        title="Storyworks Campus"
        category="commercial"
        year={2025}
        location="Los Angeles, CA"
        image="/media/projects/storyworks-campus/editorial-pavilion.png"
        variant="featured"
      />,
    );

    const card = screen.getByRole("link", { name: "Open Storyworks Campus" });
    expect(card).toHaveAttribute("href", "/projects/storyworks-campus");
    expect(card.querySelector(".project-card-image img")).toBeInTheDocument();
    expect(card.querySelector(".project-card-image")).not.toHaveTextContent("2025");

    const footer = card.querySelector<HTMLElement>(".project-card-footer")!;
    const categoryAndTitle = footer.querySelector<HTMLElement>(".project-card-info")!;
    const yearAndLocation = footer.querySelector<HTMLElement>(".project-card-details")!;
    expect(within(categoryAndTitle).getByText("Commercial")).toContainElement(categoryAndTitle.querySelector("svg"));
    expect(within(categoryAndTitle).getByRole("heading", { name: "Storyworks Campus" })).toBeInTheDocument();
    expect(footer.querySelector(".project-card-footer-divider, .divider-line")).toBeNull();
    expect(footer.children).toHaveLength(2);
    const css = readFileSync("src/app/globals.css", "utf8");
    expect(css).toMatch(/\.project-card--featured \.project-card-footer\{[^}]*grid-template-columns:repeat\(2,minmax\(0,1fr\)\);[^}]*gap:calc\(2 \* clamp\(\.75rem,1\.5vw,1\.25rem\) \+ var\(--divider-line-width\)\)/);
    expect(css).toMatch(/\.project-card--featured \.project-card-details\{grid-column:2;/);
    expect(within(yearAndLocation).getByText("2025")).toBeInTheDocument();
    expect(within(yearAndLocation).getByText("Los Angeles, CA")).toBeInTheDocument();
    expect(footer.querySelector(".project-card-hover-label")).not.toBeInTheDocument();
  });
});
