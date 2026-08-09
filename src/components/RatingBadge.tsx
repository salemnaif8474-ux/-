import type { RatingColor } from "../types";

const STYLES: Record<RatingColor, { bg: string; text: string; label: string; dot: string }> = {
  good: { bg: "bg-status-good-bg", text: "text-status-good", label: "ممتاز", dot: "bg-status-good" },
  warn: { bg: "bg-status-warn-bg", text: "text-status-warn", label: "متذبذب", dot: "bg-status-warn" },
  bad: { bg: "bg-status-bad-bg", text: "text-status-bad", label: "يحتاج متابعة", dot: "bg-status-bad" },
};

export function RatingBadge({ rating }: { rating: RatingColor }) {
  const s = STYLES[rating];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${s.bg} ${s.text}`}>
      <span className={`h-2 w-2 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}
