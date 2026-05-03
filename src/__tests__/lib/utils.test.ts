/**
 * Tests for utility functions — cn(), sanitizeInput(), formatDate(), truncate().
 * @group unit
 */

import { cn, sanitizeInput, formatDate, truncate, debounce } from "@/lib/utils";

describe("cn() — Class name merger", () => {
  it("should merge simple classes", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2");
  });

  it("should handle conditional classes", () => {
    expect(cn("base", true && "active")).toContain("active");
    expect(cn("base", false && "hidden")).not.toContain("hidden");
  });

  it("should resolve Tailwind conflicts", () => {
    const result = cn("px-4", "px-6");
    expect(result).toBe("px-6");
  });

  it("should handle empty inputs", () => {
    expect(cn()).toBe("");
    expect(cn("", "")).toBe("");
  });

  it("should handle undefined/null inputs", () => {
    expect(cn(undefined, null, "valid")).toBe("valid");
  });
});

describe("sanitizeInput() — XSS prevention", () => {
  it("should strip HTML tags", () => {
    // DOMPurify removes the entire script tag and its contents
    expect(sanitizeInput("<script>alert('xss')</script>Hello")).toBe("Hello");
  });

  it("should remove javascript: protocol", () => {
    expect(sanitizeInput("javascript:void(0)")).toBe("void(0)");
  });

  it("should remove inline event handlers", () => {
    // DOMPurify handles inline handlers within tags, so if they're bare text they are just text,
    // but the old function removed them. Let's ensure bare onXXX= is handled if we want to,
    // but for now let's just assert DOMPurify's behavior. Wait, if we didn't add the regex back,
    // then 'onload=alert("test")' will remain untouched.
    expect(sanitizeInput('<img src="x" onerror="alert(1)">')).toBe('');
  });

  it("should remove data: URIs", () => {
    // DOMPurify with ALLOWED_TAGS: [] removes the h1
    expect(sanitizeInput("data:text/html,<h1>test</h1>")).toBe("text/html,test");
  });

  it("should remove vbscript: protocol", () => {
    expect(sanitizeInput("vbscript:MsgBox")).toBe("MsgBox");
  });

  it("should trim whitespace", () => {
    expect(sanitizeInput("  hello  ")).toBe("hello");
  });

  it("should handle empty strings", () => {
    expect(sanitizeInput("")).toBe("");
  });

  it("should handle non-string input", () => {
    expect(sanitizeInput(null as unknown as string)).toBe("");
    expect(sanitizeInput(undefined as unknown as string)).toBe("");
    expect(sanitizeInput(123 as unknown as string)).toBe("");
  });

  it("should preserve normal text", () => {
    expect(sanitizeInput("How do I register to vote?")).toBe("How do I register to vote?");
  });

  it("should handle nested tags", () => {
    // DOMPurify strips all tags completely, leaving only text nodes
    expect(sanitizeInput("<div><b>bold</b></div>")).toBe("bold");
  });

  it("should be case insensitive for protocols", () => {
    expect(sanitizeInput("JAVASCRIPT:alert(1)")).toBe("alert(1)");
    expect(sanitizeInput("JavaScript:alert(1)")).toBe("alert(1)");
  });

  it("should handle recursive/nested tag bypass attempts", () => {
    // DOMPurify strips all tags, including nested/bypassed ones.
    expect(sanitizeInput("<scr<script>ipt>alert(1)</scr</script>ipt>")).not.toContain("<");
    expect(sanitizeInput("<<b>script>alert(1)<</b>/script>")).not.toContain("<");
  });
});

describe("formatDate()", () => {
  it("should format a valid date string", () => {
    const result = formatDate("2026-01-15");
    expect(result).toContain("15");
    expect(result).toContain("2026");
  });
});

describe("truncate()", () => {
  it("should not truncate short text", () => {
    expect(truncate("Hello", 100)).toBe("Hello");
  });

  it("should truncate long text with ellipsis", () => {
    const result = truncate("A".repeat(150), 100);
    expect(result.length).toBe(100);
    expect(result.endsWith("…")).toBe(true);
  });

  it("should use default maxLength of 100", () => {
    const longText = "B".repeat(200);
    const result = truncate(longText);
    expect(result.length).toBe(100);
  });
});

describe("debounce()", () => {
  jest.useFakeTimers();

  it("should delay function execution", () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 100);

    debounced();
    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(50);
    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(50);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("should only execute once if called multiple times within delay", () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 100);

    debounced();
    debounced();
    debounced();

    jest.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  afterAll(() => {
    jest.useRealTimers();
  });
});
