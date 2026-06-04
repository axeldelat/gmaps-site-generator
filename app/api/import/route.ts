import { NextResponse } from "next/server";
import { PlacesError, resolvePlaceId, fetchBusiness } from "@/lib/google/places";

export const runtime = "nodejs";

interface ImportRequestBody {
  url?: unknown;
}

/** POST /api/import — resolve a Google Maps URL to a normalized Business. */
export async function POST(request: Request) {
  let body: ImportRequestBody;
  try {
    body = (await request.json()) as ImportRequestBody;
  } catch {
    return NextResponse.json(
      { error: "Please provide a Google Maps business URL." },
      { status: 400 },
    );
  }

  if (typeof body.url !== "string" || body.url.trim() === "") {
    return NextResponse.json(
      { error: "Please paste a Google Maps business URL." },
      { status: 400 },
    );
  }

  try {
    const placeId = await resolvePlaceId(body.url);
    const business = await fetchBusiness(placeId);
    return NextResponse.json({ business });
  } catch (err) {
    if (err instanceof PlacesError) {
      // Log the underlying cause server-side; return only the safe message.
      console.error("[import] PlacesError:", err.kind, err.cause ?? err.message);
      return NextResponse.json(
        { error: err.userMessage },
        { status: err.httpStatus },
      );
    }
    console.error("[import] Unexpected error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
