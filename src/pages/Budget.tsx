import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { useToast } from "../context/ToastContext";
import { HubSection } from "../components/HubSection";
import { Pill } from "../components/Pill";
import { can } from "../lib/permissions";

export function Budget() {
  const { currentEmployee } = useAuth();
  const { budget, updateBudgetLine } = useData();
  const { showToast } = useToast();
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const canEdit = can(currentEmployee?.role, "budget.edit");
  const totalSpent = budget.lines.reduce((sum, l) => sum + l.spent, 0);
  const remaining = budget.totalAllocated - totalSpent;
  const usedPct = Math.round((totalSpent / budget.totalAllocated) * 100);

  function save(lineId: string) {
    const raw = drafts[lineId];
    const value = Number(raw);
    if (!raw || Number.isNaN(value) || value < 0) {
      showToast("أدخل مبلغًا صحيحًا", "bad");
      return;
    }
    updateBudgetLine(lineId, value, currentEmployee!.fullName);
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[lineId];
      return next;
    });
    showToast("تم تحديث الميزانية وتسجيلها بسجل التدقيق");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-800">ميزانية الشركة</h1>
        <p className="text-sm text-neutral-500">
          قسم مقصور على صاحب الشركة وحده — لا يظهر للمدير العام ولا لأي موظف آخر، ولا في البحث أو التنبيهات
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-brand-100 bg-white p-5">
          <div className="text-xs text-neutral-500">إجمالي الميزانية المعتمدة {budget.fiscalYear}</div>
          <div className="mt-1 text-2xl font-bold tabular-nums text-brand-700">
            {budget.totalAllocated.toLocaleString()} ﷼
          </div>
        </div>
        <div className="rounded-xl border border-brand-100 bg-white p-5">
          <div className="text-xs text-neutral-500">المصروف حتى الآن</div>
          <div className="mt-1 text-2xl font-bold tabular-nums text-neutral-800">
            {totalSpent.toLocaleString()} ﷼
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-100">
            <div className="h-full rounded-full bg-brand-600" style={{ width: `${Math.min(usedPct, 100)}%` }} />
          </div>
          <div className="mt-1 text-[11px] text-neutral-400">{usedPct}% من الميزانية</div>
        </div>
        <div className="rounded-xl border border-brand-100 bg-white p-5">
          <div className="text-xs text-neutral-500">المتبقي</div>
          <div className="mt-1 text-2xl font-bold tabular-nums text-status-good">
            {remaining.toLocaleString()} ﷼
          </div>
        </div>
      </div>

      <HubSection title="بنود الميزانية" description="التوزيع المعتمد لكل بند ونسبة الاستهلاك">
        <div className="table-scroll overflow-x-auto">
          <table className="w-full min-w-[720px] text-right text-sm">
            <thead className="bg-brand-50 text-xs text-brand-700">
              <tr>
                <th className="px-3 py-2 font-semibold">البند</th>
                <th className="px-3 py-2 font-semibold">المعتمد</th>
                <th className="px-3 py-2 font-semibold">المصروف</th>
                <th className="px-3 py-2 font-semibold">المتبقي</th>
                <th className="px-3 py-2 font-semibold">الحالة</th>
                {canEdit && <th className="px-3 py-2 font-semibold">تعديل المعتمد</th>}
              </tr>
            </thead>
            <tbody>
              {budget.lines.map((line) => {
                const left = line.allocated - line.spent;
                const pct = Math.round((line.spent / line.allocated) * 100);
                const tone = pct >= 95 ? "bad" : pct >= 80 ? "warn" : "good";
                return (
                  <tr key={line.id} className="border-t border-neutral-100">
                    <td className="px-3 py-2 font-medium text-neutral-800">{line.label}</td>
                    <td className="px-3 py-2 tabular-nums text-neutral-600">{line.allocated.toLocaleString()}</td>
                    <td className="px-3 py-2 tabular-nums text-neutral-600">{line.spent.toLocaleString()}</td>
                    <td className="px-3 py-2 tabular-nums text-neutral-700">{left.toLocaleString()}</td>
                    <td className="px-3 py-2">
                      <Pill tone={tone}>{pct}% مستهلك</Pill>
                    </td>
                    {canEdit && (
                      <td className="px-3 py-2">
                        <div className="flex gap-1.5">
                          <input
                            inputMode="numeric"
                            value={drafts[line.id] ?? ""}
                            onChange={(e) => setDrafts((prev) => ({ ...prev, [line.id]: e.target.value }))}
                            placeholder={String(line.allocated)}
                            className="w-28 rounded-lg border border-neutral-200 px-2 py-1 text-xs focus:border-brand-600 focus:outline-none"
                          />
                          <button
                            onClick={() => save(line.id)}
                            className="rounded-lg bg-brand-600 px-3 py-1 text-xs font-semibold text-white hover:bg-brand-700"
                          >
                            حفظ
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </HubSection>

      <div className="rounded-xl border border-status-warn bg-status-warn-bg/40 p-5 text-sm text-neutral-700">
        كل تعديل على الميزانية يُسجَّل في سجل التدقيق باسم من قام به وقيمته قبل وبعد التعديل.
      </div>
    </div>
  );
}
