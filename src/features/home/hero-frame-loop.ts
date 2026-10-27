type FrameClock = { request(callback: FrameRequestCallback): number; cancel(id: number): void };

/** A sleeping loop: no background RAF while static, hidden, or offscreen. */
export function createHeroFrameLoop(render: (now: number) => boolean, clock: FrameClock = { request: callback => requestAnimationFrame(callback), cancel: id => cancelAnimationFrame(id) }) {
  let frame: number | null = null, suspended = false, disposed = false;
  const wake = () => {
    if (disposed || suspended || frame !== null) return;
    frame = clock.request((now) => {
      frame = null;
      if (disposed || suspended) return;
      if (render(now)) wake();
    });
  };
  return {
    wake,
    suspend(value: boolean) {
      suspended = value;
      if (value && frame !== null) { clock.cancel(frame); frame = null; }
      if (!value) wake();
    },
    dispose() { disposed = true; if (frame !== null) clock.cancel(frame); frame = null; },
  };
}
