import type { FaqItem, SiteConfig } from "@/content/contracts";

export const siteConfig: SiteConfig = {
  navigation: [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects" },
    { href: "/services", label: "Services" },
    { href: "/contact", label: "Contact" },
  ],
  email: "vurla.living@gmail.com",
  phone: "(626) 466-5346",
  address: ["La Puente, CA"],
  hours: [],
  socialLinks: [{ label: "Instagram", href: "https://www.instagram.com/vurlaliving1111/" }],
};

export const faqItems: FaqItem[] = [
  { question: "What types of projects does Vurla handle?", answer: "We specialize in residential, commercial, public realm, interior design, fabrication, and digital solutions. Our portfolio includes everything from luxury homes and office buildings to public spaces and custom furniture pieces." },
  { question: "How long does a typical project take?", answer: "Project timelines vary based on scope and complexity. Residential projects typically take 6-12 months, commercial projects 12-24 months, and public realm projects can take 18-36 months. We provide detailed timelines during the initial consultation." },
  { question: "What is your design process?", answer: "Our process begins with discovery and concept development, followed by schematic design, design development, construction documents, and project management. We maintain close communication with clients throughout each phase to ensure their vision is realized." },
  { question: "Do you work with sustainable design principles?", answer: "Absolutely. Sustainability is core to our practice. We incorporate energy-efficient systems, sustainable materials, and environmentally conscious design strategies to create buildings that minimize environmental impact while maximizing performance." },
  { question: "Can you help with permit applications?", answer: "Yes, we handle all aspects of the permitting process, including preparing and submitting permit applications, coordinating with local authorities, and ensuring compliance with building codes and regulations." },
  { question: "What are your fees and payment structure?", answer: "Our fees are typically structured as a percentage of construction costs or as fixed fees for specific services. We offer flexible payment schedules and provide detailed proposals upfront. Contact us for a personalized quote based on your project needs." },
  { question: "Do you offer 3D visualization services?", answer: "Yes, we provide comprehensive 3D visualization including photorealistic renderings, virtual reality walkthroughs, and interactive presentations to help you visualize your project before construction begins." },
  { question: "How do you handle project changes or revisions?", answer: "We understand that projects evolve. We have a structured process for handling changes that includes impact assessment, cost analysis, and timeline adjustments. We maintain clear communication throughout any modifications." },
];
