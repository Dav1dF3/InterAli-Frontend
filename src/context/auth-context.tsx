"use client";

import { createContext, useCallback, useEffect, useMemo, useState } from "react";

import { getMe, login, register } from "@/services/auth.service";
import { clearSession, getStoredSession, saveSession } from "@/lib/auth-storage";
import type { LoginRequest, RegisterRequest, UserRead } from "@/lib/types";

type AuthContextValue = {
  user: UserRead | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginAction: (payload: LoginRequest) => Promise<void>;
  registerAction: (payload: RegisterRequest) => Promise<void>;
  logoutAction: () => void;
  refreshUser: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [user, setUser] = useState<UserRead | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const session = getStoredSession();
    if (!session) {
      setUser(null);
      return;
    }

    try {
      const me = await getMe();
      setUser({ ...session.user, ...me });
    } catch {
      clearSession();
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const session = getStoredSession();

      if (!session?.user) {
        setIsLoading(false);
        return;
      }

      setUser(session.user);

      void refreshUser().finally(() => setIsLoading(false));
    }, 0);

    return () => window.clearTimeout(timer);
  }, [refreshUser]);

  useEffect(() => {
    function onAuthExpired() {
      clearSession();
      setUser(null);
    }

    window.addEventListener("interali:auth-expired", onAuthExpired);
    return () => window.removeEventListener("interali:auth-expired", onAuthExpired);
  }, []);

  const loginAction = useCallback(async (payload: LoginRequest) => {
    const session = await login(payload);
    saveSession(session);
    setUser(session.user);
  }, []);

  const registerAction = useCallback(async (payload: RegisterRequest) => {
    const session = await register(payload);
    saveSession(session);
    setUser(session.user);
  }, []);

  const logoutAction = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      loginAction,
      registerAction,
      logoutAction,
      refreshUser,
    }),
    [user, isLoading, loginAction, registerAction, logoutAction, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
