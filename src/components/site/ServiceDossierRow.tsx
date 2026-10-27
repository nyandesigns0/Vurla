import Link from "next/link";
import Image from "next/image";
import type { ServiceDossierRecord } from "@/content/contracts";
import { CapabilityIcon } from "./CapabilityIcon";

/* The rail uses the footer's shared technical geometry and sizes, with the
   service-specific marks and colours set by `service-dossier.css`. */
function DossierRail() {
  return (
    <div className="dossier-rail tech-rail" aria-hidden="true">
      <span className="tech-rail-bar" />
      <i className="trm trm-tick trm-tick-a" />
      <i className="trm trm-notch trm-notch-a" />
      <i className="trm trm-tick trm-tick-b" />
      <i className="trm trm-notch trm-notch-b" />
      <i className="trm trm-chip" />
    </div>
  );
}

export function ServiceDossierRow({ service }: { service: ServiceDossierRecord }) {
  const index = String(service.index).padStart(2, "0");
  return (
    <article className="service-dossier" id={`home-${service.id}`}>
      <DossierRail />
      <div className="dossier-frame shell">
        <div className="dossier-identity">
          <h3 className="dossier-title">
            <Link className="dossier-title-link footer-scan-link" href={service.href}>
              <span className="dossier-title-label footer-scan-base">{service.title}</span>
              <span className="dossier-title-scan footer-scan-layer" aria-hidden="true">
                <span className="footer-scan-band footer-scan-band-1">{service.title}</span>
                <span className="footer-scan-band footer-scan-band-2">{service.title}</span>
                <span className="footer-scan-band footer-scan-band-3">{service.title}</span>
              </span>
            </Link>
          </h3>
          <p className="dossier-subtitle">{service.subtitle}</p>
        </div>
        <Link className="dossier-statement" href={service.href} aria-label="View full service">
          <span className="dossier-statement-viewport">
            {(["rest", "active"] as const).map((face) => (
              <span className={`dossier-statement-face dossier-statement-face--${face}`} key={face} aria-hidden={face === "active" ? true : undefined}>
                <span className="dossier-statement-media" aria-hidden="true">
                  <Image src={service.imageSrc} alt="" fill sizes="(min-width: 1024px) 300px, 100vw" />
                </span>
                <span className="dossier-numeral" aria-hidden="true">{index}</span>
                <span className="dossier-cta">
                  View full service
                  <svg
                    className="dossier-cta-arrow"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d="M5 19 19 5M8 5h11v11" />
                  </svg>
                </span>
              </span>
            ))}
          </span>
        </Link>
        <ul className="dossier-capabilities" aria-label={`${service.title} capabilities`}>
          {service.capabilities.map((capability) => (
            <li className="dossier-capability" key={capability.id}>
              <Link className="dossier-capability-link footer-scan-link" href={service.href}>
                <CapabilityIcon id={capability.iconId} className="dossier-capability-icon" />
                <span className="dossier-capability-copy">
                  <span className="dossier-capability-label footer-scan-base">{capability.label}</span>
                  <span className="dossier-capability-scan footer-scan-layer" aria-hidden="true">
                    <span className="footer-scan-band footer-scan-band-1">{capability.label}</span>
                    <span className="footer-scan-band footer-scan-band-2">{capability.label}</span>
                    <span className="footer-scan-band footer-scan-band-3">{capability.label}</span>
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
