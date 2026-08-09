import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { MONTHLY_TARGET } from "../data/mockData";

export function Targets() {
  const { currentEmployee } = useAuth();
  const [newTarget, setNewTarget] = useState(String(MONTHLY_TARGET.targetSar));
  const canEdit = currentEmployee?.role === "owner";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-800">الهدف الشهري للمبيعات</h1>
        <p className="text-sm text-neutral-500">
          {canEdit ? "بصفتك صاحب الشركة، أنت من يحدد هدف هذا الشهر لكل الفروع" : "تقدم كل فرع مقابل الهدف الذي حدده صاحب الشركة"}
        </p>
      </div>

      {canEdit && (
        <div className="flex items-end gap-3 rounded-xl border border-brand-100 bg-white p-5">
          <div className="flex-1">
            <label className="mb-1 block text-xs font-medium text-neutral-500">هدف الشهر (ريال)</label>
            <input
              value={newTarget}
              onChange={(e) => setNewTarget(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-brand-600 focus:outline-none"
            />
          </div>
          <button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-bold text-white hover:bg-brand-700">
            حفظ الهدف
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {MONTHLY_TARGET.branchBreakdown.map((b) => {
          const pct = Math.round((b.achieved / b.target) * 100);
          return (
            <div key={b.branch} className="rounded-xl border border-brand-100 bg-white p-5">
              <div className="text-sm font-bold text-neutral-700">{b.branch}</div>
              <div className="mt-2 text-2xl font-bold text-brand-700">{pct}%</div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                <div className="h-full rounded-full bg-brand-600" style={{ width: `${Math.min(pct, 100)}%` }} />
              </div>
              <div className="mt-2 text-xs text-neutral-400">
                {b.achieved.toLocaleString()} / {b.target.toLocaleString()} ريال
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
