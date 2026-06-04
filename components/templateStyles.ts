/**
 * CSS for the generated site template. Defined as a string so it can be used
 * by BOTH the in-app preview (injected via <style>) and the deployed static
 * HTML (inlined), guaranteeing the preview is faithful to the deployed result.
 *
 * All rules are scoped under `.site-template`. Theme colors come from the
 * `--primary` / `--accent` CSS custom properties set on the root element.
 */
export const TEMPLATE_CSS = `
.site-template {
  --text: #1a1a1a;
  --muted: #5f6b7a;
  --bg: #ffffff;
  --surface: #f7f8fa;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: var(--text);
  background: var(--bg);
  line-height: 1.55;
}
.site-template * { box-sizing: border-box; }
.site-template img { max-width: 100%; display: block; }

.site-template .st-hero {
  position: relative;
  padding: 5rem 1.5rem;
  text-align: center;
  color: #fff;
  background: linear-gradient(135deg, var(--primary), var(--accent));
}
.site-template .st-hero h1 { margin: 0 0 0.75rem; font-size: clamp(2rem, 5vw, 3.25rem); }
.site-template .st-hero p { margin: 0 auto; max-width: 38rem; font-size: 1.15rem; opacity: 0.95; }
.site-template .st-rating { margin-top: 1rem; font-weight: 600; }

.site-template .st-section { max-width: 64rem; margin: 0 auto; padding: 3rem 1.5rem; }
.site-template .st-section h2 {
  font-size: 1.6rem;
  margin: 0 0 1.25rem;
  color: var(--primary);
}

.site-template .st-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 0.75rem;
}
.site-template .st-gallery img { width: 100%; height: 180px; object-fit: cover; border-radius: 10px; }

.site-template .st-info { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
.site-template .st-info .st-card {
  background: var(--surface);
  border-radius: 12px;
  padding: 1.5rem;
}
.site-template .st-info h3 { margin: 0 0 0.75rem; font-size: 1.1rem; }
.site-template .st-hours-list, .site-template .st-contact-list { margin: 0; padding: 0; list-style: none; }
.site-template .st-hours-list li, .site-template .st-contact-list li { padding: 0.2rem 0; color: var(--muted); }
.site-template .st-contact-list a { color: var(--primary); text-decoration: none; }

.site-template .st-reviews { display: grid; gap: 1rem; }
.site-template .st-review {
  border-left: 4px solid var(--accent);
  background: var(--surface);
  border-radius: 0 12px 12px 0;
  padding: 1rem 1.25rem;
}
.site-template .st-review .st-review-head { display: flex; justify-content: space-between; align-items: baseline; gap: 1rem; }
.site-template .st-review .st-author { font-weight: 600; }
.site-template .st-review .st-stars { color: var(--accent); white-space: nowrap; }
.site-template .st-review .st-review-text { margin: 0.5rem 0 0; color: var(--muted); }
.site-template .st-review .st-review-time { font-size: 0.85rem; color: var(--muted); }

.site-template .st-footer {
  text-align: center;
  padding: 2rem 1.5rem;
  color: var(--muted);
  font-size: 0.85rem;
  border-top: 1px solid #e6e8ec;
}

@media (max-width: 640px) {
  .site-template .st-hero { padding: 3.5rem 1.25rem; }
  .site-template .st-info { grid-template-columns: 1fr; gap: 1rem; }
  .site-template .st-gallery img { height: 150px; }
}
`;
