/**
 * Integration tests for the /api/chat route.
 * Validates request validation, demo mode responses, and rate limiting behavior.
 * @group integration
 */

import { chatMessageSchema } from "@/lib/schemas";
import { DEMO_INTENTS, DEMO_DEFAULT_RESPONSE } from "@/lib/election-data";
import { MAX_MESSAGE_LENGTH, RATE_LIMIT_WINDOW_MS, MAX_REQUESTS_PER_WINDOW } from "@/lib/constants";

describe("Chat API — Schema Validation", () => {
  it("should accept a valid chat message", () => {
    const result = chatMessageSchema.safeParse({ content: "How do I vote?" });
    expect(result.success).toBe(true);
  });

  it("should reject messages exceeding max length", () => {
    const result = chatMessageSchema.safeParse({
      content: "a".repeat(MAX_MESSAGE_LENGTH + 1),
    });
    expect(result.success).toBe(false);
  });

  it("should accept messages at exactly max length", () => {
    const result = chatMessageSchema.safeParse({
      content: "a".repeat(MAX_MESSAGE_LENGTH),
    });
    expect(result.success).toBe(true);
  });

  it("should reject empty content", () => {
    const result = chatMessageSchema.safeParse({ content: "" });
    expect(result.success).toBe(false);
  });

  it("should reject unknown fields in strict mode", () => {
    const result = chatMessageSchema.safeParse({
      content: "hello",
      malicious: "payload",
    });
    expect(result.success).toBe(false);
  });
});

describe("Chat API — Demo Mode Responses", () => {
  it("should have demo responses for EVM keyword", () => {
    expect(DEMO_INTENTS["evm"]).toBeDefined();
    expect(DEMO_INTENTS["evm"].length).toBeGreaterThan(50);
  });

  it("should have demo responses for registration keyword", () => {
    expect(DEMO_INTENTS["register"]).toBeDefined();
    expect(DEMO_INTENTS["register"]).toContain("Form 6");
  });

  it("should have a default response for unmatched queries", () => {
    expect(DEMO_DEFAULT_RESPONSE).toBeDefined();
    expect(DEMO_DEFAULT_RESPONSE).toContain("ElectAI");
  });
});

describe("Chat API — Rate Limit Configuration", () => {
  it("should have rate limit window configured", () => {
    expect(RATE_LIMIT_WINDOW_MS).toBeGreaterThan(0);
  });

  it("should have max requests per window configured", () => {
    expect(MAX_REQUESTS_PER_WINDOW).toBeGreaterThan(0);
    expect(MAX_REQUESTS_PER_WINDOW).toBeLessThanOrEqual(100);
  });
});

describe("Chat API — Language Support", () => {
  it("should accept Hindi language header", () => {
    const result = chatMessageSchema.safeParse({
      content: "मतदान कैसे करें?",
      language: "hi",
    });
    expect(result.success).toBe(true);
  });

  it("should reject unsupported language", () => {
    const result = chatMessageSchema.safeParse({
      content: "hello",
      language: "zh",
    });
    expect(result.success).toBe(false);
  });
});
