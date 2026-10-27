"use client";

import { useEffect, useRef } from "react";

const ROTATION_DEGREES = 240;
const STATIC_MOTION_QUERY = "(prefers-reduced-motion: reduce), (pointer: coarse), (max-width: 1023px)";

/** Shared drafting crosshair that makes one restrained turn as its plate scrolls away. */
export function ScrollCrosshair() {
  const crosshairRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const crosshair = crosshairRef.current;
    const field = crosshair?.closest<HTMLElement>(".page-plate-field");
    if (!crosshair || !field) return;

    const staticMotion = window.matchMedia(STATIC_MOTION_QUERY);
    let disposed = false;
    let generation = 0;
    let revert = () => {};

    const setup = async () => {
      const ticket = ++generation;
      revert();
      revert = () => {};
      crosshair.style.removeProperty("transform");
      if (disposed || staticMotion.matches) return;

      const modules = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).catch(() => null);
      if (!modules || disposed || staticMotion.matches || ticket !== generation) return;

      const [{ default: gsap }, { ScrollTrigger }] = modules;
      gsap.registerPlugin(ScrollTrigger);
      const tween = gsap.to(crosshair, {
        rotation: ROTATION_DEGREES,
        ease: "none",
        scrollTrigger: {
          start: 0,
          // Complete the turn as the bottom edge of the crosshair leaves view.
          end: () => Math.max(1, field.getBoundingClientRect().top + window.scrollY + field.clientHeight / 2 + crosshair.clientHeight / 2),
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
      revert = () => tween.kill();
    };

    void setup();
    staticMotion.addEventListener("change", setup);
    return () => {
      disposed = true;
      generation++;
      staticMotion.removeEventListener("change", setup);
      revert();
    };
  }, []);

  return <span className="page-plate-crosshair" aria-hidden="true"><span ref={crosshairRef} className="page-plate-crosshair-mark" /></span>;
}
