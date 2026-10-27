import type {
  HTMLAttributes,
  SelectHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  DetailsHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";
export function Badge({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("ui-badge", className)} {...props} />;
}
export function Select({
  className,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn("ui-input", className)} {...props} />;
}
export function Checkbox({
  label,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="ui-checkbox">
      <input type="checkbox" {...props} />
      {label}
    </label>
  );
}
export function Accordion({
  title,
  children,
  ...props
}: Omit<DetailsHTMLAttributes<HTMLDetailsElement>, "title"> & {
  title: ReactNode;
}) {
  return (
    <details className="ui-accordion" {...props}>
      <summary>{title}</summary>
      <div className="ui-accordion-content">{children}</div>
    </details>
  );
}
