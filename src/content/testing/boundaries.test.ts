import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
function files(dir: string): string[] { return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? files(join(dir, entry.name)) : [join(dir, entry.name)]); }
describe("content boundaries", () => {
 it("does not allow client modules to import server or internal content", () => { const sourceFiles = files(join(process.cwd(), "src")).filter((file) => /\.(ts|tsx)$/.test(file)); for (const file of sourceFiles) { const source = readFileSync(file, "utf8"); if (/^\s*["']use client["']/.test(source)) expect(source, file).not.toMatch(/@\/content\/(server|internal)|\.\.\/content\/(server|internal)/); } });
});
