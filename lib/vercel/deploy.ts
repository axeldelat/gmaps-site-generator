import { createHash } from "crypto";

/**
 * Categorized deployment error. `userMessage` is safe to show; the cause is
 * logged server-side only.
 */
export type DeployErrorKind = "config" | "network" | "vercel" | "timeout";

export class DeployError extends Error {
  readonly kind: DeployErrorKind;
  readonly userMessage: string;
  readonly httpStatus: number;

  constructor(kind: DeployErrorKind, userMessage: string, cause?: unknown) {
    super(userMessage);
    this.name = "DeployError";
    this.kind = kind;
    this.userMessage = userMessage;
    this.httpStatus = kind === "config" ? 500 : kind === "network" ? 502 : 502;
    if (cause !== undefined) this.cause = cause;
  }
}

export interface DeployFile {
  /** Path within the deployment, e.g. "index.html" or "photos/0.jpg". */
  path: string;
  data: Buffer;
}

interface VercelCreds {
  token: string;
  teamId?: string;
}

function requireCreds(): VercelCreds {
  const token = process.env.VERCEL_API_TOKEN;
  if (!token) {
    throw new DeployError(
      "config",
      "Deployment is not configured correctly. Please try again later.",
      new Error("VERCEL_API_TOKEN is not set"),
    );
  }
  return { token, teamId: process.env.VERCEL_TEAM_ID || undefined };
}

function teamQuery(creds: VercelCreds): string {
  return creds.teamId ? `?teamId=${encodeURIComponent(creds.teamId)}` : "";
}

function sha1(data: Buffer): string {
  return createHash("sha1").update(data).digest("hex");
}

/** Upload one file's bytes to Vercel, addressed by its SHA1 digest. */
async function uploadFile(creds: VercelCreds, data: Buffer): Promise<void> {
  const digest = sha1(data);
  let res: Response;
  try {
    res = await fetch(`https://api.vercel.com/v2/files${teamQuery(creds)}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${creds.token}`,
        "Content-Type": "application/octet-stream",
        "x-vercel-digest": digest,
      },
      // Uint8Array view is an accepted BodyInit (Buffer's own type confuses TS).
      body: new Uint8Array(data),
    });
  } catch (cause) {
    throw new DeployError("network", "We couldn't reach the hosting service. Please try again.", cause);
  }
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new DeployError("vercel", "We couldn't upload your site files. Please try again.", new Error(`files HTTP ${res.status}: ${detail}`));
  }
}

interface CreatedDeployment {
  id: string;
  url: string;
  readyState: string;
}

async function createDeployment(
  creds: VercelCreds,
  name: string,
  files: DeployFile[],
): Promise<CreatedDeployment> {
  const body = {
    name,
    files: files.map((f) => ({ file: f.path, sha: sha1(f.data), size: f.data.length })),
    projectSettings: { framework: null },
    target: "production",
  };

  let res: Response;
  try {
    res = await fetch(`https://api.vercel.com/v13/deployments${teamQuery(creds)}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${creds.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch (cause) {
    throw new DeployError("network", "We couldn't reach the hosting service. Please try again.", cause);
  }
  const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) {
    throw new DeployError("vercel", "We couldn't start your deployment. Please try again.", new Error(`deployments HTTP ${res.status}: ${JSON.stringify(json)}`));
  }
  return {
    id: String(json.id),
    url: String(json.url),
    readyState: String((json.readyState as string) ?? "QUEUED"),
  };
}

async function getReadyState(creds: VercelCreds, id: string): Promise<string> {
  const res = await fetch(`https://api.vercel.com/v13/deployments/${id}${teamQuery(creds)}`, {
    headers: { Authorization: `Bearer ${creds.token}` },
  });
  const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) {
    throw new DeployError("vercel", "We lost track of your deployment. Please try again.", new Error(`status HTTP ${res.status}: ${JSON.stringify(json)}`));
  }
  return String((json.readyState as string) ?? (json.status as string) ?? "QUEUED");
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Disable deployment protection (SSO / password) on a generated project so the
 * business owner's site is publicly viewable. Best-effort: the deployment has
 * already succeeded, so a failure here is logged but does not fail the deploy.
 */
async function makeProjectPublic(creds: VercelCreds, projectName: string): Promise<void> {
  try {
    const res = await fetch(
      `https://api.vercel.com/v9/projects/${encodeURIComponent(projectName)}${teamQuery(creds)}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${creds.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ssoProtection: null, passwordProtection: null }),
      },
    );
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.warn(`[deploy] could not disable protection: HTTP ${res.status}: ${detail}`);
    }
  } catch (cause) {
    console.warn("[deploy] could not disable protection:", cause);
  }
}

/**
 * Deploy a set of static files to Vercel and return the live URL once READY.
 * Uploads each file by SHA, creates the deployment, then polls until the
 * deployment is ready or fails.
 */
export async function deploySite(
  name: string,
  files: DeployFile[],
  { maxPolls = 40, intervalMs = 3000 } = {},
): Promise<{ url: string }> {
  const creds = requireCreds();

  // 1. Upload file contents.
  await Promise.all(files.map((f) => uploadFile(creds, f.data)));

  // 2. Create the deployment (this also creates the project on first deploy).
  const deployment = await createDeployment(creds, name, files);

  // 2b. Ensure the generated site is publicly viewable (best-effort).
  await makeProjectPublic(creds, name);

  // 3. Poll until ready.
  let state = deployment.readyState;
  for (let i = 0; i < maxPolls && state !== "READY"; i++) {
    if (state === "ERROR" || state === "CANCELED") {
      throw new DeployError("vercel", "The deployment failed. Please try again.", new Error(`readyState ${state}`));
    }
    await delay(intervalMs);
    state = await getReadyState(creds, deployment.id);
  }

  if (state !== "READY") {
    throw new DeployError("timeout", "Your site is taking longer than expected. Please try again in a moment.", new Error(`final state ${state}`));
  }

  return { url: `https://${deployment.url}` };
}
