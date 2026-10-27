import { render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ScrollCrosshair } from "./ScrollCrosshair";

const motion = vi.hoisted(() => ({
  to: vi.fn(),
  kill: vi.fn(),
  registerPlugin: vi.fn(),
}));

vi.mock("gsap", () => ({
  default: {
    registerPlugin: motion.registerPlugin,
    to: (...args: unknown[]) => {
      motion.to(...args);
      return { kill: motion.kill };
    },
  },
}));
vi.mock("gsap/ScrollTrigger", () => ({ ScrollTrigger: {} }));

afterEach(() => {
  vi.restoreAllMocks();
  motion.to.mockClear();
  motion.kill.mockClear();
  motion.registerPlugin.mockClear();
});

describe("ScrollCrosshair", () => {
  it("scrubs one 240-degree turn until the plus leaves view", async () => {
    vi.spyOn(window, "matchMedia").mockImplementation(query => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as MediaQueryList));

    const { container, unmount } = render(<div className="page-plate-field"><ScrollCrosshair /></div>);
    const field = container.querySelector<HTMLElement>(".page-plate-field")!;
    const mark = container.querySelector<HTMLElement>(".page-plate-crosshair-mark")!;
    vi.spyOn(field, "getBoundingClientRect").mockReturnValue({ top: 100 } as DOMRect);
    Object.defineProperty(field, "clientHeight", { configurable: true, value: 300 });
    Object.defineProperty(mark, "clientHeight", { configurable: true, value: 32 });

    await waitFor(() => expect(motion.to).toHaveBeenCalledOnce());
    const [target, options] = motion.to.mock.calls[0] as [HTMLElement, { rotation: number; ease: string; scrollTrigger: { start: number; end: () => number; scrub: boolean } }];
    expect(target).toBe(mark);
    expect(options.rotation).toBe(240);
    expect(options.ease).toBe("none");
    expect(options.scrollTrigger.start).toBe(0);
    expect(options.scrollTrigger.scrub).toBe(true);
    expect(options.scrollTrigger.end()).toBe(266);
    unmount();
    expect(motion.kill).toHaveBeenCalledOnce();
  });

  it("stays static when reduced motion is requested", async () => {
    const { container } = render(<div className="page-plate-field"><ScrollCrosshair /></div>);
    expect(container.querySelector(".page-plate-crosshair-mark")).toBeInTheDocument();
    expect(motion.to).not.toHaveBeenCalled();
  });
});
