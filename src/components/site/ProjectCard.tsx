"use client";

import { useEffect, useRef, type PointerEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/content/contracts";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { CategoryIcon } from "./CategoryIcon";
const labels: Record<Project["category"], string> = {
  residential: "Residential",
  commercial: "Commercial",
  public: "Urban Planning",
  interior: "Interior",
  fabrication: "Fabrication",
  digital: "Digital",
};

// Maximum image travel either side of centre, and the easing time constant.
const PARALLAX_RANGE = 8;
const PARALLAX_EASE_MS = 110;

/**
 * Pointer parallax for the featured image. The offset is eased toward the pointer
 * every frame (frame-rate independent) and written straight to the media layer, so
 * enter, move, scroll-while-hovered and leave all glide instead of restarting a CSS
 * transition on each pointer event.
 */
function useImageParallax() {
  const media = useRef<HTMLDivElement>(null);
  const motion = useRef({ frame: 0, last: 0, active: false, px: 0, py: 0, x: 0, y: 0 });
  useEffect(() => {
    const state = motion.current;
    return () => cancelAnimationFrame(state.frame);
  }, []);

  const step = (now: number) => {
    const state = motion.current;
    const element = media.current;
    state.frame = 0;
    if (!element) return;
    let targetX = 0;
    let targetY = 0;
    if (state.active) {
      // Measured per frame, so scrolling under a still pointer keeps the target true.
      const bounds = element.getBoundingClientRect();
      if (bounds.width > 0 && bounds.height > 0) {
        targetX = (Math.min(1, Math.max(0, (state.px - bounds.left) / bounds.width)) - 0.5) * 2 * PARALLAX_RANGE;
        targetY = (Math.min(1, Math.max(0, (state.py - bounds.top) / bounds.height)) - 0.5) * 2 * PARALLAX_RANGE;
      }
    }
    const elapsed = state.last ? Math.min(now - state.last, 64) : 16;
    state.last = now;
    const blend = 1 - Math.exp(-elapsed / PARALLAX_EASE_MS);
    state.x += (targetX - state.x) * blend;
    state.y += (targetY - state.y) * blend;
    const settled = Math.abs(targetX - state.x) < 0.02 && Math.abs(targetY - state.y) < 0.02;
    if (settled) {
      state.x = targetX;
      state.y = targetY;
    }
    element.style.transform = `translate3d(${state.x.toFixed(2)}px, ${state.y.toFixed(2)}px, 0)`;
    if (state.active || !settled) state.frame = requestAnimationFrame(step);
    else state.last = 0;
  };
  const run = () => {
    if (!motion.current.frame) motion.current.frame = requestAnimationFrame(step);
  };
  const track = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const state = motion.current;
    state.active = true;
    state.px = event.clientX;
    state.py = event.clientY;
    run();
  };
  const release = () => {
    motion.current.active = false;
    run();
  };
  return { media, handlers: { onPointerEnter: track, onPointerMove: track, onPointerLeave: release } };
}

export function ProjectCard({
  slug,
  title,
  category,
  location,
  year,
  image,
  isLoading = false,
  variant = "default",
  catalogShape = "standard",
  imageSizes,
}: Partial<Project> &
  Pick<Project, "slug" | "title" | "category" | "year"> & {
    isLoading?: boolean;
    variant?: "default" | "featured";
    catalogShape?: "standard" | "portrait" | "medium" | "wide";
    imageSizes?: string;
  }) {
  const parallax = useImageParallax();
  if (isLoading) return <SkeletonCard />;
  if (variant === "featured") {
    return (
      <Link
        className="project-card project-card--featured"
        href={`/projects/${slug}`}
        aria-label={`Open ${title}`}
        {...parallax.handlers}
      >
        <div className="project-card-image">
          <div className="project-card-media" ref={parallax.media}>
            {image && (
              <Image
                src={image}
                alt={title}
                fill
                sizes="(min-width: 1024px) 420px, (min-width: 768px) 45vw, 90vw"
                className="object-cover"
              />
            )}
          </div>
        </div>
        <div className="project-card-footer">
          <div className="project-card-info">
            <span className="project-card-category">
              <CategoryIcon category={category} />
              {labels[category]}
            </span>
            <h2 className="project-card-title">{title}</h2>
          </div>
          <div className="project-card-details">
            <span className="project-card-year">{year}</span>
            {location && <span className="project-card-location">{location}</span>}
          </div>
        </div>
      </Link>
    );
  }
  return (
    <Link
      className="project-card project-card--catalog"
      data-catalog-shape={catalogShape}
      href={"/projects/" + slug}
      aria-label={`View ${title} project`}
      {...parallax.handlers}
    >
      <div className="project-card-image">
        <div className="project-card-media" ref={parallax.media}>
          {image && (
            <Image
              src={image}
              alt={title}
              fill
              sizes={imageSizes ?? (catalogShape === "wide"
                ? "(min-width: 1280px) 854px, (min-width: 1024px) 67vw, 90vw"
                : catalogShape === "medium"
                  ? "(min-width: 1280px) 640px, (min-width: 1024px) 50vw, 90vw"
                  : "(min-width: 1280px) 426px, (min-width: 1024px) 33vw, 90vw")}
              className="object-cover"
            />
          )}
        </div>
        <div className="project-card-meta">
          <span className="project-card-category">
            <CategoryIcon category={category} />
            {labels[category]}
          </span>
          <span className="project-card-year">{year}</span>
        </div>
      </div>
      <div className="project-card-copy">
        <div className="project-card-title-row">
          <h2>{title}</h2>
          <ArrowUpRight aria-hidden="true" className="project-card-indicator" size={22} />
        </div>
      </div>
    </Link>
  );
}
