"use client";

import { useState } from "react";
import type { BrandVoice } from "@/lib/types";
import { BRAND_VOICE_QUESTIONS } from "@/lib/brand-voice";

interface BrandVoiceIntakeProps {
  /** Smart-default brand voice, pre-selected so the owner can one-tap confirm. */
  suggested: BrandVoice;
  businessName: string;
  onConfirm: (voice: BrandVoice) => void;
}

/**
 * Three multiple-choice questions (tono, vibra, sello con el cliente) with large
 * tappable cards. The suggested answer is pre-selected on each, so a busy owner
 * can confirm with a single tap. No free-text inputs.
 */
export function BrandVoiceIntake({
  suggested,
  businessName,
  onConfirm,
}: BrandVoiceIntakeProps) {
  const [voice, setVoice] = useState<BrandVoice>(suggested);

  return (
    <main className="intake">
      <div className="intake-inner">
        <header className="intake-head">
          <h1 className="intake-title">Démosle personalidad a {businessName}</h1>
          <p className="intake-sub">
            Tres toques y escribimos tu página con tu estilo. Ya elegimos una
            sugerencia por ti — solo confirma o cámbiala.
          </p>
        </header>

        {BRAND_VOICE_QUESTIONS.map((question) => {
          const selected = voice[question.key];
          return (
            <fieldset key={question.key} className="intake-group">
              <legend className="intake-question">{question.title}</legend>
              <div className="intake-options">
                {question.options.map((option) => {
                  const isSelected = option.value === selected;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      className={
                        "intake-option" + (isSelected ? " is-selected" : "")
                      }
                      aria-pressed={isSelected}
                      onClick={() =>
                        setVoice((prev) => ({
                          ...prev,
                          [question.key]: option.value,
                        }))
                      }
                    >
                      <span className="intake-option-icon" aria-hidden="true">
                        {option.icon}
                      </span>
                      <span className="intake-option-label">{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>
          );
        })}

        <button
          type="button"
          className="intake-cta"
          onClick={() => onConfirm(voice)}
        >
          Generar mi página
        </button>
      </div>
    </main>
  );
}
