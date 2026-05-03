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
  beforeEach(() => {
    jest.resetModules();
  });

  it("should export isFirebaseConfigured as false without env vars", () => {
    const { isFirebaseConfigured } = require("@/lib/firebase");
    expect(typeof isFirebaseConfigured).toBe("boolean");
    expect(isFirebaseConfigured).toBe(false);
  });

  it("should reuse existing app if getApps() returns an app", () => {
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY = "test";
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = "test";

    jest.mock("firebase/app", () => ({
      initializeApp: jest.fn(),
      getApps: jest.fn().mockReturnValue([{ name: "[DEFAULT]" }]),
    }));

    const { app } = require("@/lib/firebase");
    expect(app).toEqual({ name: "[DEFAULT]" });

    delete process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    delete process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  });

  it("should initialize analytics when supported", async () => {
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY = "test";
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = "test";

    jest.mock("firebase/app", () => ({
      initializeApp: jest.fn().mockReturnValue({ name: "[DEFAULT]" }),
      getApps: jest.fn().mockReturnValue([]),
    }));

    jest.mock("firebase/analytics", () => ({
      getAnalytics: jest.fn().mockReturnValue({}),
      isSupported: jest.fn().mockResolvedValue(true),
    }));

    const { getAnalyticsInstance } = require("@/lib/firebase");
    const instance = await getAnalyticsInstance();
    expect(instance).toBeDefined();

    // second call returns cached instance
    const instance2 = await getAnalyticsInstance();
    expect(instance2).toBe(instance);

    delete process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    delete process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  });

  it("should return null from getAnalyticsInstance if app is null", async () => {
    jest.mock("firebase/app", () => ({
      initializeApp: jest.fn(),
      getApps: jest.fn().mockReturnValue([]),
    }));

    // Re-require to get uninitialized app
    const { getAnalyticsInstance } = require("@/lib/firebase");
    const instance = await getAnalyticsInstance();
    expect(instance).toBeNull();
  });

  it("should export googleProvider", () => {
    const { googleProvider } = require("@/lib/firebase");
    expect(googleProvider).toBeDefined();
  });
});
