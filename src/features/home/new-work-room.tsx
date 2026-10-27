"use client";

import { useRef } from "react";
import type { HeroProjectMeta } from "@/content/contracts";
import { ActionLink } from "@/components/ui/ActionLink";
import { GrainTexture } from "@/components/site/GrainTexture";
import { useHeroRoom } from "./use-hero-room";

const NO_EXHIBITS: readonly HeroProjectMeta[] = [];

/** The hero room without exhibits: same grid, endless hallway, pointer light, and parallax. */
export function NewWorkRoom() {
  const rootRef = useRef<HTMLDivElement>(null), stageRef = useRef<HTMLDivElement>(null), canvasRef = useRef<HTMLCanvasElement>(null);
  const { rendererState, handlePointerMove } = useHeroRoom({ rootRef, stageRef, canvasRef, projects: NO_EXHIBITS, introKey: "new-work" });

  return <div ref={rootRef} className="new-work-room" data-renderer={rendererState} onPointerMove={handlePointerMove}>
    <div ref={stageRef} className="new-work-room-stage" aria-hidden="true">
      <canvas ref={canvasRef} className="new-work-room-canvas" />
      <GrainTexture />
    </div>
    <div className="new-work-copy">
      <p className="kicker">04 / New work</p>
      <h2>Give your next idea a place.</h2>
      <ActionLink href="/contact">Start a conversation →</ActionLink>
    </div>
  </div>;
}
