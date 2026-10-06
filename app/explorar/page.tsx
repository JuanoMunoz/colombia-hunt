import { redirect } from "next/navigation";

type ExplorarProps = {
  searchParams: Promise<{ q?: string }>;
};

// Por ahora /explorar lleva al index; se preserva ?q para no romper
// buscador, chips ni enlaces existentes.
export default async function ExplorarPage({ searchParams }: ExplorarProps) {
  const { q } = await searchParams;
  const query = q?.trim();
  redirect(query ? `/?q=${encodeURIComponent(query)}` : "/");
}
