/**
 * Tests for Google Cloud service wrappers.
 * Validates availability checks, input validation, and graceful fallbacks.
 * @group google-services
 */

import { isMapsAvailable, getMapEmbedUrl, getDirectionsUrl, getStaticMapUrl } from "@/lib/google/maps";
import { isRecaptchaAvailable } from "@/lib/google/recaptcha";
import { isTranslateAvailable, SUPPORTED_LANGUAGES, translateText } from "@/lib/google/translate";
import { isTTSAvailable } from "@/lib/google/tts";
import { isVisionAvailable, extractVoterIdText } from "@/lib/google/vision";
import { isCloudLoggingAvailable } from "@/lib/google/logging";

// ── Maps Tests ────────────────────────────────────────────────────────

describe("Google Maps", () => {
  it("isMapsAvailable should return a boolean", () => {
    expect(typeof isMapsAvailable()).toBe("boolean");
  });

  it("getMapEmbedUrl should return null without API key", () => {
    const original = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    delete process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    expect(getMapEmbedUrl("Polling booth Mumbai")).toBeNull();
    if (original) process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = original;
  });

  it("getMapEmbedUrl should return valid URL with API key", () => {
    const original = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = "test-key";
    const url = getMapEmbedUrl("Polling booth Mumbai");
    expect(url).toContain("https://www.google.com/maps/embed/v1/search");
    expect(url).toContain("key=test-key");
    expect(url).toContain("q=Polling%20booth%20Mumbai");
    if (original) process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = original;
    else delete process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  });

  it("getDirectionsUrl should encode destination", () => {
    const url = getDirectionsUrl("Andheri East, Mumbai");
    expect(url).toContain("https://www.google.com/maps/dir/");
    expect(url).toContain("destination=Andheri%20East%2C%20Mumbai");
  });

  it("getStaticMapUrl should return null without API key", () => {
    const original = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    delete process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    expect(getStaticMapUrl(19.1136, 72.8697)).toBeNull();
    if (original) process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = original;
  });

  it("getStaticMapUrl should return valid URL with API key", () => {
    const original = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = "test-key";
    const url = getStaticMapUrl(19.1136, 72.8697, 14);
    expect(url).toContain("center=19.1136,72.8697");
    expect(url).toContain("zoom=14");
    expect(url).toContain("key=test-key");
    if (original) process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = original;
    else delete process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  });

  it("getStaticMapUrl should use default zoom of 15", () => {
    const original = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = "test-key";
    const url = getStaticMapUrl(19.0, 72.0);
    expect(url).toContain("zoom=15");
    if (original) process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = original;
    else delete process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  });
});

// ── reCAPTCHA Tests ───────────────────────────────────────────────────

describe("Google reCAPTCHA", () => {
  it("isRecaptchaAvailable should return false without env vars", () => {
    const original = process.env.RECAPTCHA_SECRET_KEY;
    delete process.env.RECAPTCHA_SECRET_KEY;
    expect(isRecaptchaAvailable()).toBe(false);
    if (original) process.env.RECAPTCHA_SECRET_KEY = original;
  });

  it("isRecaptchaAvailable should return a boolean", () => {
    expect(typeof isRecaptchaAvailable()).toBe("boolean");
  });
});

// ── Translation Tests ─────────────────────────────────────────────────

describe("Google Translate", () => {
  it("isTranslateAvailable should return a boolean", () => {
    expect(typeof isTranslateAvailable()).toBe("boolean");
  });

  it("SUPPORTED_LANGUAGES should have at least 10 languages", () => {
    expect(SUPPORTED_LANGUAGES.length).toBeGreaterThanOrEqual(10);
  });

  it("SUPPORTED_LANGUAGES should include English and Hindi", () => {
    const codes = SUPPORTED_LANGUAGES.map((l) => l.code);
    expect(codes).toContain("en");
    expect(codes).toContain("hi");
  });

  it("each language should have code and name", () => {
    for (const lang of SUPPORTED_LANGUAGES) {
      expect(lang.code).toBeTruthy();
      expect(lang.name).toBeTruthy();
    }
  });

  it("translateText should return original text when service unavailable", async () => {
    const origProject = process.env.GOOGLE_CLOUD_PROJECT;
    const origKey = process.env.GOOGLE_TRANSLATE_API_KEY;
    delete process.env.GOOGLE_CLOUD_PROJECT;
    delete process.env.GOOGLE_TRANSLATE_API_KEY;
    const result = await translateText("Hello", "hi");
    expect(result).toBe("Hello");
    if (origProject) process.env.GOOGLE_CLOUD_PROJECT = origProject;
    if (origKey) process.env.GOOGLE_TRANSLATE_API_KEY = origKey;
  });

  it("translateText should return original text for empty input", async () => {
    const result = await translateText("", "hi");
    expect(result).toBe("");
  });

  it("translateText should return original text for oversized input", async () => {
    const longText = "a".repeat(5001);
    const result = await translateText(longText, "hi");
    expect(result).toBe(longText);
  });
});

// ── TTS Tests ─────────────────────────────────────────────────────────

describe("Google TTS", () => {
  it("isTTSAvailable should return a boolean", () => {
    expect(typeof isTTSAvailable()).toBe("boolean");
  });

  it("isTTSAvailable should return false without credentials", () => {
    const original = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    delete process.env.GOOGLE_APPLICATION_CREDENTIALS;
    expect(isTTSAvailable()).toBe(false);
    if (original) process.env.GOOGLE_APPLICATION_CREDENTIALS = original;
  });
});

// ── Vision (OCR) Tests ────────────────────────────────────────────────

describe("Google Cloud Vision", () => {
  it("isVisionAvailable should return a boolean", () => {
    expect(typeof isVisionAvailable()).toBe("boolean");
  });

  it("isVisionAvailable should return false without credentials", () => {
    const origCreds = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    const origProject = process.env.GOOGLE_CLOUD_PROJECT;
    delete process.env.GOOGLE_APPLICATION_CREDENTIALS;
    delete process.env.GOOGLE_CLOUD_PROJECT;
    expect(isVisionAvailable()).toBe(false);
    if (origCreds) process.env.GOOGLE_APPLICATION_CREDENTIALS = origCreds;
    if (origProject) process.env.GOOGLE_CLOUD_PROJECT = origProject;
  });

  it("should reject invalid image types", async () => {
    const result = await extractVoterIdText(Buffer.from("test"), "application/pdf");
    expect(result.text).toBe("");
    expect(result.confidence).toBe(0);
    expect(result.detectedFields).toEqual({});
  });

  it("should reject oversized images", async () => {
    // Create a buffer larger than 5MB
    const largeBuffer = Buffer.alloc(5_242_881);
    const result = await extractVoterIdText(largeBuffer, "image/jpeg");
    expect(result.text).toBe("");
    expect(result.confidence).toBe(0);
  });

  it("should return empty result when Vision API not configured", async () => {
    const origCreds = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    const origProject = process.env.GOOGLE_CLOUD_PROJECT;
    delete process.env.GOOGLE_APPLICATION_CREDENTIALS;
    delete process.env.GOOGLE_CLOUD_PROJECT;
    const result = await extractVoterIdText(Buffer.from("test-image"), "image/jpeg");
    expect(result.text).toBe("");
    expect(result.confidence).toBe(0);
    if (origCreds) process.env.GOOGLE_APPLICATION_CREDENTIALS = origCreds;
    if (origProject) process.env.GOOGLE_CLOUD_PROJECT = origProject;
  });
});

// ── Cloud Logging Tests ───────────────────────────────────────────────

describe("Google Cloud Logging", () => {
  it("isCloudLoggingAvailable should return a boolean", () => {
    expect(typeof isCloudLoggingAvailable()).toBe("boolean");
  });

  it("isCloudLoggingAvailable should return false without K_SERVICE", () => {
    const original = process.env.K_SERVICE;
    delete process.env.K_SERVICE;
    expect(isCloudLoggingAvailable()).toBe(false);
    if (original) process.env.K_SERVICE = original;
  });
});
