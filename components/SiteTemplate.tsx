import type { CSSProperties } from "react";
import type { BusinessPhoto, SiteConfig } from "@/lib/types";
import { topReviews } from "@/lib/site-config";
import { buildBadges, humanizeCategory, localityFromAddress } from "@/lib/seo";

interface SiteTemplateProps {
  config: SiteConfig;
  /**
   * Resolves a photo to a displayable URL. The preview passes a proxy URL;
   * the deploy bundler passes a local bundled path (e.g. photos/0.jpg).
   * The index MUST be the photo's original index in business.photos so it
   * maps to the correct bundled file.
   */
  resolvePhoto: (photo: BusinessPhoto, index: number) => string;
}

function stars(rating: number): string {
  const full = Math.round(rating);
  return "★★★★★☆☆☆☆☆".slice(5 - full, 10 - full);
}

/** Inline WhatsApp glyph (SVG so it ships in the static deploy without assets). */
function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true" fill="currentColor">
      <path d="M16.04 4C9.96 4 5 8.95 5 15.03c0 2.13.6 4.1 1.65 5.8L5 27l6.33-1.62a11 11 0 0 0 4.71 1.06h.01c6.07 0 11.03-4.95 11.03-11.03C27.09 8.95 22.12 4 16.04 4Zm6.46 15.55c-.27.76-1.58 1.47-2.18 1.52-.58.05-1.12.26-3.78-.79-3.18-1.25-5.2-4.5-5.36-4.71-.16-.21-1.28-1.7-1.28-3.25 0-1.54.81-2.3 1.1-2.61.27-.31.6-.39.8-.39.2 0 .4 0 .58.01.18.01.44-.07.69.53.27.63.91 2.18.99 2.34.08.16.13.34.03.55-.1.21-.16.34-.31.52-.16.18-.33.41-.47.55-.16.16-.32.33-.14.64.18.31.81 1.34 1.74 2.17 1.2 1.07 2.21 1.4 2.52 1.56.31.16.49.13.67-.08.18-.21.77-.9.98-1.21.21-.31.42-.26.71-.16.29.11 1.83.86 2.14 1.02.31.16.52.23.6.36.08.13.08.76-.19 1.52Z" />
    </svg>
  );
}

/**
 * The generated business site. Pure and presentational so it can render both
 * as the live in-app preview and (via renderHtml) as the deployed static HTML.
 * Sections render only when their data is present, so partial business data
 * never breaks the layout. All copy is in Spanish.
 */
export function SiteTemplate({ config, resolvePhoto }: SiteTemplateProps) {
  const { business, content, theme, whatsapp } = config;
  const reviews = topReviews(business);
  const badges = buildBadges(business);
  const category = humanizeCategory(business.categories);
  const locality = localityFromAddress(business.address);
  const altBase = [content.businessName, category].filter(Boolean).join(", ");

  const rootStyle = {
    ["--primary"]: theme.primaryColor,
    ["--accent"]: theme.accentColor,
  } as CSSProperties;

  const heroPhoto = business.photos[0];
  // Gallery shows photos after the hero one; keep original indices for resolvePhoto.
  const galleryPhotos = business.photos
    .map((photo, index) => ({ photo, index }))
    .slice(heroPhoto ? 1 : 0, 6);

  const heroStyle: CSSProperties = heroPhoto
    ? { backgroundImage: `url("${resolvePhoto(heroPhoto, 0)}")` }
    : {};

  const directionsUrl = business.location
    ? `https://www.google.com/maps/dir/?api=1&destination=${business.location.lat},${business.location.lng}`
    : undefined;

  const waHref =
    whatsapp.enabled && whatsapp.number
      ? `https://wa.me/${whatsapp.countryCode}${whatsapp.number}?text=${encodeURIComponent(whatsapp.message)}`
      : undefined;

  return (
    <div className="site-template" style={rootStyle}>
      <header className="st-hero" style={heroStyle}>
        <div className="st-hero-content">
          <h1>{content.heroHeadline}</h1>
          {content.heroSubhead && <p className="st-lead">{content.heroSubhead}</p>}

          <div className="st-hero-meta">
            {typeof business.rating === "number" && (
              <div className="st-rating">
                <span className="st-stars" aria-hidden="true">
                  {stars(business.rating)}
                </span>
                <span>
                  {business.rating.toFixed(1)}
                  {business.userRatingsTotal
                    ? ` · ${business.userRatingsTotal.toLocaleString("es-MX")} reseñas`
                    : ""}
                </span>
              </div>
            )}
            {business.openNow === true && (
              <span className="st-open">🟢 Abierto ahora</span>
            )}
          </div>

          {(business.phone || directionsUrl) && (
            <div className="st-cta-row">
              {business.phone && (
                <a
                  className="st-btn st-btn-primary"
                  href={`tel:${business.phone.replace(/\s+/g, "")}`}
                >
                  Llamar
                </a>
              )}
              {directionsUrl && (
                <a
                  className="st-btn st-btn-ghost"
                  href={directionsUrl}
                  rel="noopener noreferrer"
                >
                  Cómo llegar
                </a>
              )}
            </div>
          )}
        </div>
      </header>

      {badges.length > 0 && (
        <div className="st-badges-wrap">
          <ul className="st-badges">
            {badges.map((b) => (
              <li className="st-badge" key={b.label}>
                {b.icon && <span aria-hidden="true">{b.icon}</span>} {b.label}
              </li>
            ))}
          </ul>
        </div>
      )}

      {content.aboutBody && (
        <section className="st-section st-about">
          <h2>{content.aboutTitle}</h2>
          <p className="st-about-body">{content.aboutBody}</p>
        </section>
      )}

      {content.specialties.length > 0 && (
        <section className="st-section">
          <h2>Especialidades</h2>
          <div className="st-specialties">
            {content.specialties.map((s, i) => (
              <div className="st-specialty" key={`${s.title}-${i}`}>
                <h3>{s.title}</h3>
                <p>{s.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {content.whyUs.length > 0 && (
        <section className="st-section">
          <h2>Por qué elegirnos</h2>
          <ul className="st-whyus">
            {content.whyUs.map((w, i) => (
              <li key={`${w}-${i}`}>{w}</li>
            ))}
          </ul>
        </section>
      )}

      {galleryPhotos.length > 0 && (
        <section className="st-section">
          <h2>Galería</h2>
          <div className="st-gallery">
            {galleryPhotos.map(({ photo, index }) => (
              <div className="st-gallery-item" key={photo.ref}>
                {/* eslint-disable-next-line @next/next/no-img-element -- template renders to framework-agnostic static HTML; next/image would break the deployed output */}
                <img
                  src={resolvePhoto(photo, index)}
                  alt={`${altBase} — foto ${index + 1}`}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {reviews.length > 0 && (
        <section className="st-section">
          <h2>Lo que dicen</h2>
          <div className="st-reviews">
            {reviews.map((review, i) => (
              <blockquote className="st-review" key={`${review.author}-${i}`}>
                <div className="st-review-head">
                  <span className="st-author">{review.author}</span>
                  <span className="st-stars" aria-label={`${review.rating} de 5`}>
                    {stars(review.rating)}
                  </span>
                </div>
                {review.text && <p className="st-review-text">{review.text}</p>}
                {review.relativeTime && (
                  <span className="st-review-time">{review.relativeTime}</span>
                )}
              </blockquote>
            ))}
          </div>
        </section>
      )}

      {(business.hours || business.address || business.phone || business.website || business.location) && (
        <section className="st-section">
          <h2>Visítanos</h2>
          <div className="st-visit">
            <div>
              {business.hours && (
                <div className="st-visit-block">
                  <h3>Horarios</h3>
                  <ul className="st-hours-list">
                    {business.hours.weekdayText.map((line) => {
                      const [day, ...rest] = line.split(": ");
                      return (
                        <li key={line}>
                          <span>{day}</span>
                          <span>{rest.join(": ")}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
              {(business.address || business.phone || business.website) && (
                <div className="st-visit-block">
                  <h3>Contacto</h3>
                  <ul className="st-contact-list">
                    {business.address && <li>{business.address}</li>}
                    {business.phone && (
                      <li>
                        <a href={`tel:${business.phone.replace(/\s+/g, "")}`}>
                          {business.phone}
                        </a>
                      </li>
                    )}
                    {business.website && (
                      <li>
                        <a href={business.website} rel="noopener noreferrer">
                          {business.website.replace(/^https?:\/\//, "")}
                        </a>
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
            {business.location && (
              <div className="st-map">
                <iframe
                  title={`Ubicación de ${content.businessName}`}
                  src={`https://maps.google.com/maps?q=${business.location.lat},${business.location.lng}&z=16&output=embed`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                {directionsUrl && (
                  <a className="st-map-link" href={directionsUrl} rel="noopener noreferrer">
                    Cómo llegar →
                  </a>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {(content.ctaTitle || content.ctaText) && (
        <section className="st-cta-section">
          <div className="st-cta-inner">
            {content.ctaTitle && <h2>{content.ctaTitle}</h2>}
            {content.ctaText && <p>{content.ctaText}</p>}
            {(business.phone || waHref) && (
              <div className="st-cta-row">
                {business.phone && (
                  <a
                    className="st-btn st-btn-primary"
                    href={`tel:${business.phone.replace(/\s+/g, "")}`}
                  >
                    Llamar
                  </a>
                )}
                {waHref && (
                  <a
                    className="st-btn st-btn-ghost"
                    href={waHref}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    WhatsApp
                  </a>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      <footer className="st-footer">
        <p className="st-footer-name">{content.businessName}</p>
        {locality && <p>{category ? `${category} · ` : ""}{locality}</p>}
        {business.phone && <p>{business.phone}</p>}
        {business.photos[0]?.attribution && (
          <p dangerouslySetInnerHTML={{ __html: business.photos[0].attribution }} />
        )}
        <p>Hecho con Local Business Site Generator</p>
      </footer>

      {waHref && (
        <a
          className="st-wa"
          href={waHref}
          rel="noopener noreferrer"
          target="_blank"
          aria-label="Escríbenos por WhatsApp"
        >
          <WhatsAppIcon />
        </a>
      )}
    </div>
  );
}
