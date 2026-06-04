// Use the streaming server API (the legacy synchronous renderToStaticMarkup is
// blocked at runtime inside Next's server). Only imported by a Node route handler.
import { renderToReadableStream } from "react-dom/server.edge";
import type { SiteConfig } from "@/lib/types";
import { SiteTemplate } from "@/components/SiteTemplate";
import { TEMPLATE_CSS } from "@/components/templateStyles";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
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

  const title = escapeHtml(config.content.businessName);
  const description = escapeHtml(config.content.description);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title}</title>
<meta name="description" content="${description}" />
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
