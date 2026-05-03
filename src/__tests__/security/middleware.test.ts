/**
 * Security middleware tests.
 * Validates rate limiting, security headers, and CSP policy.
 * @group security
 *
 * @jest-environment node
 */

import { NextRequest } from "next/server";
import { middleware } from "@/middleware";

function createRequest(path: string, ip?: string): NextRequest {
  const url = new URL(path, "http://localhost:3000");
  const headers = new Headers();
  if (ip !== undefined) headers.set("x-forwarded-for", ip);
  return new NextRequest(url, { headers });
}

describe("Security Middleware", () => {
  describe("Security Headers", () => {
    it("should set X-Content-Type-Options to nosniff", () => {
      const response = middleware(createRequest("/"));
      expect(response.headers.get("X-Content-Type-Options")).toBe("nosniff");
    });

    it("should set X-Frame-Options to DENY", () => {
      const response = middleware(createRequest("/"));
      expect(response.headers.get("X-Frame-Options")).toBe("DENY");
    });

    it("should set X-XSS-Protection", () => {
      const response = middleware(createRequest("/"));
      expect(response.headers.get("X-XSS-Protection")).toBe("1; mode=block");
    });

    it("should set HSTS with preload", () => {
      const response = middleware(createRequest("/"));
      const hsts = response.headers.get("Strict-Transport-Security");
      expect(hsts).toContain("max-age=63072000");
      expect(hsts).toContain("preload");
      expect(hsts).toContain("includeSubDomains");
    });

    it("should set Referrer-Policy", () => {
      const response = middleware(createRequest("/"));
      expect(response.headers.get("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
    });

    it("should set Permissions-Policy", () => {
      const response = middleware(createRequest("/"));
      const policy = response.headers.get("Permissions-Policy");
      expect(policy).toContain("camera=()");
      expect(policy).toContain("microphone=(self)");
    });

    it("should set CSP header", () => {
      const response = middleware(createRequest("/"));
      const csp = response.headers.get("Content-Security-Policy");
      expect(csp).toContain("default-src 'self'");
      expect(csp).toContain("frame-ancestors 'none'");
    });

    it("should set Cross-Origin-Opener-Policy", () => {
      const response = middleware(createRequest("/"));
      expect(response.headers.get("Cross-Origin-Opener-Policy")).toBe("same-origin");
    });

    it("should set Cross-Origin-Resource-Policy", () => {
      const response = middleware(createRequest("/"));
      expect(response.headers.get("Cross-Origin-Resource-Policy")).toBe("same-origin");
    });
  });

  describe("Rate Limiting", () => {
    it("should allow normal API requests", () => {
      const response = middleware(createRequest("/api/chat", "10.0.0.1"));
      expect(response.status).not.toBe(429);
    });

    it("should return 429 after exceeding limit", () => {
      const ip = "10.0.0.99";
      let response;
      for (let i = 0; i < 35; i++) {
        response = middleware(createRequest("/api/chat", ip));
      }
      expect(response?.status).toBe(429);
    });

    it("should not rate limit non-API routes", () => {
      const response = middleware(createRequest("/", "10.0.0.2"));
      expect(response.status).not.toBe(429);
    });

    it("should handle missing x-forwarded-for header (anonymous)", () => {
      const response = middleware(createRequest("/api/chat"));
      expect(response.status).not.toBe(429);
    });
  });
});
