import { render, screen, within } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { listProjects } from "@/content/testing";
import ProjectDetailPage from "./project-detail-page";

describe("ProjectDetailPage", () => {
  it.each(listProjects().map((project) => project.slug))("uses the shared framed opening on %s", async slug => {
    const { container } = render(await ProjectDetailPage({ params: Promise.resolve({ slug }) }));
    const page = container.querySelector(".project-detail");
    const body = page?.querySelector(".project-detail-source > .project-detail-body");
    expect(body?.querySelector(":scope > .project-detail-grain")).toHaveAttribute("aria-hidden", "true");
    expect(body?.querySelector(":scope > .project-detail-sides.page-side-borders")).toHaveAttribute("aria-hidden", "true");
    expect(page?.querySelector(".page-plate--roomy .page-plate-field--crosshair")).toBeInTheDocument();
    expect(page?.querySelector(".page-plate-band .page-band-mark")).toBeInTheDocument();
    expect(page?.querySelector(":scope > .closing-chapter-source + .closing-chapter")).toBeInTheDocument();
    expect(page?.querySelector(".project-detail-source > .project-detail-scroll-texture > .project-detail-scroll-grain")).toHaveAttribute("aria-hidden", "true");
    expect(page?.querySelector(".project-detail-scroll-texture > .chapter-scroll-bar")).toBeInTheDocument();
    expect(page?.querySelector(".closing-panel--chapter")).toBeInTheDocument();
    expect(within(page as HTMLElement).getByRole("link", { name: /Start a conversation/ })).toHaveAttribute("href", "/contact");
  });

  it("keeps the return strip at the shared sticky subnav height and spaces the detail sections", () => {
    const css = readFileSync("src/features/projects/project-detail.css", "utf8");
    expect(css).toMatch(/\.detail-return \{[^}]*position: sticky;[^}]*top: calc\(var\(--ds-layout-gutter\) \+ 58px\);[^}]*height: var\(--pf-subnav-height\)/);
    expect(css).toMatch(/\.project-detail \.detail-layout \{[^}]*margin-top: clamp\(6rem, 12vw, 10\.5rem\)/);
    expect(css).toMatch(/\.detail-related \{[^}]*margin-top: clamp\(7\.5rem, 13\.75vw, 12\.5rem\)/);
    expect(css).toMatch(/\.project-detail-body \{[^}]*padding-bottom: clamp\(6\.5625rem, 13\.125vw, 10\.5rem\)/);
    expect(css).toMatch(/\.project-detail-body > \.project-detail-grain \{[^}]*top: calc\(-1 \* \(var\(--ds-layout-header\) \+ var\(--ds-layout-gutter\) \* 2\)\)/);
    expect(css).toMatch(/\.project-detail-body > \.project-detail-grain \{[^}]*height: calc\(100% \+ var\(--ds-layout-header\) \+ var\(--ds-layout-gutter\) \* 2\)/);
    expect(css).toMatch(/\.project-detail-sides\.shell \{[^}]*top: calc\(-1 \* \(var\(--ds-layout-header\) \+ var\(--ds-layout-gutter\) \* 2\)\)/);
  });

  it.each(listProjects().map((project) => project.slug))("places location and year in the intro and description after services on %s", async (slug) => {
    const project = listProjects().find((entry) => entry.slug === slug)!;
    const description = project.description!;
    const location = project.location!;
    const { container } = render(await ProjectDetailPage({ params: Promise.resolve({ slug }) }));
    const intro = container.querySelector<HTMLElement>(".page-plate-band")!;
    const metadata = container.querySelector<HTMLElement>(".detail-metadata")!;

    expect(within(intro).getByText(location)).toBeInTheDocument();
    expect(within(intro).getByText(String(project.year))).toBeInTheDocument();
    expect(within(intro).queryByText(description)).not.toBeInTheDocument();
    expect(Array.from(metadata.querySelectorAll("dt"), (term) => term.textContent)).toEqual(["Services", "Description"]);
    expect(within(metadata).getByText(description)).toBeInTheDocument();
    expect(screen.queryByText("Client")).not.toBeInTheDocument();
  });

  it.each(listProjects().map((project) => project.slug))("keeps all images non-interactive on %s", async (slug) => {
    const project = listProjects().find((entry) => entry.slug === slug)!;
    render(await ProjectDetailPage({ params: Promise.resolve({ slug }) }));

    expect(screen.getByRole("img", { name: project.title })).toHaveClass("object-cover");
    expect(document.querySelector(".detail-cover a")).toBeNull();
    const gallery = document.querySelector<HTMLElement>(".detail-gallery");
    if (project.gallery?.length) {
      expect(gallery).not.toBeNull();
      expect(gallery!.querySelectorAll(".gallery-image")).toHaveLength(project.gallery.length);
      expect(within(gallery!).queryAllByRole("link")).toHaveLength(0);
      project.gallery.forEach((image) => {
        expect(within(gallery!).getByRole("img", { name: image.alt })).toHaveClass("object-cover");
      });
    } else {
      expect(gallery).toBeNull();
    }
    expect(screen.queryByRole("link", { name: /View full-size image/ })).not.toBeInTheDocument();
    expect(document.querySelector(".detail-gallery figcaption")).toBeNull();
    expect(screen.queryByText("View full-size ↗")).not.toBeInTheDocument();
  });

  it("shows four image-first related projects instead of previous and next navigation", async () => {
    render(await ProjectDetailPage({ params: Promise.resolve({ slug: "storyworks-campus" }) }));
    const heading = screen.getByRole("heading", { name: "Explore other projects" });
    expect(heading.parentElement).toHaveClass("detail-gallery");
    expect(heading.parentElement?.lastElementChild).toBe(heading);
    expect(heading.querySelector(".detail-related-arrow svg")).toBeInTheDocument();
    expect(heading.querySelector(".detail-related-arrow")).toHaveAttribute("aria-hidden", "true");
    const related = screen.getByRole("navigation", { name: "Related projects" });
    expect(related.parentElement).not.toContainElement(heading);
    expect(related.querySelectorAll("a")).toHaveLength(4);
    expect(screen.queryByText("Previous project")).not.toBeInTheDocument();
    expect(screen.queryByText("Next project")).not.toBeInTheDocument();
  });

  it("gives the services register extra top space and uses the smaller title tier for related work", () => {
    const css = readFileSync("src/features/projects/project-detail.css", "utf8");
    expect(css).toMatch(/\.project-detail \.detail-metadata > div:first-child \{[^}]*padding-top: 2rem/);
    expect(css).toMatch(/\.detail-related-heading \{[^}]*font-size: var\(--ds-typography-title-lg-size\)/);
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\) \{[^}]*\.detail-related-arrow \{[^}]*animation: none/);
  });

  it.each(["flock-house", "boba-friend-pop-up"])("aligns the related heading with the cover when no gallery exists on %s", async (slug) => {
    render(await ProjectDetailPage({ params: Promise.resolve({ slug }) }));
    const heading = screen.getByRole("heading", { name: "Explore other projects" });
    expect(heading).toHaveClass("shell");
    expect(heading.previousElementSibling).toHaveClass("detail-layout");
    expect(heading.nextElementSibling).toHaveClass("detail-related");
    const css = readFileSync("src/features/projects/project-detail.css", "utf8");
    expect(css).toMatch(/\.detail-layout \+ \.detail-related-heading\.shell \{[^}]*margin-inline: auto/);
  });
});
