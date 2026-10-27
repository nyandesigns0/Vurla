import type { LabelHTMLAttributes, ReactNode } from "react";
export function Field({
  label,
  children,
  htmlFor,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement> & {
  label: string;
  children: ReactNode;
}) {
  return htmlFor ? (
    <div className="ui-field">
      <label htmlFor={htmlFor} {...props}>
        {label}
      </label>
      {children}
    </div>
  ) : (
    <label className="ui-field" {...props}>
      <span>{label}</span>
      {children}
    </label>
  );
}
