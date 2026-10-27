import { readFileSync } from "node:fs";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getHomeContent } from "@/content/testing";
import { SpatialHero } from "./spatial-hero";

const { createHeroRoomMock } = vi.hoisted(() => ({ createHeroRoomMock: vi.fn() }));
vi.mock("./hero-three-renderer", () => ({ createHeroRoom: createHeroRoomMock }));
const defaultIntersectionObserver = globalThis.IntersectionObserver;

type RendererOptions = {
  canvas: HTMLCanvasElement;
  onFailure(): void;
};

function createRendererDouble() {
  return {
    setSuspended: vi.fn(),
    setParallaxEnabled: vi.fn(),
    setPointer: vi.fn(),
    select: vi.fn(),
    dispose: vi.fn(),
  };
}

function media(matches: (query: string) => boolean = () => false) {
  vi.stubGlobal("matchMedia", (query: string): MediaQueryList => ({
    matches: matches(query), media: query, onchange: null,
    addListener: () => undefined, removeListener: () => undefined,
    addEventListener: () => undefined, removeEventListener: () => undefined,
    dispatchEvent: () => false,
  }));
}

describe("Three-only spatial hero", () => {
  beforeEach(() => { createHeroRoomMock.mockReset(); window.localStorage.removeItem("vurla-room-intro-v1:hero"); media(); });
  afterEach(() => { globalThis.IntersectionObserver = defaultIntersectionObserver; vi.useRealTimers(); vi.unstubAllGlobals(); });

  it("shows the grain before and throughout the first-load room sequence", () => {
    vi.stubGlobal("WebGL2RenderingContext", undefined);
    const { container } = render(<SpatialHero projects={getHomeContent().heroProjects} />);
    expect(container.querySelector(".hero-three-stage > .grain-texture")).toBeInTheDocument();
    const css = readFileSync("src/features/home/spatial-hero.css", "utf8");
    expect(css).not.toContain('.spatial-hero[data-room-intro="playing"] .hero-three-stage > .grain-texture');
    expect(css).not.toContain('.new-work-room[data-room-intro="playing"] .new-work-room-stage > .grain-texture');
  });

  it("renders only the Three.js stage while keeping every semantic project link available", () => {
    vi.stubGlobal("WebGL2RenderingContext", undefined);
    const projects = getHomeContent().heroProjects;
    const { container } = render(<SpatialHero projects={projects} />);
    const root = container.querySelector<HTMLElement>(".spatial-hero")!;

    expect(root).toHaveAttribute("data-renderer", "unavailable");
    expect(root.querySelector(".hero-three-stage")).toBeInTheDocument();
    expect(root.querySelector(".hero-three-canvas")).toBeInTheDocument();
    expect(root.querySelector(".hero-three-links")).toBeInTheDocument();
    expect(root.querySelector(".hero-room-fallback")).not.toBeInTheDocument();
    expect(root.querySelectorAll(".room-surface, .fold, .room-plane")).toHaveLength(0);
    expect(root.querySelector("noscript, .hero-noscript-links")).not.toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /^View / })).toHaveLength(projects.length);
    projects.forEach((project) => expect(screen.getByRole("link", { name: `View ${project.title}` })).toHaveAttribute("href", project.href));
    expect(projects.at(-1)).toMatchObject({
      title: "Boba Friend Pop-Up",
      imageSrc: "/media/projects/boba-friend-pop-up/cover.jpg",
      href: "/projects/boba-friend-pop-up",
    });
  });

  it("initializes one renderer and keeps hover and focus project selection semantic", async () => {
    vi.stubGlobal("WebGL2RenderingContext", class WebGL2RenderingContext {});
    const renderer = createRendererDouble();
    createHeroRoomMock.mockReturnValue(renderer);
    const projects = getHomeContent().heroProjects;
    const onProjectPreview = vi.fn();
    const { container } = render(<SpatialHero projects={projects} onProjectPreview={onProjectPreview} />);
    const root = container.querySelector<HTMLElement>(".spatial-hero")!;

    await waitFor(() => expect(root).toHaveAttribute("data-renderer", "three"));
    expect(createHeroRoomMock).toHaveBeenCalledTimes(1);
    expect(createHeroRoomMock).toHaveBeenCalledWith(expect.objectContaining({ introKey: "hero", playIntro: true }));
    expect(root).not.toHaveAttribute("data-motion-policy");
    expect(renderer.setSuspended).toHaveBeenCalledWith(false);
    expect(renderer.setParallaxEnabled).toHaveBeenCalledWith(true);
    expect(renderer.select).toHaveBeenCalledWith(-1);
    fireEvent.pointerMove(root, { pointerType: "mouse", clientX: 640, clientY: 100 });
    expect(renderer.setPointer).toHaveBeenCalled();
    const projectLink = screen.getByRole("link", { name: `View ${projects[1].title}` });
    fireEvent.pointerEnter(projectLink);
    expect(root).toHaveAttribute("data-selected-index", "1");
    expect(onProjectPreview).toHaveBeenLastCalledWith(projects[1]);
    fireEvent.pointerLeave(projectLink);
    expect(renderer.select).toHaveBeenLastCalledWith(-1);
    fireEvent.focus(projectLink);
    expect(renderer.select).toHaveBeenLastCalledWith(1);
  });

  it("keeps reduced-motion rendering inside Three.js without camera parallax", async () => {
    media((query) => query === "(prefers-reduced-motion: reduce)");
    vi.stubGlobal("WebGL2RenderingContext", class WebGL2RenderingContext {});
    const renderer = createRendererDouble();
    createHeroRoomMock.mockReturnValue(renderer);
    const { container } = render(<SpatialHero projects={getHomeContent().heroProjects} />);
    const root = container.querySelector<HTMLElement>(".spatial-hero")!;

    await waitFor(() => expect(root).toHaveAttribute("data-renderer", "three"));
    expect(renderer.setParallaxEnabled).toHaveBeenCalledWith(false);
    expect(createHeroRoomMock).toHaveBeenCalledWith(expect.objectContaining({ playIntro: false }));
    expect(renderer.setSuspended).toHaveBeenCalledWith(false);
    expect(root.querySelector(".hero-room-fallback")).not.toBeInTheDocument();
  });

  it("marks renderer failure unavailable without introducing another visual room", async () => {
    vi.stubGlobal("WebGL2RenderingContext", class WebGL2RenderingContext {});
    const renderer = createRendererDouble();
    let fail: (() => void) | undefined;
    createHeroRoomMock.mockImplementation((options: RendererOptions) => { fail = options.onFailure; return renderer; });
    const { container } = render(<SpatialHero projects={getHomeContent().heroProjects} />);
    const root = container.querySelector<HTMLElement>(".spatial-hero")!;

    await waitFor(() => expect(root).toHaveAttribute("data-renderer", "three"));
    act(() => fail?.());
    expect(root).toHaveAttribute("data-renderer", "unavailable");
    expect(renderer.dispose).toHaveBeenCalledTimes(1);
    expect(createHeroRoomMock).toHaveBeenCalledTimes(1);
    expect(root.querySelector(".hero-three-stage")).toBeInTheDocument();
    expect(root.querySelector(".hero-room-fallback, .room-surface, .fold, .room-plane")).not.toBeInTheDocument();
    act(() => fail?.());
    expect(renderer.dispose).toHaveBeenCalledTimes(1);
    expect(createHeroRoomMock).toHaveBeenCalledTimes(1);
  });

  it("disposes the renderer on unmount", async () => {
    vi.stubGlobal("WebGL2RenderingContext", class WebGL2RenderingContext {});
    const renderer = createRendererDouble();
    createHeroRoomMock.mockReturnValue(renderer);
    const view = render(<SpatialHero projects={getHomeContent().heroProjects} />);
    await waitFor(() => expect(view.container.querySelector(".spatial-hero")).toHaveAttribute("data-renderer", "three"));

    view.unmount();
    expect(renderer.dispose).toHaveBeenCalledTimes(1);
  });

  it("skips the loading sequence after the room has been cached", async () => {
    window.localStorage.setItem("vurla-room-intro-v1:hero", "complete");
    vi.stubGlobal("WebGL2RenderingContext", class WebGL2RenderingContext {});
    createHeroRoomMock.mockReturnValue(createRendererDouble());
    const { container } = render(<SpatialHero projects={getHomeContent().heroProjects} />);
    await waitFor(() => expect(container.querySelector(".spatial-hero")).toHaveAttribute("data-renderer", "three"));
    expect(createHeroRoomMock).toHaveBeenCalledWith(expect.objectContaining({ introKey: "hero", playIntro: false }));
    expect(container.querySelector(".spatial-hero")).toHaveAttribute("data-room-intro", "complete");
  });

  it("handles context loss once and does not create a duplicate renderer", async () => {
    vi.stubGlobal("WebGL2RenderingContext", class WebGL2RenderingContext {});
    const renderer = createRendererDouble();
    createHeroRoomMock.mockImplementation((options: RendererOptions) => {
      const lost = (event: Event) => { event.preventDefault(); options.onFailure(); };
      options.canvas.addEventListener("webglcontextlost", lost);
      renderer.dispose.mockImplementation(() => options.canvas.removeEventListener("webglcontextlost", lost));
      return renderer;
    });
    const { container } = render(<SpatialHero projects={getHomeContent().heroProjects} />);
    const root = container.querySelector<HTMLElement>(".spatial-hero")!;
    const canvas = container.querySelector<HTMLCanvasElement>(".hero-three-canvas")!;
    await waitFor(() => expect(root).toHaveAttribute("data-renderer", "three"));

    const contextLost = new Event("webglcontextlost", { cancelable: true });
    fireEvent(canvas, contextLost);
    expect(contextLost.defaultPrevented).toBe(true);
    expect(root).toHaveAttribute("data-renderer", "unavailable");
    expect(renderer.dispose).toHaveBeenCalledTimes(1);
    expect(createHeroRoomMock).toHaveBeenCalledTimes(1);
    fireEvent(canvas, new Event("webglcontextlost", { cancelable: true }));
    expect(createHeroRoomMock).toHaveBeenCalledTimes(1);
  });

  it("keeps hover and focus selection without circulation pause timers", async () => {
    vi.stubGlobal("WebGL2RenderingContext", class WebGL2RenderingContext {});
    const renderer = createRendererDouble();
    createHeroRoomMock.mockReturnValue(renderer);
    const projects = getHomeContent().heroProjects;
    const { container } = render(<SpatialHero projects={projects} />);
    const root = container.querySelector<HTMLElement>(".spatial-hero")!;
    await waitFor(() => expect(root).toHaveAttribute("data-renderer", "three"));
    const projectLink = screen.getByRole("link", { name: `View ${projects[0].title}` });

    fireEvent.pointerEnter(projectLink);
    expect(renderer.select).toHaveBeenLastCalledWith(0);
    fireEvent.focus(projectLink);
    fireEvent.pointerLeave(projectLink);
    expect(renderer.select).toHaveBeenLastCalledWith(-1);
    fireEvent.blur(projectLink, { relatedTarget: null });
    expect(root).not.toHaveAttribute("data-pause-reasons");
  });

  it("suspends rendering offscreen and resumes when visible", async () => {
    let notify: IntersectionObserverCallback = () => undefined;
    globalThis.IntersectionObserver = class {
      constructor(callback: IntersectionObserverCallback) { notify = callback; }
      observe() {}
      disconnect() {}
    } as unknown as typeof IntersectionObserver;
    vi.stubGlobal("WebGL2RenderingContext", class WebGL2RenderingContext {});
    const renderer = createRendererDouble();
    createHeroRoomMock.mockReturnValue(renderer);
    const { container } = render(<SpatialHero projects={getHomeContent().heroProjects} />);
    await waitFor(() => expect(container.querySelector(".spatial-hero")).toHaveAttribute("data-renderer", "three"));
    act(() => notify([{ isIntersecting: false } as IntersectionObserverEntry], {} as IntersectionObserver));
    expect(renderer.setSuspended).toHaveBeenLastCalledWith(true);
    act(() => notify([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver));
    expect(renderer.setSuspended).toHaveBeenLastCalledWith(false);
  });
});
