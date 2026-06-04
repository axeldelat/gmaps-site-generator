"use client";

import type { SiteConfig, SiteContent, SiteTheme } from "@/lib/types";

interface EditorProps {
  config: SiteConfig;
  onChange: (next: SiteConfig) => void;
}

/**
 * Non-technical editor for site text and theme colors. Every change produces a
 * new SiteConfig via onChange; the parent holds the canonical state (client
 * state only for v1) and re-renders the live preview from it.
 */
export function Editor({ config, onChange }: EditorProps) {
  function setContent(patch: Partial<SiteContent>) {
    onChange({ ...config, content: { ...config.content, ...patch } });
  }
  function setTheme(patch: Partial<SiteTheme>) {
    onChange({ ...config, theme: { ...config.theme, ...patch } });
  }

  return (
    <div className="editor">
      <h2 className="editor-title">Customize your site</h2>

      <fieldset className="editor-group">
        <legend>Text</legend>

        <label className="editor-field">
          <span>Business name</span>
          <input
            type="text"
            value={config.content.businessName}
            onChange={(e) => setContent({ businessName: e.target.value })}
          />
        </label>

        <label className="editor-field">
          <span>Headline</span>
          <input
            type="text"
            value={config.content.headline}
            onChange={(e) => setContent({ headline: e.target.value })}
          />
        </label>

        <label className="editor-field">
          <span>Description</span>
          <textarea
            rows={3}
            value={config.content.description}
            onChange={(e) => setContent({ description: e.target.value })}
          />
        </label>
      </fieldset>

      <fieldset className="editor-group">
        <legend>Colors</legend>

        <label className="editor-field editor-color">
          <span>Primary color</span>
          <input
            type="color"
            value={config.theme.primaryColor}
            onChange={(e) => setTheme({ primaryColor: e.target.value })}
          />
        </label>

        <label className="editor-field editor-color">
          <span>Accent color</span>
          <input
            type="color"
            value={config.theme.accentColor}
            onChange={(e) => setTheme({ accentColor: e.target.value })}
          />
        </label>
      </fieldset>
    </div>
  );
}
