/**
 * Tests for the 404 Not Found page.
 * Verifies correct rendering, accessibility, and navigation link.
 * @group components
 */

import { render, screen } from "@testing-library/react";
import NotFound from "@/app/not-found";
import { APP_NAME } from "@/lib/constants";

// Mock next/link as a simple anchor
jest.mock("next/link", () => {
  return function MockLink({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

describe("NotFound Page", () => {
  it("renders the 404 heading", () => {
    render(<NotFound />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("404");
  });

  it("displays the app name in the description", () => {
    render(<NotFound />);
    expect(screen.getByText(new RegExp(APP_NAME))).toBeInTheDocument();
  });

  it("renders a link back to the home page", () => {
    render(<NotFound />);
    const homeLink = screen.getByRole("link", { name: /return to home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it("has correct aria-label on the home link", () => {
    render(<NotFound />);
    const homeLink = screen.getByLabelText(/return to home/i);
    expect(homeLink).toBeInTheDocument();
  });

  it("renders the election-themed emoji", () => {
    render(<NotFound />);
    expect(screen.getByText("🗳️")).toBeInTheDocument();
  });
});
