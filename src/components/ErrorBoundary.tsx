"use client";

import { Component, type ReactNode, type ErrorInfo } from "react";
import { logger } from "@/lib/logger";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * React error boundary — catches rendering errors in child components.
 * Logs errors to the structured logger and displays a retry UI.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logger.error("React ErrorBoundary caught an error", {
      component: "ErrorBoundary",
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack || "",
    });
  }

  private handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div
          className="flex flex-col items-center justify-center p-8 text-center min-h-[300px]"
          role="alert"
          aria-live="assertive"
        >
          <div className="text-4xl mb-4">😓</div>
          <h2 className="text-xl font-semibold text-white mb-2">Something went wrong</h2>
          <p className="text-gray-400 mb-4 max-w-sm">
            An error occurred while loading this section. Please try again.
          </p>
          <button
            onClick={this.handleRetry}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Retry loading this section"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
