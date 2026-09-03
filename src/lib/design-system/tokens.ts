export const designTokens = {
  color: { canvas: "#080808", paper: "#f8f8f6", mineral: "#858585", ink: "#171717", muted: "#686868", border: "#b6b6b1", focus: "#8a6d45" },
  font: { sans: "var(--font-geist-sans), Arial, sans-serif", mono: "var(--font-geist-mono), monospace" },
  space: { xs: "4px", sm: "12px", md: "24px", lg: "40px", xl: "64px" },
  radius: { none: "0px", md: "0px", xl: "0px", full: "9999px" },
  motion: { fast: "160ms", base: "240ms" },
} as const;
export type DesignTokens = typeof designTokens;
export function cssVariablesFromTokens(tokens: DesignTokens = designTokens) {
 const output: Record<string, string> = {};
 for (const [group, values] of Object.entries(tokens)) for (const [key, value] of Object.entries(values)) output[`--ds-${group}-${key}`] = value;
 return output;
}
