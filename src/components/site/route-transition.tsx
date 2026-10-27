"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/** Successful route handoffs decorate navigation; they never hold it hostage. */
export function RouteTransition() {
  const pathname = usePathname();
  const previous = useRef(pathname);
  const navigation = useRef<"forward" | "history" | null>(null);
  const plate = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const history = () => { navigation.current = "history"; };
    const intent = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest("a") : null;
      if (!anchor || anchor.hasAttribute("download") || (anchor.target && anchor.target !== "_self")) return;
      const destination = new URL(anchor.href, location.href);
      if (destination.origin !== location.origin || destination.pathname === location.pathname) return;
      navigation.current = "forward";
    };
    window.addEventListener("popstate", history);
    document.addEventListener("click", intent, true);
    return () => {
      window.removeEventListener("popstate", history);
      document.removeEventListener("click", intent, true);
    };
  }, []);

  useEffect(() => {
    if (previous.current === pathname) return;
    previous.current = pathname;
    const kind = navigation.current;
    navigation.current = null;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const clear = () => { delete document.body.dataset.routeTransition; };
    clear();
    // Restart even when a second successful route arrives during a handoff.
    if (!reduced.matches) {
      void plate.current?.offsetWidth;
      document.body.dataset.routeTransition = "active";
    }
    const timer = window.setTimeout(clear, 400);
    const complete = () => clear();
    const onPreference = () => { if (reduced.matches) clear(); };
    const element = plate.current;
    element?.addEventListener("animationend", complete);
    reduced.addEventListener("change", onPreference);
    const focusFrame = requestAnimationFrame(() => {
      if (kind !== "forward") return;
      // Let browser/Next anchor positioning and history restoration stay native.
      if (location.hash) return;
      const active = document.activeElement;
      if (active instanceof HTMLElement && active.matches("input,textarea,select,[contenteditable='true']")) return;
      document.getElementById("main")?.focus({ preventScroll: true });
    });
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(focusFrame);
      element?.removeEventListener("animationend", complete);
      reduced.removeEventListener("change", onPreference);
      clear();
    };
  }, [pathname]);
  return <div ref={plate} className="route-transition" aria-hidden="true" />;
}
