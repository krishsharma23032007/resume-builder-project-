import { z } from "zod";
import { cleanAuthText, cleanDisplayName, normalizeEmail } from "@/utils/sanitize";

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required." })
    .min(1, "Email address is required.")
    .transform(normalizeEmail)
    .pipe(z.string().email("Please enter a valid email address (e.g. name@example.com).")),
  password: z
    .string({ required_error: "Password is required." })
    .min(1, "Password is required.")
});

export const registerSchema = z.object({
  name: z
    .string({ required_error: "Full name is required." })
    .min(1, "Full name is required.")
    .transform(cleanDisplayName)
    .pipe(z.string().min(2, "Please enter your full name (at least 2 letters).").max(80, "Name is too long.")),
  email: z
    .string({ required_error: "Email is required." })
    .min(1, "Email address is required.")
    .transform(normalizeEmail)
    .pipe(z.string().email("Please enter a valid email address (e.g. name@example.com).")),
  password: z
    .string({ required_error: "Password is required." })
    .min(1, "Password is required.")
    .transform(cleanAuthText)
    .pipe(z.string().min(6, "Password must be at least 6 characters."))
});

export const passwordResetSchema = z.object({
  email: z
    .string({ required_error: "Email is required." })
    .min(1, "Email address is required.")
    .transform(normalizeEmail)
    .pipe(z.string().email("Please enter a valid email address (e.g. name@example.com)."))
});

export type LoginFormValues = z.input<typeof loginSchema>;
export type RegisterFormValues = z.input<typeof registerSchema>;
export type PasswordResetFormValues = z.input<typeof passwordResetSchema>;
