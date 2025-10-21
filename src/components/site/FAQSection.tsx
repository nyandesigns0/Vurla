"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "What types of projects does Vurla handle?",
    answer: "We specialize in residential, commercial, public realm, interior design, fabrication, and digital solutions. Our portfolio includes everything from luxury homes and office buildings to public spaces and custom furniture pieces."
  },
  {
    question: "How long does a typical project take?",
    answer: "Project timelines vary based on scope and complexity. Residential projects typically take 6-12 months, commercial projects 12-24 months, and public realm projects can take 18-36 months. We provide detailed timelines during the initial consultation."
  },
  {
    question: "What is your design process?",
    answer: "Our process begins with discovery and concept development, followed by schematic design, design development, construction documents, and project management. We maintain close communication with clients throughout each phase to ensure their vision is realized."
  },
  {
    question: "Do you work with sustainable design principles?",
    answer: "Absolutely. Sustainability is core to our practice. We incorporate energy-efficient systems, sustainable materials, and environmentally conscious design strategies to create buildings that minimize environmental impact while maximizing performance."
  },
  {
    question: "Can you help with permit applications?",
    answer: "Yes, we handle all aspects of the permitting process, including preparing and submitting permit applications, coordinating with local authorities, and ensuring compliance with building codes and regulations."
  },
  {
    question: "What are your fees and payment structure?",
    answer: "Our fees are typically structured as a percentage of construction costs or as fixed fees for specific services. We offer flexible payment schedules and provide detailed proposals upfront. Contact us for a personalized quote based on your project needs."
  },
  {
    question: "Do you offer 3D visualization services?",
    answer: "Yes, we provide comprehensive 3D visualization including photorealistic renderings, virtual reality walkthroughs, and interactive presentations to help you visualize your project before construction begins."
  },
  {
    question: "How do you handle project changes or revisions?",
    answer: "We understand that projects evolve. We have a structured process for handling changes that includes impact assessment, cost analysis, and timeline adjustments. We maintain clear communication throughout any modifications."
  }
];

export function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <section className="py-16 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="heading-section mb-6">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Find answers to common questions about our services, process, and what to expect when working with Vurla.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-background border-2 border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300"
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-muted/50 transition-colors duration-300"
                >
                  <h3 className="heading-card-sm pr-4">{faq.question}</h3>
                  <motion.div
                    animate={{ rotate: openItems.includes(index) ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    {openItems.includes(index) ? (
                      <ChevronUp className="w-5 h-5 text-primary" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </motion.div>
                </button>
                
                <AnimatePresence>
                  {openItems.includes(index) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.6, -0.05, 0.01, 0.99] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6">
                        <div className="border-t border-border/50 pt-4">
                          <p className="text-body text-muted-foreground leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16"
        >
          <p className="text-body-lg text-muted-foreground mb-6">
            Still have questions? We'd love to hear from you.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-6 py-3 rounded-full bg-primary text-white hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Contact Us Today
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
