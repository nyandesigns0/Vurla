"use client";

import { useLayoutEffect, useRef } from "react";

/** Keep catalog hover aligned with a stationary mouse as cards scroll beneath it. */
export function useCatalogHover() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || typeof document.elementFromPoint !== "function") return;

    const fine = matchMedia("(hover: hover) and (pointer: fine)");
    let point: { x: number; y: number } | null = null;
    let active: HTMLElement | null = null;
    let frame = 0;
    let followUntil = 0;
    let seeded = false;

    const cards = () => root.querySelectorAll<HTMLElement>(".project-card--catalog");
    const seed = () => {
      cards().forEach(card => { if (!card.hasAttribute("data-pointer-hover")) card.dataset.pointerHover = "false"; });
      seeded = true;
    };
    // Establish the managed hover state before the browser can paint a native
    // :hover frame that the first pointer event would briefly reset.
    if (fine.matches) seed();
    const clear = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      point = null;
      followUntil = 0;
      if (active) active.dataset.pointerHover = "false";
      active = null;
    };
    const tick = (now: number) => {
      frame = 0;
      if (!point || !fine.matches || document.hidden) return;
      if (seeded) seed(); // Filters can replace cards without remounting the page.
      const hit = document.elementFromPoint(point.x, point.y);
      const next = hit && root.contains(hit) ? hit.closest<HTMLElement>(".project-card--catalog") : null;
      if (active !== next) {
        if (active) active.dataset.pointerHover = "false";
        if (next) next.dataset.pointerHover = "true";
        active = next;
      }
      if (now < followUntil) frame = requestAnimationFrame(tick);
    };
    const schedule = () => {
      if (point && fine.matches && !document.hidden && !frame) frame = requestAnimationFrame(tick);
    };
    const remember = (event: MouseEvent) => {
      if (!fine.matches) return;
      if (!seeded) seed();
      point = { x: event.clientX, y: event.clientY };
      schedule();
    };
    const follow = () => {
      followUntil = performance.now() + 300;
      schedule();
    };
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "mouse") remember(event);
      else clear();
    };
    const onWheel = (event: WheelEvent) => { remember(event); follow(); };
    const onPointerDown = (event: PointerEvent) => { if (event.pointerType !== "mouse") clear(); };
    const onPointerOut = (event: PointerEvent) => { if (event.relatedTarget === null) clear(); };
    const onVisibility = () => { if (document.hidden) clear(); };
    const onMediaChange = () => {
      clear();
      cards().forEach(card => { delete card.dataset.pointerHover; });
      seeded = false;
      if (fine.matches) seed();
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
      cards().forEach(card => { delete card.dataset.pointerHover; });
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
  }, []);

  return rootRef;
}
