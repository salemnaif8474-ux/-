import { EMPLOYEES } from "../data/mockData";
import { RatingBadge } from "../components/RatingBadge";
import { ROLE_LABELS, type RatingColor } from "../types";

const GROUPS: { key: RatingColor; title: string; hint: string }[] = [
  { key: "bad", title: "🔴 يحتاجون متابعة عاجلة", hint: "أخطاء متكررة وبدون تحسن ملحوظ" },
  { key: "warn", title: "🟠 أداء متذبذب", hint: "أحيانًا يخطئون وأحيانًا يصيبون" },
  { key: "good", title: "🟢 موظفون ممتازون", hint: "يلتزمون بالتعليمات ويتعلمون من أخطائهم" },
];

export function EmployeeRatings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-800">تقييم أداء الموظفين</h1>
        <p className="text-sm text-neutral-500">هذا القسم خاص بصاحب الشركة فقط، ويُحدَّث تلقائيًا حسب سجل الأخطاء المُبلَّغة من كل الأقسام</p>
      </div>

      {GROUPS.map((group) => {
        const list = EMPLOYEES.filter((e) => e.rating === group.key && e.role !== "owner");
        return (
          <div key={group.key} className="rounded-xl border border-brand-100 bg-white p-5">
            <div className="mb-1 text-sm font-bold text-neutral-700">{group.title}</div>
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
