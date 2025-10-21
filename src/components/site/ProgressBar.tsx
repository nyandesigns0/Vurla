"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

// Minimal nprogress styling override using CSS variables
const style = `
#nprogress { pointer-events: none; }
#nprogress .bar { background: var(--primary); position: fixed; z-index: 1031; top: 0; left: 0; width: 100%; height: 2px; }
#nprogress .peg { display: none; }
`;

export function ProgressBar() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    NProgress.configure({ showSpinner: false, trickleSpeed: 120 });
  }, []);

  // Start/stop on route change via pathname updates
  useEffect(() => {
    NProgress.start();
    const timer = setTimeout(() => NProgress.done(), 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Provide global helpers for fetch starts if needed
  useEffect(() => {
    (window as any).__progress_start = () => NProgress.start();
    (window as any).__progress_done = () => NProgress.done();
  }, []);

  return <style dangerouslySetInnerHTML={{ __html: style }} />;
}


