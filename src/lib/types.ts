export interface Script {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  content: string | null;
  file_url: string | null;
  genre: string | null;
  tags: string[];
  status: "analyzing" | "scored" | "deal_offered";
  overall_score: number | null;
  plot_score: number | null;
  pacing_score: number | null;
  hook_score: number | null;
  characters_score: number | null;
  dialogue_score: number | null;
  binge_factor_score: number | null;
  decision:
    | "rights_purchase"
    | "revenue_share"
    | "marketplace"
    | "feedback"
    | null;
  good_feedback: FeedbackItem[];
  improvement_feedback: FeedbackItem[];
  created_at: string;
}

export interface FeedbackItem {
  title: string;
  description: string;
}

export interface ScoreBreakdown {
  plot: number;
  pacing: number;
  hook: number;
  characters: number;
  dialogue: number;
  binge_factor: number;
}
