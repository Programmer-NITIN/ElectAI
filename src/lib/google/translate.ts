/**
 * Google Cloud Translation API wrapper for ElectAI.
 * Translates text between 22 Indian languages using the Cloud Translation API.
 * Falls back gracefully when API is unavailable.
 * @module google/translate
 */

import { logger } from "../logger";
import { MAX_TRANSLATE_LENGTH } from "../constants";

/** Supported languages for translation. */
export const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi" },
  { code: "mr", name: "Marathi" },
  { code: "ta", name: "Tamil" },
  { code: "te", name: "Telugu" },
  { code: "bn", name: "Bengali" },
  { code: "gu", name: "Gujarati" },
  { code: "kn", name: "Kannada" },
  { code: "ml", name: "Malayalam" },
  { code: "pa", name: "Punjabi" },
  { code: "ur", name: "Urdu" },
  { code: "or", name: "Odia" },
] as const;

/** Whether the Cloud Translation API is available. */
export function isTranslateAvailable(): boolean {
  return Boolean(process.env.GOOGLE_CLOUD_PROJECT || process.env.GOOGLE_TRANSLATE_API_KEY);
}

/**
 * Translates text using Google Cloud Translation API.
 * @param text - Source text to translate
 * @param targetLang - Target language code
 * @param sourceLang - Source language code (auto-detected if omitted)
 * @returns Translated text, or original text on failure
 */
export async function translateText(
  text: string,
  targetLang: string,
  sourceLang?: string,
): Promise<string> {
  if (!text || text.length > MAX_TRANSLATE_LENGTH) return text;
  if (!isTranslateAvailable()) {
    logger.warn("Cloud Translation not configured, returning original text", {
      component: "translate",
    });
    return text;
  }

  try {
    const { Translate } = await import("@google-cloud/translate").then((m) => m.v2);
    const translate = new Translate({
      projectId: process.env.GOOGLE_CLOUD_PROJECT,
      key: process.env.GOOGLE_TRANSLATE_API_KEY,
    });

    const [translation] = await translate.translate(text, {
      from: sourceLang,
      to: targetLang,
    });

    logger.info("Translation completed", {
      component: "translate",
      targetLang,
      inputLength: text.length,
    });

    return translation;
  } catch (error) {
    logger.error("Translation failed", {
      component: "translate",
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return text;
  }
}
