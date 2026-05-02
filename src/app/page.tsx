import { Header } from "@/components/ui/Header";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { ErrorBoundary } from "@/components/ErrorBoundary";

/**
 * Home page — primary entry point for ElectAI.
 * Renders the header with branding and the AI chat interface
 * wrapped in an error boundary for resilience.
 */
export default function Home() {
  return (
    <div className="flex flex-col h-full">
      <Header />
      <div className="flex-1 min-h-0 max-w-4xl w-full mx-auto">
        <ErrorBoundary>
          <ChatInterface />
        </ErrorBoundary>
      </div>
    </div>
  );
}
