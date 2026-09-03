import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) { return <div className={cn("border border-[var(--ds-color-border)] bg-[var(--ds-color-paper)] p-6", className)} {...props} />; }
