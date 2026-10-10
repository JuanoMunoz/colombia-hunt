"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { getDict } from "../../app/i18n/dictionaries";
import { useLanguage } from "../../app/i18n/LanguageContext";
import { signOut } from "../../app/lib/auth-client";
import { LogoutIcon } from "./icons";

type SignOutButtonProps = {
    className?: string;
    variant?: "default" | "danger" | "menu";
};

/**
 * Cierre de sesión (ver `design.md` §4): `signOut` + redirect a `/`.
 */
export default function SignOutButton({ className, variant = "default" }: SignOutButtonProps) {
    const { lang } = useLanguage();
    const t = getDict(lang);
    const router = useRouter();
    const [pending, setPending] = useState(false);
    const [error, setError] = useState(false);

    const defaultClassName =
        variant === "menu"
            ? "flex min-h-11 w-full items-center gap-2 rounded-md px-3 text-sm font-semibold text-(--secondary) transition-colors hover:bg-(--secondary)/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)"
            : variant === "danger"
                ? "inline-flex min-h-11 items-center justify-center rounded-md px-4 text-sm font-semibold text-(--secondary) transition-colors hover:bg-(--secondary)/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)"
                : "inline-flex min-h-11 items-center justify-center rounded-md border border-(--brand)/25 px-4 text-sm font-semibold text-(--brand) transition-colors hover:bg-(--brand)/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)";

    async function handleSignOut() {
        if (pending) return;
        setPending(true);
        setError(false);
        try {
            await signOut();
        } catch {
            setError(true);
            setPending(false);
            return;
        }
        router.push("/");
        router.refresh();
    }

    return (
        <span className={variant === "menu" ? "flex w-full flex-col items-stretch" : "inline-flex flex-col items-start gap-1"}>
            <button
                type="button"
                onClick={handleSignOut}
                disabled={pending}
                className={className ?? defaultClassName}
            >
                {variant === "menu" ? <LogoutIcon className="h-4 w-4" /> : null}
                {pending ? t.signingOut : t.signOut}
            </button>
            {error ? (
                <span role="alert" className="px-1 pt-1 text-xs text-(--secondary)">
                    {t.signOutError}
                </span>
            ) : null}
        </span>
    );
}
