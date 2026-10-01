"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AuthUser, LoginResponse } from "../dtos/login-response";
import { http } from "~/shared/http";


type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (response: LoginResponse) => void;
  signOut: () => Promise<void>;
  updateUser: (user: AuthUser | null) => void;
  hasRole: (role: string) => boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const USER_STORAGE_KEY = "chegou-auth-user";

function saveUser(user: AuthUser | null) {
  try {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  } catch {
  }
}

type AuthProviderProps = {
  children: React.ReactNode;
  initialUser?: AuthUser | null;
};

export function AuthProvider({
  children,
  initialUser = null,
}: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(initialUser);
  const [isLoading, setIsLoading] = useState(!initialUser);

  useEffect(() => {
    if (initialUser) {
      saveUser(initialUser);
      return;
    }

    let isActive = true;

    async function restoreUser() {
      try {
        const { data } = await http.get<AuthUser | LoginResponse>("/account/me");
        const authenticatedUser = "user" in data ? data.user : data;

        if (isActive) {
          saveUser(authenticatedUser);
          setUser(authenticatedUser);
        }
      } catch {
        if (isActive) {
          saveUser(null);
          setUser(null);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void restoreUser();

    return () => {
      isActive = false;
    };
  }, [initialUser]);

  const signIn = useCallback((response: LoginResponse) => {
    saveUser(response.user);
    setUser(response.user);
    setIsLoading(false);
  }, []);

  const signOut = useCallback(async () => {
    try {
      await http.post("/account/logout");
    } finally {
      saveUser(null);
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  const updateUser = useCallback((user: AuthUser | null) => {
    saveUser(user);
    setUser(user);
  }, []);

  const hasRole = useCallback((role: string) => user?.role === role, [user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      signIn,
      signOut,
      updateUser,
      hasRole,
    }),
    [user, isLoading, signIn, signOut, updateUser, hasRole],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }

  return context;
}
