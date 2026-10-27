import { readFileSync } from "node:fs";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PageBandMark } from "./PageBandMark";
import { PagePlate } from "./PagePlate";
import { designTokens } from "@/lib/design-system/tokens";

describe("shared lead-band mark", () => {
  it("renders one decorative mark using only the brand red and blue", () => {
    const { container } = render(<PageBandMark className="example-band" />);
    expect(container.firstElementChild).toHaveClass("page-band-mark", "example-band");
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
    expect(container.firstElementChild?.children).toHaveLength(0);

    const mark = readFileSync("public/brand/project-end-mark.svg", "utf8");
    const colors = [...mark.matchAll(/fill="(#[0-9A-Fa-f]{6})"/g)].map((match) => match[1]);
    expect(new Set(colors)).toEqual(new Set([designTokens.color.blue, designTokens.color.red]));
    expect(mark).not.toMatch(/rx=|stroke-linecap="round"/);
    const css = readFileSync("src/components/site/page-family.css", "utf8");
    expect(css).toMatch(/\.page-band-mark \{[^}]*width: clamp\(155px, 18\.8vw, 235px\);[^}]*height: 40px;[^}]*project-end-mark\.svg\?v=8/);
  });

  it("appears in the standard PagePlate lead band", () => {
    const { container } = render(<PagePlate index="03" kicker="Our Work" title="Work across six disciplines" lead="Explore our projects." />);
    expect(container.querySelectorAll(".page-plate-band .page-band-mark")).toHaveLength(1);
  });
});
