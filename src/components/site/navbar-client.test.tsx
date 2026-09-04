import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { getSiteConfig } from "@/content/testing";
import { NavbarClient } from "./navbar-client";

vi.mock("next/navigation", () => ({ usePathname: () => "/projects/baker-house" }));

describe("NavbarClient", () => {
  it("identifies Projects as the current section on detail pages in both menus", () => {
    render(<NavbarClient links={getSiteConfig().navigation} />);

    expect(screen.getByRole("link", { name: "Projects" })).toHaveAttribute("aria-current", "location");
    expect(screen.getByRole("link", { name: "Home" })).not.toHaveAttribute("aria-current");
    fireEvent.click(screen.getByRole("button", { name: "Toggle menu" }));
    for (const link of screen.getAllByRole("link", { name: "Projects" })) {
      expect(link).toHaveAttribute("aria-current", "location");
    }
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.getByRole("button", { name: "Toggle menu" })).toHaveAttribute("aria-expanded", "false");
  });
});
