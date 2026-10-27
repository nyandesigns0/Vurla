import { render, screen, within } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/content/server", () => ({
  getSiteConfig: () => ({
    email: "vurla.living@gmail.com",
    socialLinks: [
      { label: "Instagram", href: "https://www.instagram.com/vurlaliving1111/" },
      { label: "Facebook", href: "https://www.facebook.com/vurlaliving1111/" },
    ],
  }),
  listServices: () => [
    { id: "architecture", title: "Architecture" },
    { id: "interior", title: "Interior" },
    { id: "landscape", title: "Landscape" },
    { id: "construction", title: "Construction" },
    { id: "fabrication", title: "Fabrication" },
    { id: "digital-solutions", title: "Digital Solutions" },
  ],
}));

import { Footer } from "./Footer";

describe("Footer", () => {
  it("links the vertical wordmark to the homepage hero", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: "Vurla home, top of page" }))
      .toHaveAttribute("href", "/#hero");
  });

  it("adds 8px of breathing room between the wordmark and subtitle at every breakpoint", () => {
    const css = readFileSync("src/app/globals.css", "utf8");
    expect(css).toMatch(/\.footer-identity\{[^}]*gap:calc\(clamp\(\.8rem,1\.3vw,1\.5rem\) \+ 8px\)/);
    expect(css).toMatch(/@media\(max-width:767px\)\{[^\n]*\.footer-identity\{[^}]*gap:calc\(1\.1rem \+ 8px\)/);
  });

  it("keeps stable service labels and real contact destinations", () => {
    const { container } = render(<Footer />);
    const services = screen.getByRole("navigation", { name: "Services" });
    expect(within(services).getAllByRole("link")).toHaveLength(6);
    expect(within(services).getByRole("link", { name: "Architecture" })).toHaveAttribute("href", "/services#architecture");
    const emailLink = screen.getByRole("link", { name: /Email vurla\.living@gmail\.com/i });
    const instagramLink = screen.getByRole("link", { name: /Instagram View profile/i });
    const facebookLink = screen.getByRole("link", { name: /Facebook View page/i });
    expect(emailLink).toHaveAttribute("href", "mailto:vurla.living@gmail.com");
    expect(instagramLink).toHaveAttribute("href", "https://www.instagram.com/vurlaliving1111/");
    expect(facebookLink).toHaveAttribute("href", "https://www.facebook.com/vurlaliving1111/");
    expect(emailLink).toHaveClass("footer-scan-link");
    expect(instagramLink).toHaveClass("footer-scan-link");
    expect(facebookLink).toHaveClass("footer-scan-link");
    expect(screen.getByText(/Bring us in early/)).toBeInTheDocument();
    expect(container.querySelectorAll(".footer-scan-link")).toHaveLength(9);
    expect(container.querySelectorAll(".footer-services .footer-service-band")).toHaveLength(18);
    expect(container.querySelectorAll(".footer-contact-copy")).toHaveLength(3);
    expect(container.querySelectorAll(".footer-contact-scan")).toHaveLength(3);
    expect(container.querySelectorAll(".footer-contact-scan .footer-service-band")).toHaveLength(9);
    expect(container.querySelectorAll(".footer-contact-icon")).toHaveLength(3);
    expect(container.querySelectorAll(".footer-contact-icon-scan .footer-scan-band")).toHaveLength(9);
    expect(container.querySelectorAll(".footer-contact .footer-scan-accent")).toHaveLength(3);
    expect(container.querySelectorAll(".footer-inline-arrow-wrap")).toHaveLength(2);
    expect(container.querySelectorAll(".footer-inline-arrow-wrap > .footer-scan-base")).toHaveLength(2);
    expect(container.querySelectorAll(".footer-inline-arrow-scan .footer-scan-band")).toHaveLength(6);
    expect(container.querySelector(".footer-signal-icon")).toBeInTheDocument();
    expect(container.querySelector(".footer-new-work-arrow")).toBeInTheDocument();
    expect(container.textContent).not.toContain("↗");
  });
});
