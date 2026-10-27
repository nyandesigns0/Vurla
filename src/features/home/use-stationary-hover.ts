"use client";

import { useEffect, useRef } from "react";

/** Recheck hover at the last mouse position while scrolling moves cards beneath it. */
export function useStationaryHover<T extends HTMLElement>(selectors: readonly string[]) {
  const rootRef = useRef<T>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof document.elementFromPoint !== "function") return;
    const fine = matchMedia("(hover: hover) and (pointer: fine)");
    const nodes = selectors.flatMap((selector) => Array.from(root.querySelectorAll<HTMLElement>(selector)));
    let point: { x: number; y: number } | null = null;
    let active = selectors.map(() => null as HTMLElement | null);
    let frame = 0;
    let followUntil = 0;
    let seeded = false;

    const mark = (previous: HTMLElement | null, next: HTMLElement | null) => {
      if (previous === next) return;
      if (previous) previous.dataset.pointerHover = "false";
      if (next) next.dataset.pointerHover = "true";
    };
    const clear = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      point = null;
      followUntil = 0;
      active.forEach((element) => mark(element, null));
      active = selectors.map(() => null);
    };
    const tick = (now: number) => {
      frame = 0;
      if (!point || !fine.matches || document.hidden) return;
      const hit = document.elementFromPoint(point.x, point.y);
      const inside = hit && root.contains(hit) ? hit : null;
      active = selectors.map((selector, index) => {
        const next = inside?.closest<HTMLElement>(selector) ?? null;
        mark(active[index], next);
        return next;
      });
      if (now < followUntil) frame = requestAnimationFrame(tick);
    };
    const schedule = () => {
      if (point && fine.matches && !document.hidden && !frame) frame = requestAnimationFrame(tick);
    };
    const remember = (event: MouseEvent) => {
      if (!fine.matches) return;
      if (!seeded) {
        nodes.forEach((node) => { node.dataset.pointerHover = "false"; });
        seeded = true;
      }
      point = { x: event.clientX, y: event.clientY };
      schedule();
    };
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "mouse") remember(event);
      else clear();
    };
    const follow = () => {
      followUntil = performance.now() + 300;
      schedule();
    };
    // Wheel coordinates seed a mouse that has not moved since navigation.
    const onWheel = (event: WheelEvent) => { remember(event); follow(); };
    const onPointerDown = (event: PointerEvent) => { if (event.pointerType !== "mouse") clear(); };
    const onPointerOut = (event: PointerEvent) => { if (event.relatedTarget === null) clear(); };
    const onVisibility = () => { if (document.hidden) clear(); };
    const onMediaChange = () => {
      clear();
      nodes.forEach((node) => { delete node.dataset.pointerHover; });
      seeded = false;
    };
    const resize = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(follow);
    resize?.observe(root);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerout", onPointerOut, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("scroll", follow, { passive: true, capture: true });
    window.addEventListener("resize", follow, { passive: true });
    window.addEventListener("blur", clear);
    document.addEventListener("visibilitychange", onVisibility);
    fine.addEventListener("change", onMediaChange);
    return () => {
      clear();
      nodes.forEach((node) => { delete node.dataset.pointerHover; });
      resize?.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerout", onPointerOut);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", follow, { capture: true });
      window.removeEventListener("resize", follow);
      window.removeEventListener("blur", clear);
      document.removeEventListener("visibilitychange", onVisibility);
      fine.removeEventListener("change", onMediaChange);
    };
  }, [selectors]);

  return rootRef;
}
