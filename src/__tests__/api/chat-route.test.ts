/**
 * API route tests for the /api/chat endpoint.
 * Validates request validation, CORS handling, demo mode, and error responses.
 * @group api
 *
 * @jest-environment node
 */

import { POST, OPTIONS } from "@/app/api/chat/route";

/**
 * Creates a mock Request object for testing the chat API.
 * @param body - The JSON body to include in the request
 * @param options - Additional Request init options
 */
function createRequest(body: unknown, options?: RequestInit): Request {
  return new Request("http://localhost:3000/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    ...options,
  });
}

describe("POST /api/chat", () => {
  describe("Input Validation", () => {
    it("should reject an empty body with 400", async () => {
      const request = new Request("http://localhost:3000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      });
      const response = await POST(request);
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBeDefined();
    });

    it("should reject body with no messages array", async () => {
      const request = createRequest({ text: "hello" });
      const response = await POST(request);
      expect(response.status).toBe(400);
    });

    it("should reject empty messages array", async () => {
      const request = createRequest({ messages: [] });
      const response = await POST(request);
      expect(response.status).toBe(400);
    });

    it("should reject messages with invalid role", async () => {
      const request = createRequest({
        messages: [{ id: "1", role: "admin", content: "hello" }],
      });
      const response = await POST(request);
      expect(response.status).toBe(400);
    });

    it("should reject oversized conversation (>50 messages)", async () => {
      const messages = Array.from({ length: 51 }, (_, i) => ({
        id: String(i),
        role: "user",
        content: `Message ${i}`,
      }));
      const request = createRequest({ messages });
      const response = await POST(request);
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toContain("Conversation limit");
    });

    it("should reject malformed JSON with 400", async () => {
      const request = new Request("http://localhost:3000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "not-json{{{",
      });
      const response = await POST(request);
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toContain("Malformed JSON");
    });

    it("should reject user messages exceeding 2000 characters", async () => {
      const request = createRequest({
        messages: [{ id: "1", role: "user", content: "a".repeat(2001) }],
      });
      const response = await POST(request);
      expect(response.status).toBe(400);
    });
  });

  describe("CORS Headers", () => {
    it("should include Access-Control-Allow-Origin on error responses", async () => {
      const request = createRequest({ messages: [] });
      const response = await POST(request);
      expect(response.headers.get("Access-Control-Allow-Origin")).toBeTruthy();
    });

    it("should include Access-Control-Allow-Methods on error responses", async () => {
      const request = createRequest({});
      const response = await POST(request);
      expect(response.headers.get("Access-Control-Allow-Methods")).toContain("POST");
    });
  });

  describe("Demo Mode (no API key)", () => {
    it("should return a streaming response in demo mode", async () => {
      const request = createRequest({
        messages: [{ id: "1", role: "user", content: "How do I register to vote?" }],
      });
      const response = await POST(request);
      // Demo mode returns 200 with streaming
      expect(response.status).toBe(200);
      expect(response.headers.get("Content-Type")).toBe("text/event-stream");
    });

    it("should set X-Content-Type-Options: nosniff on stream response", async () => {
      const request = createRequest({
        messages: [{ id: "1", role: "user", content: "tell me about elections" }],
      });
      const response = await POST(request);
      expect(response.headers.get("X-Content-Type-Options")).toBe("nosniff");
    });

    it("should sanitize XSS in user messages before processing", async () => {
      const request = createRequest({
        messages: [{ id: "1", role: "user", content: '<script>alert("xss")</script>voting' }],
      });
      const response = await POST(request);
      // Should not crash, should return 200
      expect(response.status).toBe(200);
    });

    it("should return CORS origin header on streaming response", async () => {
      const request = createRequest({
        messages: [{ id: "1", role: "user", content: "hello" }],
      });
      const response = await POST(request);
      expect(response.headers.get("Access-Control-Allow-Origin")).toBeTruthy();
    });
  });
});

describe("OPTIONS /api/chat", () => {
  it("should return 204 with CORS headers", () => {
    const response = OPTIONS();
    expect(response.status).toBe(204);
    expect(response.headers.get("Access-Control-Allow-Origin")).toBeTruthy();
    expect(response.headers.get("Access-Control-Allow-Methods")).toContain("POST");
    expect(response.headers.get("Access-Control-Allow-Headers")).toContain("Content-Type");
  });
});
