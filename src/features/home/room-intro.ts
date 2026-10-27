export type RoomIntroKey = "hero" | "new-work";

export const ROOM_INTRO_PARALLEL_MS = 500;
export const ROOM_INTRO_CROSS_MS = 500;
export const ROOM_INTRO_IMAGE_STEP_MS = 130;

const storageKey = (room: RoomIntroKey) => `vurla-room-intro-v1:${room}`;
const clamp = (value: number) => Math.max(0, Math.min(1, value));

export function roomIntroFrame(elapsed: number, imageCount: number) {
  const linesEnd = ROOM_INTRO_PARALLEL_MS + ROOM_INTRO_CROSS_MS;
  const duration = linesEnd + imageCount * ROOM_INTRO_IMAGE_STEP_MS;
  return {
    parallel: clamp(elapsed / ROOM_INTRO_PARALLEL_MS) * 1.06,
    cross: clamp((elapsed - ROOM_INTRO_PARALLEL_MS) / ROOM_INTRO_CROSS_MS) * 1.06,
    visibleImages: Math.min(imageCount, Math.floor(Math.max(0, elapsed - linesEnd) / ROOM_INTRO_IMAGE_STEP_MS)),
    complete: elapsed >= duration,
  };
}

export function shouldPlayRoomIntro(room: RoomIntroKey, reducedMotion: boolean) {
  if (reducedMotion) return false;
  try { return window.localStorage.getItem(storageKey(room)) !== "complete"; }
  catch { return true; }
}

export function markRoomIntroComplete(room: RoomIntroKey) {
  try { window.localStorage.setItem(storageKey(room), "complete"); }
  catch { /* Storage may be disabled; the current scene still completes. */ }
}
