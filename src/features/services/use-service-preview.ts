"use client";

import { useEffect, useRef, useState } from "react";
import type { Service, ServiceImage } from "@/content/contracts";
import { createPreviewImageLoader } from "./preview-image-loader";

export function useServicePreview(service: Service) {
  const ref = useRef<HTMLElement>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [view, setView] = useState<{ image: ServiceImage; previous: ServiceImage | null; revision: number; direction: "up" | "down" }>({
    image: service.image, previous: null, revision: 0, direction: "up",
  });
  const enabled = service.subItems.some(item => item.previewImage);

  useEffect(() => {
    const root = ref.current;
    if (!root || !enabled) return;
    const loader = createPreviewImageLoader();
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let live = true;
    let request = 0;
    let choice: number | null = null;
    let pointerInside = false;
    let touch = false;
    let point: { x: number; y: number } | null = null;
    let lastHit: Element | null = null;
    let frame = 0;
    let followUntil = 0;
    let cleanupTimer: ReturnType<typeof setTimeout> | undefined;

    const choose = async (index: number | null) => {
      if (index === choice) return;
      choice = index;
      setSelected(index);
      const token = ++request;
      let image = index === null ? service.image : service.subItems[index].previewImage!;
      const ready = await loader.load(image.src, true);
      if (!live || token !== request) return;
      if (!ready) {
        choice = null;
        setSelected(null);
        image = service.image;
        if (!await loader.load(image.src, true) || !live || token !== request) return;
      }
      clearTimeout(cleanupTimer);
      setView(current => current.image.src === image.src ? current : {
        image, previous: reduced.matches ? null : current.image,
        revision: current.revision + 1, direction: choice === null ? "down" : "up",
      });
      cleanupTimer = setTimeout(() => {
        if (live && token === request) setView(current => ({ ...current, previous: null }));
      }, 360);
    };
    const buttonAt = (target: EventTarget | null) => target instanceof Element
      ? target.closest<HTMLElement>("[data-service-preview]") : null;
    const selectButton = (target: EventTarget | null) => {
      const button = buttonAt(target);
      if (button && root.contains(button)) void choose(Number(button.dataset.servicePreview));
    };
    const hasFocus = () => !touch && root.contains(document.activeElement);
    const hit = (target: Element | null) => {
      pointerInside = !!target && root.contains(target);
      root.dataset.previewPointer = String(pointerInside);
      if (target !== lastHit) {
        lastHit = target;
        if (pointerInside) selectButton(target);
      }
      if (!pointerInside && !hasFocus() && !touch) void choose(null);
    };
    const tick = (now: number) => {
      frame = 0;
      if (point && !touch && document.elementFromPoint) hit(document.elementFromPoint(point.x, point.y));
      if (now < followUntil && point && !touch) frame = requestAnimationFrame(tick);
    };
    const follow = () => {
      followUntil = performance.now() + 300;
      if (!frame && point) frame = requestAnimationFrame(tick);
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
      touch = false;
      point = { x: event.clientX, y: event.clientY };
      hit(event.target instanceof Element ? event.target : null);
    };
    const wheel = (event: WheelEvent) => {
      if (touch) return;
      point = { x: event.clientX, y: event.clientY };
      follow();
    };
    const down = (event: PointerEvent) => {
      touch = event.pointerType === "touch";
      if (!(event.target instanceof Node) || !root.contains(event.target)) { void choose(null); return; }
      if (touch) { point = null; selectButton(event.target); }
    };
    const focus = (event: FocusEvent) => { selectButton(event.target); };
    const blur = (event: FocusEvent) => {
      if (!(event.relatedTarget instanceof Node && root.contains(event.relatedTarget)) && !pointerInside && !touch) void choose(null);
    };
    const click = (event: MouseEvent) => selectButton(event.target);
    const key = (event: KeyboardEvent) => {
      if (event.key === "Tab") touch = false;
      if (event.key === "Escape") void choose(null);
    };
    const leave = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      pointerInside = false;
      lastHit = null;
      root.dataset.previewPointer = "false";
      if (!hasFocus() && !touch) void choose(null);
    };
    const reset = () => {
      point = null; pointerInside = false; touch = false; lastHit = null;
      root.dataset.previewPointer = "false";
      void choose(null);
    };
    const out = (event: PointerEvent) => { if (!event.relatedTarget && !touch) reset(); };
    const visibility = () => { if (document.hidden) reset(); };
    const near = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      service.subItems.forEach(item => { if (item.previewImage) void loader.load(item.previewImage.src); });
      near?.disconnect();
    }, { rootMargin: "300px" });
    const visible = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(entries => {
      if (entries.some(entry => !entry.isIntersecting)) reset();
    });
    near?.observe(root);
    visible?.observe(root);
    root.addEventListener("focusin", focus);
    root.addEventListener("focusout", blur);
    root.addEventListener("click", click);
    root.addEventListener("pointerleave", leave);
    window.addEventListener("keydown", key);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointerout", out, { passive: true });
    window.addEventListener("wheel", wheel, { passive: true });
    window.addEventListener("scroll", follow, { passive: true, capture: true });
    window.addEventListener("resize", follow);
    window.addEventListener("blur", reset);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      live = false;
      clearTimeout(cleanupTimer);
      cancelAnimationFrame(frame);
      loader.dispose(); near?.disconnect(); visible?.disconnect();
      delete root.dataset.previewPointer;
      root.removeEventListener("focusin", focus);
      root.removeEventListener("focusout", blur);
      root.removeEventListener("click", click);
      root.removeEventListener("pointerleave", leave);
      window.removeEventListener("keydown", key);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerout", out);
      window.removeEventListener("wheel", wheel);
      window.removeEventListener("scroll", follow, { capture: true });
      window.removeEventListener("resize", follow);
      window.removeEventListener("blur", reset);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [service, enabled]);

  return { ref, selected, view, enabled };
}
