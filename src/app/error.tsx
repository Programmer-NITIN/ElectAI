"use client";

import { APP_NAME } from "@/lib/constants";

/**
 * Global error boundary page — catches unhandled errors at the route level.
 * Provides a retry mechanism and user-friendly error message.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <div className="text-6xl mb-6">⚠️</div>
      <h1 className="text-3xl font-bold text-white mb-4">Something went wrong</h1>
      <p className="text-gray-400 mb-2 max-w-md">
        {APP_NAME} encountered an unexpected error. This has been logged for review.
      </p>
      {error.digest && (
        <p className="text-gray-500 text-sm mb-6 font-mono">Error ID: {error.digest}</p>
      )}
      <button
        onClick={reset}
        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        aria-label="Try again"
      >
        Try Again
      </button>
    </div>
  );
}
