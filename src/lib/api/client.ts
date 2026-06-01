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
  /** Plain object — JSON-stringified for you. Use `formData` for multipart. */
  body?: unknown;
  /** Use this for file uploads. Sent as-is; no Content-Type is set. */
  formData?: FormData;
  /** Skip auth header injection (e.g. for the login endpoint). */
  skipAuth?: boolean;
}

export async function api<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { body, formData, skipAuth, headers, ...rest } = options;

  const send = async (token: string | null): Promise<Response> => {
    const h = new Headers(headers);

    h.set("ngrok-skip-browser-warning", "true");
    if (!skipAuth && token) h.set("Authorization", `Bearer ${token}`);

    let payload: BodyInit | undefined;
    if (formData) {
      payload = formData; // browser sets multipart boundary; do not set Content-Type
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
    try {
      payload = await res.json();
    } catch {
      /* response body was not JSON; that's fine */
    }
    throw new ApiError(res.status, payload, `Request failed: ${res.status}`);
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
