"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function ScoreBar({
  label,
  score,
  delay = 0,
}: {
  label: string;
  score: number;
  delay?: number;
}) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setWidth(score), delay);
    return () => clearTimeout(timer);
  }, [score, delay]);

  const color =
    score >= 85
      ? "bg-emerald-500"
      : score >= 70
        ? "bg-blue-500"
        : score >= 55
          ? "bg-yellow-500"
          : "bg-red-500";

  return (
    <div className="flex items-center gap-4">
      <span className="w-24 shrink-0 text-sm text-muted">{label}</span>
      <div className="flex-1">
        <div className="h-2.5 overflow-hidden rounded-full bg-white/5">
          <div
            className={cn("h-full rounded-full transition-all duration-1000 ease-out", color)}
            style={{ width: `${width}%` }}
          />
        </div>
      </div>
      <span className="w-8 text-right text-sm font-semibold tabular-nums">
        {score}
      </span>
    </div>
  );
}
