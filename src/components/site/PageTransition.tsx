"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { PropsWithChildren, useEffect } from "react";
import { useSite } from "@/context/SiteContext";

export function PageTransition({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const { setIsLoading } = useSite();

  // Clear loading state when page transition completes
  useEffect(() => {
    // Set loading to false immediately for non-hero pages
    if (pathname !== '/') {
      setIsLoading(false);
      return;
    }
    
    // For home page, delay to allow hero animations to complete
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, [pathname, setIsLoading]);

  return (
    <AnimatePresence mode="wait" initial={true}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        onAnimationComplete={() => {
          // Ensure loading is cleared when page transition animation completes
          // This provides a backup in case the timer doesn't fire
          setIsLoading(false);
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}


