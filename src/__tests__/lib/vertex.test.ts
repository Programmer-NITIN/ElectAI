/**
 * Tests for Vertex AI connection helper.
 * @group unit
 */

import { isVertexConfigured, isAIConfigured, getProviderName, getVertexConfig } from "@/lib/google/vertex";

describe("Vertex AI Helper", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("should return false for isVertexConfigured without env vars", () => {
    delete process.env.GOOGLE_VERTEX_PROJECT;
    delete process.env.GOOGLE_VERTEX_LOCATION;
    expect(isVertexConfigured()).toBe(false);
  });

  it("should return false for isAIConfigured without any env vars", () => {
    delete process.env.GOOGLE_VERTEX_PROJECT;
    delete process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    expect(isAIConfigured()).toBe(false);
  });

  it("should return 'Demo Mode' when no provider configured", () => {
    delete process.env.GOOGLE_VERTEX_PROJECT;
    delete process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    expect(getProviderName()).toBe("Demo Mode (No API Key)");
  });

  it("should return Vertex AI config with default region", () => {
    const config = getVertexConfig();
    expect(config.location).toBe("asia-south1");
  });

  it("should return AI Studio when only API key is set", () => {
    delete process.env.GOOGLE_VERTEX_PROJECT;
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = "test-key";
    expect(getProviderName()).toBe("Google AI Studio");
    expect(isAIConfigured()).toBe(true);
  });
});
