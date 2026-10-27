"use client";
import { type FormEvent, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import { FAQSection } from "@/components/site/FAQSection";
import { ClosingChapter } from "@/components/site/ClosingChapter";
import { PagePlate } from "@/components/site/PagePlate";
import { PageSideBorders } from "@/components/site/PageSideBorders";
import { DotTexture } from "@/components/site/DotTexture";
import { GrainTexture } from "@/components/site/GrainTexture";
import { ChapterScrollBar } from "@/components/site/ChapterScrollBar";
import { Button } from "@/components/ui/button";
import { ActionLink } from "@/components/ui/ActionLink";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/controls";
import { MessageAttachments } from "./message-attachments";
import type { ContactResponse, ContactType } from "./contract";
import type { FaqItem, SiteConfig } from "@/content/contracts";
export function ContactPageClient({
  site,
  faqs,
}: {
  site: SiteConfig;
  faqs: FaqItem[];
}) {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [contactType, setContactType] = useState<ContactType>("email");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [contactValues, setContactValues] = useState({ email: "", phone: "" });
  const [images, setImages] = useState<File[]>([]);
  const [attachmentReset, setAttachmentReset] = useState(0);
  const contactKey = contactType === "email" ? "email" : "phone";
  const outgoingRef = useRef<HTMLDivElement>(null);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    const formElement = e.currentTarget;
    const form = new FormData(formElement);
    const payload = {
      name: String(form.get("name") || ""),
      contactType: String(form.get("contactType") || ""),
      contact: String(form.get("contact") || ""),
      message: String(form.get("message") || ""),
    };
    // Validation is needed only on submission; keep Zod out of the initial page bundle.
    setLoading(true);
    const validation = await import("./contract").catch(() => null);
    if (!validation) {
      setStatus("Unable to validate the message. Please try again.");
      setLoading(false);
      return;
    }
    const result = validation.contactRequestSchema.safeParse(payload);
    if (!result.success) {
      setLoading(false);
      const next: Record<string, string> = {};
      for (const issue of result.error.issues)
        next[String(issue.path[0])] = issue.message;
      setErrors(next);
      setStatus(
        "Please check the highlighted fields.",
      );
      formElement
        .querySelector<HTMLInputElement>(
          '[name="' + Object.keys(next)[0] + '"]',
        )
        ?.focus();
      return;
    }
    setErrors({});
    setStatus(null);
    try {
      const submission = new FormData();
      for (const [key, value] of Object.entries(result.data)) submission.append(key, value);
      for (const image of images) submission.append("images", image);
      const res = await fetch("/api/contact", {
        method: "POST",
        body: submission,
      });
      const data = (await res.json()) as ContactResponse;
      const succeeded = res.ok && data.success;
      setStatus(
        data.message ||
          (succeeded
            ? "Submitted for simulated processing."
            : "Submission failed"),
      );
      if (succeeded) {
        formElement.reset();
        setName("");
        setMessage("");
        setContactType("email");
        setContactValues({ email: "", phone: "" });
        setImages([]);
        setAttachmentReset((value) => value + 1);
      }
    } catch {
      setStatus("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="page page-family contact-page">
      <div ref={outgoingRef} className="closing-chapter-source">
        <GrainTexture className="contact-background-grain" />
        <PageSideBorders className="contact-source-sides" />
        <div className="contact-opening-frame">
          <PagePlate
            index="04"
            kicker="Get in touch"
            title="Let’s shape what’s next"
            crosshair
            className="page-plate--roomy"
            lead={
              <>
                Ready to discuss your next project? We&apos;d love to hear from you.
                Reach out to our team and let&apos;s create something extraordinary
                together.
              </>
            }
          />
        </div>
        <section className="shell contact-columns" aria-label="Contact Vurla">
          <div className="contact-information">
            <DotTexture />
            <GrainTexture className="contact-information-grain" />
            <div className="contact-information-body">
            <h2 className="contact-panel-title">Contact Information</h2>
            <dl>
              <div>
                <dt>
                  <MapPin className="contact-detail-icon" aria-hidden="true" />
                  Address
                </dt>
                <dd>
                  <a
                    className="contact-map-link"
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.address.join(", "))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${site.address.join(", ")} on Google Maps (opens in a new tab)`}
                  >
                    <span>{site.address.join(", ")}</span>
                    <ArrowUpRight size={20} aria-hidden="true" />
                  </a>
                </dd>
              </div>
              <div>
                <dt>
                  <Phone className="contact-detail-icon" aria-hidden="true" />
                  Phone
                </dt>
                <dd>
                  <a href={"tel:" + site.phone.replace(/[^+\d]/g, "")}>
                    <span>{site.phone}</span><ArrowUpRight size={20} aria-hidden="true" />
                  </a>
                </dd>
              </div>
              <div>
                <dt>
                  <Mail className="contact-detail-icon" aria-hidden="true" />
                  Email
                </dt>
                <dd>
                  <a href={"mailto:" + site.email}><span>{site.email}</span><ArrowUpRight size={20} aria-hidden="true" /></a>
                </dd>
              </div>
              {site.hours.length > 0 && (
                <div>
                  <dt>
                    <Clock className="contact-detail-icon" aria-hidden="true" />
                    Office Hours
                  </dt>
                  <dd>
                    {site.hours.map((h) => (
                      <p key={h}>{h}</p>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
            </div>
          </div>
          <div id="contact-form" className="contact-form-panel" data-surface="paper" tabIndex={-1}>
            <div className="contact-form-heading">
              <span className="contact-form-heading-mark" aria-hidden="true"><ArrowDownRightMark /></span>
              <div>
            <h2 className="contact-panel-title">Send us a Message</h2>
                <p>Tell us about the space you have in mind.</p>
              </div>
            </div>
            <noscript>
              <p>The form preview needs JavaScript. Please use the email or phone links to contact us.</p>
              <style>{".contact-form-panel form { display: none; }"}</style>
            </noscript>
            <form onSubmit={submit} onChange={() => { if (status) setStatus(null); }} noValidate aria-busy={loading}>
              <Field label="Name *" htmlFor="contact-name">
                <Input
                  id="contact-name"
                  name="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  autoComplete="name"
                  required
                  placeholder="Your full name"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "error-name" : undefined}
                />
                {errors.name && (
                  <span className="field-error" id="error-name">
                    {errors.name}
                  </span>
                )}
              </Field>
              <Field label="Best way to contact *" htmlFor="contact-type">
                <Select
                  id="contact-type"
                  name="contactType"
                  required
                  value={contactType}
                  onChange={(event) => {
                    setContactType(event.target.value as ContactType);
                    setErrors((current) => ({ ...current, contact: "" }));
                  }}
                >
                  <option value="email">Email</option>
                  <option value="phone">Phone call</option>
                  <option value="sms">Text message</option>
                </Select>
              </Field>
              <Field label={contactType === "email" ? "Email address *" : "Phone number *"} htmlFor="contact-value">
                <Input
                  id="contact-value"
                  name="contact"
                  type={contactType === "email" ? "email" : "tel"}
                  autoComplete={contactType === "email" ? "email" : "tel"}
                  required
                  placeholder={contactType === "email" ? "your@email.com" : "+1 (555) 123-4567"}
                  value={contactValues[contactKey]}
                  onChange={(event) => setContactValues((current) => ({ ...current, [contactKey]: event.target.value }))}
                  aria-invalid={!!errors.contact}
                  aria-describedby={errors.contact ? "error-contact" : undefined}
                />
                {errors.contact && (
                  <span className="field-error" id="error-contact">
                    {errors.contact}
                  </span>
                )}
              </Field>
              <Field label="Message *" htmlFor="contact-message">
                <Textarea
                  id="contact-message"
                  name="message"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  rows={5}
                  required
                  placeholder="What are you planning? Tell us about the space, location, and timing."
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? "error-message" : undefined}
                />
                {errors.message && (
                  <span className="field-error" id="error-message">
                    {errors.message}
                  </span>
                )}
              <MessageAttachments key={attachmentReset} files={images} onChange={setImages} disabled={loading} />
              </Field>
              <div className="contact-form-submit">
                <Button type="submit" disabled={loading}>
                  {loading ? "Submitting..." : "Submit preview"} <ArrowUpRight size={24} aria-hidden="true" />
                </Button>
              </div>
              <div role="status" aria-live="polite">
                {status && <p className="form-status">{status}</p>}
              </div>
            </form>
          </div>
        </section>
        <FAQSection items={faqs} />
        <ChapterScrollBar />
      </div>
      <ClosingChapter
        outgoingRef={outgoingRef}
        headingId="contact-closing-heading"
        title={<>Let&apos;s Build <span>Your Vision</span></>}
        body={
          <>
            Whether you have a detailed project scope or just an idea, we&apos;re
            here to help bring it to life. Contact us today to get started.
          </>
        }
        actions={
          <>
            <ActionLink href="/services">
              Explore Our Services <ArrowRight size={16} aria-hidden="true" />
            </ActionLink>
            <ActionLink href="/projects" variant="outline">
              View Our Projects
            </ActionLink>
          </>
        }
      />
    </div>
  );
}

function ArrowDownRightMark() {
  return <svg viewBox="0 0 48 48" fill="none" focusable="false"><path d="M9 9 39 39M12 39h27V12" stroke="currentColor" strokeWidth="2" /></svg>;
}
