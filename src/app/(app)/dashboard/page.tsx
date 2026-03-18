"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Script } from "@/lib/types";
import ScriptCard from "@/components/ScriptCard";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  FileText,
  Clock3,
  CircleCheckBig,
  Handshake,
  ChevronRight,
} from "lucide-react";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "analyzing", label: "Analyzing" },
  { key: "scored", label: "Scored" },
  { key: "deal_offered", label: "Deal Offered" },
  { key: "marketplace", label: "In Marketplace" },
];

export default function DashboardPage() {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const supabase = createClient();

  useEffect(() => {
    async function fetchScripts() {
      const { data } = await supabase
        .from("scripts")
        .select("*")
        .order("created_at", { ascending: false });

      setScripts((data as Script[]) || []);
      setLoading(false);
    }
    fetchScripts();
  }, [supabase]);

  const filtered =
    filter === "all"
      ? scripts
      : filter === "marketplace"
        ? scripts.filter((s) => s.decision === "marketplace")
        : scripts.filter((s) => s.status === filter);

  const stats = {
    total: scripts.length,
    analyzing: scripts.filter((s) => s.status === "analyzing").length,
    scored: scripts.filter(
      (s) => s.status === "scored" || s.status === "deal_offered"
    ).length,
    deals: scripts.filter((s) => s.status === "deal_offered").length,
  };

  return (
    <div className="mx-auto max-w-5xl animate-fade-in">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[2rem] font-semibold tracking-tight text-foreground">
            Creator Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted">
            Track your scripts and their journey
          </p>
        </div>
        <Link
          href="/submit"
          className="interactive-button inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
        >
          <FileText size={14} />
          Submit Script
        </Link>
      </div>

      <div className="mb-7 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard
          icon={<FileText size={14} />}
          label="Total Scripts"
          value={stats.total}
          color="text-foreground"
        />
        <StatCard
          icon={<Clock3 size={14} />}
          label="Analyzing"
          value={stats.analyzing}
          color="text-warning"
        />
        <StatCard
          icon={<CircleCheckBig size={14} />}
          label="Scored"
          value={stats.scored}
          color="text-info"
        />
        <StatCard
          icon={<Handshake size={14} />}
          label="Deals Offered"
          value={stats.deals}
          color="text-success"
        />
      </div>

      <div className="rounded-xl border border-card-border bg-card/80">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-card-border px-5 py-3.5">
          <div className="text-sm font-semibold text-foreground">Submitted Scripts</div>
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={cn(
                  "interactive-chip whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                  filter === f.key
                    ? "border-accent/60 bg-accent/15 text-accent"
                    : "border-card-border bg-transparent text-muted hover:border-white/20 hover:text-foreground"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="space-y-2 p-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-24 w-full" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FileText size={40} className="mb-3 text-muted/40" />
            <p className="text-muted">No scripts found</p>
            <Link
              href="/submit"
              className="mt-4 text-sm font-medium text-accent hover:text-accent-hover"
            >
              Submit a script
            </Link>
          </div>
        ) : (
          <div>
            {filtered.map((script, idx) => (
              <ScriptCard
                key={script.id}
                script={script}
                className={idx !== filtered.length - 1 ? "border-b border-card-border" : ""}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="interactive-card rounded-lg border border-card-border bg-card px-4 py-3">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-[11px] font-medium uppercase tracking-wide text-muted">
          {label}
        </div>
        <div className={cn("opacity-85", color)}>{icon}</div>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-2xl font-semibold tabular-nums text-foreground">{value}</div>
        <ChevronRight size={13} className="text-muted/60" />
      </div>
    </div>
  );
}
