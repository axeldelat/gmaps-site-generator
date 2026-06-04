import { NextResponse } from "next/server";
import { PlacesError, fetchPhotoBytes } from "@/lib/google/places";

export const runtime = "nodejs";

/**
 * GET /api/photo?ref=... — proxy a Google place photo for the in-app preview.
 * The API key stays server-side; the browser only ever sees this proxy URL.
 */
export async function GET(request: Request) {
  const ref = new URL(request.url).searchParams.get("ref");
  if (!ref) {
    return NextResponse.json({ error: "Missing photo reference." }, { status: 400 });
  }

  try {
    const { body, contentType } = await fetchPhotoBytes(ref);
    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, immutable",
      },
    });
  } catch (err) {
    if (err instanceof PlacesError) {
      console.error("[photo] PlacesError:", err.kind, err.cause ?? err.message);
      return NextResponse.json({ error: err.userMessage }, { status: err.httpStatus });
    }
    console.error("[photo] Unexpected error:", err);
    return NextResponse.json({ error: "Could not load image." }, { status: 500 });
  }
}
