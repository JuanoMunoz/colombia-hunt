"use client";

import { useCallback, useEffect, useRef } from "react";
import { uploadApi } from "../../lib/http-client";

const DELETE_ENDPOINT = "/api/uploadthing/files/delete";

/**
 * Evita que queden imágenes huérfanas en UploadThing.
 *
 * - Al reemplazar una subida de esta sesión, borra la anterior.
 * - Si el formulario se abandona sin guardar (desmontar o cerrar pestaña),
 *   borra la última subida pendiente.
 * - Al guardar, `markSaved()` protege la imagen definitiva (el servidor
 *   también la marca como "adjunta").
 *
 * Solo aplica a archivos subidos en esta sesión: la imagen persistida que se
 * precarga al editar nunca entra como pendiente, así que no se borra al salir.
 */
export function useUploadCleanup() {
    const pendingKeyRef = useRef<string | null>(null);
    const savedRef = useRef(false);

    const discard = useCallback((key: string) => {
        void uploadApi.remove([key]).catch(() => {
            // Best-effort: si falla, el servidor lo tratará como huérfano.
        });
    }, []);

    const replaceUpload = useCallback(
        (key: string) => {
            const previous = pendingKeyRef.current;
            if (previous && previous !== key) discard(previous);
            pendingKeyRef.current = key;
        },
        [discard],
    );

    const discardPending = useCallback(() => {
        const key = pendingKeyRef.current;
        if (!key) return;
        pendingKeyRef.current = null;
        discard(key);
    }, [discard]);

    const markSaved = useCallback(() => {
        savedRef.current = true;
        pendingKeyRef.current = null;
    }, []);

    useEffect(() => {
        const cleanupOnUnload = () => {
            const key = pendingKeyRef.current;
            if (!key || savedRef.current) return;
            const body = JSON.stringify({ keys: [key] });
            try {
                if (typeof navigator !== "undefined" && navigator.sendBeacon) {
                    navigator.sendBeacon(
                        DELETE_ENDPOINT,
                        new Blob([body], { type: "application/json" }),
                    );
                    return;
                }
                void fetch(DELETE_ENDPOINT, {
                    method: "POST",
                    credentials: "same-origin",
                    keepalive: true,
                    headers: { "Content-Type": "application/json" },
                    body,
                });
            } catch {
                // Best-effort.
            }
        };

        window.addEventListener("beforeunload", cleanupOnUnload);
        return () => {
            window.removeEventListener("beforeunload", cleanupOnUnload);
            if (!savedRef.current && pendingKeyRef.current) {
                discard(pendingKeyRef.current);
            }
        };
    }, [discard]);

    return { replaceUpload, discardPending, markSaved };
}
