"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, X, Building2, Palette, TreePine, Wrench, Home as HomeIcon, Monitor, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { services, getAllServiceTags } from "@/lib/data/services";

export type CategoryFilter = "all" | "residential" | "commercial" | "public" | "interior" | "fabrication" | "digital";

export type ServiceTagFilter = string; // Now using detailed service tags

interface FilterBarProps {
  activeCategory: CategoryFilter;
  onCategoryChange: (category: CategoryFilter) => void;
  activeServiceTags: ServiceTagFilter[];
  onServiceTagsChange: (tags: ServiceTagFilter[]) => void;
  onClearAll: () => void;
  className?: string;
}

const categories = [
  { value: "all" as CategoryFilter, label: "All", icon: null },
  { value: "residential" as CategoryFilter, label: "Residential", icon: HomeIcon },
  { value: "commercial" as CategoryFilter, label: "Commercial", icon: Building2 },
  { value: "public" as CategoryFilter, label: "Urban Planning", icon: TreePine },
  { value: "interior" as CategoryFilter, label: "Interior", icon: Palette },
  { value: "fabrication" as CategoryFilter, label: "Fabrication", icon: Wrench },
  { value: "digital" as CategoryFilter, label: "Digital", icon: Monitor },
];

export function FilterBar({
  activeCategory,
  onCategoryChange,
  activeServiceTags,
  onServiceTagsChange,
  onClearAll,
  className = "",
}: FilterBarProps) {
  const [expandedServices, setExpandedServices] = useState<string[]>([]);

  const handleServiceTagToggle = (tag: string) => {
    if (activeServiceTags.includes(tag)) {
      onServiceTagsChange(activeServiceTags.filter(t => t !== tag));
    } else {
      onServiceTagsChange([...activeServiceTags, tag]);
    }
  };

  const toggleServiceExpansion = (serviceTitle: string) => {
    if (expandedServices.includes(serviceTitle)) {
      setExpandedServices(expandedServices.filter(s => s !== serviceTitle));
    } else {
      setExpandedServices([...expandedServices, serviceTitle]);
    }
  };

  const getServiceTagCount = (serviceTitle: string) => {
    return activeServiceTags.filter(tag => 
      services.find(s => s.title === serviceTitle)?.subItems.some(subItem => subItem.name === tag)
    ).length;
  };

  const hasActiveFilters = activeCategory !== "all" || activeServiceTags.length > 0;

  return (
    <div className={`transition-all duration-300 ${className}`}>
      <div className="py-2">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4">
          {/* Category Filters */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-2">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Categories:</span>
            <div className="flex flex-wrap gap-1 max-w-[600px]">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <motion.button
                    key={category.value}
                    onClick={() => onCategoryChange(category.value)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all duration-300 border whitespace-nowrap
                      ${activeCategory === category.value
                        ? "bg-primary text-white border-primary shadow-sm"
                        : "bg-background text-foreground border-border hover:border-primary/50 hover:bg-muted/50"
                      }
                    `}
                  >
                    {Icon && <Icon className="w-3.5 h-3.5" />}
                    {category.label}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Service Tags */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-2">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Service Tags:</span>
            <div className="flex flex-wrap gap-2">
              {services.map((service) => {
                const Icon = service.icon;
                const tagCount = getServiceTagCount(service.title);
                const isExpanded = expandedServices.includes(service.title);
                
                return (
                  <div key={service.title} className="relative">
                    <button
                      onClick={() => toggleServiceExpansion(service.title)}
                      className={`
                        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all duration-300 border
                        ${tagCount > 0
                          ? "bg-secondary text-white border-secondary shadow-sm"
                          : "bg-background text-foreground border-border hover:border-secondary/50 hover:bg-secondary/10"
                        }
                      `}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {service.title}
                      {tagCount > 0 && (
                        <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded-full text-xs">
                          {tagCount}
                        </span>
                      )}
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-2 bg-background border border-border rounded-lg shadow-lg z-50 w-max"
                        >
                          <div className="p-2">
                            <div className="text-xs font-medium text-muted-foreground mb-2 px-2">
                              {service.title} Tags
                            </div>
                            <div className="space-y-1">
                              {service.subItems.map((subItem) => {
                                const SubIcon = subItem.icon;
                                const isActive = activeServiceTags.includes(subItem.name);
                                
                                return (
                                  <motion.button
                                    key={subItem.name}
                                    onClick={() => handleServiceTagToggle(subItem.name)}
                                    whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                                    className={`
                                      w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-all duration-200 whitespace-nowrap
                                      ${isActive
                                        ? "bg-secondary/10 text-secondary"
                                        : "text-foreground hover:bg-muted/50"
                                      }
                                    `}
                                  >
                                    <SubIcon className="w-3.5 h-3.5" />
                                    {subItem.name}
                                    {isActive && (
                                      <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="ml-auto w-2 h-2 bg-secondary rounded-full"
                                      />
                                    )}
                                  </motion.button>
                                );
                              })}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Clear All Button */}
          {hasActiveFilters && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="ml-auto"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearAll}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5 mr-1" />
                Clear All
              </Button>
            </motion.div>
          )}
        </div>

        {/* Active Filters Summary - Compact */}
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 pt-3 border-t border-border/50"
          >
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground">Active:</span>
              {activeCategory !== "all" && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs">
                  {categories.find(c => c.value === activeCategory)?.label}
                  <button
                    onClick={() => onCategoryChange("all")}
                    className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {activeServiceTags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-secondary/10 text-secondary text-xs">
                  {tag}
                  <button
                    onClick={() => handleServiceTagToggle(tag)}
                    className="hover:bg-secondary/20 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
