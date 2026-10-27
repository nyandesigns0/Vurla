import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

// Resolve every tool from this checkout, including when invoked from elsewhere.
const root = fileURLToPath(new URL("../", import.meta.url));
const checks = [
  ["node_modules/eslint/bin/eslint.js", "."],
  ["node_modules/typescript/bin/tsc", "--noEmit"],
  ["node_modules/vitest/vitest.mjs", "run"],
  ["--test", "scripts/image-optimizer-regression.mjs"],
  ["scripts/generate-grain-tile.mjs", "--check"],
  ["node_modules/next/dist/bin/next", "build"],
];
for (const [entry, ...args] of checks) {
  const result = spawnSync(process.execPath, [entry.startsWith("--") ? entry : path.join(root, entry), ...args], {
    cwd: root, stdio: "inherit", windowsHide: true,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
