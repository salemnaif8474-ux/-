import type { ReactNode } from "react";

const TONES = {
  good: "bg-status-good-bg text-status-good",
  warn: "bg-status-warn-bg text-status-warn",
  bad: "bg-status-bad-bg text-status-bad",
  neutral: "bg-neutral-100 text-neutral-600",
  brand: "bg-brand-50 text-brand-700",
} as const;

export function Pill({ tone, children }: { tone: keyof typeof TONES; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded px-2 py-0.5 text-[11px] font-semibold ${TONES[tone]}`}>
      {children}
    </span>
  );
}
