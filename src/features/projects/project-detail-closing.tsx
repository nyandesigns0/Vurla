"use client";

import { useRef, type ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { ChapterScrollBar } from "@/components/site/ChapterScrollBar";
import { ClosingChapter } from "@/components/site/ClosingChapter";
import { GrainTexture } from "@/components/site/GrainTexture";
import { ActionLink } from "@/components/ui/ActionLink";

export function ProjectDetailClosing({ children }: { children: ReactNode }) {
  const outgoingRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div ref={outgoingRef} className="closing-chapter-source project-detail-source">
        {children}
        <div className="project-detail-scroll-texture">
          <GrainTexture className="project-detail-scroll-grain" />
          <ChapterScrollBar />
        </div>
      </div>
      <ClosingChapter
        outgoingRef={outgoingRef}
        headingId="project-detail-closing-heading"
        title={<>Have a project <span>in mind?</span></>}
        body={<>Tell us about your vision and we&apos;ll help find the right way forward.</>}
        actions={
          <ActionLink href="/contact">
            Start a conversation <ArrowRight size={16} />
          </ActionLink>
        }
      />
    </>
  );
}
