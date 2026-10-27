"use client";

import type { ReactNode } from "react";
import { GrainTexture } from "./GrainTexture";
import { DotTexture } from "./DotTexture";

export type ClosingPanelProps = {
  headingId: string;
  title: ReactNode;
  body: ReactNode;
  actions: ReactNode;
};

/* The shared poster. ClosingChapter owns its full-bleed wrapper and motion. */
export function ClosingPanel({
  headingId,
  title,
  body,
  actions,
}: ClosingPanelProps) {
  return (
    <section className="closing-panel shell closing-panel--chapter" aria-labelledby={headingId}>
      <div className="closing-panel-plate">
        <div className="closing-panel-composition">
          <GrainTexture className="closing-panel-grain" />
          <div className="closing-panel-art" aria-hidden="true">
            <DotTexture />
            <span className="closing-panel-concrete closing-panel-concrete--cap" />
            <span className="closing-panel-concrete closing-panel-concrete--upper" />
            <span className="closing-panel-grid-line closing-panel-grid-line--left" />
            <span className="closing-panel-grid-line closing-panel-grid-line--right" />
            <span className="closing-panel-grid-line closing-panel-grid-line--cap" />
            <span className="closing-panel-grid-line closing-panel-grid-line--top" />
            <span className="closing-panel-grid-line closing-panel-grid-line--upper-stub" />
            <span className="closing-panel-grid-line closing-panel-grid-line--lower-stub" />
            <span className="closing-panel-register" />
            <span className="closing-panel-chip" />
          </div>
          <div className="closing-panel-heading">
            <h2 id={headingId}>{title}</h2>
          </div>
          <div className="closing-panel-divider" aria-hidden="true" />
          <div className="closing-panel-body">
            <span className="closing-panel-concrete closing-panel-concrete--lower" aria-hidden="true" />
            <p>{body}</p>
            <div className="closing-panel-actions">{actions}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
