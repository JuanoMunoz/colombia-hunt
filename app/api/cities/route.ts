import { and, eq, ne } from "drizzle-orm";
import { db } from "@/db";
import { cities, cityTranslations } from "@/db/schema";
import { apiError, parseCityInput, readJson, type CityInput } from "../_lib/catalog";
import { requireAdmin } from "../../lib/require-admin";

function serializeCity(
    city: typeof cities.$inferSelect,
    translations: typeof cityTranslations.$inferSelect[],
) {
    return {
        ...city,
        translations: Object.fromEntries(
            translations
                .filter((translation) => translation.cityId === city.id)
                .map(({ locale, slug, name, description }) => [
                    locale,
                    { slug, name, description },
                ]),
        ),
    };
}

async function findConflict(code: string, translations: CityInput["translations"], exceptId?: number) {
    const [existingCode] = await db
        .select({ id: cities.id })
        .from(cities)
        .where(exceptId ? and(eq(cities.code, code), ne(cities.id, exceptId)) : eq(cities.code, code))
        .limit(1);
    if (existingCode) return "Ya existe una ciudad con ese código.";

    for (const translation of translations) {
        const [existingSlug] = await db
            .select({ cityId: cityTranslations.cityId })
            .from(cityTranslations)
            .where(
                exceptId
                    ? and(
                          eq(cityTranslations.locale, translation.locale),
                          eq(cityTranslations.slug, translation.slug),
                          ne(cityTranslations.cityId, exceptId),
                      )
                    : and(
                          eq(cityTranslations.locale, translation.locale),
                          eq(cityTranslations.slug, translation.slug),
                      ),
            )
            .limit(1);
        if (existingSlug) {
            return `El slug ${translation.slug} ya está ocupado para ${translation.locale}.`;
        }
    }

    return null;
}

export async function GET() {
    const [cityRows, translationRows] = await Promise.all([
        db.select().from(cities),
        db.select().from(cityTranslations),
    ]);
    return Response.json(cityRows.map((city) => serializeCity(city, translationRows)));
}

export async function POST(request: Request) {
    const denied = await requireAdmin();
    if (denied) return denied;

    const body = await readJson(request);
    if (!body.ok) return apiError(body.error, 400);

    const parsed = parseCityInput(body.value);
    if (!parsed.ok) return apiError(parsed.error, 400);

    const conflict = await findConflict(parsed.value.code, parsed.value.translations);
    if (conflict) return apiError(conflict, 409);

    const cityId = await db.transaction(async (tx) => {
        const [created] = await tx
            .insert(cities)
            .values({ code: parsed.value.code })
            .returning({ id: cities.id });
        if (!created) throw new Error("No se pudo crear la ciudad.");
        await tx.insert(cityTranslations).values(
            parsed.value.translations.map((translation) => ({
                cityId: created.id,
                ...translation,
            })),
        );
        return created.id;
    });

    const [city] = await db.select().from(cities).where(eq(cities.id, cityId)).limit(1);
    if (!city) throw new Error("No se pudo recuperar la ciudad creada.");
    const translations = await db
        .select()
        .from(cityTranslations)
        .where(eq(cityTranslations.cityId, cityId));

    return Response.json(serializeCity(city, translations), {
        status: 201,
        headers: { Location: `/api/cities/${cityId}` },
    });
}
