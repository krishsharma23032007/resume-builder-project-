/**
 * Server-side input validation middleware.
 * Validates request bodies against expected schemas.
 */

const MAX_STRING_LENGTH = 10000;
const MAX_ARRAY_LENGTH = 100;

/**
 * Validates that a value is a non-empty string within length limits.
 */
function validateString(value, name, { required = true, minLength = 1, maxLength = MAX_STRING_LENGTH } = {}) {
  if (value === undefined || value === null) {
    if (required) return `${name} is required.`;
    return null;
  }

  if (typeof value !== "string") {
    return `${name} must be a string.`;
  }

  if (value.trim().length < minLength) {
    return `${name} must be at least ${minLength} characters.`;
  }

  if (value.length > maxLength) {
    return `${name} must be ${maxLength} characters or less.`;
  }

  return null;
}

/**
 * Validates that a value is an object.
 */
function validateObject(value, name, { required = true } = {}) {
  if (value === undefined || value === null) {
    if (required) return `${name} is required.`;
    return null;
  }

  if (typeof value !== "object" || Array.isArray(value)) {
    return `${name} must be an object.`;
  }

  return null;
}

/**
 * Validates that a value is one of the allowed values.
 */
function validateEnum(value, name, allowedValues, { required = true } = {}) {
  if (value === undefined || value === null) {
    if (required) return `${name} is required.`;
    return null;
  }

  if (!allowedValues.includes(value)) {
    return `${name} must be one of: ${allowedValues.join(", ")}.`;
  }

  return null;
}

/**
 * Middleware factory that validates req.body against a schema.
 * Schema is an object where keys are field names and values are validation functions.
 */
function validateBody(schema) {
  return (req, res, next) => {
    const errors = [];

    for (const [field, validator] of Object.entries(schema)) {
      const error = validator(req.body[field]);
      if (error) {
        errors.push(error);
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({ error: errors.join(" ") });
    }

    next();
  };
}

module.exports = {
  validateString,
  validateObject,
  validateEnum,
  validateBody
};
