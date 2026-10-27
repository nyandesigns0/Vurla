import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  CHAPTER_PLATE_MOTION,
  CHAPTER_SETTLE,
  createChapterSettle,
  easeSettle,
  getIdleDelay,
  getMaxSettleStep,
  getSettleDuration,
  getSettleTarget,
  isChapterCovered,
  type SettleHost,
  type SettleSegment,
} from "./home-chapter-stack";

describe("chapter plate motion contract", () => {
  it("scrubs directly, so the plate angle is a pure function of scroll position", () => {
    // A smoothed scrub (e.g. 0.25s) keeps rotating after input stops, so a pause and
    // a continuous pass through the same position showed different plates.
    expect(CHAPTER_PLATE_MOTION).toEqual({
      rotation: 30,
      transformOrigin: "bottom left",
      revealStart: "top bottom",
      revealEnd: "top 25%",
      restOffset: 0.25,
      pinStart: "bottom bottom",
      pinEnd: "bottom top",
      scrub: true,
    });
  });
});

describe("chapter stack stylesheet", () => {
  const css = readFileSync(path.resolve(__dirname, "../../app/globals.css"), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  const rules = (selector: string) =>
    [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
      .filter(([, selectors]) => selectors.split(",").map(s => s.trim()).includes(selector))
      .map(([, , body]) => body);

  it("never turns <body> into a nested scroll container", () => {
    // `overflow-x: hidden` on body computes overflow-y to auto: the rotated plates'
    // corners then gave body its own scroll range, which captured wheel input away
    // from the window scroller that ScrollTrigger and the settle controller observe.
    for (const body of rules("body")) expect(body).not.toMatch(/overflow(-[xy])?\s*:\s*(hidden|auto|scroll)/);
    for (const body of rules("html,body")) expect(body).not.toMatch(/overflow/);
  });

  it("clips rotated plate overflow at the stack so document height stays stable", () => {
    expect(rules(".home-chapter-stack").join(";")).toMatch(/overflow\s*:\s*clip/);
  });
});

describe("settle decision rules", () => {
  it("leaving the previous rest: completes at 70% or more, otherwise returns", () => {
    expect(getSettleTarget(0.7, 0)).toBe(1);
    expect(getSettleTarget(0.85, 0)).toBe(1);
    expect(getSettleTarget(0.69, 0)).toBe(0);
    expect(getSettleTarget(0.5, 0)).toBe(0);
    expect(getSettleTarget(0.25, 0)).toBe(0);
  });

  it("leaving the completed chapter: returns at 30% or less, otherwise restores it", () => {
    expect(getSettleTarget(0.3, 1)).toBe(0);
    expect(getSettleTarget(0.1, 1)).toBe(0);
    expect(getSettleTarget(0.31, 1)).toBe(1);
    expect(getSettleTarget(0.5, 1)).toBe(1);
    expect(getSettleTarget(0.75, 1)).toBe(1);
  });

  it("treats a stop a fraction of a pixel short of a threshold as having reached it", () => {
    // 70% of a 576px segment is 403.2px; the browser snaps the scroll position to 403.
    const tolerance = CHAPTER_SETTLE.restEpsilon / 576;
    expect(getSettleTarget(403 / 576, 0)).toBe(0);
    expect(getSettleTarget(403 / 576, 0, tolerance)).toBe(1);
    expect(getSettleTarget(173 / 576, 1, tolerance)).toBe(0);
    expect(getSettleTarget(0.6, 0, tolerance)).toBe(0);
    expect(getSettleTarget(0.4, 1, tolerance)).toBe(1);
  });

  it("is symmetric between the two origins", () => {
    for (let p = 0.01; p < 1; p += 0.01) expect(getSettleTarget(p, 0)).toBe(1 - getSettleTarget(1 - p, 1)!);
  });

  it("uses the nearer endpoint only when no origin is known", () => {
    expect(getSettleTarget(0.49, null)).toBe(0);
    expect(getSettleTarget(0.5, null)).toBe(1);
  });

  it("leaves resting endpoints alone", () => {
    expect(getSettleTarget(0, 0)).toBeNull();
    expect(getSettleTarget(1, 1)).toBeNull();
  });

  it("uses a distance-scaled duration and an ease with zero endpoint velocity", () => {
    expect(getSettleDuration(0, 800)).toBe(CHAPTER_SETTLE.minDurationMs);
    expect(getSettleDuration(-400, 800)).toBeCloseTo((CHAPTER_SETTLE.minDurationMs + CHAPTER_SETTLE.maxDurationMs) / 2);
    expect(getSettleDuration(5000, 800)).toBe(CHAPTER_SETTLE.maxDurationMs);
    expect(easeSettle(0)).toBe(0);
    expect(easeSettle(1)).toBe(1);
    expect(easeSettle(0.02)).toBeLessThan(0.002);
    expect(1 - easeSettle(0.98)).toBeLessThan(0.002);
    for (let t = 0; t < 1; t += 0.05) expect(easeSettle(t + 0.05)).toBeGreaterThanOrEqual(easeSettle(t));
  });
});

// Deterministic host: manual clock, timers, and frames at a fixed frame interval.
// Controller writes emit a scroll event on the next frame, as a browser would.
function harness({ segment = { start: 1000, end: 1800 }, frameMs = 16 } = {}) {
  let now = 0;
  let y = 1000;
  let segments: SettleSegment[] = [segment];
  let timers: { callback: () => void; at: number }[] = [];
  let frames: (() => void)[] = [];
  let pendingScrollEvent = false;
  const writes: { t: number; y: number }[] = [];
  const states: string[] = [];
  const host: SettleHost = {
    now: () => now,
    getScroll: () => y,
    scrollTo: next => { y = next; writes.push({ t: now, y: next }); pendingScrollEvent = true; },
    viewportHeight: () => 800,
    setTimer: (callback, ms) => { const handle = { callback, at: now + ms }; timers.push(handle); return handle; },
    clearTimer: handle => { timers = timers.filter(timer => timer !== handle); },
    requestFrame: callback => { frames.push(callback); return callback; },
    cancelFrame: handle => { frames = frames.filter(frame => frame !== handle); },
    onStateChange: state => states.push(state),
  };
  const settle = createChapterSettle(() => segments, host);
  const frame = (ms = frameMs) => {
    now += ms;
    if (pendingScrollEvent) { pendingScrollEvent = false; settle.onScroll(); }
    const due = timers.filter(timer => timer.at <= now);
    timers = timers.filter(timer => timer.at > now);
    due.forEach(timer => timer.callback());
    const pending = frames;
    frames = [];
    pending.forEach(callback => callback());
  };
  const tick = (ms: number) => { for (let elapsed = 0; elapsed < ms; elapsed += frameMs) frame(); };
  /** Native user scroll: input event, position change, scroll event. */
  const userScroll = (delta: number) => { settle.onInput(); y += delta; settle.onScroll(); };
  const userScrollTo = (target: number, stepPx = 20, intervalMs = 16) => {
    const direction = Math.sign(target - y);
    while (direction !== 0 && Math.sign(target - y) === direction) {
      userScroll(direction * Math.min(stepPx, Math.abs(target - y)));
      tick(intervalMs);
    }
  };
  const at = (p: number) => segment.start + p * (segment.end - segment.start);
  return {
    settle, tick, frame, userScroll, userScrollTo, writes, states, at,
    getY: () => y,
    /** Scrollbar drag / anchor jump: the position changes with no wheel or key event. */
    nativeJump: (next: number) => { y = next; settle.onScroll(); },
    silentMove: (delta: number) => { y += delta; },
    /** The scroll caused by an input already reported via onInput. */
    userScrollNoInput: (delta: number) => { y += delta; settle.onScroll(); },
    pending: () => ({ timers: timers.length, frames: frames.length }),
    refresh: (next: SettleSegment[]) => { settle.onRefreshInit(); segments = next; settle.onRefresh(); },
    setSegments: (next: SettleSegment[]) => { segments = next; },
  };
}

const idle = CHAPTER_SETTLE.idleMs;
// Longest possible wait for a settle to finish: a stretched idle delay plus the longest ease.
const SETTLE_BUDGET = CHAPTER_SETTLE.maxIdleMs + CHAPTER_SETTLE.maxDurationMs + 200;

describe("chapter settle controller", () => {
  it("never writes while input is active, through any number of reversals", () => {
    const h = harness();
    h.userScrollTo(h.at(0.8));
    h.userScrollTo(h.at(0.2));
    for (let i = 0; i < 12; i++) { h.userScroll(i % 2 ? -30 : 30); h.tick(120); }
    h.userScrollTo(h.at(0.9), 40, 200);
    expect(h.writes).toEqual([]);
  });

  it("repeated stop/resume shorter than the idle threshold never writes or moves the page", () => {
    const h = harness();
    for (const p of [0.25, 0.5, 0.7, 0.85]) {
      h.userScrollTo(h.at(p));
      const stoppedAt = h.getY();
      h.tick(idle - 50);
      expect(h.getY()).toBe(stoppedAt);
    }
    expect(h.writes).toEqual([]);
  });

  it.each([
    [0.25, "start"], [0.5, "start"], [0.69, "start"], [0.7, "end"], [0.85, "end"],
  ] as const)("forward stop at %s settles to the %s after input stops", (p, endpoint) => {
    const h = harness();
    h.userScrollTo(h.at(p));
    h.tick(idle - 50);
    expect(h.writes).toEqual([]);
    h.tick(SETTLE_BUDGET);
    expect(h.getY()).toBe(endpoint === "end" ? 1800 : 1000);
    expect(h.settle.getState()).toBe("idle");
  });

  it.each([[0.75, 1800], [0.31, 1800], [0.3, 1000], [0.1, 1000]])(
    "reverse stop at %s from the completed chapter settles to %s",
    (p, expected) => {
      const h = harness();
      h.userScrollTo(1800);
      h.tick(SETTLE_BUDGET);
      h.userScrollTo(h.at(p));
      h.tick(SETTLE_BUDGET);
      expect(h.getY()).toBe(expected);
    },
  );

  it("a small backward nudge mid-way never carries the page forward (review regression)", () => {
    const h = harness();
    h.userScrollTo(h.at(0.6));
    h.userScrollTo(h.at(0.56), 4, 16);  // wiggle back 4 %
    h.tick(SETTLE_BUDGET);
    expect(h.getY()).toBe(1000);         // back to where the transition started
    h.userScrollTo(1800);
    h.tick(SETTLE_BUDGET);
    h.userScrollTo(h.at(0.4));
    h.userScrollTo(h.at(0.44), 4, 16);  // mirror: forward nudge after leaving the chapter
    h.tick(SETTLE_BUDGET);
    expect(h.getY()).toBe(1800);
  });

  it("an upward wheel during a return settle keeps returning (review regression)", () => {
    const h = harness();
    h.userScrollTo(h.at(0.6));
    h.tick(idle + 200);
    expect(h.settle.getState()).toBe("settling");
    h.userScroll(-60);                   // same direction as the settle
    h.tick(SETTLE_BUDGET);
    expect(h.getY()).toBe(1000);
    expect(Math.max(...h.writes.map(write => write.y))).toBeLessThanOrEqual(h.at(0.6));
  });

  it("history inside the band does not change the outcome, only the origin does", () => {
    const h = harness();
    h.userScrollTo(h.at(0.9), 60, 16);  // deep, but never completed
    h.userScrollTo(h.at(0.6), 5, 16);
    h.tick(SETTLE_BUDGET);
    expect(h.getY()).toBe(1000);
    h.userScrollTo(1800);
    h.tick(SETTLE_BUDGET);
    h.userScrollTo(h.at(0.1), 60, 16);  // deep, but never returned
    h.userScrollTo(h.at(0.4), 5, 16);
    h.tick(SETTLE_BUDGET);
    expect(h.getY()).toBe(1800);
  });

  it("settles gradually: eased from rest, bounded per frame, and landing exactly", () => {
    const h = harness();
    h.userScrollTo(h.at(0.7));
    h.tick(SETTLE_BUDGET);
    const ys = [h.at(0.7), ...h.writes.map(write => write.y)];
    const steps = ys.slice(1).map((value, i) => value - ys[i]);
    expect(steps.every(step => step >= 0)).toBe(true);
    expect(steps[0]).toBeLessThan(2);
    expect(steps.at(-1)!).toBeLessThan(1);
    expect(Math.max(...steps)).toBeLessThanOrEqual(getMaxSettleStep(240, 800));
    expect(h.writes.length).toBeGreaterThan(15);
    expect(h.getY()).toBe(1800);
  });

  it("a stalled frame pauses the settle instead of jumping", () => {
    const h = harness();
    h.userScrollTo(h.at(0.2));
    h.tick(idle + 100);
    const before = h.getY();
    h.frame(600); // the tab was busy for 600 ms
    expect(Math.abs(h.getY() - before)).toBeLessThanOrEqual(getMaxSettleStep(160, 800));
    h.tick(SETTLE_BUDGET);
    expect(h.getY()).toBe(1000);
  });

  it("wheel input during a settle cancels it immediately and in place", () => {
    const h = harness();
    h.userScrollTo(h.at(0.85));
    h.tick(idle + 200);
    expect(h.settle.getState()).toBe("settling");
    const settledTo = h.getY();
    const writes = h.writes.length;
    h.userScroll(-40);
    expect(h.getY()).toBe(settledTo - 40);   // no discontinuity: native scroll continues from here
    h.tick(idle - 50);
    expect(h.writes.length).toBe(writes);     // nothing written while input is recent
    expect(h.settle.getState()).toBe("active");
    h.tick(SETTLE_BUDGET);
    // Re-evaluated only after input stopped: still beyond 70 %, so it completes.
    expect(h.getY()).toBe(1800);
  });

  it("reversing during a settle past the return threshold returns to the previous rest", () => {
    const h = harness();
    h.userScrollTo(h.at(0.75));
    h.tick(idle + 100);
    expect(h.settle.getState()).toBe("settling");
    h.userScrollTo(h.at(0.25), 30, 16);
    h.tick(SETTLE_BUDGET);
    expect(h.getY()).toBe(1000);
  });

  it("does not mistake its own writes for user input", () => {
    const h = harness();
    h.userScrollTo(1800);
    h.tick(SETTLE_BUDGET);
    h.userScrollTo(h.at(0.75));          // reverse
    h.tick(SETTLE_BUDGET);               // controller writes forward, back to 1800
    expect(h.getY()).toBe(1800);
    expect(h.settle.getOrigins()).toEqual([1]);
    expect(h.states.filter(state => state === "settling")).toHaveLength(1);
  });

  it("yields to scroll it did not write (scrollbar drag, anchor jump) and re-evaluates later", () => {
    const h = harness();
    h.userScrollTo(h.at(0.4));
    h.tick(idle + 150);
    expect(h.settle.getState()).toBe("settling");
    const writes = h.writes.length;
    h.nativeJump(h.getY() + 300);         // scrollbar dragged forward, no wheel/key event
    h.tick(idle - 50);
    expect(h.writes.length).toBe(writes);
    h.tick(SETTLE_BUDGET);
    expect(h.getY()).toBe(1800);           // forward to ~72 %: completes
  });

  it("detects an unannounced position change inside a settle frame", () => {
    const h = harness();
    h.userScrollTo(h.at(0.4));
    h.tick(idle + 150);
    expect(h.settle.getState()).toBe("settling");
    const writes = h.writes.length;
    // The position moves, but its scroll event has not been dispatched yet.
    h.silentMove(-120);
    const moved = h.getY();
    h.frame();
    expect(h.writes.length).toBe(writes);
    expect(h.getY()).toBe(moved);
    expect(h.settle.getState()).toBe("active");
  });

  it("a held mouse/pen button blocks settling; every contact must lift", () => {
    const h = harness();
    h.userScrollTo(h.at(0.8));
    h.settle.onHoldStart(1);
    h.settle.onHoldStart(2);
    h.tick(SETTLE_BUDGET);
    expect(h.writes).toEqual([]);
    expect(h.settle.getState()).toBe("held");
    h.settle.onHoldEnd(1);
    h.tick(SETTLE_BUDGET);
    expect(h.writes).toEqual([]);
    h.settle.onHoldEnd(2);
    h.tick(SETTLE_BUDGET);
    expect(h.getY()).toBe(1800);
  });

  it("pressing during a settle stops it in place", () => {
    const h = harness();
    h.userScrollTo(h.at(0.8));
    h.tick(idle + 150);
    expect(h.settle.getState()).toBe("settling");
    const y = h.getY();
    h.settle.onHoldStart(7);
    h.tick(SETTLE_BUDGET);
    expect(h.getY()).toBe(y);
  });

  it("a hidden page forgets holds and stops; becoming visible re-evaluates", () => {
    const h = harness();
    h.userScrollTo(h.at(0.8));
    h.settle.onHoldStart(1);
    h.settle.onInteractionLost(true);    // hidden: mouseup will never arrive
    h.tick(SETTLE_BUDGET);
    expect(h.writes).toEqual([]);
    h.settle.onResume();
    h.tick(SETTLE_BUDGET);
    expect(h.getY()).toBe(1800);
  });

  it("a blurred window forgets holds but never leaves the plate mid-way (review regression)", () => {
    const h = harness();
    h.userScrollTo(h.at(0.5));
    h.settle.onHoldStart(1);
    h.settle.onInteractionLost();        // alt-tab / address bar within the idle window
    h.tick(SETTLE_BUDGET);
    expect(h.getY()).toBe(1000);
    expect(h.settle.getState()).toBe("idle");
  });

  it("refresh during a settle stops it, and evaluation uses the refreshed geometry", () => {
    const h = harness();
    h.userScrollTo(h.at(0.8));
    h.tick(idle + 150);
    expect(h.settle.getState()).toBe("settling");
    h.settle.onRefreshInit();
    const y = h.getY();
    h.tick(SETTLE_BUDGET);
    expect(h.getY()).toBe(y);            // no writes while geometry is untrusted
    expect(h.settle.getState()).toBe("refreshing");
    // Same position, new geometry: now below 70 % of the refreshed segment.
    h.setSegments([{ start: 1200, end: 1900 }]);
    h.settle.onRefresh();
    h.tick(SETTLE_BUDGET);
    expect(h.getY()).toBe(1200);         // stale end (1800) is never used
  });

  it("resize before the idle threshold lands on the refreshed endpoint", () => {
    const h = harness();
    h.userScrollTo(h.at(0.8));
    h.refresh([{ start: 1100, end: 1700 }]);
    h.tick(SETTLE_BUDGET);
    expect(h.getY()).toBe(1700);
  });

  it("ignores input and scroll while refreshing", () => {
    const h = harness();
    h.userScrollTo(h.at(0.8));
    h.settle.onRefreshInit();
    h.userScroll(10);
    h.tick(SETTLE_BUDGET);
    expect(h.writes).toEqual([]);
  });

  it("does nothing at rest outside a reveal segment or exactly at its endpoints", () => {
    const h = harness();
    h.userScrollTo(990);
    h.tick(SETTLE_BUDGET);
    h.userScrollTo(1800);
    h.tick(SETTLE_BUDGET);
    h.userScrollTo(1000);
    h.tick(SETTLE_BUDGET);
    expect(h.writes).toEqual([]);
  });

  it("dispose leaves no pending timers or frames, even mid-settle", () => {
    const h = harness();
    h.userScrollTo(h.at(0.4));
    h.settle.dispose();
    expect(h.pending()).toEqual({ timers: 0, frames: 0 });
    const h2 = harness();
    h2.userScrollTo(h2.at(0.8));
    h2.tick(idle + 100);
    h2.settle.dispose();
    expect(h2.pending()).toEqual({ timers: 0, frames: 0 });
    const writes = h2.writes.length;
    h2.userScroll(10);
    h2.settle.onRefresh();
    h2.settle.onResume();
    h2.tick(SETTLE_BUDGET);
    expect(h2.writes.length).toBe(writes);
    expect(h2.settle.getState()).toBe("disposed");
  });
});

describe("input cadence (review regression: slow notches and key presses)", () => {
  it("stretches the idle delay to the user's own rhythm", () => {
    expect(getIdleDelay("continuous", Infinity)).toBe(CHAPTER_SETTLE.idleMs);
    expect(getIdleDelay("continuous", 16)).toBe(CHAPTER_SETTLE.idleMs);
    expect(getIdleDelay("discrete", Infinity)).toBe(CHAPTER_SETTLE.discreteIdleMs);
    expect(getIdleDelay("discrete", 1000)).toBe(CHAPTER_SETTLE.discreteIdleMs);
    expect(getIdleDelay("discrete", 1400)).toBe(2100);
    expect(getIdleDelay("discrete", 2000)).toBe(CHAPTER_SETTLE.maxIdleMs);
    expect(getIdleDelay("discrete", 5000)).toBe(CHAPTER_SETTLE.discreteIdleMs);
  });

  it.each([550, 700, 850, 1000, 1500])("one 100px notch every %sms crosses the transition without being pulled back", interval => {
    const h = harness();
    const notch = () => { h.settle.onInput("discrete"); h.userScrollNoInput(100); };
    for (let i = 0; i < 7 && h.getY() < 1800; i++) { notch(); h.tick(interval); }
    const backward = h.writes.filter((write, i) => write.y < (i ? h.writes[i - 1].y : Infinity) && write.y < 1700);
    h.tick(SETTLE_BUDGET);
    expect(h.getY()).toBe(1800);
    expect(backward).toEqual([]);
  });

  it("a single notch followed by a real stop still resolves (after the discrete idle delay)", () => {
    const h = harness();
    h.settle.onInput("discrete");
    h.userScrollNoInput(100);
    h.tick(CHAPTER_SETTLE.discreteIdleMs - 50);
    expect(h.writes).toEqual([]);
    h.tick(SETTLE_BUDGET);
    expect(h.getY()).toBe(1000);
  });
});

describe("chapter covered-state tolerance", () => {
  it("keeps the opening chapter interactive at the top boundary", () => {
    expect(isChapterCovered(0.0001, 0)).toBe(false);
    expect(isChapterCovered(0.02, 0)).toBe(false);
  });

  it("keeps a partly covered outgoing chapter interactive", () => {
    expect(isChapterCovered(0.02, 20)).toBe(false);
    expect(isChapterCovered(0.6, 20)).toBe(false);
  });

  it("marks the outgoing chapter inert once it is effectively hidden", () => {
    expect(isChapterCovered(0.98, 20)).toBe(true);
    expect(isChapterCovered(1, 20)).toBe(true);
  });
});
