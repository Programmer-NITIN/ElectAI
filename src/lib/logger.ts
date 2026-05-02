/**
 * Structured logging utility for ElectAI.
 *
 * Provides consistent, structured log output with severity levels,
 * timestamps, and contextual metadata. When deployed on Google Cloud Run,
 * structured JSON stdout is automatically captured by Cloud Logging.
 *
 * Severity levels align with Google Cloud Logging standards:
 * DEBUG → INFO → WARNING → ERROR → CRITICAL
 *
 * @module logger
 * @see https://cloud.google.com/logging/docs/structured-logging
 */

/** Log severity levels aligned with Google Cloud Logging. */
type LogSeverity = "DEBUG" | "INFO" | "WARNING" | "ERROR" | "CRITICAL";

/** Structured log entry format compatible with Google Cloud Logging. */
interface LogEntry {
  /** Severity level of the log entry. */
  severity: LogSeverity;
  /** Human-readable log message. */
  message: string;
  /** ISO 8601 timestamp of the log event. */
  timestamp: string;
  /** Optional component/module name for log filtering. */
  component?: string;
  /** Additional metadata fields for context. */
  [key: string]: unknown;
}

/**
 * Writes a structured log entry to stdout/stderr.
 * Cloud Logging on GCR automatically parses JSON lines from stdout.
 *
 * @param severity - The log severity level
 * @param message - Human-readable log message
 * @param meta - Additional key-value metadata for context
 */
function writeLog(severity: LogSeverity, message: string, meta?: Record<string, unknown>): void {
  const entry: LogEntry = {
    severity,
    message,
    timestamp: new Date().toISOString(),
    ...meta,
  };

  if (severity === "ERROR" || severity === "CRITICAL") {
    console.error(JSON.stringify(entry));
  } else {
    console.log(JSON.stringify(entry));
  }
}

/**
 * Structured logger with methods for each severity level.
 * All methods accept a message string and optional metadata object.
 *
 * @example
 * ```ts
 * logger.info("Chat request received", { userId: "abc", language: "hi" });
 * logger.error("AI fallback triggered", { provider: "vertex", error: err.message });
 * ```
 */
export const logger = {
  /** Debug-level log — verbose information for development. */
  debug: (message: string, meta?: Record<string, unknown>) =>
    writeLog("DEBUG", message, meta),

  /** Info-level log — routine operational messages. */
  info: (message: string, meta?: Record<string, unknown>) =>
    writeLog("INFO", message, meta),

  /** Warning-level log — unexpected but non-critical issues. */
  warn: (message: string, meta?: Record<string, unknown>) =>
    writeLog("WARNING", message, meta),

  /** Error-level log — failures that affect functionality. */
  error: (message: string, meta?: Record<string, unknown>) =>
    writeLog("ERROR", message, meta),

  /** Critical-level log — system-wide failures requiring immediate attention. */
  critical: (message: string, meta?: Record<string, unknown>) =>
    writeLog("CRITICAL", message, meta),
} as const;
