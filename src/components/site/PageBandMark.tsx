import { cn } from "@/lib/utils";

/** The same decorative register in every service and project lead band. */
export function PageBandMark({ className }: { className?: string }) {
  return <span className={cn("page-band-mark", className)} aria-hidden="true" />;
}
