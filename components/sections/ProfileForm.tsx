"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useLanguage } from "../../app/i18n/LanguageContext";
import { getDict } from "../../app/i18n/dictionaries";
import { HttpClientError, profileApi } from "../../lib/http-client";

type ProfileFormProps = {
    name: string;
    githubUrl: string;
    linkedinUrl: string;
    twitterUrl: string;
    whatsapp: string;
};

const inputClassName =
    "min-h-11 w-full rounded-md border border-(--brand)/25 bg-(--background) px-3 text-base text-(--foreground) placeholder:text-(--foreground)/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)";

export default function ProfileForm({
    name,
    githubUrl,
    linkedinUrl,
    twitterUrl,
    whatsapp,
}: ProfileFormProps) {
    const { lang } = useLanguage();
    const t = getDict(lang);
    const [status, setStatus] = useState<{
        kind: "idle" | "saving" | "success" | "error";
        message: string;
    }>({ kind: "idle", message: "" });

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setStatus({ kind: "saving", message: "" });

        const formData = new FormData(event.currentTarget);
        try {
            await profileApi.update({
                name: String(formData.get("name") ?? ""),
                githubUrl: String(formData.get("githubUrl") ?? ""),
                linkedinUrl: String(formData.get("linkedinUrl") ?? ""),
                twitterUrl: String(formData.get("twitterUrl") ?? ""),
                whatsapp: String(formData.get("whatsapp") ?? ""),
            });
            setStatus({ kind: "success", message: t.profileSaved });
        } catch (error) {
            if (error instanceof HttpClientError && error.status === 401) {
                setStatus({ kind: "error", message: t.profileSessionExpired });
            } else if (error instanceof HttpClientError && error.status === 400) {
                setStatus({ kind: "error", message: t.profileInvalid });
            } else {
                setStatus({ kind: "error", message: t.profileSaveError });
            }
        }
    }

    const pending = status.kind === "saving";
    const isError = status.kind === "error";

    return (
        <div>
            {/* Hero de perfil — coherente con el resto del sitio */}
            <div className="border-b border-(--brand)/10 bg-(--brand)/5">
                <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
                    <h1 className="text-3xl font-bold leading-10 text-(--brand)">
                        {t.profileTitle}
                        <span className="text-(--secondary)" aria-hidden="true">.</span>
                    </h1>
                    <p className="mt-2 text-base leading-7 text-(--foreground)/75">
                        {t.profileDescription}
                    </p>
                </div>
            </div>

            <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
                <section
                    aria-labelledby="siguientes-pasos"
                    className="border-b border-(--brand)/15 pb-8"
                >
                <h2
                    id="siguientes-pasos"
                    className="text-lg font-semibold leading-7 text-(--foreground)"
                >
                    {t.profileOnboardingTitle}
                </h2>
                <p className="mt-2 max-w-2xl text-base leading-7 text-(--foreground)/75">
                    {t.profileOnboardingDescription}
                </p>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <Link
                        href="/proyectos/nuevo"
                        className="inline-flex min-h-11 items-center justify-center rounded-md bg-(--brand) px-4 text-sm font-semibold text-(--background) transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)"
                    >
                        {t.profileCreateProject}
                    </Link>
                    <Link
                        href="/explorar"
                        className="inline-flex min-h-11 items-center justify-center rounded-md border border-(--brand)/25 px-4 text-sm font-semibold text-(--brand) transition-colors hover:bg-(--brand)/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)"
                    >
                        {t.profileExploreProjects}
                    </Link>
                </div>
            </section>
            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
                <section aria-labelledby="datos-personales" className="flex flex-col gap-4">
                    <h2
                        id="datos-personales"
                        className="text-lg font-semibold leading-7 text-(--foreground)"
                    >
                        {t.profilePersonalInfo}
                    </h2>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="name" className="text-sm font-medium text-(--foreground)">
                            {t.profileName}
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            maxLength={80}
                            required
                            defaultValue={name}
                            className={inputClassName}
                        />
                    </div>
                </section>

                <section aria-labelledby="enlaces-perfil" className="flex flex-col gap-4">
                    <h2
                        id="enlaces-perfil"
                        className="text-lg font-semibold leading-7 text-(--foreground)"
                    >
                        {t.profileLinks}
                    </h2>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="githubUrl" className="text-sm font-medium text-(--foreground)">
                                {t.profileGithub}
                            </label>
                            <input
                                id="githubUrl"
                                name="githubUrl"
                                type="url"
                                inputMode="url"
                                autoComplete="url"
                                maxLength={2048}
                                placeholder="https://github.com/"
                                defaultValue={githubUrl}
                                className={inputClassName}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="linkedinUrl" className="text-sm font-medium text-(--foreground)">
                                {t.profileLinkedin}
                            </label>
                            <input
                                id="linkedinUrl"
                                name="linkedinUrl"
                                type="url"
                                inputMode="url"
                                maxLength={2048}
                                placeholder="https://www.linkedin.com/"
                                defaultValue={linkedinUrl}
                                className={inputClassName}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="twitterUrl" className="text-sm font-medium text-(--foreground)">
                                {t.profileTwitter}
                            </label>
                            <input
                                id="twitterUrl"
                                name="twitterUrl"
                                type="url"
                                inputMode="url"
                                maxLength={2048}
                                placeholder="https://x.com/"
                                defaultValue={twitterUrl}
                                className={inputClassName}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="whatsapp" className="text-sm font-medium text-(--foreground)">
                                {t.profileWhatsapp}
                            </label>
                            <input
                                id="whatsapp"
                                name="whatsapp"
                                type="tel"
                                inputMode="tel"
                                autoComplete="tel"
                                maxLength={20}
                                placeholder="573001234567"
                                defaultValue={whatsapp}
                                aria-describedby="whatsapp-hint"
                                className={inputClassName}
                            />
                            <p id="whatsapp-hint" className="text-sm text-(--foreground)/70">
                                {t.profileWhatsappHint}
                            </p>
                        </div>
                    </div>
                </section>

                <div className="flex flex-col items-start gap-3">
                    <button
                        type="submit"
                        disabled={pending}
                        className="inline-flex min-h-11 items-center justify-center rounded-md bg-(--brand) px-4 text-sm font-semibold text-(--background) transition-colors hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand) disabled:cursor-wait disabled:opacity-70"
                    >
                        {pending ? t.profileSaving : t.profileSave}
                    </button>
                    <p
                        aria-live="polite"
                        role={isError ? "alert" : "status"}
                        className={`min-h-6 text-sm ${isError ? "text-(--secondary)" : "text-(--foreground)/75"}`}
                    >
                        {status.message}
                    </p>
                </div>
            </form>
            </div>
        </div>
    );
}