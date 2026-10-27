import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { readFileSync } from "node:fs";
import { inflateSync } from "node:zlib";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GrainTexture } from "./GrainTexture";
import { GRAIN_TILE_SIZE, grainCell } from "./grain-pattern.mjs";
import { designTokens } from "@/lib/design-system/tokens";

const originalIntersectionObserver = globalThis.IntersectionObserver;
const originalResizeObserver = globalThis.ResizeObserver;

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  globalThis.IntersectionObserver = originalIntersectionObserver;
  globalThis.ResizeObserver = originalResizeObserver;
});

function grainHarness(reduced = false) {
  const frames = new Map<number, FrameRequestCallback>();
  let nextFrame = 0;
  let intersection: IntersectionObserverCallback | undefined;
  let resize: ResizeObserverCallback | undefined;
  const disconnect = vi.fn();
  const draws: Uint32Array[] = [];
  const context = {
    createImageData: (width: number, height: number) => ({ width, height, data: new Uint8ClampedArray(width * height * 4) }),
    putImageData: vi.fn((image: ImageData) => { draws.push(new Uint32Array(image.data.buffer).slice()); }),
  };
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(context as unknown as CanvasRenderingContext2D);
  vi.spyOn(HTMLCanvasElement.prototype, "clientWidth", "get").mockReturnValue(20);
  vi.spyOn(HTMLCanvasElement.prototype, "clientHeight", "get").mockReturnValue(20);
  vi.spyOn(window, "matchMedia").mockReturnValue({
    matches: reduced, addEventListener: vi.fn(), removeEventListener: vi.fn(),
  } as unknown as MediaQueryList);
  globalThis.IntersectionObserver = class {
    constructor(callback: IntersectionObserverCallback) { intersection = callback; }
    observe() {}
    disconnect = disconnect;
  } as unknown as typeof IntersectionObserver;
  globalThis.ResizeObserver = class {
    constructor(callback: ResizeObserverCallback) { resize = callback; }
    observe() {}
    disconnect = disconnect;
  } as unknown as typeof ResizeObserver;
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    frames.set(++nextFrame, callback);
    return nextFrame;
  });
  vi.stubGlobal("cancelAnimationFrame", (id: number) => frames.delete(id));
  return {
    draws, frames, disconnect, context,
    visible(value: boolean) {
      act(() => intersection?.([{ isIntersecting: value } as IntersectionObserverEntry], {} as IntersectionObserver));
    },
    tick(now: number) {
      const entry = frames.entries().next().value;
      if (!entry) throw new Error("No scheduled grain frame");
      frames.delete(entry[0]);
      act(() => entry[1](now));
    },
    resize() { act(() => resize?.([], {} as ResizeObserver)); },
  };
}

describe("GrainTexture motion", () => {
  it("ships an embedded first-paint tile identical to the canvas seed and paper token", () => {
    const html = renderToString(<GrainTexture className="test-grain" />);
    expect(html).toContain('class="grain-texture test-grain"');
    expect(html).not.toContain("data-grain-ready");
    const css = readFileSync("src/components/site/grain-texture.css", "utf8");
    const png = Buffer.from(css.match(/base64,([^\"]+)/)![1], "base64");
    const chunks = new Map<string, Buffer>();
    for (let offset = 8; offset < png.length;) {
      const length = png.readUInt32BE(offset);
      chunks.set(png.toString("ascii", offset + 4, offset + 8), png.subarray(offset + 8, offset + 8 + length));
      offset += 12 + length;
    }
    const rgb = [1, 3, 5].map(offset => parseInt(designTokens.color.paper.slice(offset, offset + 2), 16));
    expect([...chunks.get("PLTE")!.subarray(3)]).toEqual(rgb);
    expect([...chunks.get("tRNS")!]).toEqual([0, 128]);
    const rows = inflateSync(chunks.get("IDAT")!);
    let count = 0;
    for (let y = 0; y < GRAIN_TILE_SIZE; y++) for (let x = 0; x < GRAIN_TILE_SIZE; x++) {
      const filled = !!(rows[y * (1 + GRAIN_TILE_SIZE / 8) + 1 + (x >> 3)] & (1 << (7 - (x & 7))));
      expect(filled).toBe(grainCell(x, y));
      if (filled) count++;
    }
    expect(count / GRAIN_TILE_SIZE ** 2).toBeCloseTo(0.65, 1);
  });
  it("initializes the complete texture, then evolves a small subset at 4Hz", () => {
    const harness = grainHarness();
    const random = vi.spyOn(Math, "random").mockReturnValue(0);
    const { container } = render(<GrainTexture className="test-grain" />);
    const canvas = container.querySelector("canvas")!;
    expect(canvas).toHaveAttribute("aria-hidden", "true");
    expect(canvas).toHaveClass("grain-texture", "test-grain");
    expect(canvas.width).toBe(10);
    expect(canvas.height).toBe(10);
    expect(harness.draws).toHaveLength(1);
    expect(canvas).toHaveAttribute("data-grain-ready", "true");
    expect(harness.draws[0].every((pixel, i) => !!pixel === grainCell(i % 10, Math.floor(i / 10)))).toBe(true);
    expect(harness.draws[0].filter(Boolean).every(pixel => pixel >>> 24 === 128)).toBe(true);
    harness.visible(true);
    harness.tick(249);
    expect(harness.draws).toHaveLength(1);
    let refreshCalls = 0;
    let writingPixel = false;
    random.mockImplementation(() => {
      if (writingPixel) { writingPixel = false; return 0.99; }
      writingPixel = refreshCalls++ % 8 === 0;
      return writingPixel ? 0 : 0.99;
    });
    harness.tick(250);
    expect(harness.draws).toHaveLength(2);
    expect(harness.draws[1].every((pixel, index) => index % 8 === 0 ? pixel === 0 : pixel === harness.draws[0][index])).toBe(true);
    harness.tick(499);
    expect(harness.draws).toHaveLength(2);
  });

  it("retains a complete still texture for reduced motion", () => {
    const harness = grainHarness(true);
    vi.spyOn(Math, "random").mockReturnValue(0);
    render(<GrainTexture />);
    harness.visible(true);
    expect(harness.draws).toHaveLength(1);
    expect(harness.draws[0].some(pixel => pixel !== 0)).toBe(true);
    expect(harness.frames.size).toBe(0);
  });

  it("pauses offscreen, avoids unnecessary redraws, and cleans up", () => {
    const harness = grainHarness();
    const { unmount } = render(<GrainTexture />);
    harness.visible(true);
    expect(harness.frames.size).toBe(1);
    harness.resize();
    expect(harness.draws).toHaveLength(1);
    harness.visible(false);
    expect(harness.frames.size).toBe(0);
    harness.visible(true);
    unmount();
    expect(harness.frames.size).toBe(0);
    expect(harness.disconnect).toHaveBeenCalledTimes(2);
  });

  it("keeps the static fallback when a context is unavailable", () => {
    const { container } = render(<GrainTexture />);
    expect(container.querySelector("canvas")).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelector("canvas")).not.toHaveAttribute("data-grain-ready");
  });

  it("keeps the tile on initialization failure and recovers after context restoration", () => {
    const harness = grainHarness();
    harness.context.putImageData.mockImplementationOnce(() => { throw new Error("drawing failed"); });
    const { container } = render(<GrainTexture />);
    const canvas = container.querySelector("canvas")!;
    harness.visible(true);
    expect(canvas).not.toHaveAttribute("data-grain-ready");
    expect(harness.frames.size).toBe(0);
    fireEvent(canvas, new Event("contextrestored"));
    expect(canvas).toHaveAttribute("data-grain-ready", "true");
    expect(harness.frames.size).toBe(1);
    fireEvent(canvas, new Event("contextlost", { cancelable: true }));
    expect(canvas).not.toHaveAttribute("data-grain-ready");
    expect(harness.frames.size).toBe(0);
    fireEvent(canvas, new Event("contextrestored"));
    expect(canvas).toHaveAttribute("data-grain-ready", "true");
    expect(harness.draws.at(-1)).toEqual(harness.draws[0]);
  });

  it("redraws resized surfaces and pauses while the document is hidden", () => {
    const harness = grainHarness();
    const { container } = render(<GrainTexture />);
    harness.visible(true);
    vi.spyOn(HTMLCanvasElement.prototype, "clientWidth", "get").mockReturnValue(40);
    harness.resize();
    expect(container.querySelector("canvas")!.width).toBe(20);
    expect(harness.draws.at(-1)).toHaveLength(200);
    vi.spyOn(document, "hidden", "get").mockReturnValue(true);
    fireEvent(document, new Event("visibilitychange"));
    expect(harness.frames.size).toBe(0);
    vi.spyOn(document, "hidden", "get").mockReturnValue(false);
    fireEvent(document, new Event("visibilitychange"));
    expect(harness.frames.size).toBe(1);
  });
});
