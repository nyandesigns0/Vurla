import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Service } from "@/content/contracts";
import { ServiceIcon } from "@/components/site/ServiceIcon";

export function ServiceCard({
  service,
  index,
  summary,
}: {
  service: Service;
  index: number;
  summary: string;
}) {
  const serviceHref = `/services#${service.id}`;
  const number = String(index + 1).padStart(2, "0");

  return (
    <article className="service-card">
      <div className="service-card-overview">
        <div className="service-card-heading">
          <h3>{service.title}</h3>
        </div>
        <Link className="service-card-action" href={serviceHref}>
          Explore service <ArrowRight size={16} />
        </Link>
      </div>
      <Link
        className="service-card-index"
        href={serviceHref}
        aria-label={`Explore ${service.title}`}
      >
        <i className="service-card-mark service-card-mark--top-left" aria-hidden="true" />
        <i className="service-card-mark service-card-mark--top-right" aria-hidden="true" />
        <i className="service-card-mark service-card-mark--bottom-left" aria-hidden="true" />
        <i className="service-card-mark service-card-mark--bottom-right" aria-hidden="true" />
        <span>{number}</span>
        <p>{summary}</p>
      </Link>
      <ul className="service-card-items">
        {service.subItems.map((item) => (
          <li key={item.name}>
            <Link href={serviceHref}>
              <ServiceIcon name={item.icon} className="h-4 w-4" />
              <span>{item.name}</span>
              <ArrowRight className="service-item-arrow" size={14} />
            </Link>
          </li>
        ))}
      </ul>
    </article>
  );
}
