"use client";

import Link, { LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import { PropsWithChildren, MouseEvent } from "react";
import { useSite } from "@/context/SiteContext";

type DynamicLinkProps = LinkProps & {
  className?: string;
  style?: React.CSSProperties;
};

export function DynamicLink({ href, children, className, style, ...props }: PropsWithChildren<DynamicLinkProps>) {
  const router = useRouter();
  const { setIsLoading } = useSite();

  function onClick(e: MouseEvent<HTMLAnchorElement>) {
    if (props.onClick) props.onClick(e);
    if (e.defaultPrevented) return;
    
    // Check if we're navigating to the same page
    const currentPath = window.location.pathname;
    if (currentPath === href) {
      // Don't show loading for same-page navigation
      return;
    }
    
    // Start loading and progress
    setIsLoading(true);
    try {
      (window as any).__progress_start?.();
    } catch {}
    
    // PageTransition component will handle clearing the loading state
  }

  return (
    <Link href={href} onClick={onClick} className={className} style={style} {...props}>
      {children}
    </Link>
  );
}


