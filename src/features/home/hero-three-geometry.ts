type Surface = "left" | "right" | "back" | "ceiling" | "floor";
export type Point3 = readonly [number, number, number];
export type UV = readonly [number, number];
export type RoomQuad = { surface: Surface; points: readonly [Point3, Point3, Point3, Point3]; uv: readonly [UV, UV, UV, UV] };
const fullUV = [[0, 1], [1, 1], [1, 0], [0, 0]] as const;
export const ROOM = { halfWidth: 8, halfHeight: 4.5, back: -7, front: 7 } as const;
export const HALLWAY_BACK = -889;
export const HALLWAY_DEPTH_DIVISIONS = 640;
const WALL_ROWS = 7;
const SURFACE_COLUMNS = 10;
const DEPTH_ROWS = 10;

const subdivide = (start: number, end: number, divisions: number, index: number) =>
  start + ((end - start) * index) / divisions;

// Project planes are authored from the same subdivisions used by the room shader.
// Keeping these coordinates centralized prevents a plane edge from drifting into a grid cell.
const roomXLine = (index: number) => subdivide(-ROOM.halfWidth, ROOM.halfWidth, SURFACE_COLUMNS, index);
const roomYLine = (index: number) => subdivide(ROOM.halfHeight, -ROOM.halfHeight, WALL_ROWS, index);
const roomDepthLine = (index: number) => subdivide(ROOM.back, ROOM.front, DEPTH_ROWS, index);
const renderedBack = HALLWAY_BACK;
const corridorSurfaces: readonly RoomQuad[] = [
  { surface: "left", points: [[-8, 4.5, ROOM.front], [-8, 4.5, renderedBack], [-8, -4.5, renderedBack], [-8, -4.5, ROOM.front]], uv: fullUV },
  { surface: "right", points: [[8, 4.5, renderedBack], [8, 4.5, ROOM.front], [8, -4.5, ROOM.front], [8, -4.5, renderedBack]], uv: fullUV },
  { surface: "ceiling", points: [[-8, 4.5, ROOM.front], [8, 4.5, ROOM.front], [8, 4.5, renderedBack], [-8, 4.5, renderedBack]], uv: fullUV },
  { surface: "floor", points: [[-8, -4.5, renderedBack], [8, -4.5, renderedBack], [8, -4.5, ROOM.front], [-8, -4.5, ROOM.front]], uv: fullUV },
];
export const THREE_ROOM_SURFACES: readonly RoomQuad[] = corridorSurfaces;

// Both faces use precisely the same hinge vertices and source-image edge.
// Unwrapping the fold makes a single rectangle; no independent cover crops.
export function upperFold(side: "left" | "right"): readonly RoomQuad[] {
  const sign = side === "left" ? -1 : 1;
  const near = roomDepthLine(6), far = roomDepthLine(3);
  const innerX = roomXLine(side === "left" ? 2 : 7);
  const wallBottom = roomYLine(side === "left" ? 3 : 2);
  const ceilingSpan = ROOM.halfWidth - Math.abs(innerX);
  const wallSpan = ROOM.halfHeight - wallBottom;
  const hingeV = side === "left" ? .5 : wallSpan / (wallSpan + ceilingSpan);
  const seam: readonly [Point3, Point3] = [[sign * 8, 4.5, near], [sign * 8, 4.5, far]];
  return [
    { surface: "ceiling", points: [[innerX, 4.5, near], [innerX, 4.5, far], seam[1], seam[0]], uv: [[0, 1], [1, 1], [1, hingeV], [0, hingeV]] },
    { surface: side, points: [seam[0], seam[1], [sign * 8, wallBottom, far], [sign * 8, wallBottom, near]], uv: [[0, hingeV], [1, hingeV], [1, 0], [0, 0]] },
  ];
}

// The floor/right-wall image stays on the room grid at its authored position.
// Both faces share hinge vertices and one continuous source-image crop.
function lowerRightFold(): readonly RoomQuad[] {
  const startX = roomXLine(7), wallTop = roomYLine(3);
  const near = roomDepthLine(0), far = roomDepthLine(3);
  const floorSpan = ROOM.halfWidth - startX;
  const wallSpan = wallTop + ROOM.halfHeight;
  const hingeU = floorSpan / (floorSpan + wallSpan);
  return [
    { surface: "floor", points: [[startX, -ROOM.halfHeight, near], [ROOM.halfWidth, -ROOM.halfHeight, near], [ROOM.halfWidth, -ROOM.halfHeight, far], [startX, -ROOM.halfHeight, far]], uv: [[0, 1], [hingeU, 1], [hingeU, 0], [0, 0]] },
    { surface: "right", points: [[ROOM.halfWidth, -ROOM.halfHeight, near], [ROOM.halfWidth, wallTop, near], [ROOM.halfWidth, wallTop, far], [ROOM.halfWidth, -ROOM.halfHeight, far]], uv: [[hingeU, 1], [1, 1], [1, 0], [hingeU, 0]] },
  ];
}

export const FIXED_EXHIBITS: readonly (readonly RoomQuad[])[] = [
  [{ surface: "floor", points: [[roomXLine(4), -4.5, roomDepthLine(3)], [roomXLine(7), -4.5, roomDepthLine(3)], [roomXLine(7), -4.5, roomDepthLine(5)], [roomXLine(4), -4.5, roomDepthLine(5)]], uv: fullUV }],
  // Baker House uses the near right wall.
  [{ surface: "right", points: [[8, roomYLine(3), roomDepthLine(6)], [8, roomYLine(3), roomDepthLine(9)], [8, roomYLine(6), roomDepthLine(9)], [8, roomYLine(6), roomDepthLine(6)]], uv: fullUV }],
  lowerRightFold(),
  upperFold("right"),
  upperFold("left"),
  [{ surface: "left", points: [[-8, roomYLine(3), roomDepthLine(9)], [-8, roomYLine(3), roomDepthLine(6)], [-8, roomYLine(6), roomDepthLine(6)], [-8, roomYLine(6), roomDepthLine(9)]], uv: fullUV }],
  [{ surface: "floor", points: [[roomXLine(1), -4.5, roomDepthLine(5)], [roomXLine(4), -4.5, roomDepthLine(5)], [roomXLine(4), -4.5, roomDepthLine(8)], [roomXLine(1), -4.5, roomDepthLine(8)]], uv: fullUV }],
];

export const ROOM_GRID_LINE_WIDTH_PX = .75;

export function roomGridScale(surface: Surface): readonly [columns: number, rows: number] {
  if (surface === "back") return [SURFACE_COLUMNS, WALL_ROWS];
  const depthDivisions = HALLWAY_DEPTH_DIVISIONS;
  return surface === "floor" || surface === "ceiling"
    ? [SURFACE_COLUMNS, depthDivisions]
    : [depthDivisions, WALL_ROWS];
}

export function boundedPointer(x: number, y: number) {
  const clamp = (n: number) => Math.max(-1, Math.min(1, Number.isFinite(n) ? n : 0));
  return { x: clamp(x), y: clamp(y), yaw: clamp(x) * Math.PI / 80, pitch: -clamp(y) * Math.PI / 80 };
}

export function roomSignalMix(x: number) {
  const position = Number.isFinite(x) ? x : 0;
  return Math.max(0, Math.min(1, (position + ROOM.halfWidth) / (ROOM.halfWidth * 2)));
}

export function boundedPixelRatio(dpr: number) { return Math.min(1.5, Math.max(1, Number.isFinite(dpr) ? dpr : 1)); }
