import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { HeroGlitchHeading } from "./hero-glitch-heading";

function motion(reduced: boolean) {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: reduced,
    media: query,
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent: () => false,
  }));
}

describe("HeroGlitchHeading", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("does not glitch on first render", () => {
    motion(false);
    const { container } = render(<HeroGlitchHeading id="hero-heading" text="Vision & Uniqueness in Real Living Areas." />);
    expect(container.querySelector(".hero-glitch")).toHaveAttribute("data-glitch", "idle");
    expect(container.querySelector(".hero-glitch-layers")).not.toBeInTheDocument();
  });

  it("runs an aria-hidden red/blue decode glitch on text change and settles on the real title", async () => {
    motion(false);
    const { container, rerender } = render(<HeroGlitchHeading id="hero-heading" text="Vision & Uniqueness in Real Living Areas." />);
    rerender(<HeroGlitchHeading id="hero-heading" text="Lunar Habitat Immersion" />);

    const glitch = container.querySelector(".hero-glitch")!;
    expect(glitch).toHaveAttribute("data-glitch", "active");
    expect(container.querySelector(".hero-glitch-layers")).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelector(".hero-glitch-red")).toBeInTheDocument();
    expect(container.querySelector(".hero-glitch-blue")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "Lunar Habitat Immersion" })).toHaveAttribute("id", "hero-heading");

    await waitFor(() => expect(glitch).toHaveAttribute("data-glitch", "idle"), { timeout: 2000 });
    expect(container.querySelector(".hero-glitch-layers")).not.toBeInTheDocument();
    expect(container.querySelector("h1")).toHaveTextContent(/^Lunar Habitat Immersion$/);
  });

  it("never overlays a previous title's scramble when titles change mid-glitch", () => {
    motion(false);
    const { container, rerender } = render(<HeroGlitchHeading id="hero-heading" text="Vision & Uniqueness in Real Living Areas." />);
    rerender(<HeroGlitchHeading id="hero-heading" text="Lunar Habitat Immersion" />);
    rerender(<HeroGlitchHeading id="hero-heading" text="Baker House" />);
    const decode = container.querySelector(".hero-glitch-decode");
    expect(decode?.textContent).toHaveLength("Baker House".length);
    expect(decode?.textContent?.indexOf(" ")).toBe("Baker House".indexOf(" "));
  });

  it("swaps text without glitch layers under reduced motion", () => {
    motion(true);
    const { container, rerender } = render(<HeroGlitchHeading id="hero-heading" text="Vision & Uniqueness in Real Living Areas." />);
    rerender(<HeroGlitchHeading id="hero-heading" text="Baker House" />);
    expect(container.querySelector(".hero-glitch")).toHaveAttribute("data-glitch", "idle");
    expect(container.querySelector("h1")).toHaveTextContent(/^Baker House$/);
  });
});
