/**
 * Tests for the Header component.
 * @group component
 */

import { render, screen } from "@testing-library/react";
import { Header } from "@/components/ui/Header";

describe("Header", () => {
  it("should render the app name", () => {
    render(<Header />);
    expect(screen.getByText("ElectAI")).toBeInTheDocument();
  });

  it("should render the tagline", () => {
    render(<Header />);
    expect(screen.getByText("AI-Powered Election Process Education")).toBeInTheDocument();
  });

  it("should render the language selector", () => {
    render(<Header />);
    expect(screen.getByLabelText("Select language")).toBeInTheDocument();
  });

  it("should have 3 language options", () => {
    render(<Header />);
    const select = screen.getByLabelText("Select language");
    const options = select.querySelectorAll("option");
    expect(options).toHaveLength(3);
  });

  it("should have banner role on header", () => {
    render(<Header />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("should render India flag badge", () => {
    render(<Header />);
    expect(screen.getByText("🇮🇳")).toBeInTheDocument();
  });

  it("should render ballot box emoji", () => {
    render(<Header />);
    expect(screen.getByLabelText("Ballot box emoji")).toBeInTheDocument();
  });
});
