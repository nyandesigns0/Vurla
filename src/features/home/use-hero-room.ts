"use client";

import { type PointerEvent, type RefObject, useEffect, useRef, useState } from "react";
import type { HeroProjectMeta } from "@/content/contracts";
import type { HeroRoomRenderer } from "./hero-three-renderer";
import { shouldPlayRoomIntro, type RoomIntroKey } from "./room-intro";

export type RendererState = "initializing" | "three" | "unavailable";

type HeroRoomOptions = {
  rootRef: RefObject<HTMLDivElement | null>;
  stageRef: RefObject<HTMLDivElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  /** Exhibit hit areas; omitted for the image-free room. */
  pathRefs?: RefObject<Array<SVGPathElement | null>>;
  projects: readonly HeroProjectMeta[];
  introKey: RoomIntroKey;
  enabled?: boolean;
};

/** Shared lifecycle for the WebGL room: lazy import, parallax media gates, suspension, and failure fallback. */
export function useHeroRoom({ rootRef, stageRef, canvasRef, pathRefs, projects, introKey, enabled = true }: HeroRoomOptions) {
  const rendererRef = useRef<HeroRoomRenderer | null>(null), parallaxRef = useRef(false);
  const [rendererState, setRendererState] = useState<RendererState>("initializing");

  useEffect(() => {
    const root = rootRef.current, host = stageRef.current, canvas = canvasRef.current;
    if (!enabled || !root || !host || !canvas) return;
    let disposed = false, failed = false;
    let offscreen = false;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)"), coarse = matchMedia("(pointer: coarse)"), narrow = matchMedia("(max-width: 767px)");
    const playIntro = shouldPlayRoomIntro(introKey, reduced.matches);
    host.dataset.roomIntro = playIntro ? "playing" : "complete";
    root.dataset.roomIntro = host.dataset.roomIntro;
    const syncMedia = () => {
      const canParallax = !reduced.matches && !coarse.matches && !narrow.matches;
      parallaxRef.current = canParallax;
      rendererRef.current?.setParallaxEnabled(canParallax);
    };
    const syncSuspension = () => rendererRef.current?.setSuspended(document.hidden || offscreen);
    const observer = new IntersectionObserver(([entry]) => { offscreen = !entry.isIntersecting; syncSuspension(); }, { threshold: .08 });
    observer.observe(root);
    for (const query of [reduced, coarse, narrow]) query.addEventListener("change", syncMedia);
    document.addEventListener("visibilitychange", syncSuspension);
    syncMedia();

    const failure = () => {
      if (disposed || failed) return;
      failed = true;
      rendererRef.current?.dispose(); rendererRef.current = null; host.dataset.roomIntro = "complete"; root.dataset.roomIntro = "complete"; setRendererState("unavailable");
    };
    setRendererState("initializing");
    if (typeof WebGL2RenderingContext !== "undefined") {
      void import("./hero-three-renderer").then(({ createHeroRoom }) => {
        if (disposed) return;
        try {
          const paths = (pathRefs?.current ?? []).filter((path): path is SVGPathElement => !!path);
          const renderer = createHeroRoom({ canvas, host, paths, projects, introKey, playIntro, onIntroComplete: () => { root.dataset.roomIntro = "complete"; }, onFailure: failure });
          if (disposed || failed) { renderer.dispose(); return; }
          rendererRef.current = renderer;
          renderer.setParallaxEnabled(parallaxRef.current);
          renderer.setSuspended(document.hidden || offscreen);
          renderer.select(-1);
          setRendererState("three");
        } catch { failure(); }
      }).catch(failure);
    } else failure();
    return () => {
      disposed = true; observer.disconnect();
      for (const query of [reduced, coarse, narrow]) query.removeEventListener("change", syncMedia);
      document.removeEventListener("visibilitychange", syncSuspension);
      rendererRef.current?.dispose(); rendererRef.current = null;
    };
  }, [rootRef, stageRef, canvasRef, pathRefs, projects, introKey, enabled]);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return;
    const bounds = stageRef.current?.getBoundingClientRect(); if (!bounds) return;
    rendererRef.current?.setPointer((event.clientX - bounds.left) / bounds.width * 2 - 1, (event.clientY - bounds.top) / bounds.height * 2 - 1);
  };

  return { rendererRef, rendererState, handlePointerMove };
}
