"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ProjectCard } from "@/components/site/ProjectCard";
import { SearchBar } from "@/components/site/SearchBar";
import { FilterBar, CategoryFilter, ServiceTagFilter } from "@/components/site/FilterBar";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Project } from "@/lib/data/projects";

interface ProjectsPageClientProps {
  projects: Project[];
}

export function ProjectsPageClient({ projects: initialProjects }: ProjectsPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");
  const [activeServiceTags, setActiveServiceTags] = useState<ServiceTagFilter[]>([]);
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  const projects = useMemo(() => initialProjects, [initialProjects]);

  const filteredProjects = useMemo(() => {
    let filtered = projects;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((project) =>
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.services.some((service) => service.toLowerCase().includes(query)) ||
        (project.location && project.location.toLowerCase().includes(query)) ||
        (project.client && project.client.toLowerCase().includes(query))
      );
    }

    if (activeCategory !== "all") {
      filtered = filtered.filter((project) => project.category === activeCategory);
    }

    if (activeServiceTags.length > 0) {
      filtered = filtered.filter((project) =>
        activeServiceTags.some((tag) => project.services.includes(tag))
      );
    }

    return filtered;
  }, [projects, searchQuery, activeCategory, activeServiceTags]);

  const handleCategoryChange = (category: CategoryFilter) => {
    setIsFilterLoading(true);
    setActiveCategory(category);
    setTimeout(() => setIsFilterLoading(false), 300);
  };

  const handleServiceTagsChange = (tags: ServiceTagFilter[]) => {
    setIsFilterLoading(true);
    setActiveServiceTags(tags);
    setTimeout(() => setIsFilterLoading(false), 300);
  };

  const handleClearAll = () => {
    setIsFilterLoading(true);
    setSearchQuery("");
    setActiveCategory("all");
    setActiveServiceTags([]);
    setTimeout(() => setIsFilterLoading(false), 300);
  };

  return (
    <div className="min-h-screen">
      <section className="relative pt-24 pb-12 bg-background overflow-hidden">
        <div className="absolute inset-0 mesh-gradient opacity-30" />
        <div className="section-container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <h1 className="heading-section mb-6">
              Our <span className="text-gradient">Projects</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Explore our portfolio of award-winning architecture projects spanning residential, commercial, and public realm design.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-6 bg-background border-b border-border">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-6xl mx-auto"
          >
            <div className="flex flex-col gap-4">
              <div className="w-full">
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search projects by title, description, services, location, or client..."
                />
              </div>

              <div className="w-full">
                <FilterBar
                  activeCategory={activeCategory}
                  onCategoryChange={handleCategoryChange}
                  activeServiceTags={activeServiceTags}
                  onServiceTagsChange={handleServiceTagsChange}
                  onClearAll={handleClearAll}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-background">
        <div className="section-container">
          {filteredProjects.length > 0 ? (
            <motion.div
              layout
              className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-500 ${isFilterLoading ? "opacity-50" : "opacity-100"}`}
            >
              {isFilterLoading ? (
                <>
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </>
              ) : (
                filteredProjects.map((project, idx) => (
                  <motion.div
                    key={project.slug}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: idx * 0.1,
                      ease: [0.6, -0.05, 0.01, 0.99],
                    }}
                    whileHover={{ y: -8 }}
                  >
                    <ProjectCard {...project} />
                  </motion.div>
                ))
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-20"
            >
              <div className="max-w-md mx-auto">
                <h3 className="heading-card mb-4 text-muted-foreground">No projects found</h3>
                <p className="text-body text-muted-foreground mb-6">
                  Try adjusting your search criteria or clear all filters to see all projects.
                </p>
                <Button onClick={handleClearAll} variant="outline">
                  Clear All Filters
                </Button>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-16 text-center"
          >
            <p className="text-body-sm text-muted-foreground">
              Showing <span className="text-foreground font-semibold">{filteredProjects.length}</span> of <span className="text-foreground font-semibold">{projects.length}</span> projects
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-32 relative overflow-hidden bg-gradient-to-br from-secondary via-primary to-accent">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.15),transparent_50%)]" />
        </div>

        <div className="section-container text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="heading-section mb-8 text-white">
              Let&apos;s Create Something Amazing
            </h2>
            <p className="text-xl mb-10 text-white/90 leading-relaxed max-w-2xl mx-auto">
              Have a project in mind? Contact us to discuss how Vurla can bring your vision to life with innovative, sustainable design solutions.
            </p>
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-xl">
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
