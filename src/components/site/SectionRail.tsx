import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Shared bottom-anchored chapter rail: index, vertical label, red terminal. */
export function SectionRail({ index, label, className, indexClassName, labelClassName, children }: {
  index: string;
  label: ReactNode;
  className?: string;
  indexClassName?: string;
  labelClassName?: string;
  children?: ReactNode;
}) {
  return <div className={cn("section-rail", className)}>
    {children}
    <span className={cn("section-rail-index", indexClassName)} aria-hidden="true">{index}</span>
    <p className={cn("section-rail-label", labelClassName)}>{label}</p>
    <span className="section-rail-marker" aria-hidden="true" />
  </div>;
}
