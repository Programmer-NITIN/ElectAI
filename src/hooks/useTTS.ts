/**
 * Text-to-Speech hook using Cloud TTS with browser Web Speech API fallback.
 * @module hooks/useTTS
 */

"use client";

import { useState, useCallback } from "react";

/** TTS hook state and controls. */
export function useTTS() {
  const [isSpeaking, setIsSpeaking] = useState(false);

  /** Speak text using the browser Web Speech API. */
  const speak = useCallback((text: string, lang = "en-IN") => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, []);

  /** Stop any ongoing speech. */
  const stop = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return { speak, stop, isSpeaking };
}
