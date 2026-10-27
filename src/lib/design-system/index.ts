import "server-only";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parseDesignSpec } from "./parse-spec";
import { designTokens } from "./tokens";
export function loadDesignSpec() {
  const spec = parseDesignSpec(
    readFileSync(join(process.cwd(), "docs/architecture/design.md"), "utf8"),
  );
  if (JSON.stringify(spec.tokens) !== JSON.stringify(designTokens)) {
    throw new Error("Design document and canonical tokens diverge; synchronize before rendering the guide.");
  }
  return spec;
}
export * from "./tokens";
export * from "./parse-spec";
export * from "./color-families";
