import { and, eq, ne } from "drizzle-orm";
import { db } from "@/db";
import { cities, cityTranslations, projects } from "@/db/schema";
import { apiError, parseCityInput, parseId, readJson } from "../../_lib/catalog";
import { requireAdmin } from "../../../lib/require-admin";

type Context = { params: Promise<{ id: string }> };

function serializeCity(
    city: typeof cities.$inferSelect,
    translations: typeof cityTranslations.$inferSelect[],
) {
    return {
        ...city,
        translations: Object.fromEntries(
            translations.map(({ locale, slug, name, description }) => [
                locale,
                { slug, name, description },
            ]),
        ),
    };
}

export async function GET(_request: Request, { params }: Context) {
    const { id: rawId } = await params;
    const id = parseId(rawId);
    if (!id) return apiError("El identificador debe ser un entero positivo.", 400);

    const [city] = await db.select().from(cities).where(eq(cities.id, id)).limit(1);
    if (!city) return apiError("Ciudad no encontrada.", 404);

    const translations = await db
        .select()
        .from(cityTranslations)
        .where(eq(cityTranslations.cityId, id));
    return Response.json(serializeCity(city, translations));
}

export async function PUT(request: Request, { params }: Context) {
    const denied = await requireAdmin();
    if (denied) return denied;

    const { id: rawId } = await params;
    const id = parseId(rawId);
    if (!id) return apiError("El identificador debe ser un entero positivo.", 400);

    const [current] = await db.select({ id: cities.id }).from(cities).where(eq(cities.id, id)).limit(1);
    if (!current) return apiError("Ciudad no encontrada.", 404);

    const body = await readJson(request);
    if (!body.ok) return apiError(body.error, 400);
    const parsed = parseCityInput(body.value);
    if (!parsed.ok) return apiError(parsed.error, 400);

    const [duplicateCode] = await db
        .select({ id: cities.id })
        .from(cities)
        .where(and(eq(cities.code, parsed.value.code), ne(cities.id, id)))
        .limit(1);
    if (duplicateCode) return apiError("Ya existe una ciudad con ese código.", 409);

    for (const translation of parsed.value.translations) {
        const [duplicateSlug] = await db
            .select({ cityId: cityTranslations.cityId })
            .from(cityTranslations)
            .where(
                and(
                    eq(cityTranslations.locale, translation.locale),
                    eq(cityTranslations.slug, translation.slug),
                    ne(cityTranslations.cityId, id),
                ),
            )
            .limit(1);
        if (duplicateSlug) {
            return apiError(
                `El slug ${translation.slug} ya está ocupado para ${translation.locale}.`,
                409,
            );
        }
    }

    await db.transaction(async (tx) => {
        await tx.update(cities).set({ code: parsed.value.code }).where(eq(cities.id, id));
        await tx.delete(cityTranslations).where(eq(cityTranslations.cityId, id));
        await tx.insert(cityTranslations).values(
            parsed.value.translations.map((translation) => ({
                cityId: id,
                ...translation,
            })),
        );
    });

    const [city] = await db.select().from(cities).where(eq(cities.id, id)).limit(1);
    if (!city) throw new Error("No se pudo recuperar la ciudad actualizada.");
    const translations = await db
        .select()
        .from(cityTranslations)
        .where(eq(cityTranslations.cityId, id));
    return Response.json(serializeCity(city, translations));
}

export async function DELETE(_request: Request, { params }: Context) {
    const denied = await requireAdmin();
    if (denied) return denied;

    const { id: rawId } = await params;
    const id = parseId(rawId);
    if (!id) return apiError("El identificador debe ser un entero positivo.", 400);

    const [city] = await db.select({ id: cities.id }).from(cities).where(eq(cities.id, id)).limit(1);
    if (!city) return apiError("Ciudad no encontrada.", 404);

    const [project] = await db
        .select({ id: projects.id })
        .from(projects)
        .where(eq(projects.cityId, id))
        .limit(1);
    if (project) {
        return apiError("No se puede eliminar una ciudad que tiene proyectos asociados.", 409);
    }

    await db.delete(cities).where(eq(cities.id, id));
    return new Response(null, { status: 204 });
}
