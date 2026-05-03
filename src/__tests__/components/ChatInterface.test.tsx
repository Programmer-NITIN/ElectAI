/**
 * Tests for ChatInterface Component
 * @group unit
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { useTTS } from "@/hooks/useTTS";
import * as utils from "@/lib/utils";

// Mock child components and hooks
jest.mock("@/components/chat/MessageBubble", () => ({
  MessageBubble: ({ message }: any) => <div data-testid="msg-bubble">{message.content}</div>,
}));

jest.mock("@/hooks/useVoiceInput", () => ({
  useVoiceInput: jest.fn(),
}));

jest.mock("@/hooks/useTTS", () => ({
  useTTS: jest.fn(),
}));

jest.mock("@/lib/utils", () => ({
  ...jest.requireActual("@/lib/utils"),
  parseStreamResponse: jest.fn(),
  announceToScreenReader: jest.fn(),
}));

describe("ChatInterface", () => {
  const mockStartListening = jest.fn();
  const mockStopListening = jest.fn();
  const mockSpeak = jest.fn();
  const mockStopTTS = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useVoiceInput as jest.Mock).mockImplementation((onResult) => ({
      isListening: false,
      startListening: mockStartListening,
      stopListening: mockStopListening,
      // simulate returning a result when started
      __triggerResult: (text: string) => onResult(text),
    }));

    (useTTS as jest.Mock).mockReturnValue({
      isSpeaking: false,
      speak: mockSpeak,
      stop: mockStopTTS,
    });
  });

  it("should render the welcome screen initially", () => {
    render(<ChatInterface />);
    expect(screen.getByRole("region", { name: "Chat interface" })).toBeInTheDocument();
    expect(screen.getByText("🗳️")).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Suggested questions" })).toBeInTheDocument();
  });

  it("should send a message via suggestion chip and trigger onChunk", async () => {
    render(<ChatInterface />);
    const chips = screen.getAllByRole("button", { name: /Ask: /i });
    expect(chips.length).toBeGreaterThan(0);
    
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      body: { getReader: () => ({ read: () => Promise.resolve({ done: true }) }) },
    });
    
    (utils.parseStreamResponse as jest.Mock).mockImplementation(async (res, onChunk) => {
      onChunk("Thinking...");
      return "AI response";
    });

    fireEvent.click(chips[0]);

    await waitFor(() => {
      expect(screen.getAllByTestId("msg-bubble").length).toBeGreaterThan(0);
      expect(screen.getByText("Thinking...")).toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(screen.getByText("AI response")).toBeInTheDocument();
    });
  });

  it("should send a message via form submit", async () => {
    render(<ChatInterface />);
    
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      body: { getReader: () => ({ read: () => Promise.resolve({ done: true }) }) },
    });
    (utils.parseStreamResponse as jest.Mock).mockResolvedValue("AI response 2");

    const textarea = screen.getByRole("textbox", { name: "Type your message" });
    fireEvent.change(textarea, { target: { value: "Hello AI" } });
    
    const sendBtn = screen.getByRole("button", { name: "Send" });
    fireEvent.click(sendBtn);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/chat", expect.any(Object));
      expect(screen.getByText("Hello AI")).toBeInTheDocument();
    });
  });

  it("should not send a message on Shift+Enter", () => {
    render(<ChatInterface />);
    const textarea = screen.getByRole("textbox", { name: "Type your message" });
    fireEvent.change(textarea, { target: { value: "Hello" } });
    fireEvent.keyDown(textarea, { key: "Enter", shiftKey: true });
    
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("should handle voice input toggle", async () => {
    let onResultCb: any;
    (useVoiceInput as jest.Mock).mockImplementation((cb) => {
      onResultCb = cb;
      return { isListening: false, startListening: mockStartListening, stopListening: mockStopListening };
    });

    const { rerender } = render(<ChatInterface />);
    const micBtn = screen.getByTestId("voice-input-btn");
    
    fireEvent.click(micBtn);
    expect(mockStartListening).toHaveBeenCalled();

    // simulate result
    onResultCb("Test voice");
    const textarea = screen.getByRole("textbox", { name: "Type your message" }) as HTMLTextAreaElement;
    await waitFor(() => expect(textarea.value).toBe("Test voice"));

    // test when listening is true
    (useVoiceInput as jest.Mock).mockReturnValue({
      isListening: true,
      startListening: mockStartListening,
      stopListening: mockStopListening,
    });
    rerender(<ChatInterface />);
    
    fireEvent.click(screen.getByTestId("voice-input-btn"));
    expect(mockStopListening).toHaveBeenCalled();
  });

  it("should handle TTS toggle", async () => {
    // First setup the chat so there's an assistant message
    render(<ChatInterface />);
    
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      body: { getReader: () => ({ read: () => Promise.resolve({ done: true }) }) },
    });
    (utils.parseStreamResponse as jest.Mock).mockResolvedValue("Hello this is AI");

    const textarea = screen.getByRole("textbox", { name: "Type your message" });
    fireEvent.change(textarea, { target: { value: "Hi" } });
    fireEvent.keyDown(textarea, { key: "Enter", shiftKey: false });

    await waitFor(() => {
      expect(screen.getByText("Hello this is AI")).toBeInTheDocument();
    });

    const ttsBtn = screen.getByTestId("tts-btn");
    expect(ttsBtn).not.toBeDisabled();
    
    fireEvent.click(ttsBtn);
    expect(mockSpeak).toHaveBeenCalledWith("Hello this is AI", "en");
  });

  it("should stop TTS when active and clicked", async () => {
    (useTTS as jest.Mock).mockReturnValue({
      isSpeaking: true,
      speak: mockSpeak,
      stop: mockStopTTS,
    });

    render(<ChatInterface />);
    
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      body: { getReader: () => ({ read: () => Promise.resolve({ done: true }) }) },
    });
    (utils.parseStreamResponse as jest.Mock).mockResolvedValue("Hello this is AI");

    const textarea = screen.getByRole("textbox", { name: "Type your message" });
    fireEvent.change(textarea, { target: { value: "Hi" } });
    fireEvent.keyDown(textarea, { key: "Enter", shiftKey: false });

    await waitFor(() => {
      expect(screen.getByText("Hello this is AI")).toBeInTheDocument();
    });

    const ttsBtn = screen.getByTestId("tts-btn");
    fireEvent.click(ttsBtn);
    expect(mockStopTTS).toHaveBeenCalled();
  });

  it("should display error message on fetch failure (network error)", async () => {
    render(<ChatInterface />);
    
    global.fetch = jest.fn().mockRejectedValue(new Error("Network Error"));

    const textarea = screen.getByRole("textbox", { name: "Type your message" });
    fireEvent.change(textarea, { target: { value: "Hi" } });
    fireEvent.keyDown(textarea, { key: "Enter", shiftKey: false });

    await waitFor(() => {
      expect(utils.announceToScreenReader).toHaveBeenCalledWith(expect.any(String));
      const bubbles = screen.getAllByTestId("msg-bubble");
      expect(bubbles[bubbles.length - 1].textContent).toContain("Something went wrong. Please try again.");
    });
  });

  it("should display error message on non-ok HTTP response", async () => {
    render(<ChatInterface />);
    
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    const textarea = screen.getByRole("textbox", { name: "Type your message" });
    fireEvent.change(textarea, { target: { value: "Fail HTTP" } });
    fireEvent.keyDown(textarea, { key: "Enter", shiftKey: false });

    await waitFor(() => {
      expect(utils.announceToScreenReader).toHaveBeenCalledWith(expect.any(String));
      const bubbles = screen.getAllByTestId("msg-bubble");
      expect(bubbles[bubbles.length - 1].textContent).toContain("Something went wrong. Please try again.");
    });
  });
});
