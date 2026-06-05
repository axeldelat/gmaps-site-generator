// Use the streaming server API (the legacy synchronous renderToStaticMarkup is
// blocked at runtime inside Next's server). Only imported by a Node route handler.
import { renderToReadableStream } from "react-dom/server.edge";
import type { SiteConfig } from "@/lib/types";
import { SiteTemplate } from "@/components/SiteTemplate";
import { TEMPLATE_CSS } from "@/components/templateStyles";
import {
  buildRestaurantJsonLd,
  humanizeCategory,
  localityFromAddress,
} from "@/lib/seo";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** SEO `<title>`: "Nombre | Categoría en Ciudad", trimmed to what we know. */
function buildTitle(config: SiteConfig): string {
  const name = config.content.businessName || config.business.name;
  const category = humanizeCategory(config.business.categories);
  const locality = localityFromAddress(config.business.address);
  const tail = [category, locality].filter(Boolean).join(" en ");
  return tail ? `${name} | ${tail}` : name;
}

/** Meta description: AI meta, then subhead, then about, then editorial summary. */
function buildDescription(config: SiteConfig): string {
  const c = config.content;
  return (
    c.metaDescription ||
    c.heroSubhead ||
    c.aboutBody ||
    config.business.editorialSummary ||
    `${c.businessName} — ${config.business.address ?? ""}`
  ).slice(0, 300);
}

/** Escape `<` so the JSON-LD can't break out of the <script> element. */
function jsonLdScript(config: SiteConfig): string {
  const json = JSON.stringify(buildRestaurantJsonLd(config)).replace(/</g, "\\u003c");
  return `<script type="application/ld+json">${json}</script>`;
}

/**
 * Render the deployable static HTML document for a site. Uses the SAME
 * SiteTemplate component as the in-app preview (one rendering path), but
 * resolves photos to the local bundled paths shipped alongside the HTML.
 */
export async function renderSiteHtml(
  config: SiteConfig,
  photoPaths: string[],
): Promise<string> {
  const stream = await renderToReadableStream(
    <SiteTemplate
      config={config}
      resolvePhoto={(_photo, i) => photoPaths[i] ?? ""}
    />,
  );
  await stream.allReady;
  const markup = await new Response(stream).text();

  const title = escapeHtml(buildTitle(config));
  const description = escapeHtml(buildDescription(config));

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title}</title>
<meta name="description" content="${description}" />
${jsonLdScript(config)}
<style>
*{margin:0}body{margin:0}
${TEMPLATE_CSS}
</style>
</head>
<body>
${markup}
</body>
</html>
`;
}
