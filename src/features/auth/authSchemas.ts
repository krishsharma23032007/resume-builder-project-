import { z } from "zod";
import { cleanAuthText, cleanDisplayName, normalizeEmail } from "@/utils/sanitize";

/** Password strength requirements */
const passwordRules = z
  .string({ required_error: "Password is required." })
  .min(1, "Password is required.")
  .min(8, "Password must be at least 8 characters.")
  .max(128, "Password is too long.")
  .regex(/[a-z]/, "Password must contain a lowercase letter.")
  .regex(/[A-Z]/, "Password must contain an uppercase letter.")
  .regex(/[0-9]/, "Password must contain a number.");

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required." })
    .min(1, "Email address is required.")
    .max(254, "Email address is too long.")
    .transform(normalizeEmail)
    .pipe(z.string().email("Please enter a valid email address (e.g. name@example.com).")),
  password: z
    .string({ required_error: "Password is required." })
    .min(1, "Password is required.")
    .max(128, "Password is too long.")
});

export const registerSchema = z.object({
  name: z
    .string({ required_error: "Full name is required." })
    .min(1, "Full name is required.")
    .max(80, "Name is too long.")
    .transform(cleanDisplayName)
    .pipe(
      z
        .string()
        .min(2, "Please enter your full name (at least 2 letters).")
        .max(80, "Name is too long.")
        .regex(/^[a-zA-Z\s\-'.]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes.")
    ),
  email: z
    .string({ required_error: "Email is required." })
    .min(1, "Email address is required.")
    .max(254, "Email address is too long.")
    .transform(normalizeEmail)
    .pipe(z.string().email("Please enter a valid email address (e.g. name@example.com).")),
  password: passwordRules.transform(cleanAuthText).pipe(passwordRules)
});

export const passwordResetSchema = z.object({
  email: z
    .string({ required_error: "Email is required." })
    .min(1, "Email address is required.")
    .max(254, "Email address is too long.")
    .transform(normalizeEmail)
    .pipe(z.string().email("Please enter a valid email address (e.g. name@example.com)."))
});

export type LoginFormValues = z.input<typeof loginSchema>;
export type RegisterFormValues = z.input<typeof registerSchema>;
export type PasswordResetFormValues = z.input<typeof passwordResetSchema>;
