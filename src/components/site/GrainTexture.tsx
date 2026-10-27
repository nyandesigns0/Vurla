"use client";
import { useEffect, useRef } from "react";
import { designTokens } from "@/lib/design-system/tokens";
import { GRAIN_CELL, GRAIN_DENSITY, grainCell } from "./grain-pattern.mjs";

// Animated film grain, after shift5.io: a low-res canvas of random paper-white
// pixels upscaled without smoothing. Only a small random subset evolves per
// tick, keeping the same grain appearance without full-field flicker.
const GRAIN_FPS = 4;
const GRAIN_REFRESH_FRACTION = 0.125;

// Packs a token hex into the canvas's little-endian RGBA word at 50% alpha.
function speck(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return ((0x80 << 24) | (b << 16) | (g << 8) | r) >>> 0;
}
const GRAIN_COLOR = speck(designTokens.color.paper);

export function GrainTexture({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let ctx: CanvasRenderingContext2D | null = null;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const frameMs = 1000 / GRAIN_FPS;
    let image: ImageData | null = null;
    let pixels: Uint32Array | null = null;
    let raf = 0;
    let last = 0;
    let visible = false;
    let ready = false;
    let contextLost = false;

    const fallback = () => {
      ready = false;
      cancelAnimationFrame(raf);
      raf = 0;
      image = null;
      pixels = null;
      // Reset any partially drawn bitmap before revealing the CSS tile.
      canvas.width = canvas.width;
      delete canvas.dataset.grainReady;
    };

    const draw = (initial = false) => {
      if (!image || !pixels || !ctx || contextLost) return;
      for (let i = 0; i < pixels.length; i++) {
        if (initial) {
          pixels[i] = grainCell(i % image.width, Math.floor(i / image.width)) ? GRAIN_COLOR : 0;
        } else if (Math.random() < GRAIN_REFRESH_FRACTION) {
          pixels[i] = Math.random() < GRAIN_DENSITY ? GRAIN_COLOR : 0;
        }
      }
      try {
        ctx.putImageData(image, 0, 0);
        // Both operations occur before the next paint; the two textures never stack.
        canvas.dataset.grainReady = "true";
        ready = true;
      } catch {
        fallback();
      }
    };

    const resize = () => {
      if (contextLost) return;
      const width = Math.max(1, Math.ceil(canvas.clientWidth / GRAIN_CELL));
      const height = Math.max(1, Math.ceil(canvas.clientHeight / GRAIN_CELL));
      if (width === canvas.width && height === canvas.height && image) return;
      try {
        ctx ??= canvas.getContext("2d", { alpha: true });
        if (!ctx) return;
        canvas.width = width;
        canvas.height = height;
        image = ctx.createImageData(width, height);
        pixels = new Uint32Array(image.data.buffer);
        draw(true);
      } catch {
        fallback();
      }
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (now - last < frameMs) return;
      last = now;
      draw();
    };

    const sync = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      if (ready && visible && !motion.matches && !document.hidden) raf = requestAnimationFrame(tick);
    };

    const onResize = () => { resize(); sync(); };
    const onContextLost = (event: Event) => {
      event.preventDefault();
      contextLost = true;
      fallback();
    };
    const onContextRestored = () => {
      contextLost = false;
      ctx = null;
      onResize();
    };

    const resizeObserver = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(onResize);
    resizeObserver?.observe(canvas);
    if (!resizeObserver) window.addEventListener("resize", onResize);
    const intersectionObserver =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            sync();
          });
    intersectionObserver?.observe(canvas);
    if (!intersectionObserver) visible = true;

    resize();
    sync();
    motion.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    canvas.addEventListener("contextlost", onContextLost);
    canvas.addEventListener("contextrestored", onContextRestored);

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
      motion.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("contextlost", onContextLost);
      canvas.removeEventListener("contextrestored", onContextRestored);
      fallback();
    };
  }, []);

  return <canvas ref={canvasRef} className={className ? `grain-texture ${className}` : "grain-texture"} aria-hidden="true" />;
}
