import { eq } from "drizzle-orm";
import { db } from "@/db";
import { categories, categoryTranslations } from "@/db/schema";
import { apiError, parseCategoryInput, readJson } from "../_lib/catalog";
import { requireAdmin } from "../../lib/require-admin";

function serializeCategory(
    category: typeof categories.$inferSelect,
    translations: typeof categoryTranslations.$inferSelect[],
) {
    return {
        ...category,
        translations: Object.fromEntries(
            translations
                .filter((translation) => translation.categoryId === category.id)
                .map(({ locale, name, description }) => [locale, { name, description }]),
        ),
    };
}

export async function GET() {
    const [categoryRows, translationRows] = await Promise.all([
        db.select().from(categories),
        db.select().from(categoryTranslations),
    ]);
    return Response.json(
        categoryRows.map((category) => serializeCategory(category, translationRows)),
    );
}

export async function POST(request: Request) {
    const denied = await requireAdmin();
    if (denied) return denied;

    const body = await readJson(request);
    if (!body.ok) return apiError(body.error, 400);
    const parsed = parseCategoryInput(body.value);
    if (!parsed.ok) return apiError(parsed.error, 400);

    const [duplicateCode] = await db
        .select({ id: categories.id })
        .from(categories)
        .where(eq(categories.code, parsed.value.code))
        .limit(1);
    if (duplicateCode) return apiError("Ya existe una categoría con ese código.", 409);

    const categoryId = await db.transaction(async (tx) => {
        const [created] = await tx
            .insert(categories)
            .values({ code: parsed.value.code })
            .returning({ id: categories.id });
        if (!created) throw new Error("No se pudo crear la categoría.");

        await tx.insert(categoryTranslations).values(
            parsed.value.translations.map((translation) => ({
                categoryId: created.id,
                ...translation,
            })),
        );
        return created.id;
    });

    const [category] = await db
        .select()
        .from(categories)
        .where(eq(categories.id, categoryId))
        .limit(1);
    if (!category) throw new Error("No se pudo recuperar la categoría creada.");
    const translations = await db
        .select()
        .from(categoryTranslations)
        .where(eq(categoryTranslations.categoryId, categoryId));

    return Response.json(serializeCategory(category, translations), {
        status: 201,
        headers: { Location: `/api/categories/${categoryId}` },
    });
}
