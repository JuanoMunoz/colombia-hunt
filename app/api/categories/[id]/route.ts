import { and, eq, ne } from "drizzle-orm";
import { db } from "@/db";
import { categories, categoryTranslations } from "@/db/schema";
import { apiError, parseCategoryInput, parseId, readJson } from "../../_lib/catalog";
import { requireAdmin } from "../../../lib/require-admin";

type Context = { params: Promise<{ id: string }> };

function serializeCategory(
    category: typeof categories.$inferSelect,
    translations: typeof categoryTranslations.$inferSelect[],
) {
    return {
        ...category,
        translations: Object.fromEntries(
            translations.map(({ locale, name, description }) => [
                locale,
                { name, description },
            ]),
        ),
    };
}

export async function GET(_request: Request, { params }: Context) {
    const { id: rawId } = await params;
    const id = parseId(rawId);
    if (!id) return apiError("El identificador debe ser un entero positivo.", 400);

    const [category] = await db
        .select()
        .from(categories)
        .where(eq(categories.id, id))
        .limit(1);
    if (!category) return apiError("Categoría no encontrada.", 404);

    const translations = await db
        .select()
        .from(categoryTranslations)
        .where(eq(categoryTranslations.categoryId, id));
    return Response.json(serializeCategory(category, translations));
}

export async function PUT(request: Request, { params }: Context) {
    const denied = await requireAdmin();
    if (denied) return denied;

    const { id: rawId } = await params;
    const id = parseId(rawId);
    if (!id) return apiError("El identificador debe ser un entero positivo.", 400);

    const [current] = await db
        .select({ id: categories.id })
        .from(categories)
        .where(eq(categories.id, id))
        .limit(1);
    if (!current) return apiError("Categoría no encontrada.", 404);

    const body = await readJson(request);
    if (!body.ok) return apiError(body.error, 400);
    const parsed = parseCategoryInput(body.value);
    if (!parsed.ok) return apiError(parsed.error, 400);

    const [duplicateCode] = await db
        .select({ id: categories.id })
        .from(categories)
        .where(and(eq(categories.code, parsed.value.code), ne(categories.id, id)))
        .limit(1);
    if (duplicateCode) return apiError("Ya existe una categoría con ese código.", 409);

    await db.transaction(async (tx) => {
        await tx.update(categories).set({ code: parsed.value.code }).where(eq(categories.id, id));
        await tx.delete(categoryTranslations).where(eq(categoryTranslations.categoryId, id));
        await tx.insert(categoryTranslations).values(
            parsed.value.translations.map((translation) => ({
                categoryId: id,
                ...translation,
            })),
        );
    });

    const [category] = await db
        .select()
        .from(categories)
        .where(eq(categories.id, id))
        .limit(1);
    if (!category) throw new Error("No se pudo recuperar la categoría actualizada.");
    const translations = await db
        .select()
        .from(categoryTranslations)
        .where(eq(categoryTranslations.categoryId, id));

    return Response.json(serializeCategory(category, translations));
}

export async function DELETE(_request: Request, { params }: Context) {
    const denied = await requireAdmin();
    if (denied) return denied;

    const { id: rawId } = await params;
    const id = parseId(rawId);
    if (!id) return apiError("El identificador debe ser un entero positivo.", 400);

    const [category] = await db
        .select({ id: categories.id })
        .from(categories)
        .where(eq(categories.id, id))
        .limit(1);
    if (!category) return apiError("Categoría no encontrada.", 404);

    await db.delete(categories).where(eq(categories.id, id));
    return new Response(null, { status: 204 });
}
