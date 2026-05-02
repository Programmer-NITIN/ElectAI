/**
 * Zod validation schemas for ElectAI.
 *
 * Provides strict runtime validation for all data shapes used across the
 * platform — from user input (voter ID, Aadhaar) to AI tool outputs
 * (EVM steps, timelines, checklists). All schemas use `.strict()` mode
 * to reject unknown fields, preventing data injection attacks.
 *
 * @module schemas
 */

import { z } from "zod";

// ── Indian Voter ID (EPIC Number) ─────────────────────────────────────

/** Validates an EPIC (Electoral Photo Identity Card) number: 3 uppercase letters + 7 digits. */
export const epicNumberSchema = z
  .string()
  .regex(
    /^[A-Z]{3}\d{7}$/,
    "EPIC number must be 3 uppercase letters followed by 7 digits (e.g., ABC1234567)",
  );

// ── Indian Mobile Number ──────────────────────────────────────────────

/** Validates a 10-digit Indian mobile number starting with 6-9. */
export const mobileNumberSchema = z
  .string()
  .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number");

// ── Aadhaar Number ────────────────────────────────────────────────────

/** Validates a 12-digit Aadhaar number. */
export const aadhaarSchema = z
  .string()
  .regex(/^\d{12}$/, "Aadhaar number must be exactly 12 digits");

// ── PIN Code ──────────────────────────────────────────────────────────

/** Validates a 6-digit Indian PIN code. */
export const pincodeSchema = z
  .string()
  .regex(/^\d{6}$/, "Enter a valid 6-digit PIN code");

// ── Chat Message ──────────────────────────────────────────────────────

/** Validates a user chat message with length constraints. */
export const chatMessageSchema = z.object({
  content: z
    .string()
    .min(1, "Message cannot be empty")
    .max(2000, "Message must be under 2000 characters"),
  language: z.enum(["en", "hi", "mr"]).default("en"),
}).strict();

export type ChatMessage = z.infer<typeof chatMessageSchema>;

// ── Form 6 (New Voter Registration) ───────────────────────────────────

/** Validates Form 6 voter registration data with all required fields. */
export const form6DataSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  fatherName: z.string().min(2, "Father's/Mother's name is required"),
  dob: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["male", "female", "other"]),
  mobile: mobileNumberSchema,
  aadhaar: aadhaarSchema.optional(),
  epicNumber: epicNumberSchema.optional(),
  state: z.string().min(1, "State is required"),
  district: z.string().min(1, "District is required"),
  assemblyConstituency: z.string().min(1, "Assembly constituency is required"),
  address: z.string().min(5, "Full address is required"),
  pincode: pincodeSchema,
  idProofType: z.enum(["aadhaar", "passport", "driving_license", "pan_card", "ration_card"]),
}).strict();

export type Form6Data = z.infer<typeof form6DataSchema>;

// ── Constituency Phase ────────────────────────────────────────────────

/** Validates a single election timeline phase/step. */
export const constituencyPhaseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  details: z.string().optional(),
  status: z.enum(["completed", "current", "upcoming"]).default("upcoming"),
  date: z.string().optional(),
  icon: z.string().optional(),
}).strict();

export type ConstituencyPhase = z.infer<typeof constituencyPhaseSchema>;

/** Validates a complete constituency roadmap with multiple phases. */
export const constituencyRoadmapSchema = z.object({
  title: z.string(),
  description: z.string(),
  state: z.string().optional(),
  steps: z.array(constituencyPhaseSchema),
}).strict();

export type ConstituencyRoadmap = z.infer<typeof constituencyRoadmapSchema>;

// ── EVM Simulator ─────────────────────────────────────────────────────

/** Validates a single EVM voting step. */
export const evmStepSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  instruction: z.string().optional(),
  icon: z.string().optional(),
}).strict();

export type EVMStep = z.infer<typeof evmStepSchema>;

/** Validates complete EVM simulator output. */
export const evmSimulatorOutputSchema = z.object({
  title: z.string(),
  description: z.string(),
  steps: z.array(evmStepSchema),
}).strict();

export type EVMSimulatorOutput = z.infer<typeof evmSimulatorOutputSchema>;

// ── Fact Card ─────────────────────────────────────────────────────────

/** Validates a source reference for fact cards. */
export const sourceSchema = z.object({
  title: z.string(),
  url: z.string().url().optional(),
}).strict();

export type Source = z.infer<typeof sourceSchema>;

/** Validates a single fact entry. */
export const factSchema = z.object({
  label: z.string(),
  value: z.string(),
  icon: z.string().optional(),
}).strict();

export type Fact = z.infer<typeof factSchema>;

/** Validates complete fact card output. */
export const factCardOutputSchema = z.object({
  title: z.string(),
  summary: z.string(),
  facts: z.array(factSchema),
  sources: z.array(sourceSchema).optional(),
}).strict();

export type FactCardOutput = z.infer<typeof factCardOutputSchema>;

// ── Checklist ─────────────────────────────────────────────────────────

/** Validates a single checklist item with priority. */
export const checklistItemSchema = z.object({
  id: z.string(),
  text: z.string(),
  description: z.string().optional(),
  completed: z.boolean().default(false),
  url: z.string().optional(),
  priority: z.enum(["high", "medium", "low"]).default("medium"),
}).strict();

export type ChecklistItem = z.infer<typeof checklistItemSchema>;

/** Validates complete checklist output. */
export const checklistOutputSchema = z.object({
  title: z.string(),
  description: z.string(),
  items: z.array(checklistItemSchema),
}).strict();

export type ChecklistOutput = z.infer<typeof checklistOutputSchema>;

// ── Eligibility (Form 6 Wizard) Output ────────────────────────────────

/** Validates a single eligibility requirement. */
export const requirementSchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string(),
  met: z.boolean().default(false),
  category: z.enum(["citizenship", "age", "residency", "registration", "id"]),
}).strict();

export type Requirement = z.infer<typeof requirementSchema>;

/** Validates complete Form 6 wizard output. */
export const form6WizardOutputSchema = z.object({
  state: z.string(),
  eligible: z.boolean(),
  summary: z.string(),
  requirements: z.array(requirementSchema),
  registrationUrl: z.string().optional(),
}).strict();

export type Form6WizardOutput = z.infer<typeof form6WizardOutputSchema>;

// ── OCR Result (Cloud Vision) ─────────────────────────────────────────

/** Validates OCR extraction result from voter ID. */
export const ocrResultSchema = z.object({
  text: z.string(),
  confidence: z.number().min(0).max(1),
  detectedFields: z.object({
    name: z.string().optional(),
    epicNumber: z.string().optional(),
    fatherName: z.string().optional(),
    address: z.string().optional(),
  }).strict(),
}).strict();

export type OCRResult = z.infer<typeof ocrResultSchema>;

// ── Feedback ──────────────────────────────────────────────────────────

/** Validates user feedback on AI responses. */
export const feedbackSchema = z.object({
  messageId: z.string(),
  rating: z.enum(["positive", "negative"]),
  comment: z.string().max(500).optional(),
  timestamp: z.string().datetime(),
}).strict();

export type Feedback = z.infer<typeof feedbackSchema>;
