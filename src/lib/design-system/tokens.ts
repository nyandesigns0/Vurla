export const designTokens = {
  color: {
    night: "#121212",
    graphite: "#505050",
    mineral: "#C4BEB1",
    paper: "#F4F3F0",
    red: "#B22D18",
    blue: "#33539C",
  },
  // Semantic roles reference physical primitives; compatibility roles migrate with consumers.
  semanticColor: {
      "page": "night",
      "panel": "graphite",
      "text": "paper",
      "muted": "mineral",
      "rule": "graphite",
      "focus": "paper",
      "action": "red",
      "action-hover": "blue",
      "current": "red",
      "error": "red",
      "success": "blue",
      "surface": "night",
      "surface-dim": "night",
      "surface-bright": "graphite",
      "surface-container-lowest": "night",
      "surface-container-low": "night",
      "surface-container": "graphite",
      "surface-container-high": "graphite",
      "surface-container-highest": "graphite",
      "on-surface": "paper",
      "on-surface-variant": "mineral",
      "inverse-surface": "paper",
      "inverse-on-surface": "night",
      "outline": "mineral",
      "outline-variant": "graphite",
      "surface-tint": "blue",
      "primary": "red",
      "on-primary": "paper",
      "primary-container": "red",
      "on-primary-container": "paper",
      "inverse-primary": "red",
      "secondary": "blue",
      "on-secondary": "paper",
      "secondary-container": "blue",
      "on-secondary-container": "paper",
      "tertiary": "mineral",
      "on-tertiary": "night",
      "tertiary-container": "mineral",
      "on-tertiary-container": "night",
      "on-error": "paper",
      "error-container": "red",
      "on-error-container": "paper",
      "primary-fixed": "red",
      "primary-fixed-dim": "red",
      "on-primary-fixed": "paper",
      "on-primary-fixed-variant": "paper",
      "secondary-fixed": "blue",
      "secondary-fixed-dim": "blue",
      "on-secondary-fixed": "paper",
      "on-secondary-fixed-variant": "paper",
      "tertiary-fixed": "mineral",
      "tertiary-fixed-dim": "mineral",
      "on-tertiary-fixed": "night",
      "on-tertiary-fixed-variant": "night",
      "background": "night",
      "on-background": "paper",
      "surface-variant": "graphite",
      "canvas": "night",
      "ink": "paper",
      "border": "mineral",
      "error-text": "paper"
  },
  font: {
    sans: "var(--font-chakra-petch), Arial, sans-serif",
    mono: "var(--font-share-tech-mono), monospace",
  },
  typography: {
    display: {
      family: "var(--font-share-tech-mono), monospace",
      size: "60px",
      leading: "68px",
      weight: "400",
      tracking: "-0.02em",
    },
    "headline-lg": {
      family: "var(--font-share-tech-mono), monospace",
      size: "44px",
      leading: "52px",
      weight: "400",
      tracking: "0em",
    },
    "headline-md": {
      family: "var(--font-share-tech-mono), monospace",
      size: "32px",
      leading: "40px",
      weight: "400",
      tracking: "0em",
    },
    "title-lg": {
      family: "var(--font-share-tech-mono), monospace",
      size: "24px",
      leading: "32px",
      weight: "400",
      tracking: "0em",
    },
    "body-lg": {
      family: "var(--font-chakra-petch), Arial, sans-serif",
      size: "18px",
      leading: "28px",
      weight: "400",
      tracking: "0em",
    },
    "body-md": {
      family: "var(--font-chakra-petch), Arial, sans-serif",
      size: "16px",
      leading: "24px",
      weight: "400",
      tracking: "0em",
    },
    "label-md": {
      family: "var(--font-share-tech-mono), monospace",
      size: "14px",
      leading: "20px",
      weight: "400",
      tracking: "0em",
    },
    "label-sm": {
      family: "var(--font-share-tech-mono), monospace",
      size: "12px",
      leading: "16px",
      weight: "400",
      tracking: "0em",
    },
  },
  space: {
    xs: "4px",
    sm: "12px",
    md: "24px",
    lg: "40px",
    xl: "64px",
    section: "96px",
    "section-lg": "128px",
  },
  layout: {
    shell: "1280px",
    gutter: "24px",
    columns: "12",
    reading: "640px",
    header: "72px",
  },
  radius: {
    none: "0px",
  },
  border: {
    width: "1px",
    style: "solid",
    focus: "2px",
    "focus-offset": "3px",
    "chapter-top": "1px",
    "chapter-gap": "5px",
    "chapter-bottom": "6px",
  },
  elevation: {
    none: "none",
    sm: "0 1px 2px rgb(18 18 18 / 5%)",
    md: "0 3px 8px rgb(18 18 18 / 15%)",
    lg: "0 8px 24px rgb(18 18 18 / 12%)",
  },
  texture: {
    none: "none",
    grain: 'url("/textures/toner-grain.svg")',
    scale: "128px",
    opacity: "0.04",
  },
  tone: {
    "blue-light": "color-mix(in srgb, var(--ds-color-blue) 15%, transparent)",
    "blue-grid": "color-mix(in srgb, var(--ds-color-blue) 33%, transparent)",
    "graphite-grid": "color-mix(in srgb, var(--ds-color-graphite) 20%, transparent)",
  },
  effects: {
    disabled: "0.5",
  },
  motion: {
    fast: "160ms",
    base: "240ms",
    hero: "450ms",
    dwell: "150ms",
    "hero-idle": "1500ms",
    "hero-deceleration": "200ms",
    "statistics-boot": "800ms",
    "route-handoff": "320ms",
    "glyph-scan": "260ms",
    ease: "cubic-bezier(0.22, 1, 0.36, 1)",
  },
  component: {
    target: "44px",
    "field-size": "16px",
    "button-padding": "12px 20px",
    "card-padding": "24px",
  },
} as const;
export type PrimitiveName = "night" | "graphite" | "mineral" | "paper" | "red" | "blue";
export type SemanticColorRole = "page" | "panel" | "text" | "muted" | "rule" | "focus" | "action" | "action-hover" | "current" | "error" | "success";
export type ComponentState = "default" | "hover" | "pressed" | "focus" | "disabled";
export const semanticColors = designTokens.semanticColor satisfies Record<SemanticColorRole, PrimitiveName>;
export type DesignTokens = typeof designTokens;
export type ColorToken = keyof DesignTokens["color"];
export function cssVariablesFromTokens(
  tokens: DesignTokens = designTokens,
): Record<string, string> {
  const result: Record<string, string> = {};
  function visit(value: object, prefix: string) {
    for (const [key, item] of Object.entries(value)) {
      if (typeof item === "object" && item !== null)
        visit(item, prefix + "-" + key);
      else result[prefix + "-" + key] = String(item);
    }
  }
  const { semanticColor, ...physicalTokens } = tokens;
  visit(physicalTokens, "--ds");
  for (const [role, primitive] of Object.entries(semanticColor)) {
    result[`--ds-color-${role}`] = `var(--ds-color-${primitive})`;
  }
  return result;
}
