import { readFileSync } from "node:fs";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ServicesPageClient } from "@/features/services/services-page-client";
import { ProjectsPageClient } from "@/features/projects/projects-page-client";
import { ContactPageClient } from "@/features/contact/contact-page-client";
import { getSiteConfig, listProjects, listServices } from "@/content/testing";

describe("shared closing poster", () => {
  const routes = [
    ["services", () => <ServicesPageClient services={listServices()} />],
    ["projects", () => <ProjectsPageClient projects={listProjects()} />],
    ["contact", () => <ContactPageClient site={getSiteConfig()} faqs={[]} />],
  ] as const;

  it.each(routes)("uses one poster and footer seam on %s, even with streamed siblings", (route, page) => {
    const { container } = render(<>
      <main>{page()}</main>
      <script type="application/json">{"{}"}</script>
      <div aria-hidden="true" data-route-announcer="" />
      <footer className="refined-footer"><div className="footer-rail" /></footer>
    </>);
    const chapter = container.querySelector(`.${route}-page > .closing-chapter`)!;
    expect(chapter).toBeInTheDocument();
    expect(chapter.querySelectorAll(".closing-panel-composition")).toHaveLength(1);
    expect(chapter.querySelectorAll(".closing-chapter-border")).toHaveLength(1);
    expect(chapter.querySelector(".closing-panel-body > .closing-panel-concrete--lower")).toHaveAttribute("aria-hidden", "true");
    expect(chapter.querySelector(".closing-panel-scroll-cue")).toBeNull();
    expect(container.querySelector("main:has(> .page-family > .closing-chapter) ~ .refined-footer .footer-rail")).toBeInTheDocument();
  });

  it("owns the concrete alignment and row sizing in shared styles only", () => {
    const css = readFileSync("src/components/site/page-family.css", "utf8");
    expect(css).toMatch(/\.closing-panel-concrete--lower \{[^}]*top: auto;[^}]*bottom: 0;[^}]*height: 66\.666667%/);
    expect(css).toMatch(/\.closing-panel-heading \{[^}]*min-height: clamp\(26rem, 35\.2cqw, 32rem\)/);
    expect(css).toMatch(/\.closing-panel-body \{[^}]*min-height: clamp\(24rem, 34\.75cqw, 30rem\)/);
    expect(css).toMatch(/\.closing-panel-body \{[^}]*grid-template-rows: minmax\(min-content, 1fr\) auto/);
    expect(css).toContain("main:has(> .page-family > .closing-chapter) ~ .refined-footer .footer-rail");
    for (const path of ["src/features/services/services-page.css", "src/components/site/project-catalog.css", "src/features/contact/contact-page.css"]) {
      expect(readFileSync(path, "utf8")).not.toMatch(/\.closing-panel-(?:concrete|heading|body)/);
    }
  });

  it("inherits the same grain opacity as other dark surfaces without a muted poster override", () => {
    const css = readFileSync("src/components/site/page-family.css", "utf8");
    const globalCss = readFileSync("src/app/globals.css", "utf8");
    expect(css).not.toMatch(/\.closing-panel-grain\s*\{[^}]*opacity:/);
    expect(globalCss).toMatch(/\.grain-texture\{[^}]*opacity:\.07/);
  });
});
