/**
 * CSS for the generated site template. Defined as a string so it can be used
 * by BOTH the in-app preview (injected via <style>) and the deployed static
 * HTML (inlined), guaranteeing the preview is faithful to the deployed result.
 *
 * All rules are scoped under `.site-template`. The user's theme colors arrive
 * as `--primary` / `--accent`; every other color is DERIVED from them with
 * color-mix() so the palette stays cohesive. Raw theme colors are never used
 * as text on white (contrast is not guaranteed); headings use --ink, links use
 * a darkened --primary-ink, and the hero always carries a dark scrim so white
 * text is legible over any color or photo.
 */
export const TEMPLATE_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500..800&family=Hanken+Grotesk:wght@400;500;600;700&display=swap');

.site-template {
  /* Type scale (fluid, modular) */
  --font-display: "Bricolage Grotesque", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-body: "Hanken Grotesk", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --fs-display: clamp(2.5rem, 6.5vw, 4.5rem);
  --fs-h2: clamp(1.6rem, 3.2vw, 2.25rem);
  --fs-h3: 1.15rem;
  --fs-lead: clamp(1.075rem, 1.7vw, 1.3rem);
  --fs-body: 1.0625rem;
  --fs-small: 0.875rem;

  /* Spacing + shape */
  --sp-section: clamp(3.5rem, 7vw, 6rem);
  --r-sm: 8px;
  --r-md: 14px;
  --r-lg: 20px;
  --shadow: 0 1px 2px rgba(16, 18, 24, 0.06), 0 10px 34px rgba(16, 18, 24, 0.09);

  /* Neutrals (static fallback first, then tinted toward the brand hue) */
  --ink: #16181d;
  --bg: #ffffff;
  --muted: #5b606b;
  --muted: color-mix(in srgb, var(--ink) 64%, var(--bg));
  --surface: #f6f7f9;
  --surface: color-mix(in srgb, var(--primary) 5%, #ffffff);
  --border: #e7e9ee;
  --border: color-mix(in srgb, var(--primary) 16%, #ffffff);

  /* Brand colors, darkened for safe use as text/accents on light bg */
  --primary-ink: var(--primary);
  --primary-ink: color-mix(in srgb, var(--primary) 72%, #000000);
  --primary-deep: color-mix(in srgb, var(--primary) 65%, #000000);
  --accent-ink: var(--accent);
  --accent-ink: color-mix(in srgb, var(--accent) 70%, #000000);

  font-family: var(--font-body);
  font-size: var(--fs-body);
  color: var(--ink);
  background: var(--bg);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
.site-template * { box-sizing: border-box; }
.site-template img { max-width: 100%; display: block; }

/* ---------- Hero (image-led, dark scrim guarantees legibility) ---------- */
.site-template .st-hero {
  position: relative;
  isolation: isolate;
  display: flex;
  align-items: flex-end;
  min-height: clamp(420px, 70vh, 680px);
  padding: clamp(2.5rem, 6vw, 5rem);
  background-color: var(--primary-deep);
  background-size: cover;
  background-position: center;
  color: #fff;
  overflow: hidden;
}
.site-template .st-hero::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    linear-gradient(0deg, rgba(10, 12, 16, 0.82) 0%, rgba(10, 12, 16, 0.30) 55%, rgba(10, 12, 16, 0.45) 100%),
    linear-gradient(120deg, color-mix(in srgb, var(--primary) 55%, transparent), transparent 60%);
}
.site-template .st-hero-content { max-width: 52rem; }
.site-template .st-hero h1 {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: var(--fs-display);
  line-height: 1.02;
  letter-spacing: -0.03em;
  text-wrap: balance;
  margin: 0 0 1rem;
}
.site-template .st-hero .st-lead {
  font-size: var(--fs-lead);
  line-height: 1.5;
  max-width: 40rem;
  margin: 0;
  color: rgba(255, 255, 255, 0.92);
  text-wrap: pretty;
}
.site-template .st-rating {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
  padding: 0.4rem 0.85rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.22);
  font-size: var(--fs-small);
  font-weight: 600;
}
.site-template .st-rating .st-stars { color: #ffd96b; letter-spacing: 0.05em; }

/* ---------- Sections ---------- */
.site-template .st-section { max-width: 66rem; margin: 0 auto; padding: var(--sp-section) clamp(1.25rem, 4vw, 2rem); }
.site-template .st-section h2 {
  font-family: var(--font-display);
  font-weight: 650;
  font-size: var(--fs-h2);
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin: 0 0 1.75rem;
  color: var(--ink);
  text-wrap: balance;
}
.site-template .st-section h2::after {
  content: "";
  display: block;
  width: 2.5rem;
  height: 3px;
  margin-top: 0.6rem;
  border-radius: 2px;
  background: var(--accent);
}

/* ---------- Galería ---------- */
.site-template .st-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 0.85rem;
}
.site-template .st-gallery-item {
  overflow: hidden;
  border-radius: var(--r-md);
  aspect-ratio: 4 / 3;
}
.site-template .st-gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

/* ---------- Visítanos (single panel, two columns — no nested cards) ---------- */
.site-template .st-visit {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(1.5rem, 4vw, 3rem);
  padding: clamp(1.5rem, 4vw, 2.5rem);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
}
.site-template .st-visit h3 {
  font-size: var(--fs-h3);
  font-weight: 700;
  margin: 0 0 0.85rem;
  color: var(--ink);
}
.site-template .st-hours-list, .site-template .st-contact-list { margin: 0; padding: 0; list-style: none; }
.site-template .st-hours-list li { display: flex; justify-content: space-between; gap: 1rem; padding: 0.3rem 0; color: var(--muted); border-bottom: 1px solid color-mix(in srgb, var(--border) 60%, transparent); }
.site-template .st-hours-list li:last-child { border-bottom: 0; }
.site-template .st-contact-list li { padding: 0.35rem 0; color: var(--muted); }
.site-template .st-contact-list a {
  color: var(--primary-ink);
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 3px;
  text-decoration-thickness: 1px;
  text-decoration-color: color-mix(in srgb, var(--primary) 45%, transparent);
}

/* ---------- Reviews (full-border cards, accent quote — no side stripe) ---------- */
.site-template .st-reviews { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; }
.site-template .st-review {
  position: relative;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  padding: 1.5rem 1.5rem 1.35rem;
  box-shadow: var(--shadow);
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s;
}
.site-template .st-review::before {
  content: "\\201C";
  position: absolute;
  top: 0.35rem;
  right: 1rem;
  font-family: var(--font-display);
  font-size: 3.5rem;
  line-height: 1;
  color: color-mix(in srgb, var(--accent) 30%, transparent);
}
.site-template .st-review-head { display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; margin-bottom: 0.5rem; }
.site-template .st-review .st-author { font-weight: 700; color: var(--ink); }
.site-template .st-review .st-stars { color: var(--accent-ink); letter-spacing: 0.05em; white-space: nowrap; }
.site-template .st-review .st-review-text { margin: 0; color: var(--muted); line-height: 1.55; }
.site-template .st-review .st-review-time { display: block; margin-top: 0.75rem; font-size: var(--fs-small); color: color-mix(in srgb, var(--muted) 80%, var(--bg)); }

/* ---------- Footer ---------- */
.site-template .st-footer {
  text-align: center;
  padding: 3rem 1.5rem;
  color: var(--muted);
  font-size: var(--fs-small);
  border-top: 1px solid var(--border);
}
.site-template .st-footer .st-footer-name { font-family: var(--font-display); font-weight: 700; font-size: 1.1rem; color: var(--ink); margin: 0 0 0.4rem; }
.site-template .st-footer a { color: var(--primary-ink); }

/* ---------- Hero meta + CTAs ---------- */
.site-template .st-hero-meta { display: flex; flex-wrap: wrap; align-items: center; gap: 0.6rem; margin-top: 1.5rem; }
.site-template .st-hero-meta .st-rating { margin-top: 0; }
.site-template .st-open {
  display: inline-flex; align-items: center; gap: 0.35rem;
  padding: 0.4rem 0.85rem; border-radius: 999px;
  background: rgba(255, 255, 255, 0.14); backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.22);
  font-size: var(--fs-small); font-weight: 600;
}
.site-template .st-cta-row { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 1.75rem; }
.site-template .st-btn {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 0.7rem 1.4rem; border-radius: 999px;
  font-weight: 700; font-size: var(--fs-body); text-decoration: none; cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.2s ease, background 0.2s ease;
}
.site-template .st-btn-primary { background: var(--accent); color: #1a1206; box-shadow: var(--shadow); }
.site-template .st-btn-ghost { background: rgba(255, 255, 255, 0.12); color: #fff; border: 1px solid rgba(255, 255, 255, 0.45); }
.site-template .st-btn:hover { transform: translateY(-2px); }

/* ---------- Trust badges ---------- */
.site-template .st-badges-wrap { background: var(--surface); border-bottom: 1px solid var(--border); }
.site-template .st-badges {
  max-width: 66rem; margin: 0 auto; padding: 1rem clamp(1.25rem, 4vw, 2rem);
  display: flex; flex-wrap: wrap; gap: 0.6rem; list-style: none;
}
.site-template .st-badge {
  display: inline-flex; align-items: center; gap: 0.4rem;
  padding: 0.45rem 0.9rem; border-radius: 999px;
  background: #fff; border: 1px solid var(--border);
  font-size: var(--fs-small); font-weight: 600; color: var(--ink);
}

/* ---------- About ---------- */
.site-template .st-about-body {
  font-size: var(--fs-lead); color: var(--muted); line-height: 1.6;
  max-width: 48rem; margin: 0; text-wrap: pretty;
}

/* ---------- Specialties (cards) ---------- */
.site-template .st-specialties {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem;
}
.site-template .st-specialty {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--r-lg); padding: 1.4rem 1.5rem;
}
.site-template .st-specialty h3 {
  font-family: var(--font-display); font-weight: 700; font-size: var(--fs-h3);
  margin: 0 0 0.4rem; color: var(--ink);
}
.site-template .st-specialty p { margin: 0; color: var(--muted); line-height: 1.55; }

/* ---------- Why us (list) ---------- */
.site-template .st-whyus { margin: 0; padding: 0; list-style: none; display: grid; gap: 0.85rem; max-width: 48rem; }
.site-template .st-whyus li {
  position: relative; padding-left: 1.9rem; color: var(--ink); font-size: var(--fs-lead); line-height: 1.5;
}
.site-template .st-whyus li::before {
  content: "✓"; position: absolute; left: 0; top: 0;
  font-weight: 800; color: var(--accent-ink);
}

/* ---------- Visit blocks + embedded map ---------- */
.site-template .st-visit-block + .st-visit-block { margin-top: 1.75rem; }
.site-template .st-map { display: flex; flex-direction: column; gap: 0.6rem; }
.site-template .st-map iframe {
  width: 100%; min-height: 260px; flex: 1; border: 0; border-radius: var(--r-md);
}
.site-template .st-map-link {
  align-self: flex-start; color: var(--primary-ink); font-weight: 600;
  text-decoration: underline; text-underline-offset: 3px;
}

/* ---------- Final CTA (brand-colored band) ---------- */
.site-template .st-cta-section {
  background: var(--primary-deep); color: #fff;
  padding: var(--sp-section) clamp(1.25rem, 4vw, 2rem);
}
.site-template .st-cta-inner { max-width: 46rem; margin: 0 auto; text-align: center; }
.site-template .st-cta-inner h2 {
  font-family: var(--font-display); font-weight: 700; font-size: var(--fs-h2);
  letter-spacing: -0.02em; margin: 0 0 0.75rem;
}
.site-template .st-cta-inner p { font-size: var(--fs-lead); color: rgba(255, 255, 255, 0.9); margin: 0 auto 1.75rem; max-width: 34rem; }
.site-template .st-cta-inner .st-cta-row { justify-content: center; margin-top: 0; }

/* ---------- Floating WhatsApp button ---------- */
.site-template .st-wa {
  position: fixed; right: clamp(1rem, 3vw, 1.75rem); bottom: clamp(1rem, 3vw, 1.75rem);
  z-index: 50; display: inline-flex; align-items: center; justify-content: center;
  width: 56px; height: 56px; border-radius: 50%;
  background: #25d366; color: #fff;
  box-shadow: 0 6px 20px rgba(37, 211, 102, 0.45);
  transition: transform 0.15s ease, box-shadow 0.2s ease;
}
.site-template .st-wa:hover { transform: scale(1.06); box-shadow: 0 8px 26px rgba(37, 211, 102, 0.55); }

/* ---------- Motion (page-load only; content visible by default) ---------- */
@media (prefers-reduced-motion: no-preference) {
  .site-template .st-hero-content > * { animation: st-rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) both; }
  .site-template .st-hero-content > *:nth-child(2) { animation-delay: 0.08s; }
  .site-template .st-hero-content > *:nth-child(3) { animation-delay: 0.16s; }
  .site-template .st-gallery-item:hover img { transform: scale(1.05); }
  .site-template .st-review:hover { transform: translateY(-3px); box-shadow: 0 4px 10px rgba(16,18,24,0.08), 0 18px 50px rgba(16,18,24,0.12); }
}
@keyframes st-rise {
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: none; }
}

/* ---------- Responsive ---------- */
@media (max-width: 640px) {
  .site-template .st-hero { min-height: 60vh; align-items: flex-end; }
  .site-template .st-visit { grid-template-columns: 1fr; }
}
`;
