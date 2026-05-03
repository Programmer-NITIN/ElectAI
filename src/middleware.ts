/**
 * Next.js Edge Middleware for ElectAI.
 *
 * Implements two critical security layers:
 * 1. Rate Limiting — 30 requests/minute per IP on API routes
 * 2. Security Headers — HSTS, CSP, X-Frame-Options, etc.
 *
 * @module middleware
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { RATE_LIMIT_WINDOW_MS, MAX_REQUESTS_PER_WINDOW } from "@/lib/constants";

// ── Rate Limiting ─────────────────────────────────────────────────────

/** In-memory rate limit store — tracks request counts per client IP. */
const requestCounts = new Map<string, { count: number; resetAt: number }>();

/**
 * Extracts the client IP from the `x-forwarded-for` header.
 *
 * @param request - Incoming Next.js request
 * @returns Client IP string, or "anonymous" if header is missing
 */
function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "anonymous";
}

/**
 * Checks whether a client has exceeded the rate limit for the current window.
 *
 * @param key - Rate limit key (typically client IP)
 * @returns True if the client is rate limited
 */
function isRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = requestCounts.get(key);

  if (!entry || now > entry.resetAt) {
    requestCounts.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > MAX_REQUESTS_PER_WINDOW;
}

// ── Security Headers ──────────────────────────────────────────────────

/** Standard HTTP security headers applied to all responses. */
const SECURITY_HEADERS: Readonly<Record<string, string>> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(self), geolocation=()",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://apis.google.com https://www.google.com https://www.gstatic.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://*.googleapis.com https://*.google.com https://*.firebaseio.com https://*.cloudfunctions.net wss://*.firebaseio.com",
    "frame-src https://www.google.com https://maps.google.com",
    "frame-ancestors 'none'",
  ].join("; "),
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Resource-Policy": "same-origin",
};

// ── Middleware ─────────────────────────────────────────────────────────

/**
 * Applies rate limiting to API routes and security headers to all responses.
 *
 * @param request - Incoming Next.js request
 * @returns Modified response with security headers, or 429 if rate limited
 */
export function middleware(request: NextRequest): NextResponse {
  // Rate limit API routes only
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const key = getRateLimitKey(request);
    if (isRateLimited(key)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }
  }

  const response = NextResponse.next();

  // Apply security headers to all responses
  for (const [header, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(header, value);
  }

  return response;
}

/** Matcher — skip static assets and internal Next.js routes. */
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|offline.html).*)"],
};
