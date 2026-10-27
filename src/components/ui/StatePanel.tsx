import type { ReactNode } from "react";
export function StatePanel({
  title,
  description,
  children,
  level = 2,
}: {
  title: string;
  description: string;
  children: ReactNode;
  level?: 1 | 2 | 3;
}) {
  const Heading = level === 1 ? "h1" : level === 2 ? "h2" : "h3";
  return (
    <div className="state-panel">
      <Heading className="section-title">{title}</Heading>
      <p>{description}</p>
      <div className="actions">{children}</div>
    </div>
  );
}
