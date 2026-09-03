"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import type { Project } from "@/content/contracts";
import { BrandMark } from "@/components/site/BrandMark";

export function HomePageClient({ featured }: { featured: Project[] }) {
  return (
    <div className="overflow-x-hidden">
      <section className="relative min-h-[54rem] overflow-hidden bg-[#080808] px-6 pb-16 pt-36 text-[#f8f8f6] md:min-h-[52rem]">
        <div className="absolute inset-0 opacity-20 brand-grid" />
        <div className="absolute -right-24 -top-40 hidden h-[48rem] w-[48rem] opacity-20 md:block"><BrandMark className="h-full" inverse /></div>
        <div className="relative mx-auto grid max-w-7xl items-end gap-14 lg:grid-cols-[1.1fr_.9fr]">
          <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
            <p className="mb-7 text-xs font-medium uppercase tracking-[0.22em] text-white/55">Vurla / Spatial practice</p>
            <h1 className="max-w-4xl text-[clamp(3.2rem,7.2vw,7.4rem)] font-semibold leading-[0.92] tracking-[-0.07em]">Make space for what matters.</h1>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-white/65 md:text-lg">Vurla shapes architecture, interiors, and objects with a clear idea at their core: places should feel as considered as the lives inside them.</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/projects" className="inline-flex items-center gap-2 bg-[#f8f8f6] px-5 py-3 text-sm font-medium text-[#080808] transition hover:gap-3">Explore selected work <ArrowUpRight size={16} /></Link>
              <Link href="/contact" className="inline-flex items-center gap-2 border border-white/30 px-5 py-3 text-sm font-medium text-white transition hover:border-white hover:bg-white/10">Begin a conversation <ArrowRight size={16} /></Link>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15, duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className="relative aspect-[4/5] overflow-hidden border border-white/15 lg:translate-y-20">
            <Image src={featured[0].image} alt={featured[0].title} fill priority sizes="(min-width: 1024px) 42vw, 90vw" className="object-cover grayscale contrast-125" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10" />
            <div className="absolute bottom-0 flex w-full items-end justify-between p-6"><div><p className="text-xs uppercase tracking-[0.16em] text-white/55">Featured project</p><p className="mt-1 text-xl font-medium">{featured[0].title}</p></div><ArrowDownRight className="text-white/75" size={22} /></div>
          </motion.div>
        </div>
      </section>

      <section className="bg-[#f8f8f6] px-6 py-28 md:py-44">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[.78fr_1.22fr] lg:gap-24"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">A point of view</p><div><h2 className="max-w-5xl text-[clamp(2.8rem,5.4vw,5.6rem)] font-semibold leading-[0.96] tracking-[-0.065em] text-[#080808]">The strongest projects start with an honest question.</h2><p className="mt-8 max-w-2xl text-lg leading-relaxed text-neutral-600">We work across scales and disciplines to find the simple, durable move. Then we follow it all the way through.</p></div></div>
      </section>

      <section className="bg-[#e9e9e6] px-6 py-24 md:py-36">
        <div className="mx-auto max-w-7xl"><div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end"><h2 className="max-w-2xl text-[clamp(2.7rem,5vw,5rem)] font-semibold leading-[0.95] tracking-[-0.06em] text-[#080808]">Selected work, in use.</h2><Link href="/projects" className="inline-flex items-center gap-2 text-sm font-medium text-[#080808] transition hover:gap-3">View all projects <ArrowRight size={16} /></Link></div>
          <div className="grid auto-rows-[12rem] grid-flow-dense grid-cols-1 gap-px bg-neutral-400 md:grid-cols-4">
            {featured.map((project, index) => {
              const span = index < 2 ? "md:col-span-2 md:row-span-2" : index === 2 ? "md:col-span-4" : "md:col-span-2";
              return <Link href={`/projects/${project.slug}`} key={project.slug} className={`group relative overflow-hidden bg-[#080808] ${span}`}><Image src={project.image} alt={project.title} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover grayscale contrast-125 transition duration-700 group-hover:scale-105 group-hover:grayscale-0" /><div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/0 to-black/10" /><div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 text-white"><div><p className="text-[0.65rem] font-medium uppercase tracking-[0.16em] text-white/55">{project.category}</p><p className="mt-1 text-lg font-medium">{project.title}</p></div><ArrowUpRight className="translate-y-2 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100" size={18} /></div></Link>;
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#080808] px-6 py-28 text-[#f8f8f6] md:py-44">
        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[.9fr_1.1fr]"><div className="lg:sticky lg:top-32 lg:self-start"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">What we bring</p><h2 className="mt-7 max-w-xl text-[clamp(3rem,5.4vw,5.7rem)] font-semibold leading-[0.93] tracking-[-0.065em]">Curiosity, craft, and a little resolve.</h2></div><div className="divide-y divide-white/15 border-y border-white/15">{["Architecture", "Interiors", "Public realm", "Objects and fabrication"].map((service, index) => <motion.div key={service} initial={{ opacity: 0.25, x: 18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.5, delay: index * 0.06 }} className="group flex items-center justify-between py-7 md:py-9"><span className="text-2xl font-medium tracking-[-0.04em] md:text-3xl">{service}</span><ArrowUpRight className="text-white/40 transition group-hover:text-white" size={22} /></motion.div>)}</div></div>
      </section>

      <section className="relative overflow-hidden bg-[#858585] px-6 py-28 md:py-40"><div className="absolute right-0 top-0 h-full w-1/2 opacity-10"><BrandMark className="h-full" /></div><div className="relative mx-auto max-w-6xl text-center"><h2 className="mx-auto max-w-5xl text-[clamp(3rem,6vw,6.2rem)] font-semibold leading-[0.93] tracking-[-0.07em] text-[#080808]">Bring the next idea into focus.</h2><Link href="/contact" className="mt-10 inline-flex items-center gap-2 border border-black/45 px-5 py-3 text-sm font-medium text-black transition hover:bg-black hover:text-white">Tell us what is taking shape <ArrowRight size={16} /></Link></div></section>
    </div>
  );
}
