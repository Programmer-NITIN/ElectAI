/**
 * Google Maps Platform integration for ElectAI.
 * Provides polling booth location mapping via Google Maps Embed API.
 * @module google/maps
 */

import { GOOGLE_MAPS_EMBED_URL, ENABLE_GOOGLE_MAPS } from "../constants";

/** Whether Google Maps API is configured. */
export function isMapsAvailable(): boolean {
  return ENABLE_GOOGLE_MAPS;
}

/**
 * Generates a Google Maps Embed URL for a polling booth search.
 * @param query - Search query (e.g., "Polling booth near Andheri Mumbai")
 * @returns Embed URL string, or null if Maps is not configured
 */
export function getMapEmbedUrl(query: string): string | null {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) return null;

  const encodedQuery = encodeURIComponent(query);
  return `${GOOGLE_MAPS_EMBED_URL}/search?key=${apiKey}&q=${encodedQuery}`;
}

/**
 * Generates a Google Maps directions URL to a polling booth.
 * @param destination - Destination address or coordinates
 * @returns Google Maps directions URL for external navigation
 */
export function getDirectionsUrl(destination: string): string {
  const encodedDest = encodeURIComponent(destination);
  return `https://www.google.com/maps/dir/?api=1&destination=${encodedDest}`;
}

/**
 * Generates a static map image URL for a location.
 * @param lat - Latitude
 * @param lng - Longitude
 * @param zoom - Zoom level (1-20, default 15)
 * @returns Static map image URL, or null if Maps is not configured
 */
export function getStaticMapUrl(lat: number, lng: number, zoom = 15): string | null {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) return null;

  return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=600x300&markers=color:red|${lat},${lng}&key=${apiKey}`;
}
