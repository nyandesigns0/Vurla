"use client";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { ProjectCard } from "@/components/site/ProjectCard";
import { SearchBar } from "@/components/site/SearchBar";
import {
  FilterBar,
  categoryValues,
  type ProjectCategory,
} from "@/components/site/FilterBar";
import { ClosingChapter } from "@/components/site/ClosingChapter";
import { ChapterScrollBar } from "@/components/site/ChapterScrollBar";
import { PagePlate } from "@/components/site/PagePlate";
import { PageSideBorders } from "@/components/site/PageSideBorders";
import { GrainTexture } from "@/components/site/GrainTexture";
import { DotTexture } from "@/components/site/DotTexture";
import { StatePanel } from "@/components/ui/StatePanel";
import { Button } from "@/components/ui/button";
import { ActionLink } from "@/components/ui/ActionLink";
import type { Project } from "@/content/contracts";
import { composeCatalog } from "./catalog-layout";
import { useCatalogHover } from "./use-catalog-hover";
export function categoriesFromSearch(search: string): ProjectCategory[] {
  const values = new URLSearchParams(search).getAll("category");
  if (values.includes("all")) return [...categoryValues];
  const selected = categoryValues.filter((category) => values.includes(category));
  if (selected.length) return selected;
  return values.includes("none") ? [] : [...categoryValues];
}
export function ProjectsPageClient({
  projects,
}: {
  projects: Project[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategories, setActiveCategories] = useState<ProjectCategory[]>([...categoryValues]);
  const outgoingRef = useRef<HTMLDivElement>(null);
  const consoleRef = useRef<HTMLElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const revealResultsRef = useRef(false);
  const catalogHoverRef = useCatalogHover();
  useEffect(() => {
    const sync = () => {
      revealResultsRef.current = true;
      setActiveCategories(categoriesFromSearch(window.location.search));
    };
    setActiveCategories(categoriesFromSearch(window.location.search));
    addEventListener("popstate", sync);
    return () => removeEventListener("popstate", sync);
  }, []);
  const changeCategories = (categories: ProjectCategory[]) => {
    const selected = categoryValues.filter((category) => categories.includes(category));
    revealResultsRef.current = true;
    setActiveCategories(selected);
    const url = new URL(window.location.href);
    url.searchParams.delete("category");
    if (!selected.length) url.searchParams.append("category", "none");
    else if (selected.length !== categoryValues.length) {
      selected.forEach((category) => url.searchParams.append("category", category));
    }
    const next = url.pathname + url.search + url.hash;
    if (next !== window.location.pathname + window.location.search + window.location.hash) {
      window.history.pushState(null, "", next);
    }
  };
  const clear = () => {
    revealResultsRef.current = true;
    setSearchQuery("");
    changeCategories([...categoryValues]);
  };
  const changeSearch = (query: string) => {
    revealResultsRef.current = true;
    setSearchQuery(query);
  };
  const filtered = useMemo(
    () =>
      projects.filter((p) => {
        const q = searchQuery.trim().toLowerCase();
        return (
          (!q ||
            [p.title, p.description, ...p.services, p.location, p.client].some(
              (v) => v?.toLowerCase().includes(q),
            )) &&
          activeCategories.includes(p.category)
        );
      }),
    [projects, searchQuery, activeCategories],
  );
  const catalog = composeCatalog(filtered);
  useLayoutEffect(() => {
    if (!revealResultsRef.current) return;
    revealResultsRef.current = false;
    const status = statusRef.current;
    const console = consoleRef.current;
    if (!status || !console) return;

    // A shorter result set can leave the old scroll position in the closing
    // chapter. Keep the count and first tile below the sticky controls.
    const stickyTop = Number.parseFloat(getComputedStyle(console).top) || 0;
    const stickyBottom = stickyTop + console.getBoundingClientRect().height;
    const target = Math.max(0, window.scrollY + status.getBoundingClientRect().top - stickyBottom - 12);
    if (window.scrollY > target + 4) window.scrollTo({ top: target, behavior: "instant" });
  }, [activeCategories, searchQuery]);
  return (
    <div className="page page-family projects-page">
      <div ref={outgoingRef} className="closing-chapter-source">
        <GrainTexture className="projects-background-grain" />
        <PageSideBorders className="projects-source-sides" />
        <div className="projects-opening-frame">
          <PagePlate
            index="03"
            kicker="Our Work"
            title="Work across six disciplines"
            lead="Explore our work in architecture, interiors, and beyond."
            crosshair
            className="page-plate--roomy"
          />
        </div>
        <section ref={consoleRef} className="shell catalog-console" aria-label="Project filters">
          <FilterBar
            search={<SearchBar value={searchQuery} onChange={changeSearch} placeholder="Search projects…" />}
            activeCategories={activeCategories}
            onCategoriesChange={changeCategories}
            onClearAll={clear}
          />
        </section>
        <section ref={catalogHoverRef} className="shell catalog-results">
          <div ref={statusRef} className="catalog-status">
            <p className="result-count" aria-live="polite">
              Showing {filtered.length} of {projects.length} projects
            </p>
          </div>
          {filtered.length ? (
            <div className="catalog-grid" data-layout={catalog.editorial ? "editorial" : "regular"}>
              <DotTexture />
              {catalog.cards.map(({ project, shape }, index) => (
                <ProjectCard
                  key={project.slug}
                  {...project}
                  catalogShape={shape}
                  imageSizes={!catalog.editorial && filtered.length % 3 === 1 && index === filtered.length - 1
                    ? "(min-width: 1280px) 1280px, 100vw"
                    : !catalog.editorial && filtered.length % 3 === 2 && index >= filtered.length - 2
                      ? "(min-width: 1280px) 640px, (min-width: 1024px) 50vw, 90vw"
                      : undefined}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <DotTexture />
              <StatePanel
                title="No projects found"
                description="Try adjusting your search criteria or clear all filters to see all projects."
              >
                <Button onClick={clear} variant="outline">
                  Clear All Filters
                </Button>
              </StatePanel>
            </div>
          )}
        </section>
        <ChapterScrollBar />
      </div>
      <ClosingChapter
        outgoingRef={outgoingRef}
        headingId="projects-closing-heading"
        title={<>Let&apos;s Create <span>Something Amazing</span></>}
        body="Have a project in mind? Contact us to discuss how Vurla can bring your vision to life with innovative, sustainable design solutions."
        actions={
          <ActionLink href="/contact">
            Get in Touch <ArrowRight size={16} />
          </ActionLink>
        }
      />
    </div>
  );
}
