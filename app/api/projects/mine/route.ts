import { headers } from "next/headers";
import { auth } from "../../../lib/auth";
import { apiError } from "../../_lib/catalog";
import { getOwnProjects } from "../../../../lib/project-data";

export async function GET() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
        return apiError("Autenticación requerida.", 401);
    }

    const items = await getOwnProjects(session.user.id);
    return Response.json({ items });
}
