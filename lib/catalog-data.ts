import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import {
    categories,
    categoryTranslations,
    cities,
    cityTranslations,
} from "@/db/schema";

export type CatalogLocale = "es" | "en";

export type CityTranslation = {
    slug: string;
    name: string;
    description: string | null;
};

export type CityRecord = {
    id: number;
    code: string;
    slug: string;
    name: string;
    description: string | null;
    translations: Partial<Record<CatalogLocale, CityTranslation>>;
};

export type CategoryTranslation = {
    name: string;
    description: string | null;
};

export type CategoryRecord = {
    id: number;
    code: string;
    translations: Partial<Record<CatalogLocale, CategoryTranslation>>;
};

function toLocaleRecord<T extends { locale: string }>(
    rows: T[],
): Partial<Record<CatalogLocale, T>> {
    return Object.fromEntries(
        rows.flatMap((row) =>
            row.locale === "es" || row.locale === "en" ? [[row.locale, row]] : [],
        ),
    ) as Partial<Record<CatalogLocale, T>>;
}

export async function getCitySlugs(): Promise<string[]> {
    const rows = await db
        .select({ slug: cityTranslations.slug })
        .from(cityTranslations)
        .where(eq(cityTranslations.locale, "es"));

    return rows.map(({ slug }) => slug);
}

export async function getCityBySlug(slug: string): Promise<CityRecord | null> {
    const [city] = await db
        .select({
            id: cities.id,
            code: cities.code,
            cityId: cityTranslations.cityId,
        })
        .from(cityTranslations)
        .innerJoin(cities, eq(cityTranslations.cityId, cities.id))
        .where(
            and(
                eq(cityTranslations.locale, "es"),
                eq(cityTranslations.slug, slug.toLowerCase()),
            ),
        )
        .limit(1);

    if (!city) return null;

    const translationRows = await db
        .select({
            locale: cityTranslations.locale,
            slug: cityTranslations.slug,
            name: cityTranslations.name,
            description: cityTranslations.description,
        })
        .from(cityTranslations)
        .where(eq(cityTranslations.cityId, city.cityId));

    const translations = toLocaleRecord(translationRows);
    const spanish = translations.es;
    if (!spanish) return null;

    return {
        id: city.id,
        code: city.code,
        slug: spanish.slug,
        name: spanish.name,
        description: spanish.description,
        translations,
    };
}

export async function getCategoryIds(): Promise<number[]> {
    const rows = await db.select({ id: categories.id }).from(categories);
    return rows.map(({ id }) => id);
}

export async function getAllCategories(locale: CatalogLocale = "es"): Promise<{ id: number; name: string }[]> {
    const rows = await db
        .select({ id: categories.id, name: categoryTranslations.name })
        .from(categories)
        .leftJoin(
            categoryTranslations,
            and(
                eq(categoryTranslations.categoryId, categories.id),
                eq(categoryTranslations.locale, locale),
            ),
        );
    return rows
        .map((r) => ({ id: r.id, name: r.name ?? r.id.toString() }))
        .sort((a, b) => a.name.localeCompare(b.name));
}


export async function getCategoryById(id: number): Promise<CategoryRecord | null> {
    const [category] = await db
        .select({ id: categories.id, code: categories.code })
        .from(categories)
        .where(eq(categories.id, id))
        .limit(1);

    if (!category) return null;

    const translationRows = await db
        .select({
            locale: categoryTranslations.locale,
            name: categoryTranslations.name,
            description: categoryTranslations.description,
        })
        .from(categoryTranslations)
        .where(eq(categoryTranslations.categoryId, id));

    return {
        ...category,
        translations: toLocaleRecord(translationRows),
    };
}