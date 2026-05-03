/**
 * AI agent model configurations for ElectAI.
 *
 * Implements a dual-provider architecture:
 * - Vertex AI (production) — deep Google Cloud integration
 * - Google AI Studio (dev/demo) — simple API key setup
 *
 * Uses a multi-agent routing pattern: fast classifier → specialized models.
 *
 * @module ai/agents
 */

import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createVertex } from "@ai-sdk/google-vertex";
import { isVertexConfigured } from "@/lib/google/vertex";

// ── Provider Setup ────────────────────────────────────────────────────

const vertexProvider = isVertexConfigured()
  ? createVertex({
      project: process.env.GOOGLE_VERTEX_PROJECT || "",
      location: process.env.GOOGLE_VERTEX_LOCATION || "asia-south1",
      googleAuthOptions: process.env.GOOGLE_SERVICE_ACCOUNT_KEY
        ? { credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY) }
        : undefined,
    })
  : null;

const googleProvider = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || "",
});

/**
 * Unified model factory — prefers Vertex AI when configured.
 * @param modelId - Gemini model identifier
 * @returns AI SDK model instance
 */
function getModel(modelId: string) {
  if (vertexProvider) return vertexProvider(modelId);
  return googleProvider(modelId);
}

// ── Agent Model Configurations ────────────────────────────────────────

/** Fast intent classifier — low latency, zero temperature. */
export const routerModel = getModel("gemini-2.5-flash");

/** Creative explainer — high temperature for engaging explanations. */
export const explainerModel = getModel("gemini-2.5-pro");

/** Grounded fact agent — zero temperature, strict accuracy. */
export const groundedModel = getModel("gemini-2.5-pro");

/** Timeline generator — low temperature for structured output. */
export const timelineModel = getModel("gemini-2.5-pro");

/** Eligibility assessor — zero temperature for legal accuracy. */
export const eligibilityModel = getModel("gemini-2.5-pro");

/** Checklist generator — low temperature for actionable output. */
export const checklistModel = getModel("gemini-2.5-pro");

// ── Agent Temperature Settings ────────────────────────────────────────

/** Temperature settings applied at call site per agent type. */
export const AGENT_TEMPERATURES = {
  router: 0,
  explainer: 0.9,
  grounded: 0,
  timeline: 0.2,
  eligibility: 0,
  checklist: 0.2,
} as const;

// ── Provider Detection ────────────────────────────────────────────────

/** Whether any AI API key is configured. */
export function isApiKeyConfigured(): boolean {
  if (isVertexConfigured()) return true;
  return Boolean(
    process.env.GOOGLE_GENERATIVE_AI_API_KEY && process.env.GOOGLE_GENERATIVE_AI_API_KEY.length > 0,
  );
}
