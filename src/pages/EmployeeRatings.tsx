import { useState } from "react";
import { EMPLOYEES, PERFORMANCE_EVALUATIONS } from "../data/mockData";
import { RatingBadge } from "../components/RatingBadge";
import { EvaluationCard } from "../components/EvaluationCard";
import { groupByPerformance } from "../lib/performance";
import { ROLE_LABELS, type RatingColor } from "../types";

const GROUPS: { key: RatingColor; title: string; hint: string; dot: string }[] = [
  { key: "bad", title: "يحتاجون متابعة عاجلة", hint: "أخطاء متكررة وبدون تحسن ملحوظ", dot: "bg-status-bad" },
  { key: "warn", title: "أداء متذبذب", hint: "أحيانًا يخطئون وأحيانًا يصيبون", dot: "bg-status-warn" },
  { key: "good", title: "موظفون ممتازون", hint: "يلتزمون بالتعليمات ويتعلمون من أخطائهم", dot: "bg-status-good" },
];

const MONTH_DOT: Record<RatingColor, string> = {
  good: "bg-status-good",
  warn: "bg-status-warn",
  bad: "bg-status-bad",
};

const MONTH_LABEL: Record<string, string> = {
  "2026-05": "مايو",
  "2026-06": "يونيو",
  "2026-07": "يوليو",
  "2026-08": "أغسطس",
};

const TRACK_GROUPS = [
  { key: "achieved", title: "حققوا الهدف", hint: "وصلوا أو تجاوزوا الهدف المحدد لهم", dot: "bg-status-good" },
  { key: "improving", title: "في تحسّن", hint: "كان عندهم ملاحظات وتحسّن أداؤهم فعليًا", dot: "bg-status-warn" },
  { key: "needs_improvement", title: "يحتاجون تحسين", hint: "لم يحققوا الهدف ولا يوجد تحسّن ملموس", dot: "bg-status-bad" },
] as const;

export function EmployeeRatings() {
  const [openEvaluation, setOpenEvaluation] = useState<string | null>(null);
  const staff = EMPLOYEES.filter((e) => e.role !== "owner");
  const tracking = groupByPerformance(staff, PERFORMANCE_EVALUATIONS);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-800">تقييم أداء الموظفين</h1>
        <p className="text-sm text-neutral-500">هذا القسم خاص بصاحب الشركة فقط، ويُحدَّث تلقائيًا حسب سجل الأخطاء المُبلَّغة من كل الأقسام</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {TRACK_GROUPS.map((group) => (
          <div key={group.key} className="rounded-xl border border-brand-100 bg-white p-5">
            <div className="flex items-center gap-2 text-sm font-bold text-neutral-700">
              <span className={`h-2.5 w-2.5 rounded-full ${group.dot}`} />
              {group.title}
            </div>
            <div className="mt-1 text-2xl font-bold tabular-nums text-brand-700">
              {tracking[group.key].length}
            </div>
            <div className="mt-1 text-[11px] text-neutral-400">{group.hint}</div>
            {tracking[group.key].length > 0 && (
              <div className="mt-2 text-xs text-neutral-500">
                {tracking[group.key].map((e) => e.fullName.split(" ")[0]).join("، ")}
              </div>
            )}
          </div>
        ))}
      </div>

      {GROUPS.map((group) => {
        const list = EMPLOYEES.filter((e) => e.rating === group.key && e.role !== "owner");
        return (
          <div key={group.key} className="rounded-xl border border-brand-100 bg-white p-5">
            <div className="mb-1 flex items-center gap-2 text-sm font-bold text-neutral-700">
              <span className={`h-2.5 w-2.5 rounded-full ${group.dot}`} />
              {group.title}
              <span className="text-xs font-normal text-neutral-400">({list.length})</span>
            </div>
            <div className="mb-4 text-xs text-neutral-400">{group.hint}</div>
            {list.length === 0 ? (
              <div className="text-xs text-neutral-400">لا يوجد موظفون بهذا التصنيف حاليًا</div>
            ) : (
              <div className="space-y-3">
                {list.map((emp) => (
                  <div key={emp.id} className="rounded-lg border border-neutral-100 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <div className="font-semibold text-neutral-800">{emp.fullName}</div>
                        <div className="text-xs text-neutral-400">
                          {ROLE_LABELS[emp.role]} · {emp.branch}
                        </div>
                      </div>
                      <RatingBadge rating={emp.rating} />
                    </div>
                    <div className="mt-2 text-sm text-neutral-600">{emp.ratingNote}</div>
                    {emp.monthlyRatings && emp.monthlyRatings.length > 0 && (
                      <div className="mt-3 border-t border-neutral-100 pt-3">
                        <div className="mb-1.5 text-xs font-semibold text-neutral-500">التقييم الشهري:</div>
                        <div className="flex gap-3">
                          {emp.monthlyRatings.map((m) => (
                            <div key={m.month} className="flex flex-col items-center gap-1" title={m.note}>
                              <span className={`h-3 w-3 rounded-full ${MONTH_DOT[m.rating]}`} />
                              <span className="text-[10px] text-neutral-400">{MONTH_LABEL[m.month] ?? m.month}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {emp.mistakesLog.length > 0 && (
                      <div className="mt-3 space-y-1 border-t border-neutral-100 pt-3">
                        <div className="text-xs font-semibold text-neutral-500">سجل الأخطاء:</div>
                        {emp.mistakesLog.map((m, i) => (
                          <div key={i} className="text-xs text-neutral-400">
                            {m.date} — {m.note}
                          </div>
                        ))}
                      </div>
                    )}
                    {PERFORMANCE_EVALUATIONS.some((ev) => ev.employeeId === emp.id) && (
                      <div className="mt-3 border-t border-neutral-100 pt-3">
                        <button
                          onClick={() => setOpenEvaluation(openEvaluation === emp.id ? null : emp.id)}
                          className="text-xs font-semibold text-brand-700 hover:underline"
                        >
                          {openEvaluation === emp.id ? "إخفاء التقييم التفصيلي" : "عرض التقييم الشهري التفصيلي"}
                        </button>
                        {openEvaluation === emp.id && (
                          <div className="mt-3">
                            <EvaluationCard
                              evaluation={PERFORMANCE_EVALUATIONS.find((ev) => ev.employeeId === emp.id)!}
                              title={`تقييم ${emp.fullName}`}
                              description="يظهر لصاحب الشركة فقط — الموظف يرى تقييمه هو فقط"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
