"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Linkedin, ArrowUpRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Button } from "@/components/ui/button";
import { TeamMember } from "@/lib/data/team";

interface TeamCardProps {
  member: TeamMember;
  index: number;
}

export function TeamCard({ member, index }: TeamCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isClient && isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: [0.6, -0.05, 0.01, 0.99]
      }}
      whileHover={{ y: -8 }}
      className="group bg-background border-2 border-border rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:border-primary/50 transition-all duration-500"
    >
      {/* Profile Image */}
      <div className="relative h-64 overflow-hidden">
        <Image
          src={member.image}
          alt={member.name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className={`object-cover transition-all duration-500 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTAwJScendoaGVpZ2h0PScxMDAlJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnPjxyZWN0IHdpZHRoPScxMDAlJyBoZWlnaHQ9JzEwMCUnIGZpbGw9JyNlZWUnLz48L3N2Zz4="
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Experience Badge */}
        <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-caption-semibold">
          {member.yearsExperience}+ Years
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Name and Role */}
        <div className="mb-4">
          <h3 className="heading-card-sm mb-2 group-hover:text-gradient transition-all duration-300">
            {member.name}
          </h3>
          <p className="text-body-sm-medium text-primary mb-3">
            {member.role}
          </p>
        </div>

        {/* Description */}
        <p className="text-body-sm text-muted-foreground mb-4 line-clamp-3 group-hover:text-foreground transition-colors duration-300">
          {member.description}
        </p>

        {/* Specialties */}
        <div className="flex flex-wrap gap-2 mb-6">
          {member.specialties.slice(0, 3).map((specialty, idx) => (
            <span
              key={idx}
              className="inline-flex items-center px-2 py-1 rounded-full bg-muted/50 text-caption text-muted-foreground border border-border/50"
            >
              {specialty}
            </span>
          ))}
          {member.specialties.length > 3 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full bg-muted/50 text-caption text-muted-foreground border border-border/50">
              +{member.specialties.length - 3} more
            </span>
          )}
        </div>

        {/* Contact Actions */}
        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="flex-1 group-hover:bg-primary group-hover:text-white transition-all duration-300"
          >
            <Link href={`mailto:${member.email}`}>
              <Mail className="w-4 h-4 mr-2" />
              Contact
            </Link>
          </Button>
          
          {member.linkedin && (
            <Button
              asChild
              variant="outline"
              size="sm"
              className="px-3 group-hover:bg-secondary group-hover:text-white transition-all duration-300"
            >
              <Link href={member.linkedin} target="_blank" rel="noopener noreferrer">
                <Linkedin className="w-4 h-4" />
              </Link>
            </Button>
          )}
        </div>

        {/* Hover CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileHover={{ opacity: 1, y: 0 }}
          className="mt-4 flex items-center gap-2 text-primary text-body-sm-medium opacity-0 group-hover:opacity-100 transition-all duration-300"
        >
          <span>Learn More</span>
          <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
        </motion.div>
      </div>
    </motion.div>
  );
}
