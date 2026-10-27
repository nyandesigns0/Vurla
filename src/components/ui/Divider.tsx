type DividerProps = {
  orientation?: "horizontal" | "vertical";
  className?: string;
};

export function Divider({ orientation = "horizontal", className }: DividerProps) {
  return (
    <span
      aria-hidden="true"
      className={["divider-line", className].filter(Boolean).join(" ")}
      data-orientation={orientation}
    />
  );
}
