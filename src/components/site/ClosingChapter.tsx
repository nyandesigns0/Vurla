"use client";

import { useEffect, useRef, type RefObject } from "react";
import { ClosingPanel, type ClosingPanelProps } from "./ClosingPanel";
import { GrainTexture } from "./GrainTexture";
import { scrollToConversation } from "./scroll-to-conversation";

/** One full-bleed closing chapter and handoff for the inner pages. */
export function ClosingChapter({ outgoingRef, returnTargetId, ...panelProps }: ClosingPanelProps & {
  outgoingRef: RefObject<HTMLDivElement | null>;
  /** Optional return from the poster to a form in the outgoing content. */
  returnTargetId?: string;
}) {
  const chapterRef = useRef<HTMLDivElement>(null);
  const headingId = panelProps.headingId;

  useEffect(() => {
    const outgoing = outgoingRef.current;
    const closing = chapterRef.current;
    const plate = closing?.querySelector<HTMLElement>(".closing-chapter-plate");
    if (!outgoing || !closing || !plate) return;

    const fallback = window.matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse), (max-width: 1023px)");
    let disposed = false;
    let nativeFlow = false;
    let generation = 0;
    let revert = () => {};
    let cancelNavigation = () => {};
    const clear = () => {
      revert();
      revert = () => {};
      delete outgoing.dataset.closingTransition;
      delete closing.dataset.motion;
    };
    const setup = async () => {
      const ticket = ++generation;
      clear();
      if (disposed || nativeFlow || fallback.matches) return;
      const modules = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).catch(() => null);
      if (!modules || disposed || nativeFlow || fallback.matches || ticket !== generation) return;
      const [{ default: gsap }, { ScrollTrigger }] = modules;
      gsap.registerPlugin(ScrollTrigger);
      closing.dataset.motion = "enhanced";
      const readingBuffer = () => Number.parseFloat(getComputedStyle(closing).paddingTop) || 0;
      const context = gsap.context(() => {
        gsap.set(plate, { rotation: 30, transformOrigin: "bottom left" });
        gsap.to(plate, {
          rotation: 0,
          ease: "none",
          scrollTrigger: {
            trigger: closing,
            start: () => `top bottom-=${readingBuffer()}`,
            end: () => `top 25%-=${readingBuffer()}`,
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
        ScrollTrigger.create({
          trigger: outgoing,
          start: "clamp(bottom bottom)",
          end: () => `+=${window.innerHeight + readingBuffer()}`,
          pin: true,
          pinSpacing: false,
          invalidateOnRefresh: true,
          onUpdate: self => {
            const travel = self.progress * (window.innerHeight + readingBuffer());
            const covered = travel >= readingBuffer() + window.innerHeight * 0.8;
            outgoing.dataset.closingTransition = self.progress >= 1 ? "complete" : covered ? "covered" : "visible";
          },
        });
      }, closing);
      let refreshFrame = 0;
      const scheduleRefresh = () => {
        window.cancelAnimationFrame(refreshFrame);
        refreshFrame = window.requestAnimationFrame(() => {
          refreshFrame = 0;
          ScrollTrigger.refresh();
        });
      };
      // Measure natural children, never the wrapper whose box pinning rewrites.
      const sizes = new Map<Element, { width: number; height: number }>();
      const resize = new ResizeObserver(entries => {
        let changed = false;
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          const previous = sizes.get(entry.target);
          if (previous && Math.abs(previous.width - width) < 1 && Math.abs(previous.height - height) < 1) continue;
          sizes.set(entry.target, { width, height });
          changed = true;
        }
        if (changed) scheduleRefresh();
      });
      outgoing.querySelectorAll(':scope > :not([aria-hidden="true"])').forEach(element => resize.observe(element));
      resize.observe(plate);
      void document.fonts?.ready.then(() => {
        if (!disposed && ticket === generation) scheduleRefresh();
      });
      revert = () => {
        resize.disconnect();
        window.cancelAnimationFrame(refreshFrame);
        context.revert();
      };
    };
    const enterNativeFlow = () => {
      if (nativeFlow) return;
      const focused = document.activeElement instanceof HTMLElement && outgoing.contains(document.activeElement)
        ? document.activeElement : null;
      nativeFlow = true;
      generation++;
      clear();
      // Removing the GSAP pin spacer reparents the outgoing content. Preserve
      // its focused control so the same Tab press advances to its real sibling.
      if (focused?.isConnected && document.activeElement !== focused) focused.focus({ preventScroll: true });
    };
    const onTouch = (event: PointerEvent) => {
      if (event.pointerType === "touch") enterNativeFlow();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      // Expanding/filtering changes source height. A pin refresh can reparent
      // the focused control, so keyboard use of the console stays native too.
      if (event.key === "Tab" || (event.target instanceof Element && event.target.closest(".catalog-console"))) enterNativeFlow();
    };
    const onAnchorClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest("a") : null;
      if (returnTargetId && closing.contains(link) && link?.getAttribute("href") === `#${returnTargetId}`) {
        const target = document.getElementById(returnTargetId);
        if (!target || !outgoing.contains(target)) return;
        event.preventDefault();
        cancelNavigation();
        // A pinned source's viewport box is no longer its document position.
        // Use its flow spacer plus the target's local offset, retaining the
        // mounted transition so scrolling back down plays the same handoff.
        const flow = outgoing.parentElement?.classList.contains("pin-spacer") ? outgoing.parentElement : outgoing;
        const origin = window.scrollY + flow.getBoundingClientRect().top;
        const offset = target.getBoundingClientRect().top - outgoing.getBoundingClientRect().top;
        const clearance = Number.parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
        cancelNavigation = scrollToConversation(target, () => {
          const field = target.querySelector<HTMLElement>("input, textarea, button");
          (field ?? target).focus({ preventScroll: true });
        }, origin + offset - clearance + window.innerHeight / 2);
        return;
      }
      if (link?.getAttribute("href") !== `#${headingId}`) return;
      const heading = document.getElementById(headingId);
      const composition = closing.querySelector<HTMLElement>(".closing-panel-composition");
      if (!heading || !composition) return;
      event.preventDefault();
      cancelNavigation();
      // Measure the chapter's layout box rather than its rotating plate. Keeping
      // the pin mounted lets the same scrubbed transition play in both directions.
      const centerY = closing.dataset.motion === "enhanced" && !nativeFlow
        ? window.scrollY + closing.getBoundingClientRect().top + plate.offsetTop + plate.offsetHeight / 2
        : undefined;
      cancelNavigation = scrollToConversation(composition, () => {
        heading.tabIndex = -1;
        heading.focus({ preventScroll: true });
      }, centerY);
    };
    void setup();
    fallback.addEventListener("change", setup);
    window.addEventListener("pointerdown", onTouch, { passive: true, capture: true });
    window.addEventListener("keydown", onKeyDown, true);
    outgoing.addEventListener("click", onAnchorClick);
    closing.addEventListener("click", onAnchorClick);
    return () => {
      disposed = true;
      cancelNavigation();
      generation++;
      fallback.removeEventListener("change", setup);
      window.removeEventListener("pointerdown", onTouch, { capture: true });
      window.removeEventListener("keydown", onKeyDown, true);
      outgoing.removeEventListener("click", onAnchorClick);
      closing.removeEventListener("click", onAnchorClick);
      clear();
    };
  }, [outgoingRef, headingId, returnTargetId]);

  return (
    <div ref={chapterRef} className="closing-chapter">
      <div className="closing-chapter-plate">
        <GrainTexture className="closing-chapter-grain" />
        <div className="closing-chapter-border" aria-hidden="true" />
        <ClosingPanel {...panelProps} />
      </div>
    </div>
  );
}
