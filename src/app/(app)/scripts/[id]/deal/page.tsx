"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Script } from "@/lib/types";
import Link from "next/link";
import {
  Handshake,
  DollarSign,
  Calendar,
  Clock,
  CreditCard,
  Circle,
} from "lucide-react";

const DEAL_TERMS = [
  {
    icon: DollarSign,
    label: "Revenue Split",
    value: "60% Creator / 40% Platform",
  },
  {
    icon: CreditCard,
    label: "Minimum Guarantee",
    value: "\u20B950,000",
  },
  {
    icon: Calendar,
    label: "Duration",
    value: "2 Years",
  },
  {
    icon: Clock,
    label: "Payment Schedule",
    value: "Monthly",
  },
];

export default function DealPage() {
  const params = useParams();
  const router = useRouter();
  const [script, setScript] = useState<Script | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepted, setAccepted] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function fetchScript() {
      const { data } = await supabase
        .from("scripts")
        .select("*")
        .eq("id", params.id)
        .single();

      if (data) setScript(data as Script);
      setLoading(false);
    }
    fetchScript();
  }, [params.id, supabase]);

  if (loading) {
    return (
      <div className="mx-auto max-w-[760px]">
        <div className="skeleton mb-4 h-[238px] w-full" />
        <div className="skeleton mb-4 h-[138px] w-full" />
        <div className="skeleton h-11 w-full" />
      </div>
    );
  }

  if (!script) {
    return (
      <div className="flex flex-col items-center py-20 text-center">
        <p className="text-muted">Script not found</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[760px] animate-fade-in">
      <div className="interactive-card rounded-xl border border-card-border bg-card px-8 py-7">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#2a2211] text-[#e3b23b]">
            <Handshake size={22} />
          </div>
          <h1 className="text-[2rem] font-semibold tracking-tight text-foreground">
            Revenue Share Deal
          </h1>
          <p className="mx-auto mt-1 max-w-[420px] text-sm leading-relaxed text-muted">
            Your script qualifies for a revenue share partnership with Bullet
            Studios.
          </p>
        </div>

        <div className="mb-2 text-center">
          <SmallScoreRing score={script.overall_score ?? 0} />
          <p className="mt-3 text-xs text-muted">
            Script: <span className="font-semibold text-foreground">{script.title}</span>
          </p>
        </div>
      </div>

      <div className="interactive-card mt-4 rounded-xl border border-card-border bg-card p-5">
        <h2 className="mb-3 text-sm font-semibold text-foreground">
          Revenue Share Terms
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {DEAL_TERMS.map((term) => {
            const Icon = term.icon;
            return (
              <div
                key={term.label}
                className="interactive-card rounded-lg border border-card-border bg-background/40 px-4 py-3"
              >
                <div className="mb-1 flex items-center gap-2 text-[11px] text-muted">
                  <Icon size={12} />
                  {term.label}
                </div>
                <div className="text-sm font-semibold text-foreground">
                  {term.value}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {accepted ? (
        <div className="mt-4 rounded-lg border border-success/25 bg-success/10 px-4 py-3 text-center text-sm font-medium text-success">
          Deal accepted! Our team will reach out within 24 hours.
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-[minmax(0,1fr)_170px] gap-3">
          <button
            onClick={() => setAccepted(true)}
            className="interactive-button h-11 rounded-lg bg-accent text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
          >
            Accept Deal
          </button>
          <Link
            href={`/scripts/${script.id}/rights`}
            className="interactive-button inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-card-border bg-transparent px-4 text-sm font-medium text-foreground transition-colors hover:bg-white/5"
          >
            <Circle size={12} />
            View Rights
          </Link>
        </div>
      )}
    </div>
  );
}

function SmallScoreRing({ score }: { score: number }) {
  const normalizedScore = Math.max(0, Math.min(score, 100));
  const radius = 33;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  return (
    <div className="relative mx-auto h-[96px] w-[96px]">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#282828"
          strokeWidth="6"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#f0ca66"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[2.1rem] font-semibold leading-none tabular-nums text-[#f3f3f7]">
          {normalizedScore}
        </span>
        <span className="text-[10px] text-muted">/100</span>
      </div>
    </div>
  );
}
