/** A bounded, interruptible document scroll; ordinary scrolling stays native. */
export function scrollToConversation(target: HTMLElement, onArrival: () => void, centerY?: number) {
  const start = window.scrollY;
  const bounds = centerY === undefined ? target.getBoundingClientRect() : null;
  const maximum = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  const center = centerY ?? start + bounds!.top + bounds!.height / 2;
  const end = Math.max(0, Math.min(maximum, center - window.innerHeight / 2));
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (motion.matches || Math.abs(end - start) < 1) {
    if (centerY === undefined) target.scrollIntoView({ block: "center", behavior: "instant" });
    else window.scrollTo({ top: end, behavior: "instant" });
    onArrival();
    return () => {};
  }

  let frame = 0;
  const began = performance.now();
  const duration = 1300;
  const cancel = () => {
    window.cancelAnimationFrame(frame);
    window.removeEventListener("wheel", cancel);
    window.removeEventListener("touchstart", cancel);
    window.removeEventListener("pointerdown", cancel);
    window.removeEventListener("keydown", cancel);
    window.removeEventListener("resize", cancel);
    motion.removeEventListener("change", cancel);
  };
  const tick = (now: number) => {
    const progress = Math.min(1, Math.max(0, (now - began) / duration));
    const eased = progress < 0.5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2;
    window.scrollTo({ top: start + (end - start) * eased, behavior: "instant" });
    if (progress < 1) frame = window.requestAnimationFrame(tick);
    else { cancel(); onArrival(); }
  };
  window.addEventListener("wheel", cancel, { passive: true });
  window.addEventListener("touchstart", cancel, { passive: true });
  window.addEventListener("pointerdown", cancel, { passive: true });
  window.addEventListener("keydown", cancel);
  window.addEventListener("resize", cancel);
  motion.addEventListener("change", cancel);
  frame = window.requestAnimationFrame(tick);
  return cancel;
}
