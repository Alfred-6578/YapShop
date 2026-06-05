import { api, ApiError } from "./client"
import { clearTokens, setTokens } from "./tokens"
import type { LoginResponse, StaffResponse } from "./types"

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? ""

/**
 * The login endpoint expects `application/x-www-form-urlencoded` per OAuth2
 * password-flow convention — not the JSON body the rest of the API takes. We
 * call fetch directly here instead of routing through `api()` to keep that
 * one-off encoding out of the shared client.
 */
export async function login(
  username: string,
  password: string,
): Promise<LoginResponse> {
  const body = new URLSearchParams({
    username,
    password,
    grant_type: "password",
  })

  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
      "ngrok-skip-browser-warning": "true",
    },
    body,
  })

  if (!res.ok) {
    let detail: unknown = null
    try {
      detail = await res.json()
    } catch {
      try {
        detail = await res.text()
      } catch {
        /* nothing more to learn */
      }
    }
    const message =
      res.status === 401 || res.status === 403
        ? "Wrong username or password."
        : `Login failed (HTTP ${res.status}).`
    throw new ApiError(res.status, detail, message)
  }

  const data = (await res.json()) as LoginResponse
  setTokens({ access: data.access_token, refresh: data.refresh_token })
  return data
}

export async function logout(): Promise<void> {
  // Best-effort server logout — we clear locally either way. Routing through
  // `api()` attaches the Bearer token so the backend can invalidate the
  // refresh token / session, not just blindly accept the call. If the token
  // is already expired (401) or the network is down, the local clear below
  // still runs.
  try {
    await api<void>("/auth/logout", { method: "POST" })
  } catch {
    /* ignore */
  }
  clearTokens()
}

/** Prefer `getCurrentStaff` from `lib/api/staff.ts`. Kept here as the
 *  historical home — same endpoint. */
export async function getCurrentStaff(): Promise<StaffResponse> {
  return api<StaffResponse>("/staff/me")
}
