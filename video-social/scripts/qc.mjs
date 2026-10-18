import { chromium } from "playwright-core";
import { mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, "..", "captures", "_qcview");
const APP = process.env.APP_URL ?? "http://localhost:3210";

const browser = await chromium.launch({ channel: "chrome", headless: true });
await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

const variants = [
  { name: "a_dpr1", viewport: { width: 540, height: 960 }, dpr: 1, video: { width: 1080, height: 1920 } },
  { name: "b_dpr2", viewport: { width: 540, height: 960 }, dpr: 2, video: { width: 1080, height: 1920 } },
  { name: "c_native", viewport: { width: 1080, height: 1920 }, dpr: 1, video: { width: 1080, height: 1920 } },
];

for (const v of variants) {
  const context = await browser.newContext({
    viewport: v.viewport,
    deviceScaleFactor: v.dpr,
    colorScheme: "light",
    recordVideo: { dir: OUT, size: v.video },
  });
  const page = await context.newPage();
  await page.goto(`${APP}/proyectos/16`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await page.close();
  const p = await page.video().path();
  console.log(`${v.name}: ${p}`);
  await context.close();
}

await browser.close();
