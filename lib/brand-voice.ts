import type { BrandVoice, Tone, Vibe, CustomerFocus } from "@/lib/types";

// The brand-voice intake, as data. Each question maps to one BrandVoice field
// and offers a fixed set of tappable options (no free text). Labels are in
// LATAM Spanish; option `value`s are the closed slugs stored on the config and
// consumed by downstream copy generation.

export interface BrandVoiceOption<V extends string> {
  value: V;
  label: string;
  /** Emoji shown on the option card. */
  icon: string;
}

const TONE_OPTIONS: BrandVoiceOption<Tone>[] = [
  { value: "amigable", label: "Amigable y cercano", icon: "😊" },
  { value: "formal", label: "Formal y profesional", icon: "🤵" },
  { value: "divertido", label: "Divertido y casual", icon: "🎉" },
  { value: "elegante", label: "Elegante y premium", icon: "✨" },
];

const VIBE_OPTIONS: BrandVoiceOption<Vibe>[] = [
  { value: "caracter", label: "Con carácter", icon: "💪" },
  { value: "calido", label: "Cálido", icon: "🌸" },
  { value: "energico", label: "Enérgico", icon: "⚡" },
  { value: "clasico", label: "Clásico", icon: "🏛️" },
];

const FOCUS_OPTIONS: BrandVoiceOption<CustomerFocus>[] = [
  { value: "rapido", label: "Atiendo rápido", icon: "🏃" },
  { value: "trato-calido", label: "Trato cálido y personal", icon: "❤️" },
  { value: "calidad", label: "Calidad de ingredientes", icon: "🥩" },
  { value: "ambiente", label: "Ambiente y experiencia", icon: "🌟" },
];

export interface BrandVoiceQuestion {
  key: keyof BrandVoice;
  title: string;
  options: BrandVoiceOption<string>[];
}

export const BRAND_VOICE_QUESTIONS: readonly BrandVoiceQuestion[] = [
  {
    key: "tone",
    title: "¿Cómo quieres que se sienta tu página?",
    options: TONE_OPTIONS,
  },
  {
    key: "vibe",
    title: "¿Qué vibra tiene tu negocio?",
    options: VIBE_OPTIONS,
  },
  {
    key: "customerFocus",
    title: "¿Qué es lo más importante con tus clientes?",
    options: FOCUS_OPTIONS,
  },
];
