/**
 * Application-wide constants for ElectAI.
 *
 * Centralizes all magic numbers, configuration values, and feature flags
 * used across the platform. Prevents scattered literals and improves
 * maintainability. Every numeric/string literal in the codebase references
 * a named constant from this module.
 *
 * @module constants
 */

// ── Rate Limiting ─────────────────────────────────────────────────────

/** Duration of the rate limit window in milliseconds (1 minute). */
export const RATE_LIMIT_WINDOW_MS = 60_000;

/** Maximum API requests allowed per rate limit window. */
export const MAX_REQUESTS_PER_WINDOW = 30;

// ── Chat Constraints ──────────────────────────────────────────────────

/** Maximum character length for a single user message. */
export const MAX_MESSAGE_LENGTH = 2000;

/** Maximum number of messages in a single conversation. */
export const MAX_CONVERSATION_LENGTH = 50;

/** Maximum text length for TTS synthesis (characters). */
export const MAX_TTS_LENGTH = 1000;

/** Maximum text length for translation requests (characters). */
export const MAX_TRANSLATE_LENGTH = 5000;

// ── UI Configuration ──────────────────────────────────────────────────

/** Number of suggestion chips displayed on the welcome screen. */
export const CHIP_COUNT = 5;

/** Auto-scroll debounce delay in milliseconds. */
export const SCROLL_DEBOUNCE_MS = 100;

/** Animation duration for component entrance effects (seconds). */
export const ENTRANCE_ANIMATION_DURATION = 0.4;

/** Animation stagger delay between sequential items (seconds). */
export const STAGGER_DELAY = 0.08;

/** Minimum viewport width considered as desktop (pixels). */
export const DESKTOP_BREAKPOINT = 768;

// ── Firebase Collection Names ─────────────────────────────────────────

/** Firestore collection for user feedback on AI responses. */
export const COLLECTION_FEEDBACK = "feedback";

/** Firestore collection for daily analytics aggregates. */
export const COLLECTION_ANALYTICS = "daily_analytics";

/** Firestore collection for chat session tracking. */
export const COLLECTION_SESSIONS = "sessions";

/** Firestore collection for user profiles. */
export const COLLECTION_USERS = "users";

// ── Feature Flags ─────────────────────────────────────────────────────

/** Whether the Google Cloud TTS API is enabled (vs browser Web Speech API). */
export const ENABLE_CLOUD_TTS = Boolean(process.env.GOOGLE_APPLICATION_CREDENTIALS);

/** Whether the Google Cloud Translation API is enabled. */
export const ENABLE_CLOUD_TRANSLATE = Boolean(process.env.GOOGLE_CLOUD_PROJECT);

/** Whether Firebase Analytics is enabled. */
export const ENABLE_ANALYTICS = Boolean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY);

/** Whether Google Cloud Vision OCR is enabled. */
export const ENABLE_CLOUD_VISION = Boolean(process.env.GOOGLE_APPLICATION_CREDENTIALS);

/** Whether Google Cloud Logging is enabled (auto-detected on Cloud Run). */
export const ENABLE_CLOUD_LOGGING = Boolean(process.env.K_SERVICE);

/** Whether Google Maps integration is enabled. */
export const ENABLE_GOOGLE_MAPS = Boolean(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);

/** Whether reCAPTCHA bot protection is enabled. */
export const ENABLE_RECAPTCHA = Boolean(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY);

// ── Input Validation ──────────────────────────────────────────────────

/** Maximum allowed payload size in bytes (1 MB). */
export const MAX_PAYLOAD_SIZE = 1_048_576;

/** Maximum file upload size for OCR in bytes (5 MB). */
export const MAX_OCR_FILE_SIZE = 5_242_880;

/** Allowed image MIME types for OCR upload. */
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

// ── SEO & Metadata ────────────────────────────────────────────────────

/** Application name used in metadata and branding. */
export const APP_NAME = "ElectAI";

/** Application tagline. */
export const APP_TAGLINE = "AI-Powered Election Process Education";

/** Application description for meta tags. */
export const APP_DESCRIPTION =
  "An interactive AI assistant that educates Indian citizens on ECI processes, voter registration, EVM voting, election timelines, and democratic participation.";

/** Application URL. */
export const APP_URL = "https://electai.web.app";

// ── Google Services Configuration ─────────────────────────────────────

/** Default Vertex AI region for Google Cloud. */
export const VERTEX_AI_REGION = "asia-south1";

/** Google Analytics Measurement ID. */
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";

/** Google Maps embed base URL. */
export const GOOGLE_MAPS_EMBED_URL = "https://www.google.com/maps/embed/v1";

/** reCAPTCHA verify endpoint. */
export const RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";
