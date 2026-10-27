import { cn } from "@/lib/utils";

/* A full-bleed technical rail for inner pages. Geometry comes from the shared
   technical rail (technical-rail.css); `page-family.css` sets its colours, the
   shell fractions its marks sit on and the paper hairline that breaks around
   them, as on the homepage service rows. */
export function PageRail({ className }: { className?: string }) {
  return (
    <div className={cn("page-rail tech-rail", className)} aria-hidden="true">
      <span className="tech-rail-bar" />
      <i className="trm trm-tick trm-tick-a" />
      <i className="trm trm-notch trm-notch-a" />
      <i className="trm trm-chip" />
      <i className="trm trm-tick trm-tick-b" />
    </div>
  );
}
