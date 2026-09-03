import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) { return <input className={cn("min-h-11 w-full border border-[var(--ds-color-border)] bg-[var(--ds-color-paper)] px-4 py-3", className)} {...props} />; }
