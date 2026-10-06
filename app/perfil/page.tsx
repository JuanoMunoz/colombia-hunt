import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import ProfileForm from "../../components/sections/ProfileForm";
import { getSession } from "../lib/get-session";
import { db } from "@/db";
import { profiles } from "@/db/schema";

export const metadata: Metadata = {
    title: "Tu perfil | Colombia Hunt",
    description: "Configura tu nombre y enlaces de perfil en Colombia Hunt.",
    robots: { index: false, follow: false },
};

export default async function ProfilePage() {
    const session = await getSession();
    if (!session?.user) redirect("/iniciar-sesion");

    const [profile] = await db
        .select()
        .from(profiles)
        .where(eq(profiles.userId, session.user.id))
        .limit(1);

    const pageJsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Tu perfil",
        description: "Configuración del perfil de Colombia Hunt.",
        inLanguage: "es",
    };

    return (
        <main className="surface-light flex flex-1 flex-col bg-(--background)">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
            />
            <ProfileForm
                name={session.user.name}
                githubUrl={profile?.githubUrl ?? ""}
                linkedinUrl={profile?.linkedinUrl ?? ""}
                twitterUrl={profile?.twitterUrl ?? ""}
                whatsapp={profile?.whatsapp ?? ""}
            />
        </main>
    );
}