/**
 * Tests for application constants.
 * Validates all constants are defined, correctly typed, and reasonable.
 * @group unit
 */

import {
  RATE_LIMIT_WINDOW_MS, MAX_REQUESTS_PER_WINDOW,
  MAX_MESSAGE_LENGTH, MAX_CONVERSATION_LENGTH, MAX_TTS_LENGTH, MAX_TRANSLATE_LENGTH,
  CHIP_COUNT, SCROLL_DEBOUNCE_MS, ENTRANCE_ANIMATION_DURATION, STAGGER_DELAY, DESKTOP_BREAKPOINT,
  COLLECTION_FEEDBACK, COLLECTION_ANALYTICS, COLLECTION_SESSIONS, COLLECTION_USERS,
  MAX_PAYLOAD_SIZE, MAX_OCR_FILE_SIZE, ALLOWED_IMAGE_TYPES,
  APP_NAME, APP_TAGLINE, APP_DESCRIPTION, APP_URL,
  VERTEX_AI_REGION, GOOGLE_MAPS_EMBED_URL, RECAPTCHA_VERIFY_URL,
} from "@/lib/constants";

describe("Rate Limiting Constants", () => {
  it("should have a 1-minute window", () => {
    expect(RATE_LIMIT_WINDOW_MS).toBe(60_000);
  });
  it("should allow 30 requests per window", () => {
    expect(MAX_REQUESTS_PER_WINDOW).toBe(30);
  });
});

describe("Chat Constraints", () => {
  it("should limit message length to 2000 chars", () => {
    expect(MAX_MESSAGE_LENGTH).toBe(2000);
  });
  it("should limit conversation to 50 messages", () => {
    expect(MAX_CONVERSATION_LENGTH).toBe(50);
  });
  it("should limit TTS to 1000 chars", () => {
    expect(MAX_TTS_LENGTH).toBe(1000);
  });
  it("should limit translation to 5000 chars", () => {
    expect(MAX_TRANSLATE_LENGTH).toBe(5000);
  });
});

describe("UI Configuration", () => {
  it("should show 5 suggestion chips", () => {
    expect(CHIP_COUNT).toBe(5);
  });
  it("should have scroll debounce of 100ms", () => {
    expect(SCROLL_DEBOUNCE_MS).toBe(100);
  });
  it("should have entrance animation of 0.4s", () => {
    expect(ENTRANCE_ANIMATION_DURATION).toBe(0.4);
  });
  it("should have stagger delay of 0.08s", () => {
    expect(STAGGER_DELAY).toBe(0.08);
  });
  it("should set desktop breakpoint at 768px", () => {
    expect(DESKTOP_BREAKPOINT).toBe(768);
  });
});

describe("Firebase Collections", () => {
  it("should have correct collection names", () => {
    expect(COLLECTION_FEEDBACK).toBe("feedback");
    expect(COLLECTION_ANALYTICS).toBe("daily_analytics");
    expect(COLLECTION_SESSIONS).toBe("sessions");
    expect(COLLECTION_USERS).toBe("users");
  });
});

describe("Input Validation", () => {
  it("should set max payload to 1MB", () => {
    expect(MAX_PAYLOAD_SIZE).toBe(1_048_576);
  });
  it("should set max OCR file size to 5MB", () => {
    expect(MAX_OCR_FILE_SIZE).toBe(5_242_880);
  });
  it("should allow jpeg, png, webp for OCR", () => {
    expect(ALLOWED_IMAGE_TYPES).toContain("image/jpeg");
    expect(ALLOWED_IMAGE_TYPES).toContain("image/png");
    expect(ALLOWED_IMAGE_TYPES).toContain("image/webp");
    expect(ALLOWED_IMAGE_TYPES).toHaveLength(3);
  });
});

describe("SEO & Metadata", () => {
  it("should have app name and tagline", () => {
    expect(APP_NAME).toBe("ElectAI");
    expect(APP_TAGLINE.length).toBeGreaterThan(5);
    expect(APP_DESCRIPTION.length).toBeGreaterThan(20);
  });
  it("should have a valid URL", () => {
    expect(APP_URL).toMatch(/^https:\/\//);
  });
});

describe("Google Services Config", () => {
  it("should default Vertex region to asia-south1", () => {
    expect(VERTEX_AI_REGION).toBe("asia-south1");
  });
  it("should have Google Maps embed URL", () => {
    expect(GOOGLE_MAPS_EMBED_URL).toContain("google.com/maps/embed");
  });
  it("should have reCAPTCHA verify URL", () => {
    expect(RECAPTCHA_VERIFY_URL).toContain("recaptcha");
  });
});
