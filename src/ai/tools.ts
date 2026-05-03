/**
 * Generative UI tool definitions for ElectAI.
 *
 * Each tool maps to a React component that gets streamed to the client.
 * Tools use Zod schemas for strict input validation and provide
 * fallback data from election-data module for demo mode.
 *
 * @module ai/tools
 */

import { tool } from "ai";
import { z } from "zod";
import {
  CONSTITUENCY_ROADMAP,
  ECI_FACTS,
  DEFAULT_FORM6_OUTPUT,
  VOTER_REGISTRATION_CHECKLIST,
  EVM_VOTING_STEPS,
} from "@/lib/election-data";

/** Tool: Display Form 6 voter registration wizard. */
export const showForm6Wizard = tool({
  description:
    "Display an interactive Form 6 voter registration wizard. Use when user asks about eligibility, voter registration, Form 6, or voter ID.",
  inputSchema: z.object({
    state: z.string().describe("Indian state for state-specific requirements"),
    eligible: z.boolean().describe("Overall eligibility assessment"),
    summary: z.string().describe("Summary of eligibility"),
    requirements: z.array(
      z.object({
        id: z.string(),
        label: z.string(),
        description: z.string(),
        met: z.boolean().default(false),
        category: z.enum(["citizenship", "age", "residency", "registration", "id"]),
      }),
    ),
    registrationUrl: z.string().optional(),
  }),
  execute: async (params) => (params.requirements.length > 0 ? params : DEFAULT_FORM6_OUTPUT),
});

/** Tool: Display EVM/VVPAT voting simulator. */
export const showEVMSimulator = tool({
  description:
    "Display an interactive EVM/VVPAT voting simulator. Use when user asks about how to vote, EVM, VVPAT, or election day.",
  inputSchema: z.object({
    title: z.string().describe("Simulator title"),
    description: z.string().describe("Brief description"),
    steps: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        instruction: z.string().optional(),
        icon: z.string().optional(),
      }),
    ),
  }),
  execute: async (params) => (params.steps.length > 0 ? params : EVM_VOTING_STEPS),
});

/** Tool: Display election timeline roadmap. */
export const showConstituencyRoadmap = tool({
  description:
    "Display an interactive election phase timeline. Use when user asks about election dates, phases, or schedule.",
  inputSchema: z.object({
    title: z.string().describe("Timeline title"),
    description: z.string().describe("Brief description"),
    state: z.string().optional().describe("Indian state"),
    steps: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        details: z.string().optional(),
        status: z.enum(["completed", "current", "upcoming"]).default("upcoming"),
        date: z.string().optional(),
        icon: z.string().optional(),
      }),
    ),
  }),
  execute: async (params) => (params.steps.length > 0 ? params : CONSTITUENCY_ROADMAP),
});

/** Tool: Display ECI fact card. */
export const showFactCard = tool({
  description:
    "Display a fact card with ECI election information. Use for facts, statistics, or general knowledge.",
  inputSchema: z.object({
    title: z.string(),
    summary: z.string(),
    facts: z.array(
      z.object({
        label: z.string(),
        value: z.string(),
        icon: z.string().optional(),
      }),
    ),
    sources: z.array(z.object({ title: z.string(), url: z.string().optional() })).optional(),
  }),
  execute: async (params) => (params.facts.length > 0 ? params : ECI_FACTS),
});

/** Tool: Display interactive voter checklist. */
export const showChecklist = tool({
  description:
    "Display an interactive voter checklist. Use when user wants preparation steps or document requirements.",
  inputSchema: z.object({
    title: z.string(),
    description: z.string(),
    items: z.array(
      z.object({
        id: z.string(),
        text: z.string(),
        description: z.string().optional(),
        completed: z.boolean().default(false),
        url: z.string().optional(),
        priority: z.enum(["high", "medium", "low"]).default("medium"),
      }),
    ),
  }),
  execute: async (params) => (params.items.length > 0 ? params : VOTER_REGISTRATION_CHECKLIST),
});

/** All tools bundled for the streamText call. */
export const electionTools = {
  showForm6Wizard,
  showEVMSimulator,
  showConstituencyRoadmap,
  showFactCard,
  showChecklist,
};
