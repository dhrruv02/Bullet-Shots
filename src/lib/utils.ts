import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function getScoreLabel(score: number): string {
  if (score >= 90) return "Exceptional";
  if (score >= 80) return "Great";
  if (score >= 70) return "Good";
  if (score >= 60) return "Average";
  return "Needs Work";
}

export function getScoreColor(score: number): string {
  if (score >= 90) return "text-emerald-400";
  if (score >= 80) return "text-blue-400";
  if (score >= 70) return "text-yellow-400";
  return "text-red-400";
}

export function getDecisionLabel(
  decision: string | null
): string {
  switch (decision) {
    case "rights_purchase":
      return "Rights Purchase";
    case "revenue_share":
      return "Revenue Share";
    case "marketplace":
      return "In Marketplace";
    case "feedback":
      return "Feedback Given";
    default:
      return "Pending";
  }
}
