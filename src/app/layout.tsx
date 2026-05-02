import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { APP_NAME, APP_DESCRIPTION, APP_URL } from "@/lib/constants";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

/** Viewport configuration for mobile responsiveness. */
export const viewport: Viewport = {
  themeColor: "#4f46e5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

/** SEO metadata for the application. */
export const metadata: Metadata = {
  title: `${APP_NAME} — ${APP_DESCRIPTION}`,
  description: APP_DESCRIPTION,
  keywords: [
    "election", "India", "ECI", "voter registration", "Form 6", "EPIC",
    "Voter ID", "EVM", "VVPAT", "AI assistant", "election guide",
    "भारत निर्वाचन", "मतदार नोंदणी",
  ],
  manifest: "/manifest.json",
  metadataBase: new URL(APP_URL),
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: APP_NAME,
  },
  openGraph: {
    title: `${APP_NAME} — AI Election Education Assistant`,
    description: APP_DESCRIPTION,
    type: "website",
    locale: "en_IN",
    url: APP_URL,
  },
};

/**
 * Root layout — wraps all pages with global styles, fonts, and accessibility features.
 * Includes skip-link and screen reader live region.
 */
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" dir="ltr" className={`${inter.variable} h-full dark`}>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="h-full flex flex-col bg-grid">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        {/* Screen reader live region for dynamic announcements */}
        <div
          id="sr-announcer"
          className="sr-only"
          aria-live="assertive"
          aria-atomic="true"
          role="status"
        />
        <main id="main-content" className="flex-1 flex flex-col" role="main">
          {children}
        </main>
      </body>
    </html>
  );
}
