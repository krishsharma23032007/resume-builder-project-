import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { authService } from "@/services/authService";
import type {
  AuthResult,
  AuthStatus,
  AuthUser,
  LoginInput,
  PasswordResetInput,
  RegisterInput
} from "@/types/auth";

type AuthContextValue = {
  user: AuthUser | null;
  status: AuthStatus;
  login: (input: LoginInput) => Promise<AuthResult>;
  register: (input: RegisterInput) => Promise<AuthResult>;
  requestPasswordReset: (input: PasswordResetInput) => Promise<AuthResult>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    try {
      unsubscribe = onAuthStateChanged(
        auth,
        (firebaseUser) => {
          if (firebaseUser) {
            setUser({
              id: firebaseUser.uid,
              name: firebaseUser.displayName ?? "",
              email: firebaseUser.email ?? ""
            });
            setStatus("authenticated");
          } else {
            setUser(null);
            setStatus("idle");
          }
        },
        (error) => {
          console.error("Auth state listener error:", error);
          setUser(null);
          setStatus("idle");
        }
      );
    } catch (error) {
      console.error("Firebase auth init error:", error);
      setUser(null);
      setStatus("idle");
    }
    return () => {
      unsubscribe?.();
    };
  }, []);

  async function runAuth(action: () => Promise<AuthResult>) {
    setStatus("submitting");
    const result = await action();
    setStatus(result.status);
    if (result.user) {
      setUser(result.user);
    }
    return result;
  }

  const value = useMemo(
    () => ({
      user,
      status,
      login: (input: LoginInput) => runAuth(() => authService.login(input)),
      register: (input: RegisterInput) => runAuth(() => authService.register(input)),
      requestPasswordReset: (input: PasswordResetInput) =>
        runAuth(() => authService.requestPasswordReset(input)),
      logout: async () => {
        try {
          await authService.logout();
        } catch (error) {
          console.error("Logout error:", error);
        }
        setUser(null);
        setStatus("idle");
      }
    }),
    [status, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
