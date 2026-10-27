"use client";
import { useEffect, useRef, useState } from "react";

const GLITCH_MS = 400;
const FRAME_MS = 34;
// Only glyphs with no line-break opportunity, so the overlay can never wrap differently from the real text.
const GLYPHS = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#&*=<>_@";

type GlitchRun = { id: number; target: string; text: string };

function scramble(target: string, progress: number, seeds: readonly number[]) {
  let out = "";
  for (let i = 0; i < target.length; i += 1) {
    const char = target[i];
    // Spaces stay fixed so the monospace overlay wraps exactly like the real heading.
    if (char === " " || progress >= seeds[i]) out += char;
    else out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
  }
  return out;
}

/**
 * Hero heading with a decode + red/blue band-split glitch whenever its text changes.
 * The real text always stays in the DOM for assistive tech; glitch layers are aria-hidden
 * and skipped for reduced motion, coarse pointers, and the first render.
 */
export function HeroGlitchHeading({ id, text }: { id: string; text: string }) {
  const [run, setRun] = useState<GlitchRun | null>(null);
  const previous = useRef(text);
  const runId = useRef(0);

  useEffect(() => {
    if (previous.current === text) return;
    previous.current = text;
    if (typeof matchMedia !== "function" || matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse)").matches) {
      setRun(null);
      return;
    }
    const id = (runId.current += 1);
    // Characters resolve roughly left to right, with jitter, inside the first ~85% of the run.
    const seeds = Array.from(text, (_, i) => (i / Math.max(text.length, 1)) * 0.55 + Math.random() * 0.3);
    const start = performance.now();
    let last = -Infinity;
    let frame = 0;
    // Hard stop even if animation frames are paused (hidden tab/pane).
    const stop = window.setTimeout(() => { cancelAnimationFrame(frame); setRun(null); }, GLITCH_MS + 50);
    const tick = () => {
      const now = performance.now();
      const elapsed = now - start;
      if (elapsed >= GLITCH_MS) {
        setRun(null);
        return;
      }
      if (now - last >= FRAME_MS) {
        last = now;
        setRun({ id, target: text, text: scramble(text, elapsed / GLITCH_MS, seeds) });
      }
      frame = requestAnimationFrame(tick);
    };
    setRun({ id, target: text, text: scramble(text, 0, seeds) });
    frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); window.clearTimeout(stop); };
  }, [text]);

  // Never draw a scramble of a previous title over the current one (fast hover between projects).
  const active = run?.target === text ? run : null;

  return (
    <h1 id={id}>
      <span className="hero-glitch" data-glitch={active ? "active" : "idle"}>
        <span className="hero-glitch-text">{text}</span>
        {active ? (
          <span key={active.id} className="hero-glitch-layers" aria-hidden="true">
            <span className="hero-glitch-layer hero-glitch-decode">{active.text}</span>
            <span className="hero-glitch-layer hero-glitch-red">{active.text}</span>
            <span className="hero-glitch-layer hero-glitch-blue">{active.text}</span>
          </span>
        ) : null}
      </span>
    </h1>
  );
}
