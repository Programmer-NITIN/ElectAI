/**
 * @module JestSetup
 * @description Global test setup for ElectAI.
 * Mocks browser APIs that are unavailable in the jsdom test environment:
 * - window.matchMedia (CSS media queries)
 * - IntersectionObserver (scroll-based visibility)
 * - Web Speech API (speech synthesis and recognition)
 * - window.scrollTo (scroll behavior)
 *
 * Guards all window polyfills behind typeof checks so this file
 * can also run in the "node" test environment (used by middleware tests).
 */

import "@testing-library/jest-dom";

// Mock isomorphic-dompurify globally since it uses ESM exports that Jest doesn't natively parse
jest.mock("isomorphic-dompurify", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const dompurify = require("dompurify");
  return dompurify(window);
});

const isBrowser = typeof window !== "undefined";

/* ── window.matchMedia ─────────────────────────────────────────────── */
if (isBrowser) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
}

/* ── IntersectionObserver ──────────────────────────────────────────── */
if (isBrowser) {
  class MockIntersectionObserver {
    readonly root: Element | null = null;
    readonly rootMargin: string = "";
    readonly thresholds: ReadonlyArray<number> = [];
    observe = jest.fn();
    unobserve = jest.fn();
    disconnect = jest.fn();
    takeRecords = jest.fn().mockReturnValue([]);
  }

  Object.defineProperty(window, "IntersectionObserver", {
    writable: true,
    value: MockIntersectionObserver,
  });
}

/* ── Web Speech API: SpeechSynthesis ───────────────────────────────── */
if (isBrowser) {
  Object.defineProperty(window, "speechSynthesis", {
    writable: true,
    value: {
      speak: jest.fn(),
      cancel: jest.fn(),
      pause: jest.fn(),
      resume: jest.fn(),
      getVoices: jest.fn().mockReturnValue([]),
      speaking: false,
      paused: false,
      pending: false,
      onvoiceschanged: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    },
  });
}

/* ── Web Speech API: SpeechRecognition ─────────────────────────────── */
if (isBrowser) {
  class MockSpeechRecognition {
    lang = "en-IN";
    continuous = false;
    interimResults = false;
    onresult: ((event: unknown) => void) | null = null;
    onerror: ((event: unknown) => void) | null = null;
    onend: (() => void) | null = null;
    start = jest.fn();
    stop = jest.fn();
    abort = jest.fn();
  }

  Object.defineProperty(window, "webkitSpeechRecognition", {
    writable: true,
    value: MockSpeechRecognition,
  });

  Object.defineProperty(window, "SpeechRecognition", {
    writable: true,
    value: MockSpeechRecognition,
  });
}

/* ── window.scrollTo ───────────────────────────────────────────────── */
if (isBrowser) {
  Object.defineProperty(window, "scrollTo", {
    writable: true,
    value: jest.fn(),
  });
}

/* ── console.error / console.warn suppression for test environment ──── */
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  // In the test environment, suppress console.error entirely.
  // React 19 emits verbose ErrorBoundary trace logs that cause Jest to mark
  // passing suites as "failed" due to stderr noise. All real validation
  // is done via Jest expect() assertions, not console output.
  console.error = jest.fn();
  console.warn = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});
