import { readFileSync } from "node:fs";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getHomeContent } from "@/content/testing";
import { ServiceDossierRow } from "./ServiceDossierRow";

const services = getHomeContent().services;
const css = readFileSync("src/components/site/service-dossier.css", "utf8");
const railCss = readFileSync("src/components/site/technical-rail.css", "utf8");

function renderChapter() {
  return render(
    <div className="service-dossiers">
      {services.map((service) => <ServiceDossierRow key={service.id} service={service} />)}
    </div>,
  );
}

describe("ServiceDossierRow", () => {
  it("uses a clean diagonal CTA and enlarges the arrow and numeral over a red hover field", () => {
    const { container } = render(<ServiceDossierRow service={services[0]} />);
    const arrow = container.querySelector(".dossier-cta-arrow path");

    expect(arrow).toHaveAttribute("d", "M5 19 19 5M8 5h11v11");
    expect(css).not.toContain(".dossier-cta::before");
    expect(css).not.toContain(".dossier-cta::after");
    expect(css).toMatch(/\.dossier-cta-arrow \{[^}]*color: var\(--paper\)/);
    expect(css).toMatch(/\.dossier-statement-face--active \{[^}]*background-color: var\(--red\)/);
    expect(css).toContain('[data-pointer-hover="true"])::after');
    expect(css).toContain("transition: transform var(--ds-motion-base) var(--ds-motion-ease)");
    expect(css).toMatch(/\.dossier-statement-viewport \{[^}]*overflow: hidden/);
    expect(css).toMatch(/\.dossier-statement-face--active \{[^}]*transform: translateY\(-100%\)/);
    expect(css).toMatch(/\.dossier-statement:is\([^]*?\.dossier-statement-face--rest \{\s*transform: translateY\(100%\)/);
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\) \{[^}]*\.dossier-statement-face[^}]*transition: none/);
    expect(css).toContain("transform: scale(1.05)");
    expect(css).toContain("transform: translate(2px, -2px) scale(1.18)");
    expect(css).toMatch(/\.dossier-statement:focus-visible \{[^}]*outline: 2px solid var\(--paper\)/);
  });

  it("caps desktop rows at 300px while leaving stacked layouts uncapped", () => {
    expect(css).toMatch(/@media \(min-width: 1024px\) \{\s*\.service-dossier \{[^}]*max-height: 300px/);
    expect(css).toContain("height: calc(300px - var(--dossier-rail-height))");
    expect(css).toMatch(/@media \(min-width: 1024px\) \{[^]*?\.dossier-capability \{\s*min-height: calc\(70 \* var\(--su\)\)/);
  });

  it("keeps 18px of space on both sides of the title's red divider", () => {
    expect(css).toContain("--dossier-title-rule-gap: 18px");
    expect(css).toContain("top: calc(100% + var(--dossier-title-rule-gap))");
    expect(css).toContain("margin: calc(2 * var(--dossier-title-rule-gap) + 6 * var(--su)) 0");
    expect(css).not.toContain("margin-block: calc(20 * var(--su))");
  });

  it("aligns identity titles and statement numerals with 38px top padding", () => {
    expect(css).toContain("--dossier-heading-pad-top: 38px");
    expect(css).toMatch(/\.dossier-identity \{[^}]*padding-top: var\(--dossier-heading-pad-top\)/);
    expect(css).toMatch(/\.dossier-statement-face \{[^}]*padding-top: var\(--dossier-heading-pad-top\)/);
    expect(css).toMatch(/\.dossier-numeral \{[^}]*margin-top: 0/);
    expect(css).not.toContain("padding-block: calc(34 * var(--su))");
  });

  it("sets service labels in a heavier weight with more leading", () => {
    expect(css).toMatch(/\.dossier-title \{[^}]*font: 600 calc\(40 \* var\(--su\)\) \/ 1\.16 var\(--ds-font-mono\)/);
  });

  it("has no bottom divider between dossier rows", () => {
    const { container } = renderChapter();
    expect(container.querySelectorAll(".service-dossier > .divider-line")).toHaveLength(0);
    expect(css).not.toContain(".dossier-row-divider");
    expect(css).not.toContain(".service-dossier::after");
  });

  it("encloses the statement panel in a single night hairline on all sides", () => {
    expect(css).toMatch(/\.dossier-statement \{[^}]*border: var\(--dossier-hairline\) solid var\(--night\)/);
    expect(css).not.toMatch(/\.dossier-identity \{[^}]*border-right:/);
    expect(css).not.toMatch(/\.dossier-identity \{[^}]*border-bottom:/);
  });

  it("renders one dossier per authored service, keeping every title, link and anchor", () => {
    const { container } = renderChapter();

    expect(services).toHaveLength(6);
    expect(container.querySelectorAll(".service-dossier")).toHaveLength(6);

    expect(screen.getAllByRole("heading", { level: 3 }).map((heading) => heading.querySelector(".dossier-title-label")?.textContent))
      .toEqual(services.map((service) => service.title));
    expect(screen.getAllByRole("link", { name: "View full service" }).map((link) => link.getAttribute("href")))
      .toEqual(services.map((service) => service.href));
    for (const [index, row] of Array.from(container.querySelectorAll(".service-dossier")).entries()) {
      expect(row.querySelector(".dossier-identity .dossier-cta")).toBeNull();
      const statement = row.querySelector<HTMLAnchorElement>("a.dossier-statement");
      expect(statement).toHaveAttribute("href", services[index].href);
      expect(statement).toHaveAccessibleName("View full service");
      expect(statement?.querySelector("span.dossier-cta")).not.toBeNull();
      expect(statement?.querySelector("a")).toBeNull();
    }

    const ids = Array.from(container.querySelectorAll(".service-dossier"), (row) => row.id);
    expect(ids).toEqual(services.map((service) => `home-${service.id}`));
    expect(new Set(ids).size).toBe(6);
  });

  it("links every capability as its own full-cell control with the title scan effect", () => {
    const { container } = renderChapter();
    const rows = container.querySelectorAll(".service-dossier");

    for (const [serviceIndex, row] of Array.from(rows).entries()) {
      const links = row.querySelectorAll<HTMLAnchorElement>(".dossier-capability > a.dossier-capability-link.footer-scan-link");
      expect(links).toHaveLength(6);
      for (const [capabilityIndex, link] of Array.from(links).entries()) {
        const capability = services[serviceIndex].capabilities[capabilityIndex];
        expect(link).toHaveAttribute("href", services[serviceIndex].href);
        expect(link).toHaveAccessibleName(capability.label);
        expect(link.querySelector(".dossier-capability-icon")).toHaveAttribute("aria-hidden", "true");
        expect(link.querySelector(".dossier-capability-label.footer-scan-base")).toHaveTextContent(capability.label);
        expect(link.querySelectorAll('.dossier-capability-scan[aria-hidden="true"] .footer-scan-band')).toHaveLength(3);
      }
    }

    expect(css).toMatch(/\.dossier-capability-link \{[^}]*width: 100%;[^}]*min-height: inherit/);
    expect(css).toMatch(/\.dossier-capability-link:focus-visible \{[^}]*outline: 2px solid var\(--paper\)/);
    expect(css).toMatch(/\.dossier-capability-link:active \.footer-scan-band \{[^}]*clip-path: inset\(var\(--band-top\) 0 var\(--band-bottom\) 0\)/);
  });

  it("links each title to its full service while preserving the footer scan and short red divider", () => {
    const { container } = renderChapter();
    const titles = container.querySelectorAll(".dossier-title");
    expect(titles).toHaveLength(services.length);
    for (const [index, title] of Array.from(titles).entries()) {
      const link = title.querySelector<HTMLAnchorElement>("a.dossier-title-link.footer-scan-link");
      expect(link).toHaveAttribute("href", services[index].href);
      expect(link).toHaveAccessibleName(services[index].title);
      expect(link?.querySelector(".dossier-title-label.footer-scan-base")).toHaveTextContent(services[index].title);
      expect(link?.querySelectorAll('.dossier-title-scan[aria-hidden="true"] .footer-scan-band')).toHaveLength(3);
    }
    expect(css).toMatch(/\.dossier-title::after \{[^}]*width: calc\(98 \* var\(--su\)\)/);
    expect(css).toMatch(/\.dossier-title-link\.footer-scan-link::after \{\s*content: none/);
    expect(css).toMatch(/\.dossier-title-link:focus-visible \{[^}]*outline: 2px solid var\(--paper\)/);
  });

  it("dims supporting content until row hover or focus, but keeps the rail and numerals fully opaque", () => {
    const dimmingCss = css.split("@media (hover: hover) and (pointer: fine) {")[1]
      .split("@media (prefers-reduced-motion: reduce) {")[0];
    expect(css).toContain("@media (hover: hover) and (pointer: fine)");
    expect(css).toMatch(/\.service-dossier \{\s*--dossier-detail-opacity: 0\.5/);
    expect(css).toMatch(/\.service-dossier:is\([^\n]*data-pointer-hover[^\n]*\) \{\s*--dossier-detail-opacity: 1/);
    for (const selector of [".dossier-subtitle", ".dossier-cta", ".dossier-capability", ".dossier-title::after"]) {
      expect(dimmingCss).toContain(selector);
    }
    expect(dimmingCss).toContain("opacity: var(--dossier-detail-opacity)");
    expect(dimmingCss).not.toContain(".dossier-numeral");
    expect(dimmingCss).not.toContain(".dossier-rail");
    expect(dimmingCss).not.toContain(".dossier-title-label");
    expect(dimmingCss).not.toContain(".dossier-statement");
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\) \{[^]*?\.service-dossier :is\([^}]*transition: none/);
  });

  it("rests the blue statement field at 35% and restores full blue on row hover", () => {
    expect(css).toContain("--dossier-blue-surface: var(--blue)");
    expect(css).toMatch(/\.dossier-statement \{[^}]*background-color: var\(--dossier-blue-surface\)/);
    expect(css).toMatch(/\.service-dossier \{[^}]*--dossier-blue-surface: color-mix\(in srgb, var\(--blue\) 35%, var\(--night\)\)/);
    expect(css).toMatch(/\.service-dossier:is\([^\n]*data-pointer-hover[^\n]*\) \{[^}]*--dossier-blue-surface: var\(--blue\)/);
    expect(css).toMatch(/\.dossier-statement-face--active \{[^}]*background-color: var\(--red\)/);
    expect(css.match(/background: var\(--dossier-blue-surface\)/g)).toHaveLength(2);
  });

  it("reveals each discipline photo in blue on row hover and red on direct square hover", () => {
    const { container } = renderChapter();
    const photos = container.querySelectorAll<HTMLImageElement>(".dossier-statement-face--rest .dossier-statement-media img");
    expect(photos).toHaveLength(6);
    photos.forEach((photo, index) => expect(photo.getAttribute("src")).toContain(encodeURIComponent(services[index].imageSrc)));
    expect(css).toMatch(/\.dossier-statement-media \{[^}]*opacity: 0/);
    expect(css).toMatch(/\.service-dossier:is\([^\n]*data-pointer-hover[^\n]*\) \.dossier-statement-media \{[^}]*opacity: 1/);
    expect(css).toMatch(/\.dossier-statement-face--active \.dossier-statement-media \{[^}]*--dossier-image-tint: var\(--red\)/);
    expect(css).toContain("mix-blend-mode: luminosity");
    expect(css).toMatch(/\.dossier-statement-media::after \{[^}]*background: color-mix\(in srgb, var\(--night\) 60%, transparent\)/);
  });

  it("keeps the service title, short subtitle, and capabilities without the project count or description", () => {
    const service = services[5];
    const { container } = render(<ServiceDossierRow service={service} />);
    const row = container.querySelector<HTMLElement>(".service-dossier")!;

    expect(row.querySelector(".dossier-register")).toBeNull();
    expect(row.querySelector(".dossier-register-rule")).toBeNull();
    expect(within(row).getByRole("heading", { level: 3, name: service.title })).toBeInTheDocument();
    expect(within(row).getByText(service.subtitle)).toBeInTheDocument();
    expect(row.querySelector(".dossier-description")).toBeNull();
    expect(css).toMatch(/\.dossier-identity \{[^}]*background: var\(--night\)/);
    expect(css).toMatch(/\.dossier-title \{[^}]*color: var\(--paper\)/);
    expect(css).toMatch(/\.dossier-subtitle \{[^}]*color: var\(--paper\)/);
    expect(css).toContain(".dossier-identity::before { right: 100%; background: var(--night); }");
    expect(css).toMatch(/\.dossier-identity::after \{[^}]*background: var\(--night\)/);
    for (const capability of service.capabilities) {
      expect(within(row).getByRole("link", { name: capability.label })).toBeInTheDocument();
    }
  });

  it("gives every register exactly six capabilities under an accessible name", () => {
    renderChapter();

    const lists = screen.getAllByRole("list");
    expect(lists).toHaveLength(6);
    lists.forEach((list, index) => {
      expect(list).toHaveAccessibleName(`${services[index].title} capabilities`);
      expect(within(list).getAllByRole("listitem")).toHaveLength(6);
    });
  });

  it("keeps the capability register and its responsive bleeds night with legible labels", () => {
    expect(css).toMatch(/\.dossier-capabilities \{[^}]*background: var\(--night\)/);
    expect(css).toMatch(/\.dossier-capability-label \{[^}]*color: var\(--paper\)/);
    expect(css).toContain(".dossier-capabilities::after { left: 100%; background: var(--night); }");
    expect(css).toMatch(/\.dossier-capabilities::before \{[^}]*background: var\(--night\)/);
    expect(css).toContain("--dossier-rule-register: color-mix(in srgb, var(--paper) 40%, transparent)");
  });

  it("keeps the authored inline SVG icon for each of the 36 capabilities", () => {
    const { container } = renderChapter();
    const icons = container.querySelectorAll<SVGElement>(".dossier-capability .dossier-capability-icon");

    expect(icons).toHaveLength(36);
    expect(Array.from(icons, (icon) => icon.tagName.toLowerCase())).toEqual(Array(36).fill("svg"));
    for (const icon of icons) {
      expect(icon).toHaveAttribute("viewBox", "0 0 24 24");
      expect(icon).toHaveAttribute("stroke", "currentColor");
      expect(icon).toHaveAttribute("aria-hidden", "true");
      expect(icon.querySelector("path")?.getAttribute("d")).toBeTruthy();
    }
  });

  it("hides every decorative element from assistive technology", () => {
    const { container } = render(<ServiceDossierRow service={services[0]} />);

    expect(container.querySelector(".dossier-rail")).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelector(".dossier-numeral")).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelector(".dossier-cta-arrow")).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelector(".dossier-statement-face--active")).toHaveAttribute("aria-hidden", "true");
    // Both visual faces are decorative; only the one real link is announced.
    expect(screen.getAllByText("01")).toHaveLength(2);
    expect(screen.getAllByRole("link", { name: "View full service" })).toHaveLength(1);
  });

  it("draws its rail from the shared technical rail, at the footer's sizes", () => {
    const { container } = render(<ServiceDossierRow service={services[0]} />);
    const rail = container.querySelector<HTMLElement>(".dossier-rail")!;

    expect(rail).toHaveClass("tech-rail");
    expect(rail.querySelector(".tech-rail-bar")).not.toBeNull();
    expect(rail.querySelector(".dossier-rail-divider")).toBeNull();
    expect(css).toMatch(/\.dossier-rail\.tech-rail \{[^}]*--f-gap: calc\(var\(--f-rail\) - var\(--f-bar\)\)/);
    expect(rail.querySelector(".trm-red")).toBeNull();
    expect(rail.querySelector(".trm-blue")).toBeNull();
    expect(rail.querySelectorAll(".trm")).toHaveLength(5);
    for (const name of ["trm-tick-a", "trm-notch-a", "trm-tick-b", "trm-notch-b", "trm-chip"]) {
      expect(rail.querySelector(`.${name}`)).not.toBeNull();
    }
    expect(css).toContain("var(--paper) var(--dossier-gap-b-end) 100%");
    expect(css).toMatch(/\.dossier-rail\.tech-rail \{[^}]*background: var\(--night\)/);
    expect(css).toContain("--rail-chip: var(--paper)");
    expect(css).toContain("--rail-punch: var(--night)");
    expect(css).toContain("--rail-tick-a: var(--red)");
    expect(css).toContain("--rail-tick-b: var(--red)");
    expect(css).toContain("--rail-notch-a: var(--blue)");
    expect(css).toContain("--rail-notch-b: var(--blue)");
    expect(css).toContain("var(--dossier-content) * 0.7617370892 + var(--dossier-pad-x) * 0.5");
    expect(css).toMatch(/\.dossier-rail \.trm-chip::before \{\s*content: none;/);
    // the sizes are owned by the shared sheet and shared with the footer
    expect(railCss).toMatch(/\.refined-footer,\s*\n\.service-dossier \{/);
    expect(railCss).toContain("--f-bar: clamp(6px, 0.85vw, 13px);");
    expect(railCss).toContain("--f-mark: clamp(7px, 0.85vw, 12px);");
    // jsdom does not lay out, so the shell width contract is asserted at source
    expect(css).toContain("min(100% - var(--ds-layout-gutter) * 2, var(--ds-layout-shell))");
  });
});
