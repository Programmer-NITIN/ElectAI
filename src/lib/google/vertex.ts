/**
 * Google Vertex AI connection helper for ElectAI.
 * Manages dual-provider setup: Vertex AI (production) + AI Studio (dev/demo).
 * @module google/vertex
 */

import { logger } from "../logger";
import { VERTEX_AI_REGION } from "../constants";

/** Whether Vertex AI is configured with project and location. */
export function isVertexConfigured(): boolean {
  return Boolean(process.env.GOOGLE_VERTEX_PROJECT && process.env.GOOGLE_VERTEX_LOCATION);
}

/** Whether any AI provider (Vertex or AI Studio) is configured. */
export function isAIConfigured(): boolean {
  return isVertexConfigured() || Boolean(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
}

/**
 * Returns the active AI provider name for health checks and logging.
 * @returns Provider name string
 */
export function getProviderName(): string {
  if (isVertexConfigured()) return "Google Vertex AI";
  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) return "Google AI Studio";
  return "Demo Mode (No API Key)";
}

/**
 * Returns Vertex AI configuration for the Google Cloud client.
 * @returns Configuration object with project, location, and credentials
 */
export function getVertexConfig(): {
  project: string;
  location: string;
  credentials?: Record<string, unknown>;
} {
  const config = {
    project: process.env.GOOGLE_VERTEX_PROJECT || "",
    location: process.env.GOOGLE_VERTEX_LOCATION || VERTEX_AI_REGION,
  };

  if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    try {
      return {
        ...config,
        credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY),
      };
    } catch (error) {
      logger.error("Failed to parse service account key", {
        component: "vertex",
        error: error instanceof Error ? error.message : "Invalid JSON",
      });
    }
  }

  return config;
}
