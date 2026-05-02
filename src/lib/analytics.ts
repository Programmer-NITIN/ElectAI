/**
 * Google Analytics 4 event tracking for ElectAI.
 * Wraps gtag calls with type safety and graceful fallback.
 * @module analytics
 */

import { getAnalyticsInstance } from "./firebase";
import { logEvent } from "firebase/analytics";

/**
 * Tracks a custom event in Google Analytics 4.
 * @param eventName - The event name
 * @param params - Optional event parameters
 */
export async function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>,
): Promise<void> {
  try {
    const analytics = await getAnalyticsInstance();
    if (analytics) {
      logEvent(analytics, eventName, params);
    }
  } catch {
    // Analytics is non-critical — silently ignore errors
  }
}

/** Pre-defined event helpers for common actions. */
export const analyticsEvents = {
  chatMessage: (language: string) => trackEvent("chat_message", { language }),
  toolUsed: (toolName: string) => trackEvent("tool_used", { tool: toolName }),
  voiceInput: () => trackEvent("voice_input_used"),
  ttsPlayed: () => trackEvent("tts_played"),
  languageChanged: (lang: string) => trackEvent("language_changed", { language: lang }),
  themeToggled: (theme: string) => trackEvent("theme_toggled", { theme }),
  feedbackGiven: (rating: string) => trackEvent("feedback_given", { rating }),
  ocrUsed: () => trackEvent("ocr_used"),
  boothSearch: (state: string) => trackEvent("booth_search", { state }),
  pageView: (page: string) => trackEvent("page_view", { page_title: page }),
} as const;
