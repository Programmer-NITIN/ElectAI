import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

/**
 * Custom 404 page — election-themed Not Found page.
 * Provides a clear path back to the home page.
 *
 * @returns A centered 404 page with home navigation link
 */
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <div className="text-7xl mb-6">🗳️</div>
      <h1 className="text-4xl font-bold text-white mb-4">404 — Booth Not Found</h1>
      <p className="text-gray-400 mb-8 max-w-md text-lg">
        The polling booth you&apos;re looking for seems to have been relocated. Let&apos;s get you
        back to {APP_NAME}.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        aria-label="Return to home page"
      >
        Return to Home 🏠
      </Link>
    </div>
  );
}
