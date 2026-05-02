"use client";

import type { ConstituencyRoadmap } from "@/lib/schemas";
import { cn } from "@/lib/utils";

/**
 * Interactive election timeline displaying phases with status indicators.
 */
export function InteractiveTimeline({ title, description, steps }: ConstituencyRoadmap) {
  return (
    <div className="bg-slate-800/60 rounded-xl border border-white/10 overflow-hidden" role="region" aria-label={title}>
      <div className="p-4 border-b border-white/10 bg-gradient-to-r from-blue-600/10 to-cyan-600/10">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-sm text-gray-400 mt-1">{description}</p>
      </div>

      <div className="p-4 space-y-0" role="list" aria-label="Election phases">
        {steps.map((step, i) => (
          <div key={step.id} className="flex gap-4" role="listitem">
            {/* Timeline Track */}
            <div className="flex flex-col items-center">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 flex-shrink-0",
                step.status === "completed" && "bg-green-600/20 border-green-500 text-green-400",
                step.status === "current" && "bg-indigo-600/20 border-indigo-500 text-indigo-400 animate-pulse-glow",
                step.status === "upcoming" && "bg-slate-700/50 border-slate-600 text-gray-500",
              )}>
                {step.icon || (i + 1)}
              </div>
              {i < steps.length - 1 && (
                <div className={cn("w-0.5 h-12 my-1", step.status === "completed" ? "bg-green-500/50" : "bg-slate-700")} />
              )}
            </div>

            {/* Content */}
            <div className="pb-6">
              <h4 className={cn("font-medium text-sm", step.status === "current" ? "text-indigo-400" : "text-white")}>
                {step.title}
              </h4>
              <p className="text-xs text-gray-400 mt-0.5">{step.description}</p>
              {step.date && <span className="text-xs text-gray-500 mt-1 inline-block">📅 {step.date}</span>}
              {step.details && <p className="text-xs text-gray-500 mt-1 italic">{step.details}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
