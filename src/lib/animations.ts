/* Animation helper utilities */

export const animationDurations = {
  fast: 150,
  base: 250,
  slow: 350,
} as const;

export const animationEasings = {
  easeOut: "cubic-bezier(0.4, 0, 0.2, 1)",
  easeIn: "cubic-bezier(0.4, 0, 0.6, 1)",
  easeInOut: "cubic-bezier(0.4, 0, 0.6, 1)",
  linear: "linear",
} as const;

/**
 * Get animation delay based on index for staggered animations
 */
export function getStaggerDelay(index: number, baseDelay: number = 100): string {
  return `${index * baseDelay}ms`;
}

/**
 * Generate animation class names for scroll animations
 */
export function getScrollAnimationClass(isVisible: boolean): string {
  if (!isVisible) return "opacity-0";
  return "animate-slide-in-up";
}

/**
 * Detect if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Safe animation wrapper that respects user preferences
 */
export function getAnimationStyle(
  shouldAnimate: boolean,
  animation: string,
  duration: number = 250
): React.CSSProperties | undefined {
  if (!shouldAnimate || prefersReducedMotion()) {
    return undefined;
  }

  return {
    animation: `${animation} ${duration}ms ease-out forwards`,
  };
}
