export const LOCALES = ["es", "en"] as const;
export type Locale = (typeof LOCALES)[number];

type ParseResult<T> =
    | { ok: true; value: T }
    | { ok: false; error: string };

export type CityInput = {
    code: string;
    translations: Array<{
        locale: Locale;
        slug: string;
        name: string;
        description: string | null;
    }>;
};

export type CategoryInput = {
    code: string;
    translations: Array<{
        locale: Locale;
        name: string;
        description: string | null;
    }>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasOnlyKeys(value: Record<string, unknown>, allowed: string[]): boolean {
    return Object.keys(value).every((key) => allowed.includes(key));
}

function parseCode(value: unknown): ParseResult<string> {
    if (typeof value !== "string") return { ok: false, error: "El código es obligatorio." };
    const code = value.trim();
    if (code.length > 80 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(code)) {
        return { ok: false, error: "El código debe usar minúsculas, números y guiones." };
    }
    return { ok: true, value: code };
}

function parseDescription(value: unknown): ParseResult<string | null> {
    if (value === undefined || value === null || value === "") return { ok: true, value: null };
    if (typeof value !== "string" || value.trim().length > 2000) {
        return { ok: false, error: "La descripción debe tener como máximo 2000 caracteres." };
    }
    return { ok: true, value: value.trim() };
}

function parseName(value: unknown): ParseResult<string> {
    if (typeof value !== "string" || !value.trim() || value.trim().length > 120) {
        return { ok: false, error: "El nombre es obligatorio y admite hasta 120 caracteres." };
    }
    return { ok: true, value: value.trim() };
}

function parseLocales(value: unknown): ParseResult<unknown[]> {
    if (!Array.isArray(value) || value.length !== LOCALES.length) {
        return { ok: false, error: "Se requieren traducciones para es y en." };
    }

    const locales = value.map((translation) =>
        isRecord(translation) ? translation.locale : undefined,
    );
    if (
        locales.some((locale) => !LOCALES.includes(locale as Locale)) ||
        new Set(locales).size !== LOCALES.length
    ) {
        return { ok: false, error: "Debe incluir exactamente una traducción es y otra en." };
    }

    return { ok: true, value };
}

export function parseCityInput(value: unknown): ParseResult<CityInput> {
    if (!isRecord(value) || !hasOnlyKeys(value, ["code", "translations"])) {
        return { ok: false, error: "El cuerpo debe contener code y translations." };
    }

    const code = parseCode(value.code);
    const locales = parseLocales(value.translations);
    if (!code.ok) return code;
    if (!locales.ok) return locales;

    const translations: CityInput["translations"] = [];
    for (const item of locales.value) {
        if (!isRecord(item) || !hasOnlyKeys(item, ["locale", "slug", "name", "description"])) {
            return { ok: false, error: "Cada traducción debe incluir locale, slug y name." };
        }
        if (!LOCALES.includes(item.locale as Locale)) {
            return { ok: false, error: "Locale debe ser es o en." };
        }

        const slug = typeof item.slug === "string" ? item.slug.trim() : "";
        if (slug.length > 120 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
            return { ok: false, error: "Cada slug debe usar minúsculas, números y guiones." };
        }
        const name = parseName(item.name);
        const description = parseDescription(item.description);
        if (!name.ok) return name;
        if (!description.ok) return description;

        translations.push({
            locale: item.locale as Locale,
            slug,
            name: name.value,
            description: description.value,
        });
    }

    return { ok: true, value: { code: code.value, translations } };
}

export function parseCategoryInput(value: unknown): ParseResult<CategoryInput> {
    if (!isRecord(value) || !hasOnlyKeys(value, ["code", "translations"])) {
        return { ok: false, error: "El cuerpo debe contener code y translations." };
    }

    const code = parseCode(value.code);
    const locales = parseLocales(value.translations);
    if (!code.ok) return code;
    if (!locales.ok) return locales;

    const translations: CategoryInput["translations"] = [];
    for (const item of locales.value) {
        if (!isRecord(item) || !hasOnlyKeys(item, ["locale", "name", "description"])) {
            return { ok: false, error: "Cada traducción debe incluir locale y name." };
        }
        if (!LOCALES.includes(item.locale as Locale)) {
            return { ok: false, error: "Locale debe ser es o en." };
        }

        const name = parseName(item.name);
        const description = parseDescription(item.description);
        if (!name.ok) return name;
        if (!description.ok) return description;

        translations.push({
            locale: item.locale as Locale,
            name: name.value,
            description: description.value,
        });
    }

    return { ok: true, value: { code: code.value, translations } };
}

export async function readJson(request: Request): Promise<ParseResult<unknown>> {
    try {
        return { ok: true, value: await request.json() as unknown };
    } catch {
        return { ok: false, error: "El cuerpo debe ser JSON válido." };
    }
}

export function parseId(value: string): number | null {
    if (!/^[1-9]\d*$/.test(value)) return null;
    const id = Number(value);
    return Number.isSafeInteger(id) ? id : null;
}

export function apiError(message: string, status: number): Response {
    return Response.json({ error: message }, { status });
}
