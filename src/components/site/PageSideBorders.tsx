import { cn } from "@/lib/utils";

/** Continuous shell edges through the space between inner-page modules. */
export function PageSideBorders({ className }: { className?: string }) {
  return <div className={cn("page-side-borders shell", className)} aria-hidden="true" />;
}
