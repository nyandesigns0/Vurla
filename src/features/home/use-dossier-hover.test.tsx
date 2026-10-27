import { act, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useDossierHover } from "./use-dossier-hover";

const originalHitTest = Object.getOwnPropertyDescriptor(document, "elementFromPoint");
afterEach(() => {
  vi.restoreAllMocks();
  if (originalHitTest) Object.defineProperty(document, "elementFromPoint", originalHitTest);
  else Reflect.deleteProperty(document, "elementFromPoint");
});

function Harness() {
  const ref = useDossierHover();
  return <div ref={ref}>{[1, 2].map((n) => <article className="service-dossier" key={n}><a className="dossier-statement" href={`/services#${n}`}>{n}</a></article>)}</div>;
}

function setup(fine = true) {
  const frames = new Map<number, FrameRequestCallback>();
  let serial = 0;
  const media = { matches: fine, addEventListener: vi.fn(), removeEventListener: vi.fn() };
  vi.spyOn(window, "matchMedia").mockReturnValue(media as unknown as MediaQueryList);
  vi.spyOn(performance, "now").mockReturnValue(0);
  vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => { frames.set(++serial, callback); return serial; });
  vi.spyOn(window, "cancelAnimationFrame").mockImplementation((id) => { frames.delete(id); });
  const hit = vi.fn();
  Object.defineProperty(document, "elementFromPoint", { configurable: true, value: hit });
  const rendered = render(<Harness />);
  const rows = rendered.container.querySelectorAll<HTMLElement>("article");
  const tiles = rendered.container.querySelectorAll<HTMLElement>("a");
  const step = (now = 16) => act(() => {
    const current = [...frames.values()];
    frames.clear();
    current.forEach((callback) => callback(now));
  });
  const pointer = (type: string, pointerType = "mouse", extra: MouseEventInit = {}) => {
    const event = new MouseEvent(type, { clientX: 120, clientY: 180, bubbles: true, ...extra });
    Object.defineProperty(event, "pointerType", { value: pointerType });
    fireEvent(window, event);
  };
  return { ...rendered, rows, tiles, frames, media, hit, step, pointer };
}

describe("stationary mouse dossier hover", () => {
  it("updates the tile and row on scroll and subsequent animation frames without another mouse move", () => {
    const h = setup();
    h.hit.mockReturnValue(h.tiles[0]);
    h.pointer("pointermove");
    h.step();
    expect(h.tiles[0]).toHaveAttribute("data-pointer-hover", "true");
    expect(h.rows[0]).toHaveAttribute("data-pointer-hover", "true");
    h.hit.mockReturnValue(h.tiles[1]);
    fireEvent.scroll(window);
    h.step();
    expect(h.tiles[0]).toHaveAttribute("data-pointer-hover", "false");
    expect(h.rows[0]).toHaveAttribute("data-pointer-hover", "false");
    expect(h.tiles[1]).toHaveAttribute("data-pointer-hover", "true");
    // Compositor settling still gets re-tested after the scroll event itself.
    h.hit.mockReturnValue(h.rows[1]);
    h.step(32);
    expect(h.rows[1]).toHaveAttribute("data-pointer-hover", "true");
    expect(h.tiles[1]).toHaveAttribute("data-pointer-hover", "false");
    expect(h.hit).toHaveBeenLastCalledWith(120, 180);
    h.step(400);
    expect(h.frames.size).toBe(0);
  });

  it("seeds coordinates from wheel input and clears when a header or overlay covers the card", () => {
    const h = setup();
    h.hit.mockReturnValue(h.tiles[0]);
    fireEvent.wheel(window, { clientX: 200, clientY: 300, deltaY: 140 });
    h.step();
    expect(h.hit).toHaveBeenLastCalledWith(200, 300);
    expect(h.tiles[0]).toHaveAttribute("data-pointer-hover", "true");
    h.hit.mockReturnValue(document.body);
    fireEvent.scroll(window);
    h.step();
    expect(h.tiles[0]).toHaveAttribute("data-pointer-hover", "false");
  });

  it("does not fabricate hover for touch, pen, or coarse pointers", () => {
    const h = setup();
    h.hit.mockReturnValue(h.tiles[0]);
    h.pointer("pointermove");
    h.step();
    h.pointer("pointerdown", "touch");
    expect(h.tiles[0]).toHaveAttribute("data-pointer-hover", "false");
    fireEvent.scroll(window);
    expect(h.frames.size).toBe(0);
    h.pointer("pointermove", "pen");
    expect(h.frames.size).toBe(0);
    h.media.matches = false;
    h.pointer("pointermove");
    fireEvent.wheel(window, { clientX: 120, clientY: 180 });
    expect(h.frames.size).toBe(0);
  });

  it("clears stale state on mouse exit, blur, media change, and unmount", () => {
    const h = setup();
    h.hit.mockReturnValue(h.tiles[0]);
    h.pointer("pointermove"); h.step();
    h.pointer("pointerout", "mouse", { relatedTarget: null });
    expect(h.tiles[0]).toHaveAttribute("data-pointer-hover", "false");
    h.pointer("pointermove"); h.step();
    fireEvent.blur(window);
    expect(h.tiles[0]).toHaveAttribute("data-pointer-hover", "false");
    h.pointer("pointermove"); h.step();
    act(() => h.media.addEventListener.mock.calls[0][1]());
    expect(h.tiles[0]).not.toHaveAttribute("data-pointer-hover");
    h.pointer("pointermove"); h.step();
    fireEvent.scroll(window);
    h.unmount();
    expect(h.frames.size).toBe(0);
    expect(h.tiles[0]).not.toHaveAttribute("data-pointer-hover");
    fireEvent.scroll(window);
    expect(h.frames.size).toBe(0);
    expect(h.media.removeEventListener).toHaveBeenCalled();
  });

  it("coalesces rapid inputs into one frame and stops when the document is hidden", () => {
    const h = setup();
    h.hit.mockReturnValue(h.tiles[0]);
    h.pointer("pointermove");
    h.pointer("pointermove");
    fireEvent.scroll(window);
    fireEvent.resize(window);
    expect(h.frames.size).toBe(1);
    h.step();
    expect(h.tiles[0]).toHaveAttribute("data-pointer-hover", "true");
    vi.spyOn(document, "hidden", "get").mockReturnValue(true);
    fireEvent(document, new Event("visibilitychange"));
    expect(h.frames.size).toBe(0);
    expect(h.tiles[0]).toHaveAttribute("data-pointer-hover", "false");
    fireEvent.scroll(window);
    expect(h.frames.size).toBe(0);
  });

  it("leaves native CSS hover available when browser hit testing is unavailable", () => {
    Object.defineProperty(document, "elementFromPoint", { configurable: true, value: undefined });
    const { container } = render(<Harness />);
    fireEvent.scroll(window);
    expect(container.querySelector("[data-pointer-hover]")).toBeNull();
  });
});
