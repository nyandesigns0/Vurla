import { act, fireEvent, render } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useStationaryHover } from "./use-stationary-hover";

const FEATURED_HOVER_SELECTORS = [".project-card--featured"] as const;
const originalHitTest = Object.getOwnPropertyDescriptor(document, "elementFromPoint");

afterEach(() => {
  vi.restoreAllMocks();
  if (originalHitTest) Object.defineProperty(document, "elementFromPoint", originalHitTest);
  else Reflect.deleteProperty(document, "elementFromPoint");
});

function Harness() {
  const ref = useStationaryHover<HTMLDivElement>(FEATURED_HOVER_SELECTORS);
  return <div ref={ref}><div className="project-card--featured">One</div><div className="project-card--featured">Two</div></div>;
}

it("updates the featured card beneath a stationary mouse while scrolling", () => {
  const frames = new Map<number, FrameRequestCallback>();
  let serial = 0;
  vi.spyOn(window, "matchMedia").mockReturnValue({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() } as unknown as MediaQueryList);
  vi.spyOn(performance, "now").mockReturnValue(0);
  vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => { frames.set(++serial, callback); return serial; });
  vi.spyOn(window, "cancelAnimationFrame").mockImplementation((id) => { frames.delete(id); });
  const hit = vi.fn();
  Object.defineProperty(document, "elementFromPoint", { configurable: true, value: hit });
  const { container, unmount } = render(<Harness />);
  const cards = container.querySelectorAll<HTMLElement>(".project-card--featured");
  const step = (now: number) => act(() => {
    const current = [...frames.values()];
    frames.clear();
    current.forEach((callback) => callback(now));
  });

  hit.mockReturnValue(cards[0]);
  fireEvent.wheel(window, { clientX: 220, clientY: 300, deltaY: 120 });
  step(16);
  expect(cards[0]).toHaveAttribute("data-pointer-hover", "true");
  expect(cards[1]).toHaveAttribute("data-pointer-hover", "false");

  hit.mockReturnValue(cards[1]);
  fireEvent.scroll(window);
  step(32);
  expect(cards[0]).toHaveAttribute("data-pointer-hover", "false");
  expect(cards[1]).toHaveAttribute("data-pointer-hover", "true");
  expect(hit).toHaveBeenLastCalledWith(220, 300);

  hit.mockReturnValue(document.body);
  step(48);
  expect(cards[1]).toHaveAttribute("data-pointer-hover", "false");
  unmount();
  expect(frames.size).toBe(0);
});

describe("featured card visual states", () => {
  it("uses tracked hover for the image scale, colour, and footer reveal", () => {
    const css = readFileSync("src/app/globals.css", "utf8");
    const selector = '.project-card--featured:is(:hover:not([data-pointer-hover="false"]), :focus-visible, [data-pointer-hover="true"])';
    expect(css).toContain(`${selector} .project-card-image img {`);
    expect(css).toContain(`${selector} .project-card-image img{filter:grayscale(0)`);
    expect(css).toContain(`${selector} .project-card-footer{transform:translateY(0)`);
  });
});
