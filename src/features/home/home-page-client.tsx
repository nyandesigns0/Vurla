"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import type { Project, Service } from "@/content/contracts";
import { BrandMark } from "@/components/site/BrandMark";
import { ServiceIcon } from "@/components/site/ServiceIcon";

const stats = [
  { number: 50, suffix: "+", label: "Projects completed" },
  { number: 10, suffix: "+", label: "Years of excellence" },
  { number: 5, suffix: "+", label: "Awards won" },
  { number: 100, suffix: "%", label: "Client satisfaction" },
];

const projectCategories = [
  { category: "residential", label: "Residential" },
  { category: "commercial", label: "Commercial" },
  { category: "public", label: "Urban Planning" },
  { category: "interior", label: "Interior" },
  { category: "fabrication", label: "Fabrication" },
  { category: "digital", label: "Digital" },
] as const;

const categoryFeatureSlugs: Partial<Record<Project["category"], string>> = {
  commercial: "storyworks-campus",
  residential: "baker-house",
};

const serviceDetails = [
  { headline: "From Concept to Reality", projectCount: 24 },
  { headline: "Spaces That Inspire", projectCount: 18 },
  { headline: "Nature Meets Design", projectCount: 15 },
  { headline: "Building Excellence", projectCount: 32 },
  { headline: "Crafted to Perfection", projectCount: 12 },
  { headline: "Innovation Through Technology", projectCount: 8 },
];

export function HomePageClient({ projects, services }: { projects: Project[]; services: Service[] }) {
  const [animatedNumbers, setAnimatedNumbers] = useState(() => stats.map(() => 0));
  const statsRef = useRef<HTMLElement>(null);
  const featured = projects.find((project) => project.slug === "terraced-garden-retreat") ?? projects[0];
  const categoryProjects = projectCategories.flatMap(({ category, label }) => {
    const project = projects.find((candidate) => candidate.slug === categoryFeatureSlugs[category])
      ?? projects.find((candidate) => candidate.category === category);
    return project ? [{ category, label, project }] : [];
  });

  useEffect(() => {
    const statsElement = statsRef.current;
    if (!statsElement) return;

    let frameId: number | undefined;
    const showFinalValues = () => setAnimatedNumbers(stats.map(({ number }) => number));
    const animateCounters = () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        showFinalValues();
        return;
      }

      const duration = 900;
      const startTime = performance.now();
      const animate = (currentTime: number) => {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        setAnimatedNumbers(stats.map(({ number }) => Math.floor(number * easedProgress)));

        if (progress < 1) frameId = requestAnimationFrame(animate);
      };

      frameId = requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        animateCounters();
        observer.disconnect();
      }
    }, { threshold: 0.3 });

    observer.observe(statsElement);
    return () => {
      observer.disconnect();
      if (frameId !== undefined) cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div className="overflow-x-hidden">
      <section className="relative min-h-[54rem] overflow-hidden bg-[#080808] px-6 pb-16 pt-36 text-[#f8f8f6] md:min-h-[52rem]">
        <div className="absolute inset-0 opacity-20 brand-grid" />
        <div className="absolute -right-24 -top-40 hidden h-[48rem] w-[48rem] opacity-20 md:block"><BrandMark className="h-full" inverse /></div>
        <div className="relative mx-auto grid max-w-7xl items-end gap-14 lg:grid-cols-[1.1fr_.9fr]">
          <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
            <p className="mb-7 text-xs font-medium uppercase tracking-[0.22em] text-white/55">Vurla / Custom living spaces</p>
            <h1 className="max-w-4xl text-[clamp(3.2rem,7.2vw,7.4rem)] font-semibold leading-[0.92] tracking-[-0.07em]">Vision and uniqueness in real living areas.</h1>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-white/65 md:text-lg">Vurla creates custom furniture, interior solutions, and built environments that bring each client’s vision to life through expert craft and thoughtful design.</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/projects" className="inline-flex items-center gap-2 bg-[#f8f8f6] px-5 py-3 text-sm font-medium !text-black transition hover:!text-black hover:gap-3">Explore selected work <ArrowUpRight size={16} /></Link>
              <Link href="/contact" className="inline-flex items-center gap-2 border border-white/30 px-5 py-3 text-sm font-medium text-white transition hover:border-white hover:bg-white/10">Request an estimate <ArrowRight size={16} /></Link>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15, duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className="relative aspect-[4/5] overflow-hidden border border-white/15 lg:translate-y-20">
            <Image src={featured.image} alt={featured.title} fill priority sizes="(min-width: 1024px) 42vw, 90vw" className="object-cover grayscale contrast-125" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10" />
            <div className="absolute bottom-0 flex w-full items-end justify-between p-6"><div><p className="text-xs uppercase tracking-[0.16em] text-white/55">Featured project</p><p className="mt-1 text-xl font-medium">{featured.title}</p></div><ArrowDownRight className="text-white/75" size={22} /></div>
          </motion.div>
        </div>
      </section>

      <section ref={statsRef} className="border-y border-black/10 bg-[#f8f8f6] px-6 py-24 md:py-32">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-8 gap-y-14 md:grid-cols-4 md:gap-12">
          {stats.map((stat, index) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.45, delay: index * 0.06 }} className="text-center">
              <p aria-label={`${stat.number}${stat.suffix} ${stat.label}`} className="font-serif text-[clamp(3.25rem,5vw,5rem)] font-semibold leading-none tracking-[-0.06em] text-[#858585]"><span aria-hidden="true">{animatedNumbers[index]}{stat.suffix}</span></p>
              <p className="mt-4 text-sm font-medium text-[#080808]">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-[#e9e9e6] px-6 py-24 md:py-36">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-14 max-w-2xl text-center"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Selected projects</p><h2 className="mt-5 text-[clamp(2.7rem,5vw,5rem)] font-semibold leading-[0.95] tracking-[-0.06em] text-[#080808]">Built around real life.</h2><p className="mt-5 text-base leading-relaxed text-neutral-600">Explore work across interiors, landscapes, custom fabrication, and the spaces in between.</p></div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {categoryProjects.map(({ category, label, project }, index) => <motion.article key={category} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.45, delay: index * 0.05 }} className="group overflow-hidden border border-black/20 bg-[#f8f8f6]">
              <Link href={`/projects/${project.slug}`} className="block">
                <div className="flex items-center justify-between border-b border-black/15 px-5 py-4"><p className="font-serif text-2xl font-semibold tracking-[-0.04em] text-[#080808]">{label}</p><ArrowUpRight className="text-[#858585] transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" size={20} /></div>
                <div className="relative aspect-[16/9] overflow-hidden"><Image src={project.image} alt={project.title} fill sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0" /></div>
                <div className="p-5"><h3 className="text-xl font-semibold tracking-[-0.04em] text-[#080808]">{project.title}</h3><p className="mt-2 line-clamp-2 text-sm leading-relaxed text-neutral-600">{project.description}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#080808]">See more <ArrowRight size={16} /></span></div>
              </Link>
            </motion.article>)}
          </div>
          <div className="mt-10 text-center"><Link href="/projects" className="inline-flex items-center gap-2 border border-black/35 px-5 py-3 text-sm font-medium text-[#080808] transition hover:bg-[#080808] hover:text-[#f8f8f6]">View all projects <ArrowRight size={16} /></Link></div>
        </div>
      </section>

      <section className="bg-[#080808] px-6 py-28 text-[#f8f8f6] md:py-40">
        <div className="mx-auto max-w-7xl"><div className="mx-auto mb-14 max-w-2xl text-center"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">What we do</p><h2 className="mt-5 text-[clamp(2.7rem,5vw,5rem)] font-semibold leading-[0.95] tracking-[-0.06em]">Our services</h2><p className="mt-5 text-base leading-relaxed text-white/65">Comprehensive design and construction services tailored to your vision.</p></div>
          <div className="grid gap-px bg-white/20 md:grid-cols-2">
            {services.map((service, index) => {
              const detail = serviceDetails[index];
              const serviceAnchor = service.title.toLowerCase().replace(/\s+/g, "-");

              return (
                <motion.article key={service.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.45, delay: index * 0.05 }} className="group bg-[#080808] p-6 md:p-8">
                  <div className="flex items-start justify-between gap-5">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center border border-white/25 text-white"><ServiceIcon name={service.icon} className="h-5 w-5" /></span>
                      <div>
                        <h3 className="text-2xl font-semibold tracking-[-0.04em]">{service.title}</h3>
                        <p className="mt-1 text-sm text-white/55">{detail.headline}</p>
                      </div>
                    </div>
                    <span className="shrink-0 text-xs uppercase tracking-[0.14em] text-white/45">{detail.projectCount} projects</span>
                  </div>
                  <ul className="mt-8 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                    {service.subItems.map((item) => (
                      <li key={item.name} className="flex items-center gap-2 text-sm text-white/70"><ServiceIcon name={item.icon} className="h-3.5 w-3.5 shrink-0 text-white/45" />{item.name}</li>
                    ))}
                  </ul>
                  <Link href={`/services#${serviceAnchor}`} className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-white transition group-hover:gap-3">Learn more <ArrowRight size={16} /></Link>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#858585] px-6 py-28 md:py-40"><div className="absolute right-0 top-0 h-full w-1/2 opacity-10"><BrandMark className="h-full" /></div><div className="relative mx-auto max-w-6xl text-center"><h2 className="mx-auto max-w-5xl text-[clamp(3rem,6vw,6.2rem)] font-semibold leading-[0.93] tracking-[-0.07em] text-[#080808]">Bring the next idea into focus.</h2><Link href="/contact" className="mt-10 inline-flex items-center gap-2 border border-black/45 px-5 py-3 text-sm font-medium text-black transition hover:bg-black hover:text-white">Tell us what is taking shape <ArrowRight size={16} /></Link></div></section>
    </div>
  );
}
