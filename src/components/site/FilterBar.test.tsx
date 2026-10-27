import { useState } from "react";
import { readFileSync } from "node:fs";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { categoryValues, FilterBar, type ProjectCategory } from "./FilterBar";

function ControlledFilters() {
  const [selectedCategories, setSelectedCategories] = useState<ProjectCategory[]>([...categoryValues]);
  return (
    <FilterBar
      activeCategories={selectedCategories}
      onCategoriesChange={setSelectedCategories}
      onClearAll={() => setSelectedCategories([...categoryValues])}
    />
  );
}

describe("project category filter", () => {
  it("uses the same parametric height as the services index", () => {
    const shared = readFileSync("src/components/site/page-family.css", "utf8");
    const projects = readFileSync("src/components/site/project-catalog.css", "utf8");
    const services = readFileSync("src/features/services/services-page.css", "utf8");
    expect(shared).toContain("--pf-subnav-height: 44px");
    expect(projects).toMatch(/\.catalog-toolbar \{[^}]*height: var\(--pf-subnav-height\)/);
    expect(services).toMatch(/\.service-index ol \{[^}]*height: var\(--pf-subnav-height\)/);
  });

  it("shows clearly labeled filter and reset controls without subcategories", () => {
    const { container } = render(<ControlledFilters />);
    const toolbar = container.querySelector<HTMLElement>(".catalog-toolbar")!;
    expect(within(toolbar).getAllByRole("button")).toHaveLength(2);
    expect(screen.getByRole("button", { name: "Filter projects" }).querySelector(".filter-action-icon")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Filter projects" })).toHaveTextContent("Filter projects");
    expect(screen.getByRole("button", { name: "Reset filters" }).querySelector(".filter-action-icon")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Subcategories" })).toBeNull();
    expect(container.querySelector(".catalog-filter-disclosure")).toHaveAttribute("inert");
  });

  it("starts with all, selects one category first, then adds or removes others", () => {
    render(<ControlledFilters />);
    fireEvent.click(screen.getByRole("button", { name: "Filter projects" }));
    const group = screen.getByRole("group", { name: "Project categories" });
    const all = within(group).getByRole("button", { name: "All" });
    const residential = within(group).getByRole("button", { name: "Residential" });
    const commercial = within(group).getByRole("button", { name: "Commercial" });
    expect(all).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(residential);
    expect(residential).toHaveAttribute("aria-pressed", "true");
    expect(commercial).toHaveAttribute("aria-pressed", "false");
    expect(all).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("button", { name: "Filter projects, 1 category selected" })).toHaveTextContent("1");
    fireEvent.click(commercial);
    expect(commercial).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Filter projects, 2 categories selected" })).toHaveTextContent("2");
    fireEvent.click(residential);
    expect(residential).toHaveAttribute("aria-pressed", "false");
    expect(commercial).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(all);
    expect(all).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(commercial);
    expect(residential).toHaveAttribute("aria-pressed", "false");
    expect(commercial).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(screen.getByRole("button", { name: "Reset filters" }));
    expect(screen.getByRole("button", { name: "Filter projects" })).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(screen.getByRole("button", { name: "Filter projects" }));
    expect(within(screen.getByRole("group", { name: "Project categories" })).getByRole("button", { name: "All" })).toHaveAttribute("aria-pressed", "true");
  });

  it("opens by keyboard, navigates choices and returns focus on Escape", () => {
    render(<ControlledFilters />);
    const trigger = screen.getByRole("button", { name: "Filter projects" });
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    const all = screen.getByRole("button", { name: "All" });
    expect(all).toHaveFocus();
    fireEvent.keyDown(all, { key: "ArrowRight" });
    expect(screen.getByRole("button", { name: "Residential" })).toHaveFocus();
    fireEvent.keyDown(document.activeElement!, { key: "End" });
    expect(screen.getByRole("button", { name: "Digital" })).toHaveFocus();
    fireEvent.keyDown(document.activeElement!, { key: "Escape" });
    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
});
