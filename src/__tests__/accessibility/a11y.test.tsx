/**
 * Accessibility (a11y) tests for ElectAI components and pages.
 * Validates WCAG 2.1 AA compliance.
 * @group accessibility
 */

import { render, screen } from "@testing-library/react";
import { Header } from "@/components/ui/Header";
import { FeedbackButton } from "@/components/ui/FeedbackButton";
import { ErrorBoundary } from "@/components/ErrorBoundary";

describe("Accessibility — WCAG 2.1 AA Compliance", () => {
  describe("Header Component", () => {
    it("should have accessible language selector", () => {
      render(<Header />);
      const select = screen.getByLabelText("Select language");
      expect(select).toHaveAttribute("id", "language-selector");
    });

    it("should have header landmark role", () => {
      render(<Header />);
      expect(screen.getByRole("banner")).toBeInTheDocument();
    });

    it("should have emoji with accessible alt text", () => {
      render(<Header />);
      expect(screen.getByLabelText("Ballot box emoji")).toBeInTheDocument();
    });
  });

  describe("FeedbackButton Component", () => {
    it("should have group role with label", () => {
      render(<FeedbackButton messageId="test" />);
      const group = screen.getByRole("group");
      expect(group).toHaveAttribute("aria-label", "Rate this response");
    });

    it("should have labeled buttons", () => {
      render(<FeedbackButton messageId="test" />);
      expect(screen.getByLabelText("Helpful")).toBeInTheDocument();
      expect(screen.getByLabelText("Not helpful")).toBeInTheDocument();
    });
  });

  describe("ErrorBoundary Component", () => {
    it("should have alert role when error occurs", () => {
      const ThrowError = () => {
        throw new Error("test");
      };
      const spy = jest.spyOn(console, "error").mockImplementation();

      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      expect(screen.getByRole("alert")).toBeInTheDocument();
      spy.mockRestore();
    });

    it("should have aria-live assertive on error", () => {
      const ThrowError = () => {
        throw new Error("test");
      };
      const spy = jest.spyOn(console, "error").mockImplementation();

      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      expect(screen.getByRole("alert")).toHaveAttribute("aria-live", "assertive");
      spy.mockRestore();
    });

    it("should have accessible retry button", () => {
      const ThrowError = () => {
        throw new Error("test");
      };
      const spy = jest.spyOn(console, "error").mockImplementation();

      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      expect(screen.getByLabelText(/retry/i)).toBeInTheDocument();
      spy.mockRestore();
    });
  });

  describe("Focus Management", () => {
    it("should have focus-visible styles via CSS classes on interactive elements", () => {
      const { container } = render(<Header />);
      const select = container.querySelector("select");
      // Verify the element has a className that contains focus-related Tailwind utility
      expect(select?.className).toContain("focus:");
    });
  });

  describe("ARIA Attributes", () => {
    it("should use semantic HTML elements", () => {
      render(<Header />);
      expect(screen.getByRole("banner")).toBeInTheDocument(); // <header>
    });

    it("should have accessible names on all interactive elements", () => {
      render(<FeedbackButton messageId="test" />);
      const buttons = screen.getAllByRole("button");
      for (const button of buttons) {
        expect(button.getAttribute("aria-label") || button.textContent).toBeTruthy();
      }
    });
  });
});
