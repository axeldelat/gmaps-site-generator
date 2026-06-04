"use client";

import { useState } from "react";
import type { Business } from "@/lib/types";

interface UrlImportFormProps {
  onImported: (business: Business) => void;
}

export function UrlImportForm({ onImported }: UrlImportFormProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      onImported(data.business as Business);
    } catch {
      setError("We couldn't reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="import-form" onSubmit={handleSubmit}>
      <label className="import-label" htmlFor="maps-url">
        Paste your Google Maps link
      </label>
      <p className="import-hint">
        Open your business in Google Maps, copy the link, and paste it here.
      </p>
      <div className="import-row">
        <input
          id="maps-url"
          className="import-input"
          type="text"
          inputMode="url"
          placeholder="https://maps.app.goo.gl/..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={loading}
          autoComplete="off"
        />
        <button className="import-button" type="submit" disabled={loading || url.trim() === ""}>
          {loading ? "Building…" : "Build my site"}
        </button>
      </div>
      {error && (
        <p className="import-error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
