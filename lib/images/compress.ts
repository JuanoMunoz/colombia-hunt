"use client";

import { AVATAR_PRESET, PROJECT_IMAGE_PRESET, type ImagePreset } from "./presets";

export type CompressPresetName = "project" | "avatar";

const PRESETS: Record<CompressPresetName, ImagePreset> = {
    project: PROJECT_IMAGE_PRESET,
    avatar: AVATAR_PRESET,
};

export type CompressResult = {
    /** Archivo listo para subir (comprimido o el original si no aplicó). */
    file: File;
    /** `true` cuando se devolvió el original sin tocar (fail-open / GIF / ya pequeño). */
    skipped: boolean;
};

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality = 1.0): Promise<Blob | null> {
    return new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob), type, quality);
    });
}

/**
 * Compresión lossless en el navegador: redibuja la imagen limitada a
 * `maxLongEdge`, lo que elimina metadatos EXIF y píxeles que nunca se
 * muestran. No altera píxeles visibles (calidad 1.0).
 *
 * Reglas fail-open: GIF (posible animación), SVG, archivos que ya caben
 * en el preset o cualquier error devuelven el archivo original intacto.
 */
export async function compressImage(
    input: File,
    presetName: CompressPresetName = "project",
): Promise<CompressResult> {
    const preset = PRESETS[presetName];
    const passthrough = { file: input, skipped: true } satisfies CompressResult;

    if (typeof window === "undefined" || typeof createImageBitmap === "undefined") {
        return passthrough;
    }
    // GIF animado y SVG: recomprimir destruiría animación o vectorizado.
    if (input.type === "image/gif" || input.type === "image/svg+xml") {
        return passthrough;
    }
    if (!input.type.startsWith("image/")) {
        return passthrough;
    }

    let bitmap: ImageBitmap | null = null;
    try {
        bitmap = await createImageBitmap(input);
        const { width, height } = bitmap;
        const longEdge = Math.max(width, height);
        if (!Number.isFinite(longEdge) || longEdge <= 0 || longEdge <= preset.maxLongEdge) {
            return passthrough;
        }

        const scale = preset.maxLongEdge / longEdge;
        const targetWidth = Math.max(1, Math.round(width * scale));
        const targetHeight = Math.max(1, Math.round(height * scale));

        const canvas = document.createElement("canvas");
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            return passthrough;
        }
        ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);

        const baseName = input.name.replace(/\.[a-zA-Z0-9]+$/, "") || "imagen";
        // WebP lossless del navegador; si no lo soporta, PNG (también lossless).
        const webpBlob = await canvasToBlob(canvas, "image/webp", preset.quality);
        if (webpBlob && webpBlob.size > 0 && webpBlob.size < input.size) {
            return {
                file: new File([webpBlob], `${baseName}.webp`, { type: "image/webp" }),
                skipped: false,
            };
        }
        const pngBlob = await canvasToBlob(canvas, "image/png");
        if (pngBlob && pngBlob.size > 0 && pngBlob.size < input.size) {
            return {
                file: new File([pngBlob], `${baseName}.png`, { type: "image/png" }),
                skipped: false,
            };
        }
        return passthrough;
    } catch {
        return passthrough;
    } finally {
        bitmap?.close();
    }
}
