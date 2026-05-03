"use client";

import { useState } from "react";
import type { EVMSimulatorOutput } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { ChevronRight, ChevronLeft, CheckCircle } from "lucide-react";

/**
 * Interactive EVM/VVPAT voting process simulator.
 * Guides users step-by-step through the election day voting process.
 */
export function EVMSimulator({ title, description, steps }: EVMSimulatorOutput) {
  const [currentStep, setCurrentStep] = useState(0);
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div
      className="bg-slate-800/60 rounded-xl border border-white/10 overflow-hidden"
      role="region"
      aria-label={title}
    >
      <div className="p-4 border-b border-white/10 bg-gradient-to-r from-indigo-600/20 to-purple-600/20">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-sm text-gray-400 mt-1">{description}</p>
      </div>

      {/* Progress Bar */}
      <div className="px-4 pt-3">
        <div
          className="flex gap-1"
          role="progressbar"
          aria-valuenow={currentStep + 1}
          aria-valuemin={1}
          aria-valuemax={steps.length}
        >
          {steps.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1 flex-1 rounded-full transition-colors",
                i <= currentStep ? "bg-indigo-500" : "bg-slate-700",
              )}
            />
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Step {currentStep + 1} of {steps.length}
        </p>
      </div>

      {/* Current Step */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          <span className="text-3xl">{steps[currentStep].icon || "📋"}</span>
          <div>
            <h4 className="font-semibold text-white">{steps[currentStep].title}</h4>
            <p className="text-sm text-gray-300 mt-1">{steps[currentStep].description}</p>
            {steps[currentStep].instruction && (
              <p className="text-sm text-indigo-400 mt-2 italic">
                💡 {steps[currentStep].instruction}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="px-4 pb-4 flex justify-between">
        <button
          onClick={() => setCurrentStep((s) => s - 1)}
          disabled={isFirstStep}
          className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-slate-700 text-gray-300 hover:bg-slate-600 disabled:opacity-30 transition-colors"
          aria-label="Previous step"
        >
          <ChevronLeft size={16} /> Previous
        </button>
        <button
          onClick={() => setCurrentStep((s) => s + 1)}
          disabled={isLastStep}
          className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-30 transition-colors"
          aria-label={isLastStep ? "Completed" : "Next step"}
        >
          {isLastStep ? (
            <>
              <CheckCircle size={16} /> Done
            </>
          ) : (
            <>
              Next <ChevronRight size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
