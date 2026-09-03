import { readFileSync } from "node:fs";
import { join } from "node:path";
export function parseDesignSpec(source: string) { const match = source.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/); if (!match) throw new Error("Design document requires JSON frontmatter."); return { tokens: JSON.parse(match[1]) as unknown, markdown: match[2] }; }
export function loadDesignSpec() { return parseDesignSpec(readFileSync(join(process.cwd(), "docs/architecture/design.md"), "utf8")); }
