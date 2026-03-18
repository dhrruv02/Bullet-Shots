import { createClient } from "@supabase/supabase-js";
import { generateMockScores } from "@/lib/scoring";
import { NextRequest, NextResponse } from "next/server";

function getSupabase(accessToken?: string) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    accessToken
      ? {
          global: {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        }
      : undefined
  );
}

export async function POST(request: NextRequest) {
  try {
    const { scriptId } = await request.json();

    if (!scriptId) {
      return NextResponse.json(
        { error: "scriptId is required" },
        { status: 400 }
      );
    }

    // Simulate AI processing delay (2-4 seconds)
    await new Promise((resolve) =>
      setTimeout(resolve, 2000 + Math.random() * 2000)
    );

    const scores = generateMockScores();
    const authHeader = request.headers.get("authorization");
    const accessToken = authHeader?.startsWith("Bearer ")
      ? authHeader.slice("Bearer ".length)
      : undefined;
    const supabase = getSupabase(accessToken);

    const { error } = await supabase
      .from("scripts")
      .update({
        overall_score: scores.overall_score,
        plot_score: scores.plot_score,
        pacing_score: scores.pacing_score,
        hook_score: scores.hook_score,
        characters_score: scores.characters_score,
        dialogue_score: scores.dialogue_score,
        binge_factor_score: scores.binge_factor_score,
        decision: scores.decision,
        status: scores.status,
        good_feedback: scores.good_feedback,
        improvement_feedback: scores.improvement_feedback,
      })
      .eq("id", scriptId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, scores });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
