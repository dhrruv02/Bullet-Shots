import Link from "next/link";
import { Script } from "@/lib/types";
import { formatDate, getScoreColor } from "@/lib/utils";
import StatusBadge from "./StatusBadge";
import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";

function DecisionBadge({ decision }: { decision: Script["decision"] }) {
  if (!decision) return null;

  if (decision === "marketplace") {
    return (
      <span className="inline-flex items-center rounded-full border border-purple-500/25 bg-purple-500/15 px-2 py-0.5 text-[10px] font-medium text-purple-300">
        In Marketplace
      </span>
    );
  }

  if (decision === "rights_purchase") {
    return (
      <span className="inline-flex items-center rounded-full border border-accent/25 bg-accent/15 px-2 py-0.5 text-[10px] font-medium text-accent">
        Rights Purchase
      </span>
    );
  }

  if (decision === "revenue_share") {
    return (
      <span className="inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/15 px-2 py-0.5 text-[10px] font-medium text-cyan-300">
        Revenue Share
      </span>
    );
  }

  return null;
}

export default function ScriptCard({
  script,
  className,
}: {
  script: Script;
  className?: string;
}) {
  return (
    <Link
      href={`/scripts/${script.id}`}
      className={cn(
        "interactive-row group block px-5 py-4 transition-colors",
        className
      )}
    >
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2.5">
            <h3 className="truncate text-[15px] font-medium text-foreground transition-colors group-hover:text-accent">
              {script.title}
            </h3>
            <StatusBadge status={script.status} />
            <DecisionBadge decision={script.decision} />
          </div>
          <p className="line-clamp-1 text-sm text-muted/90">
            {script.description || "No description provided"}
          </p>
          <div className="mt-2 flex items-center gap-3 text-[11px] text-muted/75">
            {script.genre && (
              <span className="rounded bg-white/[0.04] px-1.5 py-0.5 uppercase tracking-wide">
                {script.genre}
              </span>
            )}
            <span>{formatDate(script.created_at)}</span>
          </div>
        </div>

        {script.overall_score !== null ? (
          <div className="flex min-w-10 items-center justify-end">
            <span
              className={`text-3xl font-semibold tabular-nums transition-transform duration-150 group-hover:scale-105 ${getScoreColor(script.overall_score)}`}
            >
              {script.overall_score}
            </span>
          </div>
        ) : (
          <div className="flex min-w-10 items-center justify-end">
            <LoaderCircle size={16} className="animate-spin text-info/90" />
          </div>
        )}
      </div>
    </Link>
  );
}
