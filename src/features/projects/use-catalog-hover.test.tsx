import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useCatalogHover } from "./use-catalog-hover";

function CatalogFixture() {
  const ref = useCatalogHover();
  return (
    <section ref={ref}>
      <div className="project-card--catalog">Example</div>
    </section>
  );
}

describe("useCatalogHover", () => {
  it("seeds fine-pointer card state before the first hover frame", () => {
    const originalMatchMedia = window.matchMedia;
    const originalElementFromPoint = Object.getOwnPropertyDescriptor(document, "elementFromPoint");
    window.matchMedia = (query) => ({
      matches: query === "(hover: hover) and (pointer: fine)",
      media: query,
      onchange: null,
      addListener() {},
      removeListener() {},
      addEventListener() {},
      removeEventListener() {},
      dispatchEvent: () => false,
    });
    Object.defineProperty(document, "elementFromPoint", { configurable: true, value: () => null });

    try {
      const { container, unmount } = render(<CatalogFixture />);
      const card = container.querySelector(".project-card--catalog");
      expect(card).toHaveAttribute("data-pointer-hover", "false");
      unmount();
    } finally {
      window.matchMedia = originalMatchMedia;
      if (originalElementFromPoint) {
        Object.defineProperty(document, "elementFromPoint", originalElementFromPoint);
      } else {
        Reflect.deleteProperty(document, "elementFromPoint");
      }
    }
  });
});
