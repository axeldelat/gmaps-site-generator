"use client";

import { useState } from "react";
import type { SiteConfig } from "@/lib/types";

interface DeployPanelProps {
  config: SiteConfig;
}

type DeployStatus = "idle" | "deploying" | "success" | "error";

export function DeployPanel({ config }: DeployPanelProps) {
  const [status, setStatus] = useState<DeployStatus>("idle");
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleDeploy() {
    setStatus("deploying");
    setError(null);
    setUrl(null);
    try {
      const res = await fetch("/api/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Deployment failed. Please try again.");
        setStatus("error");
        return;
      }
      setUrl(data.url as string);
      setStatus("success");
    } catch {
      setError("We couldn't reach the server. Please try again.");
      setStatus("error");
    }
  }

  return (
    <div className="deploy-panel">
      <button
        className="deploy-button"
        onClick={handleDeploy}
        disabled={status === "deploying"}
      >
        {status === "deploying" ? "Deploying…" : "Publish my site"}
      </button>

      {status === "deploying" && (
        <p className="deploy-status" role="status">
          Building and publishing your site — this can take up to a minute.
        </p>
      )}

      {status === "success" && url && (
        <p className="deploy-success" role="status">
          🎉 Your site is live!{" "}
          <a href={url} target="_blank" rel="noopener noreferrer">
            {url}
          </a>
        </p>
      )}

      {status === "error" && error && (
        <p className="deploy-error" role="alert">
          {error}{" "}
          <button className="deploy-retry" onClick={handleDeploy}>
            Retry
          </button>
        </p>
      )}
    </div>
  );
}
