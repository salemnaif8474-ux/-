import { HubSection } from "./HubSection";
import { Pill } from "./Pill";
import type { PerformanceEvaluation } from "../types";

const STATUS_LABEL = { good: "أداء ممتاز", warn: "يحتاج متابعة", bad: "يحتاج تحسين" } as const;

export function EvaluationCard({
  evaluation,
  title = "تقييمك الشهري",
  description = "خاص بك وحدك — لا يطّلع عليه أي موظف آخر",
}: {
  evaluation: PerformanceEvaluation;
  title?: string;
  description?: string;
}) {
  return (
    <HubSection
      title={title}
      description={description}
      action={<Pill tone={evaluation.status}>{STATUS_LABEL[evaluation.status]}</Pill>}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg bg-neutral-50 p-4">
          <div className="text-xs text-neutral-500">درجة الأداء ({evaluation.month})</div>
          <div className="mt-1 text-2xl font-bold tabular-nums text-brand-700">{evaluation.score}/100</div>
        </div>
        <div className="rounded-lg bg-neutral-50 p-4">
          <div className="text-xs text-neutral-500">تحقيق الهدف</div>
          <div className="mt-1 text-2xl font-bold tabular-nums text-brand-700">{evaluation.targetAchievedPct}%</div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-200">
            <div
              className="h-full rounded-full bg-brand-600"
              style={{ width: `${Math.min(evaluation.targetAchievedPct, 100)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <EvalList title="نقاط القوة" items={evaluation.strengths} tone="good" empty="—" />
        <EvalList title="ملاحظات ومشاكل" items={evaluation.issues} tone="bad" empty="ما فيه ملاحظات" />
        <EvalList title="التحسّن عن الأشهر السابقة" items={evaluation.improvements} tone="warn" empty="—" />
      </div>

      {evaluation.managerComment && (
        <div className="mt-4 rounded-lg border border-brand-100 bg-brand-50/50 p-3 text-sm text-neutral-700">
          <span className="font-semibold text-brand-700">ملاحظة الإدارة: </span>
          {evaluation.managerComment}
        </div>
      )}
    </HubSection>
  );
}

function EvalList({
  title,
  items,
  tone,
  empty,
}: {
  title: string;
  items: string[];
  tone: "good" | "warn" | "bad";
  empty: string;
}) {
  const dot = tone === "good" ? "bg-status-good" : tone === "bad" ? "bg-status-bad" : "bg-status-warn";
  return (
    <div>
      <div className="mb-2 text-xs font-semibold text-neutral-600">{title}</div>
      {items.length === 0 ? (
        <div className="text-xs text-neutral-400">{empty}</div>
      ) : (
        <ul className="space-y-1.5">
          {items.map((item) => (
            <li key={item} className="flex gap-2 text-xs text-neutral-600">
              <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
