import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  type User
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import type {
  AuthResult,
  LoginInput,
  PasswordResetInput,
  RegisterInput
} from "@/types/auth";

const genericAuthError =
  "We could not sign you in with those details. Check your information and try again.";

function firebaseError(err: unknown): string {
  const code = (err as { code?: string }).code ?? "";
  const map: Record<string, string> = {
    "auth/user-not-found": "No account found with that email.",
    "auth/wrong-password": "Incorrect password.",
    "auth/email-already-in-use": "An account already exists with that email.",
    "auth/invalid-email": "Invalid email address.",
    "auth/too-many-requests": "Too many attempts. Try again later.",
    "auth/invalid-credential": "Invalid credentials."
  };
  return map[code] ?? genericAuthError;
}

function toAuthUser(user: User) {
  return { id: user.uid, name: user.displayName ?? "", email: user.email ?? "" };
}

export const authService = {
  async login(input: LoginInput): Promise<AuthResult> {
    try {
      const { user } = await signInWithEmailAndPassword(auth, input.email, input.password);
      return { status: "authenticated", message: "Signed in.", user: toAuthUser(user) };
    } catch (err) {
      return { status: "error", message: firebaseError(err) };
    }
  },

  async register(input: RegisterInput): Promise<AuthResult> {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, input.email, input.password);
      await updateProfile(user, { displayName: input.name });
      return { status: "authenticated", message: "Account created.", user: toAuthUser(user) };
    } catch (err) {
      return { status: "error", message: firebaseError(err) };
    }
  },

  async requestPasswordReset(input: PasswordResetInput): Promise<AuthResult> {
    try {
      await sendPasswordResetEmail(auth, input.email);
      return { status: "idle", message: "If an account exists, reset instructions will be sent." };
    } catch (err) {
      return { status: "error", message: firebaseError(err) };
    }
  },

  async logout() {
    await signOut(auth);
  },

  genericAuthError
};
