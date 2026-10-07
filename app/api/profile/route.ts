import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/db";
import { profiles, user } from "@/db/schema";
import { auth } from "../../lib/auth";

type EditableProfile = {
    name?: string;
    githubUrl?: string | null;
    linkedinUrl?: string | null;
    twitterUrl?: string | null;
    instagramUrl?: string | null;
    email?: string | null;
    whatsapp?: string | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseOptionalUrl(value: unknown, field: string): string | null {
    if (value === null || value === "") return null;
    if (typeof value !== "string" || value.trim().length > 2048) {
        throw new TypeError(`${field} debe ser una URL válida de hasta 2048 caracteres.`);
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

function parseProfile(value: unknown): EditableProfile {
    const allowedFields = ["name", "githubUrl", "linkedinUrl", "twitterUrl", "instagramUrl", "email", "whatsapp"];
    if (!isRecord(value) || Object.keys(value).length === 0) {
        throw new TypeError("El cuerpo debe ser un objeto JSON con campos editables.");
    }
    if (Object.keys(value).some((key) => !allowedFields.includes(key))) {
        throw new TypeError("El cuerpo contiene campos no editables.");
    }

    const profile: EditableProfile = {};
    if ("name" in value) {
        if (typeof value.name !== "string" || !value.name.trim() || value.name.trim().length > 80) {
            throw new TypeError("El nombre es obligatorio y admite hasta 80 caracteres.");
        }
        profile.name = value.name.trim();
    }

    for (const field of ["githubUrl", "linkedinUrl", "twitterUrl", "instagramUrl"] as const) {
        if (field in value) profile[field] = parseOptionalUrl(value[field], field);
    }

    if ("email" in value) {
        if (value.email === null || value.email === "") {
            profile.email = null;
        } else if (
            typeof value.email !== "string" ||
            value.email.trim().length > 254 ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email.trim())
        ) {
            throw new TypeError("El correo debe ser válido y tener como máximo 254 caracteres.");
        } else {
            profile.email = value.email.trim();
        }
    }

    if ("whatsapp" in value) {
        if (value.whatsapp === null || value.whatsapp === "") {
            profile.whatsapp = null;
        } else if (
            typeof value.whatsapp !== "string" ||
            !/^\+?[\d\s().-]{8,20}$/.test(value.whatsapp.trim())
        ) {
            throw new TypeError("WhatsApp debe contener entre 8 y 15 dígitos.");
        } else {
            const digits = value.whatsapp.replace(/[\s()+.-]/g, "");
            if (!/^\d{8,15}$/.test(digits)) {
                throw new TypeError("WhatsApp debe contener entre 8 y 15 dígitos.");
            }
            profile.whatsapp = digits;
        }
    }

    return profile;
}

async function getAuthenticatedUser() {
    const session = await auth.api.getSession({ headers: await headers() });
    return session?.user ?? null;
}

function unauthorized() {
    return Response.json({ error: "Autenticación requerida." }, { status: 401 });
}

export async function GET() {
    const currentUser = await getAuthenticatedUser();
    if (!currentUser) return unauthorized();

    const [profile] = await db
        .select({
            role: profiles.role,
            githubUrl: profiles.githubUrl,
            linkedinUrl: profiles.linkedinUrl,
            twitterUrl: profiles.twitterUrl,
            instagramUrl: profiles.instagramUrl,
            email: profiles.email,
            whatsapp: profiles.whatsapp,
        })
        .from(profiles)
        .where(eq(profiles.userId, currentUser.id))
        .limit(1);

    return Response.json({
        profile: {
            name: currentUser.name,
            role: profile?.role ?? "user",
            githubUrl: profile?.githubUrl ?? null,
            linkedinUrl: profile?.linkedinUrl ?? null,
            twitterUrl: profile?.twitterUrl ?? null,
            instagramUrl: profile?.instagramUrl ?? null,
            email: profile?.email ?? null,
            whatsapp: profile?.whatsapp ?? null,
        },
    });
}

export async function PATCH(request: Request) {
    const currentUser = await getAuthenticatedUser();
    if (!currentUser) return unauthorized();

    let body: unknown;
    try {
        body = await request.json() as unknown;
    } catch {
        return Response.json({ error: "El cuerpo debe ser JSON válido." }, { status: 400 });
    }

    let changes: EditableProfile;
    try {
        changes = parseProfile(body);
    } catch (error) {
        if (error instanceof TypeError) {
            return Response.json({ error: error.message }, { status: 400 });
        }
        throw error;
    }

    const profileChanges = {
        ...(changes.githubUrl !== undefined ? { githubUrl: changes.githubUrl } : {}),
        ...(changes.linkedinUrl !== undefined ? { linkedinUrl: changes.linkedinUrl } : {}),
        ...(changes.twitterUrl !== undefined ? { twitterUrl: changes.twitterUrl } : {}),
        ...(changes.instagramUrl !== undefined ? { instagramUrl: changes.instagramUrl } : {}),
        ...(changes.email !== undefined ? { email: changes.email } : {}),
        ...(changes.whatsapp !== undefined ? { whatsapp: changes.whatsapp } : {}),
    };

    await db.transaction(async (tx) => {
        if (changes.name !== undefined) {
            await tx.update(user).set({ name: changes.name }).where(eq(user.id, currentUser.id));
        }

        await tx
            .insert(profiles)
            .values({ userId: currentUser.id, ...profileChanges })
            .onConflictDoUpdate({
                target: profiles.userId,
                set: { ...profileChanges, updatedAt: new Date() },
            });
    });

    const [updatedUser] = await db
        .select({ name: user.name })
        .from(user)
        .where(eq(user.id, currentUser.id))
        .limit(1);
    const [updatedProfile] = await db
        .select({
            githubUrl: profiles.githubUrl,
            linkedinUrl: profiles.linkedinUrl,
            twitterUrl: profiles.twitterUrl,
            instagramUrl: profiles.instagramUrl,
            email: profiles.email,
            whatsapp: profiles.whatsapp,
        })
        .from(profiles)
        .where(eq(profiles.userId, currentUser.id))
        .limit(1);

    if (!updatedUser || !updatedProfile) {
        throw new Error("No se pudo recuperar el perfil actualizado.");
    }

    return Response.json({
        profile: { name: updatedUser.name, ...updatedProfile },
    });
}
