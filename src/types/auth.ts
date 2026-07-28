export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

export type AuthMode = "login" | "register" | "forgot";

export type AuthStatus =
  | "idle"
  | "loading"
  | "submitting"
  | "authenticated"
  | "rate_limited"
  | "locked"
  | "error";

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = LoginInput & {
  name: string;
};

export type PasswordResetInput = {
  email: string;
};

export type AuthResult = {
  user?: AuthUser;
  status: Exclude<AuthStatus, "submitting">;
  message: string;
  retryAfterSeconds?: number;
};
