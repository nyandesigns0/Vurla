import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ColorCopyButton } from "./color-copy-button";
import { designTokens } from "@/lib/design-system/tokens";
import { contrastRatio } from "@/lib/design-system/color-families";

afterEach(() => vi.restoreAllMocks());

describe("living guide color copying", () => {
  it("copies the exact token value and announces success only after the clipboard accepts it", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    render(<ColorCopyButton name="red" value="#B22D18" />);
    fireEvent.click(
      screen.getByRole("button", { name: "Copy red #B22D18" }),
    );
    expect(writeText).toHaveBeenCalledWith("#B22D18");
    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent("Copied red"),
    );
  });

  it("reports clipboard failure with a usable manual value instead of claiming success", async () => {
    const writeText = vi.fn().mockRejectedValue(new Error("Clipboard denied"));
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    render(<ColorCopyButton name="graphite" value="#505050" />);
    fireEvent.click(
      screen.getByRole("button", { name: "Copy graphite #505050" }),
    );
    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent(
        "Copy unavailable. Select the value #505050 manually.",
      ),
    );
    expect(screen.getByRole("status")).not.toHaveTextContent("Copied");
  });

  it("keeps every normal-text label on a compliant night surface outside the decorative color fill", () => {
    const { container } = render(
      <>
        {Object.entries(designTokens.color).map(([name, value]) => (
          <ColorCopyButton key={name} name={name} value={value} />
        ))}
      </>,
    );
    for (const button of screen.getAllByRole("button"))
      expect(button).toHaveStyle({
        background: designTokens.color.night,
        color: designTokens.color.paper,
      });
    for (const fill of container.querySelectorAll(".color-swatch-fill")) {
      expect(fill).toHaveTextContent("");
      expect(fill).toHaveAttribute("aria-hidden", "true");
    }
    expect(
      contrastRatio(designTokens.color.paper, designTokens.color.night),
    ).toBeGreaterThanOrEqual(4.5);
  });
});
