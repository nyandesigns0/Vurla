import { fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { RouteTransition } from "./route-transition";
import Link from "next/link";

const navigation = vi.hoisted(() => ({ pathname: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => navigation.pathname }));
afterEach(() => { delete document.body.dataset.routeTransition; vi.restoreAllMocks(); navigation.pathname = "/"; });

describe("route handoff lifecycle", () => {
  it("does not animate an initial load and clears on unmount", () => {
    vi.spyOn(window, "matchMedia").mockReturnValue({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() } as unknown as MediaQueryList);
    const { rerender, unmount } = render(<RouteTransition />);
    expect(document.body).not.toHaveAttribute("data-route-transition");
    navigation.pathname = "/projects";
    rerender(<RouteTransition />);
    expect(document.body).toHaveAttribute("data-route-transition", "active");
    unmount();
    expect(document.body).not.toHaveAttribute("data-route-transition");
  });
  it("clears on animation completion and supports interrupted routes", () => {
    vi.spyOn(window, "matchMedia").mockReturnValue({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() } as unknown as MediaQueryList);
    const { rerender, container } = render(<RouteTransition />);
    navigation.pathname = "/projects";
    rerender(<RouteTransition />);
    navigation.pathname = "/contact";
    rerender(<RouteTransition />);
    expect(document.body).toHaveAttribute("data-route-transition", "active");
    fireEvent.animationEnd(container.firstChild!);
    expect(document.body).not.toHaveAttribute("data-route-transition");
  });
  it("never activates an overlay with reduced motion", () => {
    const { rerender } = render(<RouteTransition />);
    navigation.pathname = "/services";
    rerender(<RouteTransition />);
    expect(document.body).not.toHaveAttribute("data-route-transition");
  });
  it("restores main focus after an unmodified forward link intent", async () => {
    vi.spyOn(window, "matchMedia").mockReturnValue({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() } as unknown as MediaQueryList);
    const { rerender } = render(<><RouteTransition /><Link href="/projects" onClick={event => event.preventDefault()}>Projects</Link><main id="main" tabIndex={-1}>Destination</main></>);
    fireEvent.click(document.querySelector("a")!);
    navigation.pathname = "/projects";
    rerender(<><RouteTransition /><Link href="/projects" onClick={event => event.preventDefault()}>Projects</Link><main id="main" tabIndex={-1}>Destination</main></>);
    await new Promise(resolve => requestAnimationFrame(resolve));
    expect(document.activeElement).toHaveAttribute("id", "main");
  });
  it("does not classify modified link activation as a managed forward navigation", async () => {
    vi.spyOn(window, "matchMedia").mockReturnValue({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() } as unknown as MediaQueryList);
    const { rerender } = render(<><RouteTransition /><Link href="/projects" onClick={event => event.preventDefault()}>Projects</Link><main id="main" tabIndex={-1}>Destination</main></>);
    fireEvent.click(document.querySelector("a")!, { ctrlKey: true });
    navigation.pathname = "/projects";
    rerender(<><RouteTransition /><Link href="/projects" onClick={event => event.preventDefault()}>Projects</Link><main id="main" tabIndex={-1}>Destination</main></>);
    await new Promise(resolve => requestAnimationFrame(resolve));
    expect(document.activeElement).not.toHaveAttribute("id", "main");
  });
});
