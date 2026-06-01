import { api } from "./client";
import { clearTokens, setTokens } from "./tokens";
import type { LoginResponse, StaffResponse } from "./types";

export async function login(username: string, password: string): Promise<LoginResponse> {
  const res = await api<LoginResponse>("/auth/login", {
    method: "POST",
    body: { username, password },
    skipAuth: true,
  });
  setTokens({ access: res.access_token, refresh: res.refresh_token });
  return res;
}

export async function logout(): Promise<void> {
  try {
    await api<void>("/auth/logout", { method: "POST" });
  } catch {
    /* best-effort; we clear locally either way */
  } finally {
    clearTokens();
  }
}

export async function getCurrentStaff(): Promise<StaffResponse> {
  return api<StaffResponse>("/staff/me");
}
