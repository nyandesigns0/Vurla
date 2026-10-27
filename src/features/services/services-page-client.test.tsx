import { readFileSync } from "node:fs";
import { act, fireEvent, render, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { listProjects, listServices } from "@/content/testing";
import { ServicesPageClient } from "./services-page-client";
import { ProjectsPageClient } from "@/features/projects/projects-page-client";

const closingMotion = vi.hoisted(() => ({
  create: vi.fn<(options: { trigger: HTMLElement; start: string; end: () => string; onUpdate: (trigger: { progress: number }) => void }) => void>(),
  to: vi.fn<(element: HTMLElement, options: { scrollTrigger: { trigger: HTMLElement; start: () => string; end: () => string } }) => void>(),
  refresh: vi.fn(),
  revert: vi.fn(),
}));

vi.mock("gsap", () => ({
  default: {
    registerPlugin: vi.fn(),
    set: vi.fn(),
    to: (...args: Parameters<typeof closingMotion.to>) => { closingMotion.to(...args); return { kill: vi.fn() }; },
    context: (setup: () => void) => {
      setup();
      return { revert: closingMotion.revert };
    },
  },
}));
vi.mock("gsap/ScrollTrigger", () => ({ ScrollTrigger: { create: closingMotion.create, refresh: closingMotion.refresh } }));

describe("ServicesPageClient", () => {
  it.each([false, true])("links all 36 subcategories to the centered conversation panel (reduced motion: %s)", reduced => {
    const originalScroll = HTMLElement.prototype.scrollIntoView;
    const scroll = vi.fn();
    const documentScroll = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    HTMLElement.prototype.scrollIntoView = scroll;
    const media = vi.spyOn(window, "matchMedia").mockImplementation(query => ({ matches: reduced && query.includes("prefers-reduced-motion"), addEventListener: vi.fn(), removeEventListener: vi.fn() } as unknown as MediaQueryList));
    try {
      const { container } = render(<ServicesPageClient services={listServices()} />);
      const links = container.querySelectorAll<HTMLAnchorElement>(".service-sheet-register a");
      expect(links).toHaveLength(36);
      links.forEach(link => {
        expect(link).toHaveAttribute("href", "#services-closing-heading");
        fireEvent.click(link);
      });
      expect(scroll).toHaveBeenCalledTimes(36);
      // jsdom has no scroll geometry; the timed, nonzero-distance path is
      // covered independently in scroll-to-conversation.test.ts.
      expect(scroll).toHaveBeenLastCalledWith({ block: "center", behavior: "instant" });
      expect(scroll.mock.instances.at(-1)).toBe(container.querySelector(".closing-panel-composition"));
      expect(document.activeElement).toBe(container.querySelector("#services-closing-heading"));
      fireEvent.click(links[0], { ctrlKey: true });
      expect(scroll).toHaveBeenCalledTimes(36);
    } finally { media.mockRestore(); documentScroll.mockRestore(); HTMLElement.prototype.scrollIntoView = originalScroll; }
  });
  it("paints both side rails with the same native border geometry as other page frames", () => {
    const css = readFileSync("src/components/site/page-family.css", "utf8");
    expect(css).toMatch(/\.page-side-borders\.shell \{[^}]*border-inline: var\(--pf-rule\) solid var\(--mineral\)/);
  });

  it("keeps index side borders on the fixed-width viewport rather than the scrolling list", () => {
    const css = readFileSync("src/features/services/services-page.css", "utf8");
    expect(css).toMatch(/\.service-index \{[^}]*overflow-x: auto;[^}]*border-inline: var\(--pf-rule\) solid var\(--mineral\)/);
    expect(css).toMatch(/\.service-index ol \{[^}]*grid-template-columns: repeat\(6, minmax\(0, 1fr\)\);[^}]*min-width: 1152px;[^}]*border-inline: 0/);
  });
  it("keeps opening dots, compact intro and register terminals scoped to Services without closing-panel overrides", () => {
    const css = readFileSync("src/features/services/services-page.css", "utf8");
    expect(css).not.toContain("radial-gradient(circle");
    const { container } = render(<ServicesPageClient services={listServices()} />);
    expect(container.querySelector(".page-plate-field > .dot-texture")).toBeInTheDocument();
    expect(container.querySelector(".services-opening-frame .page-plate-field--crosshair")).toBeInTheDocument();
    expect(container.querySelector(".services-opening-frame .page-plate-crosshair-mark")).toBeInTheDocument();
    const sharedCss = readFileSync("src/components/site/page-family.css", "utf8");
    expect(sharedCss).toMatch(/\.page-plate-crosshair \{[^}]*right: var\(--pf-inset\)/);
    expect(css).not.toContain("--page-plate-crosshair-inset");
    expect(container.querySelector(".page-plate-rail > .dot-texture")).toBeInTheDocument();
    expect(css).toMatch(/\.service-catalog-intro \{[^}]*padding-inline-start: calc\(\(var\(--pf-rail-width\) \+ var\(--pf-rule\) - var\(--pf-rail-label-linebox\)\) \/ 2 \+ 8px\);[^}]*padding-inline-end: calc\(var\(--pf-inset\) \+ var\(--pf-hair\)\);[^}]*background: var\(--night\);[^}]*color: var\(--paper\);/);
    expect(container.querySelector(".service-catalog-intro > .page-band-mark")).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelectorAll(".service-catalog-intro .page-hatch")).toHaveLength(0);
    expect(container.querySelector(".service-catalog-intro > .service-catalog-intro-grain")).toHaveAttribute("aria-hidden", "true");
    expect(css).toMatch(/\.service-catalog-intro \{[^}]*position: relative;[^}]*isolation: isolate/);
    expect(css).toMatch(/\.service-catalog-intro > \.service-catalog-intro-grain \{ z-index: -1/);
    expect(css).toMatch(/\.service-catalog-intro p \{[^}]*max-width: none/);
    expect(css).toMatch(/\.service-catalog-intro p \{[^}]*color: var\(--paper\)/);
    expect(css).toMatch(/\.service-sheet-register li \{[^}]*padding: calc\(0\.45rem \+ 5px\)/);
    expect(css).toMatch(/\.service-sheet-register li::after \{[^}]*var\(--red\)[^}]*5px 5px no-repeat/);
    expect(css).not.toContain(".closing-panel-concrete--lower");
  });
  it("opens directly with the heading plate without a double chapter border", () => {
    const { container } = render(<ServicesPageClient services={listServices()} />);
    const page = container.querySelector(".services-page");

    expect(page?.querySelectorAll(".services-opening-border")).toHaveLength(0);
    const opening = page?.querySelector(".services-opening-frame");
    expect(opening?.firstElementChild?.classList.contains("page-plate")).toBe(true);
    expect(container.querySelector(".closing-chapter")).not.toHaveAttribute("data-motion");
  });

  it("keeps opening edges with the header and catalog edges with the pinned service browser", () => {
    const { container } = render(<ServicesPageClient services={listServices()} />);
    const lined = container.querySelector(".services-lined-content");
    const openingEdges = lined?.querySelector(".services-opening-frame > .services-side-dividers.page-side-borders");
    const catalogEdges = lined?.querySelector(".service-browser > .services-side-dividers--catalog.page-side-borders");

    expect(openingEdges).toHaveAttribute("aria-hidden", "true");
    expect(catalogEdges).toHaveAttribute("aria-hidden", "true");
    expect(lined?.querySelector(".service-browser > .services-scroll-panel-shell")).toBeInTheDocument();
    expect(lined?.nextElementSibling).toHaveClass("closing-chapter");
    expect(lined?.querySelector(".closing-chapter")).toBeNull();
    expect(lined?.querySelector(":scope > .services-side-dividers")).toBeNull();
    expect(container.querySelectorAll(".services-scroll-panel-shell .page-side-borders, .closing-chapter .page-side-borders")).toHaveLength(0);
    const css = readFileSync("src/features/services/services-page.css", "utf8");
    expect(css).not.toMatch(/\.service-sheet-frame \{[^}]*border-inline:/);
  });

  it("renders all six service sheets without technical rails", () => {
    const { container } = render(<ServicesPageClient services={listServices()} />);

    expect(container.querySelectorAll(".service-sheet")).toHaveLength(6);
    expect(container.querySelectorAll(".service-sheet-rail")).toHaveLength(0);
    expect(container.querySelectorAll(".service-sheet > .page-rail")).toHaveLength(0);
    expect(container.querySelectorAll(".services-page .page-rail")).toHaveLength(0);
    expect(container.querySelectorAll(".service-sheet-identity")).toHaveLength(6);
    expect(container.querySelectorAll(".service-sheet-register li")).toHaveLength(36);
    expect(container.querySelector(".services-scroll-panel .chapter-scroll-cue")).toHaveTextContent("Scroll to explore");
    expect(container.querySelector(".closing-panel--chapter .closing-panel-scroll-cue")).toBeNull();
  });

  it("uses the shared noise texture in the opening rail and each service sheet", () => {
    const { container } = render(<ServicesPageClient services={listServices()} />);

    expect(container.querySelectorAll(".page-plate-rail > canvas.page-plate-rail-grain")).toHaveLength(1);
    expect(container.querySelectorAll(".service-sheet-frame > canvas.service-sheet-grain")).toHaveLength(6);
  });

  it("keeps the timeline within the service rows and moves selection when a link is clicked", () => {
    const { container } = render(<ServicesPageClient services={listServices()} />);
    const browser = container.querySelector(".service-browser");
    const links = browser?.querySelectorAll<HTMLAnchorElement>(".service-index a");

    expect(browser?.querySelectorAll(".service-sheet")).toHaveLength(6);
    expect(browser?.parentElement?.nextElementSibling?.classList.contains("closing-chapter")).toBe(true);
    expect(browser?.parentElement?.nextElementSibling?.querySelector(".closing-panel--chapter")).toBeInTheDocument();
    expect(links?.[0]).not.toHaveAttribute("aria-current");

    fireEvent.click(links![2]);
    expect(links?.[2]).toHaveAttribute("aria-current", "location");
    expect(links?.[0]).not.toHaveAttribute("aria-current");
    expect(browser?.querySelector("#landscape")).toHaveAttribute("data-active", "true");
  });

  it("places a single full-width chapter border before the closing panel", () => {
    const { container } = render(<ServicesPageClient services={listServices()} />);
    const border = container.querySelector(".closing-chapter-border");

    expect(border).toBeInTheDocument();
    expect(border?.parentElement?.classList.contains("closing-chapter-plate")).toBe(true);
    expect(border?.parentElement?.parentElement?.previousElementSibling?.classList.contains("services-lined-content")).toBe(true);
    expect(border?.nextElementSibling?.classList.contains("closing-panel--chapter")).toBe(true);
    expect(container.querySelectorAll(".service-sheet .closing-chapter-border")).toHaveLength(0);
    const css = readFileSync("src/components/site/page-family.css", "utf8");
    expect(css).toContain("main:has(> .page-family > .closing-chapter) ~ .refined-footer .footer-rail");
  });

  it("retires outgoing rows only when fully covered and restores them on reverse scroll", async () => {
    closingMotion.create.mockClear();
    closingMotion.to.mockClear();
    closingMotion.revert.mockClear();
    const media = vi.spyOn(window, "matchMedia").mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as MediaQueryList);
    const computed = vi.spyOn(window, "getComputedStyle").mockReturnValue({ paddingTop: "186px" } as CSSStyleDeclaration);
    try {
      const { container, unmount } = render(<ServicesPageClient services={listServices()} />);
      const browser = container.querySelector(".service-browser")!;
      await waitFor(() => expect(closingMotion.create).toHaveBeenCalledTimes(1));
      const closing = container.querySelector(".closing-chapter")!;
      expect(closing).toHaveAttribute("data-motion", "enhanced");
      const pin = closingMotion.create.mock.calls[0][0];
      const reveal = closingMotion.to.mock.calls.find(([, options]) => options.scrollTrigger?.trigger === closing)![1].scrollTrigger;
      expect(pin.trigger).toBe(browser);
      expect(pin.start).toBe("clamp(bottom bottom)");
      expect(pin.end()).toBe(`+=${window.innerHeight + 186}`);
      expect(reveal.trigger).toBe(closing);
      expect(reveal.start()).toBe("top bottom-=186");
      expect(reveal.end()).toBe("top 25%-=186");
      const update = closingMotion.create.mock.calls[0][0].onUpdate;

      update({ progress: 0.9 });
      expect(browser).toHaveAttribute("data-closing-transition", "covered");
      update({ progress: 1 });
      expect(browser).toHaveAttribute("data-closing-transition", "complete");
      update({ progress: 0.9 });
      expect(browser).toHaveAttribute("data-closing-transition", "covered");
      update({ progress: 0.5 });
      expect(browser).toHaveAttribute("data-closing-transition", "visible");

      unmount();
      expect(browser).not.toHaveAttribute("data-closing-transition");
      expect(closing).not.toHaveAttribute("data-motion");
      expect(closingMotion.revert).toHaveBeenCalled();
    } finally {
      media.mockRestore();
      computed.mockRestore();
    }
  });

  it("keeps the closing transition mounted after a sub-service jump so reverse scrolling can reveal it", async () => {
    closingMotion.create.mockClear();
    closingMotion.revert.mockClear();
    const media = vi.spyOn(window, "matchMedia").mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as MediaQueryList);
    const scroll = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    try {
      const { container } = render(<ServicesPageClient services={listServices()} />);
      await waitFor(() => expect(closingMotion.create).toHaveBeenCalledTimes(1));
      const closing = container.querySelector(".closing-chapter")!;
      const browser = container.querySelector(".service-browser")!;
      fireEvent.click(container.querySelector("#architecture [data-service-preview]")!);
      expect(closing).toHaveAttribute("data-motion", "enhanced");
      expect(closingMotion.revert).not.toHaveBeenCalled();
      expect(scroll).toHaveBeenCalled();
      const update = closingMotion.create.mock.calls[0][0].onUpdate;
      update({ progress: 1 });
      expect(browser).toHaveAttribute("data-closing-transition", "complete");
      update({ progress: 0.5 });
      expect(browser).toHaveAttribute("data-closing-transition", "visible");
    } finally {
      media.mockRestore();
      scroll.mockRestore();
    }
  });

  it("refreshes the handoff when natural content resizes and disconnects on cleanup", async () => {
    closingMotion.create.mockClear();
    closingMotion.refresh.mockClear();
    const media = vi.spyOn(window, "matchMedia").mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as MediaQueryList);
    let notifyResize!: ResizeObserverCallback;
    const observe = vi.fn();
    const disconnect = vi.fn();
    const originalResizeObserver = globalThis.ResizeObserver;
    globalThis.ResizeObserver = class implements ResizeObserver {
      constructor(callback: ResizeObserverCallback) { notifyResize = callback; }
      observe = observe;
      disconnect = disconnect;
      unobserve() {}
    };
    try {
      const { container, unmount } = render(<ServicesPageClient services={listServices()} />);
      await waitFor(() => expect(closingMotion.create).toHaveBeenCalledTimes(1));
      const catalog = container.querySelector(".service-catalog")!;
      expect(observe).toHaveBeenCalledWith(catalog);
      expect(observe).not.toHaveBeenCalledWith(container.querySelector(".service-browser"));
      const entry = (height: number) => ({ target: catalog, contentRect: { width: 1200, height } }) as ResizeObserverEntry;
      notifyResize([entry(2000)], {} as ResizeObserver);
      await waitFor(() => expect(closingMotion.refresh).toHaveBeenCalledTimes(1));
      notifyResize([entry(2100)], {} as ResizeObserver);
      await waitFor(() => expect(closingMotion.refresh).toHaveBeenCalledTimes(2));
      notifyResize([entry(2100)], {} as ResizeObserver);
      unmount();
      expect(closingMotion.refresh).toHaveBeenCalledTimes(2);
      expect(disconnect).toHaveBeenCalled();
    } finally {
      media.mockRestore();
      globalThis.ResizeObserver = originalResizeObserver;
    }
  });

  it("preserves a focused preview when native keyboard flow removes the pin spacer", async () => {
    closingMotion.create.mockClear();
    const media = vi.spyOn(window, "matchMedia").mockReturnValue({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() } as unknown as MediaQueryList);
    try {
      const { container } = render(<ServicesPageClient services={listServices()} />);
      await waitFor(() => expect(closingMotion.create).toHaveBeenCalledTimes(1));
      const button = container.querySelector<HTMLAnchorElement>("#architecture [data-service-preview]")!;
      act(() => button.focus());
      const browser = container.querySelector(".service-browser")!;
      closingMotion.revert.mockImplementationOnce(() => {
        const parent = browser.parentElement!;
        browser.remove();
        parent.append(browser);
        expect(document.activeElement).not.toBe(button);
      });
      fireEvent.keyDown(button, { key: "Tab" });
      expect(document.activeElement).toBe(button);
    } finally { media.mockRestore(); }
  });

  it.each(["keyboard", "touch", "filter-keyboard"])("returns the shared closing chapter to native %s flow", async input => {
    closingMotion.create.mockClear();
    const media = vi.spyOn(window, "matchMedia").mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as MediaQueryList);
    try {
      const { container } = render(input === "filter-keyboard"
        ? <ProjectsPageClient projects={listProjects()} />
        : <ServicesPageClient services={listServices()} />);
      await waitFor(() => expect(closingMotion.create).toHaveBeenCalledTimes(1));
      const closing = container.querySelector(".closing-chapter")!;
      const browser = container.querySelector(".closing-chapter-source")!;
      closingMotion.create.mock.calls[0][0].onUpdate({ progress: 1 });
      expect(browser).toHaveAttribute("data-closing-transition", "complete");
      if (input === "keyboard") {
        fireEvent.keyDown(window, { key: "Tab" });
      } else if (input === "filter-keyboard") {
        fireEvent.keyDown(container.querySelector(".filter-disclosure-button")!, { key: "ArrowDown" });
      } else {
        const event = new Event("pointerdown");
        Object.defineProperty(event, "pointerType", { value: "touch" });
        fireEvent(window, event);
      }
      expect(browser).not.toHaveAttribute("data-closing-transition");
      expect(closing).not.toHaveAttribute("data-motion");
    } finally {
      media.mockRestore();
    }
  });

  it("selects the service crossing the viewport center while scrolling", async () => {
    const { container } = render(<ServicesPageClient services={listServices()} />);
    const rect = vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (this: HTMLElement) {
      const centered = this.id === "interior";
      return { top: centered ? 200 : 900, bottom: centered ? 700 : 1300 } as DOMRect;
    });

    try {
      fireEvent.scroll(window);
      await waitFor(() => {
        expect(container.querySelector('.service-index a[href="#interior"]')).toHaveAttribute("aria-current", "location");
        expect(container.querySelector("#interior")).toHaveAttribute("data-active", "true");
      });
    } finally {
      rect.mockRestore();
    }
  });

  it("pairs each service title with a number tile without the former kicker or numeral panel", () => {
    const { container } = render(<ServicesPageClient services={listServices()} />);
    const sheets = [...container.querySelectorAll(".service-sheet")];

    sheets.forEach((sheet, index) => {
      const identity = sheet.querySelector(".service-sheet-identity");
      expect(identity?.querySelector(".service-sheet-number")?.textContent).toBe(String(index + 1).padStart(2, "0"));
      expect(identity?.querySelector(".service-sheet-number")).toHaveAttribute("data-number", String(index + 1).padStart(2, "0"));
      expect(identity?.querySelectorAll(".service-sheet-number-face")).toHaveLength(1);
      expect(identity?.querySelector("h2.service-sheet-title")).toBeTruthy();
    });
    expect(container.querySelectorAll(".service-sheet-kicker, .service-sheet-statement, .service-sheet-numeral")).toHaveLength(0);
  });

  it("pushes the complete blue and red tile faces vertically for hover and scroll activation", () => {
    const css = readFileSync("src/features/services/services-page.css", "utf8");
    expect(css).toMatch(/\.service-sheet-number \{[^}]*overflow: hidden/);
    expect(css).toMatch(/\.service-sheet-number::before \{[^}]*content: attr\(data-number\);[^}]*background-color: var\(--blue\);[^}]*transform: translateY\(-100%\)/);
    expect(css).toMatch(/\.service-sheet-number-face \{[^}]*background-color: var\(--red\);[^}]*transform: translateY\(0\)/);
    expect(css).toMatch(/\.service-sheet:is\(\[data-active="true"\], :hover, :focus-within, :target\) \.service-sheet-number-face \{[^}]*transform: translateY\(100%\)/);
    expect(css).toContain("transition: transform var(--ds-motion-base) var(--ds-motion-ease)");
    const reducedMotion = css.slice(css.indexOf("@media (prefers-reduced-motion: reduce)"));
    expect(reducedMotion).toContain(".service-sheet-number::before,");
    expect(reducedMotion).toContain(".service-sheet-number-face,");
    expect(reducedMotion).toContain("transition: none");
  });
});
