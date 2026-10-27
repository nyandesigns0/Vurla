// Shared by the initial CSS tile generator and the animated canvas initializer.
export const GRAIN_CELL = 2;
export const GRAIN_DENSITY = 0.65;
export const GRAIN_TILE_SIZE = 128;

/** @param {number} x @param {number} y */
export function grainCell(x, y) {
  let hash = ((x % GRAIN_TILE_SIZE) + (y % GRAIN_TILE_SIZE) * GRAIN_TILE_SIZE + 0x7f4a7c15) | 0;
  hash = Math.imul(hash ^ (hash >>> 16), 0x45d9f3b);
  hash = Math.imul(hash ^ (hash >>> 16), 0x45d9f3b);
  return ((hash ^ (hash >>> 16)) >>> 0) / 0x100000000 < GRAIN_DENSITY;
}
