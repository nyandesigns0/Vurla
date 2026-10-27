import { cn } from "@/lib/utils";

/** One decorative dot field across every route; film grain remains a separate layer. */
export function DotTexture({ className }: { className?: string }) {
  return <span className={cn("dot-texture", className)} aria-hidden="true" />;
}
