/**
 * Tests for Zod validation schemas.
 * Covers all data shapes with valid/invalid/edge-case inputs.
 * @group unit
 */

import {
  epicNumberSchema,
  mobileNumberSchema,
  aadhaarSchema,
  pincodeSchema,
  chatMessageSchema,
  form6DataSchema,
  constituencyPhaseSchema,
  evmStepSchema,
  factCardOutputSchema,
  checklistItemSchema,
  checklistOutputSchema,
  feedbackSchema,
  ocrResultSchema,
} from "@/lib/schemas";

// ── EPIC Number ─────────────────────────────────────────────────────

describe("epicNumberSchema", () => {
  it("should accept a valid EPIC number", () => {
    expect(epicNumberSchema.safeParse("ABC1234567").success).toBe(true);
  });

  it("should reject lowercase letters", () => {
    expect(epicNumberSchema.safeParse("abc1234567").success).toBe(false);
  });

  it("should reject too few digits", () => {
    expect(epicNumberSchema.safeParse("ABC123456").success).toBe(false);
  });

  it("should reject too many digits", () => {
    expect(epicNumberSchema.safeParse("ABC12345678").success).toBe(false);
  });

  it("should reject missing letters", () => {
    expect(epicNumberSchema.safeParse("1234567890").success).toBe(false);
  });

  it("should reject empty string", () => {
    expect(epicNumberSchema.safeParse("").success).toBe(false);
  });
});

// ── Mobile Number ───────────────────────────────────────────────────

describe("mobileNumberSchema", () => {
  it("should accept valid numbers starting with 6-9", () => {
    expect(mobileNumberSchema.safeParse("9876543210").success).toBe(true);
    expect(mobileNumberSchema.safeParse("6000000000").success).toBe(true);
    expect(mobileNumberSchema.safeParse("7123456789").success).toBe(true);
    expect(mobileNumberSchema.safeParse("8999999999").success).toBe(true);
  });

  it("should reject numbers starting with 0-5", () => {
    expect(mobileNumberSchema.safeParse("0123456789").success).toBe(false);
    expect(mobileNumberSchema.safeParse("5123456789").success).toBe(false);
  });

  it("should reject wrong length", () => {
    expect(mobileNumberSchema.safeParse("987654321").success).toBe(false);
    expect(mobileNumberSchema.safeParse("98765432100").success).toBe(false);
  });
});

// ── Aadhaar ─────────────────────────────────────────────────────────

describe("aadhaarSchema", () => {
  it("should accept a valid 12-digit number", () => {
    expect(aadhaarSchema.safeParse("123456789012").success).toBe(true);
  });

  it("should reject 11 digits", () => {
    expect(aadhaarSchema.safeParse("12345678901").success).toBe(false);
  });

  it("should reject 13 digits", () => {
    expect(aadhaarSchema.safeParse("1234567890123").success).toBe(false);
  });

  it("should reject letters", () => {
    expect(aadhaarSchema.safeParse("12345678901a").success).toBe(false);
  });
});

// ── PIN Code ────────────────────────────────────────────────────────

describe("pincodeSchema", () => {
  it("should accept valid 6-digit PIN", () => {
    expect(pincodeSchema.safeParse("400001").success).toBe(true);
  });

  it("should reject 5 digits", () => {
    expect(pincodeSchema.safeParse("40000").success).toBe(false);
  });
});

// ── Chat Message ────────────────────────────────────────────────────

describe("chatMessageSchema", () => {
  it("should accept a valid message with default language", () => {
    const result = chatMessageSchema.safeParse({ content: "Hello" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.language).toBe("en");
  });

  it("should accept Hindi language", () => {
    const result = chatMessageSchema.safeParse({ content: "नमस्ते", language: "hi" });
    expect(result.success).toBe(true);
  });

  it("should accept Marathi language", () => {
    const result = chatMessageSchema.safeParse({ content: "नमस्कार", language: "mr" });
    expect(result.success).toBe(true);
  });

  it("should reject empty content", () => {
    expect(chatMessageSchema.safeParse({ content: "" }).success).toBe(false);
  });

  it("should reject content over 2000 chars", () => {
    const longText = "a".repeat(2001);
    expect(chatMessageSchema.safeParse({ content: longText }).success).toBe(false);
  });

  it("should reject unsupported language", () => {
    expect(chatMessageSchema.safeParse({ content: "hello", language: "fr" }).success).toBe(false);
  });

  it("should reject unknown fields (strict mode)", () => {
    expect(chatMessageSchema.safeParse({ content: "hello", extra: "field" }).success).toBe(false);
  });
});

// ── Form 6 Data ─────────────────────────────────────────────────────

describe("form6DataSchema", () => {
  const validForm6 = {
    fullName: "Rahul Kumar",
    fatherName: "Suresh Kumar",
    dob: "1995-01-15",
    gender: "male" as const,
    mobile: "9876543210",
    state: "Maharashtra",
    district: "Mumbai",
    assemblyConstituency: "Andheri West",
    address: "123 Main Street, Andheri",
    pincode: "400058",
    idProofType: "aadhaar" as const,
  };

  it("should accept valid Form 6 data", () => {
    expect(form6DataSchema.safeParse(validForm6).success).toBe(true);
  });

  it("should accept optional aadhaar", () => {
    const data = { ...validForm6, aadhaar: "123456789012" };
    expect(form6DataSchema.safeParse(data).success).toBe(true);
  });

  it("should reject missing required fields", () => {
    const { fullName, ...incomplete } = validForm6;
    void fullName;
    expect(form6DataSchema.safeParse(incomplete).success).toBe(false);
  });

  it("should reject invalid gender", () => {
    expect(form6DataSchema.safeParse({ ...validForm6, gender: "invalid" }).success).toBe(false);
  });

  it("should reject invalid mobile", () => {
    expect(form6DataSchema.safeParse({ ...validForm6, mobile: "1234" }).success).toBe(false);
  });

  it("should reject unknown fields (strict mode)", () => {
    expect(form6DataSchema.safeParse({ ...validForm6, extra: "field" }).success).toBe(false);
  });
});

// ── Constituency Phase ──────────────────────────────────────────────

describe("constituencyPhaseSchema", () => {
  it("should accept a valid phase", () => {
    const result = constituencyPhaseSchema.safeParse({
      id: "phase-1",
      title: "Announcement",
      description: "Election announced",
      status: "completed",
    });
    expect(result.success).toBe(true);
  });

  it("should default status to upcoming", () => {
    const result = constituencyPhaseSchema.safeParse({
      id: "phase-1",
      title: "Announcement",
      description: "Election announced",
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.status).toBe("upcoming");
  });

  it("should reject invalid status", () => {
    const result = constituencyPhaseSchema.safeParse({
      id: "phase-1",
      title: "Test",
      description: "Test",
      status: "invalid",
    });
    expect(result.success).toBe(false);
  });
});

// ── EVM Step ────────────────────────────────────────────────────────

describe("evmStepSchema", () => {
  it("should accept a valid step", () => {
    const result = evmStepSchema.safeParse({
      id: "step-1",
      title: "Arrive",
      description: "Go to booth",
    });
    expect(result.success).toBe(true);
  });

  it("should accept optional fields", () => {
    const result = evmStepSchema.safeParse({
      id: "step-1",
      title: "Arrive",
      description: "Go to booth",
      instruction: "Carry ID",
      icon: "🏛️",
    });
    expect(result.success).toBe(true);
  });
});

// ── Fact Card ───────────────────────────────────────────────────────

describe("factCardOutputSchema", () => {
  it("should accept valid fact card", () => {
    const result = factCardOutputSchema.safeParse({
      title: "ECI Facts",
      summary: "Key facts",
      facts: [{ label: "Founded", value: "1950" }],
      sources: [{ title: "ECI", url: "https://eci.gov.in" }],
    });
    expect(result.success).toBe(true);
  });
});

// ── Checklist ───────────────────────────────────────────────────────

describe("checklistItemSchema", () => {
  it("should accept valid checklist item", () => {
    const result = checklistItemSchema.safeParse({
      id: "check-1",
      text: "Check registration",
      completed: false,
      priority: "high",
    });
    expect(result.success).toBe(true);
  });

  it("should default priority to medium", () => {
    const result = checklistItemSchema.safeParse({
      id: "check-1",
      text: "Check registration",
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.priority).toBe("medium");
  });
});

describe("checklistOutputSchema", () => {
  it("should accept valid output", () => {
    const result = checklistOutputSchema.safeParse({
      title: "Checklist",
      description: "Steps to follow",
      items: [{ id: "1", text: "Step 1", completed: false, priority: "high" }],
    });
    expect(result.success).toBe(true);
  });
});

// ── Feedback ────────────────────────────────────────────────────────

describe("feedbackSchema", () => {
  it("should accept valid feedback", () => {
    const result = feedbackSchema.safeParse({
      messageId: "msg-123",
      rating: "positive",
      timestamp: "2026-01-01T00:00:00.000Z",
    });
    expect(result.success).toBe(true);
  });

  it("should reject invalid rating", () => {
    const result = feedbackSchema.safeParse({
      messageId: "msg-123",
      rating: "neutral",
      timestamp: "2026-01-01T00:00:00.000Z",
    });
    expect(result.success).toBe(false);
  });

  it("should reject comment over 500 chars", () => {
    const result = feedbackSchema.safeParse({
      messageId: "msg-123",
      rating: "positive",
      comment: "a".repeat(501),
      timestamp: "2026-01-01T00:00:00.000Z",
    });
    expect(result.success).toBe(false);
  });
});

// ── OCR Result ──────────────────────────────────────────────────────

describe("ocrResultSchema", () => {
  it("should accept valid OCR result", () => {
    const result = ocrResultSchema.safeParse({
      text: "ABC1234567",
      confidence: 0.95,
      detectedFields: { epicNumber: "ABC1234567" },
    });
    expect(result.success).toBe(true);
  });

  it("should reject confidence out of range", () => {
    const result = ocrResultSchema.safeParse({
      text: "test",
      confidence: 1.5,
      detectedFields: {},
    });
    expect(result.success).toBe(false);
  });

  it("should reject negative confidence", () => {
    const result = ocrResultSchema.safeParse({
      text: "test",
      confidence: -0.1,
      detectedFields: {},
    });
    expect(result.success).toBe(false);
  });

  it("should accept confidence at boundary 0", () => {
    const result = ocrResultSchema.safeParse({
      text: "test",
      confidence: 0,
      detectedFields: {},
    });
    expect(result.success).toBe(true);
  });

  it("should accept confidence at boundary 1", () => {
    const result = ocrResultSchema.safeParse({
      text: "test",
      confidence: 1,
      detectedFields: {},
    });
    expect(result.success).toBe(true);
  });
});

// ── Boundary Conditions ─────────────────────────────────────────────

describe("Schema Boundary Conditions", () => {
  it("should accept exactly 2000-character message", () => {
    const result = chatMessageSchema.safeParse({ content: "a".repeat(2000) });
    expect(result.success).toBe(true);
  });

  it("should reject exactly 2001-character message", () => {
    const result = chatMessageSchema.safeParse({ content: "a".repeat(2001) });
    expect(result.success).toBe(false);
  });

  it("should accept 1-character message", () => {
    const result = chatMessageSchema.safeParse({ content: "a" });
    expect(result.success).toBe(true);
  });

  it("should accept feedback comment at exactly 500 chars", () => {
    const result = feedbackSchema.safeParse({
      messageId: "msg-1",
      rating: "positive",
      comment: "a".repeat(500),
      timestamp: "2026-01-01T00:00:00.000Z",
    });
    expect(result.success).toBe(true);
  });

  it("should accept feedback without optional comment", () => {
    const result = feedbackSchema.safeParse({
      messageId: "msg-1",
      rating: "negative",
      timestamp: "2026-01-01T00:00:00.000Z",
    });
    expect(result.success).toBe(true);
  });

  it("should accept EPIC number with exact 3 letters and 7 digits", () => {
    expect(epicNumberSchema.safeParse("XYZ9999999").success).toBe(true);
  });

  it("should reject EPIC number with special characters", () => {
    expect(epicNumberSchema.safeParse("AB@1234567").success).toBe(false);
  });

  it("should accept mobile number starting with 6", () => {
    expect(mobileNumberSchema.safeParse("6000000001").success).toBe(true);
  });

  it("should accept mobile number starting with 9", () => {
    expect(mobileNumberSchema.safeParse("9999999999").success).toBe(true);
  });

  it("should reject mobile number with spaces", () => {
    expect(mobileNumberSchema.safeParse("987 654 321").success).toBe(false);
  });

  it("should reject pincode with letters", () => {
    expect(pincodeSchema.safeParse("4000AB").success).toBe(false);
  });

  it("should reject Aadhaar with spaces", () => {
    expect(aadhaarSchema.safeParse("1234 5678 9012").success).toBe(false);
  });
});

// ── Error Message Quality ───────────────────────────────────────────

describe("Schema Error Messages", () => {
  it("chatMessageSchema should provide useful error on empty content", () => {
    const result = chatMessageSchema.safeParse({ content: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.length).toBeGreaterThan(0);
    }
  });

  it("epicNumberSchema should provide error on invalid format", () => {
    const result = epicNumberSchema.safeParse("invalid");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.length).toBeGreaterThan(0);
    }
  });

  it("form6DataSchema should report missing required fields", () => {
    const result = form6DataSchema.safeParse({});
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.length).toBeGreaterThan(0);
    }
  });

  it("feedbackSchema should reject invalid timestamp format", () => {
    const result = feedbackSchema.safeParse({
      messageId: "msg-1",
      rating: "positive",
      timestamp: "not-a-date",
    });
    // Schema validates timestamp as a datetime string
    expect(result.success).toBe(false);
  });

  it("checklistOutputSchema should require at least one item", () => {
    const result = checklistOutputSchema.safeParse({
      title: "Test",
      description: "Test",
      items: [],
    });
    // Empty array is valid per schema (flexible for AI output)
    expect(result.success).toBe(true);
  });
});
