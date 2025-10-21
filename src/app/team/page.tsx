"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TeamCard } from "@/components/site/TeamCard";
import { teamMembers } from "@/lib/data/team";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function TeamPage() {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  // Filter team members by role
  const filteredTeam = teamMembers.filter(member => {
    if (activeFilter === "all") return true;
    return member.role.toLowerCase().includes(activeFilter.toLowerCase());
  });

  // Calculate team statistics
  const totalExperience = teamMembers.reduce((sum, member) => sum + member.yearsExperience, 0);
  const teamSize = teamMembers.length;

  const filters = [
    { value: "all", label: "All Team" },
    { value: "architect", label: "Architects" },
    { value: "designer", label: "Designers" },
    { value: "manager", label: "Managers" },
    { value: "specialist", label: "Specialists" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-32 bg-background overflow-hidden">
        <div className="absolute inset-0 mesh-gradient opacity-30" />
        <div className="section-container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="heading-section mb-6">
              Our <span className="text-gradient">Team</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Meet the architects, designers, and project managers behind Vurla's award-winning architecture practice.
            </p>
          </motion.div>

          {/* Team Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          >
            <div className="text-center">
              <div className="text-stat text-gradient mb-2">{teamSize}</div>
              <div className="text-body-medium text-muted-foreground">Team Members</div>
            </div>
            <div className="text-center">
              <div className="text-stat text-gradient mb-2">{totalExperience}+</div>
              <div className="text-body-medium text-muted-foreground">Years Combined Experience</div>
            </div>
            <div className="text-center">
              <div className="text-stat text-gradient mb-2">50+</div>
              <div className="text-body-medium text-muted-foreground">Projects Completed</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-background border-b border-border">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap gap-3 justify-center"
          >
            {filters.map((filter) => (
              <motion.button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  px-4 py-2 rounded-full text-button transition-all duration-300 border
                  ${activeFilter === filter.value
                    ? "bg-primary text-foreground border-primary shadow-md"
                    : "bg-background text-foreground border-border hover:border-primary/50 hover:bg-muted/50"
                  }
                `}
              >
                {filter.label}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-16 md:py-20 bg-background">
        <div className="section-container">
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredTeam.map((member, index) => (
              <TeamCard key={member.id} member={member} index={index} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
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
              Ready to Work with Our Team?
            </h2>
            <p className="text-xl mb-10 text-white/90 leading-relaxed max-w-2xl mx-auto">
              Contact us today to discuss your next architectural project and discover how our team can bring your vision to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-xl">
                <Link href="/contact">Start Your Project</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary transition-all duration-300">
                <Link href="/projects">View Our Work</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}


