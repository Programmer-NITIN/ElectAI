/**
 * Google Cloud Vision API wrapper for ElectAI.
 * Provides OCR capabilities to scan and extract text from Voter ID (EPIC) cards.
 * @module google/vision
 */

import { logger } from "../logger";
import { MAX_OCR_FILE_SIZE, ALLOWED_IMAGE_TYPES } from "../constants";
import type { OCRResult } from "../schemas";

/** Whether Cloud Vision API is available. */
export function isVisionAvailable(): boolean {
  return Boolean(process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.GOOGLE_CLOUD_PROJECT);
}

/**
 * Extracts text from a voter ID card image using Google Cloud Vision OCR.
 * @param imageBuffer - Image file as a Buffer
 * @param mimeType - Image MIME type (jpeg, png, webp)
 * @returns Extracted OCR result with detected fields
 */
export async function extractVoterIdText(
  imageBuffer: Buffer,
  mimeType: string,
): Promise<OCRResult> {
  const defaultResult: OCRResult = {
    text: "",
    confidence: 0,
    detectedFields: {},
  };

  if (!ALLOWED_IMAGE_TYPES.includes(mimeType as typeof ALLOWED_IMAGE_TYPES[number])) {
    logger.warn("Invalid image type for OCR", { component: "vision", mimeType });
    return defaultResult;
  }

  if (imageBuffer.length > MAX_OCR_FILE_SIZE) {
    logger.warn("Image too large for OCR", {
      component: "vision",
      size: imageBuffer.length,
      maxSize: MAX_OCR_FILE_SIZE,
    });
    return defaultResult;
  }

  if (!isVisionAvailable()) {
    logger.warn("Cloud Vision not configured", { component: "vision" });
    return defaultResult;
  }

  try {
    const { ImageAnnotatorClient } = await import("@google-cloud/vision");
    const client = new ImageAnnotatorClient();

    const [result] = await client.textDetection({ image: { content: imageBuffer } });
    const fullText = result.fullTextAnnotation?.text || "";
    const confidence = result.fullTextAnnotation?.pages?.[0]?.confidence || 0;

    const detectedFields = parseVoterIdFields(fullText);

    logger.info("OCR extraction completed", {
      component: "vision",
      textLength: fullText.length,
      confidence,
      fieldsDetected: Object.keys(detectedFields).length,
    });

    return { text: fullText, confidence, detectedFields };
  } catch (error) {
    logger.error("OCR extraction failed", {
      component: "vision",
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return defaultResult;
  }
}

/**
 * Parses raw OCR text to extract voter ID fields using regex patterns.
 * @param text - Raw OCR text from the voter ID card
 * @returns Extracted fields (name, EPIC number, father's name, address)
 */
function parseVoterIdFields(text: string): OCRResult["detectedFields"] {
  const fields: OCRResult["detectedFields"] = {};

  const epicMatch = text.match(/[A-Z]{3}\d{7}/);
  if (epicMatch) fields.epicNumber = epicMatch[0];

  const nameMatch = text.match(/(?:Name|नाम)\s*[:\-]?\s*([A-Za-z\s]+)/i);
  if (nameMatch) fields.name = nameMatch[1].trim();

  const fatherMatch = text.match(/(?:Father|पिता|Husband)\s*[:\-]?\s*([A-Za-z\s]+)/i);
  if (fatherMatch) fields.fatherName = fatherMatch[1].trim();

  return fields;
}
