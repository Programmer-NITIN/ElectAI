/**
 * Barrel export for Google Cloud service integrations.
 * @module google
 */

export { translateText, isTranslateAvailable, SUPPORTED_LANGUAGES } from "./translate";
export { synthesizeSpeech, isTTSAvailable } from "./tts";
export { isVertexConfigured, isAIConfigured, getProviderName, getVertexConfig } from "./vertex";
export { extractVoterIdText, isVisionAvailable } from "./vision";
export { writeCloudLog, isCloudLoggingAvailable, cloudLog } from "./logging";
export { getMapEmbedUrl, getDirectionsUrl, getStaticMapUrl, isMapsAvailable } from "./maps";
export { verifyRecaptcha, isRecaptchaAvailable } from "./recaptcha";
