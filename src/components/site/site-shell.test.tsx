import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SiteShell } from "./site-shell";
import { HomePageClient } from "@/features/home/home-page-client";
import { getHomeContent } from "@/content/testing";

const navigation = vi.hoisted(() => ({ pathname: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => navigation.pathname }));

describe("shared shell ownership", () => {
  it("keeps the homepage header fixed outside the chapters and the footer in the final chapter", () => {
    navigation.pathname = "/";
    const { container } = render(<SiteShell header={<header role="banner">Header slot</header>} footer={<footer role="contentinfo">Footer slot</footer>}>
      <HomePageClient content={getHomeContent()} />
    </SiteShell>);
    expect(screen.getAllByRole("main")).toHaveLength(1);
    expect(screen.getByRole("main")).toHaveAttribute("tabindex", "-1");
    // jsdom's role query treats section-local headers as banners; Chrome AX
    // landmark uniqueness is checked separately in the browser evidence.
    expect(container.querySelectorAll('[role="banner"]')).toHaveLength(1);
    expect(screen.getByRole("main")).not.toContainElement(container.querySelector('[role="banner"]'));
    expect(screen.getByText("Header slot").closest(".home-chapter")).toBeNull();
    expect(screen.getByRole("contentinfo").closest(".home-chapter")).toHaveAttribute("id", "new-work");
    expect(container.querySelectorAll(".home-chapter")).toHaveLength(4);
    expect(container.querySelector(".home-chapter-stack")).toHaveAttribute("data-chapter-motion", "flow");
    expect(container.querySelectorAll(".pin-spacer")).toHaveLength(0);
  });
  it("keeps ordinary route slots outside the sole main", () => {
    navigation.pathname = "/services";
    render(<SiteShell header={<header role="banner">Header slot</header>} footer={<footer role="contentinfo">Footer slot</footer>}><h1>Services</h1></SiteShell>);
    expect(screen.getAllByRole("banner")).toHaveLength(1);
    expect(screen.getAllByRole("contentinfo")).toHaveLength(1);
    expect(screen.getByRole("main")).not.toContainElement(screen.getByRole("banner"));
    expect(screen.getByRole("main")).not.toContainElement(screen.getByRole("contentinfo"));
  });
});
