"use client";

import type { FactCardOutput } from "@/lib/schemas";
import { ExternalLink } from "lucide-react";

/**
 * Displays key election facts in a visually appealing card format.
 */
export function FactCard({ title, summary, facts, sources }: FactCardOutput) {
  return (
    <div
      className="bg-slate-800/60 rounded-xl border border-white/10 overflow-hidden"
      role="region"
      aria-label={title}
    >
      <div className="p-4 border-b border-white/10 bg-gradient-to-r from-amber-600/10 to-orange-600/10">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-sm text-gray-400 mt-1">{summary}</p>
      </div>

      <div className="grid grid-cols-2 gap-px bg-white/5">
        {facts.map((fact, i) => (
          <div key={i} className="p-3 bg-slate-800/80">
            <div className="flex items-center gap-2 mb-1">
              {fact.icon && <span className="text-lg">{fact.icon}</span>}
              <span className="text-xs text-gray-500 uppercase tracking-wide">{fact.label}</span>
            </div>
            <p className="text-sm font-semibold text-white">{fact.value}</p>
          </div>
        ))}
      </div>

      {sources && sources.length > 0 && (
        <div className="px-4 py-2 border-t border-white/5 flex flex-wrap gap-3">
          {sources.map((source, i) => (
            <a
              key={i}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <ExternalLink size={10} /> {source.title}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
