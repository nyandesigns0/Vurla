"use client";

import Link from "next/link";
import { ArrowUpRight, MapPin, User, Building2, Palette, TreePine, Wrench, Home as HomeIcon, Monitor, FileText, Layout, Settings, CheckCircle, Paintbrush, Lightbulb, Calendar, HardHat, Hammer, Box, Layers, Eye, Code } from "lucide-react";
import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { SkeletonCard } from "@/components/ui/Skeleton";
import Image from "next/image";

interface ProjectCardProps {
  slug: string;
  title: string;
  category: string;
  services?: string[];
  location?: string;
  client?: string;
  year: number;
  image?: string;
  description?: string;
  isLoading?: boolean;
}

export function ProjectCard({ 
  slug, 
  title, 
  category, 
  services = [], 
  location, 
  client, 
  year, 
  image, 
  description, 
  isLoading = false 
}: ProjectCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });
  const displayClass = isVisible ? "animate-slide-in-up" : "opacity-100";

  const categoryColors: Record<string, string> = {
    residential: "hsl(28, 60%, 55%)",
    commercial: "hsl(140, 70%, 45%)",
    public: "hsl(200, 80%, 45%)",
    interior: "hsl(300, 60%, 50%)",
    fabrication: "hsl(25, 70%, 50%)",
    digital: "hsl(220, 70%, 50%)",
  };

  const categoryLabels: Record<string, string> = {
    residential: "Residential",
    commercial: "Commercial",
    public: "Urban Planning",
    interior: "Interior",
    fabrication: "Fabrication",
    digital: "Digital",
  };

  const serviceIcons: Record<string, any> = {
    // Architecture subItems
    "Conceptual Design": FileText,
    "Space Programming": Layout,
    "Schematic Design": Building2,
    "Design Development": Settings,
    "Construction Documents": FileText,
    "Building Permits": CheckCircle,
    
    // Interior subItems
    "Space Planning": Layout,
    "Material Selection": Paintbrush,
    "FF&E Specification": HomeIcon,
    "Interior Styling": Palette,
    "Color Consultation": Paintbrush,
    "Lighting Design": Lightbulb,
    
    // Landscape subItems
    "Site Planning": MapPin,
    "Hardscape Design": Settings,
    "Planting Design": TreePine,
    "Playground Design": User,
    "Irrigation Systems": Wrench,
    "Sustainable Landscapes": TreePine,
    
    // Construction subItems
    "Project Management": Calendar,
    "Quality Control": CheckCircle,
    "Site Supervision": HardHat,
    "Cost Estimation": User,
    "Construction Documentation": FileText,
    "Contract Administration": Settings,
    
    // Fabrication subItems
    "Custom Furniture": HomeIcon,
    "Millwork": Hammer,
    "Metalwork": Wrench,
    "Joinery": Settings,
    "Prototyping": Box,
    "Finishing & Installation": CheckCircle,
    
    // Digital Solutions subItems
    "BIM Services": Layers,
    "3D Visualization": Eye,
    "VR Walkthroughs": Monitor,
    "Custom Scripting": Code,
    "Parametric Design": Settings,
    "Digital Fabrication": Wrench,
  };

  const categoryColor = categoryColors[category] || "var(--primary)";
  const categoryLabel = categoryLabels[category] || category;

  if (isLoading) {
    return <SkeletonCard />;
  }

  return (
    <Link href={`/projects/${slug}`}>
      <div 
        ref={ref}
        className={`group rounded-lg overflow-hidden border transition-all duration-300 hover:shadow-lg h-full flex flex-col cursor-pointer ${displayClass}`}
        style={{ borderColor: "var(--border)" }}
      >
        {/* Image or placeholder */}
        {image ? (
          <div className="relative w-full h-48 overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300">
            <Image
              src={image}
              alt={title}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              className={`object-cover transition-all duration-500 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTAwJScgaGVpZ2h0PScxMDAlJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnPjxyZWN0IHdpZHRoPScxMDAlJyBoZWlnaHQ9JzEwMCUnIGZpbGw9JyNlZWUnLz48L3N2Zz4="
            />
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
          </div>
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 transition-all duration-300 group-hover:from-gray-300 group-hover:to-gray-400 flex items-center justify-center">
            <div className="text-gray-400 text-center">
					<div className="text-stat-sm font-light">✦</div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 p-5 flex flex-col justify-between">
          <div>
            {/* Category and Year */}
            <div className="flex items-center justify-between mb-3">
              <span 
						className="text-caption-semibold uppercase tracking-wider px-2 py-1 rounded-full text-white transition-all duration-300 group-hover:shadow-md"
                style={{ background: categoryColor }}
              >
                {categoryLabel}
              </span>
						<span className="text-caption opacity-60 transition-opacity duration-300 group-hover:opacity-100">{year}</span>
            </div>

            {/* Title */}
				<h3 className="heading-card-sm mb-2 group-hover:opacity-75 transition-opacity duration-300">
              {title}
            </h3>

            {/* Description */}
            {description && (
				<p className="text-body-sm opacity-70 line-clamp-2 transition-opacity duration-300 group-hover:opacity-85 mb-3">
                {description}
              </p>
            )}

            {/* Service Tags */}
            {services.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {services.slice(0, 4).map((service) => {
                  const Icon = serviceIcons[service];
                  return (
                    <span
                      key={service}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-muted/30 text-caption text-muted-foreground border border-border/30 hover:bg-muted/50 transition-colors duration-200"
                    >
                      {Icon && <Icon className="w-3 h-3" />}
                      <span className="truncate max-w-[80px]">{service}</span>
                    </span>
                  );
                })}
                {services.length > 4 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-muted/30 text-caption text-muted-foreground border border-border/30">
                    +{services.length - 4} more
                  </span>
                )}
              </div>
            )}

            {/* Location and Client Info */}
            {(location || client) && (
              <div className="space-y-1 mb-3">
                {location && (
                  <div className="flex items-center gap-1 text-caption text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span>{location}</span>
                  </div>
                )}
                {client && (
                  <div className="flex items-center gap-1 text-caption text-muted-foreground">
                    <User className="w-3 h-3" />
                    <span>{client}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* CTA */}
				<div className="flex items-center gap-2 mt-4 text-primary text-body-sm-medium opacity-0 group-hover:opacity-100 transition-all duration-300" style={{ color: "var(--primary)" }}>
            View Project
            <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}
