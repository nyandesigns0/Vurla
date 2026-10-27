import { render } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { DotTexture } from "./DotTexture";
import { PagePlate } from "./PagePlate";

describe("shared dotted texture", () => {
  it("is decorative, pointer-inert and reusable without a client runtime", () => {
    const { container } = render(<DotTexture className="test-field" />);
    expect(container.firstChild).toHaveClass("dot-texture", "test-field");
    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
    expect(readFileSync("src/components/site/dot-texture.css", "utf8")).toContain("pointer-events: none");
  });
  it("puts identical shared fields behind both opening title and rail", () => {
    const { container } = render(<PagePlate index="03" kicker="Portfolio" title="Projects" />);
    expect(container.querySelectorAll(".dot-texture")).toHaveLength(2);
    expect(container.querySelector(".page-plate-field > .dot-texture")).toBeInTheDocument();
    expect(container.querySelector(".page-plate-rail > .dot-texture")).toBeInTheDocument();
  });
  it("keeps the console attached to navigation, bounds disclosure height and reduces the results inset by 40%", () => {
    const css = readFileSync("src/components/site/project-catalog.css", "utf8");
    expect(css).toMatch(/\.catalog-console \{[^}]*position: sticky;[^}]*top: calc\(var\(--ds-layout-gutter\) \+ 58px\)/);
    expect(css).toContain("max-height: min(50dvh,");
    expect(css).toContain("calc(var(--pf-catalog-inset) * 0.96)");
    expect(css).toMatch(/\.catalog-results \{[^}]*padding-top: var\(--catalog-results-gap\)/);
    expect(css).toMatch(/\.catalog-results::before \{[^}]*height: var\(--catalog-results-gap\)/);
    expect(css).toContain(".catalog-filter-disclosure { transition: none; }");
  });
});
