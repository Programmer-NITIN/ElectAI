"use client";

import { useState } from "react";
import type { ChecklistOutput } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { CheckCircle, Circle, ExternalLink } from "lucide-react";

/**
 * Interactive voter registration checklist with progress tracking.
 */
export function ActionChecklist({ title, description, items }: ChecklistOutput) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const completedCount = checkedItems.size;
  const totalCount = items.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <div
      className="bg-slate-800/60 rounded-xl border border-white/10 overflow-hidden"
      role="region"
      aria-label={title}
    >
      <div className="p-4 border-b border-white/10">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-sm text-gray-400 mt-1">{description}</p>
        <div className="mt-3 flex items-center gap-3">
          <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs text-gray-400 font-medium">
            {completedCount}/{totalCount}
          </span>
        </div>
      </div>

      <ul className="divide-y divide-white/5" role="list" aria-label="Checklist items">
        {items.map((item) => {
          const isChecked = checkedItems.has(item.id);
          return (
            <li key={item.id} className="px-4 py-3">
              <button
                onClick={() => toggleItem(item.id)}
                className="flex items-start gap-3 w-full text-left group"
                role="checkbox"
                aria-checked={isChecked}
                aria-label={item.text}
              >
                <span className="mt-0.5 flex-shrink-0">
                  {isChecked ? (
                    <CheckCircle size={20} className="text-green-500" />
                  ) : (
                    <Circle size={20} className="text-gray-600 group-hover:text-gray-400" />
                  )}
                </span>
                <div className="flex-1">
                  <span
                    className={cn(
                      "text-sm font-medium",
                      isChecked ? "text-gray-500 line-through" : "text-white",
                    )}
                  >
                    {item.text}
                  </span>
                  {item.description && (
                    <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                  )}
                </div>
                {item.priority === "high" && (
                  <span className="text-xs px-2 py-0.5 bg-red-500/20 text-red-400 rounded-full">
                    High
                  </span>
                )}
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300"
                    aria-label={`Open ${item.text} link`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink size={14} />
                  </a>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
