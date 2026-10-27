import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn("ui-input", className)} {...props} />;
}
