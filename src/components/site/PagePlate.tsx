import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { GrainTexture } from "./GrainTexture";
import { DotTexture } from "./DotTexture";
import { SectionRail } from "./SectionRail";
import { PageBandMark } from "./PageBandMark";
import { ScrollCrosshair } from "./ScrollCrosshair";

/* The inner-page opening plate. It restates the homepage chapter heading: an
   indexed mineral rail, a dotted night field carrying the headline, and a paper
   subdivision for the lead copy. The index is decorative; the kicker stays text. */
export function PagePlate({
  index,
  kicker,
  title,
  lead,
  level = 1,
  size = level === 2 ? "section" : "page",
  headingId,
  className,
  crosshair = false,
}: {
  index: string;
  kicker: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  level?: 1 | 2;
  /** Visual scale is independent of the semantic heading level. */
  size?: "page" | "section";
  headingId?: string;
  className?: string;
  crosshair?: boolean;
}) {
  const Heading = level === 1 ? "h1" : "h2";
  return (
    <header className={cn("page-plate shell", size === "section" && "page-plate--section", className)}>
      <SectionRail index={index} label={kicker} className="page-plate-rail" indexClassName="page-plate-index" labelClassName="page-plate-kicker">
        <DotTexture />
        <GrainTexture className="page-plate-rail-grain" />
      </SectionRail>
      <div className="page-plate-body">
        <div className={cn("page-plate-field", crosshair && "page-plate-field--crosshair")}>
          <DotTexture />
          <GrainTexture className="page-plate-grain" />
          <Heading className="page-plate-title" id={headingId}>{title}</Heading>
          {crosshair && <ScrollCrosshair />}
        </div>
        {lead && (
          <div className="page-plate-band">
            <p>{lead}</p>
            <PageBandMark />
          </div>
        )}
      </div>
    </header>
  );
}
