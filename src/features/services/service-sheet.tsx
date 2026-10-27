"use client";

import Image from "next/image";
import type { Service } from "@/content/contracts";
import { CapabilityIcon } from "@/components/site/CapabilityIcon";
import { GrainTexture } from "@/components/site/GrainTexture";
import { useServicePreview } from "./use-service-preview";

export function ServiceSheet({ service, index, active }: { service: Service; index: number; active: boolean }) {
  const { ref, selected, view, enabled } = useServicePreview(service);
  const number = String(index + 1).padStart(2, "0");
  const sizes = "(min-width: 1280px) 750px, (min-width: 1024px) 58vw, 100vw";
  return (
    <article ref={ref} id={service.id} className="service-sheet"
      data-align={index % 2 ? "end" : "start"} data-active={active ? "true" : undefined}
      data-preview-enabled={enabled || undefined} data-preview-selected={selected !== null || undefined}>
      <div className="service-sheet-frame shell">
        <GrainTexture className="service-sheet-grain" />
        <div className="service-sheet-media" id={`${service.id}-preview`}>
          {enabled ? (
            <div key={view.revision} className="service-preview-stage" data-direction={view.direction} data-changing={!!view.previous || undefined}>
              {view.previous ? (
                <div className="service-preview-layer service-preview-layer--previous" aria-hidden="true">
                  <Image unoptimized src={view.previous.src} alt="" width={view.previous.width} height={view.previous.height} sizes={sizes} />
                </div>
              ) : null}
              <div className="service-preview-layer service-preview-layer--current">
                <Image unoptimized src={view.image.src} alt={view.image.alt} width={view.image.width} height={view.image.height} sizes={sizes} />
              </div>
            </div>
          ) : <Image src={service.image.src} alt={service.image.alt} width={service.image.width} height={service.image.height} sizes={sizes} />}
        </div>
        <div className="service-sheet-identity">
          <span className="service-sheet-number" data-number={number} aria-hidden="true">
            <span className="service-sheet-number-face">{number}</span>
          </span>
          <h2 className="service-sheet-title">{service.title}</h2>
        </div>
        <ul className="service-sheet-register">
          {service.subItems.map((item, itemIndex) => (
            <li key={item.name} className="service-preview-item">
              {item.previewImage ? (
                <a href="#services-closing-heading" className="service-preview-button footer-scan-link"
                  data-service-preview={itemIndex} data-preview-selected={selected === itemIndex}
                  aria-controls={`${service.id}-preview`}>
                  <CapabilityIcon id={item.capabilityIcon} className="service-sheet-icon" />
                  <span className="service-preview-label">
                    <span className="footer-scan-base">{item.name}</span>
                    <span className="service-preview-scan footer-scan-layer" aria-hidden="true">
                      <span className="footer-scan-band footer-scan-band-1">{item.name}</span>
                      <span className="footer-scan-band footer-scan-band-2">{item.name}</span>
                      <span className="footer-scan-band footer-scan-band-3">{item.name}</span>
                    </span>
                  </span>
                </a>
              ) : <a href="#services-closing-heading" className="service-preview-button"><CapabilityIcon id={item.capabilityIcon} className="service-sheet-icon" /><span>{item.name}</span></a>}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
