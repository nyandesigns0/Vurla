import type { LabelHTMLAttributes, ReactNode } from "react";
export function Field({ label, children, ...props }: LabelHTMLAttributes<HTMLLabelElement> & { label: string; children: ReactNode }) { return <label className="block space-y-2 text-sm font-medium" {...props}><span>{label}</span>{children}</label>; }
