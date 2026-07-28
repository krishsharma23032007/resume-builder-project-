export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function cleanDisplayName(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

export function cleanAuthText(value: string) {
  return value.trim();
}
