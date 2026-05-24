import axios, { AxiosError } from "axios";

import { clearSession, getAccessToken } from "@/lib/auth-storage";

const DEFAULT_BACKEND_URL = "http://localhost:8000";

function getBackendBaseUrl() {
  return (process.env.NEXT_PUBLIC_BACKEND_URL ?? DEFAULT_BACKEND_URL).replace(/\/$/, "");
}

export const httpClient = axios.create({
  baseURL: getBackendBaseUrl(),
  timeout: 15000,
  withCredentials: false,
  headers: {
    Accept: "application/json",
  },
});

httpClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ detail?: string; message?: string }>) => {
    const status = error.response?.status;
    const detail = error.response?.data?.detail ?? error.response?.data?.message;

    if (status === 401 && typeof window !== "undefined") {
      clearSession();
      window.dispatchEvent(new CustomEvent("interali:auth-expired"));
    }

    const fallback = error.message || "La petición falló";
    const normalizedError = new Error(detail ?? fallback);
    return Promise.reject(normalizedError);
  }
);
