import Link from "next/link";
import { getSiteConfig, listServices } from "@/content/server";
import { ActionLink } from "@/components/ui/ActionLink";
import { GrainTexture } from "./GrainTexture";

type ContactIconType = "email" | "instagram" | "facebook";

function ContactIcon({ type, className }: { type: ContactIconType; className?: string }) {
  if (type === "email") {
    return <svg className={className} viewBox="0 0 32 24" aria-hidden="true" focusable="false"><rect x="1" y="1" width="30" height="22" /><path d="M2 2.5 16 14 30 2.5" /></svg>;
  }
  if (type === "instagram") {
    return <svg className={className} viewBox="0 0 32 32" aria-hidden="true" focusable="false"><rect x="1" y="1" width="30" height="30" rx="8" /><circle cx="16" cy="16" r="7" /><circle cx="24.5" cy="7.5" r="1.4" className="footer-icon-dot" /></svg>;
  }
  return <svg className={className} viewBox="0 0 32 32" aria-hidden="true" focusable="false"><circle cx="16" cy="16" r="15" /><path d="M18 31V18h4l1-5h-5v-3c0-1.7.7-2.5 2.7-2.5H23V3.3c-1-.2-2.3-.3-3.8-.3-4 0-6.7 2.5-6.7 7v3h-4v5h4v13" /></svg>;
}

function FooterContactIcon({ type }: { type: ContactIconType }) {
  return (
    <span className="footer-contact-icon" aria-hidden="true">
      <ContactIcon type={type} className="footer-contact-icon-base footer-scan-base" />
      <span className="footer-contact-icon-scan footer-scan-layer" aria-hidden="true">
        <span className="footer-scan-band footer-scan-band-1"><ContactIcon type={type} /></span>
        <span className="footer-scan-band footer-scan-band-2"><ContactIcon type={type} /></span>
        <span className="footer-scan-band footer-scan-band-3"><ContactIcon type={type} /></span>
      </span>
    </span>
  );
}

function NorthEastArrow({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <path d="M11 37 37 11M19 11h18v18" />
    </svg>
  );
}

function FooterScanArrow() {
  return (
    <span className="footer-inline-arrow-wrap" aria-hidden="true">
      <NorthEastArrow className="footer-inline-arrow footer-scan-base" />
      <span className="footer-inline-arrow-scan footer-scan-layer" aria-hidden="true">
        <span className="footer-scan-band footer-scan-band-1"><NorthEastArrow className="footer-inline-arrow" /></span>
        <span className="footer-scan-band footer-scan-band-2"><NorthEastArrow className="footer-inline-arrow" /></span>
        <span className="footer-scan-band footer-scan-band-3"><NorthEastArrow className="footer-inline-arrow" /></span>
      </span>
    </span>
  );
}

function HeavyArrow({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <path d="M7 41 41 7M15 7h26v26" />
    </svg>
  );
}

function SignalIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <path d="M24 5v10M24 33v10M5 24h10M33 24h10" />
      <path d="m24 15 9 9-9 9-9-9 9-9Z" />
    </svg>
  );
}

function FooterScanLabel({ label }: { label: string }) {
  return (
    <span className="footer-contact-copy">
      <span className="footer-contact-label footer-scan-base">{label}</span>
      <span className="footer-service-scan footer-contact-scan footer-scan-layer" aria-hidden="true">
        <span className="footer-service-band footer-scan-band footer-scan-band-1">{label}</span>
        <span className="footer-service-band footer-scan-band footer-scan-band-2">{label}</span>
        <span className="footer-service-band footer-scan-band footer-scan-band-3">{label}</span>
      </span>
    </span>
  );
}

export function Footer() {
  const site = getSiteConfig();
  const instagram = site.socialLinks.find((social) => social.label.toLowerCase() === "instagram");
  const facebook = site.socialLinks.find((social) => social.label.toLowerCase() === "facebook");
  return (
    <footer role="contentinfo" className="site-footer refined-footer">
      <div className="footer-rail" aria-hidden="true">
        <span className="footer-rail-bar" />
        <i className="frm frm-red" />
        <i className="frm frm-tick frm-tick-a" />
        <i className="frm frm-notch frm-notch-a" />
        <i className="frm frm-tick frm-tick-b" />
        <i className="frm frm-notch frm-notch-b" />
        <i className="frm frm-chip" />
        <i className="frm frm-blue" />
      </div>
      <div className="footer-refined-grid">
        <div className="footer-identity">
          <Link className="footer-wordmark" href="/#hero" aria-label="Vurla home, top of page">Vurla</Link>
          <p>Custom furniture, interiors, and outdoor spaces made around real life.</p>
        </div>
        <nav aria-label="Services" className="footer-services">
          <h2>Services</h2>
          {listServices().slice(0, 6).map((service) => (
            <Link className="footer-scan-link" href={`/services#${service.id}`} key={service.id}>
              <span className="footer-service-label footer-scan-base">{service.title}</span>
              <span className="footer-service-scan footer-scan-layer" aria-hidden="true">
                <span className="footer-service-band footer-scan-band footer-scan-band-1">{service.title}</span>
                <span className="footer-service-band footer-scan-band footer-scan-band-2">{service.title}</span>
                <span className="footer-service-band footer-scan-band footer-scan-band-3">{service.title}</span>
              </span>
            </Link>
          ))}
        </nav>
        <div className="footer-contact">
          <GrainTexture />
          <h2>Contact</h2>
          <a className="footer-scan-link" href={`mailto:${site.email}`}>
            <FooterContactIcon type="email" />
            <i className="footer-accent footer-accent-red footer-scan-accent" aria-hidden="true" />
            <small>Email</small>
            <strong><FooterScanLabel label={site.email} /></strong>
          </a>
          {instagram && (
            <a className="footer-scan-link" href={instagram.href} target="_blank" rel="noreferrer">
              <FooterContactIcon type="instagram" />
              <i className="footer-accent footer-accent-blue footer-scan-accent" aria-hidden="true" />
              <small>Instagram</small>
              <strong><FooterScanLabel label="View profile" /> <FooterScanArrow /></strong>
            </a>
          )}
          {facebook && (
            <a className="footer-scan-link" href={facebook.href} target="_blank" rel="noreferrer">
              <FooterContactIcon type="facebook" />
              <i className="footer-accent footer-accent-blue footer-scan-accent" aria-hidden="true" />
              <small>Facebook</small>
              <strong><FooterScanLabel label="View page" /> <FooterScanArrow /></strong>
            </a>
          )}
        </div>
        <div className="footer-new-work">
          <GrainTexture />
          <p>New work</p>
          <HeavyArrow className="footer-new-work-arrow" />
          <h2>Bring us in early.<br />We are listening.</h2>
          <ActionLink href="/contact" variant="outline">Start a conversation <SignalIcon className="footer-signal-icon" /></ActionLink>
        </div>
      </div>
      <div className="footer-legal">
        <span>© {new Date().getFullYear()} Vurla. All rights reserved.</span>
        <span className="footer-legal-end"><i aria-hidden="true" /><Link href="/contact">Work with us</Link></span>
      </div>
    </footer>
  );
}
