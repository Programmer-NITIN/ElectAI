/**
 * Tests for the structured logger module.
 * @group unit
 */

import { logger } from "@/lib/logger";

describe("Structured Logger", () => {
  let consoleSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, "log").mockImplementation();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it("should log info messages to stdout", () => {
    logger.info("Test info message");
    expect(consoleSpy).toHaveBeenCalledTimes(1);
    const output = JSON.parse(consoleSpy.mock.calls[0][0]);
    expect(output.severity).toBe("INFO");
    expect(output.message).toBe("Test info message");
    expect(output.timestamp).toBeDefined();
  });

  it("should log debug messages to stdout", () => {
    logger.debug("Test debug");
    expect(consoleSpy).toHaveBeenCalledTimes(1);
    const output = JSON.parse(consoleSpy.mock.calls[0][0]);
    expect(output.severity).toBe("DEBUG");
  });

  it("should log warning messages to stdout", () => {
    logger.warn("Test warning");
    expect(consoleSpy).toHaveBeenCalledTimes(1);
    const output = JSON.parse(consoleSpy.mock.calls[0][0]);
    expect(output.severity).toBe("WARNING");
  });

  it("should log error messages to stderr", () => {
    logger.error("Test error");
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    const output = JSON.parse(consoleErrorSpy.mock.calls[0][0]);
    expect(output.severity).toBe("ERROR");
  });

  it("should log critical messages to stderr", () => {
    logger.critical("Test critical");
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    const output = JSON.parse(consoleErrorSpy.mock.calls[0][0]);
    expect(output.severity).toBe("CRITICAL");
  });

  it("should include metadata in log entries", () => {
    logger.info("Test with meta", { component: "chat", userId: "abc" });
    const output = JSON.parse(consoleSpy.mock.calls[0][0]);
    expect(output.component).toBe("chat");
    expect(output.userId).toBe("abc");
  });

  it("should output valid JSON", () => {
    logger.info("JSON test");
    expect(() => JSON.parse(consoleSpy.mock.calls[0][0])).not.toThrow();
  });

  it("should include ISO 8601 timestamp", () => {
    logger.info("Timestamp test");
    const output = JSON.parse(consoleSpy.mock.calls[0][0]);
    expect(new Date(output.timestamp).toISOString()).toBe(output.timestamp);
  });

  it("should handle log messages without metadata", () => {
    logger.info("No meta");
    const output = JSON.parse(consoleSpy.mock.calls[0][0]);
    expect(output.severity).toBe("INFO");
    expect(output.message).toBe("No meta");
  });
});
