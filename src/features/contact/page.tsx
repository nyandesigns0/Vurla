import { getSiteConfig, listFaqItems } from "@/content/server";
import { ContactPageClient } from "./contact-page-client";
export default function ContactPage() { return <ContactPageClient site={getSiteConfig()} faqs={listFaqItems()} />; }
