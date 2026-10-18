import { chromium } from "playwright-core";
import { mkdir, rename, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, "..", "captures");
const TMP = path.resolve(OUT, "_tmp");

const APP = process.env.APP_URL ?? "http://localhost:3210";
const EMAIL = process.env.HH_EMAIL ?? "";
const PASSWORD = process.env.HH_PASSWORD ?? "";

const VIEWPORT = { width: 540, height: 960 };
const DPR = 1;
const VIDEO = { width: 540, height: 960 };

async function smoothScroll(page, total, durationMs) {
  await page.evaluate(
    ([total, durationMs]) =>
      new Promise((resolve) => {
        const start = performance.now();
        const from = window.scrollY;
        const step = (now) => {
          const t = Math.min(1, (now - start) / durationMs);
          const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
          window.scrollTo(0, from + (total - from) * eased);
          if (t < 1) requestAnimationFrame(step);
          else resolve();
        };
        requestAnimationFrame(step);
      }),
    [total, durationMs],
  );
}

async function newCtx(browser) {
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: DPR,
    colorScheme: "light",
    reducedMotion: "no-preference",
    recordVideo: { dir: TMP, size: VIDEO },
  });
  return context;
}

async function finish(page, name) {
  const video = page.video();
  await page.close();
  const src = await video.path();
  const dest = path.join(OUT, `${name}.webm`);
  await rename(src, dest);
  console.log(`saved ${dest}`);
}

const browser = await chromium.launch({ channel: "chrome", headless: true });
await rm(TMP, { recursive: true, force: true });
await mkdir(TMP, { recursive: true });

const ONLY = (process.env.ONLY ?? "").split(",").map((s) => s.trim()).filter(Boolean);
const want = (name) => ONLY.length === 0 || ONLY.includes(name);

const results = [];
async function scene(name, fn, opts = {}) {
  if (!want(name)) return;
  const context = await newCtx(browser);
  const page = await context.newPage();
  try {
    await fn(page, context);
    results.push(name);
  } catch (err) {
    console.error(`scene ${name} FAILED: ${err.message}`);
  } finally {
    await finish(page, name);
    await context.close();
  }
}

await scene("login", async (page) => {
  await page.goto(`${APP}/iniciar-sesion`, { waitUntil: "networkidle" });
  await page.waitForTimeout(900);
  const email = page.locator('input[type="email"], input[name="email"]').first();
  await email.click();
  await page.waitForTimeout(250);
  await email.type("tu@correo.com", { delay: 90 });
  await page.waitForTimeout(1400);
});

await scene("proyectos", async (page) => {
  await page.goto(`${APP}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  await smoothScroll(page, 900, 1600);
  await page.waitForTimeout(700);
  await smoothScroll(page, 2100, 2600);
  await page.waitForTimeout(900);
});

await scene("detalle", async (page) => {
  await page.goto(`${APP}/proyectos/16`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  await smoothScroll(page, 1000, 1800);
  await page.waitForTimeout(900);
  await smoothScroll(page, 2000, 2000);
  await page.waitForTimeout(900);
});

await scene("comentarios", async (page) => {
  await page.goto(`${APP}/proyectos/16`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  await smoothScroll(page, 99999, 3200);
  await page.waitForTimeout(2200);
});

if (EMAIL && PASSWORD) {
  await scene("perfil", async (page) => {
    await page.goto(`${APP}/iniciar-sesion`, { waitUntil: "networkidle" });
    await page.locator('input[type="email"], input[name="email"]').first().fill(EMAIL);
    await page.locator('input[type="password"]').first().fill(PASSWORD);
    await Promise.all([
      page.waitForURL(/\/perfil/, { timeout: 30000 }).catch(() => {}),
      page.locator('button[type="submit"]').first().click(),
    ]);
    await page.waitForTimeout(1500);
    await page.goto(`${APP}/perfil`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1200);
    await smoothScroll(page, 1300, 2000);
    await page.waitForTimeout(900);
    await smoothScroll(page, 2400, 2200);
    await page.waitForTimeout(1200);
  });
} else {
  console.log("skipping perfil scene (no HH_EMAIL/HH_PASSWORD)");
}

await browser.close();
console.log(`done: ${results.join(", ")}`);
