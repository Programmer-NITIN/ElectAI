"use client";

import { useState } from "react";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";
import { getSupportedLanguages, type Language } from "@/lib/i18n";

/**
 * Application header with branding, language selector, and theme toggle.
 * Implements full keyboard navigation and ARIA attributes.
 */
export function Header() {
  const [language, setLanguage] = useState<Language>("en");

  const languages = getSupportedLanguages();

  return (
    <header className="border-b border-white/10 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Branding */}
        <div className="flex items-center gap-3">
          <div className="text-2xl" role="img" aria-label="Ballot box emoji">
            🗳️
          </div>
          <div>
            <h1 className="text-lg font-bold text-white leading-tight">{APP_NAME}</h1>
            <p className="text-xs text-gray-400">{APP_TAGLINE}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="bg-slate-800 text-gray-300 text-sm rounded-lg px-3 py-1.5 border border-white/10 focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer"
            aria-label="Select language"
            id="language-selector"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>

          {/* India Flag Badge */}
          <div
            className="flex items-center gap-1 px-2 py-1 rounded-full bg-slate-800/50 border border-white/5"
            aria-label="Made for India"
          >
            <span className="text-sm">🇮🇳</span>
            <span className="text-xs text-gray-500 hidden sm:inline">India</span>
          </div>
        </div>
      </div>
    </header>
  );
}
