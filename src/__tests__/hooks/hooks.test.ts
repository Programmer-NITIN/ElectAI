/**
 * Tests for custom React hooks.
 * Validates useAnalytics, useTTS, and useVoiceInput behavior.
 * @group hooks
 */

import { renderHook, act } from "@testing-library/react";
import { useTTS } from "@/hooks/useTTS";
import { useVoiceInput } from "@/hooks/useVoiceInput";

// Mock analytics module to avoid Firebase import chain
jest.mock("@/lib/analytics", () => ({
  analyticsEvents: {
    chatMessage: jest.fn(),
    toolUsed: jest.fn(),
    voiceInput: jest.fn(),
    ttsPlayed: jest.fn(),
    languageChanged: jest.fn(),
    error: jest.fn(),
    pageView: jest.fn(),
    sessionStart: jest.fn(),
    feedbackGiven: jest.fn(),
    imageUploaded: jest.fn(),
  },
}));

// Import useAnalytics AFTER the mock is set up
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { useAnalytics } = require("@/hooks/useAnalytics");

// ── useAnalytics Tests ────────────────────────────────────────────────

describe("useAnalytics", () => {
  it("should return all tracking functions", () => {
    const { result } = renderHook(() => useAnalytics());
    expect(result.current.trackChatMessage).toBeDefined();
    expect(result.current.trackToolUsed).toBeDefined();
    expect(result.current.trackVoiceInput).toBeDefined();
    expect(result.current.trackTTSPlayed).toBeDefined();
    expect(result.current.trackLanguageChanged).toBeDefined();
  });

  it("should return stable function references across renders", () => {
    const { result, rerender } = renderHook(() => useAnalytics());
    const firstRender = { ...result.current };
    rerender();
    expect(result.current.trackChatMessage).toBe(firstRender.trackChatMessage);
    expect(result.current.trackToolUsed).toBe(firstRender.trackToolUsed);
  });

  it("should not throw when calling trackChatMessage", () => {
    const { result } = renderHook(() => useAnalytics());
    expect(() => result.current.trackChatMessage("en")).not.toThrow();
  });

  it("should not throw when calling trackToolUsed", () => {
    const { result } = renderHook(() => useAnalytics());
    expect(() => result.current.trackToolUsed("evm_simulator")).not.toThrow();
  });

  it("should not throw when calling trackVoiceInput", () => {
    const { result } = renderHook(() => useAnalytics());
    expect(() => result.current.trackVoiceInput()).not.toThrow();
  });

  it("should not throw when calling trackLanguageChanged", () => {
    const { result } = renderHook(() => useAnalytics());
    expect(() => result.current.trackLanguageChanged("hi")).not.toThrow();
  });
});

// ── useTTS Tests ──────────────────────────────────────────────────────

describe("useTTS", () => {
  it("should initialize with isSpeaking = false", () => {
    const { result } = renderHook(() => useTTS());
    expect(result.current.isSpeaking).toBe(false);
  });

  it("should provide speak and stop functions", () => {
    const { result } = renderHook(() => useTTS());
    expect(typeof result.current.speak).toBe("function");
    expect(typeof result.current.stop).toBe("function");
  });

  it("should call speechSynthesis.cancel on stop", () => {
    const { result } = renderHook(() => useTTS());
    act(() => {
      result.current.stop();
    });
    expect(window.speechSynthesis.cancel).toHaveBeenCalled();
  });

  it("should call speechSynthesis.speak on speak", () => {
    const { result } = renderHook(() => useTTS());
    act(() => {
      result.current.speak("Hello world");
    });
    expect(window.speechSynthesis.speak).toHaveBeenCalled();
  });

  it("should call speechSynthesis.cancel before speaking", () => {
    const { result } = renderHook(() => useTTS());
    act(() => {
      result.current.speak("Test");
    });
    expect(window.speechSynthesis.cancel).toHaveBeenCalled();
  });
});

// ── useVoiceInput Tests ───────────────────────────────────────────────

describe("useVoiceInput", () => {
  it("should initialize with isListening = false", () => {
    const onResult = jest.fn();
    const { result } = renderHook(() => useVoiceInput(onResult));
    expect(result.current.isListening).toBe(false);
  });

  it("should provide startListening and stopListening functions", () => {
    const onResult = jest.fn();
    const { result } = renderHook(() => useVoiceInput(onResult));
    expect(typeof result.current.startListening).toBe("function");
    expect(typeof result.current.stopListening).toBe("function");
  });

  it("should set isListening to true when started", () => {
    const onResult = jest.fn();
    const { result } = renderHook(() => useVoiceInput(onResult));
    act(() => {
      result.current.startListening("en-IN");
    });
    expect(result.current.isListening).toBe(true);
  });

  it("should set isListening to false when stopped", () => {
    const onResult = jest.fn();
    const { result } = renderHook(() => useVoiceInput(onResult));
    act(() => {
      result.current.startListening("en-IN");
    });
    act(() => {
      result.current.stopListening();
    });
    expect(result.current.isListening).toBe(false);
  });
});
