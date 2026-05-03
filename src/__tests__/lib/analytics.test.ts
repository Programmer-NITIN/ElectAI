/**
 * Tests for analytics module.
 * @group unit
 */

jest.mock("@/lib/firebase", () => ({
  getAnalyticsInstance: jest.fn().mockResolvedValue(null),
}));

jest.mock("firebase/analytics", () => ({
  logEvent: jest.fn(),
}));

import { trackEvent, analyticsEvents } from "@/lib/analytics";
import { getAnalyticsInstance } from "@/lib/firebase";
import { logEvent } from "firebase/analytics";

describe("trackEvent()", () => {
  it("should not throw when analytics is null", async () => {
    await expect(trackEvent("test_event")).resolves.not.toThrow();
  });

  it("should accept event params", async () => {
    await expect(trackEvent("test_event", { key: "value" })).resolves.not.toThrow();
  });

  it("should call logEvent when analytics is configured", async () => {
    const mockGetAnalytics = getAnalyticsInstance as jest.Mock;
    const mockLogEvent = logEvent as jest.Mock;
    
    mockGetAnalytics.mockResolvedValueOnce({}); // mock instance
    await trackEvent("test", { foo: "bar" });
    
    expect(mockLogEvent).toHaveBeenCalledWith({}, "test", { foo: "bar" });
  });

  it("should silently ignore errors", async () => {
    const mockGetAnalytics = getAnalyticsInstance as jest.Mock;
    mockGetAnalytics.mockRejectedValueOnce(new Error("Firebase failed"));
    
    await expect(trackEvent("test")).resolves.not.toThrow();
  });
});

describe("analyticsEvents", () => {
  it("should have all pre-defined event helpers", () => {
    expect(typeof analyticsEvents.chatMessage).toBe("function");
    expect(typeof analyticsEvents.toolUsed).toBe("function");
    expect(typeof analyticsEvents.voiceInput).toBe("function");
    expect(typeof analyticsEvents.ttsPlayed).toBe("function");
    expect(typeof analyticsEvents.languageChanged).toBe("function");
    expect(typeof analyticsEvents.themeToggled).toBe("function");
    expect(typeof analyticsEvents.feedbackGiven).toBe("function");
    expect(typeof analyticsEvents.ocrUsed).toBe("function");
    expect(typeof analyticsEvents.boothSearch).toBe("function");
    expect(typeof analyticsEvents.pageView).toBe("function");
  });

  it("should not throw for any event", async () => {
    await expect(analyticsEvents.chatMessage("en")).resolves.not.toThrow();
    await expect(analyticsEvents.toolUsed("evm")).resolves.not.toThrow();
    await expect(analyticsEvents.voiceInput()).resolves.not.toThrow();
  });
});
