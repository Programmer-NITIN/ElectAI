/**
 * Edge case tests — AI fallback and demo mode behavior.
 * @group edge-cases
 */

import { DEMO_INTENTS } from "@/lib/election-data";
import {
  EVM_VOTING_STEPS,
  CONSTITUENCY_ROADMAP,
  ECI_FACTS,
  VOTER_REGISTRATION_CHECKLIST,
  DEFAULT_FORM6_OUTPUT,
  INDIAN_STATES,
} from "@/lib/election-data";

describe("Demo Mode Fallback", () => {
  it("should have intents for all major topics", () => {
    const requiredTopics = ["register", "evm", "vote", "form6", "timeline", "eligibility", "booth"];
    for (const topic of requiredTopics) {
      expect(DEMO_INTENTS[topic]).toBeDefined();
      expect(DEMO_INTENTS[topic].length).toBeGreaterThan(50);
    }
  });

  it("should match keywords case-insensitively", () => {
    const userInput = "How do I register to vote?";
    const matchedIntent = Object.entries(DEMO_INTENTS).find(([keyword]) =>
      userInput.toLowerCase().includes(keyword),
    );
    expect(matchedIntent).toBeDefined();
  });
});

describe("Static Election Data Integrity", () => {
  it("EVM voting steps should have 8 steps", () => {
    expect(EVM_VOTING_STEPS.steps).toHaveLength(8);
  });

  it("Each EVM step should have id, title, description", () => {
    for (const step of EVM_VOTING_STEPS.steps) {
      expect(step.id).toBeDefined();
      expect(step.title.length).toBeGreaterThan(0);
      expect(step.description.length).toBeGreaterThan(0);
    }
  });

  it("Constituency roadmap should have 8 phases", () => {
    expect(CONSTITUENCY_ROADMAP.steps).toHaveLength(8);
  });

  it("Each phase should have a valid status", () => {
    for (const phase of CONSTITUENCY_ROADMAP.steps) {
      expect(["completed", "current", "upcoming"]).toContain(phase.status);
    }
  });

  it("ECI facts should have at least 5 facts", () => {
    expect(ECI_FACTS.facts.length).toBeGreaterThanOrEqual(5);
  });

  it("ECI facts should have sources", () => {
    expect(ECI_FACTS.sources).toBeDefined();
    expect(ECI_FACTS.sources!.length).toBeGreaterThan(0);
  });

  it("Voter checklist should have at least 5 items", () => {
    expect(VOTER_REGISTRATION_CHECKLIST.items.length).toBeGreaterThanOrEqual(5);
  });

  it("Each checklist item should have a priority", () => {
    for (const item of VOTER_REGISTRATION_CHECKLIST.items) {
      expect(["high", "medium", "low"]).toContain(item.priority);
    }
  });

  it("Form6 output should have requirements", () => {
    expect(DEFAULT_FORM6_OUTPUT.requirements.length).toBeGreaterThan(0);
  });

  it("Form6 requirements should cover all categories", () => {
    const categories = DEFAULT_FORM6_OUTPUT.requirements.map((r) => r.category);
    expect(categories).toContain("citizenship");
    expect(categories).toContain("age");
    expect(categories).toContain("residency");
  });

  it("Should include all 28 states and 8 UTs", () => {
    expect(INDIAN_STATES.length).toBe(36);
    expect(INDIAN_STATES).toContain("Maharashtra");
    expect(INDIAN_STATES).toContain("Delhi");
    expect(INDIAN_STATES).toContain("Kerala");
  });
});
