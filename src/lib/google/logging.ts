/**
 * Google Cloud Logging integration for ElectAI.
 * Provides structured logging directly to Google Cloud Logging API
 * for enhanced monitoring on Cloud Run deployments.
 * @module google/logging
 */

import { logger } from "../logger";
import { ENABLE_CLOUD_LOGGING } from "../constants";

/** Whether Cloud Logging is available (detected on Cloud Run via K_SERVICE). */
export function isCloudLoggingAvailable(): boolean {
  return ENABLE_CLOUD_LOGGING;
}

/**
 * Writes a structured log entry to Google Cloud Logging.
 * On Cloud Run, structured JSON stdout is automatically captured.
 * This function provides direct API access for custom log names.
 * @param logName - The log name (e.g., "electai-chat", "electai-errors")
 * @param severity - Log severity level
 * @param message - Log message
 * @param metadata - Additional structured metadata
 */
export async function writeCloudLog(
  logName: string,
  severity: "INFO" | "WARNING" | "ERROR" | "CRITICAL",
  message: string,
  metadata?: Record<string, unknown>,
): Promise<void> {
  if (!isCloudLoggingAvailable()) return;

  try {
    const { Logging } = await import("@google-cloud/logging");
    const logging = new Logging();
    const log = logging.log(logName);

    const entry = log.entry(
      {
        resource: { type: "cloud_run_revision" },
        severity,
      },
      { message, timestamp: new Date().toISOString(), ...metadata },
    );

    await log.write(entry);
  } catch (error) {
    logger.error("Cloud Logging write failed", {
      component: "cloud-logging",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

/** Pre-configured log writers for common categories. */
export const cloudLog = {
  chat: (message: string, meta?: Record<string, unknown>) =>
    writeCloudLog("electai-chat", "INFO", message, meta),
  security: (message: string, meta?: Record<string, unknown>) =>
    writeCloudLog("electai-security", "WARNING", message, meta),
  error: (message: string, meta?: Record<string, unknown>) =>
    writeCloudLog("electai-errors", "ERROR", message, meta),
  ai: (message: string, meta?: Record<string, unknown>) =>
    writeCloudLog("electai-ai", "INFO", message, meta),
} as const;
