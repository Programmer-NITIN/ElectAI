/**
 * Tests for the global Error page.
 * Verifies error display, retry mechanism, and accessibility.
 * @group components
 */

import { render, screen, fireEvent } from "@testing-library/react";
import ErrorPage from "@/app/error";

describe("Error Page", () => {
  const mockReset = jest.fn();

  beforeEach(() => {
    mockReset.mockClear();
  });

  it("renders the error heading", () => {
    const err = Object.assign(new globalThis.Error("Test error"), {
      digest: undefined,
    }) as globalThis.Error & { digest?: string };
    render(<ErrorPage error={err} reset={mockReset} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Something went wrong");
  });

  it("displays the retry button", () => {
    const err = Object.assign(new globalThis.Error("fail"), {
      digest: undefined,
    }) as globalThis.Error & { digest?: string };
    render(<ErrorPage error={err} reset={mockReset} />);
    const retryBtn = screen.getByRole("button", { name: /try again/i });
    expect(retryBtn).toBeInTheDocument();
  });

  it("calls reset when retry is clicked", () => {
    const err = Object.assign(new globalThis.Error("fail"), {
      digest: undefined,
    }) as globalThis.Error & { digest?: string };
    render(<ErrorPage error={err} reset={mockReset} />);
    const retryBtn = screen.getByRole("button", { name: /try again/i });
    fireEvent.click(retryBtn);
    expect(mockReset).toHaveBeenCalledTimes(1);
  });

  it("shows error digest when available", () => {
    const err = Object.assign(new globalThis.Error("fail"), {
      digest: "abc123",
    }) as globalThis.Error & { digest?: string };
    render(<ErrorPage error={err} reset={mockReset} />);
    expect(screen.getByText(/abc123/)).toBeInTheDocument();
  });

  it("does not show digest when not available", () => {
    const err = Object.assign(new globalThis.Error("fail"), {
      digest: undefined,
    }) as globalThis.Error & { digest?: string };
    render(<ErrorPage error={err} reset={mockReset} />);
    expect(screen.queryByText(/Error ID:/)).not.toBeInTheDocument();
  });

  it("has accessible focus styles on retry button", () => {
    const err = Object.assign(new globalThis.Error("fail"), {
      digest: undefined,
    }) as globalThis.Error & { digest?: string };
    render(<ErrorPage error={err} reset={mockReset} />);
    const retryBtn = screen.getByRole("button", { name: /try again/i });
    expect(retryBtn.className).toContain("focus:ring-2");
  });
});
