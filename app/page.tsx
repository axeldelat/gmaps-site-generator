"use client";

import { useState } from "react";
import type { Business, SiteConfig } from "@/lib/types";
import { buildDefaultSiteConfig } from "@/lib/site-config";
import { UrlImportForm } from "@/components/UrlImportForm";
import { Editor } from "@/components/Editor";
import { Preview } from "@/components/Preview";
import { DeployPanel } from "@/components/DeployPanel";

export default function HomePage() {
  // The SiteConfig is the single source of truth for the editor + preview +
  // deploy. It lives in client state only (v1); server-side persistence is a
  // planned v2 feature.
  const [config, setConfig] = useState<SiteConfig | null>(null);

  function handleImported(business: Business) {
    setConfig(buildDefaultSiteConfig(business));
  }

  function startOver() {
    setConfig(null);
  }

  if (!config) {
    return (
      <main className="landing">
        <div className="landing-inner">
          <h1 className="landing-title">Your business website, in minutes</h1>
          <p className="landing-sub">
            Paste your Google Maps link and we&apos;ll build a site from your
            existing business info — then publish it with one click.
          </p>
          <UrlImportForm onImported={handleImported} />
        </div>
      </main>
    );
  }

  return (
    <main className="studio">
      <header className="studio-bar">
        <button className="studio-back" onClick={startOver}>
          ← Start over
        </button>
        <DeployPanel config={config} />
      </header>
      <div className="studio-body">
        <aside className="studio-editor">
          <Editor config={config} onChange={setConfig} />
        </aside>
        <section className="studio-preview">
          <Preview config={config} />
        </section>
      </div>
    </main>
  );
}
