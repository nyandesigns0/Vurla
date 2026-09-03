import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { cssVariablesFromTokens, designTokens, loadDesignSpec } from "./index";
describe("design system", () => {
 it("keeps Markdown frontmatter aligned with TypeScript tokens", () => { expect(loadDesignSpec().tokens).toEqual(designTokens); });
 it("defines every generated custom property in CSS", () => { const css = readFileSync("src/app/design-system.css", "utf8"); for (const [name, value] of Object.entries(cssVariablesFromTokens())) expect(css).toContain(`${name}: ${value}`); });
});
