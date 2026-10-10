// Seed único: 12 ciudades + 26 categorías (ES/EN).
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
  {
    code: "cartagena",
    es: {
      name: "Cartagena",
      description: "Turismo, Caribe y tecnología desde la ciudad amurallada.",
    },
    en: {
      name: "Cartagena",
      description: "Tourism, the Caribbean and technology from the walled city.",
    },
  },
  {
    code: "bucaramanga",
    es: {
      name: "Bucaramanga",
      description: "La ciudad bonita: universidades, software y desarrollo.",
    },
    en: {
      name: "Bucaramanga",
      description: "Universities, software and development.",
    },
  },
  {
    code: "pereira",
    es: {
      name: "Pereira",
      description: "Eje cafetero: comercio, agro y tecnología.",
    },
    en: {
      name: "Pereira",
      description: "Coffee region: commerce, farming and technology.",
    },
  },
  {
    code: "manizales",
    es: {
      name: "Manizales",
      description: "Ciudad universitaria: café, datos y desarrollo.",
    },
    en: {
      name: "Manizales",
      description: "University city: coffee, data and development.",
    },
  },
  {
    code: "santa-marta",
    es: {
      name: "Santa Marta",
      description: "Sierra, puerto y turismo: tecnología caribeña.",
    },
    en: {
      name: "Santa Marta",
      description: "Mountains, port and tourism: Caribbean technology.",
    },
  },
  {
    code: "cucuta",
    es: {
      name: "Cúcuta",
      description: "Frontera y comercio: software del oriente colombiano.",
    },
    en: {
      name: "Cúcuta",
      description: "Border and trade: software from eastern Colombia.",
    },
  },
  {
    code: "ibague",
    es: {
      name: "Ibagué",
      description: "La ciudad musical: cultura y tecnología del Tolima.",
    },
    en: {
      name: "Ibagué",
      description: "The city of music: culture and technology.",
    },
  },
  {
    code: "villavicencio",
    es: {
      name: "Villavicencio",
      description: "Puerta del llano: agro, energía y tecnología.",
    },
    en: {
      name: "Villavicencio",
      description: "Gateway to the plains: farming, energy and technology.",
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
  {
    code: "comercio-electronico",
    es: {
      name: "Comercio electrónico",
      description: "Tiendas, marketplaces y pagos en línea.",
    },
    en: {
      name: "E-commerce",
      description: "Stores, marketplaces and online payments.",
    },
  },
  {
    code: "logistica",
    es: {
      name: "Logística y transporte",
      description: "Envíos, rutas y movilidad.",
    },
    en: {
      name: "Logistics",
      description: "Shipping, routes and mobility.",
    },
  },
  {
    code: "agro",
    es: {
      name: "Agro y campo",
      description: "Software para el campo: café, flores y cacao.",
    },
    en: { name: "AgTech", description: "Farm software: coffee, flowers, cocoa." },
  },
  {
    code: "turismo",
    es: {
      name: "Turismo y viajes",
      description: "Reservas, experiencias y guías.",
    },
    en: {
      name: "Travel",
      description: "Bookings, experiences and guides.",
    },
  },
  {
    code: "empleo",
    es: {
      name: "Empleo y talento",
      description: "Bolsas de trabajo, nóminas y reclutamiento.",
    },
    en: {
      name: "Jobs & HR",
      description: "Job boards, payroll and hiring.",
    },
  },
  {
    code: "proptech",
    es: {
      name: "Hábitat y PropTech",
      description: "Arriendos, finca raíz y vivienda.",
    },
    en: { name: "Real estate", description: "Rentals and property." },
  },
  {
    code: "govtech",
    es: {
      name: "Gobierno y civic tech",
      description: "Datos abiertos y trámites digitales.",
    },
    en: {
      name: "GovTech",
      description: "Open data and digital procedures.",
    },
  },
  {
    code: "clima",
    es: {
      name: "Clima y medio ambiente",
      description: "Sostenibilidad, agua y biodiversidad.",
    },
    en: {
      name: "Climate",
      description: "Sustainability, water and biodiversity.",
    },
  },
  {
    code: "energia",
    es: {
      name: "Energía",
      description: "Solar, consumo y transición energética.",
    },
    en: {
      name: "Energy",
      description: "Solar, consumption and energy transition.",
    },
  },
  {
    code: "gastronomia",
    es: {
      name: "Comida y restaurantes",
      description: "Menús, domicilios y reservas.",
    },
    en: {
      name: "Food",
      description: "Menus, delivery and reservations.",
    },
  },
  {
    code: "deporte",
    es: {
      name: "Deporte y fitness",
      description: "Entrena, compite y mide tu progreso.",
    },
    en: {
      name: "Sports & fitness",
      description: "Train, compete and track progress.",
    },
  },
  {
    code: "legal",
    es: {
      name: "Legal",
      description: "Trámites, contratos y consultas.",
    },
    en: {
      name: "LegalTech",
      description: "Procedures, contracts and counsel.",
    },
  },
  {
    code: "marketing",
    es: {
      name: "Marketing y ventas",
      description: "CRM, pauta y crecimiento.",
    },
    en: { name: "Marketing & sales", description: "CRM, ads and growth." },
  },
  {
    code: "desarrollo-web",
    es: {
      name: "Desarrollo web",
      description: "Sitios, tiendas y apps web.",
    },
    en: {
      name: "Web dev",
      description: "Sites, stores and web apps.",
    },
  },
  {
    code: "movil",
    es: {
      name: "Apps móviles",
      description: "Apps iOS y Android hechas en Colombia.",
    },
    en: { name: "Mobile", description: "iOS and Android apps." },
  },
  {
    code: "devtools",
    es: {
      name: "Herramientas para devs",
      description: "Librerías, CLI y utilidades.",
    },
    en: {
      name: "DevTools",
      description: "Libraries, CLIs and utilities.",
    },
  },
  {
    code: "apis-datos",
    es: {
      name: "APIs y datos",
      description: "Integraciones y datos abiertos.",
    },
    en: {
      name: "APIs & data",
      description: "Integrations and open data.",
    },
  },
  {
    code: "seguridad",
    es: {
      name: "Ciberseguridad",
      description: "Protección, auditoría y privacidad.",
    },
    en: {
      name: "Security",
      description: "Protection, audits and privacy.",
    },
  },
  {
    code: "web3",
    es: {
      name: "Web3 y blockchain",
      description: "Cripto, contratos y DAOs.",
    },
    en: {
      name: "Web3",
      description: "Crypto, contracts and DAOs.",
    },
  },
  {
    code: "iot",
    es: {
      name: "IoT y hardware",
      description: "Dispositivos, sensores y electrónica.",
    },
    en: {
      name: "IoT & hardware",
      description: "Devices, sensors and electronics.",
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
