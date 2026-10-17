import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { user } from "@/db/schema";
import ConsentForm from "../../components/sections/ConsentForm";
import { auth } from "../lib/auth";
import { getPostAuthRedirect } from "../lib/auth-redirect";

export const metadata: Metadata = {
  title: "Consentimiento de datos",
  description:
    "Confirma la autorización para el tratamiento de tus datos personales en Colombia Hunt.",
  robots: { index: false, follow: false },
};

type ConsentimientoPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function ConsentimientoPage({
  searchParams,
}: ConsentimientoPageProps) {
  const { next } = await searchParams;
  const target = getPostAuthRedirect(next);

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    redirect(`/iniciar-sesion?next=${encodeURIComponent("/consentimiento")}`);
  }

  const [row] = await db
    .select({ termsAcceptedAt: user.termsAcceptedAt })
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1);
  if (row?.termsAcceptedAt) {
    redirect(target);
  }

  return (
    <main className="surface-light flex flex-1 flex-col bg-(--background)">
      <ConsentForm next={target} />
    </main>
  );
}
