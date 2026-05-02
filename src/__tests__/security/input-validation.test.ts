/**
 * Input validation and XSS prevention tests.
 * Tests sanitization against various attack vectors.
 * @group security
 */

import { sanitizeInput } from "@/lib/utils";
import { chatMessageSchema, epicNumberSchema, aadhaarSchema } from "@/lib/schemas";

describe("XSS Prevention", () => {
  const xssPayloads = [
    '<script>alert("xss")</script>',
    '<img src=x onerror=alert(1)>',
    '<svg onload=alert(1)>',
    "javascript:alert(document.cookie)",
    "&#x6A;&#x61;&#x76;&#x61;",
    '<iframe src="evil.com"></iframe>',
    '<a href="javascript:void(0)">click</a>',
    "data:text/html,<script>alert(1)</script>",
    '<div onmouseover="alert(1)">hover</div>',
    "vbscript:MsgBox",
    '<input onfocus=alert(1) autofocus>',
    '<body onload=alert(1)>',
    '<marquee onstart=alert(1)>',
  ];

  it.each(xssPayloads)("should neutralize XSS payload: %s", (payload) => {
    const sanitized = sanitizeInput(payload);
    expect(sanitized).not.toContain("<script");
    expect(sanitized).not.toContain("javascript:");
    expect(sanitized).not.toContain("onerror=");
    expect(sanitized).not.toContain("onload=");
    expect(sanitized).not.toContain("onmouseover=");
    expect(sanitized).not.toContain("onfocus=");
    expect(sanitized).not.toContain("onstart=");
    expect(sanitized).not.toContain("vbscript:");
    expect(sanitized).not.toContain("data:");
  });

  it("should handle SQL injection attempts in chat input", () => {
    const sqlPayload = "'; DROP TABLE users; --";
    const result = chatMessageSchema.safeParse({ content: sqlPayload });
    // Schema accepts it (it's just text), but sanitize strips nothing since no HTML
    expect(result.success).toBe(true);
    const sanitized = sanitizeInput(sqlPayload);
    expect(sanitized).toBe("'; DROP TABLE users; --");
  });
});

describe("Input Validation Boundaries", () => {
  it("should reject EPIC numbers with injection", () => {
    expect(epicNumberSchema.safeParse("ABC<script>alert(1)</script>").success).toBe(false);
    expect(epicNumberSchema.safeParse("ABC1234567' OR '1'='1").success).toBe(false);
  });

  it("should reject Aadhaar with non-numeric characters", () => {
    expect(aadhaarSchema.safeParse("12345678901a").success).toBe(false);
    expect(aadhaarSchema.safeParse("123456789<12").success).toBe(false);
  });

  it("should enforce message length limits", () => {
    const maxMessage = "a".repeat(2000);
    expect(chatMessageSchema.safeParse({ content: maxMessage }).success).toBe(true);

    const overLimit = "a".repeat(2001);
    expect(chatMessageSchema.safeParse({ content: overLimit }).success).toBe(false);
  });

  it("should reject empty messages", () => {
    expect(chatMessageSchema.safeParse({ content: "" }).success).toBe(false);
  });

  it("should handle unicode in valid messages", () => {
    expect(
      chatMessageSchema.safeParse({ content: "मतदाता पंजीकरण कैसे करें?" }).success,
    ).toBe(true);
  });

  it("should handle emojis in valid messages", () => {
    expect(
      chatMessageSchema.safeParse({ content: "How to vote? 🗳️" }).success,
    ).toBe(true);
  });
});
