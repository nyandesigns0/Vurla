import { readFileSync } from "node:fs";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SectionRail } from "./SectionRail";
import { PagePlate } from "./PagePlate";
import { HomePageClient } from "@/features/home/home-page-client";
import { getHomeContent } from "@/content/testing";

describe("shared bottom-anchored section rail", () => {
  it("orders index, vertical label and decorative red square without absolute top markers", () => {
    const { container } = render(<SectionRail index="02" label="What we do" />);
    const rail = container.querySelector(".section-rail")!;
    expect([...rail.children].map(child => child.className)).toEqual(["section-rail-index", "section-rail-label", "section-rail-marker"]);
    expect(rail.firstElementChild).toHaveAttribute("aria-hidden", "true");
    expect(rail.lastElementChild).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByText("What we do")).not.toHaveAttribute("aria-hidden");
  });

  it("shares one font, gap and bottom-aligned layout at every screen size", () => {
    const css = readFileSync("src/components/site/section-rail.css", "utf8");
    expect(css).toContain("--section-rail-font-size: clamp(12px, 1.55vw, 24px)");
    expect(css).toContain("--section-rail-gap: 20px");
    expect(css).toContain("justify-content: flex-end");
    expect(css).toContain("writing-mode: vertical-rl");
    expect(css).toMatch(/\.section-rail-marker \{[^}]*background: var\(--red\)/);
    expect(readFileSync("src/components/site/page-family.css", "utf8")).not.toContain(".page-plate-rail::before");
  });

  it("reuses the same rail in both homepage chapters", () => {
    const { container } = render(<HomePageClient content={getHomeContent()} />);
    for (const selector of [".services-intro-rail", ".selected-intro-rail"]) {
      const rail = container.querySelector(selector)!;
      expect(rail).toHaveClass("section-rail");
      expect(rail.lastElementChild).toHaveClass("section-rail-marker");
    }
  });

  it("keeps opening textures and typography in the shared rail on inner pages", () => {
    const { container } = render(<PagePlate index="03" kicker="Vurla / Portfolio" title="Our Projects" lead="Explore our work." />);
    const rail = container.querySelector(".page-plate-rail")!;
    expect(rail).toHaveClass("section-rail");
    expect(rail.querySelector(".page-plate-index")).toHaveClass("section-rail-index");
    expect(rail.querySelector(".page-plate-kicker")).toHaveClass("section-rail-label");
    expect(rail.querySelectorAll(".dot-texture, .grain-texture")).toHaveLength(2);
    expect(rail.lastElementChild).toHaveClass("section-rail-marker");
  });
});
