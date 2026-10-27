"use client";

import { useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { ChevronDown, RotateCcw, Tags } from "lucide-react";
import { Button } from "@/components/ui/button";

export const categoryValues = ["residential", "commercial", "public", "interior", "fabrication", "digital"] as const;
export type ProjectCategory = typeof categoryValues[number];
export const categories = [
  ["all", "All"], ["residential", "Residential"], ["commercial", "Commercial"],
  ["public", "Urban Planning"], ["interior", "Interior"], ["fabrication", "Fabrication"], ["digital", "Digital"],
] as const;

function navigateGroup(event: KeyboardEvent<HTMLDivElement>) {
  if (!["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
  const buttons = [...event.currentTarget.querySelectorAll<HTMLButtonElement>("button")];
  const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
  if (index < 0) return;
  event.preventDefault();
  const next = event.key === "Home" ? 0 : event.key === "End" ? buttons.length - 1
    : (index + (["ArrowLeft", "ArrowUp"].includes(event.key) ? -1 : 1) + buttons.length) % buttons.length;
  buttons[next]?.focus({ preventScroll: true });
  buttons[next]?.scrollIntoView?.({ block: "nearest", inline: "nearest" });
}

export function FilterBar({ activeCategories, onCategoriesChange, onClearAll, search, className = "" }: {
  activeCategories: ProjectCategory[];
  onCategoriesChange: (categories: ProjectCategory[]) => void;
  onClearAll: () => void;
  search?: ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const focusOnOpen = useRef(false);
  const id = useId();
  const allSelected = categoryValues.every(value => activeCategories.includes(value));

  useLayoutEffect(() => {
    if (open && focusOnOpen.current) {
      contentRef.current?.querySelector<HTMLButtonElement>("button")?.focus({ preventScroll: true });
      focusOnOpen.current = false;
    }
  }, [open]);

  const close = () => {
    if (open) triggerRef.current?.focus({ preventScroll: true });
    setOpen(false);
  };

  return (
    <div className={"filters " + className} onKeyDown={event => {
      if (event.key === "Escape" && open) { event.preventDefault(); close(); }
    }}>
      <div className="catalog-toolbar">
        {search}
        <Button variant="ghost" className="filter-disclosure-button" ref={triggerRef}
          aria-label={allSelected ? "Filter projects" : `Filter projects, ${activeCategories.length} ${activeCategories.length === 1 ? "category" : "categories"} selected`}
          aria-expanded={open} aria-controls={id + "-panel"}
          onClick={() => setOpen(current => !current)}
          onKeyDown={event => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              if (open) contentRef.current?.querySelector<HTMLButtonElement>("button")?.focus({ preventScroll: true });
              else { focusOnOpen.current = true; setOpen(true); }
            }
          }}>
          <Tags className="filter-action-icon" size={15} aria-hidden="true" />
          <span className="filter-label-desktop">Filter projects</span>
          <span className="filter-label-mobile" aria-hidden="true">Filter</span>
          {!allSelected && <span className="filter-selection-count">{activeCategories.length}</span>}
          <ChevronDown className="filter-toggle-chevron" size={14} aria-hidden="true" />
        </Button>
        <Button variant="ghost" className="filter-reset" aria-label="Reset filters" onClick={() => {
          setOpen(false);
          onClearAll();
        }}>
          <RotateCcw className="filter-action-icon" size={15} aria-hidden="true" />
          Reset
        </Button>
      </div>
      <div id={id + "-panel"} className="catalog-filter-disclosure" data-open={open}
        aria-hidden={!open} inert={!open}>
        <div className="catalog-filter-clip">
          <div ref={contentRef} className="catalog-filter-scroll">
            <div className="filter-panel-content filter-grid filter-category-grid" role="group" aria-label="Project categories" onKeyDown={navigateGroup}>
              {categories.map(([value, label]) => {
                const selected = value === "all" ? allSelected : activeCategories.includes(value);
                return <Button key={value} variant="ghost" className="filter-segment" aria-pressed={selected}
                  onClick={() => onCategoriesChange(value === "all" ? [...categoryValues]
                    : allSelected ? [value]
                      : selected ? activeCategories.filter(category => category !== value) : [...activeCategories, value])}>{label}</Button>;
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
