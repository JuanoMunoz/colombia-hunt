// Seed único: 4 ciudades + 6 categorías (ES/EN).
// Uso: pnpm db:seed   (requiere TURSO_CONNECTION_URL y TURSO_AUTH_TOKEN en .env)
// Idempotente: usa INSERT OR IGNORE, se puede re-ejecutar sin duplicar.
// SQL directo con @libsql/client para no depender del schema drizzle.
import { config } from "dotenv";
import { createClient } from "@libsql/client";

config({ path: ".env" });

const url = process.env.TURSO_CONNECTION_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;
if (!url) throw new Error("Falta TURSO_CONNECTION_URL en .env");

const client = createClient({ url, authToken });

const CITIES: Array<{
  code: string;
  es: { name: string; description: string };
  en: { name: string; description: string };
}> = [
  {
    code: "medellin",
    es: {
      name: "Medellín",
      description:
        "La ciudad de la eterna primavera: software, startups y tecnología.",
    },
    en: {
      name: "Medellín",
      description:
        "The city of eternal spring: software, startups and technology.",
    },
  },
  {
    code: "bogota",
    es: {
      name: "Bogotá",
      description:
        "La capital: el mayor ecosistema de software y desarrollo del país.",
    },
    en: {
      name: "Bogotá",
      description:
        "The capital: the country's largest software and development ecosystem.",
    },
  },
  {
    code: "cali",
    es: {
      name: "Cali",
      description: "Tecnología, creatividad y talento digital del suroccidente.",
    },
    en: {
      name: "Cali",
      description: "Technology, creativity and digital talent.",
    },
  },
  {
    code: "barranquilla",
    es: {
      name: "Barranquilla",
      description: "La puerta de oro: desarrollo y tecnología caribeña.",
    },
    en: {
      name: "Barranquilla",
      description: "The golden gate: Caribbean development and technology.",
    },
  },
];

const CATEGORIES: Array<{
  code: string;
  es: { name: string; description: string };
  en: { name: string; description: string };
}> = [
  {
    code: "finanzas",
    es: {
      name: "Finanzas",
      description: "Proyectos de tecnología financiera.",
    },
    en: { name: "Finance", description: "Financial technology projects." },
  },
  {
    code: "open-source",
    es: {
      name: "Open Source",
      description: "Código abierto hecho en Colombia.",
    },
    en: {
      name: "Open Source",
      description: "Open source made in Colombia.",
    },
  },
  {
    code: "entretenimiento",
    es: {
      name: "Entretenimiento",
      description: "Juegos, video y cultura digital.",
    },
    en: {
      name: "Entertainment",
      description: "Games, video and digital culture.",
    },
  },
  {
    code: "educacion",
    es: {
      name: "Educación",
      description: "Tecnología para aprender y enseñar.",
    },
    en: {
      name: "Education",
      description: "Technology for learning and teaching.",
    },
  },
  {
    code: "salud",
    es: {
      name: "Salud",
      description: "Software para la salud y el bienestar.",
    },
    en: {
      name: "Health",
      description: "Software for health and wellness.",
    },
  },
  {
    code: "inteligencia-artificial",
    es: {
      name: "Inteligencia artificial",
      description: "IA y datos hechos en Colombia.",
    },
    en: {
      name: "Artificial intelligence",
      description: "AI and data made in Colombia.",
    },
  },
];

const statements: Array<{ sql: string; args: string[] }> = [];

for (const city of CITIES) {
  statements.push(
    {
      sql: "INSERT OR IGNORE INTO cities (code, created_at, updated_at) VALUES (?, unixepoch(), unixepoch())",
      args: [city.code],
    },
    {
      sql: "INSERT OR IGNORE INTO city_translations (city_id, locale, slug, name, description, created_at, updated_at) SELECT id, ?, ?, ?, ?, unixepoch(), unixepoch() FROM cities WHERE code = ?",
      args: ["es", city.code, city.es.name, city.es.description, city.code],
    },
    {
      sql: "INSERT OR IGNORE INTO city_translations (city_id, locale, slug, name, description, created_at, updated_at) SELECT id, ?, ?, ?, ?, unixepoch(), unixepoch() FROM cities WHERE code = ?",
      args: ["en", city.code, city.en.name, city.en.description, city.code],
    },
  );
}

for (const category of CATEGORIES) {
  statements.push(
    {
      sql: "INSERT OR IGNORE INTO categories (code, created_at, updated_at) VALUES (?, unixepoch(), unixepoch())",
      args: [category.code],
    },
    {
      sql: "INSERT OR IGNORE INTO category_translations (category_id, locale, name, description, created_at, updated_at) SELECT id, ?, ?, ?, unixepoch(), unixepoch() FROM categories WHERE code = ?",
      args: ["es", category.es.name, category.es.description, category.code],
    },
    {
      sql: "INSERT OR IGNORE INTO category_translations (category_id, locale, name, description, created_at, updated_at) SELECT id, ?, ?, ?, unixepoch(), unixepoch() FROM categories WHERE code = ?",
      args: ["en", category.en.name, category.en.description, category.code],
    },
  );
}

async function main(): Promise<void> {
  await client.batch(statements);

  const cities = await client.execute("SELECT COUNT(*) AS n FROM cities");
  const translations = await client.execute(
    "SELECT COUNT(*) AS n FROM city_translations",
  );
  const categories = await client.execute(
    "SELECT COUNT(*) AS n FROM categories",
  );
  const categoryTranslations = await client.execute(
    "SELECT COUNT(*) AS n FROM category_translations",
  );
  const seededCounts = {
    cities: Number(cities.rows[0]?.n ?? 0),
    cityTranslations: Number(translations.rows[0]?.n ?? 0),
    categories: Number(categories.rows[0]?.n ?? 0),
    categoryTranslations: Number(categoryTranslations.rows[0]?.n ?? 0),
  };

  if (
    seededCounts.cities < CITIES.length ||
    seededCounts.cityTranslations < CITIES.length * 2 ||
    seededCounts.categories < CATEGORIES.length ||
    seededCounts.categoryTranslations < CATEGORIES.length * 2
  ) {
    throw new Error(`Seed incompleto: ${JSON.stringify(seededCounts)}`);
  }

  console.log(
    JSON.stringify(
      seededCounts,
      null,
      2,
    ),
  );

  client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
