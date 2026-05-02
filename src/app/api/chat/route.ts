/**
 * Streaming chat API route for ElectAI.
 *
 * Implements multi-agent routing with Gemini AI:
 * 1. Validates input using Zod schemas
 * 2. Routes to specialized agent based on intent
 * 3. Streams response with generative UI tools
 * 4. Falls back to demo mode when no API key is configured
 *
 * @module api/chat
 */

import { streamText, type ModelMessage } from "ai";
import { explainerModel, isApiKeyConfigured, AGENT_TEMPERATURES } from "@/ai/agents";
import { electionTools } from "@/ai/tools";
import { EXPLAINER_PROMPT } from "@/ai/system-prompts";
import { chatMessageSchema } from "@/lib/schemas";
import { MAX_CONVERSATION_LENGTH } from "@/lib/constants";
import { DEMO_INTENTS } from "@/lib/election-data";
import { logger } from "@/lib/logger";
import { sanitizeInput } from "@/lib/utils";

interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  parts?: Array<{ type: string; text?: string }>;
}

/**
 * Extract text content from a message.
 */
function getMessageText(message: ChatMessage): string {
  if (Array.isArray(message.parts)) {
    return message.parts
      .filter((p) => p.type === "text" && p.text)
      .map((p) => p.text || "")
      .join("");
  }
  return typeof message.content === "string" ? message.content : String(message.content || "");
}

/**
 * POST /api/chat — Streaming chat endpoint.
 * Accepts user messages and returns AI-generated responses with tool calls.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages } = body as { messages: ChatMessage[] };

    // Validate message count
    if (!messages || messages.length === 0) {
      return Response.json({ error: "No messages provided" }, { status: 400 });
    }

    if (messages.length > MAX_CONVERSATION_LENGTH) {
      return Response.json(
        { error: "Conversation limit reached. Please start a new chat." },
        { status: 400 },
      );
    }

    // Validate and sanitize the latest message
    const lastMessage = messages[messages.length - 1];
    const lastText = getMessageText(lastMessage);

    if (lastMessage.role === "user" && lastText) {
      const validation = chatMessageSchema.safeParse({
        content: lastText,
      });

      if (!validation.success) {
        return Response.json(
          { error: validation.error.issues[0]?.message || "Invalid message" },
          { status: 400 },
        );
      }
    }

    const sanitizedText = sanitizeInput(lastText);

    // Demo mode — keyword-based responses when no API key
    if (!isApiKeyConfigured()) {
      logger.info("Using demo mode (no API key)", { component: "chat" });
      const userText = sanitizedText.toLowerCase();

      const demoResponse = Object.entries(DEMO_INTENTS).find(([keyword]) =>
        userText.includes(keyword),
      );

      const responseText =
        demoResponse?.[1] ||
        "Welcome to ElectAI! 🗳️ I can help you understand the Indian election process.\n\n" +
        "Here are some topics I can help with:\n\n" +
        "- **Voter Registration**: How to register, Form 6 requirements, eligibility\n" +
        "- **EVM Voting**: Step-by-step EVM/VVPAT voting process\n" +
        "- **Election Timeline**: Key phases from announcement to results\n" +
        "- **Eligibility**: Age, citizenship, and documentation requirements\n" +
        "- **Documents Needed**: Voter ID (EPIC), Aadhaar, and other accepted IDs\n\n" +
        "Try asking one of the suggested questions to get started!";

      // Stream the demo response using SSE format compatible with our frontend
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          // Send text in SSE format: 0:"text"
          controller.enqueue(encoder.encode(`0:${JSON.stringify(responseText)}\n`));
          controller.close();
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    // AI mode — stream response with Gemini
    logger.info("Processing chat request", {
      component: "chat",
      messageCount: messages.length,
    });

    const result = streamText({
      model: explainerModel,
      system: EXPLAINER_PROMPT,
      messages: messages as ModelMessage[],
      tools: electionTools,
      temperature: AGENT_TEMPERATURES.explainer,
      maxOutputTokens: 2048,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    logger.error("Chat API error", {
      component: "chat",
      error: error instanceof Error ? error.message : "Unknown error",
    });

    return Response.json(
      { error: "An error occurred processing your request." },
      { status: 500 },
    );
  }
}
