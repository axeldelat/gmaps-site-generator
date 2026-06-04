"use client";

import type { SiteConfig } from "@/lib/types";
import { SiteTemplate } from "@/components/SiteTemplate";
import { TEMPLATE_CSS } from "@/components/templateStyles";

interface PreviewProps {
  config: SiteConfig;
}

/**
 * Live in-app preview. Renders the exact same SiteTemplate that gets deployed,
 * resolving photos through the /api/photo proxy. Updates automatically whenever
 * the parent passes a new config (text or color edits).
 */
export function Preview({ config }: PreviewProps) {
  return (
    <div className="preview-frame">
      <style>{TEMPLATE_CSS}</style>
      <SiteTemplate config={config} resolvePhoto={(photo) => photo.previewUrl} />
    </div>
  );
}
