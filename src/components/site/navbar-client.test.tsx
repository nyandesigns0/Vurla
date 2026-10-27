import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { getSiteConfig } from "@/content/testing";
import { NavbarClient } from "./navbar-client";

vi.mock("next/navigation", () => ({ usePathname: () => "/projects/baker-house" }));

describe("NavbarClient", () => {
  it("identifies Projects as the current section on detail pages in both menus", () => {
    render(<NavbarClient links={getSiteConfig().navigation} />);

    expect(within(screen.getByRole("navigation", { name: "Main navigation" })).getAllByRole("link").map((link) => link.textContent))
      .toEqual(["Home", "Services", "Projects", "Contact"]);
    expect(screen.getByRole("link", { name: "Projects" })).toHaveAttribute("aria-current", "location");
    expect(screen.getByRole("link", { name: "Home" })).not.toHaveAttribute("aria-current");
    fireEvent.click(screen.getByRole("button", { name: "Toggle menu" }));
    expect(within(screen.getByRole("navigation", { name: "Mobile navigation" })).getAllByRole("link").map((link) => link.textContent))
      .toEqual(["Home", "Services", "Projects", "Contact"]);
    for (const link of screen.getAllByRole("link", { name: "Projects" })) {
      expect(link).toHaveAttribute("aria-current", "location");
    }
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.getByRole("button", { name: "Toggle menu" })).toHaveAttribute("aria-expanded", "false");
  });
});
