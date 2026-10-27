"use client";

import { useRef, useState } from "react";
import type { HeroProjectMeta } from "@/content/contracts";
import { GrainTexture } from "@/components/site/GrainTexture";
import { useHeroRoom } from "./use-hero-room";

export function SpatialHero({ projects, onProjectPreview }: { projects: HeroProjectMeta[]; onProjectPreview?: (project: HeroProjectMeta | null) => void }) {
  const rootRef = useRef<HTMLDivElement>(null), stageRef = useRef<HTMLDivElement>(null), canvasRef = useRef<HTMLCanvasElement>(null);
  const pathRefs = useRef<Array<SVGPathElement | null>>([]);
  const [selected, setSelected] = useState(0);
  const [announcement, setAnnouncement] = useState("");
  const { rendererRef, rendererState, handlePointerMove } = useHeroRoom({ rootRef, stageRef, canvasRef, pathRefs, projects, introKey: "hero", enabled: projects.length > 0 });

  if (!projects.length) return null;
  const selectProject = (index: number, announce = true) => {
    const normalized = (index + projects.length) % projects.length, project = projects[normalized];
    setSelected(normalized); rendererRef.current?.select(normalized);
    if (announce) setAnnouncement(`${project.title}, ${[project.location, project.year].filter(Boolean).join(", ")}`);
  };
  const inspectProject = (index: number) => ({
    onPointerEnter: () => { selectProject(index, false); onProjectPreview?.(projects[index] ?? null); },
    onPointerLeave: () => { rendererRef.current?.select(-1); onProjectPreview?.(null); },
    onFocus: () => { selectProject(index); onProjectPreview?.(projects[index] ?? null); },
    onBlur: () => { rendererRef.current?.select(-1); onProjectPreview?.(null); },
  });

  return <div ref={rootRef} className="spatial-hero" data-renderer={rendererState} data-selected-index={selected} onPointerMove={handlePointerMove}>
    <div ref={stageRef} className="hero-three-stage" aria-label="Selected project room">
      <canvas ref={canvasRef} className="hero-three-canvas" aria-hidden="true" />
      <GrainTexture />
      <svg className="hero-three-links" aria-label="Spatial project links">
        {projects.map((project, index) => <a key={project.slug} href={project.href} tabIndex={0} aria-label={`View ${project.title}`} data-project={project.slug} {...inspectProject(index)}>
          <path ref={node => { pathRefs.current[index] = node; }} />
        </a>)}
      </svg>
    </div>
    <p className="sr-only" aria-live="polite" aria-atomic="true">{announcement}</p>
  </div>;
}
