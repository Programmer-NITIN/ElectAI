"use client";

/**
 * Analytics hook for tracking user interactions via GA4.
 * @module hooks/useAnalytics
 */

import { useCallback } from "react";
import { analyticsEvents } from "@/lib/analytics";

/**
 * Hook providing pre-bound analytics event functions.
 * @returns Object with named event tracking functions
 */
export function useAnalytics() {
  const trackChatMessage = useCallback(
    (language: string) => analyticsEvents.chatMessage(language),
    [],
  );
  const trackToolUsed = useCallback(
    (toolName: string) => analyticsEvents.toolUsed(toolName),
    [],
  );
  const trackVoiceInput = useCallback(() => analyticsEvents.voiceInput(), []);
  const trackTTSPlayed = useCallback(() => analyticsEvents.ttsPlayed(), []);
  const trackLanguageChanged = useCallback(
    (lang: string) => analyticsEvents.languageChanged(lang),
    [],
  );

  return {
    trackChatMessage,
    trackToolUsed,
    trackVoiceInput,
    trackTTSPlayed,
    trackLanguageChanged,
  };
}
