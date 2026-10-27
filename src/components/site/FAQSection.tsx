import type { FaqItem } from "@/content/contracts";
import { Accordion } from "@/components/ui/controls";
import { PagePlate } from "./PagePlate";
export function FAQSection({
  items,
}: {
  items: FaqItem[];
}) {
  return (
    <section className="faq-section" aria-labelledby="faq-heading">
      <div className="faq-intro">
        <PagePlate
          level={2}
          size="page"
          crosshair
          className="page-plate--roomy"
          index="Q/A"
          headingId="faq-heading"
          kicker="Your questions"
          title="Clarity before we begin"
          lead="Find answers to common questions about our services, process, and what to expect when working with Vurla."
        />
      </div>
      <div className="faq-list shell">
        {items.map((faq, index) => (
          <Accordion
            key={faq.question}
            title={
              <>
                <span className="faq-index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="faq-question">{faq.question}</span>
                <span className="faq-toggle" aria-hidden="true" />
              </>
            }
          >
            <p>{faq.answer}</p>
          </Accordion>
        ))}
      </div>
    </section>
  );
}
