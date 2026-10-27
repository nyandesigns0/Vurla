"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { StatisticMetric } from "@/content/contracts";
import { Divider } from "@/components/ui/Divider";
import { ScrollCue } from "@/components/ui/ScrollCue";

const iconSources = {
  plan: "/icons/statistics/projects-generated-r2.svg",
  axis: "/icons/statistics/experience-generated-r2.svg",
  award: "/icons/statistics/awards-generated-r2.svg",
  signal: "/icons/statistics/satisfaction-generated-r2.svg",
} satisfies Record<StatisticMetric["iconId"], string>;

const COUNT_DURATION_MS = 800; // Matches --ds-motion-statistics-boot.

export function StatisticsBar({ metrics }: { metrics: StatisticMetric[] }) {
  const ref = useRef<HTMLElement>(null);
  const [countProgress, setCountProgress] = useState(1);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches || typeof IntersectionObserver === "undefined") return;
    let frame = 0;
    let disposed = false;
    let played = false;
    node.dataset.boot = "armed";
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || played || reducedMotion.matches) return;
      played = true;
      node.classList.add("is-booted");
      delete node.dataset.boot;
      setCountProgress(0);
      let startedAt: number | null = null;
      const tick = (now: number) => {
        if (disposed || reducedMotion.matches) return;
        startedAt ??= now;
        const elapsed = Math.min((now - startedAt) / COUNT_DURATION_MS, 1);
        setCountProgress(1 - (1 - elapsed) ** 3);
        if (elapsed < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
      observer.disconnect();
    }, { threshold: .35 });
    observer.observe(node);
    const stopForReducedMotion = () => {
      if (!reducedMotion.matches) return;
      played = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      delete node.dataset.boot;
      setCountProgress(1);
    };
    reducedMotion.addEventListener("change", stopForReducedMotion);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      reducedMotion.removeEventListener("change", stopForReducedMotion);
      delete node.dataset.boot;
    };
  }, []);
  return (
    <section ref={ref} className="statistics-bar" aria-label="Practice statistics" tabIndex={0}>
      <div className="shell statistics-bar-inner">
        <p className="statistics-scroll-cue">
          <span className="statistics-scroll-hatch statistics-scroll-hatch--blue" aria-hidden="true"><i className="statistic-hatch" /></span>
          <ScrollCue />
          <span className="statistics-scroll-hatch statistics-scroll-hatch--red" aria-hidden="true"><i className="statistic-hatch" /></span>
        </p>
        <div className="statistics-rail" aria-hidden="true">
          <span className="statistics-rail-beam" />
          <span className="statistics-rail-notch statistics-rail-notch--q1" />
          <span className="statistics-rail-notch statistics-rail-notch--q2" />
          <span className="statistics-rail-notch statistics-rail-notch--q3" />
        </div>
        <div className="statistics-column-dividers" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((position) => (
            <Divider
              orientation="vertical"
              className={`statistics-column-divider statistics-column-divider--${position}`}
              key={position}
            />
          ))}
        </div>
        <div className="statistics-grid">
          {metrics.map((metric, index) => (
            <div className="statistic" key={metric.id}>
              {index === 2 ? <Divider className="statistic-row-divider" /> : null}
              <div className="statistic-value-row">
                <p className="statistic-value" data-len={`${metric.value}${metric.suffix}`.length} aria-label={`${metric.value}${metric.suffix}`}><span aria-hidden="true">{Math.round(metric.value * countProgress)}{metric.suffix}</span></p>
                <span className="statistic-icon-frame" aria-hidden="true">
                  <Image src={iconSources[metric.iconId]} alt="" width={50} height={50} unoptimized />
                </span>
              </div>
              <p className="statistic-label">{metric.label}</p>
              <span className="statistic-rule" aria-hidden="true"><i className="statistic-hatch" /></span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
