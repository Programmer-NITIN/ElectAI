/**
 * Barrel export for the lib module.
 * Provides a single import point for all shared library utilities.
 *
 * @module lib
 */

export { cn, sanitizeInput, formatDate, truncate, debounce, announceToScreenReader } from "./utils";
export { logger } from "./logger";
export { t, getChips, getSupportedLanguages, type Language } from "./i18n";
export { trackEvent, analyticsEvents } from "./analytics";
export {
  isFirebaseConfigured,
  app,
  db,
  auth,
  googleProvider,
  getAnalyticsInstance,
} from "./firebase";

// ── Constants (explicit re-exports for clear public API) ──────────────
export {
  RATE_LIMIT_WINDOW_MS,
  MAX_REQUESTS_PER_WINDOW,
  MAX_MESSAGE_LENGTH,
  MAX_CONVERSATION_LENGTH,
  MAX_TTS_LENGTH,
  MAX_TRANSLATE_LENGTH,
  CHIP_COUNT,
  SCROLL_DEBOUNCE_MS,
  ENTRANCE_ANIMATION_DURATION,
  STAGGER_DELAY,
  DESKTOP_BREAKPOINT,
  COLLECTION_FEEDBACK,
  COLLECTION_ANALYTICS,
  COLLECTION_SESSIONS,
  COLLECTION_USERS,
  ENABLE_CLOUD_TTS,
  ENABLE_CLOUD_TRANSLATE,
  ENABLE_ANALYTICS,
  ENABLE_CLOUD_VISION,
  ENABLE_CLOUD_LOGGING,
  ENABLE_GOOGLE_MAPS,
  ENABLE_RECAPTCHA,
  MAX_PAYLOAD_SIZE,
  MAX_OCR_FILE_SIZE,
  ALLOWED_IMAGE_TYPES,
  APP_NAME,
  APP_TAGLINE,
  APP_DESCRIPTION,
  APP_URL,
  VERTEX_AI_REGION,
  GA_MEASUREMENT_ID,
  GOOGLE_MAPS_EMBED_URL,
  RECAPTCHA_VERIFY_URL,
} from "./constants";

// ── Schemas (explicit re-exports for clear public API) ────────────────
export {
  epicNumberSchema,
  mobileNumberSchema,
  aadhaarSchema,
  pincodeSchema,
  chatMessageSchema,
  type ChatMessageInput,
  form6DataSchema,
  type Form6Data,
  constituencyPhaseSchema,
  type ConstituencyPhase,
  constituencyRoadmapSchema,
  type ConstituencyRoadmap,
  evmStepSchema,
  type EVMStep,
  evmSimulatorOutputSchema,
  type EVMSimulatorOutput,
  sourceSchema,
  type Source,
  factSchema,
  type Fact,
  factCardOutputSchema,
  type FactCardOutput,
  checklistItemSchema,
  type ChecklistItem,
  checklistOutputSchema,
  type ChecklistOutput,
  requirementSchema,
  type Requirement,
  form6WizardOutputSchema,
  type Form6WizardOutput,
  ocrResultSchema,
  type OCRResult,
  feedbackSchema,
  type Feedback,
} from "./schemas";
