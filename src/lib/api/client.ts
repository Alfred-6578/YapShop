/**
 * The single entry point for every API call. Handles:
 *  - base URL from env (NEXT_PUBLIC_API_URL)
 *  - Bearer token injection
 *  - JSON content-type (skipped for FormData so multipart uploads work)
 *  - 401 → refresh → retry once, with deduplication so 10 parallel 401s
 *    only trigger one refresh
 *  - typed JSON parsing
 *  - thrown ApiError carrying status + payload for callers to inspect
 */

import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from "./tokens";
import type { AuthTokens } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

export class ApiError extends Error {
  constructor(
    public status: number,
    public payload: unknown,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Extract a human-readable message from a server error payload. Handles:
 *  - FastAPI string detail        → `{detail: "..."}`
 *  - FastAPI validation list      → `{detail: [{loc, msg, ...}, ...]}`
 *  - Generic `{message}` / `{error}` shapes
 *  - Plain text bodies (tracebacks, html, etc.)
 * Falls back to `Request failed: <status> <path>` when nothing usable is found.
 */
function describeApiError(status: number, payload: unknown, path: string): string {
  if (payload && typeof payload === "object") {
    const p = payload as Record<string, unknown>;

    if (typeof p.detail === "string" && p.detail.trim()) return p.detail.trim();

    if (Array.isArray(p.detail)) {
      const issues = p.detail.flatMap((d): string[] => {
        if (d && typeof d === "object") {
          const dd = d as Record<string, unknown>;
          const msg = typeof dd.msg === "string" ? dd.msg : "invalid";
          const loc = Array.isArray(dd.loc)
            ? dd.loc.filter((x) => x !== "body").join(".")
            : "";
          return [loc ? `${loc}: ${msg}` : msg];
        }
        return [];
      });
      if (issues.length) return issues.join("; ");
    }

    if (typeof p.message === "string" && p.message.trim()) return p.message.trim();
    if (typeof p.error === "string" && p.error.trim()) return p.error.trim();
  }

  if (typeof payload === "string") {
    const trimmed = payload.trim();
    if (trimmed) {
      // Keep it short — tracebacks can be huge.
      return trimmed.length > 240 ? `${trimmed.slice(0, 240)}…` : trimmed;
    }
  }

  return `Request failed: ${status} ${path}`;
}

// Single in-flight refresh promise so parallel 401s share one refresh call.
let refreshInflight: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (refreshInflight) return refreshInflight;

  refreshInflight = (async () => {
    const refresh = getRefreshToken();
    if (!refresh) return null;

    try {
      const res = await fetch(`${API_BASE}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ refresh_token: refresh }),
      });
      if (!res.ok) return null;
      const data = (await res.json()) as AuthTokens;
      setTokens({ access: data.access_token, refresh: data.refresh_token });
      return data.access_token;
    } catch {
      return null;
    } finally {
      refreshInflight = null;
    }
  })();

  return refreshInflight;
}

export interface ApiOptions extends Omit<RequestInit, "body"> {
  /** Plain object → JSON-stringified. FormData → sent as-is for multipart uploads. */
  body?: unknown;
  /** Skip auth header injection (e.g. for the login endpoint). */
  skipAuth?: boolean;
}

export async function api<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { body, skipAuth, headers, ...rest } = options;

  const send = async (token: string | null): Promise<Response> => {
    const h = new Headers(headers);

    h.set("ngrok-skip-browser-warning", "true");
    if (!skipAuth && token) h.set("Authorization", `Bearer ${token}`);

    const isFormData = body instanceof FormData;
    let payload: BodyInit | undefined;
    if (isFormData) {
      // Don't set Content-Type — the browser writes
      // `multipart/form-data; boundary=...` with the boundary token it generated.
      payload = body;
    } else if (body !== undefined) {
      if (!h.has("Content-Type")) h.set("Content-Type", "application/json");
      payload = JSON.stringify(body);
    }

    return fetch(`${API_BASE}${path}`, { ...rest, headers: h, body: payload });
  };

  let res = await send(skipAuth ? null : getAccessToken());

  if (res.status === 401 && !skipAuth) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      res = await send(newToken);
    } else {
      clearTokens();
      if (typeof window !== "undefined") {
        // Soft redirect — preserve where the user was trying to go.
        const next = window.location.pathname + window.location.search;
        window.location.href = `/login?next=${encodeURIComponent(next)}`;
      }
      throw new ApiError(401, null, "Session expired");
    }
  }

  if (!res.ok) {
    let payload: unknown = null;
    // Clone so we can try JSON first, then fall back to raw text. Without the
    // clone the second .text() would error with "body already consumed".
    try {
      payload = await res.clone().json();
    } catch {
      try {
        payload = await res.text();
      } catch {
        /* body wasn't readable at all; leave payload null */
      }
    }
    const message = describeApiError(res.status, payload, path);
    // Mirror the parsed payload into the console — DevTools can show structure
    // the UI banner doesn't have room for.
    // eslint-disable-next-line no-console
    console.error(`[api] ${res.status} ${path}`, payload);
    throw new ApiError(res.status, payload, message);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

/** Build a query string from a params object, skipping undefined/null. */
export function qs(params: object): string {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null);
  if (entries.length === 0) return "";
  const search = new URLSearchParams(entries.map(([k, v]) => [k, String(v)]));
  return `?${search.toString()}`;
}
