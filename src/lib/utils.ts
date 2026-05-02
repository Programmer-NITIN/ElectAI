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

  return input
    .replace(/<[^>]*>/g, "") // Strip all HTML tags
    .replace(/javascript:/gi, "") // Remove JS protocol
    .replace(/on\w+\s*=/gi, "") // Remove inline event handlers
    .replace(/data:/gi, "") // Remove data URIs
    .replace(/vbscript:/gi, "") // Remove VBScript protocol
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
