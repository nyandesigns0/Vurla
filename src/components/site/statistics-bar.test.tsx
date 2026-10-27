import { readFileSync } from "node:fs";
import { act, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { StatisticMetric } from "@/content/contracts";
import { StatisticsBar } from "./StatisticsBar";

const metrics: StatisticMetric[] = [
  { id: "projects", value: 50, suffix: "+", label: "Projects completed", iconId: "plan" },
  { id: "experience", value: 10, suffix: "+", label: "Years of excellence", iconId: "axis" },
  { id: "awards", value: 5, suffix: "+", label: "Awards won", iconId: "award" },
  { id: "satisfaction", value: 100, suffix: "%", label: "Client satisfaction", iconId: "signal" },
];

const css = readFileSync("src/components/site/statistics-bar.css", "utf8");
const scrollCueCss = readFileSync("src/components/ui/scroll-cue.css", "utf8");
const globals = readFileSync("src/app/globals.css", "utf8");

describe("StatisticsBar", () => {
  it("keeps the top beam and notches without the segmented rail band", () => {
    const { container } = render(<StatisticsBar metrics={metrics} />);
    expect(container.querySelector(".statistics-rail-beam")).toBeInTheDocument();
    expect(container.querySelectorAll(".statistics-rail-notch")).toHaveLength(3);
    expect(container.querySelector(".statistics-rail-band, .statistics-rail-mark")).not.toBeInTheDocument();
    expect(css).not.toMatch(/statistics-rail-band|statistics-rail-mark|statistics-rail-detail-offset|statistics-rail-shape-border/);
  });

  it("lays four equal cards across a grid that fills the whole container", () => {
    const { container } = render(<StatisticsBar metrics={metrics} />);
    expect(container.querySelectorAll(".statistic")).toHaveLength(4);
    const grid = container.querySelector(".statistics-grid");
    expect(grid).not.toBeNull();
    expect(grid!.children).toHaveLength(4);
    // jsdom does not lay out, so the container-filling geometry is asserted at source.
    const gridRule = css.match(/\.statistics-grid \{([^}]*)\}/)![1];
    expect(gridRule).toContain("width: 100%");
    expect(gridRule).toContain("grid-template-columns: repeat(4, minmax(0, 1fr))");
    const cardRule = css.match(/\.statistic \{([^}]*)\}/)![1];
    expect(cardRule).toContain("padding: calc(25 * var(--su))");
    expect(css).not.toMatch(/\.statistic:nth-child\(n \+ 3\)\s*\{/);
  });

  it("draws both outer edges and exactly three interior rules from one overlay", () => {
    const { container } = render(<StatisticsBar metrics={metrics} />);
    const dividers = container.querySelectorAll(".statistics-column-dividers > .statistics-column-divider");
    expect(dividers).toHaveLength(5);
    expect(container.querySelector(".statistics-column-divider--0")).not.toBeNull();
    expect(container.querySelector(".statistics-column-divider--4")).not.toBeNull();
    expect(container.querySelectorAll(
      ".statistics-column-divider--1, .statistics-column-divider--2, .statistics-column-divider--3",
    )).toHaveLength(3);
  });

  it("renders every boundary through the shared 1.5px divider", () => {
    const { container } = render(<StatisticsBar metrics={metrics} />);
    for (const divider of container.querySelectorAll(".statistics-column-divider")) {
      expect(divider).toHaveClass("divider-line");
      expect(divider).toHaveAttribute("data-orientation", "vertical");
    }
    expect(globals).toContain("--divider-line-width: 1.5px");
    const dividerRule = css.match(/\.statistics-column-divider\.divider-line \{([^}]*)\}/)![1];
    expect(dividerRule).toContain("width: var(--divider-line-width)");
    expect(dividerRule).toContain("box-sizing: border-box");
    expect(dividerRule).toContain("transform: translateX(-50%)");
    // The outer edges must not be redrawn by a parent border or pseudo-element on top
    // of the overlay, which is what used to make one edge read thicker than the other.
    expect(css).not.toMatch(/\.statistics-column-dividers::(before|after)/);
    expect(css).not.toMatch(/\.statistics-(bar-inner|grid)\s*\{[^}]*(?<![\w-])border(-[a-z]+)*\s*:/);
  });

  it("runs the outer edges up under the rail beam, outweighing the shared inset", () => {
    // The interior rules stop below the beam because their notch hides the cap; the
    // outer two have no notch, so they must overlap the beam or a gap shows.
    const shared = css.match(/\.statistics-column-divider\.divider-line \{([^}]*)\}/)![1];
    expect(shared).toContain("inset-block: calc(8 * var(--su)) 0");
    const outer = css.match(
      /\.statistics-column-divider--0\.divider-line,\s*\.statistics-column-divider--4\.divider-line \{([^}]*)\}/,
    );
    expect(outer).not.toBeNull();
    expect(outer![1]).toContain("inset-block-start: calc(-3 * var(--su))");
  });

  it("anchors each boundary on its own column edge", () => {
    const edges = ["0", "25%", "50%", "75%", "100%"];
    edges.forEach((edge, index) => {
      const rule = css.match(new RegExp(`\.statistics-column-divider--${index} \{([^}]*)\}`))![1];
      expect(rule).toContain(`left: ${edge}`);
    });
  });

  it("keeps the icons, values and labels the rail was drawn around", () => {
    const { container } = render(<StatisticsBar metrics={metrics} />);
    expect(Array.from(container.querySelectorAll(".statistic-label"), (node) => node.textContent)).toEqual(
      metrics.map((metric) => metric.label),
    );
    expect(container.querySelectorAll(".statistic-icon-frame img")).toHaveLength(4);
    expect(container.querySelectorAll(".statistic-rule")).toHaveLength(4);
    expect(container.querySelectorAll(".statistic-rule > .statistic-hatch")).toHaveLength(4);
  });

  it("keeps the rail and dividers static while counting values before the top-to-bottom detail reveal", () => {
    expect(css).not.toMatch(/\.statistics-bar(?:\[data-boot="armed"\]|\.is-booted) \.statistics-rail/);
    expect(css).not.toContain("@keyframes statistics-boot");
    expect(css).toContain(".statistics-bar[data-boot=\"armed\"] .statistic-value > span");
    expect(css).toContain("animation: statistics-content-boot 280ms var(--ds-motion-ease) var(--ds-motion-statistics-boot) backwards");
    expect(css).toContain("calc(var(--ds-motion-statistics-boot) + 180ms) backwards");
    expect(css).toContain("calc(var(--ds-motion-statistics-boot) + 360ms) backwards");

    let notify!: IntersectionObserverCallback;
    const disconnect = vi.fn();
    const frames = new Map<number, FrameRequestCallback>();
    let frameId = 0;
    const originalObserver = globalThis.IntersectionObserver;

    try {
      vi.stubGlobal("matchMedia", () => ({ matches: false, addEventListener() {}, removeEventListener() {} }));
      globalThis.IntersectionObserver = class {
        constructor(callback: IntersectionObserverCallback) { notify = callback; }
        observe() {}
        disconnect = disconnect;
      } as unknown as typeof IntersectionObserver;
      vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
        frames.set(++frameId, callback);
        return frameId;
      });
      vi.stubGlobal("cancelAnimationFrame", (id: number) => { frames.delete(id); });
      const { container, unmount } = render(<StatisticsBar metrics={metrics} />);
      const bar = container.querySelector(".statistics-bar")!;
      const values = () => Array.from(container.querySelectorAll(".statistic-value > span"), (node) => node.textContent);
      const advance = (now: number) => {
        const [id, callback] = frames.entries().next().value!;
        frames.delete(id);
        act(() => callback(now));
      };

      expect(bar).toHaveAttribute("data-boot", "armed");
      expect(bar.querySelector(".statistics-rail-beam")).toBeInTheDocument();
      expect(bar.querySelectorAll(".statistics-column-divider")).toHaveLength(5);
      act(() => notify([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver));
      expect(values()).toEqual(["0+", "0+", "0+", "0%"]);
      advance(0);
      advance(400);
      expect(values()).toEqual(["44+", "9+", "4+", "88%"]);
      advance(800);
      expect(values()).toEqual(["50+", "10+", "5+", "100%"]);
      expect(frames.size).toBe(0);
      expect(disconnect).toHaveBeenCalledTimes(1);
      unmount();
    } finally {
      globalThis.IntersectionObserver = originalObserver;
      vi.unstubAllGlobals();
    }
  });

  it("shows final values without an entrance sequence for reduced motion", () => {
    const { container } = render(<StatisticsBar metrics={metrics} />);
    expect(container.querySelector(".statistics-bar")).not.toHaveAttribute("data-boot");
    expect(Array.from(container.querySelectorAll(".statistic-value > span"), (node) => node.textContent)).toEqual(["50+", "10+", "5+", "100%"]);
  });

  it("keeps the scroll cue centered with blue/red hatches and no side rules", () => {
    const { container } = render(<StatisticsBar metrics={metrics} />);
    const cue = container.querySelector(".statistics-bar-inner > .statistics-scroll-cue");
    expect(cue).toHaveTextContent("Scroll to explore");
    expect(cue?.querySelector("svg, .statistics-scroll-cue-icon")).not.toBeInTheDocument();
    expect(cue?.querySelector(".statistics-scroll-rule")).not.toBeInTheDocument();
    expect(cue?.querySelectorAll(".statistics-scroll-hatch--blue > .statistic-hatch")).toHaveLength(1);
    expect(cue?.querySelectorAll(".statistics-scroll-hatch--red > .statistic-hatch")).toHaveLength(1);
    expect(cue?.querySelector(".scroll-cue-copy")).toHaveTextContent("Scroll to explore");
    expect(cue?.textContent).toBe("Scroll to explore");
    expect(css).toContain("height: var(--statistics-top-pad)");
    expect(css).toMatch(/\.statistics-scroll-hatch\s*\{[^}]*height:\s*10px;/);
    expect(css).not.toContain(".statistics-scroll-rule");
    expect(css).toContain(".statistic-hatch::before {");
    expect(css).toContain("background: repeating-linear-gradient(");
    expect(css).toContain("--statistics-top-pad: max(34px, calc(34 * var(--su)))");
    expect(css).toContain("font: 600 16px/1 var(--ds-font-mono)");
    expect(scrollCueCss).toContain("animation: scroll-cue-scan 3.6s steps(8, end) infinite");
    expect(scrollCueCss).toContain("@media (prefers-reduced-motion: reduce)");
  });
});
