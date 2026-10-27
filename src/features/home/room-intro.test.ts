import { beforeEach, describe, expect, it } from "vitest";
import { markRoomIntroComplete, roomIntroFrame, shouldPlayRoomIntro } from "./room-intro";

describe("room intro", () => {
  beforeEach(() => {
    window.localStorage.removeItem("vurla-room-intro-v1:hero");
    window.localStorage.removeItem("vurla-room-intro-v1:new-work");
  });

  it("reveals depth rays, then cross-lines, then images in order", () => {
    expect(roomIntroFrame(0, 3)).toMatchObject({ parallel: 0, cross: 0, visibleImages: 0, complete: false });
    expect(roomIntroFrame(500, 3)).toMatchObject({ parallel: 1.06, cross: 0, visibleImages: 0 });
    expect(roomIntroFrame(1000, 3)).toMatchObject({ parallel: 1.06, cross: 1.06, visibleImages: 0 });
    expect(roomIntroFrame(1130, 3).visibleImages).toBe(1);
    expect(roomIntroFrame(1260, 3).visibleImages).toBe(2);
    expect(roomIntroFrame(1390, 3)).toMatchObject({ visibleImages: 3, complete: true });
    expect(roomIntroFrame(1000, 0).complete).toBe(true);
  });

  it("plays once per room and skips immediately for reduced motion", () => {
    expect(shouldPlayRoomIntro("hero", false)).toBe(true);
    expect(shouldPlayRoomIntro("new-work", false)).toBe(true);
    expect(shouldPlayRoomIntro("hero", true)).toBe(false);
    markRoomIntroComplete("hero");
    expect(shouldPlayRoomIntro("hero", false)).toBe(false);
    expect(shouldPlayRoomIntro("new-work", false)).toBe(true);
  });
});
