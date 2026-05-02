/**
 * Tests for i18n module — language support, translations, chips.
 * @group unit
 */

import { t, getChips, getSupportedLanguages, type Language } from "@/lib/i18n";

describe("t() — Translation function", () => {
  it("should return English translation by default", () => {
    expect(t("welcome.title")).toBe("Welcome to ElectAI");
  });

  it("should return Hindi translation", () => {
    expect(t("welcome.title", "hi")).toBe("ElectAI में आपका स्वागत है");
  });

  it("should return Marathi translation", () => {
    expect(t("welcome.title", "mr")).toBe("ElectAI मध्ये आपले स्वागत आहे");
  });

  it("should fall back to English for missing keys", () => {
    expect(t("welcome.title", "en")).toBe("Welcome to ElectAI");
  });

  it("should return key itself if not found in any language", () => {
    expect(t("nonexistent.key")).toBe("nonexistent.key");
  });

  it("should translate all core UI strings", () => {
    const coreKeys = [
      "welcome.title", "welcome.subtitle", "welcome.placeholder",
      "chat.send", "chat.thinking", "chat.error", "chat.limit",
      "header.title", "header.tagline",
      "a11y.skip", "a11y.newMessage",
      "feedback.positive", "feedback.negative",
      "evm.title", "form6.title", "timeline.title", "checklist.title",
      "ocr.title", "booth.title",
    ];

    for (const key of coreKeys) {
      const languages: Language[] = ["en", "hi", "mr"];
      for (const lang of languages) {
        const value = t(key, lang);
        expect(value).not.toBe(key); // Should not return key itself
        expect(value.length).toBeGreaterThan(0);
      }
    }
  });
});

describe("getChips() — Suggestion chips", () => {
  it("should return 5 English chips by default", () => {
    const chips = getChips();
    expect(chips).toHaveLength(5);
    expect(typeof chips[0]).toBe("string");
  });

  it("should return 5 Hindi chips", () => {
    const chips = getChips("hi");
    expect(chips).toHaveLength(5);
  });

  it("should return 5 Marathi chips", () => {
    const chips = getChips("mr");
    expect(chips).toHaveLength(5);
  });

  it("should have non-empty chip strings", () => {
    for (const lang of ["en", "hi", "mr"] as Language[]) {
      const chips = getChips(lang);
      for (const chip of chips) {
        expect(chip.length).toBeGreaterThan(5);
      }
    }
  });
});

describe("getSupportedLanguages()", () => {
  it("should return 3 languages", () => {
    const langs = getSupportedLanguages();
    expect(langs).toHaveLength(3);
  });

  it("should include English, Hindi, Marathi", () => {
    const langs = getSupportedLanguages();
    const codes = langs.map((l) => l.code);
    expect(codes).toContain("en");
    expect(codes).toContain("hi");
    expect(codes).toContain("mr");
  });

  it("should have display names", () => {
    const langs = getSupportedLanguages();
    for (const lang of langs) {
      expect(lang.name.length).toBeGreaterThan(0);
    }
  });
});
