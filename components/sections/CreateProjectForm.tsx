"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { getDict } from "../../app/i18n/dictionaries";
import { useLanguage } from "../../app/i18n/LanguageContext";
import { HttpClientError, projectApi, type CreateProjectCoauthorInput } from "../../lib/http-client";
import { compressImage } from "../../lib/images/compress";
import { useUploadThing } from "../../lib/uploadthing";
import MarkdownEditor from "../ui/MarkdownEditor";
import OptimizedImage from "../ui/OptimizedImage";

type ProjectOption = {
    id: number;
    name: string;
};

type CreateProjectFormProps = {
    cities: ProjectOption[];
    categories: ProjectOption[];
};

const inputClassName =
    "min-h-11 w-full rounded-md border border-(--brand)/25 bg-(--background) px-3 text-base text-(--foreground) placeholder:text-(--foreground)/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)";

const MAX_COAUTHORS = 5;

type CoAuthorDraft = {
    key: number;
    name: string;
    githubUrl: string;
    linkedinUrl: string;
    twitterUrl: string;
    instagramUrl: string;
    email: string;
    whatsapp: string;
    showAsCreator: boolean;
};

function emptyCoAuthor(key: number): CoAuthorDraft {
    return {
        key,
        name: "",
        githubUrl: "",
        linkedinUrl: "",
        twitterUrl: "",
        instagramUrl: "",
        email: "",
        whatsapp: "",
        showAsCreator: false,
    };
}

export default function CreateProjectForm({
    cities,
    categories,
}: CreateProjectFormProps) {
    const { lang } = useLanguage();
    const t = getDict(lang);
    const router = useRouter();
    const [status, setStatus] = useState<{
        kind: "idle" | "submitting" | "error";
        message: string;
    }>({ kind: "idle", message: "" });
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [imageUpload, setImageUpload] = useState<{
        kind: "idle" | "uploading" | "error";
        progress: number | null;
    }>({ kind: "idle", progress: null });
    const [coauthors, setCoauthors] = useState<CoAuthorDraft[]>([]);
    const [nextCoauthorKey, setNextCoauthorKey] = useState(0);

    const { startUpload, isUploading } = useUploadThing("projectImage", {
        onClientUploadComplete: (files) => {
            const uploadedFile = files[0];
            if (!uploadedFile?.url) {
                setImageUpload({ kind: "error", progress: null });
                return;
            }
            setImageUrl(uploadedFile.url);
            setImageUpload({ kind: "idle", progress: null });
        },
        onUploadError: () => {
            setImageUpload({ kind: "error", progress: null });
        },
    });

    async function handleImageSelect(file: File | undefined) {
        if (!file) {
            return;
        }
        setImageUpload({ kind: "uploading", progress: 0 });
        try {
            // Compresión lossless en el navegador (fail-open: si falla,
            // `compressImage` devuelve el original intacto).
            const { file: ready } = await compressImage(file, "project");
            await startUpload([ready]);
        } catch {
            setImageUpload({ kind: "error", progress: null });
        }
    }

    function addCoauthor() {
        if (coauthors.length >= MAX_COAUTHORS) return;
        setCoauthors((current) => [...current, emptyCoAuthor(nextCoauthorKey)]);
        setNextCoauthorKey((key) => key + 1);
    }

    function updateCoauthor(key: number, changes: Partial<CoAuthorDraft>) {
        setCoauthors((current) =>
            current.map((coauthor) =>
                coauthor.key === key ? { ...coauthor, ...changes } : coauthor,
            ),
        );
    }

    function removeCoauthor(key: number) {
        setCoauthors((current) => current.filter((coauthor) => coauthor.key !== key));
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const categoryIds = formData.getAll("categoryIds").map(Number);
        if (categoryIds.length === 0) {
            setStatus({ kind: "error", message: t.createProjectCategoryHint });
            return;
        }

        const payloadCoauthors: CreateProjectCoauthorInput[] = coauthors
            .filter((coauthor) => coauthor.name.trim().length > 0)
            .map((coauthor) => ({
                name: coauthor.name.trim(),
                githubUrl: coauthor.githubUrl,
                linkedinUrl: coauthor.linkedinUrl,
                twitterUrl: coauthor.twitterUrl,
                instagramUrl: coauthor.instagramUrl,
                email: coauthor.email,
                whatsapp: coauthor.whatsapp,
                showAsCreator: coauthor.showAsCreator,
            }));

        setStatus({ kind: "submitting", message: "" });
        try {
            const result = await projectApi.create({
                title: String(formData.get("title") ?? ""),
                description: String(formData.get("description") ?? ""),
                cityId: Number(formData.get("cityId")),
                categoryIds,
                imageUrl,
                pageUrl: String(formData.get("pageUrl") ?? ""),
                livecodeUrl: String(formData.get("livecodeUrl") ?? ""),
                coauthors: payloadCoauthors,
            });
            if (!Number.isSafeInteger(result.projectId) || result.projectId < 1) {
                throw new Error("La respuesta del servidor no incluye un identificador válido.");
            }
            router.push(`/proyectos/${result.projectId}?creado=1`);
        } catch (error) {
            if (error instanceof HttpClientError && error.status === 401) {
                setStatus({ kind: "error", message: t.createProjectSessionExpired });
            } else if (error instanceof HttpClientError && error.status === 400) {
                setStatus({ kind: "error", message: t.createProjectInvalid });
            } else if (error instanceof Error) {
                setStatus({ kind: "error", message: t.createProjectError });
            } else {
                throw error;
            }
        }
    }

    const pending =
        status.kind === "submitting" || imageUpload.kind === "uploading" || isUploading;
    const isError = status.kind === "error";

    return (
        <div>
            {/* Hero de nuevo proyecto — coherente y full-width */}
            <div className="border-b border-(--brand)/10 bg-(--brand)/5">
                <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
                    <Link
                        href="/perfil"
                        className="inline-flex min-h-11 items-center rounded-md text-sm font-semibold text-(--brand) underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)"
                    >
                        ← {t.profileTitle}
                    </Link>
                    <h1 className="mt-2 text-3xl font-bold leading-10 text-(--brand)">
                        {t.createProjectTitle}
                        <span className="text-(--secondary)" aria-hidden="true">.</span>
                    </h1>
                    <p className="mt-2 text-base leading-7 text-(--foreground)/75">
                        {t.createProjectDescription}
                    </p>
                </div>
            </div>

            <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">

            {cities.length === 0 || categories.length === 0 ? (
                <div className="mt-8 flex flex-col items-start gap-4 border-y border-(--brand)/15 py-6">
                    <p role="status" className="text-base leading-7 text-(--foreground)/75">
                        {t.createProjectEmptyCatalog}
                    </p>
                    <Link
                        href="/perfil"
                        className="inline-flex min-h-11 items-center rounded-md text-sm font-semibold text-(--brand) underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)"
                    >
                        {t.profile}
                    </Link>
                </div>
            ) : (
                <form
                    onSubmit={handleSubmit}
                    aria-busy={pending}
                    className="mt-8 flex flex-col gap-6"
                >
                    <div className="flex flex-col gap-2">
                        <label htmlFor="project-title" className="text-sm font-medium text-(--foreground)">
                            {t.createProjectName}
                        </label>
                        <input
                            id="project-title"
                            name="title"
                            type="text"
                            autoComplete="organization"
                            maxLength={120}
                            required
                            className={inputClassName}
                        />
                    </div>

                    <MarkdownEditor
                        id="project-description"
                        name="description"
                        value={description}
                        onChange={setDescription}
                        lang={lang}
                        label={t.createProjectDescriptionLabel}
                        hint={lang === "es"
                            ? "Usa Markdown para dar formato: **negrita**, _cursiva_, listas, código…"
                            : "Use Markdown to format: **bold**, _italic_, lists, code…"}
                        maxLength={10000}
                        required
                    />

                    <div className="flex flex-col gap-2">
                        <label htmlFor="project-city" className="text-sm font-medium text-(--foreground)">
                            {t.createProjectCity}
                        </label>
                        <select
                            id="project-city"
                            name="cityId"
                            defaultValue=""
                            required
                            className={inputClassName}
                        >
                            <option value="" disabled>
                                {t.createProjectChooseCity}
                            </option>
                            {cities.map((city) => (
                                <option key={city.id} value={city.id}>
                                    {city.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <fieldset
                        aria-describedby="project-category-hint"
                        className="flex flex-col gap-2"
                    >
                        <legend className="text-sm font-medium text-(--foreground)">
                            {t.createProjectCategories}
                        </legend>
                        <p id="project-category-hint" className="text-sm leading-6 text-(--foreground)/70">
                            {t.createProjectCategoryHint}
                        </p>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            {categories.map((category) => (
                                <label
                                    key={category.id}
                                    className="flex min-h-11 cursor-pointer items-center gap-3 rounded-md border border-(--brand)/15 px-3 text-sm text-(--foreground) focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-(--brand)"
                                >
                                    <input
                                        type="checkbox"
                                        name="categoryIds"
                                        value={category.id}
                                        className="h-5 w-5 shrink-0 accent-(--brand)"
                                    />
                                    {category.name}
                                </label>
                            ))}
                        </div>
                    </fieldset>

                    <section aria-labelledby="project-image-label" className="flex flex-col gap-2">
                        <h2
                            id="project-image-label"
                            className="text-sm font-medium text-(--foreground)"
                        >
                            {t.createProjectImage}
                        </h2>
                        <p className="text-sm leading-6 text-(--foreground)/70">
                            {t.createProjectImageHint}
                        </p>
                        <label
                            htmlFor="project-image-input"
                            className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-md bg-(--brand) px-4 text-sm font-semibold text-(--background) transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)"
                        >
                            {t.createProjectImageUpload}
                        </label>
                        <input
                            id="project-image-input"
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            disabled={pending}
                            onChange={(event) => {
                                void handleImageSelect(event.target.files?.[0]);
                                // Permite volver a elegir el mismo archivo.
                                event.target.value = "";
                            }}
                            className="sr-only"
                        />
                        <p className="text-sm text-(--foreground)/70">{t.createProjectImageAllowed}</p>
                        {imageUpload.kind === "uploading" ? (
                            <p role="status" aria-live="polite" className="text-sm text-(--foreground)/75">
                                {t.createProjectImageUploading}
                                {imageUpload.progress === null
                                    ? ""
                                    : ` ${Math.round(imageUpload.progress)}%`}
                            </p>
                        ) : null}
                        {imageUpload.kind === "error" ? (
                            <p role="alert" className="text-sm text-(--secondary)">
                                {t.createProjectImageError}
                            </p>
                        ) : null}
                        {imageUrl ? (
                            <div className="relative mt-2 aspect-video w-full max-w-xl overflow-hidden rounded-md border border-(--brand)/20">
                                <OptimizedImage
                                    src={imageUrl}
                                    alt={t.createProjectImagePreview}
                                    variant="preview"
                                    className="object-cover"
                                />
                            </div>
                        ) : null}
                    </section>

                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="project-website"
                            className="text-sm font-medium text-(--foreground)"
                        >
                            {t.createProjectWebsite}
                        </label>
                        <input
                            id="project-website"
                            name="pageUrl"
                            type="url"
                            inputMode="url"
                            autoComplete="url"
                            maxLength={2048}
                            placeholder="https://"
                            className={inputClassName}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="project-repository"
                            className="text-sm font-medium text-(--foreground)"
                        >
                            {t.createProjectRepository}
                        </label>
                        <input
                            id="project-repository"
                            name="livecodeUrl"
                            type="url"
                            inputMode="url"
                            maxLength={2048}
                            placeholder="https://"
                            className={inputClassName}
                        />
                    </div>

                    <fieldset className="flex flex-col gap-4">
                        <legend className="text-sm font-medium text-(--foreground)">
                            {t.createProjectCoauthors}
                        </legend>
                        <p className="text-sm leading-6 text-(--foreground)/70">
                            {t.createProjectCoauthorsHint}
                        </p>
                        {coauthors.map((coauthor, index) => (
                            <div
                                key={coauthor.key}
                                className="flex flex-col gap-3 rounded-md border border-(--brand)/15 p-3"
                            >
                                <div className="flex flex-col gap-2">
                                    <label
                                        htmlFor={`coauthor-name-${coauthor.key}`}
                                        className="text-sm font-medium text-(--foreground)"
                                    >
                                        {t.createProjectCoauthorName}
                                    </label>
                                    <input
                                        id={`coauthor-name-${coauthor.key}`}
                                        type="text"
                                        autoComplete="off"
                                        maxLength={80}
                                        value={coauthor.name}
                                        onChange={(event) =>
                                            updateCoauthor(coauthor.key, { name: event.target.value })
                                        }
                                        placeholder={`Co-autor ${index + 1}`}
                                        className={inputClassName}
                                    />
                                </div>
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <input
                                        type="url"
                                        inputMode="url"
                                        maxLength={2048}
                                        value={coauthor.githubUrl}
                                        onChange={(event) =>
                                            updateCoauthor(coauthor.key, { githubUrl: event.target.value })
                                        }
                                        placeholder="https://github.com/"
                                        aria-label="GitHub"
                                        className={inputClassName}
                                    />
                                    <input
                                        type="url"
                                        inputMode="url"
                                        maxLength={2048}
                                        value={coauthor.linkedinUrl}
                                        onChange={(event) =>
                                            updateCoauthor(coauthor.key, { linkedinUrl: event.target.value })
                                        }
                                        placeholder="https://www.linkedin.com/"
                                        aria-label="LinkedIn"
                                        className={inputClassName}
                                    />
                                    <input
                                        type="url"
                                        inputMode="url"
                                        maxLength={2048}
                                        value={coauthor.twitterUrl}
                                        onChange={(event) =>
                                            updateCoauthor(coauthor.key, { twitterUrl: event.target.value })
                                        }
                                        placeholder="https://x.com/"
                                        aria-label="X"
                                        className={inputClassName}
                                    />
                                    <input
                                        type="url"
                                        inputMode="url"
                                        maxLength={2048}
                                        value={coauthor.instagramUrl}
                                        onChange={(event) =>
                                            updateCoauthor(coauthor.key, { instagramUrl: event.target.value })
                                        }
                                        placeholder="https://instagram.com/"
                                        aria-label="Instagram"
                                        className={inputClassName}
                                    />
                                    <input
                                        type="email"
                                        inputMode="email"
                                        maxLength={254}
                                        value={coauthor.email}
                                        onChange={(event) =>
                                            updateCoauthor(coauthor.key, { email: event.target.value })
                                        }
                                        placeholder="correo@ejemplo.com"
                                        aria-label="Email"
                                        className={inputClassName}
                                    />
                                    <input
                                        type="tel"
                                        inputMode="tel"
                                        maxLength={20}
                                        value={coauthor.whatsapp}
                                        onChange={(event) =>
                                            updateCoauthor(coauthor.key, { whatsapp: event.target.value })
                                        }
                                        placeholder="573001234567"
                                        aria-label="WhatsApp"
                                        className={inputClassName}
                                    />
                                </div>
                                <label className="flex min-h-11 cursor-pointer items-start gap-3 text-sm text-(--foreground)">
                                    <input
                                        type="checkbox"
                                        checked={coauthor.showAsCreator}
                                        onChange={(event) =>
                                            updateCoauthor(coauthor.key, { showAsCreator: event.target.checked })
                                        }
                                        className="mt-1 h-5 w-5 shrink-0 accent-(--brand)"
                                    />
                                    <span>
                                        <span className="font-medium">{t.createProjectCoauthorPrincipal}</span>
                                        <span className="block text-(--foreground)/70">
                                            {t.createProjectCoauthorPrincipalHint}
                                        </span>
                                    </span>
                                </label>
                                <div>
                                    <button
                                        type="button"
                                        onClick={() => removeCoauthor(coauthor.key)}
                                        aria-label={`${t.createProjectCoauthorRemove} ${index + 1}`}
                                        className="inline-flex min-h-11 items-center justify-center rounded-md border border-(--brand)/25 px-4 text-sm font-semibold text-(--brand) transition-colors hover:bg-(--brand)/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)"
                                    >
                                        {t.createProjectCoauthorRemove}
                                    </button>
                                </div>
                            </div>
                        ))}
                        {coauthors.length < MAX_COAUTHORS ? (
                            <div>
                                <button
                                    type="button"
                                    onClick={addCoauthor}
                                    className="inline-flex min-h-11 items-center justify-center rounded-md border border-(--brand)/25 px-4 text-sm font-semibold text-(--brand) transition-colors hover:bg-(--brand)/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)"
                                >
                                    {t.createProjectCoauthorAdd}
                                </button>
                            </div>
                        ) : null}
                    </fieldset>

                    <div className="flex flex-col items-start gap-3">
                        <button
                            type="submit"
                            disabled={pending}
                            className="inline-flex min-h-11 items-center justify-center rounded-md bg-(--brand) px-4 text-sm font-semibold text-(--background) transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand) disabled:cursor-wait disabled:opacity-70"
                        >
                            {pending ? t.createProjectSubmitting : t.createProjectSubmit}
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
            )}
            </div>
        </div>
    );
}
