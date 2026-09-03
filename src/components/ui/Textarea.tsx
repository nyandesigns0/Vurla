import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) { return <textarea className={cn("w-full border border-[var(--ds-color-border)] bg-[var(--ds-color-paper)] px-4 py-3", className)} {...props} />; }
