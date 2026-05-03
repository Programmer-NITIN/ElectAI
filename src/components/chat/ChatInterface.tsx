"use client";

import { useState, useRef, useEffect, useCallback, type FormEvent } from "react";
import { MessageBubble, type ChatMessage } from "./MessageBubble";
import { getChips, t, type Language } from "@/lib/i18n";
import { MAX_MESSAGE_LENGTH } from "@/lib/constants";
import { sanitizeInput } from "@/lib/utils";
import { Send, Mic, Volume2 } from "lucide-react";

/**
 * Main chat interface component.
 * Implements: message history, input validation, suggestion chips,
 * voice input/output, and auto-scrolling.
 */
export function ChatInterface() {
  const [language] = useState<Language>("en");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  /** Auto-scroll to the latest message. */
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  /** Announce text to screen readers via the live region. */
  const announceToScreenReader = (text: string) => {
    const announcer = document.getElementById("sr-announcer");
    if (announcer) {
      announcer.textContent = text;
      setTimeout(() => {
        announcer.textContent = "";
      }, 1000);
    }
  };

  /** Handle sending a message to the API. */
  const sendMessage = async (text: string) => {
    const sanitized = sanitizeInput(text.trim());
    if (!sanitized || sanitized.length > MAX_MESSAGE_LENGTH) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: sanitized,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      // Read streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";
      const assistantId = crypto.randomUUID();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          // Parse SSE-like lines for text content
          const lines = chunk.split("\n");
          for (const line of lines) {
            if (line.startsWith("0:")) {
              // AI SDK text stream format: 0:"text content"
              try {
                const textContent = JSON.parse(line.slice(2));
                if (typeof textContent === "string") {
                  assistantText += textContent;
                }
              } catch {
                // Non-JSON line, skip
              }
            }
          }

          // Update message in state for real-time display
          setMessages([
            ...updatedMessages,
            {
              id: assistantId,
              role: "assistant",
              content: assistantText,
            },
          ]);
        }
      }

      // Final update
      if (assistantText) {
        setMessages([
          ...updatedMessages,
          {
            id: assistantId,
            role: "assistant",
            content: assistantText,
          },
        ]);
      }

      announceToScreenReader(t("a11y.newMessage", language));
    } catch {
      announceToScreenReader(t("chat.error", language));
      setMessages([
        ...updatedMessages,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: t("chat.error", language),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  /** Handle suggestion chip click. */
  const handleChipClick = (chipText: string) => {
    sendMessage(chipText);
  };

  /** Handle form submission. */
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  /** Handle Enter key (submit) vs Shift+Enter (newline). */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const chips = getChips(language);
  const showWelcome = messages.length === 0;

  return (
    <div className="flex flex-col h-full" role="region" aria-label="Chat interface">
      {/* Messages Area */}
      <div
        className="flex-1 overflow-y-auto px-4 py-6 space-y-4"
        role="log"
        aria-label="Chat messages"
        aria-live="polite"
      >
        {showWelcome && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 animate-fade-in-up">
            <div className="text-6xl mb-4" role="img" aria-label="Ballot box emoji">
              🗳️
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{t("welcome.title", language)}</h2>
            <p className="text-gray-400 mb-8 max-w-md">{t("welcome.subtitle", language)}</p>

            {/* Suggestion Chips */}
            <div
              className="flex flex-wrap justify-center gap-2 max-w-lg"
              role="group"
              aria-label="Suggested questions"
            >
              {chips.map((chip, index) => (
                <button
                  key={index}
                  onClick={() => handleChipClick(chip)}
                  className="px-4 py-2 bg-slate-800/60 hover:bg-slate-700/80 border border-white/10 hover:border-indigo-500/50 rounded-full text-sm text-gray-300 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-label={`Ask: ${chip}`}
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} language={language} />
        ))}

        {isLoading && (
          <div
            className="flex items-center gap-2 text-gray-400 text-sm pl-4"
            role="status"
            aria-live="polite"
            aria-busy="true"
            aria-label="Loading response"
          >
            <div className="flex gap-1" aria-hidden="true">
              <span
                className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <span
                className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <span
                className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
            <span>{t("chat.thinking", language)}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-white/10 bg-slate-900/80 backdrop-blur-sm p-4">
        <form id="chat-form" onSubmit={onSubmit} className="max-w-4xl mx-auto flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t("welcome.placeholder", language)}
              rows={1}
              maxLength={MAX_MESSAGE_LENGTH}
              className="w-full bg-slate-800 text-white rounded-xl px-4 py-3 pr-12 resize-none border border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none placeholder-gray-500 text-sm"
              aria-label="Type your message"
              aria-describedby="char-count"
              disabled={isLoading}
            />
            <span
              id="char-count"
              className="absolute bottom-1 right-3 text-xs text-gray-600"
              aria-live="off"
            >
              {input.length}/{MAX_MESSAGE_LENGTH}
            </span>
          </div>

          {/* Voice Input Button */}
          <button
            type="button"
            className="p-3 rounded-xl bg-slate-800 border border-white/10 text-gray-400 hover:text-white hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Voice input"
            title="Speak your question"
          >
            <Mic size={18} />
          </button>

          {/* TTS Button */}
          <button
            type="button"
            className="p-3 rounded-xl bg-slate-800 border border-white/10 text-gray-400 hover:text-white hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Read aloud"
            title="Listen to response"
          >
            <Volume2 size={18} />
          </button>

          {/* Send Button */}
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            aria-label={t("chat.send", language)}
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
