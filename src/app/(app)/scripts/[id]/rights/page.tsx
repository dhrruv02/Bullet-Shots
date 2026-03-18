"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Script } from "@/lib/types";
import { ChevronLeft, Lock } from "lucide-react";

const RIGHTS_OWNED = [
  { name: "Digital Distribution (India)" },
  { name: "Remake Rights (Hindi)" },
];

const RIGHTS_AVAILABLE = [
  { name: "International Distribution" },
  { name: "Theatrical Rights" },
  { name: "Merchandise" },
  { name: "Sequel Rights" },
];

export default function RightsPage() {
  const params = useParams();
  const router = useRouter();
  const [script, setScript] = useState<Script | null>(null);
  const [loading, setLoading] = useState(true);
  const [inquired, setInquired] = useState<Set<string>>(new Set());
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

  const handleInquire = (name: string) => {
    setInquired((prev) => new Set([...prev, name]));
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-[760px]">
        <div className="skeleton mb-3 h-4 w-32" />
        <div className="skeleton mb-6 h-9 w-72" />
        <div className="skeleton mb-4 h-24 w-full" />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="skeleton h-[255px] w-full" />
          <div className="skeleton h-[255px] w-full" />
        </div>
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

  const totalRights = RIGHTS_OWNED.length + RIGHTS_AVAILABLE.length;

  return (
    <div className="mx-auto max-w-[760px] animate-fade-in">
      <button
        onClick={() => router.back()}
        className="interactive-chip mb-2 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#9797a5] transition-colors hover:text-foreground"
      >
        <ChevronLeft size={14} />
        Rights Availability
      </button>

      <div className="mb-5">
        <h1 className="text-[2.05rem] font-semibold tracking-tight text-[#f0f0f5]">
          {script.title}
        </h1>
      </div>

      <div className="interactive-card mb-4 rounded-xl border border-card-border bg-card p-5">
        <h2 className="mb-3 text-sm font-semibold text-foreground">Rights Overview</h2>
        <div className="grid grid-cols-3 gap-3">
          <div className="interactive-card rounded-lg border border-card-border bg-background/35 px-4 py-3 text-center">
            <div className="text-[1.75rem] font-semibold text-[#ec974b]">
              {RIGHTS_OWNED.length}
            </div>
            <div className="text-[11px] text-[#9d9dab]">Rights Owned</div>
          </div>
          <div className="interactive-card rounded-lg border border-card-border bg-background/35 px-4 py-3 text-center">
            <div className="text-[1.75rem] font-semibold text-[#22c55e]">
              {RIGHTS_AVAILABLE.length}
            </div>
            <div className="text-[11px] text-[#9d9dab]">Rights Available</div>
          </div>
          <div className="interactive-card rounded-lg border border-card-border bg-background/35 px-4 py-3 text-center">
            <div className="text-[1.75rem] font-semibold text-[#f3f3f7]">{totalRights}</div>
            <div className="text-[11px] text-[#9d9dab]">Total Rights</div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="interactive-card min-h-[250px] rounded-xl border border-card-border bg-card p-5">
          <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-[#efeff4]">
            <Lock size={15} className="text-[#ec974b]" />
            Rights Owned
          </h2>
          <div className="space-y-2.5">
            {RIGHTS_OWNED.map((right) => (
              <div
                key={right.name}
                className="interactive-card flex items-center gap-2 rounded-lg border border-[#5f3a21] bg-[#2b1d16] px-3.5 py-2.5"
              >
                <Lock size={11} className="text-[#ec974b]" />
                <span className="text-sm text-[#e4e4eb]">{right.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="interactive-card min-h-[250px] rounded-xl border border-card-border bg-card p-5">
          <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-[#efeff4]">
            <Lock size={15} className="text-[#22c55e]" />
            Rights Available
          </h2>
          <div className="space-y-2.5">
            {RIGHTS_AVAILABLE.map((right) => (
              <div
                key={right.name}
                className="interactive-card flex items-center justify-between rounded-lg border border-card-border bg-background/45 px-3.5 py-2.5"
              >
                <span className="inline-flex items-center gap-2 text-sm text-[#e4e4eb]">
                  <Lock size={11} className="text-[#22c55e]" />
                  {right.name}
                </span>
                <button
                  type="button"
                  onClick={() => handleInquire(right.name)}
                  disabled={inquired.has(right.name)}
                  className="interactive-chip text-xs font-semibold text-[#f0933c] transition-colors hover:text-[#ffad64] disabled:cursor-default disabled:text-[#6d6d79]"
                >
                  {inquired.has(right.name) ? "Sent" : "Inquire"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
