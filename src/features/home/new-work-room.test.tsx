import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NewWorkRoom } from "./new-work-room";

const { createHeroRoomMock } = vi.hoisted(() => ({ createHeroRoomMock: vi.fn() }));
vi.mock("./hero-three-renderer", () => ({ createHeroRoom: createHeroRoomMock }));

function media() {
  vi.stubGlobal("matchMedia", (query: string): MediaQueryList => ({
    matches: false, media: query, onchange: null,
    addListener: () => undefined, removeListener: () => undefined,
    addEventListener: () => undefined, removeEventListener: () => undefined,
    dispatchEvent: () => false,
  }));
}

describe("NewWorkRoom", () => {
  beforeEach(() => { createHeroRoomMock.mockReset(); window.localStorage.removeItem("vurla-room-intro-v1:new-work"); media(); });
  afterEach(() => { vi.unstubAllGlobals(); });

  it("keeps only the kicker, heading, and CTA over the room", () => {
    vi.stubGlobal("WebGL2RenderingContext", undefined);
    const { container } = render(<NewWorkRoom />);
    const copy = container.querySelector(".new-work-copy")!;

    expect(container.querySelector(".new-work-room")).toHaveAttribute("data-renderer", "unavailable");
    expect(copy.querySelector(".kicker")).toHaveTextContent("04 / New work");
    expect(screen.getByRole("heading", { name: "Give your next idea a place." })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Start a conversation/ })).toHaveAttribute("href", "/contact");
    expect(copy.querySelectorAll("p")).toHaveLength(1);
    expect(screen.queryByText("Bring us in early. We are listening.")).not.toBeInTheDocument();
    expect(container.querySelector("canvas")?.closest("[aria-hidden='true']")).toBeInTheDocument();
  });

  it("builds the hero room with no exhibits and forwards pointer light and parallax", async () => {
    vi.stubGlobal("WebGL2RenderingContext", function WebGL2RenderingContext() {});
    const renderer = { setSuspended: vi.fn(), setParallaxEnabled: vi.fn(), setPointer: vi.fn(), select: vi.fn(), dispose: vi.fn() };
    createHeroRoomMock.mockReturnValue(renderer);
    const { container, unmount } = render(<NewWorkRoom />);
    const root = container.querySelector<HTMLElement>(".new-work-room")!;

    await waitFor(() => expect(root).toHaveAttribute("data-renderer", "three"));
    expect(createHeroRoomMock).toHaveBeenCalledWith(expect.objectContaining({ projects: [], paths: [], introKey: "new-work", playIntro: true }));
    fireEvent.pointerMove(root, { clientX: 10, clientY: 10, pointerType: "mouse" });
    expect(renderer.setPointer).toHaveBeenCalled();
    unmount();
    expect(renderer.dispose).toHaveBeenCalled();
  });
});
