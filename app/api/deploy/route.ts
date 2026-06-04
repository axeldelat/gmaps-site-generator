import { NextResponse } from "next/server";
import type { SiteConfig } from "@/lib/types";
import { fetchPhotoBytes, PlacesError } from "@/lib/google/places";
import { renderSiteHtml } from "@/lib/render/renderHtml";
import { deploySite, DeployError, type DeployFile } from "@/lib/vercel/deploy";

export const runtime = "nodejs";
// Deployment polling can take a while; allow a long-running request.
export const maxDuration = 300;

function extFromContentType(contentType: string): string {
  if (contentType.includes("png")) return "png";
  if (contentType.includes("webp")) return "webp";
  if (contentType.includes("gif")) return "gif";
  return "jpg";
}

function slugify(name: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40);
  return slug || "business-site";
}

/** POST /api/deploy — bundle the site and deploy it to Vercel. */
export async function POST(request: Request) {
  let config: SiteConfig;
  try {
    const body = (await request.json()) as { config?: SiteConfig };
    if (!body.config?.business) throw new Error("missing config");
    config = body.config;
  } catch {
    return NextResponse.json(
      { error: "Your site couldn't be read. Please reload and try again." },
      { status: 400 },
    );
  }

  try {
    // Fetch photo bytes server-side and bundle them locally so the deployed
    // site never references the Google API key.
    const photoFiles: DeployFile[] = [];
    const photoPaths: string[] = [];
    for (let i = 0; i < config.business.photos.length && i < 6; i++) {
      const photo = config.business.photos[i];
      const { body, contentType } = await fetchPhotoBytes(photo.ref);
      const ext = extFromContentType(contentType);
      const path = `photos/${i}.${ext}`;
      photoFiles.push({ path, data: Buffer.from(body) });
      photoPaths.push(path);
    }

    const html = await renderSiteHtml(config, photoPaths);

    const files: DeployFile[] = [
      { path: "index.html", data: Buffer.from(html, "utf-8") },
      // Ship the config for transparency / future re-editing.
      { path: "site.config.json", data: Buffer.from(JSON.stringify(config, null, 2), "utf-8") },
      ...photoFiles,
    ];

    const { url } = await deploySite(slugify(config.content.businessName), files);
    return NextResponse.json({ url });
  } catch (err) {
    if (err instanceof DeployError) {
      console.error("[deploy] DeployError:", err.kind, err.cause ?? err.message);
      return NextResponse.json({ error: err.userMessage }, { status: err.httpStatus });
    }
    if (err instanceof PlacesError) {
      console.error("[deploy] PlacesError:", err.kind, err.cause ?? err.message);
      return NextResponse.json({ error: err.userMessage }, { status: err.httpStatus });
    }
    console.error("[deploy] Unexpected error:", err);
    return NextResponse.json(
      { error: "Something went wrong deploying your site. Please try again." },
      { status: 500 },
    );
  }
}
