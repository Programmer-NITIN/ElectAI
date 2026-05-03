/**
 * Tests for static election data integrity.
 * Validates all demo mode content, EVM steps, timeline, facts, and checklist.
 * @group unit
 */

import {
  EVM_VOTING_STEPS,
  CONSTITUENCY_ROADMAP,
  ECI_FACTS,
  VOTER_REGISTRATION_CHECKLIST,
  DEFAULT_FORM6_OUTPUT,
  INDIAN_STATES,
  DEMO_INTENTS,
  DEMO_DEFAULT_RESPONSE,
} from "@/lib/election-data";

describe("EVM Voting Steps", () => {
  it("should have exactly 8 steps", () => {
    expect(EVM_VOTING_STEPS.steps).toHaveLength(8);
  });

  it("each step should have id, title, and description", () => {
    for (const step of EVM_VOTING_STEPS.steps) {
      expect(step.id).toBeTruthy();
      expect(step.title).toBeTruthy();
      expect(step.description).toBeTruthy();
    }
  });

  it("each step should have an icon", () => {
    for (const step of EVM_VOTING_STEPS.steps) {
      expect(step.icon).toBeTruthy();
    }
  });

  it("step IDs should be unique", () => {
    const ids = EVM_VOTING_STEPS.steps.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("Constituency Roadmap (Timeline)", () => {
  it("should have exactly 8 phases", () => {
    expect(CONSTITUENCY_ROADMAP.steps).toHaveLength(8);
  });

  it("each phase should have a valid status", () => {
    const validStatuses = ["completed", "current", "upcoming"];
    for (const phase of CONSTITUENCY_ROADMAP.steps) {
      expect(validStatuses).toContain(phase.status);
    }
  });

  it("phase IDs should be unique", () => {
    const ids = CONSTITUENCY_ROADMAP.steps.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("ECI Facts", () => {
  it("should have at least 5 facts", () => {
    expect(ECI_FACTS.facts.length).toBeGreaterThanOrEqual(5);
  });

  it("each fact should have label and value", () => {
    for (const fact of ECI_FACTS.facts) {
      expect(fact.label).toBeTruthy();
      expect(fact.value).toBeTruthy();
    }
  });

  it("should have sources with URLs", () => {
    expect(ECI_FACTS.sources.length).toBeGreaterThanOrEqual(1);
    for (const source of ECI_FACTS.sources) {
      expect(source.url).toMatch(/^https?:\/\//);
    }
  });
});

describe("Voter Registration Checklist", () => {
  it("should have at least 5 items", () => {
    expect(VOTER_REGISTRATION_CHECKLIST.items.length).toBeGreaterThanOrEqual(5);
  });

  it("each item should have text and priority", () => {
    const validPriorities = ["high", "medium", "low"];
    for (const item of VOTER_REGISTRATION_CHECKLIST.items) {
      expect(item.text).toBeTruthy();
      expect(validPriorities).toContain(item.priority);
    }
  });
});

describe("Form 6 Default Output", () => {
  it("should have requirements", () => {
    expect(DEFAULT_FORM6_OUTPUT.requirements.length).toBeGreaterThanOrEqual(3);
  });

  it("should cover all required categories", () => {
    const categories = DEFAULT_FORM6_OUTPUT.requirements.map((r) => r.category);
    expect(categories).toContain("citizenship");
    expect(categories).toContain("age");
    expect(categories).toContain("residency");
  });

  it("should have a registration URL", () => {
    expect(DEFAULT_FORM6_OUTPUT.registrationUrl).toMatch(/^https?:\/\//);
  });
});

describe("Indian States & UTs", () => {
  it("should include all 28 states and 8 UTs (36 total)", () => {
    expect(INDIAN_STATES).toHaveLength(36);
  });

  it("should include key states", () => {
    expect(INDIAN_STATES).toContain("Maharashtra");
    expect(INDIAN_STATES).toContain("Delhi");
    expect(INDIAN_STATES).toContain("Kerala");
    expect(INDIAN_STATES).toContain("Tamil Nadu");
  });
});

describe("Demo Mode Intents", () => {
  it("should have responses for all major topics", () => {
    expect(Object.keys(DEMO_INTENTS).length).toBeGreaterThanOrEqual(5);
  });

  it("each response should be substantive (>50 chars)", () => {
    for (const [, response] of Object.entries(DEMO_INTENTS)) {
      expect(response.length).toBeGreaterThan(50);
    }
  });

  it("should have a default response", () => {
    expect(DEMO_DEFAULT_RESPONSE.length).toBeGreaterThan(50);
  });
});
