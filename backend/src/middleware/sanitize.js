/**
 * Server-side input sanitization middleware.
 * Strips HTML tags and dangerous patterns from request body strings.
 */

const DANGEROUS_PATTERNS = [
  /<[^>]*>/g,           // HTML tags
  /javascript:/gi,      // javascript: protocol
  /on\w+\s*=/gi,        // event handlers
  /data:text\/html/gi,  // data URIs
  /vbscript:/gi,        // vbscript protocol
  /expression\s*\(/gi,  // CSS expression
  /import\s*\(/gi       // dynamic imports
];

function sanitizeString(value) {
  if (typeof value !== "string") return value;

  let sanitized = value;
  for (const pattern of DANGEROUS_PATTERNS) {
    sanitized = sanitized.replace(pattern, "");
  }
  return sanitized.trim();
}

function sanitizeObject(obj) {
  if (typeof obj === "string") {
    return sanitizeString(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  if (obj && typeof obj === "object") {
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = sanitizeObject(value);
    }
    return sanitized;
  }

  return obj;
}

/**
 * Express middleware that sanitizes req.body strings.
 */
function sanitizeInput(req, res, next) {
  if (req.body && typeof req.body === "object") {
    req.body = sanitizeObject(req.body);
  }
  next();
}

module.exports = sanitizeInput;
