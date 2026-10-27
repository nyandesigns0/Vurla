import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./button-variants";
import type { ButtonProps } from "./button";
export function ActionLink({
  variant = "default",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: ButtonProps["variant"] }) {
  return (
    <Link className={cn(buttonVariants({ variant }), className)} {...props} />
  );
}
