const ACCESS_KEY = "yapshop.access";
const REFRESH_KEY = "yapshop.refresh";

/**
 * A non-sensitive presence flag mirrored in a cookie so middleware.ts can
 * read it (middleware runs at the edge with no access to localStorage). The
 * actual tokens stay in localStorage where the API client reads them.
 * Pairing localStorage + cookie keeps the existing Bearer-token flow intact
 * while letting us do server-side route protection.
 */
const AUTH_FLAG_COOKIE = "yapshop_authed";
const COOKIE_MAX_AGE_DAYS = 30;

function setAuthFlagCookie(value: boolean) {
  if (typeof document === "undefined") return;
  if (value) {
    const maxAge = COOKIE_MAX_AGE_DAYS * 24 * 60 * 60;
    document.cookie = `${AUTH_FLAG_COOKIE}=1; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
  } else {
    // Setting Max-Age=0 expires the cookie immediately.
    document.cookie = `${AUTH_FLAG_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
  }
}

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
    setAuthFlagCookie(true);
  } catch {
    /* storage may be unavailable; ignore */
  }
}

export function clearTokens() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    setAuthFlagCookie(false);
  } catch {
    /* ignore */
  }
}

export function isAuthenticated(): boolean {
  return getAccessToken() !== null;
}
