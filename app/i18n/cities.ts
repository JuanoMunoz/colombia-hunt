export const KNOWN_CITIES: Record<string, string> = {
  medellin: "Medellín",
  bogota: "Bogotá",
  cali: "Cali",
  barranquilla: "Barranquilla",
  cartagena: "Cartagena",
  bucaramanga: "Bucaramanga",
};

export function prettifyCity(slug: string): string {
  const known = KNOWN_CITIES[slug.toLowerCase()];
  if (known) return known;
  return decodeURIComponent(slug)
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
