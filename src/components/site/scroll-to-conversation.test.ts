import { afterEach, describe, expect, it, vi } from "vitest";
import { scrollToConversation } from "./scroll-to-conversation";

afterEach(() => vi.restoreAllMocks());

function setup(reduced = false) {
  vi.spyOn(window, "matchMedia").mockReturnValue({ matches: reduced, addEventListener: vi.fn(), removeEventListener: vi.fn() } as unknown as MediaQueryList);
  vi.spyOn(window, "scrollY", "get").mockReturnValue(100);
  vi.spyOn(window, "innerHeight", "get").mockReturnValue(900);
  vi.spyOn(document.documentElement, "scrollHeight", "get").mockReturnValue(6000);
  vi.spyOn(performance, "now").mockReturnValue(0);
  let next: FrameRequestCallback = () => {};
  const request = vi.spyOn(window, "requestAnimationFrame").mockImplementation(callback => { next = callback; return 7; });
  const cancelFrame = vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
  const scroll = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  const target = document.createElement("div");
  target.getBoundingClientRect = () => ({ top: 3000, height: 900 }) as DOMRect;
  target.scrollIntoView = vi.fn();
  const arrival = vi.fn();
  const cancel = scrollToConversation(target, arrival);
  return { advance: (time: number) => next(time), request, cancelFrame, scroll, target, arrival, cancel };
}

describe("conversation scroll", () => {
  it("physically scrolls through intermediate positions and arrives after 1.3 seconds", () => {
    const state = setup();
    expect(state.arrival).not.toHaveBeenCalled();
    state.advance(0);
    expect(state.scroll).toHaveBeenLastCalledWith({ top: 100, behavior: "instant" });
    state.advance(650);
    expect(state.scroll).toHaveBeenLastCalledWith({ top: 1600, behavior: "instant" });
    expect(state.arrival).not.toHaveBeenCalled();
    state.advance(1300);
    expect(state.scroll).toHaveBeenLastCalledWith({ top: 3100, behavior: "instant" });
    expect(state.arrival).toHaveBeenCalledOnce();
  });
  it("uses immediate centered navigation for reduced motion", () => {
    const state = setup(true);
    expect(state.request).not.toHaveBeenCalled();
    expect(state.target.scrollIntoView).toHaveBeenCalledWith({ block: "center", behavior: "instant" });
    expect(state.arrival).toHaveBeenCalledOnce();
  });
  it("uses an untransformed layout center when the destination is inside a rotating chapter", () => {
    const state = setup();
    state.cancel();
    const arrival = vi.fn();
    const cancel = scrollToConversation(state.target, arrival, 3600);
    state.advance(1300);
    expect(state.scroll).toHaveBeenLastCalledWith({ top: 3150, behavior: "instant" });
    expect(arrival).toHaveBeenCalledOnce();
    cancel();
  });
  it.each(["wheel", "touchstart", "pointerdown", "keydown", "resize"])("yields to %s without stealing focus", event => {
    const state = setup();
    window.dispatchEvent(new Event(event));
    expect(state.cancelFrame).toHaveBeenCalledWith(7);
    expect(state.arrival).not.toHaveBeenCalled();
    state.cancel();
  });
});
