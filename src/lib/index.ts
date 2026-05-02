/**
 * Barrel export for the lib module.
 * @module lib
 */

export { cn, sanitizeInput, formatDate, truncate, debounce } from "./utils";
export { logger } from "./logger";
export { t, getChips, getSupportedLanguages, type Language } from "./i18n";
export { trackEvent, analyticsEvents } from "./analytics";
export { isFirebaseConfigured, app, db, auth, googleProvider, getAnalyticsInstance } from "./firebase";
export * from "./constants";
export * from "./schemas";
