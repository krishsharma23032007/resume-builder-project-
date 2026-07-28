import { z } from "zod";
import { cleanAuthText, cleanDisplayName, normalizeEmail } from "@/utils/sanitize";

const passwordSchema = z
  .string()
  .min(12, "Use at least 12 characters.")
  .regex(/[A-Z]/, "Add an uppercase letter.")
  .regex(/[a-z]/, "Add a lowercase letter.")
  .regex(/[0-9]/, "Add a number.")
  .regex(/[^A-Za-z0-9]/, "Add a symbol.");

export const loginSchema = z.object({
  email: z.string().transform(normalizeEmail).pipe(z.string().email("Enter a valid email.")),
  password: z.string().transform(cleanAuthText).pipe(z.string().min(1, "Enter your password."))
});

export const registerSchema = z.object({
  name: z
    .string()
    .transform(cleanDisplayName)
    .pipe(z.string().min(2, "Enter your full name.").max(80, "Name is too long.")),
  email: z.string().transform(normalizeEmail).pipe(z.string().email("Enter a valid email.")),
  password: z.string().transform(cleanAuthText).pipe(passwordSchema)
});

export const passwordResetSchema = z.object({
  email: z.string().transform(normalizeEmail).pipe(z.string().email("Enter a valid email."))
});

export type LoginFormValues = z.input<typeof loginSchema>;
export type RegisterFormValues = z.input<typeof registerSchema>;
export type PasswordResetFormValues = z.input<typeof passwordResetSchema>;
