import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PagePlate } from "./PagePlate";

describe("PagePlate presentation scale", () => {
  it.each([
    [1, undefined, false],
    [2, undefined, true],
    [1, "section", true],
    [2, "page", false],
  ] as const)("keeps level %i semantic with size %s", (level, size, compact) => {
    const { container } = render(
      <PagePlate index="04" kicker="Contact" title="A clear heading" level={level} size={size} headingId="test-heading" />,
    );
    expect(screen.getByRole("heading", { level, name: "A clear heading" })).toHaveAttribute("id", "test-heading");
    expect(container.querySelector(".page-plate")?.classList.contains("page-plate--section")).toBe(compact);
  });
});
