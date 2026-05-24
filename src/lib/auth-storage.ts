import type { AuthResponse, UserRead } from "@/lib/types";

const SESSION_KEY = "interali.session";

function isBrowser() {
  return typeof window !== "undefined";
}

function getCookieValue(name: string) {
  if (!isBrowser()) {
    return null;
  }

  const prefix = `${encodeURIComponent(name)}=`;
  const cookie = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(prefix));

  if (!cookie) {
    return null;
  }

  return decodeURIComponent(cookie.slice(prefix.length));
}

function setCookieValue(name: string, value: string, maxAgeSeconds?: number) {
  if (!isBrowser()) {
    return;
  }

  const cookieParts = [`${encodeURIComponent(name)}=${encodeURIComponent(value)}`, "path=/", "SameSite=Lax"];

  if (typeof maxAgeSeconds === "number") {
    cookieParts.push(`max-age=${maxAgeSeconds}`);
  }

  if (window.location.protocol === "https:") {
    cookieParts.push("Secure");
  }

  document.cookie = cookieParts.join("; ");
}

function deleteCookieValue(name: string) {
  if (!isBrowser()) {
    return;
  }

  document.cookie = `${encodeURIComponent(name)}=; path=/; max-age=0; SameSite=Lax`;
}

export function saveSession(session: AuthResponse) {
  if (!isBrowser()) {
    return;
  }

  setCookieValue(SESSION_KEY, JSON.stringify(session), session.expires_in);
}

export function getStoredSession(): AuthResponse | null {
  if (!isBrowser()) {
    return null;
  }

  const raw = getCookieValue(SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<AuthResponse>;

    // Defensive check to avoid treating malformed cookie content as an authenticated session.
    if (!parsed || typeof parsed !== "object" || typeof parsed.access_token !== "string" || !parsed.user) {
      deleteCookieValue(SESSION_KEY);
      return null;
    }

    return parsed as AuthResponse;
  } catch {
    deleteCookieValue(SESSION_KEY);
    return null;
  }
}

export function getStoredUser(): UserRead | null {
  return getStoredSession()?.user ?? null;
}

export function getAccessToken() {
  return getStoredSession()?.access_token ?? null;
}

export function clearSession() {
  if (!isBrowser()) {
    return;
  }

  deleteCookieValue(SESSION_KEY);
}