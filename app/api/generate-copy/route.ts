import { NextResponse } from "next/server";
import type { SiteConfig } from "@/lib/types";
import { generateCopy, AiError } from "@/lib/ai/openrouter";

export const runtime = "nodejs";
// A single generation call; allow time for the model + our 30s client timeout.
export const maxDuration = 60;

/** POST /api/generate-copy — generate Spanish site copy for the given config. */
export async function POST(request: Request) {
  let config: SiteConfig;
  try {
    const body = (await request.json()) as { config?: SiteConfig };
    if (!body.config?.business) throw new Error("missing config");
    config = body.config;
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  try {
    const content = await generateCopy(config);
    return NextResponse.json({ content });
  } catch (err) {
    // Any failure here is non-fatal for the user: the client falls back to the
    // non-AI defaults. We log the cause server-side and signal a soft failure.
    if (err instanceof AiError) {
      console.error("[generate-copy] AiError:", err.kind, err.cause ?? err.message);
    } else {
      console.error("[generate-copy] Unexpected:", err);
    }
    return NextResponse.json({ error: "generation_failed" }, { status: 502 });
  }
}
