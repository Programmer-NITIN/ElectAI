/**
 * Shared chat message types used across API routes and UI components.
 *
 * Single source of truth for message shapes — prevents DRY violations
 * between the server (route.ts) and client (MessageBubble.tsx).
 *
 * @module types/chat
 */

/** Valid roles for a chat message in the ElectAI conversation. */
export type ChatRole = "user" | "assistant" | "system" | "tool";

/** A single message in the chat conversation. */
export interface ChatMessage {
  /** Unique identifier for the message. */
  id: string;
  /** The role of the message sender. */
  role: ChatRole;
  /** Plain text content of the message. */
  content: string;
  /** Optional structured parts (used by AI SDK streaming). */
  parts?: Array<{ type: string; text?: string }>;
}
