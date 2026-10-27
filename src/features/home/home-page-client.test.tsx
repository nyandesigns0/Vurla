import { readFileSync } from "node:fs";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getHomeContent, listServices } from "@/content/testing";
import { capabilityIconIds } from "@/content/contracts";
import { HomePageClient } from "./home-page-client";
import { ServicesPageClient } from "@/features/services/services-page-client";

describe("HomePageClient", () => {
  it("keeps the spatial room and copy in the flexible hero stage before the statistics rail", () => {
    const { container } = render(<HomePageClient content={getHomeContent()} />);
    const chapter = container.querySelector<HTMLElement>("#hero")!;
    const plate = chapter.querySelector<HTMLElement>(":scope > .home-chapter-plate")!;
    const stage = plate.querySelector<HTMLElement>(":scope > .hero-stage")!;
    const statistics = plate.querySelector<HTMLElement>(":scope > .statistics-bar")!;

    expect(container.querySelectorAll(".home-chapter > .home-chapter-plate")).toHaveLength(4);
    expect(Array.from(container.querySelectorAll<HTMLElement>(".home-chapter-stack > .home-chapter"), (chapter) => chapter.id))
      .toEqual(["hero", "services", "projects", "new-work"]);
    expect(container.querySelector(".services-intro-number")).toHaveTextContent("02");
    expect(container.querySelector(".selected-intro-number")).toHaveTextContent("03");
    expect(stage).toContainElement(chapter.querySelector(".hero-copy"));
    expect(stage).toContainElement(chapter.querySelector(".spatial-hero"));
    const copyPanel = chapter.querySelector<HTMLElement>(".hero-copy-panel")!;
    expect(copyPanel.querySelector(".hero-copy-divider, .hero-project-meta, p")).not.toBeInTheDocument();
    expect(copyPanel).toBeVisible();
    expect(copyPanel).not.toHaveAttribute("data-temporarily-hidden");
    expect(screen.queryByText(/spatial practice/i)).not.toBeInTheDocument();
    expect(plate.lastElementChild).toBe(statistics);
  });

  it("preserves the authored statistics and selected-project narrative order", () => {
    const content = getHomeContent();
    const { container } = render(<HomePageClient content={content} />);

    const statistics = screen.getByRole("region", { name: "Practice statistics" });
    expect(container.querySelector(".selected-editorial")).toHaveClass("shell");
    const sideDividers = container.querySelectorAll(".projects-side-dividers > .projects-side-divider");
    expect(sideDividers).toHaveLength(2);
    sideDividers.forEach((divider) => {
      expect(divider).toHaveClass("divider-line");
      expect(divider).toHaveAttribute("data-orientation", "vertical");
    });
    expect(statistics).toHaveAttribute("tabindex", "0");
    expect(statistics).toHaveTextContent("50+Projects completed10+Years of excellence5+Awards won100%Client satisfaction");
    expect(
      Array.from(statistics.querySelectorAll<HTMLImageElement>(".statistic-icon-frame img"), (image) => image.getAttribute("src")),
    ).toEqual([
      "/icons/statistics/projects-generated-r2.svg",
      "/icons/statistics/experience-generated-r2.svg",
      "/icons/statistics/awards-generated-r2.svg",
      "/icons/statistics/satisfaction-generated-r2.svg",
    ]);
    expect(screen.getAllByRole("link", { name: /^Open / }).map((link) => link.getAttribute("href"))).toEqual([
      "/projects/baker-house",
      "/projects/terraced-garden-retreat",
      "/projects/storyworks-campus",
      "/projects/stitching-west-baltimore",
      "/projects/la-puente-residence-renewal",
      "/projects/lunar-habitat-immersion",
    ]);
    const collection = container.querySelector(".selected-collection");
    expect(collection).toHaveTextContent(/Explore the\s*full collection\./);
    expect(collection?.querySelector("a")).toHaveAttribute("href", "/projects");
    const projectsScrollPanel = container.querySelector(".projects-scroll-panel");
    expect(projectsScrollPanel).toHaveClass("shell", "chapter-scroll-panel");
    expect(projectsScrollPanel?.previousElementSibling).toBe(container.querySelector(".selected-editorial"));
    expect(projectsScrollPanel?.querySelector(".scroll-cue-copy")).toHaveTextContent("Scroll to explore");
    const servicesScrollPanel = container.querySelector(".services-scroll-panel");
    expect(servicesScrollPanel).toHaveClass("shell", "chapter-scroll-panel");
    const servicesScrollShell = container.querySelector(".services-scroll-panel-shell");
    expect(servicesScrollShell?.previousElementSibling).toBe(container.querySelector(".service-dossiers"));
    expect(servicesScrollPanel?.parentElement).toBe(servicesScrollShell);
    expect(servicesScrollPanel?.querySelector(".scroll-cue-copy")).toHaveTextContent("Scroll to explore");
    const servicesScrollDivider = servicesScrollShell?.querySelector(".services-scroll-divider");
    expect(servicesScrollDivider).toHaveClass("divider-line");
    expect(servicesScrollDivider).toHaveAttribute("data-orientation", "horizontal");
    const css = readFileSync("src/app/globals.css", "utf8");
    expect(css).toContain(".services-scroll-panel{--scroll-cue-accent-a:var(--blue);background:var(--night)}");
    expect(css).toContain(".services-scroll-panel-shell{position:relative}");
    expect(css).toContain(".services-chapter .services-scroll-panel-shell { background: var(--red); }");
    expect(css).toMatch(/\.services-chapter \.services-scroll-panel \{[^}]*--scroll-cue-accent-b: var\(--paper\);[^}]*background: transparent/);
    expect(css).toContain(".services-scroll-divider.divider-line{--divider-line-color:var(--paper);position:absolute;z-index:1;top:0;left:0;width:100%}");
  });

  it("uses the same responsive index-rail width in chapters 02 and 03", () => {
    const css = readFileSync("src/app/globals.css", "utf8");
    expect(css).toMatch(/\.selected-editorial > \.selected-intro,\s*\.services-chapter \.services-intro\.chapter-heading \{\s*--home-index-rail-width: clamp\(52px, 6vw, 80px\)/);
    for (const selector of [".selected-editorial > .selected-intro", ".services-chapter .services-intro.chapter-heading"]) {
      const start = css.indexOf(`${selector} {`, css.indexOf("--home-index-rail-width"));
      expect(start).toBeGreaterThan(-1);
      const rule = css.slice(start, css.indexOf("}", start));
      expect(rule).toContain("grid-template-columns: var(--home-index-rail-width) minmax(0, 1fr)");
    }
  });

  it("places the selected-projects white cell below the headline without changing the panel dimensions", () => {
    const { container } = render(<HomePageClient content={getHomeContent()} />);
    const intro = container.querySelector(".selected-intro")!;
    const content = intro.querySelector(".selected-intro-content")!;
    expect(content.firstElementChild).toHaveClass("selected-intro-headline");
    expect(content.lastElementChild).toHaveClass("selected-intro-caption");

    const css = readFileSync("src/app/globals.css", "utf8");
    expect(css).toContain("--selected-intro-bottom-inset: clamp(20px, 6.3cqw, 34px)");
    expect(css).toMatch(/\.selected-editorial > \.selected-intro \{[^}]*width: 100%;[^}]*max-height: 500px/);
    expect(css).toMatch(/\.selected-intro-rail \{[^}]*--section-rail-bottom-inset: calc\(var\(--home-subtitle-padding-block\) \+ 8px\)/);
    expect(css).toMatch(/\.selected-intro-headline \{[^}]*align-items: flex-end;[^}]*padding: 0 6\.3% var\(--selected-intro-bottom-inset\)/);
    expect(css).toMatch(/\.selected-intro-content \{[^}]*grid-template-rows: minmax\(0, 1fr\) auto/);
    expect(css).toMatch(/\.selected-intro-caption \{[^}]*border-top: var\(--selected-intro-rule\) solid var\(--mineral\)/);
  });

  it("matches the homepage Services and Projects subtitle padding with content-sized rows", () => {
    const css = readFileSync("src/app/globals.css", "utf8");
    expect(css).toContain("--home-subtitle-padding-block: 32px;");
    expect(css).toMatch(/\.selected-intro-caption \{[^}]*padding: var\(--home-subtitle-padding-block\) 6\.3%/);
    expect(css).toMatch(/\.services-intro-promise \{[^}]*padding-block: var\(--home-subtitle-padding-block\)/);
    expect(css).toMatch(/\.services-chapter \.services-intro-message \{[^}]*grid-template-rows: minmax\(0, 1fr\) auto/);
  });

  it("bottom-aligns the services index and headline within their panels", () => {
    const css = readFileSync("src/app/globals.css", "utf8");
    expect(css).toContain("--services-intro-bottom-inset: clamp(1.5rem, 3vw, 2.5rem)");
    expect(css).toMatch(/\.services-chapter \.services-intro\.chapter-heading \{[^}]*min-height: clamp\(26rem, 32vw, 450px\);[^}]*max-height: 450px/);
    expect(css).toMatch(/\.services-intro-rail \{[^}]*--section-rail-bottom-inset: calc\(var\(--home-subtitle-padding-block\) \+ 8px\)/);
    expect(css).toMatch(/\.services-intro-statement \{[^}]*align-items: flex-end;[^}]*padding-bottom: var\(--services-intro-bottom-inset\)/);
  });

  it("uses the migrated estimate CTA", () => {
    const { container } = render(<HomePageClient content={getHomeContent()} />);
    const copyPanel = container.querySelector<HTMLElement>(".hero-copy-panel")!;

    expect(copyPanel.querySelector<HTMLAnchorElement>('a[href="/contact"]')).toHaveTextContent("Request an estimate");
    expect(copyPanel.querySelector('a[href="/projects"] svg.lucide-arrow-up-right')).toHaveAttribute("aria-hidden", "true");
    expect(copyPanel.querySelector('a[href="/contact"] svg.lucide-file-text')).toHaveAttribute("aria-hidden", "true");
    expect(copyPanel).toHaveTextContent("Vision & Uniqueness in Real Living Areas.");
    expect(screen.getByRole("heading", { name: "Give your next idea a place." })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Start a conversation →" })).toHaveAttribute("href", "/contact");
  });

  it("pins both hero actions to the bottom of a fixed-height copy panel", () => {
    const { container } = render(<HomePageClient content={getHomeContent()} />);
    const panel = container.querySelector<HTMLElement>(".hero-copy-panel")!;
    expect(panel.querySelectorAll(":scope > .actions > a")).toHaveLength(2);

    const css = readFileSync("src/app/globals.css", "utf8");
    const panelRule = css.match(/\.hero-copy-panel \{([^}]*)\}/)![1];
    const actionRule = css.match(/\.hero-copy-panel \.actions \{([^}]*)\}/)![1];
    expect(panelRule).toContain("height:20rem");
    expect(panelRule).toContain("flex-direction:column");
    expect(actionRule).toContain("margin-top:auto");
    expect(panelRule).toContain("--hero-heading-size:clamp(2.2rem,3.4vw,3.8rem)");
    expect(css).toContain("align-items:center; justify-content:center; height:calc(3 * .92 * var(--hero-heading-size))");
    expect(css).toContain(".hero-copy-panel{height:22rem;--hero-heading-size:1.85rem}");
    expect(css).toContain(".hero-copy-panel>h1 { animation:hero-copy-enter");
    expect(css).not.toContain(".hero-copy-panel>* { animation:");
    expect(css).toContain("--hero-action-hover:color-mix(in srgb,var(--blue) 70%,var(--paper))");
    expect(css).toMatch(/\.hero-copy-panel \.ui-button--default:hover,\s*\.hero-copy-panel \.ui-button--default:focus-visible \{ background:var\(--hero-action-hover\); color:var\(--night\); border-color:var\(--paper\); \}/);
    expect(css).toMatch(/\.hero-copy-panel \.ui-button--outline:hover,[^{]+\{ background:var\(--hero-action-hover\); color:var\(--night\); border-color:var\(--paper\); \}/);
  });

  it("reuses the main copy panel for project hover and removes the separate project card", () => {
    const content = getHomeContent();
    const project = content.heroProjects[1];
    const { container } = render(<HomePageClient content={content} />);
    const panel = container.querySelector<HTMLElement>(".hero-copy-panel")!;

    expect(screen.queryByRole("complementary", { name: "Project controls" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: new RegExp(`^View ${project.title} →$`) })).not.toBeInTheDocument();

    const projectSurface = screen.getByRole("link", { name: `View ${project.title}` });
    fireEvent.pointerEnter(projectSurface);

    expect(panel.querySelector("h1")).toHaveTextContent(project.title);
    expect(panel).toHaveAttribute("data-project-preview", "active");
    expect(panel.querySelector("p")).not.toBeInTheDocument();

    fireEvent.pointerLeave(projectSurface);
    expect(panel.querySelector("h1")).toHaveTextContent("Vision & Uniqueness in Real Living Areas.");
    expect(panel).toHaveAttribute("data-project-preview", "idle");
  });

  it("links all six service summaries to matching service sections", () => {
    const services = listServices();
    const { rerender } = render(<HomePageClient content={getHomeContent()} />);
    const hrefs = screen.getAllByRole("link", { name: "View full service" }).map((link) => link.getAttribute("href"));

    expect(hrefs).toEqual([
      "/services#architecture",
      "/services#interior",
      "/services#landscape",
      "/services#construction",
      "/services#fabrication",
      "/services#digital-solutions",
    ]);
    expect(screen.getAllByRole("listitem")).toHaveLength(36);
    expect(screen.getAllByRole("list", { name: /capabilities/ })).toHaveLength(6);

    rerender(<ServicesPageClient services={services} />);
    for (const href of hrefs) {
      expect(document.getElementById(href!.split("#")[1])).toBeInTheDocument();
    }
  });

  it("uses one normalized semantic capability icon for each of the 36 capabilities", () => {
    const services = listServices();
    const ids = services.flatMap((service) => service.subItems.map((item) => item.capabilityIcon));
    expect(ids).toEqual([...capabilityIconIds]);
    expect(new Set(ids).size).toBe(36);

    const { container } = render(<HomePageClient content={getHomeContent()} />);
    const icons = container.querySelectorAll(".service-dossier li svg");
    expect(icons).toHaveLength(36);
    for (const icon of icons) {
      expect(icon).toHaveAttribute("viewBox", "0 0 24 24");
      expect(icon).toHaveAttribute("fill", "none");
      expect(icon).toHaveAttribute("stroke", "currentColor");
      expect(icon).toHaveAttribute("stroke-width", "1.5");
      expect(icon).toHaveAttribute("stroke-linecap", "square");
      expect(icon).toHaveAttribute("stroke-linejoin", "miter");
    }
  });

});
