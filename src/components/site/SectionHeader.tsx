import type { ReactNode } from "react";

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="section-header">
      <div className="section-header-side">
        <p className="kicker">{eyebrow}</p>
        {action}
      </div>
      <div className="section-header-main">
        <h2 className="section-title">{title}</h2>
        {description && <p>{description}</p>}
      </div>
    </div>
  );
}
