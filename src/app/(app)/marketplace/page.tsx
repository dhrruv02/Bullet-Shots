"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Script } from "@/lib/types";
import { Search, Star } from "lucide-react";

const SAMPLE_MARKETPLACE: Omit<Script, "user_id" | "content" | "file_url" | "good_feedback" | "improvement_feedback">[] = [
  {
    id: "m1",
    title: "Broken Strings",
    description:
      "A washed-up guitarist gets one last chance at redemption when a viral video of his street performance reaches millions.",
    genre: "Drama",
    tags: ["music", "family", "redemption"],
    status: "scored",
    overall_score: 74,
    plot_score: 76,
    pacing_score: 72,
    hook_score: 78,
    characters_score: 74,
    dialogue_score: 68,
    binge_factor_score: 73,
    decision: "marketplace",
    created_at: new Date().toISOString(),
  },
  {
    id: "m2",
    title: "Shadow Protocol",
    description:
      "A retired spy's smart home AI starts receiving encrypted messages from her old handler — someone she thought was dead.",
    genre: "Sci-Fi Thriller",
    tags: ["spy", "ai", "tech-thriller"],
    status: "scored",
    overall_score: 78,
    plot_score: 80,
    pacing_score: 76,
    hook_score: 82,
    characters_score: 75,
    dialogue_score: 72,
    binge_factor_score: 78,
    decision: "marketplace",
    created_at: new Date().toISOString(),
  },
  {
    id: "m3",
    title: "Desert Mirage",
    description:
      "A lost photographer stumbles upon a hidden oasis community with dark secrets about their water source.",
    genre: "Drama",
    tags: ["survival", "mystery"],
    status: "scored",
    overall_score: 77,
    plot_score: 79,
    pacing_score: 74,
    hook_score: 80,
    characters_score: 76,
    dialogue_score: 70,
    binge_factor_score: 77,
    decision: "marketplace",
    created_at: new Date().toISOString(),
  },
  {
    id: "m4",
    title: "Chai & Chaos",
    description:
      "Three college roommates start an underground chai delivery service that accidentally becomes a front for something bigger.",
    genre: "Comedy",
    tags: ["comedy", "college", "slice-of-life"],
    status: "scored",
    overall_score: 73,
    plot_score: 74,
    pacing_score: 72,
    hook_score: 76,
    characters_score: 78,
    dialogue_score: 65,
    binge_factor_score: 71,
    decision: "marketplace",
    created_at: new Date().toISOString(),
  },
];

export default function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [dbScripts, setDbScripts] = useState<Script[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function fetchMarketplace() {
      const { data } = await supabase
        .from("scripts")
        .select("*")
        .eq("decision", "marketplace")
        .order("overall_score", { ascending: false });

      if (data && data.length > 0) {
        setDbScripts(data as Script[]);
      }
    }
    fetchMarketplace();
  }, [supabase]);

  const allScripts = useMemo(() => {
    const byId = new Map<string, (typeof SAMPLE_MARKETPLACE)[number] | Script>();
    for (const script of SAMPLE_MARKETPLACE) byId.set(script.id, script);
    for (const script of dbScripts) byId.set(script.id, script);
    return Array.from(byId.values()).sort(
      (a, b) => (b.overall_score ?? 0) - (a.overall_score ?? 0)
    );
  }, [dbScripts]);

  const filtered = search
    ? allScripts.filter(
        (s) =>
          s.title.toLowerCase().includes(search.toLowerCase()) ||
          s.description?.toLowerCase().includes(search.toLowerCase()) ||
          s.genre?.toLowerCase().includes(search.toLowerCase()) ||
          s.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()))
      )
    : allScripts;

  return (
    <div className="mx-auto max-w-6xl animate-fade-in">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-[2rem] font-semibold tracking-tight text-foreground">
            Script Marketplace
          </h1>
          <p className="mt-1 text-sm text-muted">
            Discover scripts available for production
          </p>
        </div>

        <div className="relative w-full md:w-[16.5rem]">
          <Search
            size={14}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted/45"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search scripts..."
            className="h-10 w-full rounded-lg border border-card-border bg-card/85 py-2 pl-9 pr-3 text-xs text-foreground placeholder:text-muted/40 focus:border-accent/70 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((script) => (
          <MarketplaceCard key={script.id} script={script} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center py-16 text-center">
          <Search size={40} className="mb-3 text-muted/30" />
          <p className="text-muted">No scripts match your search</p>
        </div>
      )}
    </div>
  );
}

function MarketplaceCard({
  script,
}: {
  script: (typeof SAMPLE_MARKETPLACE)[number] | Script;
}) {
  const score = script.overall_score ?? "--";

  return (
    <article className="interactive-card relative overflow-hidden rounded-xl border border-card-border bg-card/90 p-4 shadow-[0_1px_0_rgba(255,255,255,0.02)] transition-all hover:border-accent/50">
      <div className="absolute inset-x-0 top-0 h-[3px] bg-accent/90" />

      <div className="mb-3 mt-2 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[0.95rem] font-semibold leading-tight text-foreground">
            {script.title}
          </h3>
          <span className="mt-1 inline-flex rounded-[6px] border border-card-border bg-black/25 px-1.5 py-0.5 text-[10px] text-muted">
            {script.genre}
          </span>
        </div>
        <span className="text-xl font-semibold tabular-nums text-accent">{score}</span>
      </div>

      <p className="mb-3 line-clamp-2 text-[12px] leading-relaxed text-muted/85">
        {script.description ?? "No description available."}
      </p>

      {script.tags && script.tags.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {script.tags.map((tag) => (
            <span
              key={tag}
              className="interactive-chip rounded-[6px] border border-card-border bg-transparent px-1.5 py-0.5 text-[10px] text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between border-t border-card-border pt-2.5">
        <span className="text-[11px] text-muted/80">
          All Rights Available
        </span>
        <button
          type="button"
          aria-label="Bookmark script"
          className="interactive-chip rounded-md p-1 text-muted/70 transition-colors hover:text-foreground"
        >
          <Star size={12} />
        </button>
      </div>
    </article>
  );
}
