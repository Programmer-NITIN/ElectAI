/**
 * Tests for the FeedbackButton component.
 * @group component
 */

import { render, screen, fireEvent } from "@testing-library/react";
import { FeedbackButton } from "@/components/ui/FeedbackButton";

describe("FeedbackButton", () => {
  it("should render both thumbs up and down buttons", () => {
    render(<FeedbackButton messageId="msg-1" />);
    expect(screen.getByLabelText("Helpful")).toBeInTheDocument();
    expect(screen.getByLabelText("Not helpful")).toBeInTheDocument();
  });

  it("should show thanks message after positive feedback", () => {
    render(<FeedbackButton messageId="msg-1" />);
    fireEvent.click(screen.getByLabelText("Helpful"));
    expect(screen.getByText(/Thanks/)).toBeInTheDocument();
  });

  it("should show improve message after negative feedback", () => {
    render(<FeedbackButton messageId="msg-1" />);
    fireEvent.click(screen.getByLabelText("Not helpful"));
    expect(screen.getByText(/improve/i)).toBeInTheDocument();
  });

  it("should have a group role for accessibility", () => {
    render(<FeedbackButton messageId="msg-1" />);
    expect(screen.getByRole("group")).toBeInTheDocument();
  });

  it("should hide buttons after feedback is given", () => {
    render(<FeedbackButton messageId="msg-1" />);
    fireEvent.click(screen.getByLabelText("Helpful"));
    expect(screen.queryByLabelText("Helpful")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Not helpful")).not.toBeInTheDocument();
  });
});
