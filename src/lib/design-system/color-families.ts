import { designTokens, type ColorToken } from "./tokens";
export const colorHeroes = Object.keys(designTokens.color).map((token) => ({
  label: token,
  token: token as ColorToken,
}));
export const colorFamilies = [{
  id: "Physical primitives",
  tokens: Object.keys(designTokens.color) as ColorToken[],
}];
export function relativeLuminance(hex: string) {
  if (!/^#[0-9a-f]{6}$/i.test(hex))
    throw new Error("Expected six-digit hex color");
  const values = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
}
export function contrastRatio(a: string, b: string) {
  const x = relativeLuminance(a),
    y = relativeLuminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
export function inkOn(fill: string) {
  const dark = designTokens.color.night,
    light = designTokens.color.paper;
  return contrastRatio(dark, fill) >= contrastRatio(light, fill) ? dark : light;
}
