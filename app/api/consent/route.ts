import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/db";
import { user } from "@/db/schema";
import { auth } from "../../lib/auth";
import { PRIVACY_POLICY_VERSION } from "../../../lib/legal";

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function POST(request: Request) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
        return Response.json({ error: "Autenticación requerida." }, { status: 401 });
    }

    let body: unknown;
    try {
        body = await request.json() as unknown;
    } catch {
        return Response.json({ error: "El cuerpo debe ser JSON válido." }, { status: 400 });
    }

    if (!isRecord(body) || body.termsAccepted !== true) {
        return Response.json(
            { error: "Debes aceptar la política de tratamiento de datos." },
            { status: 400 },
        );
    }

    const marketingOptIn = typeof body.marketingOptIn === "boolean" ? body.marketingOptIn : false;

    await db
        .update(user)
        .set({
            termsAcceptedAt: new Date().toISOString(),
            termsVersion: PRIVACY_POLICY_VERSION,
            marketingOptIn,
        })
        .where(eq(user.id, session.user.id));

    return Response.json({ ok: true });
}
