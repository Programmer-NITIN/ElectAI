/**
 * Tests for generative UI components.
 * Validates rendering, interaction, ARIA attributes, and state management.
 * @group components
 */

import { render, screen, fireEvent } from "@testing-library/react";
import { EVMSimulator } from "@/components/generative/EVMSimulator";
import { InteractiveTimeline } from "@/components/generative/InteractiveTimeline";
import { ActionChecklist } from "@/components/generative/ActionChecklist";
import { FactCard } from "@/components/generative/FactCard";

// ── Test Data ─────────────────────────────────────────────────────────

const evmData = {
  title: "EVM Voting Process",
  description: "Step-by-step voting process",
  steps: [
    { id: "1", title: "Enter booth", description: "Show your ID to officials", icon: "🏛️" },
    { id: "2", title: "Verify identity", description: "Officer checks EPIC card" },
    { id: "3", title: "Press button", description: "Press button next to candidate", instruction: "Press firmly" },
  ],
};

const timelineData = {
  title: "Election Timeline",
  description: "Key phases of the 2024 election",
  steps: [
    { id: "1", title: "Announcement", description: "EC announces dates", status: "completed" as const },
    { id: "2", title: "Nominations", description: "Filing of nominations", status: "current" as const },
    { id: "3", title: "Polling Day", description: "Cast your vote", status: "upcoming" as const, date: "April 19" },
  ],
};

const checklistData = {
  title: "Voter Registration Checklist",
  description: "Complete these steps to register",
  items: [
    { id: "1", text: "Fill Form 6", description: "Download from ECI website", completed: false, priority: "high" as const },
    { id: "2", text: "Attach documents", completed: false, priority: "medium" as const, url: "https://eci.gov.in" },
    { id: "3", text: "Submit online", completed: false, priority: "low" as const },
  ],
};

const factCardData = {
  title: "ECI Key Facts",
  summary: "Important election statistics",
  facts: [
    { label: "Voters", value: "970 million", icon: "👥" },
    { label: "Constituencies", value: "543" },
  ],
  sources: [
    { title: "Election Commission of India", url: "https://eci.gov.in" },
  ],
};

// ── EVMSimulator Tests ────────────────────────────────────────────────

describe("EVMSimulator", () => {
  it("should render the title and description", () => {
    render(<EVMSimulator {...evmData} />);
    expect(screen.getByText("EVM Voting Process")).toBeInTheDocument();
    expect(screen.getByText("Step-by-step voting process")).toBeInTheDocument();
  });

  it("should display the first step by default", () => {
    render(<EVMSimulator {...evmData} />);
    expect(screen.getByText("Enter booth")).toBeInTheDocument();
    expect(screen.getByText("Show your ID to officials")).toBeInTheDocument();
  });

  it("should navigate to next step on Next click", () => {
    render(<EVMSimulator {...evmData} />);
    fireEvent.click(screen.getByLabelText("Next step"));
    expect(screen.getByText("Verify identity")).toBeInTheDocument();
  });

  it("should navigate back on Previous click", () => {
    render(<EVMSimulator {...evmData} />);
    fireEvent.click(screen.getByLabelText("Next step"));
    fireEvent.click(screen.getByLabelText("Previous step"));
    expect(screen.getByText("Enter booth")).toBeInTheDocument();
  });

  it("should disable Previous on first step", () => {
    render(<EVMSimulator {...evmData} />);
    expect(screen.getByLabelText("Previous step")).toBeDisabled();
  });

  it("should show Done label on last step", () => {
    render(<EVMSimulator {...evmData} />);
    fireEvent.click(screen.getByLabelText("Next step"));
    fireEvent.click(screen.getByLabelText("Next step"));
    expect(screen.getByText("Done")).toBeInTheDocument();
  });

  it("should display step counter", () => {
    render(<EVMSimulator {...evmData} />);
    expect(screen.getByText("Step 1 of 3")).toBeInTheDocument();
  });

  it("should have region role with title as label", () => {
    render(<EVMSimulator {...evmData} />);
    expect(screen.getByRole("region", { name: "EVM Voting Process" })).toBeInTheDocument();
  });

  it("should have progressbar role", () => {
    render(<EVMSimulator {...evmData} />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("should show instruction when available", () => {
    render(<EVMSimulator {...evmData} />);
    fireEvent.click(screen.getByLabelText("Next step"));
    fireEvent.click(screen.getByLabelText("Next step"));
    expect(screen.getByText(/Press firmly/)).toBeInTheDocument();
  });

  it("should render step icon", () => {
    render(<EVMSimulator {...evmData} />);
    expect(screen.getByText("🏛️")).toBeInTheDocument();
  });
});

// ── InteractiveTimeline Tests ─────────────────────────────────────────

describe("InteractiveTimeline", () => {
  it("should render the timeline title and description", () => {
    render(<InteractiveTimeline {...timelineData} />);
    expect(screen.getByText("Election Timeline")).toBeInTheDocument();
    expect(screen.getByText("Key phases of the 2024 election")).toBeInTheDocument();
  });

  it("should render all phases", () => {
    render(<InteractiveTimeline {...timelineData} />);
    expect(screen.getByText("Announcement")).toBeInTheDocument();
    expect(screen.getByText("Nominations")).toBeInTheDocument();
    expect(screen.getByText("Polling Day")).toBeInTheDocument();
  });

  it("should display date when available", () => {
    render(<InteractiveTimeline {...timelineData} />);
    expect(screen.getByText(/April 19/)).toBeInTheDocument();
  });

  it("should have region role with title as label", () => {
    render(<InteractiveTimeline {...timelineData} />);
    expect(screen.getByRole("region", { name: "Election Timeline" })).toBeInTheDocument();
  });

  it("should have list role for phases", () => {
    render(<InteractiveTimeline {...timelineData} />);
    expect(screen.getByRole("list", { name: "Election phases" })).toBeInTheDocument();
  });

  it("should have listitem roles for each phase", () => {
    render(<InteractiveTimeline {...timelineData} />);
    const items = screen.getAllByRole("listitem");
    expect(items.length).toBe(3);
  });
});

// ── ActionChecklist Tests ─────────────────────────────────────────────

describe("ActionChecklist", () => {
  it("should render checklist title and description", () => {
    render(<ActionChecklist {...checklistData} />);
    expect(screen.getByText("Voter Registration Checklist")).toBeInTheDocument();
    expect(screen.getByText("Complete these steps to register")).toBeInTheDocument();
  });

  it("should render all checklist items", () => {
    render(<ActionChecklist {...checklistData} />);
    expect(screen.getByText("Fill Form 6")).toBeInTheDocument();
    expect(screen.getByText("Attach documents")).toBeInTheDocument();
    expect(screen.getByText("Submit online")).toBeInTheDocument();
  });

  it("should toggle item on click", () => {
    render(<ActionChecklist {...checklistData} />);
    const checkbox = screen.getByRole("checkbox", { name: "Fill Form 6" });
    expect(checkbox).toHaveAttribute("aria-checked", "false");
    fireEvent.click(checkbox);
    expect(checkbox).toHaveAttribute("aria-checked", "true");
  });

  it("should uncheck when clicked again", () => {
    render(<ActionChecklist {...checklistData} />);
    const checkbox = screen.getByRole("checkbox", { name: "Fill Form 6" });
    fireEvent.click(checkbox);
    fireEvent.click(checkbox);
    expect(checkbox).toHaveAttribute("aria-checked", "false");
  });

  it("should update progress count", () => {
    render(<ActionChecklist {...checklistData} />);
    expect(screen.getByText("0/3")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("checkbox", { name: "Fill Form 6" }));
    expect(screen.getByText("1/3")).toBeInTheDocument();
  });

  it("should show High badge for high priority items", () => {
    render(<ActionChecklist {...checklistData} />);
    expect(screen.getByText("High")).toBeInTheDocument();
  });

  it("should render description when available", () => {
    render(<ActionChecklist {...checklistData} />);
    expect(screen.getByText("Download from ECI website")).toBeInTheDocument();
  });

  it("should render external link when URL is available", () => {
    render(<ActionChecklist {...checklistData} />);
    const link = screen.getByLabelText("Open Attach documents link");
    expect(link).toHaveAttribute("href", "https://eci.gov.in");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("should have region role with title as label", () => {
    render(<ActionChecklist {...checklistData} />);
    expect(screen.getByRole("region", { name: "Voter Registration Checklist" })).toBeInTheDocument();
  });

  it("should have list role for items", () => {
    render(<ActionChecklist {...checklistData} />);
    expect(screen.getByRole("list", { name: "Checklist items" })).toBeInTheDocument();
  });
});

// ── FactCard Tests ────────────────────────────────────────────────────

describe("FactCard", () => {
  it("should render fact card title and summary", () => {
    render(<FactCard {...factCardData} />);
    expect(screen.getByText("ECI Key Facts")).toBeInTheDocument();
    expect(screen.getByText("Important election statistics")).toBeInTheDocument();
  });

  it("should render all facts", () => {
    render(<FactCard {...factCardData} />);
    expect(screen.getByText("970 million")).toBeInTheDocument();
    expect(screen.getByText("543")).toBeInTheDocument();
  });

  it("should render fact labels", () => {
    render(<FactCard {...factCardData} />);
    expect(screen.getByText("Voters")).toBeInTheDocument();
    expect(screen.getByText("Constituencies")).toBeInTheDocument();
  });

  it("should render fact icon when available", () => {
    render(<FactCard {...factCardData} />);
    expect(screen.getByText("👥")).toBeInTheDocument();
  });

  it("should render source links", () => {
    render(<FactCard {...factCardData} />);
    const link = screen.getByText("Election Commission of India");
    expect(link.closest("a")).toHaveAttribute("href", "https://eci.gov.in");
    expect(link.closest("a")).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("should have region role with title as label", () => {
    render(<FactCard {...factCardData} />);
    expect(screen.getByRole("region", { name: "ECI Key Facts" })).toBeInTheDocument();
  });

  it("should not render sources section when sources is empty", () => {
    render(<FactCard {...{ ...factCardData, sources: [] }} />);
    expect(screen.queryByText("Election Commission of India")).not.toBeInTheDocument();
  });
});
