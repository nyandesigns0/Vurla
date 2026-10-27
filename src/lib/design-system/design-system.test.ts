import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { extname, join } from "node:path";
import {
  loadDesignSpec,
  designTokens,
  cssVariablesFromTokens,
  parseDesignSpec,
  parseProseBlocks,
  colorFamilies,
  colorHeroes,
  contrastRatio,
} from "./index";
describe("canonical design system", () => {
  it("uses a single shared Services-reference dot field across every route", () => {
    const home = readFileSync("src/app/globals.css", "utf8");
    const family = readFileSync("src/components/site/page-family.css", "utf8");
    const dots = readFileSync("src/components/site/dot-texture.css", "utf8");
    expect(dots).toContain("--dot-repeat: clamp(9.75px, 1.17vw, 17.55px)");
    expect(dots).toContain("32%, transparent) 0.75px, transparent 1px)");
    expect(home).not.toContain("0.75px, transparent 1px");
    expect(family).not.toContain("--pf-dots");
    for (const file of ["src/components/site/PagePlate.tsx", "src/components/site/ClosingPanel.tsx", "src/features/home/home-page-client.tsx", "src/features/home/selected-projects.tsx", "src/features/projects/projects-page-client.tsx", "src/features/contact/contact-page-client.tsx", "src/features/projects/project-detail-page.tsx"]) {
      expect(readFileSync(file, "utf8")).toContain("<DotTexture");
    }
  });
  const sourceFiles = (directory: string): string[] => readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? sourceFiles(path) : [path];
  });
  it("names bounded motion timings and a static reusable texture", () => {
    expect(designTokens.motion["hero-idle"]).toBe("1500ms");
    expect(designTokens.motion["hero-deceleration"]).toBe("200ms");
    expect(parseInt(designTokens.motion["statistics-boot"])).toBeLessThanOrEqual(900);
    expect(parseInt(designTokens.motion["route-handoff"])).toBeGreaterThanOrEqual(250);
    expect(parseInt(designTokens.motion["route-handoff"])).toBeLessThanOrEqual(400);
    expect(parseInt(designTokens.motion["glyph-scan"])).toBeGreaterThanOrEqual(220);
    expect(parseInt(designTokens.motion["glyph-scan"])).toBeLessThanOrEqual(320);
    expect(Number(designTokens.texture.opacity)).toBeLessThanOrEqual(0.05);
    const svg = readFileSync("public/textures/toner-grain.svg", "utf8");
    expect(svg).not.toMatch(/<script|<animate|<filter|<image/);
  });
  it("synchronizes complete document, typed tokens and exact CSS variables", () => {
    expect(loadDesignSpec().tokens).toEqual(designTokens);
    const css = readFileSync("src/app/design-system.css", "utf8");
    expect(
      Object.fromEntries(
        [...css.matchAll(/(--ds-[\w-]+):\s*([^;]+);/g)].map((m) => [
          m[1],
          m[2].trim(),
        ]),
      ),
    ).toEqual(cssVariablesFromTokens());
  });
  it("defines every consumed ds variable and keeps physical literals in authorities or explicit tests", () => {
    const css = readFileSync("src/app/design-system.css", "utf8");
    const definitions = new Set([...css.matchAll(/(--ds-[\w-]+):/g)].map((match) => match[1]));
    const inspected = sourceFiles("src").filter((file) => [".css", ".ts", ".tsx"].includes(extname(file)));
    const missing = inspected.flatMap((file) => [...readFileSync(file, "utf8").matchAll(/var\((--ds-[\w-]+)/g)]
      .filter((match) => !match[1].endsWith("-"))
      .map((match) => `${file}:${match[1]}`)
      .filter((entry) => !definitions.has(entry.slice(entry.lastIndexOf(":") + 1))));
    expect(missing).toEqual([]);

    const allowedLiteralFiles = new Set([
      join("src", "app", "design-system.css"),
      join("src", "lib", "design-system", "tokens.ts"),
      join("src", "lib", "design-system", "design-system.test.ts"),
      join("src", "features", "design", "color-copy-button.test.tsx"),
    ]);
    const primitives = Object.values(designTokens.color).map((value) => value.toLowerCase());
    const bypasses = inspected.filter((file) => !allowedLiteralFiles.has(file)).flatMap((file) => {
      const source = readFileSync(file, "utf8").toLowerCase();
      return primitives.filter((literal) => source.includes(literal)).map((literal) => `${file}:${literal}`);
    });
    expect(bypasses).toEqual([]);
  });
  it("keeps the nine COGH guide chapters", () =>
    expect(loadDesignSpec().sections.map((s) => s.id)).toEqual([
      "overview",
      "colors",
      "typography",
      "layout",
      "elevation-and-depth",
      "shapes",
      "borders-and-outlines",
      "components",
      "dos-and-donts",
    ]));
  it("defaults every structural corner to square", () => {
    expect(designTokens.radius).toEqual({ none: "0px" });
  });
  it("defines exactly six physical colors and maps every role to a primitive", () => {
    expect(designTokens.color).toEqual({
      night: "#121212", graphite: "#505050", mineral: "#C4BEB1",
      paper: "#F4F3F0", red: "#B22D18", blue: "#33539C",
    });
    expect(new Set(Object.values(designTokens.color)).size).toBe(6);
    for (const [role, primitive] of Object.entries(designTokens.semanticColor)) {
      expect(Object.keys(designTokens.color), role).toContain(primitive);
      expect(cssVariablesFromTokens()[`--ds-color-${role}`]).toBe(`var(--ds-color-${primitive})`);
    }
  });
  it("lists every color exactly once and uses correct hero roles", () => {
    const keys = colorFamilies.flatMap((f) => f.tokens);
    expect(new Set(keys).size).toBe(keys.length);
    expect([...keys].sort()).toEqual(Object.keys(designTokens.color).sort());
    expect(colorHeroes.map((h) => h.token)).toEqual([
      "night", "graphite", "mineral", "paper", "red", "blue",
    ]);
  });
  it("measures contrast and validates production text pairings", () => {
    expect(contrastRatio("#ffffff", "#000000")).toBe(21);
    expect(contrastRatio("#ffffff", "#ffffff")).toBe(1);
    for (const [a, b] of [
      ["ink", "surface"],
      ["on-primary", "primary"],
      ["error-text", "error-container"],
    ] as const)
      expect(
        contrastRatio(designTokens.color[designTokens.semanticColor[a]], designTokens.color[designTokens.semanticColor[b]]),
      ).toBeGreaterThanOrEqual(4.5);
  });
  it("rejects malformed frontmatter and handles BOM/CRLF", () => {
    for (const source of [
      "# absent",
      "---\ninvalid\n---\nbody",
      "---\n[]\n---\nbody",
    ])
      expect(() => parseDesignSpec(source)).toThrow();
    expect(
      parseDesignSpec("\uFEFF---\r\n{}\r\n---\r\n## Colors\r\nText").sections[0]
        .id,
    ).toBe("colors");
    expect(
      parseProseBlocks("Intro.\r\n\r\n### Roles\r\n\r\n- First\r\n- Second"),
    ).toEqual([
      { type: "p", text: "Intro." },
      { type: "h3", text: "Roles" },
      { type: "ul", items: ["First", "Second"] },
    ]);
  });
});
