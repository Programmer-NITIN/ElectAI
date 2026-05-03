/**
 * Shared utility functions for ElectAI.
 *
 * Provides className merging (Tailwind-safe) and input sanitization
 * used across all components. Each utility is pure and side-effect-free.
 *
 * @module utils
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import DOMPurify from "isomorphic-dompurify";

/**
 * Merges CSS class names with Tailwind CSS conflict resolution.
 * Combines `clsx` for conditional classes with `tailwind-merge`
 * to intelligently resolve conflicting Tailwind utilities.
 *
 * @param inputs - Class values (strings, arrays, objects, conditionals)
 * @returns Merged and deduplicated class string
 *
 * @example
 * ```ts
 * cn("px-4 py-2", isActive && "bg-blue-500", "px-6")
 * // → "py-2 px-6 bg-blue-500" (px-6 overrides px-4)
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Sanitizes user input by stripping HTML tags and dangerous patterns.
 * Prevents XSS attacks when user content is rendered or processed.
 *
 * @param input - The untrusted user input string
 * @returns Sanitized string safe for display and processing
 *
 * @example
 * ```ts
 * sanitizeInput('<script>alert("xss")</script>Hello')
 * // → "Hello"
 * sanitizeInput('javascript:void(0)')
 * // → "void(0)"
 * ```
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== "string") return "";

  // Use DOMPurify to strip all HTML tags and prevent XSS
  const sanitized = DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });

  // Extra layer of regex to strip residual markdown or pseudo-protocols if any
  return sanitized
    .replace(/javascript:/gi, "")
    .replace(/data:/gi, "")
    .replace(/vbscript:/gi, "")
    .trim();
}

/**
 * Formats a date string into Indian locale format.
 *
 * @param dateStr - A date string parseable by the Date constructor
 * @returns Formatted date string (e.g., "28 April 2026")
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Truncates a string to a maximum length with ellipsis.
 *
 * @param text - The text to truncate
 * @param maxLength - Maximum allowed length (default: 100)
 * @returns Truncated string with "…" suffix if exceeded
 */
export function truncate(text: string, maxLength = 100): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1) + "…";
}

/**
 * Creates a debounced version of a function.
 *
 * @param fn - The function to debounce
 * @param delay - Delay in milliseconds (default: 300)
 * @returns Debounced function
 */
export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay = 300,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Announces text to screen readers via the global ARIA live region.
 * Updates the `#sr-announcer` element's text content, then clears it
 * after a short delay to allow the screen reader to read the message.
 *
 * @param text - The announcement text for screen readers
 */
export function announceToScreenReader(text: string): void {
  const announcer = document.getElementById("sr-announcer");
  if (!announcer) return;
  announcer.textContent = text;
  setTimeout(() => {
    announcer.textContent = "";
  }, 1000);
}
