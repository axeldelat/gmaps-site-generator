import type { CSSProperties } from "react";
import type { BusinessPhoto, SiteConfig } from "@/lib/types";
import { topReviews } from "@/lib/site-config";

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

/**
 * The generated business site. Pure and presentational so it can render both
 * as the live in-app preview and (via renderToStaticMarkup) as the deployed
 * static HTML. Sections render only when their data is present, so partial
 * business data never breaks the layout.
 *
 * The hero is image-led: it uses the business's first photo as a full-bleed
 * background with a dark scrim (so white text stays legible over any photo or
 * theme color). The remaining photos fill the gallery.
 */
export function SiteTemplate({ config, resolvePhoto }: SiteTemplateProps) {
  const { business, content, theme } = config;
  const reviews = topReviews(business);

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

  return (
    <div className="site-template" style={rootStyle}>
      <header className="st-hero" style={heroStyle}>
        <div className="st-hero-content">
          <h1>{content.headline}</h1>
          {content.description && <p className="st-lead">{content.description}</p>}
          {typeof business.rating === "number" && (
            <div className="st-rating">
              <span className="st-stars" aria-hidden="true">
                {stars(business.rating)}
              </span>
              <span>
                {business.rating.toFixed(1)}
                {business.userRatingsTotal
                  ? ` · ${business.userRatingsTotal.toLocaleString()} reviews`
                  : ""}
              </span>
            </div>
          )}
        </div>
      </header>

      {galleryPhotos.length > 0 && (
        <section className="st-section">
          <h2>Gallery</h2>
          <div className="st-gallery">
            {galleryPhotos.map(({ photo, index }) => (
              <div className="st-gallery-item" key={photo.ref}>
                {/* eslint-disable-next-line @next/next/no-img-element -- template renders to framework-agnostic static HTML; next/image would break the deployed output */}
                <img
                  src={resolvePhoto(photo, index)}
                  alt={`${content.businessName} — photo ${index + 1}`}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {(business.hours || business.address || business.phone || business.website) && (
        <section className="st-section">
          <h2>Visit Us</h2>
          <div className="st-visit">
            {business.hours && (
              <div>
                <h3>Opening Hours</h3>
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
              <div>
                <h3>Get in Touch</h3>
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
        </section>
      )}

      {reviews.length > 0 && (
        <section className="st-section">
          <h2>What People Say</h2>
          <div className="st-reviews">
            {reviews.map((review, i) => (
              <blockquote className="st-review" key={`${review.author}-${i}`}>
                <div className="st-review-head">
                  <span className="st-author">{review.author}</span>
                  <span className="st-stars" aria-label={`${review.rating} out of 5`}>
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

      <footer className="st-footer">
        <p className="st-footer-name">{content.businessName}</p>
        {business.photos[0]?.attribution && (
          <p
            dangerouslySetInnerHTML={{ __html: business.photos[0].attribution }}
          />
        )}
        <p>Powered by Local Business Site Generator</p>
      </footer>
    </div>
  );
}
