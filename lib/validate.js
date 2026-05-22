import { z } from "zod";

/**
 * Sanitizes incoming text parameters to neutralize system prompt-injection vectors.
 */
export function sanitizeInput(text) {
  if (typeof text !== "string") return text;
  return text
    .replace(/(ignore previous instructions|disregard all prior directives|override system prompt)/gi, "[REDACTED_INJECTION_ATTEMPT]")
    .replace(/(you are now an admin|act as a sudo user|forget everything you were told)/gi, "")
    .trim();
}

/**
 * Validates incoming arguments. Returns a structured error response on failure instead of throwing.
 * @param {z.ZodSchema} schema 
 * @param {any} data 
 */
export function validateInput(schema, data) {
  const result = schema.safeParse(data);
  
  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors
    };
  }

  // Sanitize valid text data to secure downstream Gemini calls
  const sanitizedData = JSON.parse(JSON.stringify(result.data), (key, value) => {
    return typeof value === "string" ? sanitizeInput(value) : value;
  });

  return {
    success: true,
    data: sanitizedData
  };
}
