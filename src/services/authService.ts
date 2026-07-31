import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  type User
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  checkRateLimit,
  clearAttempts,
  recordFailedAttempt
} from "@/utils/rateLimit";
import type {
  AuthResult,
  LoginInput,
  PasswordResetInput,
  RegisterInput
} from "@/types/auth";

/** Generic error - never reveals whether email or password was wrong */
const genericAuthError =
  "Invalid email or password. Please try again.";

/** Rate limit error */
const rateLimitError = (retryAfterSeconds: number) =>
  `Too many login attempts. Please try again in ${Math.ceil(retryAfterSeconds / 60)} minutes.`;

/**
 * Maps Firebase error codes to user-friendly messages.
 * IMPORTANT: Never reveal which field (email/password) was incorrect.
 * This prevents account enumeration attacks.
 */
function firebaseError(err: unknown): string {
  const code = (err as { code?: string }).code ?? "";

  // Rate limiting errors
  if (code === "auth/too-many-requests") {
    return "Too many attempts. Please try again later.";
  }

  // All credential errors map to the same generic message (anti-enumeration)
  const credentialErrors = [
    "auth/user-not-found",
    "auth/wrong-password",
    "auth/invalid-credential",
    "auth/invalid-email",
    "auth/user-disabled"
  ];

  if (credentialErrors.includes(code)) {
    return genericAuthError;
  }

  // Registration errors
  if (code === "auth/email-already-in-use") {
    return "An account with this email already exists.";
  }

  // Network errors
  if (code === "auth/network-request-failed") {
    return "Network error. Please check your connection and try again.";
  }

  // Default - never expose internal details
  return genericAuthError;
}

function toAuthUser(user: User) {
  return {
    id: user.uid,
    name: user.displayName ?? "",
    email: user.email ?? ""
  };
}

export const authService = {
  async login(input: LoginInput): Promise<AuthResult> {
    // Check rate limit before attempting login
    const rateLimit = checkRateLimit(input.email);
    if (rateLimit.blocked) {
      return {
        status: "rate_limited",
        message: rateLimitError(rateLimit.retryAfterSeconds!),
        retryAfterSeconds: rateLimit.retryAfterSeconds
      };
    }

    try {
      const { user } = await signInWithEmailAndPassword(auth, input.email, input.password);
      clearAttempts(input.email);
      return {
        status: "authenticated",
        message: "Signed in.",
        user: toAuthUser(user)
      };
    } catch (err) {
      recordFailedAttempt(input.email);
      return { status: "error", message: firebaseError(err) };
    }
  },

  async register(input: RegisterInput): Promise<AuthResult> {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, input.email, input.password);
      await updateProfile(user, { displayName: input.name });
      return {
        status: "authenticated",
        message: "Account created.",
        user: toAuthUser(user)
      };
    } catch (err) {
      return { status: "error", message: firebaseError(err) };
    }
  },

  async requestPasswordReset(input: PasswordResetInput): Promise<AuthResult> {
    try {
      await sendPasswordResetEmail(auth, input.email);
      // Always return success to prevent account enumeration
      return {
        status: "idle",
        message: "If an account exists with this email, reset instructions will be sent."
      };
    } catch (err) {
      // Always return success to prevent account enumeration
      return {
        status: "idle",
        message: "If an account exists with this email, reset instructions will be sent."
      };
    }
  },

  async logout() {
    await signOut(auth);
  },

  genericAuthError
};
