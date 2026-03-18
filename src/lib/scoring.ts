import { FeedbackItem } from "./types";

function randomScore(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const GOOD_FEEDBACK_POOL: FeedbackItem[] = [
  {
    title: "Plot Structure",
    description: "Excellent story structure that keeps audiences engaged",
  },
  {
    title: "Opening Hook",
    description: "The first scene creates irresistible intrigue",
  },
  {
    title: "Character Development",
    description: "Characters feel authentic and relatable to the audience",
  },
  {
    title: "Binge Factor",
    description: "Viewers will be compelled to watch episode after episode",
  },
  {
    title: "Pacing",
    description: "The story moves at a rhythm that keeps viewers locked in",
  },
  {
    title: "Emotional Resonance",
    description:
      "Strong emotional beats that create genuine connection with the audience",
  },
  {
    title: "Visual Storytelling",
    description:
      "Scenes are written with strong visual language that translates well to screen",
  },
  {
    title: "Conflict Escalation",
    description:
      "Tension builds naturally and each episode raises the stakes effectively",
  },
];

const IMPROVEMENT_FEEDBACK_POOL: FeedbackItem[] = [
  {
    title: "Dialogue Quality",
    description: "Some dialogue feels expository — show, don't tell",
  },
  {
    title: "Pacing Issues",
    description:
      "Middle episodes could benefit from tighter pacing to maintain momentum",
  },
  {
    title: "Character Motivation",
    description:
      "Some character decisions feel forced — strengthen the internal logic",
  },
  {
    title: "Hook Clarity",
    description:
      "The opening could be sharper to immediately grab viewer attention",
  },
  {
    title: "Subplot Integration",
    description:
      "Side stories feel disconnected from the main narrative thread",
  },
  {
    title: "Ending Impact",
    description:
      "The finale could be more satisfying — consider a stronger emotional payoff",
  },
];

function pickRandom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function generateMockScores() {
  // Demo profile to keep the AI analysis screen consistent.
  const plot = 90;
  const pacing = 84;
  const hook = 88;
  const characters = 85;
  const dialogue = 58;
  const bingeFactor = 87;
  const overall = 86;

  const decision = "revenue_share";
  const status = "deal_offered";

  const goodFeedback = GOOD_FEEDBACK_POOL.slice(0, 4);
  const improvementFeedback = IMPROVEMENT_FEEDBACK_POOL.slice(0, 1);

  return {
    overall_score: overall,
    plot_score: plot,
    pacing_score: pacing,
    hook_score: hook,
    characters_score: characters,
    dialogue_score: dialogue,
    binge_factor_score: bingeFactor,
    decision,
    status,
    good_feedback: goodFeedback,
    improvement_feedback: improvementFeedback,
  };
}
