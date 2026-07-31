/**
 * Security utilities for input sanitization and XSS protection.
 */

/** Strips HTML tags and dangerous characters to prevent XSS */
export function stripHtml(input: string): string {
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "")
    .replace(/data:/gi, "")
    .replace(/vbscript:/gi, "");
}

/** Escapes special HTML characters */
export function escapeHtml(input: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;"
  };
  return input.replace(/[&<>"'/]/g, (char) => map[char] || char);
}

/** Normalizes and sanitizes email addresses */
export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase().replace(/[<>"';&]/g, "");
}

/** Sanitizes display names: strips HTML, collapses whitespace, limits length */
export function cleanDisplayName(value: string): string {
  return stripHtml(value)
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}

/** Sanitizes auth text inputs: strips HTML and trims */
export function cleanAuthText(value: string): string {
  return stripHtml(value).trim();
}

/** Sanitizes general text inputs for resume fields */
export function cleanTextInput(value: string): string {
  return stripHtml(value).replace(/\s+/g, " ").trim();
}

/** Sanitizes text area inputs (allows newlines) */
export function cleanTextArea(value: string): string {
  return stripHtml(value).trim();
}

/** Validates that a string contains no suspicious patterns */
export function isSafeInput(value: string): boolean {
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /data:text\/html/i,
    /vbscript:/i,
    /expression\s*\(/i,
    /url\s*\(/i,
    /import\s*\(/i
  ];
  return !dangerousPatterns.some((pattern) => pattern.test(value));
}
