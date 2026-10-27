import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = fileURLToPath(new URL("../", import.meta.url));
process.chdir(root);
const base = process.env.BROWSER_BASE_URL ?? "http://127.0.0.1:4100";
const out = "output/finalization/browser";
await mkdir(out, { recursive: true });
const server = process.env.BROWSER_BASE_URL ? null : spawn(process.execPath,
  ["node_modules/next/dist/bin/next", "start", "-p", "4100"], { cwd: root, stdio: "inherit", windowsHide: true });
const records = [];
let browser;
let activePage;
try {
  for (let attempt = 0; ; attempt++) {
    try { if ((await fetch(base)).ok) break; } catch { /* wait for production server */ }
    if (attempt >= 60) throw new Error("Production server did not become ready");
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  browser = await chromium.launch({ headless: true, channel: process.env.BROWSER_CHANNEL || undefined });
  const discovery = await browser.newPage();
  await discovery.goto(`${base}/projects`);
  const projectPaths = await discovery.locator(".project-card--catalog").evaluateAll(cards => cards.map(card => card.getAttribute("href")));
  assert.equal(projectPaths.length, 9);
  await discovery.close();
  const routes = ["/", "/services", "/projects", ...projectPaths, "/contact"];
  const modes = [
    { name: "desktop", viewport: { width: 1440, height: 900 }, reducedMotion: "no-preference" },
    { name: "mobile", viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: "reduce" },
    { name: "no-js", viewport: { width: 1440, height: 900 }, javaScriptEnabled: false },
    { name: "no-js-mobile", viewport: { width: 390, height: 844 }, javaScriptEnabled: false, isMobile: true, hasTouch: true },
  ];
  for (const { name, ...options } of process.argv.includes("--interactions-only") ? [] : modes) {
    const context = await browser.newContext(options);
    const page = await context.newPage();
    activePage = page;
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    for (const route of routes) {
      const response = await page.goto(base + route, { waitUntil: "networkidle" });
      assert.equal(response.status(), 200, `${name}: ${route}`);
      await page.locator("main h1").waitFor({ state: "visible" });
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.locator("main").count(), 1);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${name}: overflow on ${route}`);
      const grain = await page.locator(".grain-texture").evaluateAll(nodes => nodes.map(node => ({
        ready: node.dataset.grainReady === "true", background: getComputedStyle(node).backgroundImage,
      })));
      assert(grain.length > 0 && grain.every(item => item.ready || item.background.includes("data:image/png")), `${name}: missing first-frame grain on ${route}`);
      if (route.startsWith("/projects/")) {
        assert.equal(await page.locator(".detail-gallery a, .detail-cover a").count(), 0);
        assert.equal(await page.locator("#detail-related-heading").count(), 1);
      }
      await page.screenshot({ path: `${out}/${name}-${route.replaceAll("/", "_") || "home"}.png` });
      records.push({ mode: name, route, heading: await page.locator("main h1").innerText(), grain: grain.length });
    }
    console.log(`${name}: ${routes.length} routes passed`);
    assert.deepEqual(errors, [], `${name}: browser errors`);
    await context.close();
  }

  // Exercise interactive behavior against the real production application.
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  activePage = page;
  console.log("Checking catalog interactions");
  await page.goto(`${base}/projects`, { waitUntil: "networkidle" });
  await page.locator(".project-card--catalog").last().scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Filter projects", exact: true }).click();
  await page.getByRole("button", { name: "Digital", exact: true }).click();
  await page.waitForFunction(() => document.querySelectorAll(".project-card--catalog").length === 1);
  const statusY = await page.locator(".catalog-status").evaluate(el => el.getBoundingClientRect().top);
  assert(statusY >= 0 && statusY < 900, "Filter must keep results in view");
  await page.getByRole("button", { name: "Reset filters" }).click();
  await page.waitForFunction(() => document.querySelectorAll(".project-card--catalog").length === 9);
  await page.locator(".project-card--catalog").first().hover();
  await page.waitForFunction(() => document.querySelector('[data-pointer-hover="true"]'));
  await page.mouse.wheel(0, 420);
  await page.waitForTimeout(400);
  const hoverMatches = await page.evaluate(() => {
    const hovered = document.querySelector('[data-pointer-hover="true"]');
    return !hovered || hovered.matches(":hover");
  });
  assert(hoverMatches, "Stationary pointer must follow scrolled cards");
  await page.goBack();
  await page.goForward();
  await page.goto(`${base}/services`, { waitUntil: "networkidle" });
  console.log("Checking service conversation and reverse transition");
  await page.locator("[data-service-preview]").first().click();
  await page.waitForTimeout(800);
  assert(await page.locator("#services-closing-heading").isVisible());
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(400);
  assert.equal(await page.locator('.closing-chapter[data-motion="enhanced"]').count(), 1, "Service navigation must preserve closing transition");

  await page.goto(`${base}/contact`, { waitUntil: "networkidle" });
  console.log("Checking contact validation and image submission");
  await page.getByRole("button", { name: /Submit preview/ }).click();
  await page.waitForFunction(() => document.querySelector("#contact-name")?.getAttribute("aria-invalid") === "true");
  assert.equal(await page.locator("#contact-name").getAttribute("aria-invalid"), "true");
  await page.locator("#contact-name").fill("Release verification");
  await page.waitForFunction(() => document.querySelector("#contact-name")?.getAttribute("value") === "Release verification");
  await page.locator("#contact-type").selectOption("phone");
  await page.locator('#contact-value[type="tel"]').waitFor();
  await page.locator('[name="contact"]').fill("6265550100");
  await page.waitForFunction(() => document.querySelector("#contact-value")?.getAttribute("value") === "6265550100");
  await page.locator("#contact-message").fill("Automated simulated contact verification.");
  await page.locator('input[type="file"]').setInputFiles({ name: "reference.png", mimeType: "image/png", buffer: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j3ioAAAAASUVORK5CYII=", "base64") });
  assert.deepEqual(await page.locator("form").evaluate(form => Object.fromEntries(new FormData(form))), {
    name: "Release verification", contactType: "phone", contact: "6265550100", message: "Automated simulated contact verification.",
  });
  const submission = page.waitForResponse(response => response.url().endsWith("/api/contact") && response.request().method() === "POST");
  await page.getByRole("button", { name: /Submit preview/ }).click();
  assert.equal((await submission).status(), 200);
  await page.locator(".faq-list summary").first().click();
  assert.equal(await page.locator(".faq-list details").first().getAttribute("open"), "");
  assert.match(await page.locator(".contact-map-link").getAttribute("href"), /google\.com\/maps/);
  const missing = await page.goto(`${base}/not-a-real-page`);
  assert.equal(missing.status(), 404);
  await context.close();

  const unavailable = await browser.newContext();
  await unavailable.addInitScript(() => {
    Object.defineProperty(window, "WebGL2RenderingContext", { value: undefined });
    HTMLCanvasElement.prototype.getContext = () => null;
  });
  const fallback = await unavailable.newPage();
  await fallback.goto(base, { waitUntil: "networkidle" });
  assert.equal(await fallback.locator('.spatial-hero[data-renderer="unavailable"]').count(), 1);
  assert(await fallback.getByRole("link", { name: /Explore selected work/ }).isVisible());
  assert((await fallback.locator(".grain-texture").first().evaluate(el => getComputedStyle(el).backgroundImage)).includes("data:image/png"));
  await unavailable.close();

  // Hold scripts back to inspect the initial styled frame, then recover normally.
  const delayed = await browser.newContext({ viewport: { width: 390, height: 844 } });
  let release;
  let gate = new Promise(resolve => { release = resolve; });
  await delayed.route("**/*.js*", async route => { await gate; await route.continue(); });
  const delayedPage = await delayed.newPage();
  activePage = delayedPage;
  for (const route of ["/", "/services", "/projects", projectPaths[0], "/contact"]) {
    const navigation = delayedPage.goto(base + route, { waitUntil: "load" });
    await delayedPage.locator("main h1").waitFor({ state: "visible" });
    const background = await delayedPage.locator(".grain-texture").first().evaluate(el => getComputedStyle(el).backgroundImage);
    assert(background.includes("data:image/png"), `Delayed scripts: missing grain on ${route}`);
    await delayedPage.screenshot({ path: `${out}/delayed-${route.replaceAll("/", "_") || "home"}.png` });
    release();
    await navigation;
    await delayedPage.waitForFunction(() => [...document.querySelectorAll(".grain-texture")].some(el => el.dataset.grainReady === "true"));
    gate = new Promise(resolve => { release = resolve; });
  }
  release();
  await delayed.close();
  records.push({ interactions: "passed", delayedScripts: "passed", unavailableCanvas: "passed" });
  console.log(`Browser verification passed: ${records.filter(record => record.route).length} route/mode checks, interactions, delayed scripts, canvas fallback.`);
} catch (error) {
  if (activePage && !activePage.isClosed()) {
    await activePage.screenshot({ path: `${out}/failure.png`, timeout: 5000 }).catch(() => {});
    await writeFile(`${out}/failure.html`, await activePage.content().catch(() => ""));
  }
  throw error;
} finally {
  await writeFile(`${out}/results.json`, JSON.stringify(records, null, 2));
  await browser?.close();
  server?.kill();
}
