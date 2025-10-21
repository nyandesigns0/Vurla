import { useState } from "react";
import { useRouter } from "next/navigation";

export function usePageTransition() {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();

  const navigate = (href: string) => {
    setIsTransitioning(true);
    
    // Wait for exit animation to complete
    const timer = setTimeout(() => {
      router.push(href);
      setIsTransitioning(false);
    }, 300);

    return () => clearTimeout(timer);
  };

  return { isTransitioning, navigate };
}
