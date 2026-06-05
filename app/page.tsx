"use client";

import { useState } from "react";
import type { Business, BrandVoice, SiteConfig } from "@/lib/types";
import { buildDefaultSiteConfig } from "@/lib/site-config";
import { UrlImportForm } from "@/components/UrlImportForm";
import { BrandVoiceIntake } from "@/components/BrandVoiceIntake";
import { Editor } from "@/components/Editor";
import { Preview } from "@/components/Preview";
import { DeployPanel } from "@/components/DeployPanel";

export default function HomePage() {
  // The SiteConfig is the single source of truth for the editor + preview +
  // deploy. It lives in client state only (v1); server-side persistence is a
  // planned v2 feature.
  const [config, setConfig] = useState<SiteConfig | null>(null);
  // The brand-voice intake gates the studio: after import we show the intake
  // (pre-filled with a smart default) and only enter the studio once confirmed.
  const [intakeConfirmed, setIntakeConfirmed] = useState(false);
  // While AI copy is being generated (after intake), show a loading screen.
  const [generating, setGenerating] = useState(false);

  function handleImported(business: Business) {
    setConfig(buildDefaultSiteConfig(business));
    setIntakeConfirmed(false);
  }

  async function handleBrandVoiceConfirmed(brandVoice: BrandVoice) {
    if (!config) return;
    const base: SiteConfig = { ...config, brandVoice };
    setConfig(base);
    setGenerating(true);
    try {
      const res = await fetch("/api/generate-copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config: base }),
      });
      if (res.ok) {
        const { content } = (await res.json()) as { content?: Partial<SiteConfig["content"]> };
        // AI owns copy only; merge over the existing (defaults stay as fallback).
        if (content) setConfig({ ...base, content: { ...base.content, ...content } });
      }
      // Non-OK responses intentionally fall through: keep the non-AI defaults.
    } catch {
      // Network/other failure: proceed with defaults, never block the owner.
    } finally {
      setGenerating(false);
      setIntakeConfirmed(true);
    }
  }

  function startOver() {
    setConfig(null);
    setIntakeConfirmed(false);
    setGenerating(false);
  }

  if (!config) {
    return (
      <main className="landing">
        <div className="landing-inner">
          <h1 className="landing-title">El sitio web de tu negocio, en minutos</h1>
          <p className="landing-sub">
            Pega tu enlace de Google Maps y crearemos tu sitio con la
            información de tu negocio — y lo publicas con un solo clic.
          </p>
          <UrlImportForm onImported={handleImported} />
        </div>
      </main>
    );
  }

  if (generating) {
    return (
      <main className="intake">
        <div className="intake-inner intake-loading">
          <div className="intake-spinner" aria-hidden="true" />
          <h1 className="intake-title">Generando tu página…</h1>
          <p className="intake-sub">
            Estamos escribiendo el contenido de {config.business.name} con tu
            estilo. Tarda unos segundos.
          </p>
        </div>
      </main>
    );
  }

  if (!intakeConfirmed) {
    return (
      <BrandVoiceIntake
        suggested={config.brandVoice}
        businessName={config.business.name}
        onConfirm={handleBrandVoiceConfirmed}
      />
    );
  }

  return (
    <main className="studio">
      <header className="studio-bar">
        <button className="studio-back" onClick={startOver}>
          ← Empezar de nuevo
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
