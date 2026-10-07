import { eq, inArray } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/db";
import { categories, cities, projectCategories, projectCoauthors, projects } from "@/db/schema";
import { auth } from "../../lib/auth";
import { apiError, readJson } from "../_lib/catalog";
import { handleProjectsList } from "./list/route";

type ProjectInput = {
    title: string;
    description: string;
    cityId: number;
    categoryIds: number[];
    imageUrl: string | null;
    pageUrl: string | null;
    livecodeUrl: string | null;
    coauthors: CoAuthorInput[];
};

type CoAuthorInput = {
    name: string;
    githubUrl: string | null;
    linkedinUrl: string | null;
    twitterUrl: string | null;
    instagramUrl: string | null;
    email: string | null;
    whatsapp: string | null;
    showAsCreator: boolean;
};

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseId(value: unknown): number | null {
    return typeof value === "number" && Number.isSafeInteger(value) && value > 0
        ? value
        : null;
}

function parseOptionalUrl(value: unknown, field: string): string | null {
    if (value === undefined || value === null || value === "") return null;
    if (typeof value !== "string" || value.trim().length > 2048) {
        throw new TypeError(`${field} debe tener como máximo 2048 caracteres.`);
    }

    let url: URL;
    try {
        url = new URL(value.trim());
    } catch {
        throw new TypeError(`${field} debe ser una URL válida.`);
    }
    if (url.protocol !== "http:" && url.protocol !== "https:") {
        throw new TypeError(`${field} debe comenzar con http:// o https://.`);
    }
    return url.toString();
}

function parseImageUrl(value: unknown): string | null {
    const imageUrl = parseOptionalUrl(value, "La imagen");
    if (imageUrl === null) return null;

    const url = new URL(imageUrl);
    const isUploadThingHost =
        url.hostname === "utfs.io" || url.hostname.endsWith(".ufs.sh");
    if (
        url.protocol !== "https:" ||
        !isUploadThingHost ||
        !url.pathname.startsWith("/f/")
    ) {
        throw new TypeError("La imagen debe ser una URL HTTPS válida de UploadThing.");
    }
    return imageUrl;
}

function parseCoauthorEmail(value: unknown): string | null {
    if (value === undefined || value === null || value === "") return null;
    if (typeof value !== "string" || value.trim().length > 254) {
        throw new TypeError("El correo del co-autor debe tener como máximo 254 caracteres.");
    }
    const email = value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new TypeError("El correo del co-autor debe ser válido.");
    }
    return email;
}

function parseCoauthorWhatsapp(value: unknown): string | null {
    if (value === undefined || value === null || value === "") return null;
    if (typeof value !== "string" || !/^\+?[\d\s().-]{8,20}$/.test(value.trim())) {
        throw new TypeError("El WhatsApp del co-autor debe contener entre 8 y 15 dígitos.");
    }
    const digits = value.replace(/[\s()+.-]/g, "");
    if (!/^\d{8,15}$/.test(digits)) {
        throw new TypeError("El WhatsApp del co-autor debe contener entre 8 y 15 dígitos.");
    }
    return digits;
}

function parseCoauthors(value: unknown): CoAuthorInput[] {
    if (value === undefined || value === null) return [];
    if (!Array.isArray(value)) {
        throw new TypeError("Los co-autores deben ser una lista.");
    }
    if (value.length > 5) {
        throw new TypeError("Se admiten como máximo 5 co-autores por proyecto.");
    }

    return value.map((item) => {
        if (!isRecord(item)) {
            throw new TypeError("Cada co-autor debe ser un objeto con nombre y contactos.");
        }
        const allowedCoauthorFields = [
            "name",
            "githubUrl",
            "linkedinUrl",
            "twitterUrl",
            "instagramUrl",
            "email",
            "whatsapp",
            "showAsCreator",
        ];
        if (Object.keys(item).some((key) => !allowedCoauthorFields.includes(key))) {
            throw new TypeError("El co-autor contiene campos no permitidos.");
        }
        if (typeof item.name !== "string" || !item.name.trim() || item.name.trim().length > 80) {
            throw new TypeError("El nombre del co-autor es obligatorio y admite hasta 80 caracteres.");
        }
        if (item.showAsCreator !== undefined && typeof item.showAsCreator !== "boolean") {
            throw new TypeError("El campo principal del co-autor debe ser verdadero o falso.");
        }
        return {
            name: item.name.trim(),
            githubUrl: parseOptionalUrl(item.githubUrl, "El GitHub del co-autor"),
            linkedinUrl: parseOptionalUrl(item.linkedinUrl, "El LinkedIn del co-autor"),
            twitterUrl: parseOptionalUrl(item.twitterUrl, "El X del co-autor"),
            instagramUrl: parseOptionalUrl(item.instagramUrl, "El Instagram del co-autor"),
            email: parseCoauthorEmail(item.email),
            whatsapp: parseCoauthorWhatsapp(item.whatsapp),
            showAsCreator: item.showAsCreator === true,
        };
    });
}

function parseProject(value: unknown): ProjectInput {
    const allowedFields = [
        "title",
        "description",
        "cityId",
        "categoryIds",
        "imageUrl",
        "pageUrl",
        "livecodeUrl",
        "coauthors",
    ];
    if (!isRecord(value) || Object.keys(value).some((key) => !allowedFields.includes(key))) {
        throw new TypeError("El cuerpo contiene campos no permitidos.");
    }

    if (
        typeof value.title !== "string" ||
        !value.title.trim() ||
        value.title.trim().length > 120
    ) {
        throw new TypeError("El nombre es obligatorio y admite hasta 120 caracteres.");
    }
    if (
        typeof value.description !== "string" ||
        !value.description.trim() ||
        value.description.trim().length > 2000
    ) {
        throw new TypeError("La descripción es obligatoria y admite hasta 2000 caracteres.");
    }

    const cityId = parseId(value.cityId);
    if (cityId === null) {
        throw new TypeError("Selecciona una ciudad válida.");
    }
    if (
        !Array.isArray(value.categoryIds) ||
        value.categoryIds.length === 0
    ) {
        throw new TypeError("Selecciona al menos una categoría.");
    }

    const categoryIds: number[] = [];
    for (const valueId of value.categoryIds) {
        const id = parseId(valueId);
        if (id === null) throw new TypeError("Las categorías seleccionadas no son válidas.");
        categoryIds.push(id);
    }
    if (new Set(categoryIds).size !== categoryIds.length) {
        throw new TypeError("Las categorías seleccionadas no son válidas.");
    }

    return {
        title: value.title.trim(),
        description: value.description.trim(),
        cityId,
        categoryIds,
        imageUrl: parseImageUrl(value.imageUrl),
        pageUrl: parseOptionalUrl(value.pageUrl, "El sitio web"),
        livecodeUrl: parseOptionalUrl(value.livecodeUrl, "El repositorio"),
        coauthors: parseCoauthors(value.coauthors),
    };
}

export async function GET(request: Request) {
    return handleProjectsList(request);
}

export async function POST(request: Request) {
    const url = new URL(request.url);
    if (url.searchParams.has("category") || url.searchParams.has("offset")) {
        return handleProjectsList(request);
    }

    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) return apiError("Autenticación requerida.", 401);

    const body = await readJson(request);
    if (!body.ok) return apiError(body.error, 400);

    let project: ProjectInput;
    try {
        project = parseProject(body.value);
    } catch (error) {
        if (error instanceof TypeError) return apiError(error.message, 400);
        throw error;
    }

    const [city] = await db
        .select({ id: cities.id })
        .from(cities)
        .where(eq(cities.id, project.cityId))
        .limit(1);
    if (!city) return apiError("La ciudad seleccionada ya no está disponible.", 400);

    const availableCategories = await db
        .select({ id: categories.id })
        .from(categories)
        .where(inArray(categories.id, project.categoryIds));
    if (availableCategories.length !== project.categoryIds.length) {
        return apiError("Una o más categorías ya no están disponibles.", 400);
    }

    const projectId = await db.transaction(async (tx) => {
        const [created] = await tx
            .insert(projects)
            .values({
                title: project.title,
                description: project.description,
                creatorId: session.user.id,
                cityId: project.cityId,
                imageUrl: project.imageUrl,
                pageUrl: project.pageUrl,
                livecodeUrl: project.livecodeUrl,
            })
            .returning({ id: projects.id });
        if (!created) throw new Error("No se pudo crear el proyecto.");

        await tx.insert(projectCategories).values(
            project.categoryIds.map((categoryId) => ({
                projectId: created.id,
                categoryId,
            })),
        );

        if (project.coauthors.length > 0) {
            await tx.insert(projectCoauthors).values(
                project.coauthors.map((coauthor) => ({
                    projectId: created.id,
                    name: coauthor.name,
                    githubUrl: coauthor.githubUrl,
                    linkedinUrl: coauthor.linkedinUrl,
                    twitterUrl: coauthor.twitterUrl,
                    instagramUrl: coauthor.instagramUrl,
                    email: coauthor.email,
                    whatsapp: coauthor.whatsapp,
                    showAsCreator: coauthor.showAsCreator,
                })),
            );
        }
        return created.id;
    });

    return Response.json(
        { projectId },
        {
            status: 201,
            headers: { Location: `/proyectos/${projectId}` },
        },
    );
}
