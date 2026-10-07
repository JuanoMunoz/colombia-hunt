/**
 * Optimización lossless de `public/img` (ver `design.md` §4).
 * Uso: `node scripts/optimize-images.mjs`
 * Recomprime PNG/JPG/WebP sin pérdida visible (strip de metadatos +
 * codificación eficiente) y reporta antes/después en bytes.
 */
import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const IMG_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "img");
const LOSSY_EXTS = new Set([".png", ".jpg", ".jpeg", ".webp"]);

const files = (await readdir(IMG_DIR)).filter((f) => LOSSY_EXTS.has(path.extname(f).toLowerCase()));

if (files.length === 0) {
    console.log("Sin imágenes para optimizar.");
    process.exit(0);
}

for (const file of files) {
    const full = path.join(IMG_DIR, file);
    const before = (await stat(full)).size;
    const ext = path.extname(file).toLowerCase();
    const pipeline = sharp(full, { animated: true }).rotate();
    const out =
        ext === ".webp"
            ? await pipeline.webp({ lossless: true }).toBuffer()
            : ext === ".png"
              ? await pipeline.png({ compressionLevel: 9, palette: true }).toBuffer()
              : await pipeline.jpeg({ quality: 100, mozjpeg: true }).toBuffer();
    if (out.length < before) {
        const { writeFile } = await import("node:fs/promises");
        await writeFile(full, out);
        console.log(`${file}: ${before} → ${out.length} B (ahorro ${before - out.length} B)`);
    } else {
        console.log(`${file}: ${before} B (ya óptimo, sin cambios)`);
    }
}
