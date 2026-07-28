import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import {
  loginSchema,
  passwordResetSchema,
  registerSchema,
  type LoginFormValues,
  type PasswordResetFormValues,
  type RegisterFormValues
} from "@/features/auth/authSchemas";
import { authService } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";
import type { AuthMode } from "@/types/auth";

type AuthCardProps = {
  mode: AuthMode;
};

export function AuthCard({ mode }: AuthCardProps) {
  const navigate = useNavigate();
  const isRegister = mode === "register";
  const isForgot = mode === "forgot";
  const { login, register, requestPasswordReset, status } = useAuth();
  const form = useForm<LoginFormValues & RegisterFormValues & PasswordResetFormValues>({
    defaultValues: {
      email: "",
      name: "",
      password: ""
    }
  });
  const { errors } = form.formState;

  async function handleSubmit(values: LoginFormValues & RegisterFormValues) {
    form.clearErrors();
    const schema = isForgot ? passwordResetSchema : isRegister ? registerSchema : loginSchema;
    const parsed = schema.safeParse(values);

    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as "email" | "name" | "password";
        if (fieldName) {
          form.setError(fieldName, { message: issue.message });
        }
      });
      return;
    }

    const result = await submitParsedAuth(parsed.data);

    if (result.status === "error") {
      form.setError("root", { message: result.message });
      return;
    }

    if (result.status === "authenticated") {
      navigate("/dashboard");
      return;
    }

    if (isForgot || result.status === "idle") {
      form.setError("root", {
        message: result.message || "Reset link sent! If an account exists, please check your inbox."
      });
      return;
    }

    if (result.status === "locked" || result.status === "rate_limited") {
      form.setError("root", { message: result.message });
    }
  }

  async function handleGoogleSignIn() {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      navigate("/dashboard");
    } catch (error: unknown) {
      console.error("Google Sign-In Error:", error);
      const code = (error as { code?: string }).code ?? "";
      if (code !== "auth/popup-closed-by-user") {
        if (code === "auth/unauthorized-domain") {
          form.setError("root", {
            message: "Domain not authorized in Firebase Console. Please add resume-builder-project-pink.vercel.app to Authorized Domains."
          });
        } else {
          form.setError("root", { message: `Google sign-in failed (${code || "Unknown error"}). Try again.` });
        }
      }
    }
  }

  async function submitParsedAuth(
    values: { email: string } | { email: string; password: string } | RegisterFormValues
  ) {
    if (isForgot) {
      return requestPasswordReset(passwordResetSchema.parse(values));
    }

    if (isRegister) {
      return register(registerSchema.parse(values));
    }

    return login(loginSchema.parse(values));
  }

  return (
    <main className="grid min-h-[calc(100vh-4rem)] place-items-center bg-brutal-yellow px-4 py-12 pt-28">
      <Card className="w-full max-w-md">
        <p className="text-sm font-extrabold text-brutal-line">ResumeGuru secure access</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tighter">
          {isForgot ? "Reset your password" : isRegister ? "Create your account" : "Welcome back"}
        </h1>
        <p className="mt-2 text-sm font-bold leading-6 text-brutal-line">
          {isForgot
            ? "We use neutral reset messages to avoid account enumeration."
            : "Enter your credentials to access your resume workspace."}
        </p>

        <form
          className="mt-6 space-y-4"
          aria-label={`${mode} form`}
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          {isRegister ? (
            <FieldError message={errors.name?.message}>
              <Input autoComplete="name" placeholder="Full name" type="text" {...form.register("name")} />
            </FieldError>
          ) : null}
          <FieldError message={errors.email?.message}>
            <Input autoComplete="email" placeholder="Email address" type="email" {...form.register("email")} />
          </FieldError>
          {!isForgot ? (
            <FieldError message={errors.password?.message}>
              <Input
                autoComplete={isRegister ? "new-password" : "current-password"}
                placeholder="Password"
                type="password"
                {...form.register("password")}
              />
            </FieldError>
          ) : null}
          {errors.root?.message ? (
            <p className="rounded-xl border-2 border-brutal-ink bg-white p-3 text-sm font-extrabold" role="alert">
              {errors.root.message}
            </p>
          ) : null}
          <Button className="w-full" disabled={status === "submitting"} type="submit">
            {isForgot ? "Send reset link" : isRegister ? "Create account" : "Log in"}
          </Button>
        </form>

        {!isForgot ? (
          <Button
            className="mt-4 w-full"
            disabled={status === "submitting"}
            onClick={handleGoogleSignIn}
            type="button"
            variant="outline"
          >
            <ShieldCheck size={18} />
            Continue with Google
          </Button>
        ) : null}

        <div className="mt-5 flex justify-between text-sm font-extrabold text-brutal-line">
          <Link to={isRegister ? "/login" : "/register"}>
            {isRegister ? "Have an account?" : "Create account"}
          </Link>
          {!isForgot ? <Link to="/forgot-password">Forgot password?</Link> : null}
        </div>
      </Card>
    </main>
  );
}

function FieldError({
  children,
  message
}: {
  children: React.ReactNode;
  message?: string;
}) {
  return (
    <label className="block space-y-2">
      {children}
      {message ? <span className="block text-xs font-extrabold text-brutal-line">{message}</span> : null}
    </label>
  );
}
