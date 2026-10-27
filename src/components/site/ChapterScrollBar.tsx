import { Divider } from "@/components/ui/Divider";
import { ScrollCue } from "@/components/ui/ScrollCue";

/** Shared outgoing-chapter cue, deliberately without side borders. */
export function ChapterScrollBar() {
  return (
    <div className="chapter-scroll-bar services-scroll-panel-shell">
      <Divider className="services-scroll-divider" />
      <div className="chapter-scroll-panel services-scroll-panel shell">
        <p className="chapter-scroll-cue"><ScrollCue /></p>
      </div>
    </div>
  );
}
