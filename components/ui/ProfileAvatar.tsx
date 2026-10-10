import OptimizedImage from "./OptimizedImage";

const FALLBACK_STYLES = [
    "bg-(--brand)/10 text-(--brand)",
    "bg-(--brand)/15 text-(--brand)",
    "bg-(--secondary)/10 text-(--secondary)",
    "bg-(--flourish)/25 text-[#1A1C1E]",
    "bg-(--foreground)/8 text-(--foreground)",
] as const;

function fallbackIndex(seed: string): number {
    let hash = 0;
    for (let i = 0; i < seed.length; i += 1) {
        hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
    }
    return hash % FALLBACK_STYLES.length;
}

type ProfileAvatarProps = {
    name: string;
    userId: string;
    imageUrl?: string | null;
    /** Texto accesible del fallback (ya localizado). */
    fallbackLabel?: string;
    className?: string;
};

/**
 * Avatar de perfil (ver `design.md` §4): foto opcional o inicial con
 * color determinista por `userId`. Estable entre renders.
 */
export default function ProfileAvatar({
    name,
    userId,
    imageUrl,
    fallbackLabel,
    className = "size-20 text-3xl sm:size-24 sm:text-4xl",
}: ProfileAvatarProps) {
    const base = `relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-bold ${className}`;
    if (imageUrl) {
        return (
            <span className={base}>
                <OptimizedImage
                    src={imageUrl}
                    alt={name}
                    variant="avatar"
                    className="object-cover"
                />
            </span>
        );
    }
    const initial = name.trim().charAt(0).toUpperCase() || "•";
    return (
        <span
            role="img"
            aria-label={fallbackLabel ?? name}
            className={`${base} ${FALLBACK_STYLES[fallbackIndex(userId)]}`}
        >
            <span aria-hidden="true">{initial}</span>
        </span>
    );
}
