/**
 * Presets del sistema de compresión lossless (ver `design.md` §4).
 * `maxLongEdge`: borde largo máximo en px; todo lo mayor se reduce
 * proporcionalmente. `quality`: 1.0 = lossless; reservado para un futuro
 * modo lossy (p. ej. 0.82) sin reescribir el pipeline.
 */
export type ImagePreset = {
    maxLongEdge: number;
    quality: number;
};

export const PROJECT_IMAGE_PRESET: ImagePreset = {
    maxLongEdge: 1920,
    quality: 1.0,
};

export const AVATAR_PRESET: ImagePreset = {
    maxLongEdge: 512,
    quality: 1.0,
};
