import { cva } from "class-variance-authority";
export const buttonVariants = cva("ui-button", {
  variants: {
    variant: {
      default: "ui-button--default",
      premium: "ui-button--premium",
      outline: "ui-button--outline",
      secondary: "ui-button--secondary",
      ghost: "ui-button--ghost",
      link: "ui-button--link",
      destructive: "ui-button--destructive",
    },
    size: { default: "", sm: "", lg: "ui-button--lg", icon: "ui-button--icon" },
  },
  defaultVariants: { variant: "default", size: "default" },
});
