"use client";
import { useEffect, useRef, type ReactNode } from "react";

export const CHAPTER_PLATE_MOTION = {
  rotation: 30,
  transformOrigin: "bottom left",
  revealStart: "top bottom",
  // The plate finishes rotating while the incoming chapter still sits `restOffset` of
  // the viewport below the top; scrolling on carries it up to fill the page.
  revealEnd: "top 25%",
  restOffset: 0.25,
  pinStart: "bottom bottom",
  pinEnd: "bottom top",
  // Direct scrub: the plate angle is a pure function of the scroll position, so a
  // pause and resume at the same position always shows the same plate.
  scrub: true,
} as const;

/**
 * Idle settle rules. Settling starts only after genuine input has stopped (see the
 * idle delays below), and resolves by explicit thresholds relative to the transition's origin
 * (the resting endpoint it departed from):
 * - at `forwardThreshold` or beyond: complete (incoming chapter top).
 * - at `reverseThreshold` or below: return (previous resting position).
 * - in between: go back to the origin, so a pause mid-way never carries the page
 *   on to an endpoint the user did not reach, whatever the last small movement was.
 */
export const CHAPTER_SETTLE = {
  // "Input has stopped" is judged against the user's own rhythm: continuous input
  // (trackpad, momentum, drag) stops after `idleMs`; discrete notches and key presses
  // after `discreteIdleMs`; and a steady cadence stretches the wait to
  // `cadenceFactor` x the gap between inputs (up to `maxIdleMs`), so slow, deliberate
  // notch-by-notch scrolling is not pulled back between notches.
  idleMs: 450,
  discreteIdleMs: 1600,
  cadenceFactor: 1.5,
  maxIdleMs: 2400,
  forwardThreshold: 0.7,
  reverseThreshold: 0.3,
  minDurationMs: 420,
  maxDurationMs: 1000,
  // A stalled frame advances the ease by at most this much time, so a dropped
  // frame pauses the settle instead of turning it into a jump.
  maxFrameMs: 34,
  // Scroll positions within this distance of our last write are our own echo.
  writeTolerance: 1.5,
  restEpsilon: 0.5,
} as const;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export type SettleOrigin = 0 | 1 | null;

/**
 * Chooses the resting endpoint for a plate left mid-transition. `origin` is the
 * endpoint the transition departed from (0: previous rest, reached moving forward;
 * 1: completed chapter, left moving backward). With no known origin (e.g. a page
 * restored mid-transition), the nearer endpoint wins.
 */
export function getSettleTarget(progress: number, origin: SettleOrigin, tolerance = 0): 0 | 1 | null {
  if (!(progress > 0 && progress < 1)) return null;
  // Scroll positions snap to whole pixels, so a stop a fraction of a pixel short of a
  // threshold still counts as having reached it.
  if (progress >= CHAPTER_SETTLE.forwardThreshold - tolerance) return 1;
  if (progress <= CHAPTER_SETTLE.reverseThreshold + tolerance) return 0;
  return origin ?? (progress >= 0.5 ? 1 : 0);
}

export type SettleInputKind = "continuous" | "discrete";

/**
 * Idle delay (ms) after an input of `kind` that followed the previous input by
 * `gap` ms (Infinity when there was none recently).
 */
export function getIdleDelay(kind: SettleInputKind, gap: number) {
  const { idleMs, discreteIdleMs, cadenceFactor, maxIdleMs } = CHAPTER_SETTLE;
  const base = kind === "discrete" ? discreteIdleMs : idleMs;
  if (!(gap <= maxIdleMs)) return base;
  return clamp(gap * cadenceFactor, base, maxIdleMs);
}

/** Settle duration in milliseconds, proportional to the distance travelled. */
export function getSettleDuration(distance: number, viewportHeight: number) {
  const { minDurationMs, maxDurationMs } = CHAPTER_SETTLE;
  const share = Math.abs(distance) / Math.max(viewportHeight, 1);
  return clamp(minDurationMs + (maxDurationMs - minDurationMs) * share, minDurationMs, maxDurationMs);
}

/** Sine in-out: zero velocity at both ends, so settling starts and lands without a jolt. */
export function easeSettle(t: number) {
  return (1 - Math.cos(Math.PI * clamp(t, 0, 1))) / 2;
}

/** Largest single-frame displacement a settle over `distance` can produce. */
export function getMaxSettleStep(distance: number, viewportHeight: number) {
  const duration = getSettleDuration(distance, viewportHeight);
  // Peak slope of the sine ease is PI/2 at t = 0.5.
  return Math.abs(distance) * (Math.PI / 2) * (CHAPTER_SETTLE.maxFrameMs / duration);
}

export function isChapterCovered(progress: number, scrollPosition: number) {
  // ScrollTrigger can report a tiny positive boundary value at y=0 after
  // refresh. The outgoing plate stays visible (and hoverable) while the incoming
  // one slides over it, so it only becomes inert once it is effectively hidden.
  return scrollPosition > 1 && progress >= 0.98;
}

export type SettleSegment = { start: number; end: number };
export type SettleState = "idle" | "active" | "waiting" | "held" | "settling" | "refreshing" | "disposed";
export type SettleHost = {
  now: () => number;
  getScroll: () => number;
  scrollTo: (y: number) => void;
  viewportHeight: () => number;
  setTimer: (callback: () => void, ms: number) => unknown;
  clearTimer: (handle: unknown) => void;
  requestFrame: (callback: () => void) => unknown;
  cancelFrame: (handle: unknown) => void;
  onStateChange?: (state: SettleState) => void;
};

/**
 * The single owner of programmatic scroll writes for the chapter stack.
 *
 * States:
 * - idle: nothing pending; plates rest wherever the scroll position puts them.
 * - active: user input is in progress; the idle timer is (re)armed on every event.
 * - waiting: no input, but a re-evaluation is pending (after refresh, resume, release).
 * - held: a mouse/pen button is down (scrollbar drag, selection); nothing is armed.
 * - settling: input has stopped; eases the scroll position to a resting endpoint.
 * - refreshing: ScrollTrigger is re-measuring; geometry is not trusted.
 * - disposed: torn down; every entry point is a no-op.
 *
 * Every write is remembered, so its scroll echo is never mistaken for user input.
 * Any input, or a scroll position that we did not write, interrupts a settle in
 * place: the controller simply stops writing and native scrolling continues from
 * the exact current position.
 */
export function createChapterSettle(getSegments: () => SettleSegment[], host: SettleHost) {
  let state: SettleState = "idle";
  let timer: unknown;
  let frame: unknown;
  let written: number | null = null;
  // Per reveal segment: the resting endpoint the page last occupied (see getSettleTarget).
  const origins: SettleOrigin[] = [];
  const holds = new Set<unknown>();
  let idleDelay: number = CHAPTER_SETTLE.idleMs;
  let lastInputAt = -Infinity;
  // Any observed position at or beyond a segment endpoint records that endpoint as
  // the origin of the next transition through that segment. Inside, it is kept.
  const track = (y: number) => {
    getSegments().forEach((s, i) => {
      if (!(s.end > s.start)) return; // not yet measured
      if (y <= s.start + CHAPTER_SETTLE.restEpsilon) origins[i] = 0;
      else if (y >= s.end - CHAPTER_SETTLE.restEpsilon) origins[i] = 1;
      else if (origins[i] === undefined) origins[i] = null;
    });
  };
  track(host.getScroll());

  const setState = (next: SettleState) => {
    if (state === next) return;
    state = next;
    host.onStateChange?.(next);
  };
  const clearIdle = () => {
    if (timer !== undefined) host.clearTimer(timer);
    timer = undefined;
  };
  const stopFrame = () => {
    if (frame !== undefined) host.cancelFrame(frame);
    frame = undefined;
  };
  const arm = (next: "active" | "waiting" = "active") => {
    clearIdle();
    if (holds.size > 0) { setState("held"); return; }
    setState(next);
    timer = host.setTimer(evaluate, idleDelay);
  };
  // Input after (or during) a settle: our writes no longer describe the position.
  const yieldToUser = () => {
    stopFrame();
    written = null;
  };

  function evaluate() {
    timer = undefined;
    if (state === "disposed" || state === "refreshing" || holds.size > 0) return;
    const from = host.getScroll();
    track(from);
    const segments = getSegments();
    const index = segments.findIndex(s => s.end > s.start && from > s.start && from < s.end);
    if (index < 0) { setState("idle"); return; }
    const segment = segments[index];
    const range = segment.end - segment.start;
    const target = getSettleTarget((from - segment.start) / range, origins[index] ?? null, CHAPTER_SETTLE.restEpsilon / range);
    const to = target === null ? from : segment.start + target * range;
    if (Math.abs(to - from) <= CHAPTER_SETTLE.restEpsilon) { setState("idle"); return; }
    const duration = getSettleDuration(to - from, host.viewportHeight());
    let elapsed = 0;
    let previous = host.now();
    // The settle starts from `from`; any different position seen later was not ours.
    written = from;
    setState("settling");
    const step = () => {
      frame = undefined;
      if (state !== "settling") return;
      const y = host.getScroll();
      if (written !== null && Math.abs(y - written) > CHAPTER_SETTLE.writeTolerance) {
        // Something else moved the page before its scroll event reached us.
        interrupt();
        return;
      }
      const now = host.now();
      elapsed += Math.min(Math.max(now - previous, 0), CHAPTER_SETTLE.maxFrameMs);
      previous = now;
      const t = Math.min(1, elapsed / duration);
      const next = t >= 1 ? to : from + (to - from) * easeSettle(t);
      // Record the target before writing: the echo may be dispatched synchronously.
      written = next;
      host.scrollTo(next);
      written = host.getScroll();
      track(written);
      if (t >= 1) { setState("idle"); return; }
      frame = host.requestFrame(step);
    };
    frame = host.requestFrame(step);
  }

  function interrupt() {
    yieldToUser();
    track(host.getScroll());
    arm();
  }

  return {
    /** Window scroll event. Distinguishes our echoes from user-driven movement. */
    onScroll() {
      if (state === "disposed") return;
      const y = host.getScroll();
      if (state === "refreshing") return;
      track(y);
      if (written !== null && Math.abs(y - written) <= CHAPTER_SETTLE.writeTolerance) return;
      yieldToUser();
      // Scroll with no recent wheel/key input (scrollbar, momentum, anchor): continuous.
      if (host.now() - lastInputAt > CHAPTER_SETTLE.maxIdleMs) idleDelay = CHAPTER_SETTLE.idleMs;
      arm();
    },
    /** Wheel or scroll-key input: cancels any settle before the scroll it causes. */
    onInput(kind: SettleInputKind = "continuous") {
      if (state === "disposed" || state === "refreshing") return;
      const now = host.now();
      idleDelay = getIdleDelay(kind, now - lastInputAt);
      lastInputAt = now;
      yieldToUser();
      arm();
    },
    onHoldStart(token: unknown = "default") {
      if (state === "disposed") return;
      holds.add(token);
      yieldToUser();
      clearIdle();
      if (state !== "refreshing") setState("held");
    },
    onHoldEnd(token: unknown = "default") {
      if (state === "disposed" || !holds.delete(token)) return;
      track(host.getScroll());
      if (state !== "refreshing") arm("waiting");
    },
    /**
     * Focus or visibility loss: forget holds (their release may never arrive) and stop
     * writing. A blurred page is still re-evaluated, so a plate is never left mid-way;
     * a hidden page is re-evaluated by onResume when it becomes visible.
     */
    onInteractionLost(hidden = false) {
      if (state === "disposed") return;
      holds.clear();
      yieldToUser();
      clearIdle();
      track(host.getScroll());
      if (state === "refreshing") return;
      if (hidden) setState("idle");
      else arm("waiting");
    },
    /** Page became visible again: re-evaluate a plate that was left mid-transition. */
    onResume() {
      if (state === "disposed" || state === "refreshing") return;
      track(host.getScroll());
      arm("waiting");
    },
    onRefreshInit() {
      if (state === "disposed") return;
      yieldToUser();
      clearIdle();
      setState("refreshing");
    },
    onRefresh() {
      if (state !== "refreshing") return;
      // Segments may have been re-measured; origins keep their per-segment meaning.
      track(host.getScroll());
      setState("idle");
      arm("waiting");
    },
    getState: () => state,
    getOrigins: () => [...origins],
    dispose() {
      holds.clear();
      yieldToUser();
      clearIdle();
      setState("disposed");
    },
  };
}

// Keys that scroll the document natively; other keys do not count as scroll input.
const SCROLL_KEYS = new Set(["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " ", "Spacebar"]);

export function HomeChapterStack({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root || typeof matchMedia !== "function") return;
    const fallback = matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse), (max-width: 767px)");
    let disposed = false;
    let nativeFlow = false;
    let generation = 0;
    let revert = () => {};
    let refresh = () => {};
    let frame = 0;
    const sections = Array.from(root.querySelectorAll<HTMLElement>(":scope > .home-chapter"));
    const originalStyles = sections.map(section => section.getAttribute("style"));
    const clear = () => {
      generation++;
      revert();
      revert = () => {};
      refresh = () => {};
      sections.forEach((section, index) => {
        section.inert = false;
        delete section.dataset.covered;
        const original = originalStyles[index];
        if (original === null) section.removeAttribute("style");
        else section.setAttribute("style", original);
      });
      root.dataset.chapterMotion = "flow";
      delete root.dataset.chapterSettle;
      delete root.dataset.chapterSegments;
    };
    const enterNativeTouchFlow = () => {
      // Native touch panning can emit pointercancel while the finger is still
      // physically down. Once touch is detected, leave the chapter stack in
      // ordinary document flow for the rest of this mount rather than letting
      // an idle settle compete with the browser's gesture lifecycle.
      nativeFlow = true;
      clear();
    };
    const detectTouchPointer = (event: PointerEvent) => {
      if (event.pointerType === "touch") enterNativeTouchFlow();
    };
    const setup = async () => {
      clear();
      const ticket = generation;
      if (disposed || nativeFlow || fallback.matches) return;
      const modules = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).catch(() => null);
      if (!modules) return;
      const [{ default: gsap }, { ScrollTrigger }] = modules;
      if (disposed || nativeFlow || fallback.matches || ticket !== generation) return;
      gsap.registerPlugin(ScrollTrigger);
      const reveals: ScrollTrigger[] = [];
      const context = gsap.context(() => {
        sections.forEach((section, index) => {
          gsap.set(section, { zIndex: index + 1 });
          const plate = section.querySelector<HTMLElement>(":scope > .home-chapter-plate");
          if (!plate) return;

          if (index > 0) {
            gsap.set(plate, {
              rotation: CHAPTER_PLATE_MOTION.rotation,
              transformOrigin: CHAPTER_PLATE_MOTION.transformOrigin,
            });
            // Continuous scrub only: no ScrollTrigger snap competing with the settle controller.
            const reveal = gsap.to(plate, {
              rotation: 0,
              ease: "none",
              scrollTrigger: {
                id: `home-reveal-${index}`,
                trigger: section,
                start: CHAPTER_PLATE_MOTION.revealStart,
                end: CHAPTER_PLATE_MOTION.revealEnd,
                scrub: CHAPTER_PLATE_MOTION.scrub,
                invalidateOnRefresh: true,
              },
            });
            if (reveal.scrollTrigger) reveals.push(reveal.scrollTrigger);
          }

          if (index < sections.length - 1) {
            ScrollTrigger.create({
              id: `home-pin-${index}`,
              trigger: section,
              start: CHAPTER_PLATE_MOTION.pinStart,
              end: CHAPTER_PLATE_MOTION.pinEnd,
              pin: true,
              pinSpacing: false,
              invalidateOnRefresh: true,
              onUpdate: self => {
                // Keyboard interaction restores flow before focus enters a plate.
                const covered = isChapterCovered(self.progress, window.scrollY);
                if (covered && section.contains(document.activeElement)) {
                  nativeFlow = true;
                  queueMicrotask(clear);
                  return;
                }
                section.inert = covered;
                section.dataset.covered = String(covered);
              },
            });
          }
        });
      }, root);
      // Stable, untransformed ScrollTrigger coordinates: never the rotated plate rects.
      const getSegments = () => reveals.map(trigger => ({ start: trigger.start, end: trigger.end }));
      const publishSegments = () => {
        root.dataset.chapterSegments = getSegments().map(s => `${Math.round(s.start)}:${Math.round(s.end)}`).join(" ");
      };
      const settle = createChapterSettle(getSegments, {
        now: () => performance.now(),
        getScroll: () => window.scrollY,
        scrollTo: top => window.scrollTo({ top, behavior: "instant" }),
        viewportHeight: () => window.innerHeight,
        setTimer: (callback, ms) => window.setTimeout(callback, ms),
        clearTimer: handle => window.clearTimeout(handle as number),
        requestFrame: callback => requestAnimationFrame(callback),
        cancelFrame: handle => cancelAnimationFrame(handle as number),
        onStateChange: state => { root.dataset.chapterSettle = state; },
      });
      root.dataset.chapterSettle = settle.getState();
      const onScroll = () => settle.onScroll();
      // A large wheel delta arriving on its own is a mouse notch; trackpads stream small deltas.
      let lastWheelAt = -Infinity;
      const onWheel = (event: WheelEvent) => {
        const now = performance.now();
        const discrete = event.deltaMode !== 0 || (Math.abs(event.deltaY) >= 50 && now - lastWheelAt > 60);
        lastWheelAt = now;
        settle.onInput(discrete ? "discrete" : "continuous");
      };
      const onKeyDown = (event: KeyboardEvent) => {
        if (SCROLL_KEYS.has(event.key)) settle.onInput("discrete");
      };
      const onPointerDown = (event: PointerEvent) => {
        if (event.pointerType === "touch") { enterNativeTouchFlow(); return; }
        settle.onHoldStart(event.pointerId);
      };
      const onPointerUp = (event: PointerEvent) => {
        if (event.pointerType !== "touch") settle.onHoldEnd(event.pointerId);
      };
      const mouseToken = "mouse";
      const onMouseDown = () => settle.onHoldStart(mouseToken);
      const onMouseUp = () => settle.onHoldEnd(mouseToken);
      const onInteractionLost = () => settle.onInteractionLost();
      const onVisibilityChange = () => {
        if (document.visibilityState === "hidden") settle.onInteractionLost(true);
        else settle.onResume();
      };
      const onRefreshInit = () => settle.onRefreshInit();
      // Geometry is stale from the first resize event until the refresh it schedules
      // completes, so no settle may run (or keep writing) in between.
      const onResize = () => { settle.onRefreshInit(); scheduleRefresh(); };
      const onRefresh = () => { publishSegments(); settle.onRefresh(); };
      const pointerEvents = typeof PointerEvent === "function";
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("wheel", onWheel, { passive: true, capture: true });
      window.addEventListener("keydown", onKeyDown, { passive: true, capture: true });
      if (pointerEvents) {
        window.addEventListener("pointerdown", onPointerDown, { passive: true, capture: true });
        window.addEventListener("pointerup", onPointerUp, { passive: true, capture: true });
        window.addEventListener("pointercancel", onPointerUp, { passive: true, capture: true });
      } else {
        window.addEventListener("mousedown", onMouseDown, { passive: true, capture: true });
        window.addEventListener("mouseup", onMouseUp, { passive: true, capture: true });
      }
      window.addEventListener("blur", onInteractionLost);
      window.addEventListener("resize", onResize);
      document.addEventListener("visibilitychange", onVisibilityChange);
      ScrollTrigger.addEventListener("refreshInit", onRefreshInit);
      ScrollTrigger.addEventListener("refresh", onRefresh);
      revert = () => {
        ScrollTrigger.removeEventListener("refreshInit", onRefreshInit);
        ScrollTrigger.removeEventListener("refresh", onRefresh);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("wheel", onWheel, { capture: true });
        window.removeEventListener("keydown", onKeyDown, { capture: true });
        if (pointerEvents) {
          window.removeEventListener("pointerdown", onPointerDown, { capture: true });
          window.removeEventListener("pointerup", onPointerUp, { capture: true });
          window.removeEventListener("pointercancel", onPointerUp, { capture: true });
        } else {
          window.removeEventListener("mousedown", onMouseDown, { capture: true });
          window.removeEventListener("mouseup", onMouseUp, { capture: true });
        }
        window.removeEventListener("blur", onInteractionLost);
        window.removeEventListener("resize", onResize);
        document.removeEventListener("visibilitychange", onVisibilityChange);
        settle.dispose();
        context.revert();
      };
      refresh = () => ScrollTrigger.refresh();
      root.dataset.chapterMotion = "pinned";
      refresh();
    };
    const useKeyboardFlow = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      nativeFlow = true;
      clear();
    };
    const revealFocus = (event: FocusEvent) => {
      if (!(event.target instanceof HTMLElement) || !root.contains(event.target)) return;
      if (event.target.closest("[data-covered='true']")) { nativeFlow = true; clear(); }
    };
    const scheduleRefresh = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => refresh());
    };
    // Observe the plates, not the sections: pinning rewrites a section's inline box
    // (fixed position, fractional height), and refreshing on that would re-measure
    // (and scroll-jump) exactly at each transition boundary. Only a real content
    // size change warrants a refresh.
    const sizes = new Map<Element, { width: number; height: number }>();
    const resize = new ResizeObserver(entries => {
      let changed = false;
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        const previous = sizes.get(entry.target);
        if (previous && Math.abs(previous.width - width) < 1 && Math.abs(previous.height - height) < 1) continue;
        sizes.set(entry.target, { width, height });
        changed = true;
      }
      if (changed) scheduleRefresh();
    });
    sections.forEach(section => {
      const plate = section.querySelector(":scope > .home-chapter-plate");
      if (plate) resize.observe(plate);
    });
    fallback.addEventListener("change", setup);
    window.addEventListener("keydown", useKeyboardFlow, true);
    window.addEventListener("pointerdown", detectTouchPointer, { passive: true, capture: true });
    window.addEventListener("touchstart", enterNativeTouchFlow, { passive: true, capture: true });
    root.addEventListener("focusin", revealFocus);
    void document.fonts?.ready.then(() => { if (!disposed) scheduleRefresh(); });
    void setup();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resize.disconnect();
      fallback.removeEventListener("change", setup);
      window.removeEventListener("keydown", useKeyboardFlow, true);
      window.removeEventListener("pointerdown", detectTouchPointer, { capture: true });
      window.removeEventListener("touchstart", enterNativeTouchFlow, { capture: true });
      root.removeEventListener("focusin", revealFocus);
      clear();
    };
  }, []);
  return <div ref={ref} className="home-chapter-stack" data-chapter-motion="flow">{children}</div>;
}
