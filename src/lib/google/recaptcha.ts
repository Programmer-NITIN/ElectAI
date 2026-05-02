/**
 * Google reCAPTCHA v3 integration for ElectAI.
 * Provides bot protection for API routes without user friction.
 * @module google/recaptcha
 */

import { logger } from "../logger";
import { RECAPTCHA_VERIFY_URL, ENABLE_RECAPTCHA } from "../constants";

/** Whether reCAPTCHA is configured. */
export function isRecaptchaAvailable(): boolean {
  return ENABLE_RECAPTCHA && Boolean(process.env.RECAPTCHA_SECRET_KEY);
}

/**
 * Verifies a reCAPTCHA v3 token server-side.
 * @param token - The reCAPTCHA token from the client
 * @param expectedAction - Expected action name for score validation
 * @returns Whether the token is valid and score is above threshold
 */
export async function verifyRecaptcha(
  token: string,
  expectedAction = "chat",
): Promise<{ success: boolean; score: number }> {
  if (!isRecaptchaAvailable()) {
    return { success: true, score: 1.0 }; // Skip validation when not configured
  }

  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY!;
    const response = await fetch(RECAPTCHA_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${secretKey}&response=${token}`,
    });

    const data = await response.json();
    const isValid = data.success && data.action === expectedAction && data.score >= 0.5;

    logger.info("reCAPTCHA verification", {
      component: "recaptcha",
      success: isValid,
      score: data.score,
      action: data.action,
    });

    return { success: isValid, score: data.score || 0 };
  } catch (error) {
    logger.error("reCAPTCHA verification failed", {
      component: "recaptcha",
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return { success: false, score: 0 };
  }
}
