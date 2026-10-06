import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { auth } from "./auth";
import { db } from "@/db";
import { profiles } from "@/db/schema";

export async function requireAdmin(): Promise<Response | null> {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
        return Response.json({ error: "Autenticación requerida." }, { status: 401 });
    }

    const [profile] = await db
        .select({ role: profiles.role })
        .from(profiles)
        .where(eq(profiles.userId, session.user.id))
        .limit(1);

    if (profile?.role !== "admin") {
        return Response.json({ error: "Se requiere el rol de administrador." }, { status: 403 });
    }

    return null;
}
