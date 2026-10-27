import { SkeletonCard } from "@/components/ui/Skeleton";
import { GrainTexture } from "./GrainTexture";

/** Route-local fallback; keeping it out of the root segment preserves no-script HTML. */
export function RouteLoading() {
  return (
    <div className="page shell route-loading" role="status" aria-label="Loading content">
      <GrainTexture />
      <p className="kicker">Loading content</p>
      <div className="project-grid">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}
