"use client";

import Link from "next/link";
import { useLanguage } from "../../app/i18n/LanguageContext";
import { getDict } from "../../app/i18n/dictionaries";

export default function NotFoundContent() {
    const { lang } = useLanguage();
    const t = getDict(lang);

    return (
        <main className="flex flex-1 flex-col justify-center bg-(--background)">
            <section
                aria-labelledby="titulo-no-encontrado"
                className="mx-auto flex w-full max-w-3xl flex-col items-start gap-4 px-4 py-16 sm:px-6"
            >
                <p className="text-sm font-semibold text-(--brand)">404</p>
                <h1
                    id="titulo-no-encontrado"
                    className="text-3xl font-bold leading-10 text-(--foreground)"
                >
                    {t.notFoundTitle}
                </h1>
                <p className="max-w-xl text-base leading-7 text-(--foreground)/75">
                    {t.notFoundDescription}
                </p>
                <div className="mt-2 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                    <Link
                        href="/"
                        className="inline-flex min-h-11 items-center justify-center rounded-md bg-(--brand) px-4 text-sm font-semibold text-(--background) transition-colors hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)"
                    >
                        {t.notFoundHome}
                    </Link>
                    <Link
                        href="/explorar"
                        className="inline-flex min-h-11 items-center justify-center rounded-md border border-(--brand)/25 px-4 text-sm font-semibold text-(--brand) transition-colors hover:bg-(--brand)/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)"
                    >
                        {t.notFoundExplore}
                    </Link>
                </div>
            </section>
        </main>
    );
}