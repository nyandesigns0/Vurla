"use client";

import { ProjectCard } from "@/components/site/ProjectCard";
import { GrainTexture } from "@/components/site/GrainTexture";
import { DotTexture } from "@/components/site/DotTexture";
import { SectionRail } from "@/components/site/SectionRail";
import { ActionLink } from "@/components/ui/ActionLink";
import type { Project } from "@/content/contracts";
import { useStationaryHover } from "./use-stationary-hover";

const FEATURED_HOVER_SELECTORS = [".project-card--featured"] as const;

export function SelectedProjects({ projects }: { projects: Project[] }) {
  const hoverRef = useStationaryHover<HTMLDivElement>(FEATURED_HOVER_SELECTORS);
  const renderProject = (project: Project, index: number) => (
    <div className={`selected-item selected-item-${index + 1}`} key={project.slug}>
      <ProjectCard {...project} variant="featured" />
    </div>
  );

  return (
    <div className="selected-editorial shell" ref={hoverRef}>
      <header className="selected-intro">
        <DotTexture />
        <SectionRail index="03" label="Selected projects" className="selected-intro-rail" indexClassName="selected-intro-number" labelClassName="selected-intro-rail-label" />
        <div className="selected-intro-content">
          <div className="selected-intro-headline">
            <h2>Shaped by<br />daily life.</h2>
          </div>
          <div className="selected-intro-caption">
            <p><span className="selected-intro-word--blue">Six</span> fields of practice, <span className="selected-intro-word--red">one</span> commitment to deliberate work.</p>
          </div>
        </div>
      </header>
      {projects.slice(0, 4).map(renderProject)}
      <div className="selected-collection">
        <GrainTexture />
        <p className="selected-collection-label">All projects</p>
        <svg className="selected-collection-mark" viewBox="3.5 3.5 61 61" aria-hidden="true" focusable="false">
          <rect x="5" y="5" width="38" height="38" />
          <rect x="15" y="15" width="38" height="38" />
          <rect x="25" y="25" width="38" height="38" />
        </svg>
        <h3>Explore the<br />full collection.</h3>
        <ActionLink href="/projects" variant="outline">
          View the complete collection
          <svg className="selected-collection-button-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <rect x="2" y="2" width="8" height="8" />
            <rect x="14" y="2" width="8" height="8" />
            <rect x="2" y="14" width="8" height="8" />
            <rect x="14" y="14" width="8" height="8" />
          </svg>
        </ActionLink>
      </div>
      {projects.slice(4).map((project, index) => renderProject(project, index + 4))}
    </div>
  );
}
