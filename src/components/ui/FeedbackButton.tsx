"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";

interface FeedbackButtonProps {
  messageId: string;
}

/**
 * Feedback button pair for AI responses.
 * Allows users to rate responses as helpful/not helpful.
 */
export function FeedbackButton({ messageId }: FeedbackButtonProps) {
  const [feedback, setFeedback] = useState<"positive" | "negative" | null>(null);

  const handleFeedback = (rating: "positive" | "negative") => {
    setFeedback(rating);
    // Analytics tracking would go here
    void messageId; // Used for analytics context
  };

  if (feedback) {
    return (
      <div aria-live="polite">
        <span className="text-xs text-gray-500">
          {feedback === "positive" ? "👍 Thanks!" : "👎 We'll improve"}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1" role="group" aria-label="Rate this response">
      <button
        onClick={() => handleFeedback("positive")}
        className="p-1 rounded text-gray-500 hover:text-green-400 hover:bg-green-400/10 transition-colors focus:outline-none focus:ring-1 focus:ring-green-400"
        aria-label="Helpful"
        title="Helpful"
      >
        <ThumbsUp size={14} />
      </button>
      <button
        onClick={() => handleFeedback("negative")}
        className="p-1 rounded text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-colors focus:outline-none focus:ring-1 focus:ring-red-400"
        aria-label="Not helpful"
        title="Not helpful"
      >
        <ThumbsDown size={14} />
      </button>
    </div>
  );
}
