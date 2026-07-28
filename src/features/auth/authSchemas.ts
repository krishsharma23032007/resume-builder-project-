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
  email: z.string().transform(normalizeEmail).pipe(z.string().email("Please enter a valid email address.")),
  password: z.string().transform(cleanAuthText).pipe(z.string().min(1, "Password is required."))
});

export const registerSchema = z.object({
  name: z
    .string()
    .transform(cleanDisplayName)
    .pipe(z.string().min(2, "Please enter your full name (at least 2 letters).").max(80, "Name is too long.")),
  email: z.string().transform(normalizeEmail).pipe(z.string().email("Please enter a valid email address.")),
  password: z
    .string()
    .transform(cleanAuthText)
    .pipe(z.string().min(6, "Password must be at least 6 characters."))
});

export const passwordResetSchema = z.object({
  email: z.string().transform(normalizeEmail).pipe(z.string().email("Please enter a valid email address."))
});

export type LoginFormValues = z.input<typeof loginSchema>;
export type RegisterFormValues = z.input<typeof registerSchema>;
export type PasswordResetFormValues = z.input<typeof passwordResetSchema>;
