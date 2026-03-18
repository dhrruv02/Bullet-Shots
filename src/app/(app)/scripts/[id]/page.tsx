"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Script } from "@/lib/types";
import { getScoreLabel } from "@/lib/utils";
import { ArrowRight, CheckCircle2, AlertTriangle } from "lucide-react";

export default function ScriptDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [script, setScript] = useState<Script | null>(null);
  const [loading, setLoading] = useState(true);
  const [retryingAnalysis, setRetryingAnalysis] = useState(false);
  const hasAutoRescored = useRef(false);
  const supabase = createClient();

  const runScoringAndSync = async (scriptId: string) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const response = await fetch("/api/score", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(session?.access_token
          ? { Authorization: `Bearer ${session.access_token}` }
          : {}),
      },
      body: JSON.stringify({ scriptId }),
    });

    if (!response.ok) return;

    const result = await response.json();
    if (result?.scores) {
      setScript((prev) => (prev ? ({ ...prev, ...result.scores } as Script) : prev));
    }
  };

  const handleRetryAnalysis = async () => {
    if (!script?.id || retryingAnalysis) return;
    setRetryingAnalysis(true);
    try {
      await runScoringAndSync(script.id);
    } finally {
      setRetryingAnalysis(false);
    }
  };

  const handleViewDecision = () => {
    if (!script?.id) return;
    router.push(`/scripts/${script.id}/deal`);
  };

  useEffect(() => {
    async function fetchScript() {
      const { data } = await supabase
        .from("scripts")
        .select("*")
        .eq("id", params.id)
        .single();

      if (data) {
        setScript(data as Script);
        if (
          !hasAutoRescored.current &&
          data.status !== "analyzing" &&
          data.overall_score !== 86
        ) {
          hasAutoRescored.current = true;
          await runScoringAndSync(data.id);
        }
      }
      setLoading(false);
    }
    fetchScript();

    // Poll while analyzing
    const interval = setInterval(async () => {
      const { data } = await supabase
        .from("scripts")
        .select("*")
        .eq("id", params.id)
        .single();

      if (data) {
        setScript(data as Script);
        if (data.status !== "analyzing") {
          clearInterval(interval);
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [params.id, supabase]);

  if (loading) {
    return (
      <div className="mx-auto max-w-[1060px] animate-fade-in">
        <div className="skeleton mb-4 h-7 w-52" />
        <div className="skeleton mb-6 h-4 w-[480px]" />
        <div className="mb-5 grid gap-5 lg:grid-cols-[315px_minmax(0,1fr)]">
          <div className="skeleton h-[290px] w-full" />
          <div className="skeleton h-[290px] w-full" />
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="skeleton h-[250px] w-full" />
          <div className="skeleton h-[250px] w-full" />
        </div>
      </div>
    );
  }

  if (!script) {
    return (
      <div className="flex flex-col items-center py-20 text-center">
        <p className="text-muted">Script not found</p>
        <button
          onClick={() => router.push("/dashboard")}
          className="mt-4 text-sm text-accent"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const isAnalyzing = script.status === "analyzing";
  const scoreRows = [
    { label: "Plot", score: script.plot_score ?? 0 },
    { label: "Pacing", score: script.pacing_score ?? 0 },
    { label: "Hook", score: script.hook_score ?? 0 },
    { label: "Characters", score: script.characters_score ?? 0 },
    { label: "Dialogue", score: script.dialogue_score ?? 0 },
    { label: "Binge Factor", score: script.binge_factor_score ?? 0 },
  ];
  const overallScore = script.overall_score ?? 0;

  return (
    <div className="mx-auto max-w-[1060px] animate-fade-in">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#9a9aa6]">
            AI Analysis
          </p>
          <h1 className="text-[2.35rem] font-semibold tracking-tight leading-tight text-[#f0f0f5]">
            {script.title}
          </h1>
          {script.description && (
            <p className="mt-1.5 max-w-2xl text-[1.08rem] leading-relaxed text-[#b0b0bd]">
              {script.description}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={handleViewDecision}
          disabled={isAnalyzing}
          aria-disabled={isAnalyzing}
          className="interactive-button inline-flex h-11 shrink-0 items-center gap-2 rounded-lg bg-accent px-5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          View Decision
          <ArrowRight size={14} />
        </button>
      </div>

      {isAnalyzing ? (
        <AnalyzingState
          onRetry={handleRetryAnalysis}
          retrying={retryingAnalysis}
        />
      ) : (
        <>
          <div className="grid gap-5 lg:grid-cols-[315px_minmax(0,1fr)]">
            <div className="interactive-card min-h-[290px] rounded-xl border border-card-border bg-[#111114] p-7">
              <p className="mb-5 text-center text-sm font-medium text-[#b2b2bd]">
                Overall Score
              </p>
              <OverallScoreRing score={overallScore} />
              <p className="mt-5 text-center text-[1.35rem] font-semibold text-[#dca95a]">
                {getScoreLabel(overallScore)}
              </p>
            </div>

            <div className="interactive-card min-h-[290px] rounded-xl border border-card-border bg-[#111114] p-6">
              <h2 className="mb-5 text-base font-semibold text-[#b6b6c2]">
                Score Breakdown
              </h2>
              <div className="space-y-4">
                {scoreRows.map((item) => (
                  <ScoreLine key={item.label} label={item.label} score={item.score} />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <FeedbackPanel
              title="What's Good"
              icon={<CheckCircle2 size={18} className="text-emerald-400" />}
              itemTitleClassName="text-emerald-300"
              emptyText="No positive highlights available yet."
              items={script.good_feedback ?? []}
            />
            <FeedbackPanel
              title="What Can Be Improved"
              icon={<AlertTriangle size={18} className="text-rose-400" />}
              itemTitleClassName="text-rose-300"
              emptyText="No improvement suggestions available yet."
              items={script.improvement_feedback ?? []}
            />
          </div>
        </>
      )}
    </div>
  );
}

function AnalyzingState({
  onRetry,
  retrying,
}: {
  onRetry: () => void;
  retrying: boolean;
}) {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center rounded-xl border border-card-border bg-card py-20">
      <div className="mb-6 flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-3 w-3 animate-bounce rounded-full bg-accent"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
      <h2 className="mb-2 text-lg font-semibold">AI Analysis</h2>
      <p className="text-sm text-muted">
        Analyzing your script... This usually takes a few seconds.
      </p>
      <button
        type="button"
        onClick={onRetry}
        disabled={retrying}
        className="interactive-button mt-5 rounded-lg border border-card-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-white/5 disabled:opacity-60"
      >
        {retrying ? "Retrying..." : "Retry Analysis"}
      </button>
    </div>
  );
}

function OverallScoreRing({ score }: { score: number }) {
  const normalizedScore = Math.max(0, Math.min(score, 100));
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (normalizedScore / 100) * circumference;

  return (
    <div className="relative mx-auto h-[170px] w-[170px]">
      <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="#27272a"
          strokeWidth="10"
        />
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="#f0ca66"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-700 ease-out"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[2.8rem] font-semibold leading-none tabular-nums text-[#f3f3f7]">
          {normalizedScore}
        </span>
        <span className="mt-1 text-[13px] text-[#9f9fad]">/100</span>
      </div>
    </div>
  );
}

function ScoreLine({ label, score }: { label: string; score: number }) {
  const normalizedScore = Math.max(0, Math.min(score, 100));
  const barColorClassName =
    normalizedScore >= 85
      ? "bg-emerald-400"
      : normalizedScore >= 70
        ? "bg-yellow-400"
        : normalizedScore >= 55
          ? "bg-orange-400"
          : "bg-rose-400";

  return (
    <div className="grid grid-cols-[115px_minmax(0,1fr)_38px] items-center gap-3">
      <span className="text-sm text-[#d2d2da]">{label}</span>
      <div className="h-[7px] overflow-hidden rounded-full bg-[#1f1f22]">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${barColorClassName}`}
          style={{ width: `${normalizedScore}%` }}
        />
      </div>
      <span
        className={`text-right text-sm font-semibold tabular-nums ${
          normalizedScore >= 85
            ? "text-emerald-300"
            : normalizedScore >= 70
              ? "text-yellow-300"
              : normalizedScore >= 55
                ? "text-orange-300"
                : "text-rose-300"
        }`}
      >
        {normalizedScore}
      </span>
    </div>
  );
}

function FeedbackPanel({
  title,
  icon,
  itemTitleClassName,
  emptyText,
  items,
}: {
  title: string;
  icon: React.ReactNode;
  itemTitleClassName: string;
  emptyText: string;
  items: { title: string; description: string }[];
}) {
  return (
    <div className="interactive-card min-h-[250px] rounded-xl border border-card-border bg-[#111114] p-6">
      <h3 className="mb-4 flex items-center gap-2 text-[16px] font-semibold leading-tight text-[#efeff4]">
        {icon}
        {title}
      </h3>

      {items.length === 0 ? (
        <p className="text-base text-[#a7a7b5]">{emptyText}</p>
      ) : (
        <div className="space-y-3.5">
          {items.map((item, index) => (
            <div key={`${item.title}-${index}`}>
              <p className={`text-[14px] font-semibold ${itemTitleClassName}`}>
                {item.title}
              </p>
              <p className="mt-0.5 text-[14px] leading-relaxed text-[#a8a8b4]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
