"use client";

import type { Language } from "@/lib/i18n";
import type { ChatMessage } from "@/types/chat";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FeedbackButton } from "@/components/ui/FeedbackButton";

export type { ChatMessage };

interface MessageBubbleProps {
  /** The chat message to render. */
  message: ChatMessage;
  /** Current display language. */
  language: Language;
}

/**
 * Renders a single chat message bubble.
 * User messages appear on the right, assistant messages on the left
 * with markdown rendering and feedback buttons.
 */
export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const textContent = message.content || "";

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fade-in-up`}
      role="article"
      aria-label={`${isUser ? "You" : "ElectAI"} said`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-indigo-600 text-white rounded-br-md"
            : "bg-slate-800/80 text-gray-200 border border-white/5 rounded-bl-md"
        }`}
      >
        {/* Avatar */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm">{isUser ? "👤" : "🗳️"}</span>
          <span className="text-xs font-medium opacity-70">{isUser ? "You" : "ElectAI"}</span>
        </div>

        {/* Content */}
        <div className="text-sm leading-relaxed prose prose-invert prose-sm max-w-none">
          {textContent ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{textContent}</ReactMarkdown>
          ) : (
            <p>...</p>
          )}
        </div>

        {/* Feedback (assistant only) */}
        {!isUser && textContent && (
          <div className="mt-2 pt-2 border-t border-white/5">
            <FeedbackButton messageId={message.id} />
          </div>
        )}
      </div>
    </div>
  );
}
