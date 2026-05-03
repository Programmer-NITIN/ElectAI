/**
 * Jest test framework configuration for ElectAI.
 *
 * Uses next/jest for automatic Next.js integration including module resolution,
 * environment setup, and SWC transpilation. Configures JSDOM for React component
 * testing and V8 for coverage measurement.
 *
 * @module jest.config
 */

import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/__tests__/**",
    "!src/**/types/**",
    "!src/**/index.ts",
    "!src/app/layout.tsx",
    "!src/app/page.tsx",
  ],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
