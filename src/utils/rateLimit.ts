/**
 * Client-side rate limiting for authentication attempts.
 * Tracks failed attempts per email and blocks after threshold.
 */

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const ATTEMPT_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

type AttemptRecord = {
  count: number;
  firstAttemptAt: number;
  lockedUntil: number | null;
};

const attempts = new Map<string, AttemptRecord>();

/**
 * Checks if the given email is rate-limited.
 * Returns { blocked: true, retryAfterSeconds } if blocked, { blocked: false } otherwise.
 */
export function checkRateLimit(email: string): { blocked: boolean; retryAfterSeconds?: number } {
  const key = email.toLowerCase();
  const record = attempts.get(key);

  if (!record) {
    return { blocked: false };
  }

  // Check if lockout has expired
  if (record.lockedUntil && Date.now() > record.lockedUntil) {
    attempts.delete(key);
    return { blocked: false };
  }

  // Check if currently locked
  if (record.lockedUntil) {
    const retryAfterSeconds = Math.ceil((record.lockedUntil - Date.now()) / 1000);
    return { blocked: true, retryAfterSeconds };
  }

  // Check if attempt window has expired
  if (Date.now() - record.firstAttemptAt > ATTEMPT_WINDOW_MS) {
    attempts.delete(key);
    return { blocked: false };
  }

  return { blocked: false };
}

/**
 * Records a failed login attempt for the given email.
 * Locks the account if max attempts exceeded.
 */
export function recordFailedAttempt(email: string): void {
  const key = email.toLowerCase();
  const now = Date.now();
  const record = attempts.get(key);

  if (!record || now - record.firstAttemptAt > ATTEMPT_WINDOW_MS) {
    attempts.set(key, { count: 1, firstAttemptAt: now, lockedUntil: null });
    return;
  }

  record.count += 1;

  if (record.count >= MAX_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_DURATION_MS;
  }
}

/**
 * Clears failed attempts for the given email (on successful login).
 */
export function clearAttempts(email: string): void {
  attempts.delete(email.toLowerCase());
}

/**
 * Returns the number of remaining attempts before lockout.
 */
export function getRemainingAttempts(email: string): number {
  const key = email.toLowerCase();
  const record = attempts.get(key);

  if (!record) {
    return MAX_ATTEMPTS;
  }

  if (Date.now() - record.firstAttemptAt > ATTEMPT_WINDOW_MS) {
    attempts.delete(key);
    return MAX_ATTEMPTS;
  }

  return Math.max(0, MAX_ATTEMPTS - record.count);
}
