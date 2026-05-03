/**
 * Tests for Vertex AI connection helper.
 * @group unit
 */

import {
  isVertexConfigured,
  isAIConfigured,
  getProviderName,
  getVertexConfig,
} from "@/lib/google/vertex";
import { logger } from "@/lib/logger";

describe("Vertex AI Helper", () => {
  const originalEnv = process.env;

  beforeEach(() => {
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

  it("should parse GOOGLE_SERVICE_ACCOUNT_KEY if present", () => {
    process.env.GOOGLE_SERVICE_ACCOUNT_KEY = JSON.stringify({ type: "service_account" });
    const config = getVertexConfig();
    expect(config.credentials).toEqual({ type: "service_account" });
  });

  it("should log error if GOOGLE_SERVICE_ACCOUNT_KEY is invalid JSON", () => {
    process.env.GOOGLE_SERVICE_ACCOUNT_KEY = "invalid-json";
    const loggerSpy = jest.spyOn(logger, "error").mockImplementation(() => {});

    const config = getVertexConfig();
    expect(config.credentials).toBeUndefined();
    expect(loggerSpy).toHaveBeenCalledWith(
      "Failed to parse service account key",
      expect.objectContaining({ component: "vertex", error: expect.any(String) }),
    );

    loggerSpy.mockRestore();
  });

  it("should handle non-Error thrown during JSON parse", () => {
    process.env.GOOGLE_SERVICE_ACCOUNT_KEY = "{}";
    const jsonSpy = jest.spyOn(JSON, "parse").mockImplementationOnce(() => {
      throw "String error";
    });
    const loggerSpy = jest.spyOn(logger, "error").mockImplementation(() => {});

    getVertexConfig();
    expect(loggerSpy).toHaveBeenCalledWith(
      "Failed to parse service account key",
      expect.objectContaining({ error: "Invalid JSON" }),
    );

    jsonSpy.mockRestore();
    loggerSpy.mockRestore();
  });

  it("should return false for isVertexConfigured if only project is set", () => {
    process.env.GOOGLE_VERTEX_PROJECT = "test";
    delete process.env.GOOGLE_VERTEX_LOCATION;
    expect(isVertexConfigured()).toBe(false);
  });

  it("should return false for isVertexConfigured if only location is set", () => {
    delete process.env.GOOGLE_VERTEX_PROJECT;
    process.env.GOOGLE_VERTEX_LOCATION = "test";
    expect(isVertexConfigured()).toBe(false);
  });

  it("should return 'Google Vertex AI' when vertex is configured", () => {
    process.env.GOOGLE_VERTEX_PROJECT = "test";
    process.env.GOOGLE_VERTEX_LOCATION = "test";
    expect(getProviderName()).toBe("Google Vertex AI");
  });
});
