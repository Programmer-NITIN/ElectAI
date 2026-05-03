/**
 * Google Cloud Text-to-Speech API wrapper for ElectAI.
 * Converts AI responses to natural speech in Indian languages.
 * Falls back to browser Web Speech API when Cloud TTS is unavailable.
 * @module google/tts
 */

import { logger } from "../logger";
import { MAX_TTS_LENGTH } from "../constants";

/** Whether Cloud TTS is available. */
export function isTTSAvailable(): boolean {
  return Boolean(process.env.GOOGLE_APPLICATION_CREDENTIALS);
}

/** Voice configuration per language. */
const VOICE_MAP: Record<string, { languageCode: string; name: string }> = {
  en: { languageCode: "en-IN", name: "en-IN-Neural2-A" },
  hi: { languageCode: "hi-IN", name: "hi-IN-Neural2-A" },
  mr: { languageCode: "mr-IN", name: "mr-IN-Standard-A" },
};

/**
 * Synthesizes speech from text using Google Cloud TTS.
 * @param text - Text to convert to speech
 * @param language - Language code (en, hi, mr)
 * @returns Base64-encoded audio content, or null on failure
 */
export async function synthesizeSpeech(text: string, language = "en"): Promise<string | null> {
  if (!text || text.length > MAX_TTS_LENGTH) return null;
  if (!isTTSAvailable()) {
    logger.warn("Cloud TTS not configured", { component: "tts" });
    return null;
  }

  try {
    const { TextToSpeechClient } = await import("@google-cloud/text-to-speech");
    const client = new TextToSpeechClient();
    const voice = VOICE_MAP[language] || VOICE_MAP.en;

    const [response] = await client.synthesizeSpeech({
      input: { text },
      voice: { languageCode: voice.languageCode, name: voice.name },
      audioConfig: { audioEncoding: "MP3", speakingRate: 1.0, pitch: 0 },
    });

    logger.info("TTS synthesis completed", {
      component: "tts",
      language,
      textLength: text.length,
    });

    return response.audioContent
      ? Buffer.from(response.audioContent as Uint8Array).toString("base64")
      : null;
  } catch (error) {
    logger.error("TTS synthesis failed", {
      component: "tts",
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return null;
  }
}
