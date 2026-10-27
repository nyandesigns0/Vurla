import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(cleanup);

class TestIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
Object.defineProperty(globalThis, "IntersectionObserver", {
  writable: true,
  value: TestIntersectionObserver,
});
class TestResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
Object.defineProperty(globalThis, "ResizeObserver", {
  writable: true,
  value: TestResizeObserver,
});
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: query.includes("prefers-reduced-motion"),
    media: query,
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() {
      return false;
    },
  }),
});
// jsdom has no canvas backend; exercise the missing-canvas fallback quietly.
Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
  writable: true,
  value: () => null,
});
