import { act, fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CHAPTER_SETTLE, HomeChapterStack } from "./home-chapter-stack";

// GSAP/ScrollTrigger doubles. The reveal trigger spans scroll 100 → 900 (viewport 800).
const gsapState = vi.hoisted(() => ({
  gate: null as Promise<void> | null,
  created: 0,
  tweens: 0,
  reverted: 0,
  listeners: new Map<string, Set<() => void>>(),
  refreshes: 0,
  segment: { start: 100, end: 900 },
}));

vi.mock("gsap", async () => {
  if (gsapState.gate) await gsapState.gate;
  return {
    default: {
      registerPlugin: vi.fn(),
      set: vi.fn(),
      to: vi.fn(() => { gsapState.tweens++; return { scrollTrigger: gsapState.segment }; }),
      context: vi.fn((callback: () => void) => {
        callback();
        return { revert: () => { gsapState.reverted++; } };
      }),
    },
  };
});

vi.mock("gsap/ScrollTrigger", () => ({
  ScrollTrigger: {
    create: vi.fn(() => { gsapState.created++; }),
    addEventListener: vi.fn((type: string, callback: () => void) => {
      if (!gsapState.listeners.has(type)) gsapState.listeners.set(type, new Set());
      gsapState.listeners.get(type)!.add(callback);
    }),
    removeEventListener: vi.fn((type: string, callback: () => void) => { gsapState.listeners.get(type)?.delete(callback); }),
    refresh: vi.fn(() => {
      gsapState.refreshes++;
      gsapState.listeners.get("refreshInit")?.forEach(callback => callback());
      gsapState.listeners.get("refresh")?.forEach(callback => callback());
    }),
  },
}));

const finePointerMedia = (query: string) => ({
  matches: false, media: query, onchange: null,
  addListener: vi.fn(), removeListener: vi.fn(), addEventListener: vi.fn(), removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(() => false),
});

// Controllable ResizeObserver so tests can report plate/section size changes.
const observers: { callback: ResizeObserverCallback; targets: Set<Element> }[] = [];
class ControlledResizeObserver {
  private record: { callback: ResizeObserverCallback; targets: Set<Element> };
  constructor(callback: ResizeObserverCallback) {
    this.record = { callback, targets: new Set() };
    observers.push(this.record);
  }
  observe(target: Element) { this.record.targets.add(target); }
  unobserve(target: Element) { this.record.targets.delete(target); }
  disconnect() { this.record.targets.clear(); }
}
const reportSize = (target: Element, width: number, height: number) => {
  for (const observer of observers) {
    if (!observer.targets.has(target)) continue;
    observer.callback([{ target, contentRect: { width, height } } as unknown as ResizeObserverEntry], observer as unknown as ResizeObserver);
  }
};

const OriginalResizeObserver = globalThis.ResizeObserver;
// jsdom has no PointerEvent; the stack uses pointer events (ids, types) when present.
class TestPointerEvent extends MouseEvent {
  pointerId: number;
  pointerType: string;
  constructor(type: string, init: PointerEventInit = {}) {
    super(type, init);
    this.pointerId = init.pointerId ?? 0;
    this.pointerType = init.pointerType ?? "";
  }
}
const OriginalPointerEvent = globalThis.PointerEvent;
let scrollY = 0;
const writes: number[] = [];
const setScroll = (y: number) => { scrollY = y; };

beforeEach(() => {
  scrollY = 0;
  writes.length = 0;
  observers.length = 0;
  Object.assign(gsapState, { gate: null, created: 0, tweens: 0, reverted: 0, refreshes: 0 });
  gsapState.listeners.clear();
  Object.assign(gsapState.segment, { start: 100, end: 900 });
  Object.defineProperty(window, "scrollY", { configurable: true, get: () => scrollY });
  Object.defineProperty(window, "innerHeight", { configurable: true, value: 800 });
  vi.spyOn(window, "matchMedia").mockImplementation(finePointerMedia);
  vi.spyOn(window, "scrollTo").mockImplementation(((options: ScrollToOptions) => {
    scrollY = options.top ?? scrollY;
    writes.push(scrollY);
    window.dispatchEvent(new Event("scroll"));
  }) as typeof window.scrollTo);
  // The setup file defines ResizeObserver writable (not configurable): assign, then restore.
  globalThis.ResizeObserver = ControlledResizeObserver as unknown as typeof ResizeObserver;
  globalThis.PointerEvent = TestPointerEvent as unknown as typeof PointerEvent;
});

afterEach(() => {
  vi.useRealTimers();
  globalThis.ResizeObserver = OriginalResizeObserver;
  globalThis.PointerEvent = OriginalPointerEvent;
  vi.restoreAllMocks();
  Object.defineProperty(window, "scrollY", { configurable: true, value: 0, writable: true });
});

const Stack = () => (
  <HomeChapterStack>
    <section className="home-chapter"><div className="home-chapter-plate">One</div></section>
    <section className="home-chapter"><div className="home-chapter-plate">Two</div></section>
  </HomeChapterStack>
);

async function mountPinned() {
  const view = render(<Stack />);
  const stack = view.container.querySelector<HTMLElement>(".home-chapter-stack")!;
  await waitFor(() => expect(stack).toHaveAttribute("data-chapter-motion", "pinned"));
  return { ...view, stack };
}

/** User scroll to `y` (wheel then scroll event), as native input produces it. */
function userScrollTo(y: number) {
  // A small delta: trackpad-style continuous input (a large lone delta is a mouse notch).
  fireEvent.wheel(window, { deltaY: Math.sign(y - scrollY) * 10 });
  setScroll(y);
  fireEvent.scroll(window);
}

describe("HomeChapterStack settle wiring", () => {
  it("publishes the ScrollTrigger segment geometry and a resting state", async () => {
    const { stack } = await mountPinned();
    expect(stack.dataset.chapterSegments).toBe("100:900");
    // The initial refresh schedules a re-evaluation that is not user input.
    expect(stack.dataset.chapterSettle).toBe("waiting");
    await waitFor(() => expect(stack.dataset.chapterSettle).toBe("idle"), { timeout: 2000 });
    expect(writes).toEqual([]);
  });

  it("settles only after input stops, then lands exactly on the incoming chapter top", async () => {
    const { stack } = await mountPinned();
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "requestAnimationFrame", "cancelAnimationFrame", "performance"] });
    userScrollTo(700); // 75 % forward
    vi.advanceTimersByTime(CHAPTER_SETTLE.idleMs - 20);
    expect(writes).toEqual([]);
    vi.advanceTimersByTime(CHAPTER_SETTLE.maxDurationMs + 400);
    expect(scrollY).toBe(900);
    expect(writes.length).toBeGreaterThan(10);
    expect(stack.dataset.chapterSettle).toBe("idle");
  });

  it("a wheel during the settle stops every further write", async () => {
    const { stack } = await mountPinned();
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "requestAnimationFrame", "cancelAnimationFrame", "performance"] });
    userScrollTo(700);
    vi.advanceTimersByTime(CHAPTER_SETTLE.idleMs + 150);
    expect(stack.dataset.chapterSettle).toBe("settling");
    const count = writes.length;
    fireEvent.wheel(window, { deltaY: -40 });
    vi.advanceTimersByTime(CHAPTER_SETTLE.idleMs - 20);
    expect(writes.length).toBe(count);
  });

  it("a lone mouse notch waits for the longer discrete idle delay", async () => {
    const { stack } = await mountPinned();
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "requestAnimationFrame", "cancelAnimationFrame", "performance"] });
    fireEvent.wheel(window, { deltaY: 100 });
    setScroll(200);
    fireEvent.scroll(window);
    vi.advanceTimersByTime(CHAPTER_SETTLE.discreteIdleMs - 50);
    expect(writes).toEqual([]);
    expect(stack.dataset.chapterSettle).toBe("active");
    vi.advanceTimersByTime(CHAPTER_SETTLE.maxDurationMs + 400);
    expect(scrollY).toBe(100);
  });

  it("window blur never leaves the plate mid-way", async () => {
    const { stack } = await mountPinned();
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "requestAnimationFrame", "cancelAnimationFrame", "performance"] });
    userScrollTo(500);
    window.dispatchEvent(new Event("blur"));
    vi.advanceTimersByTime(3000);
    expect(scrollY).toBe(100);
    expect(stack.dataset.chapterSettle).toBe("idle");
  });

  it("only scroll keys count as scroll input", async () => {
    const { stack } = await mountPinned();
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "requestAnimationFrame", "cancelAnimationFrame", "performance"] });
    userScrollTo(700);
    vi.advanceTimersByTime(CHAPTER_SETTLE.idleMs + 150);
    fireEvent.keyDown(window, { key: "Shift" });
    expect(stack.dataset.chapterSettle).toBe("settling");
    fireEvent.keyDown(window, { key: "ArrowUp" });
    expect(stack.dataset.chapterSettle).toBe("active");
  });

  it("a scroll the controller did not write (scrollbar drag) takes over", async () => {
    const { stack } = await mountPinned();
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "requestAnimationFrame", "cancelAnimationFrame", "performance"] });
    userScrollTo(700);
    vi.advanceTimersByTime(CHAPTER_SETTLE.idleMs + 150);
    const count = writes.length;
    setScroll(400);
    fireEvent.scroll(window);
    expect(stack.dataset.chapterSettle).toBe("active");
    vi.advanceTimersByTime(CHAPTER_SETTLE.idleMs - 20);
    expect(writes.length).toBe(count);
  });

  it("a held mouse button blocks settling across multiple contacts", async () => {
    await mountPinned();
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "requestAnimationFrame", "cancelAnimationFrame", "performance"] });
    userScrollTo(700);
    fireEvent.pointerDown(window, { pointerId: 1, pointerType: "mouse" });
    fireEvent.pointerDown(window, { pointerId: 2, pointerType: "pen" });
    vi.advanceTimersByTime(3000);
    fireEvent.pointerUp(window, { pointerId: 1, pointerType: "mouse" });
    vi.advanceTimersByTime(3000);
    expect(writes).toEqual([]);
    fireEvent.pointerUp(window, { pointerId: 2, pointerType: "pen" });
    vi.advanceTimersByTime(3000);
    expect(scrollY).toBe(900);
  });

  it("window resize invalidates geometry: no settle runs until the refresh completes", async () => {
    const { stack } = await mountPinned();
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "requestAnimationFrame", "cancelAnimationFrame", "performance"] });
    userScrollTo(700);
    vi.advanceTimersByTime(CHAPTER_SETTLE.idleMs + 150);
    expect(stack.dataset.chapterSettle).toBe("settling");
    const count = writes.length;
    const refreshes = gsapState.refreshes;
    Object.assign(gsapState.segment, { start: 200, end: 1000 });
    // The resize event arrives; ScrollTrigger's refresh runs on the next frame.
    window.dispatchEvent(new Event("resize"));
    expect(stack.dataset.chapterSettle).toBe("refreshing");
    expect(writes.length).toBe(count);
    vi.advanceTimersByTime(3000);
    expect(gsapState.refreshes).toBeGreaterThan(refreshes);
    expect(stack.dataset.chapterSegments).toBe("200:1000");
    expect([200, 1000]).toContain(scrollY);
  });

  it("pinning rewriting a section box does not refresh; a real plate size change does", async () => {
    const { container } = await mountPinned();
    const [section] = Array.from(container.querySelectorAll<HTMLElement>(".home-chapter"));
    const plate = section.querySelector(".home-chapter-plate")!;
    vi.useFakeTimers({ toFake: ["requestAnimationFrame", "cancelAnimationFrame"] });
    reportSize(plate, 1250, 3391);
    vi.advanceTimersByTime(50);
    const baseline = gsapState.refreshes;
    // ScrollTrigger pins the section (fixed, fractional inline height): not observed.
    reportSize(section, 1250, 3390.91);
    reportSize(plate, 1250, 3390.91);
    vi.advanceTimersByTime(50);
    expect(gsapState.refreshes).toBe(baseline);
    reportSize(plate, 1250, 3500);
    vi.advanceTimersByTime(50);
    expect(gsapState.refreshes).toBe(baseline + 1);
  });
});

describe("HomeChapterStack lifecycle", () => {
  it("cancels asynchronous setup when unmounted before GSAP loads", async () => {
    let open = () => {};
    gsapState.gate = new Promise<void>(resolve => { open = resolve; });
    vi.resetModules();
    const { HomeChapterStack: FreshStack } = await import("./home-chapter-stack");
    const view = render(
      <FreshStack>
        <section className="home-chapter"><div className="home-chapter-plate">One</div></section>
        <section className="home-chapter"><div className="home-chapter-plate">Two</div></section>
      </FreshStack>,
    );
    view.unmount();
    await act(async () => { open(); await gsapState.gate; await new Promise(resolve => setTimeout(resolve, 20)); });
    expect(gsapState.created).toBe(0);
    expect(gsapState.tweens).toBe(0);
    expect([...gsapState.listeners.values()].every(set => set.size === 0)).toBe(true);
  });

  it("teardown leaves no listeners, triggers, timers, or frames behind", async () => {
    const added = new Map<string, number>();
    const addSpy = vi.spyOn(window, "addEventListener");
    const removeSpy = vi.spyOn(window, "removeEventListener");
    const docAdd = vi.spyOn(document, "addEventListener");
    const docRemove = vi.spyOn(document, "removeEventListener");
    const { unmount } = await mountPinned();
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "requestAnimationFrame", "cancelAnimationFrame", "performance"] });
    userScrollTo(700);
    vi.advanceTimersByTime(CHAPTER_SETTLE.idleMs + 150); // mid-settle
    unmount();
    expect(gsapState.reverted).toBe(1);
    expect([...gsapState.listeners.values()].every(set => set.size === 0)).toBe(true);
    expect(vi.getTimerCount()).toBe(0);
    for (const [spy, name] of [[addSpy, "add"], [docAdd, "add"], [removeSpy, "remove"], [docRemove, "remove"]] as const) {
      for (const [type] of spy.mock.calls) added.set(`${name}:${type}`, (added.get(`${name}:${type}`) ?? 0) + 1);
    }
    for (const [key, count] of added) {
      if (!key.startsWith("add:")) continue;
      const type = key.slice(4);
      // Ignore events added by React/testing-library itself on window.
      if (["error"].includes(type)) continue;
      expect(added.get(`remove:${type}`) ?? 0, type).toBeGreaterThanOrEqual(count);
    }
    const count = writes.length;
    userScrollTo(300);
    vi.advanceTimersByTime(3000);
    expect(writes.length).toBe(count);
  });
});

describe("HomeChapterStack interaction fallbacks", () => {
  it("permanently restores native flow when a touch gesture starts on a fine-pointer layout", async () => {
    const { stack } = await mountPinned();
    fireEvent.touchStart(window, { touches: [{ identifier: 7 }] });
    expect(stack).toHaveAttribute("data-chapter-motion", "flow");
    expect(gsapState.reverted).toBe(1);

    // A later pointer cancellation or media-query setup opportunity must not
    // re-arm pinned settling during the same mounted page session.
    fireEvent.pointerCancel(window, { pointerId: 7, pointerType: "touch" });
    await new Promise(resolve => setTimeout(resolve, 20));
    expect(stack).toHaveAttribute("data-chapter-motion", "flow");

    vi.useFakeTimers();
    setScroll(450);
    fireEvent.scroll(window);
    vi.advanceTimersByTime(3000);
    expect(writes).toEqual([]);
  });

  it("a touch arriving mid-settle stops it beneath the finger", async () => {
    const { stack } = await mountPinned();
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "requestAnimationFrame", "cancelAnimationFrame", "performance"] });
    userScrollTo(700);
    vi.advanceTimersByTime(CHAPTER_SETTLE.idleMs + 150);
    expect(stack.dataset.chapterSettle).toBe("settling");
    const count = writes.length;
    fireEvent.touchStart(window, { touches: [{ identifier: 3 }] });
    vi.advanceTimersByTime(3000);
    expect(writes.length).toBe(count);
    expect(stack).toHaveAttribute("data-chapter-motion", "flow");
  });

  it("catches a pointer-only touch before the asynchronous GSAP setup completes", async () => {
    const { container } = render(<Stack />);
    const stack = container.querySelector<HTMLElement>(".home-chapter-stack")!;
    const pointerDown = new Event("pointerdown", { bubbles: true, cancelable: true });
    Object.defineProperty(pointerDown, "pointerType", { value: "touch" });
    window.dispatchEvent(pointerDown);

    await new Promise(resolve => setTimeout(resolve, 50));
    expect(stack).toHaveAttribute("data-chapter-motion", "flow");
    expect(gsapState.created).toBe(0);
  });
});
