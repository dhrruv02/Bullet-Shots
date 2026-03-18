"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

const GENRES = [
  "Thriller",
  "Mystery",
  "Romance",
  "Drama",
  "Comedy",
  "Horror",
  "Sci-Fi",
  "Action",
];

export default function SubmitPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const toggleTag = (tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    setError("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let fileUrl: string | null = null;

      if (file) {
        const ext = file.name.split(".").pop();
        const path = `${user.id}/${Date.now()}.${ext}`;
        const { error: uploadErr } = await supabase.storage
          .from("scripts")
          .upload(path, file);
        if (uploadErr) throw uploadErr;

        const {
          data: { publicUrl },
        } = supabase.storage.from("scripts").getPublicUrl(path);
        fileUrl = publicUrl;
      }

      const { data: script, error: insertErr } = await supabase
        .from("scripts")
        .insert({
          user_id: user.id,
          title: title.trim(),
          description: description.trim() || null,
          genre: genre || null,
          tags,
          file_url: fileUrl,
          status: "analyzing",
        })
        .select()
        .single();

      if (insertErr) throw insertErr;

      // Trigger mock scoring in the background with user auth so RLS allows update.
      const {
        data: { session },
      } = await supabase.auth.getSession();

      void fetch("/api/score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(session?.access_token
            ? { Authorization: `Bearer ${session.access_token}` }
            : {}),
        },
        body: JSON.stringify({ scriptId: script.id }),
      });

      router.push(`/scripts/${script.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Submit Your Script</h1>
        <p className="mt-1 text-sm text-muted">
          Upload your microdrama script for AI analysis
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">
            Script Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your script title"
            required
            className="w-full rounded-lg border border-card-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        {/* Logline */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">Logline</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A one or two sentence summary of your script..."
            rows={3}
            className="w-full resize-none rounded-lg border border-card-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        {/* Genre */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">Genre</label>
          <div className="flex flex-wrap gap-2">
            {GENRES.slice(0, 2).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGenre(genre === g ? "" : g)}
                className={cn(
                  "interactive-chip rounded-[14px] border px-6 py-2.5 text-sm font-medium transition-colors",
                  genre === g
                    ? "border-accent bg-accent/15 text-accent shadow-[0_0_0_1px_rgba(108,92,231,0.2)_inset]"
                    : "border-card-border text-muted hover:border-accent/30 hover:text-foreground"
                )}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">Tags</label>
          <div className="flex flex-wrap gap-2">
            {GENRES.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={cn(
                  "interactive-chip rounded-[14px] border px-5 py-2 text-sm font-medium transition-colors",
                  tags.includes(tag)
                    ? "border-accent bg-accent/15 text-accent shadow-[0_0_0_1px_rgba(108,92,231,0.2)_inset]"
                    : "border-card-border text-muted hover:border-accent/30 hover:text-foreground"
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* File Upload */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">
            Script File
          </label>
          {file ? (
            <div className="flex items-center justify-between rounded-lg border border-card-border bg-card px-4 py-3">
              <span className="truncate text-sm">{file.name}</span>
              <button
                type="button"
                onClick={() => setFile(null)}
                className="interactive-chip ml-2 text-muted hover:text-foreground"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <label
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              className="interactive-card flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-card-border py-10 transition-colors hover:border-accent/40"
            >
              <Upload size={32} className="mb-3 text-muted/50" />
              <span className="text-sm text-muted">
                Click to upload or drag and drop
              </span>
              <span className="mt-1 text-xs text-muted/50">
                PDF, DOC, TXT (Max 10MB)
              </span>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>
          )}
        </div>

        {error && (
          <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting || !title.trim()}
          className="interactive-button w-full rounded-lg bg-accent py-3.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit for AI Analysis"}
        </button>
      </form>
    </div>
  );
}
