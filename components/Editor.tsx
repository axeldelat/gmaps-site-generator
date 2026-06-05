"use client";

import type {
  SiteConfig,
  SiteContent,
  SiteTheme,
  WhatsAppConfig,
} from "@/lib/types";

interface EditorProps {
  config: SiteConfig;
  onChange: (next: SiteConfig) => void;
}

/**
 * Non-technical editor for site text, theme colors, and the WhatsApp button.
 * Every change produces a new SiteConfig via onChange; the parent holds the
 * canonical state (client state only for v1) and re-renders the live preview.
 */
export function Editor({ config, onChange }: EditorProps) {
  function setContent(patch: Partial<SiteContent>) {
    onChange({ ...config, content: { ...config.content, ...patch } });
  }
  function setTheme(patch: Partial<SiteTheme>) {
    onChange({ ...config, theme: { ...config.theme, ...patch } });
  }
  function setWhatsApp(patch: Partial<WhatsAppConfig>) {
    onChange({ ...config, whatsapp: { ...config.whatsapp, ...patch } });
  }
  function setSpecialty(index: number, patch: Partial<SiteContent["specialties"][number]>) {
    const specialties = config.content.specialties.map((s, i) =>
      i === index ? { ...s, ...patch } : s,
    );
    setContent({ specialties });
  }
  function setWhyUs(index: number, value: string) {
    const whyUs = config.content.whyUs.map((w, i) => (i === index ? value : w));
    setContent({ whyUs });
  }

  return (
    <div className="editor">
      <h2 className="editor-title">Personaliza tu sitio</h2>

      <fieldset className="editor-group">
        <legend>Textos</legend>

        <label className="editor-field">
          <span>Nombre del negocio</span>
          <input
            type="text"
            value={config.content.businessName}
            onChange={(e) => setContent({ businessName: e.target.value })}
          />
        </label>

        <label className="editor-field">
          <span>Título principal</span>
          <input
            type="text"
            value={config.content.heroHeadline}
            onChange={(e) => setContent({ heroHeadline: e.target.value })}
          />
        </label>

        <label className="editor-field">
          <span>Subtítulo</span>
          <input
            type="text"
            value={config.content.heroSubhead}
            onChange={(e) => setContent({ heroSubhead: e.target.value })}
          />
        </label>

        <label className="editor-field">
          <span>Título de “Sobre nosotros”</span>
          <input
            type="text"
            value={config.content.aboutTitle}
            onChange={(e) => setContent({ aboutTitle: e.target.value })}
          />
        </label>

        <label className="editor-field">
          <span>Texto de “Sobre nosotros”</span>
          <textarea
            rows={4}
            value={config.content.aboutBody}
            onChange={(e) => setContent({ aboutBody: e.target.value })}
          />
        </label>

        <label className="editor-field">
          <span>Título del cierre (CTA)</span>
          <input
            type="text"
            value={config.content.ctaTitle}
            onChange={(e) => setContent({ ctaTitle: e.target.value })}
          />
        </label>

        <label className="editor-field">
          <span>Texto del cierre (CTA)</span>
          <textarea
            rows={2}
            value={config.content.ctaText}
            onChange={(e) => setContent({ ctaText: e.target.value })}
          />
        </label>
      </fieldset>

      {config.content.specialties.length > 0 && (
        <fieldset className="editor-group">
          <legend>Especialidades</legend>
          {config.content.specialties.map((s, i) => (
            <div className="editor-subgroup" key={i}>
              <label className="editor-field">
                <span>Título {i + 1}</span>
                <input
                  type="text"
                  value={s.title}
                  onChange={(e) => setSpecialty(i, { title: e.target.value })}
                />
              </label>
              <label className="editor-field">
                <span>Descripción {i + 1}</span>
                <textarea
                  rows={2}
                  value={s.description}
                  onChange={(e) => setSpecialty(i, { description: e.target.value })}
                />
              </label>
            </div>
          ))}
        </fieldset>
      )}

      {config.content.whyUs.length > 0 && (
        <fieldset className="editor-group">
          <legend>Por qué elegirnos</legend>
          {config.content.whyUs.map((w, i) => (
            <label className="editor-field" key={i}>
              <span>Razón {i + 1}</span>
              <input
                type="text"
                value={w}
                onChange={(e) => setWhyUs(i, e.target.value)}
              />
            </label>
          ))}
        </fieldset>
      )}

      <fieldset className="editor-group">
        <legend>WhatsApp</legend>

        <label className="editor-field editor-color">
          <span>Mostrar botón de WhatsApp</span>
          <input
            type="checkbox"
            checked={config.whatsapp.enabled}
            onChange={(e) => setWhatsApp({ enabled: e.target.checked })}
          />
        </label>

        <label className="editor-field">
          <span>Código de país</span>
          <input
            type="text"
            inputMode="numeric"
            placeholder="52"
            value={config.whatsapp.countryCode}
            onChange={(e) =>
              setWhatsApp({ countryCode: e.target.value.replace(/\D/g, "") })
            }
          />
        </label>

        <label className="editor-field">
          <span>Número (sin código de país)</span>
          <input
            type="text"
            inputMode="numeric"
            placeholder="9841697524"
            value={config.whatsapp.number}
            onChange={(e) =>
              setWhatsApp({ number: e.target.value.replace(/\D/g, "") })
            }
          />
        </label>

        <label className="editor-field">
          <span>Mensaje predefinido</span>
          <textarea
            rows={2}
            value={config.whatsapp.message}
            onChange={(e) => setWhatsApp({ message: e.target.value })}
          />
        </label>
      </fieldset>

      <fieldset className="editor-group">
        <legend>Colores</legend>

        <label className="editor-field editor-color">
          <span>Color principal</span>
          <input
            type="color"
            value={config.theme.primaryColor}
            onChange={(e) => setTheme({ primaryColor: e.target.value })}
          />
        </label>

        <label className="editor-field editor-color">
          <span>Color de acento</span>
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
