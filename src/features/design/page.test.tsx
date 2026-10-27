import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import DesignGuidePage from "./page";
import { designTokens } from "@/lib/design-system/tokens";

describe("six-color design guide", () => {
  it("renders each physical swatch once and semantic references without extra swatches", () => {
    const { container } = render(<DesignGuidePage />);
    expect(container.querySelectorAll(".color-swatch-fill")).toHaveLength(6);
    expect(screen.getAllByRole("button", { name: /^Copy / })).toHaveLength(6);
    for (const [name, value] of Object.entries(designTokens.color)) {
      expect(screen.getByRole("button", { name: `Copy ${name} ${value}` })).toBeInTheDocument();
    }
    expect(screen.getByRole("heading", { name: "Semantic roles" })).toBeInTheDocument();
    expect(container.querySelectorAll(".semantic-role-table dt")).toHaveLength(Object.keys(designTokens.semanticColor).length);
    expect(screen.getByText("Toner grain / print surface")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Purposeful and interruptible" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Complete without motion" })).toBeInTheDocument();
  });
});
