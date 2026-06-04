import type { CSSProperties } from "react";
import type { BusinessPhoto, SiteConfig } from "@/lib/types";
import { topReviews } from "@/lib/site-config";

interface SiteTemplateProps {
  config: SiteConfig;
  /**
   * Resolves a photo to a displayable URL. The preview passes a proxy URL;
   * the deploy bundler passes a local bundled path (e.g. photos/0.jpg).
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
 */
export function SiteTemplate({ config, resolvePhoto }: SiteTemplateProps) {
  const { business, content, theme } = config;
  const reviews = topReviews(business);

  const rootStyle = {
    ["--primary"]: theme.primaryColor,
    ["--accent"]: theme.accentColor,
  } as CSSProperties;

  return (
    <div className="site-template" style={rootStyle}>
      <header className="st-hero">
        <h1>{content.headline}</h1>
        {content.description && <p>{content.description}</p>}
        {typeof business.rating === "number" && (
          <div className="st-rating">
            {stars(business.rating)} {business.rating.toFixed(1)}
            {business.userRatingsTotal
              ? ` · ${business.userRatingsTotal} reviews`
              : ""}
          </div>
        )}
      </header>

      {business.photos.length > 0 && (
        <section className="st-section">
          <h2>Gallery</h2>
          <div className="st-gallery">
            {business.photos.slice(0, 6).map((photo, i) => (
              // eslint-disable-next-line @next/next/no-img-element -- template renders to framework-agnostic static HTML; next/image would break the deployed output
              <img
                key={photo.ref}
                src={resolvePhoto(photo, i)}
                alt={`${content.businessName} photo ${i + 1}`}
              />
            ))}
          </div>
        </section>
      )}

      {(business.hours || business.address || business.phone || business.website) && (
        <section className="st-section">
          <h2>Visit Us</h2>
          <div className="st-info">
            {business.hours && (
              <div className="st-card">
                <h3>Opening Hours</h3>
                <ul className="st-hours-list">
                  {business.hours.weekdayText.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            )}
            {(business.address || business.phone || business.website) && (
              <div className="st-card">
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
                        {business.website}
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
        <p>{content.businessName}</p>
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
