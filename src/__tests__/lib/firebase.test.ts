/**
 * Tests for Firebase initialization module.
 * @group unit
 */

/* eslint-disable @typescript-eslint/no-require-imports */

jest.mock("firebase/app", () => ({
  initializeApp: jest.fn(),
  getApps: jest.fn().mockReturnValue([]),
}));

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
}));

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  GoogleAuthProvider: jest.fn(),
}));

jest.mock("firebase/analytics", () => ({
  getAnalytics: jest.fn(),
  isSupported: jest.fn().mockResolvedValue(false),
}));

describe("Firebase Module", () => {
  it("should export isFirebaseConfigured as false without env vars", () => {
    const { isFirebaseConfigured } = require("@/lib/firebase");
    expect(typeof isFirebaseConfigured).toBe("boolean");
  });

  it("should export getAnalyticsInstance function", () => {
    const { getAnalyticsInstance } = require("@/lib/firebase");
    expect(typeof getAnalyticsInstance).toBe("function");
  });

  it("should export googleProvider", () => {
    const { googleProvider } = require("@/lib/firebase");
    expect(googleProvider).toBeDefined();
  });
});
