import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

// Temporary backport of https://github.com/vercel/next.js/pull/98168.
// Remove after upgrading to a release that includes the upstream fix.
// Keep the request socket for protocol/address detection, but detach the
// internal response from the first client's lifetime before serving the file.
const require = createRequire(import.meta.url);
const packagePath = require.resolve("next/package.json");
const { version } = JSON.parse(readFileSync(packagePath, "utf8"));
if (version !== "15.5.28") {
  throw new Error(
    `Review the image cancellation backport for Next ${version}.`,
  );
}

for (const [relativePath, parser] of [
  ["dist/server/image-optimizer.js", "_url.default"],
  ["dist/esm/server/image-optimizer.js", "nodeUrl"],
]) {
  const file = join(dirname(packagePath), relativePath);
  const source = readFileSync(file, "utf8");
  const before = `        await handleRequest(mocked.req, mocked.res, ${parser}.parse(href, true));`;
  const after = `        mocked.res.socket = null; // Vurla: Next #98168 cancellation backport\n${before}`;
  if (source.includes(after)) continue;
  if (source.split(before).length !== 2 || source.includes("Next #98168")) {
    throw new Error(`Unexpected Next optimizer source: ${relativePath}`);
  }
  writeFileSync(file, source.replace(before, after));
  console.log(`Applied image cancellation backport: ${relativePath}`);
}
