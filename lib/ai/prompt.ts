import type { BrandVoice, SiteConfig } from "@/lib/types";
import { humanizeCategory, localityFromAddress } from "@/lib/seo";

/** The copy the model returns. Mirrors the json schema below. */
export interface GeneratedCopy {
  heroHeadline: string;
  heroSubhead: string;
  aboutTitle: string;
  aboutBody: string;
  ctaTitle: string;
  ctaText: string;
  metaDescription: string;
  specialties: { title: string; description: string }[];
  whyUs: string[];
}

const TONE: Record<BrandVoice["tone"], string> = {
  amigable: "cercano y cálido, que tutea al lector",
  formal: "profesional y formal",
  divertido: "divertido y desenfadado",
  elegante: "elegante y sofisticado",
};
const VIBE: Record<BrandVoice["vibe"], string> = {
  caracter: "con carácter y personalidad fuerte",
  calido: "acogedor y familiar",
  energico: "enérgico y juvenil",
  clasico: "clásico y de confianza",
};
const FOCUS: Record<BrandVoice["customerFocus"], string> = {
  rapido: "el servicio rápido y eficiente",
  "trato-calido": "el trato cálido y personal",
  calidad: "la calidad de los ingredientes",
  ambiente: "el ambiente y la experiencia",
};

function brandVoiceLine(v: BrandVoice): string {
  return `Tono ${TONE[v.tone]}; ambiente ${VIBE[v.vibe]}; lo que más valoran es ${FOCUS[v.customerFocus]}.`;
}

/** JSON schema for OpenRouter/OpenAI structured outputs (strict mode). */
export const COPY_JSON_SCHEMA = {
  name: "site_copy",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      heroHeadline: { type: "string" },
      heroSubhead: { type: "string" },
      aboutTitle: { type: "string" },
      aboutBody: { type: "string" },
      ctaTitle: { type: "string" },
      ctaText: { type: "string" },
      metaDescription: { type: "string" },
      specialties: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            title: { type: "string" },
            description: { type: "string" },
          },
          required: ["title", "description"],
        },
      },
      whyUs: { type: "array", items: { type: "string" } },
    },
    required: [
      "heroHeadline",
      "heroSubhead",
      "aboutTitle",
      "aboutBody",
      "ctaTitle",
      "ctaText",
      "metaDescription",
      "specialties",
      "whyUs",
    ],
  },
} as const;

const SYSTEM_PROMPT = `Eres un experto en copywriting y SEO local para restaurantes y negocios en LATAM. Escribes el contenido de la página web de un negocio que, muy probablemente, es su única presencia en internet.

REGLAS INQUEBRANTABLES:
1. Escribe SIEMPRE en español neutro de LATAM, aunque los datos de origen estén en otro idioma.
2. Da VOZ y personalidad, pero NUNCA inventes hechos: no menciones años de antigüedad, premios, certificaciones, chefs ni platillos que no estén respaldados por los datos que te doy.
3. Apóyate en las reseñas y el resumen para mencionar platillos, ambiente y experiencias REALES.
4. Si hay pocos datos, sé conservador y general; no rellenes con afirmaciones que no puedas sustentar.
5. SEO local: incluye de forma natural el tipo de cocina/negocio y la ciudad en el título principal y en la meta description.
6. Sé concreto y evita clichés vacíos ("el mejor lugar", "experiencia única") salvo que las reseñas lo respalden.

QUÉ GENERAR:
- heroHeadline: título principal corto y con gancho (idealmente cocina + ciudad).
- heroSubhead: una frase de apoyo.
- aboutTitle: título de la sección "sobre nosotros" (puede tener marca).
- aboutBody: 2 a 3 frases describiendo el lugar, en español, basadas en el resumen y reseñas.
- ctaTitle / ctaText: cierre que invita a visitar, reservar u ordenar.
- metaDescription: 140-160 caracteres, con cocina + ciudad, atractiva para buscadores.
- specialties: hasta 4 platillos o servicios DESTACADOS que aparezcan en las reseñas, cada uno con un título corto y una descripción de una frase. Si no hay evidencia suficiente, devuelve menos o un arreglo vacío.
- whyUs: hasta 3 razones reales para elegir el negocio, basadas en sus fortalezas evidentes.`;

/** Build the chat messages from the real business facts + brand voice. */
export function buildMessages(config: SiteConfig) {
  const b = config.business;
  const category = humanizeCategory(b.categories);
  const locality = localityFromAddress(b.address);

  const reviewSnippets = b.reviews
    .filter((r) => r.text && r.text.trim().length > 0)
    .slice(0, 6)
    .map((r) => `(${r.rating}★) ${r.text.replace(/\s+/g, " ").trim().slice(0, 280)}`);

  const attrs: string[] = [];
  if (b.serves?.vegetarian) attrs.push("opciones vegetarianas");
  if (b.serves?.brunch) attrs.push("brunch");
  if (b.serviceOptions?.delivery) attrs.push("servicio a domicilio");
  if (b.serviceOptions?.takeout) attrs.push("para llevar");
  if (b.serviceOptions?.reservable) attrs.push("acepta reservas");

  const facts = {
    nombre: b.name,
    tipo: category ?? "negocio/restaurante",
    ciudad: locality ?? "(desconocida)",
    nivelDePrecio: typeof b.priceLevel === "number" ? "$".repeat(Math.max(1, b.priceLevel)) : "(desconocido)",
    calificacion: typeof b.rating === "number" ? `${b.rating} de 5 (${b.userRatingsTotal ?? "?"} reseñas)` : "(sin calificación)",
    resumenDeGoogle: b.editorialSummary ?? "(sin resumen)",
    atributos: attrs.length ? attrs.join(", ") : "(sin atributos)",
    reseñas: reviewSnippets.length ? reviewSnippets : ["(sin reseñas con texto)"],
  };

  const userContent = `Genera el contenido de la página para este negocio.

VOZ DE MARCA (elegida por el dueño): ${brandVoiceLine(config.brandVoice)}

DATOS REALES (no inventes nada fuera de esto):
${JSON.stringify(facts, null, 2)}`;

  return [
    { role: "system" as const, content: SYSTEM_PROMPT },
    { role: "user" as const, content: userContent },
  ];
}
