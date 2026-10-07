import Image from "next/image";

export type OptimizedImageVariant = "card" | "detail" | "preview" | "avatar";

const SIZES: Record<OptimizedImageVariant, string> = {
    card: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
    detail: "(max-width: 1024px) 100vw, 960px",
    preview: "(max-width: 640px) 100vw, 576px",
    avatar: "128px",
};

type OptimizedImageProps = {
    src: string;
    /** Texto alternativo en español (obligatorio por SEO/i18n). */
    alt: string;
    variant: OptimizedImageVariant;
    className?: string;
    priority?: boolean;
};

/**
 * Imagen optimizada reutilizable (ver `design.md` §4).
 * Usa la optimización de Next (AVIF/WebP + `remotePatterns` UploadThing);
 * `priority` solo above-the-fold.
 */
export default function OptimizedImage({
    src,
    alt,
    variant,
    className,
    priority = false,
}: OptimizedImageProps) {
    return (
        <Image
            src={src}
            alt={alt}
            fill
            sizes={SIZES[variant]}
            className={className}
            priority={priority}
        />
    );
}
