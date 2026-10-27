"use client";

import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ActionLink } from "@/components/ui/ActionLink";
import { ChapterScrollBar } from "@/components/site/ChapterScrollBar";
import type { Service } from "@/content/contracts";
import { ServiceSheet } from "./service-sheet";
import { ClosingChapter } from "@/components/site/ClosingChapter";
import { GrainTexture } from "@/components/site/GrainTexture";
import { PagePlate } from "@/components/site/PagePlate";
import { PageSideBorders } from "@/components/site/PageSideBorders";
import { PageBandMark } from "@/components/site/PageBandMark";

export function ServicesPageClient({ services }: { services: Service[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const indexRef = useRef<HTMLElement>(null);
  const browserRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const updateActiveSection = () => {
      frame = 0;
      const focusY = window.innerHeight / 2;
      let centeredIndex: number | null = null;

      services.some((service, index) => {
        const bounds = document.getElementById(service.id)?.getBoundingClientRect();
        if (bounds && bounds.top <= focusY && bounds.bottom >= focusY) {
          centeredIndex = index;
          return true;
        }
        return false;
      });

      setActiveIndex(previous => previous === centeredIndex ? previous : centeredIndex);
    };
    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateActiveSection);
    };

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.cancelAnimationFrame(frame);
    };
  }, [services]);

  useEffect(() => {
    const index = indexRef.current;
    const activeLink = activeIndex === null ? null : index?.querySelectorAll("a")[activeIndex];
    if (!index || !activeLink || typeof index.scrollTo !== "function") return;
    index.scrollTo({
      left: activeLink.offsetLeft + activeLink.offsetWidth / 2 - index.clientWidth / 2,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  }, [activeIndex]);


  return (
    <div className="page page-family services-page">
      <GrainTexture className="services-page-grain" />
      <div className="services-lined-content">
        <div className="services-opening-frame">
          <PagePlate
            index="02"
            kicker="What we do"
            title="Designing spaces with purpose"
            crosshair
          />
          <PageSideBorders className="services-side-dividers" />
        </div>
        <div ref={browserRef} className="service-browser closing-chapter-source">
        <nav ref={indexRef} className="service-index shell" aria-label="Service index">
          <ol style={{ "--service-active-index": activeIndex ?? -1 } as CSSProperties}>
            {services.map((service, index) => (
              <li key={service.id}>
                <a
                  href={`#${service.id}`}
                  aria-current={activeIndex === index ? "location" : undefined}
                  onClick={() => setActiveIndex(index)}
                >
                  <span className="service-index-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  <span className="service-index-title">{service.title}</span>
                  <svg className="service-index-arrow" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M6 6 18 18M18 8v10H8" />
                  </svg>
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="service-catalog-intro shell">
          <GrainTexture className="service-catalog-intro-grain" />
          <p>From first ideas to final installation, Vurla brings every part of the design process together.</p>
          <PageBandMark />
        </div>
        <section className="service-catalog" aria-label="Our six services">
        {services.map((service, index) => (
          <ServiceSheet key={service.id} service={service} index={index} active={activeIndex === index} />
        ))}
        </section>
        <ChapterScrollBar />
        <PageSideBorders className="services-side-dividers services-side-dividers--catalog" />
        </div>
      </div>
      <ClosingChapter
        outgoingRef={browserRef}
        headingId="services-closing-heading"
        title={<>Have a project <span>in mind?</span></>}
        body={<>Tell us about your vision and we&apos;ll help find the right way forward.</>}
        actions={
          <ActionLink href="/contact">
            Start a conversation <ArrowRight size={16} />
          </ActionLink>
        }
      />
    </div>
  );
}
