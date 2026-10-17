"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useLanguage } from "../../app/i18n/LanguageContext";
import { getDict } from "../../app/i18n/dictionaries";
import { HttpClientError, profileApi } from "../../lib/http-client";
import { compressImage } from "../../lib/images/compress";
import { useUploadThing } from "../../lib/uploadthing";
import type { ProjectRecord } from "../../lib/project-data";
import { SocialIcon } from "../ui/icons";
import ProfileAvatar from "../ui/ProfileAvatar";
import SignOutButton from "../ui/SignOutButton";
import { useUploadCleanup } from "../ui/use-upload-cleanup";
import ProfileFavorites from "./ProfileFavorites";

type OwnSummary = {
    id: number;
    title: string;
};

type ProfileFormProps = {
    userId: string;
    name: string;
    image?: string | null;
    githubUrl: string;
    linkedinUrl: string;
    twitterUrl: string;
    instagramUrl: string;
    email: string;
    whatsapp: string;
    marketingOptIn?: boolean;
    ownTotal?: number;
    ownRecent?: OwnSummary[];
    favorites?: ProjectRecord[];
};

const inputClassName =
    "min-h-11 w-full rounded-md border border-(--brand)/25 bg-(--background) px-3 text-base text-(--foreground) placeholder:text-(--foreground)/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)";

export default function ProfileForm({
    userId,
    name,
    image = null,
    githubUrl,
    linkedinUrl,
    twitterUrl,
    instagramUrl,
    email,
    whatsapp,
    marketingOptIn = false,
    ownTotal = 0,
    ownRecent = [],
    favorites = [],
}: ProfileFormProps) {
    const { lang } = useLanguage();
    const t = getDict(lang);
    const [status, setStatus] = useState<{
        kind: "idle" | "saving" | "success" | "error";
        message: string;
    }>({ kind: "idle", message: "" });
    const [imageUrl, setImageUrl] = useState<string | null>(image);
    const [emailOptIn, setEmailOptIn] = useState(marketingOptIn);
    const [photoState, setPhotoState] = useState<{
        kind: "idle" | "uploading" | "error";
    }>({ kind: "idle" });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { replaceUpload, discardPending, markSaved } = useUploadCleanup();

    const { startUpload, isUploading } = useUploadThing("avatarImage", {
        onClientUploadComplete: (files) => {
            const uploadedFile = files[0];
            if (!uploadedFile?.url) {
                setPhotoState({ kind: "error" });
                return;
            }
            replaceUpload(uploadedFile.key);
            setImageUrl(uploadedFile.url);
            setPhotoState({ kind: "idle" });
        },
        onUploadError: () => {
            setPhotoState({ kind: "error" });
        },
    });

    async function handlePhotoSelect(file: File | undefined) {
        if (!file) return;
        setPhotoState({ kind: "uploading" });
        try {
            const { file: ready } = await compressImage(file, "avatar");
            await startUpload([ready]);
        } catch {
            setPhotoState({ kind: "error" });
        }
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setStatus({ kind: "saving", message: "" });

        const formData = new FormData(event.currentTarget);
        try {
            await profileApi.update({
                name: String(formData.get("name") ?? ""),
                image: imageUrl,
                githubUrl: String(formData.get("githubUrl") ?? ""),
                linkedinUrl: String(formData.get("linkedinUrl") ?? ""),
                twitterUrl: String(formData.get("twitterUrl") ?? ""),
                instagramUrl: String(formData.get("instagramUrl") ?? ""),
                email: String(formData.get("email") ?? ""),
                whatsapp: String(formData.get("whatsapp") ?? ""),
                marketingOptIn: emailOptIn,
            });
            markSaved();
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
    const uploading = photoState.kind === "uploading" || isUploading;

    const socialLinks = [
        { label: "GitHub", url: githubUrl },
        { label: "LinkedIn", url: linkedinUrl },
        { label: "X", url: twitterUrl },
        { label: "Instagram", url: instagramUrl },
        { label: "Email", url: email ? `mailto:${email}` : "" },
        { label: "WhatsApp", url: whatsapp ? `https://wa.me/${whatsapp}` : "" },
    ].filter((link) => Boolean(link.url));

    return (
        <div>
            {/* Card de presentación — avatar, redes y acciones */}
            <div className="border-b border-(--brand)/10 bg-(--brand)/5">
                <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-4 py-10 text-center sm:px-6">
                    <ProfileAvatar
                        name={name}
                        userId={userId}
                        imageUrl={imageUrl}
                        fallbackLabel={t.profileAvatarFallback(name)}
                    />
                    <h1 className="mt-4 text-3xl font-bold leading-10 text-(--brand)">
                        {name}
                        <span className="text-(--secondary)" aria-hidden="true">.</span>
                    </h1>
                    <p className="mt-2 text-base leading-7 text-(--foreground)/75">
                        {t.profileDescription}
                    </p>
                    <p role="status" className="mt-1 text-sm font-medium text-(--foreground)/70">
                        {t.myProjectsCount(ownTotal)}
                    </p>
                    {socialLinks.length > 0 ? (
                        <ul aria-label={t.profileLinks} className="mt-4 flex flex-wrap items-center justify-center gap-2">
                            {socialLinks.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title={link.label}
                                        aria-label={link.label}
                                        className="inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-full border border-(--brand)/20 px-3 text-sm font-semibold text-(--brand) transition-colors hover:bg-(--brand)/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)"
                                    >
                                        <SocialIcon label={link.label} className="h-4 w-4" />
                                        <span>{link.label}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    ) : null}
                    <div className="mt-6 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                        <Link
                            href="/proyectos/nuevo"
                            className="inline-flex min-h-11 items-center justify-center rounded-md bg-(--brand) px-4 text-sm font-semibold text-(--background) transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)"
                        >
                            {t.profileCreateProject}
                        </Link>
                        <Link
                            href="/mis-proyectos"
                            className="inline-flex min-h-11 items-center justify-center rounded-md border border-(--brand)/25 px-4 text-sm font-semibold text-(--brand) transition-colors hover:bg-(--brand)/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)"
                        >
                            {t.myProjectsManage}
                        </Link>
                        <Link
                            href="/explorar"
                            className="inline-flex min-h-11 items-center justify-center rounded-md border border-(--brand)/25 px-4 text-sm font-semibold text-(--brand) transition-colors hover:bg-(--brand)/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)"
                        >
                            {t.profileExploreProjects}
                        </Link>
                    </div>
                </div>
            </div>

            <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
                <section
                    aria-labelledby="mis-proyectos-resumen"
                    className="border-b border-(--brand)/15 pb-8"
                >
                    <h2
                        id="mis-proyectos-resumen"
                        className="text-lg font-semibold leading-7 text-(--foreground)"
                    >
                        {t.myProjectsTitle}
                    </h2>
                    {ownTotal === 0 ? (
                        <p className="mt-2 max-w-2xl text-base leading-7 text-(--foreground)/75">
                            {t.myProjectsEmpty}
                        </p>
                    ) : (
                        <>
                            <p role="status" className="mt-2 text-base leading-7 text-(--foreground)/75">
                                {t.myProjectsCount(ownTotal)}
                            </p>
                            <ul className="mt-3 flex flex-col gap-2">
                                {ownRecent.map((project) => (
                                    <li key={project.id}>
                                        <Link
                                            href={`/proyectos/${project.id}`}
                                            className="inline-flex min-h-11 items-center rounded-md text-sm font-semibold text-(--brand) underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)"
                                        >
                                            {project.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                    <div className="mt-4">
                        <Link
                            href="/mis-proyectos"
                            className="inline-flex min-h-11 items-center rounded-md text-sm font-semibold text-(--brand) underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)"
                        >
                            {t.myProjectsManage} →
                        </Link>
                    </div>
                </section>
                <section
                    aria-labelledby="favoritos-resumen"
                    className="border-b border-(--brand)/15 py-8"
                >
                    <h2
                        id="favoritos-resumen"
                        className="text-lg font-semibold leading-7 text-(--foreground)"
                    >
                        {t.profileFavoritesTitle}
                    </h2>
                    <ProfileFavorites initial={favorites} />
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

                    <section aria-labelledby="foto-perfil" className="flex flex-col gap-4">
                        <h2
                            id="foto-perfil"
                            className="text-lg font-semibold leading-7 text-(--foreground)"
                        >
                            {t.profilePhoto}
                        </h2>
                        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
                            <ProfileAvatar
                                name={name}
                                userId={userId}
                                imageUrl={imageUrl}
                                fallbackLabel={t.profileAvatarFallback(name)}
                                className="size-16 text-2xl"
                            />
                            <div className="flex flex-col gap-2">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="sr-only"
                                    aria-label={t.profilePhotoChange}
                                    onChange={(event) => {
                                        const file = event.currentTarget.files?.[0];
                                        event.currentTarget.value = "";
                                        void handlePhotoSelect(file);
                                    }}
                                />
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        disabled={uploading}
                                        onClick={() => fileInputRef.current?.click()}
                                        className="inline-flex min-h-11 items-center justify-center rounded-md border border-(--brand)/25 px-4 text-sm font-semibold text-(--brand) transition-colors hover:bg-(--brand)/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand) disabled:cursor-wait disabled:opacity-70"
                                    >
                                        {uploading ? t.profilePhotoUploading : t.profilePhotoChange}
                                    </button>
                                    {imageUrl ? (
                                        <button
                                            type="button"
                                            disabled={uploading}
                                            onClick={() => {
                                                discardPending();
                                                setImageUrl(null);
                                            }}
                                            className="inline-flex min-h-11 items-center justify-center rounded-md px-4 text-sm font-semibold text-(--secondary) transition-colors hover:bg-(--secondary)/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand) disabled:cursor-wait disabled:opacity-70"
                                        >
                                            {t.profilePhotoRemove}
                                        </button>
                                    ) : null}
                                </div>
                                <p aria-live="polite" className="text-sm text-(--foreground)/70">
                                    {photoState.kind === "error" ? t.profilePhotoError : t.profilePhotoHint}
                                </p>
                            </div>
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
                                <label htmlFor="instagramUrl" className="text-sm font-medium text-(--foreground)">
                                    {t.profileInstagram}
                                </label>
                                <input
                                    id="instagramUrl"
                                    name="instagramUrl"
                                    type="url"
                                    inputMode="url"
                                    maxLength={2048}
                                    placeholder="https://instagram.com/"
                                    defaultValue={instagramUrl}
                                    className={inputClassName}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="email" className="text-sm font-medium text-(--foreground)">
                                    {t.profileEmail}
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    inputMode="email"
                                    autoComplete="email"
                                    maxLength={254}
                                    placeholder="correo@ejemplo.com"
                                    defaultValue={email}
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

                    <section
                        aria-labelledby="preferencias-correo"
                        className="flex flex-col gap-4"
                    >
                        <h2
                            id="preferencias-correo"
                            className="text-lg font-semibold leading-7 text-(--foreground)"
                        >
                            {t.profileEmailPrefsTitle}
                        </h2>
                        <div className="flex min-h-11 items-start gap-3">
                            <input
                                id="marketingOptIn"
                                type="checkbox"
                                checked={emailOptIn}
                                onChange={(event) => setEmailOptIn(event.target.checked)}
                                aria-describedby="marketingOptIn-hint"
                                className="mt-0.5 size-5 shrink-0 rounded border border-(--brand)/40 accent-(--brand) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)"
                            />
                            <div className="flex flex-col gap-1">
                                <label
                                    htmlFor="marketingOptIn"
                                    className="cursor-pointer text-sm font-medium text-(--foreground)"
                                >
                                    {t.profileMarketingLabel}
                                </label>
                                <p id="marketingOptIn-hint" className="text-sm text-(--foreground)/70">
                                    {t.profileMarketingHelp}
                                </p>
                            </div>
                        </div>
                    </section>

                    <div className="flex flex-col items-start gap-3">
                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                type="submit"
                                disabled={pending}
                                className="inline-flex min-h-11 items-center justify-center rounded-md bg-(--brand) px-4 text-sm font-semibold text-(--background) transition-colors hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand) disabled:cursor-wait disabled:opacity-70"
                            >
                                {pending ? t.profileSaving : t.profileSave}
                            </button>
                            <SignOutButton variant="danger" />
                        </div>
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
