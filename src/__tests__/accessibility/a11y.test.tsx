/**
 * Accessibility (a11y) tests for ElectAI components and pages.
 * Validates WCAG 2.1 AA compliance across all interactive components.
 * @group accessibility
 */

import { render, screen, fireEvent } from "@testing-library/react";
import { Header } from "@/components/ui/Header";
import { FeedbackButton } from "@/components/ui/FeedbackButton";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { EVMSimulator } from "@/components/generative/EVMSimulator";
import { ActionChecklist } from "@/components/generative/ActionChecklist";
import { InteractiveTimeline } from "@/components/generative/InteractiveTimeline";
import { FactCard } from "@/components/generative/FactCard";

// Mock react-markdown (ESM module) to avoid transform issues
jest.mock("react-markdown", () => {
  return {
    __esModule: true,
    default: ({ children }: { children: string }) => <p>{children}</p>,
  };
});

jest.mock("remark-gfm", () => ({
  __esModule: true,
  default: () => {},
}));

// Now import components that depend on react-markdown
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { ChatInterface } = require("@/components/chat/ChatInterface");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { MessageBubble } = require("@/components/chat/MessageBubble");

// ── Test Data ─────────────────────────────────────────────────────────

const evmData = {
  title: "EVM Voting Guide",
  description: "Learn to vote",
  steps: [
    { id: "1", title: "Step 1", description: "Enter booth" },
    { id: "2", title: "Step 2", description: "Press button" },
  ],
};

const timelineData = {
  title: "Timeline",
  description: "Election phases",
  steps: [
    { id: "1", title: "Phase 1", description: "Announcement", status: "completed" as const },
    { id: "2", title: "Phase 2", description: "Voting", status: "upcoming" as const },
  ],
};

const checklistData = {
  title: "Checklist",
  description: "Registration steps",
  items: [
    { id: "1", text: "Get Form 6", completed: false, priority: "high" as const },
    { id: "2", text: "Submit docs", completed: false, priority: "medium" as const },
  ],
};

const factCardData = {
  title: "Election Facts",
  summary: "Key statistics",
  facts: [
    { label: "Voters", value: "970M" },
    { label: "Seats", value: "543" },
  ],
  sources: [{ title: "ECI", url: "https://eci.gov.in" }],
};

describe("Accessibility — WCAG 2.1 AA Compliance", () => {
  // ── Header ────────────────────────────────────────────────────────────

  describe("Header Component", () => {
    it("should have accessible language selector with aria-label", () => {
      render(<Header />);
      const select = screen.getByLabelText("Select language");
      expect(select).toHaveAttribute("id", "language-selector");
    });

    it("should have header landmark role (banner)", () => {
      render(<Header />);
      expect(screen.getByRole("banner")).toBeInTheDocument();
    });

    it("should have emoji with accessible alt text", () => {
      render(<Header />);
      expect(screen.getByLabelText("Ballot box emoji")).toBeInTheDocument();
    });
  });

  // ── FeedbackButton ────────────────────────────────────────────────────

  describe("FeedbackButton Component", () => {
    it("should have group role with label", () => {
      render(<FeedbackButton messageId="test" />);
      const group = screen.getByRole("group");
      expect(group).toHaveAttribute("aria-label", "Rate this response");
    });

    it("should have labeled buttons for helpful and not helpful", () => {
      render(<FeedbackButton messageId="test" />);
      expect(screen.getByLabelText("Helpful")).toBeInTheDocument();
      expect(screen.getByLabelText("Not helpful")).toBeInTheDocument();
    });
  });

  // ── ErrorBoundary ─────────────────────────────────────────────────────

  describe("ErrorBoundary Component", () => {
    it("should have alert role when error occurs", () => {
      const ThrowError = () => {
        throw new Error("test");
      };

      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    it("should have aria-live assertive on error", () => {
      const ThrowError = () => {
        throw new Error("test");
      };

      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      expect(screen.getByRole("alert")).toHaveAttribute("aria-live", "assertive");
    });

    it("should have accessible retry button", () => {
      const ThrowError = () => {
        throw new Error("test");
      };

      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      expect(screen.getByLabelText(/retry/i)).toBeInTheDocument();
    });
  });

  // ── Focus Management ──────────────────────────────────────────────────

  describe("Focus Management", () => {
    it("should have focus-visible styles on interactive elements", () => {
      const { container } = render(<Header />);
      const select = container.querySelector("select");
      expect(select?.className).toContain("focus:");
    });
  });

  // ── ARIA Attributes ───────────────────────────────────────────────────

  describe("ARIA Attributes", () => {
    it("should use semantic HTML elements", () => {
      render(<Header />);
      expect(screen.getByRole("banner")).toBeInTheDocument();
    });

    it("should have accessible names on all interactive elements", () => {
      render(<FeedbackButton messageId="test" />);
      const buttons = screen.getAllByRole("button");
      for (const button of buttons) {
        expect(button.getAttribute("aria-label") || button.textContent).toBeTruthy();
      }
    });
  });

  // ── ChatInterface Accessibility ───────────────────────────────────────

  describe("ChatInterface Component", () => {
    it("should have region role with Chat interface label", () => {
      render(<ChatInterface />);
      expect(screen.getByRole("region", { name: "Chat interface" })).toBeInTheDocument();
    });

    it("should have log role for messages area", () => {
      render(<ChatInterface />);
      expect(screen.getByRole("log", { name: "Chat messages" })).toBeInTheDocument();
    });

    it("should have aria-live polite on messages area", () => {
      render(<ChatInterface />);
      expect(screen.getByRole("log")).toHaveAttribute("aria-live", "polite");
    });

    it("should have labeled textarea for message input", () => {
      render(<ChatInterface />);
      expect(screen.getByLabelText("Type your message")).toBeInTheDocument();
    });

    it("should have aria-describedby on textarea pointing to char count", () => {
      render(<ChatInterface />);
      const textarea = screen.getByLabelText("Type your message");
      expect(textarea).toHaveAttribute("aria-describedby", "char-count");
    });

    it("should have labeled send button", () => {
      render(<ChatInterface />);
      expect(screen.getByLabelText(/send/i)).toBeInTheDocument();
    });

    it("should have labeled voice input button", () => {
      render(<ChatInterface />);
      expect(screen.getByLabelText("Voice input")).toBeInTheDocument();
    });

    it("should have labeled read aloud button", () => {
      render(<ChatInterface />);
      expect(screen.getByLabelText("Read aloud")).toBeInTheDocument();
    });

    it("should have suggestion chips with group role", () => {
      render(<ChatInterface />);
      expect(screen.getByRole("group", { name: "Suggested questions" })).toBeInTheDocument();
    });
  });

  // ── EVMSimulator Accessibility ────────────────────────────────────────

  describe("EVMSimulator Component", () => {
    it("should have region role with accessible name", () => {
      render(<EVMSimulator {...evmData} />);
      expect(screen.getByRole("region", { name: "EVM Voting Guide" })).toBeInTheDocument();
    });

    it("should have progressbar role with aria-valuenow", () => {
      render(<EVMSimulator {...evmData} />);
      const progressbar = screen.getByRole("progressbar");
      expect(progressbar).toHaveAttribute("aria-valuenow", "1");
      expect(progressbar).toHaveAttribute("aria-valuemax", "2");
    });

    it("should update progressbar aria-valuenow on navigation", () => {
      render(<EVMSimulator {...evmData} />);
      fireEvent.click(screen.getByLabelText("Next step"));
      expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "2");
    });

    it("should have labeled navigation buttons", () => {
      render(<EVMSimulator {...evmData} />);
      expect(screen.getByLabelText("Previous step")).toBeInTheDocument();
      expect(screen.getByLabelText("Next step")).toBeInTheDocument();
    });
  });

  // ── ActionChecklist Accessibility ─────────────────────────────────────

  describe("ActionChecklist Component", () => {
    it("should have region role with accessible name", () => {
      render(<ActionChecklist {...checklistData} />);
      expect(screen.getByRole("region", { name: "Checklist" })).toBeInTheDocument();
    });

    it("should have list role with accessible name", () => {
      render(<ActionChecklist {...checklistData} />);
      expect(screen.getByRole("list", { name: "Checklist items" })).toBeInTheDocument();
    });

    it("should have checkbox role on each item", () => {
      render(<ActionChecklist {...checklistData} />);
      const checkboxes = screen.getAllByRole("checkbox");
      expect(checkboxes.length).toBe(2);
    });

    it("should have aria-checked attribute on checkboxes", () => {
      render(<ActionChecklist {...checklistData} />);
      const checkboxes = screen.getAllByRole("checkbox");
      for (const cb of checkboxes) {
        expect(cb).toHaveAttribute("aria-checked", "false");
      }
    });

    it("should toggle aria-checked on click", () => {
      render(<ActionChecklist {...checklistData} />);
      const checkbox = screen.getByRole("checkbox", { name: "Get Form 6" });
      fireEvent.click(checkbox);
      expect(checkbox).toHaveAttribute("aria-checked", "true");
    });

    it("should have accessible label on each checkbox", () => {
      render(<ActionChecklist {...checklistData} />);
      expect(screen.getByRole("checkbox", { name: "Get Form 6" })).toBeInTheDocument();
      expect(screen.getByRole("checkbox", { name: "Submit docs" })).toBeInTheDocument();
    });
  });

  // ── InteractiveTimeline Accessibility ─────────────────────────────────

  describe("InteractiveTimeline Component", () => {
    it("should have region role with accessible name", () => {
      render(<InteractiveTimeline {...timelineData} />);
      expect(screen.getByRole("region", { name: "Timeline" })).toBeInTheDocument();
    });

    it("should have list role for phases", () => {
      render(<InteractiveTimeline {...timelineData} />);
      expect(screen.getByRole("list", { name: "Election phases" })).toBeInTheDocument();
    });

    it("should have listitem roles", () => {
      render(<InteractiveTimeline {...timelineData} />);
      expect(screen.getAllByRole("listitem").length).toBe(2);
    });
  });

  // ── FactCard Accessibility ────────────────────────────────────────────

  describe("FactCard Component", () => {
    it("should have region role with accessible name", () => {
      render(<FactCard {...factCardData} />);
      expect(screen.getByRole("region", { name: "Election Facts" })).toBeInTheDocument();
    });

    it("should have external links with noopener noreferrer", () => {
      render(<FactCard {...factCardData} />);
      const link = screen.getByText("ECI").closest("a");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
      expect(link).toHaveAttribute("target", "_blank");
    });
  });

  // ── MessageBubble Accessibility ───────────────────────────────────────

  describe("MessageBubble Component", () => {
    it("should have article role on user message", () => {
      render(
        <MessageBubble
          message={{ id: "1", role: "user", content: "Hello" }}
          language="en"
        />,
      );
      expect(screen.getByRole("article", { name: "You said" })).toBeInTheDocument();
    });

    it("should have article role on assistant message", () => {
      render(
        <MessageBubble
          message={{ id: "2", role: "assistant", content: "Hi there!" }}
          language="en"
        />,
      );
      expect(screen.getByRole("article", { name: "ElectAI said" })).toBeInTheDocument();
    });

    it("should render feedback button for assistant messages", () => {
      render(
        <MessageBubble
          message={{ id: "3", role: "assistant", content: "Response text" }}
          language="en"
        />,
      );
      expect(screen.getByRole("group", { name: "Rate this response" })).toBeInTheDocument();
    });

    it("should not render feedback button for user messages", () => {
      render(
        <MessageBubble
          message={{ id: "4", role: "user", content: "User question" }}
          language="en"
        />,
      );
      expect(screen.queryByRole("group", { name: "Rate this response" })).not.toBeInTheDocument();
    });
  });
});
