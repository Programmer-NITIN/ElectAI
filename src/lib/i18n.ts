/**
 * Internationalization (i18n) system for ElectAI.
 *
 * Provides trilingual support (English, Hindi, Marathi) with:
 * - Static UI string translations
 * - Welcome suggestion chip generation per language
 * - Automatic fallback to English for missing keys
 *
 * @module i18n
 */

/** Supported language codes. */
export type Language = "en" | "hi" | "mr";

/** Translation key-value map for a single language. */
type TranslationMap = Record<string, string>;

/** Complete translations for all supported languages. */
const translations: Record<Language, TranslationMap> = {
  en: {
    "welcome.title": "Welcome to ElectAI",
    "welcome.subtitle": "Your AI guide to Indian elections",
    "welcome.placeholder": "Ask about elections, voter registration, EVM voting...",
    "chat.send": "Send",
    "chat.thinking": "Thinking...",
    "chat.error": "Something went wrong. Please try again.",
    "chat.limit": "Message limit reached for this conversation.",
    "header.title": "ElectAI",
    "header.tagline": "AI Election Education",
    "language.en": "English",
    "language.hi": "हिन्दी",
    "language.mr": "मराठी",
    "theme.light": "Light Mode",
    "theme.dark": "Dark Mode",
    "a11y.skip": "Skip to content",
    "a11y.newMessage": "New message from assistant",
    "feedback.positive": "Helpful",
    "feedback.negative": "Not helpful",
    "evm.title": "EVM Voting Simulator",
    "form6.title": "Voter Registration Check",
    "timeline.title": "Election Timeline",
    "checklist.title": "Voter Checklist",
    "ocr.title": "Voter ID Scanner",
    "ocr.upload": "Upload Voter ID image",
    "ocr.processing": "Scanning document...",
    "booth.title": "Find Your Polling Booth",
  },
  hi: {
    "welcome.title": "ElectAI में आपका स्वागत है",
    "welcome.subtitle": "भारतीय चुनावों के लिए आपका AI मार्गदर्शक",
    "welcome.placeholder": "चुनाव, मतदाता पंजीकरण, EVM वोटिंग के बारे में पूछें...",
    "chat.send": "भेजें",
    "chat.thinking": "सोच रहा हूँ...",
    "chat.error": "कुछ गलत हो गया। कृपया पुनः प्रयास करें।",
    "chat.limit": "इस वार्तालाप की संदेश सीमा पूरी हो गई।",
    "header.title": "ElectAI",
    "header.tagline": "AI चुनाव शिक्षा",
    "language.en": "English",
    "language.hi": "हिन्दी",
    "language.mr": "मराठी",
    "theme.light": "लाइट मोड",
    "theme.dark": "डार्क मोड",
    "a11y.skip": "मुख्य सामग्री पर जाएं",
    "a11y.newMessage": "सहायक से नया संदेश",
    "feedback.positive": "सहायक",
    "feedback.negative": "सहायक नहीं",
    "evm.title": "EVM वोटिंग सिम्युलेटर",
    "form6.title": "मतदाता पंजीकरण जांच",
    "timeline.title": "चुनाव समयरेखा",
    "checklist.title": "मतदाता चेकलिस्ट",
    "ocr.title": "मतदाता पहचान पत्र स्कैनर",
    "ocr.upload": "मतदाता पहचान पत्र की तस्वीर अपलोड करें",
    "ocr.processing": "दस्तावेज़ स्कैन हो रहा है...",
    "booth.title": "अपना मतदान केंद्र खोजें",
  },
  mr: {
    "welcome.title": "ElectAI मध्ये आपले स्वागत आहे",
    "welcome.subtitle": "भारतीय निवडणुकांसाठी तुमचा AI मार्गदर्शक",
    "welcome.placeholder": "निवडणूक, मतदार नोंदणी, EVM मतदान याबद्दल विचारा...",
    "chat.send": "पाठवा",
    "chat.thinking": "विचार करत आहे...",
    "chat.error": "काहीतरी चूक झाली. कृपया पुन्हा प्रयत्न करा.",
    "chat.limit": "या संभाषणाची संदेश मर्यादा पूर्ण झाली.",
    "header.title": "ElectAI",
    "header.tagline": "AI निवडणूक शिक्षण",
    "language.en": "English",
    "language.hi": "हिन्दी",
    "language.mr": "मराठी",
    "theme.light": "लाइट मोड",
    "theme.dark": "डार्क मोड",
    "a11y.skip": "मुख्य सामग्रीवर जा",
    "a11y.newMessage": "सहाय्यकाकडून नवीन संदेश",
    "feedback.positive": "उपयुक्त",
    "feedback.negative": "उपयुक्त नाही",
    "evm.title": "EVM मतदान सिम्युलेटर",
    "form6.title": "मतदार नोंदणी तपासणी",
    "timeline.title": "निवडणूक कालरेषा",
    "checklist.title": "मतदार चेकलिस्ट",
    "ocr.title": "मतदार ओळखपत्र स्कॅनर",
    "ocr.upload": "मतदार ओळखपत्राची छायाचित्र अपलोड करा",
    "ocr.processing": "कागदपत्र स्कॅन होत आहे...",
    "booth.title": "तुमचे मतदान केंद्र शोधा",
  },
};

/**
 * Returns the translated string for a given key and language.
 * Falls back to English if the key is not found in the target language.
 *
 * @param key - Translation key (e.g., "welcome.title")
 * @param language - Target language code
 * @returns Translated string, or the key itself if not found in any language
 */
export function t(key: string, language: Language = "en"): string {
  return translations[language]?.[key] ?? translations.en[key] ?? key;
}

/** Welcome suggestion chip definitions per language. */
const chipSets: Record<Language, string[]> = {
  en: [
    "How do I register to vote?",
    "Show me the EVM voting process",
    "What documents do I need for Form 6?",
    "When are the next elections?",
    "Explain the election timeline",
  ],
  hi: [
    "मैं मतदाता पंजीकरण कैसे करूँ?",
    "EVM वोटिंग प्रक्रिया दिखाएं",
    "फॉर्म 6 के लिए कौन से दस्तावेज़ चाहिए?",
    "अगले चुनाव कब हैं?",
    "चुनाव की समयरेखा समझाएं",
  ],
  mr: [
    "मी मतदार नोंदणी कशी करू?",
    "EVM मतदान प्रक्रिया दाखवा",
    "फॉर्म 6 साठी कोणती कागदपत्रे लागतात?",
    "पुढील निवडणुका कधी आहेत?",
    "निवडणूक कालरेषा समजावून सांगा",
  ],
};

/**
 * Returns the suggestion chips for the welcome screen in the given language.
 *
 * @param language - Target language code
 * @returns Array of suggestion chip strings
 */
export function getChips(language: Language = "en"): string[] {
  return chipSets[language] ?? chipSets.en;
}

/**
 * Returns all supported languages with their display names.
 *
 * @returns Array of language objects with code and display name
 */
export function getSupportedLanguages(): Array<{ code: Language; name: string }> {
  return [
    { code: "en", name: "English" },
    { code: "hi", name: "हिन्दी" },
    { code: "mr", name: "मराठी" },
  ];
}
