import { describe, expect, it, vi } from "vitest";
import { Vector3 } from "three";
import { boundedPixelRatio, boundedPointer, FIXED_EXHIBITS, HALLWAY_BACK, HALLWAY_DEPTH_DIVISIONS, ROOM_GRID_LINE_WIDTH_PX, roomGridScale, roomSignalMix, THREE_ROOM_SURFACES, upperFold, type RoomQuad } from "./hero-three-geometry";
import { createHeroFrameLoop } from "./hero-frame-loop";

const normal = (quad: RoomQuad) => new Vector3().subVectors(new Vector3(...quad.points[1]), new Vector3(...quad.points[0])).cross(new Vector3().subVectors(new Vector3(...quad.points[3]), new Vector3(...quad.points[0]))).normalize();

describe("rendered Three room geometry", () => {
  it("uses three-quarter-pixel rules and extends the open room on the original grid rhythm", () => {
    expect(roomGridScale("back")).toEqual([10, 7]);
    expect(roomGridScale("floor")).toEqual([10, HALLWAY_DEPTH_DIVISIONS]);
    expect(roomGridScale("ceiling")).toEqual([10, HALLWAY_DEPTH_DIVISIONS]);
    expect(roomGridScale("left")).toEqual([HALLWAY_DEPTH_DIVISIONS, 7]);
    expect(ROOM_GRID_LINE_WIDTH_PX).toBe(.75);
  });

  it("places every static project-plane vertex on a room-grid intersection", () => {
    const closeToAny = (value: number, lines: readonly number[]) => lines.some((line) => Math.abs(value - line) < 1e-10);
    const xLines = Array.from({ length: 11 }, (_, index) => -8 + index * 1.6);
    const yLines = Array.from({ length: 8 }, (_, index) => 4.5 - index * 9 / 7);
    const depthLines = Array.from({ length: 11 }, (_, index) => -7 + index * 1.4);
    const aligned = (quad: RoomQuad) => quad.points.every(([x, y, z]) => {
      if (quad.surface === "floor" || quad.surface === "ceiling") return closeToAny(x, xLines) && closeToAny(z, depthLines);
      if (quad.surface === "left" || quad.surface === "right") return closeToAny(y, yLines) && closeToAny(z, depthLines);
      return closeToAny(x, xLines) && closeToAny(y, yLines);
    }) && quad.points.every((point, index) => {
      const next = quad.points[(index + 1) % quad.points.length];
      if (quad.surface === "floor" || quad.surface === "ceiling") return point[0] === next[0] || point[2] === next[2];
      if (quad.surface === "left" || quad.surface === "right") return point[1] === next[1] || point[2] === next[2];
      return point[0] === next[0] || point[1] === next[1];
    });

    expect(FIXED_EXHIBITS.flat().every(aligned)).toBe(true);
  });

  it("swaps Storyworks and Circular Energy Exchange placements while keeping the floor images distinct", () => {
    expect(FIXED_EXHIBITS[0]).toHaveLength(1);
    expect(FIXED_EXHIBITS[0][0].surface).toBe("floor");
    expect(FIXED_EXHIBITS[4]).toEqual(upperFold("left"));
    expect(FIXED_EXHIBITS[6]).toHaveLength(1);
    expect(FIXED_EXHIBITS[0][0].points).not.toEqual(FIXED_EXHIBITS[6][0].points);
  });

  it("swaps La Puente and Lunar Habitat image and link positions", () => {
    expect(FIXED_EXHIBITS[3]).toEqual(upperFold("right"));
    expect(FIXED_EXHIBITS[5]).toHaveLength(1);
    expect(FIXED_EXHIBITS[5][0].surface).toBe("left");
  });

  it("keeps the two floor images one depth cell farther into the corridor", () => {
    const storyworksDepths = FIXED_EXHIBITS[0][0].points.map((point) => point[2]);
    const popUpDepths = FIXED_EXHIBITS[6][0].points.map((point) => point[2]);
    expect(storyworksDepths[0]).toBeCloseTo(-2.8); expect(storyworksDepths[2]).toBeCloseTo(0);
    expect(popUpDepths[0]).toBeCloseTo(0); expect(popUpDepths[2]).toBeCloseTo(4.2);
  });

  it("removes the back wall and joins four corridor surfaces at the distant opening", () => {
    expect(THREE_ROOM_SURFACES.map((quad) => quad.surface)).toEqual(["left", "right", "ceiling", "floor"]);
    for (const surface of THREE_ROOM_SURFACES) {
      for (const point of surface.points.filter((entry) => entry[2] === HALLWAY_BACK)) {
        expect(THREE_ROOM_SURFACES.filter((quad) => quad.points.some((other) => other.every((value, index) => value === point[index])))).toHaveLength(2);
      }
    }
  });
  it.each(["left", "right"] as const)("maps the %s fold source edge to its exact perpendicular world hinge", (side) => {
    const [ceiling, wall] = upperFold(side);
    const ceilingSpan = Math.abs(ceiling.points[3][0] - ceiling.points[0][0]);
    const wallSpan = Math.abs(wall.points[2][1] - wall.points[0][1]);
    const hingeV = side === "left" ? .5 : wallSpan / (wallSpan + ceilingSpan);
    expect(ceiling.points[3]).toEqual(wall.points[0]);
    expect(ceiling.points[2]).toEqual(wall.points[1]);
    expect(ceiling.uv[3]).toEqual(wall.uv[0]);
    expect(ceiling.uv[2]).toEqual(wall.uv[1]);
    expect(Math.abs(normal(ceiling).dot(normal(wall)))).toBeLessThan(1e-10);
    expect(ceiling.uv.map(p => p[1])).toEqual([1, 1, hingeV, hingeV]);
    expect(wall.uv.map(p => p[1])).toEqual([hingeV, hingeV, 0, 0]);
    if (side === "right") {
      expect(ceiling.points[0][0]).toBeCloseTo(3.2);
      expect(wall.points[2][1]).toBeCloseTo(4.5 - 18 / 7);
    }
  });
  it("keeps the floor/right-wall project fixed at its original seam and source crop", () => {
    const [floor, wall] = FIXED_EXHIBITS[2];
    expect(FIXED_EXHIBITS[2]).toHaveLength(2);
    expect([floor.surface, wall.surface]).toEqual(["floor", "right"]);
    expect(floor.points[1]).toEqual(wall.points[0]);
    expect(floor.points[2]).toEqual(wall.points[3]);
    expect(floor.uv[1]).toEqual(wall.uv[0]);
    expect(floor.uv[2]).toEqual(wall.uv[3]);
    expect(floor.points[0][0]).toBeCloseTo(3.2);
    expect(floor.points[0].slice(1)).toEqual([-4.5, -7]);
    expect(wall.points[1][1]).toBeCloseTo(4.5 - 27 / 7);
    expect(floor.uv[0][0]).toBe(0);
    expect(wall.uv[1][0]).toBe(1);
  });
  it("bounds pointer parallax and render resolution even for invalid input", () => {
    expect(boundedPointer(10, -10)).toMatchObject({ x: 1, y: -1, yaw: Math.PI / 80, pitch: Math.PI / 80 });
    expect(boundedPointer(NaN, Infinity)).toMatchObject({ x: 0, y: 0 });
    expect(boundedPixelRatio(4)).toBe(1.5); expect(boundedPixelRatio(NaN)).toBe(1);
  });
  it("maps one room-space illumination color from blue-left to red-right", () => {
    expect(roomSignalMix(-8)).toBe(0);
    expect(roomSignalMix(0)).toBe(.5);
    expect(roomSignalMix(8)).toBe(1);
    expect(roomSignalMix(-80)).toBe(0);
    expect(roomSignalMix(80)).toBe(1);
    expect(roomSignalMix(NaN)).toBe(.5);
  });
});

describe("hero sleeping RAF lifecycle", () => {
  it("deduplicates, sleeps on settlement, cancels while hidden, and cannot wake after disposal", () => {
    let callback: FrameRequestCallback = () => undefined;
    const clock = { request: vi.fn((cb: FrameRequestCallback) => { callback = cb; return 7; }), cancel: vi.fn() };
    const render = vi.fn(() => false), loop = createHeroFrameLoop(render, clock);
    loop.wake(); loop.wake(); expect(clock.request).toHaveBeenCalledTimes(1);
    callback(100); expect(render).toHaveBeenCalledTimes(1); expect(clock.request).toHaveBeenCalledTimes(1);
    loop.wake(); loop.suspend(true); expect(clock.cancel).toHaveBeenCalledWith(7);
    callback(200); expect(render).toHaveBeenCalledTimes(1);
    loop.suspend(false); expect(clock.request).toHaveBeenCalledTimes(3);
    loop.dispose(); loop.wake(); callback(300);
    expect(clock.request).toHaveBeenCalledTimes(3); expect(render).toHaveBeenCalledTimes(1);
  });
});
