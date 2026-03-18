import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  analyzing: "bg-warning/15 text-warning border-warning/25",
  scored: "bg-info/15 text-info border-info/25",
  deal_offered: "bg-success/15 text-success border-success/25",
  marketplace: "bg-purple-500/15 text-purple-400 border-purple-500/25",
};

const STATUS_LABELS: Record<string, string> = {
  analyzing: "Analyzing",
  scored: "Scored",
  deal_offered: "Deal Offered",
  marketplace: "In Marketplace",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium",
        STATUS_STYLES[status] || STATUS_STYLES.analyzing
      )}
    >
      {status === "analyzing" && (
        <span className="mr-1 h-1 w-1 animate-pulse rounded-full bg-current" />
      )}
      {STATUS_LABELS[status] || status}
    </span>
  );
}
