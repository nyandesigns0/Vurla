"use client";
import { useState } from "react";
import { ArrowUpRight, FileText } from "lucide-react";
import type { HeroProjectMeta, HomeContent } from "@/content/contracts";
import { ActionLink } from "@/components/ui/ActionLink";
import { Divider } from "@/components/ui/Divider";
import { ScrollCue } from "@/components/ui/ScrollCue";
import { StatisticsBar } from "@/components/site/StatisticsBar";
import { ServiceDossierRow } from "@/components/site/ServiceDossierRow";
import { useHomeShellSlots } from "@/components/site/site-shell";
import { GrainTexture } from "@/components/site/GrainTexture";
import { DotTexture } from "@/components/site/DotTexture";
import { SectionRail } from "@/components/site/SectionRail";
import { HomeChapterStack } from "./home-chapter-stack";
import { HeroGlitchHeading } from "./hero-glitch-heading";
import { NewWorkRoom } from "./new-work-room";
import { SelectedProjects } from "./selected-projects";
import { SpatialHero } from "./spatial-hero";
import { useDossierHover } from "./use-dossier-hover";

export function HomePageClient({ content }: { content: HomeContent }) {
  const { footer } = useHomeShellSlots();
  const [previewProject, setPreviewProject] = useState<HeroProjectMeta | null>(null);
  const dossierRef = useDossierHover();
  return <HomeChapterStack>
    <section className="home-chapter hero-chapter" id="hero" aria-labelledby="hero-heading">
      <div className="home-chapter-plate">
        <div className="hero-stage">
          <div className="hero-copy shell">
            <div className="hero-copy-panel" data-project-preview={previewProject ? "active" : "idle"}>
              <HeroGlitchHeading id="hero-heading" text={previewProject?.title ?? "Vision & Uniqueness in Real Living Areas."} />
              <div className="actions">
                <ActionLink href="/projects">Explore selected work <ArrowUpRight className="hero-action-icon" aria-hidden="true" /></ActionLink>
                <ActionLink href="/contact" variant="outline">Request an estimate <FileText className="hero-action-icon" aria-hidden="true" /></ActionLink>
              </div>
            </div>
          </div>
          <SpatialHero projects={content.heroProjects} onProjectPreview={setPreviewProject} />
        </div>
        <StatisticsBar metrics={content.statistics} />
      </div>
    </section>
    <section className="home-chapter services-chapter" id="services" aria-labelledby="services-heading">
      <div className="home-chapter-plate">
        <GrainTexture className="chapter-grain" />
        <header className="chapter-heading services-intro shell">
          <DotTexture />
          <SectionRail index="02" label="Services" className="services-intro-rail" indexClassName="services-intro-number" labelClassName="services-intro-label" />
          <h2 className="services-intro-message" id="services-heading">
            <span className="services-intro-statement"><span>Six disciplines. </span></span>
            <span className="services-intro-promise"><span><span className="services-intro-red">One</span> continuous practice.</span></span>
          </h2>
        </header>
        <div className="service-dossiers" ref={dossierRef}>{content.services.map(service => <ServiceDossierRow key={service.id} service={service} />)}</div>
        <div className="services-scroll-panel-shell">
          <Divider className="services-scroll-divider" />
          <div className="chapter-scroll-panel services-scroll-panel shell">
            <p className="chapter-scroll-cue"><ScrollCue /></p>
          </div>
        </div>
      </div>
    </section>
    <section className="home-chapter projects-chapter" id="projects" aria-label="Selected projects">
      <div className="home-chapter-plate">
        <GrainTexture className="chapter-grain" />
        <div className="projects-side-dividers shell" aria-hidden="true">
          <Divider orientation="vertical" className="projects-side-divider projects-side-divider--left" />
          <Divider orientation="vertical" className="projects-side-divider projects-side-divider--right" />
        </div>
        <SelectedProjects projects={content.selectedProjects} />
        <div className="chapter-scroll-panel projects-scroll-panel shell">
          <GrainTexture />
          <p className="chapter-scroll-cue"><ScrollCue /></p>
        </div>
      </div>
    </section>
    <section className="home-chapter new-work-chapter" id="new-work" aria-label="New work">
      <div className="home-chapter-plate">
        <NewWorkRoom />
        {footer}
      </div>
    </section>
  </HomeChapterStack>;
}
