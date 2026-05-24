import { httpClient } from "@/api/http-client";
import type { AuthResponse, CurrentUserResponse, LoginRequest, RegisterRequest } from "@/lib/types";

export async function login(payload: LoginRequest) {
  const { data } = await httpClient.post<AuthResponse>("/auth/login", payload);
  return data;
}

export async function register(payload: RegisterRequest) {
  const { data } = await httpClient.post<AuthResponse>("/auth/register", payload);
  return data;
}

export async function getMe() {
  const { data } = await httpClient.get<CurrentUserResponse>("/auth/me");
  return data;
}
