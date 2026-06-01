const ACCESS_KEY = "yapshop.access";
const REFRESH_KEY = "yapshop.refresh";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(ACCESS_KEY);
  } catch {
    return null;
  }
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(REFRESH_KEY);
  } catch {
    return null;
  }
}

export function setTokens(tokens: { access: string; refresh: string }) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ACCESS_KEY, tokens.access);
    localStorage.setItem(REFRESH_KEY, tokens.refresh);
  } catch {
    /* storage may be unavailable; ignore */
  }
}

export function clearTokens() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  } catch {
    /* ignore */
  }
}

export function isAuthenticated(): boolean {
  return getAccessToken() !== null;
}
