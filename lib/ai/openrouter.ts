import "server-only";
import type { SiteConfig } from "@/lib/types";
import {
  buildMessages,
  COPY_JSON_SCHEMA,
  type GeneratedCopy,
} from "@/lib/ai/prompt";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = "openai/gpt-4o-mini";
const TIMEOUT_MS = 30_000;
const MAX_SPECIALTIES = 4;
const MAX_WHYUS = 3;

export type AiErrorKind = "config" | "network" | "provider" | "invalid";

export class AiError extends Error {
  readonly kind: AiErrorKind;
  constructor(kind: AiErrorKind, message: string, cause?: unknown) {
    super(message);
    this.name = "AiError";
    this.kind = kind;
    if (cause !== undefined) this.cause = cause;
  }
}

function cleanString(v: unknown): string | null {
  return typeof v === "string" && v.trim().length > 0 ? v.trim() : null;
}

/**
 * Validate raw model output against the expected shape. Returns a sanitized
 * GeneratedCopy, or null if any required field is missing/invalid. Arrays are
 * capped and their malformed entries dropped.
 */
export function validateCopy(raw: unknown): GeneratedCopy | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;

  const heroHeadline = cleanString(o.heroHeadline);
  const heroSubhead = cleanString(o.heroSubhead);
  const aboutTitle = cleanString(o.aboutTitle);
  const aboutBody = cleanString(o.aboutBody);
  const ctaTitle = cleanString(o.ctaTitle);
  const ctaText = cleanString(o.ctaText);
  const metaDescription = cleanString(o.metaDescription);
  if (
    !heroHeadline || !heroSubhead || !aboutTitle || !aboutBody ||
    !ctaTitle || !ctaText || !metaDescription
  ) {
    return null;
  }

  const specialties: GeneratedCopy["specialties"] = [];
  if (Array.isArray(o.specialties)) {
    for (const s of o.specialties) {
      if (specialties.length >= MAX_SPECIALTIES) break;
      const title = cleanString((s as Record<string, unknown>)?.title);
      const description = cleanString((s as Record<string, unknown>)?.description);
      if (title && description) specialties.push({ title, description });
    }
  }

  const whyUs: string[] = [];
  if (Array.isArray(o.whyUs)) {
    for (const w of o.whyUs) {
      if (whyUs.length >= MAX_WHYUS) break;
      const point = cleanString(w);
      if (point) whyUs.push(point);
    }
  }

  return {
    heroHeadline, heroSubhead, aboutTitle, aboutBody,
    ctaTitle, ctaText, metaDescription, specialties, whyUs,
  };
}

/**
 * Generate site copy via OpenRouter (one structured-output call). Server-only:
 * the API key never leaves this process. Throws AiError on any failure so the
 * caller can fall back to non-AI defaults.
 */
export async function generateCopy(config: SiteConfig): Promise<GeneratedCopy> {
  // Accept either OPENROUTER_API_KEY (documented) or OPENROUTER (shorthand).
  const key = process.env.OPENROUTER_API_KEY || process.env.OPENROUTER;
  if (!key) {
    throw new AiError("config", "OPENROUTER_API_KEY (or OPENROUTER) is not set");
  }
  const model = process.env.OPENROUTER_MODEL || DEFAULT_MODEL;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model,
        messages: buildMessages(config),
        response_format: { type: "json_schema", json_schema: COPY_JSON_SCHEMA },
        temperature: 0.7,
      }),
      signal: controller.signal,
    });
  } catch (cause) {
    throw new AiError("network", "Could not reach OpenRouter", cause);
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new AiError("provider", `OpenRouter HTTP ${res.status}: ${body.slice(0, 300)}`);
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new AiError("invalid", "OpenRouter returned no content");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch (cause) {
    throw new AiError("invalid", "OpenRouter content was not valid JSON", cause);
  }

  const valid = validateCopy(parsed);
  if (!valid) {
    throw new AiError("invalid", "OpenRouter output failed validation");
  }
  return valid;
}
