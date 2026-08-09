import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { EMPLOYEES, MONTHLY_TARGET, SELLER_PERFORMANCE } from "../data/mockData";

export function Targets() {
  const { currentEmployee } = useAuth();
  const [newTarget, setNewTarget] = useState(String(MONTHLY_TARGET.targetSar));
  const canEdit = currentEmployee?.role === "owner";
  const canSeeLeaderboard = currentEmployee && ["owner", "branch_manager", "seller"].includes(currentEmployee.role);

  const leaderboard = [...SELLER_PERFORMANCE]
    .map((s) => ({
      ...s,
      employee: EMPLOYEES.find((e) => e.id === s.employeeId),
      pct: Math.round((s.achievedSar / s.targetSar) * 100),
    }))
    .sort((a, b) => b.pct - a.pct);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-800">الهدف الشهري للمبيعات</h1>
        <p className="text-sm text-neutral-500">
          {canEdit ? "بصفتك صاحب الشركة، أنت من يحدد هدف هذا الشهر لكل الفروع" : "تقدم كل فرع مقابل الهدف الذي حدده صاحب الشركة"}
        </p>
      </div>

      {canEdit && (
        <div className="flex flex-col items-stretch gap-3 rounded-xl border border-brand-100 bg-white p-5 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="mb-1 block text-xs font-medium text-neutral-500">هدف الشهر (ريال)</label>
            <input
              value={newTarget}
              onChange={(e) => setNewTarget(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm tabular-nums focus:border-brand-600 focus:outline-none"
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
              <div className="mt-2 text-2xl font-bold text-brand-700 tabular-nums">{pct}%</div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                <div className="h-full rounded-full bg-brand-600" style={{ width: `${Math.min(pct, 100)}%` }} />
              </div>
              <div className="mt-2 text-xs text-neutral-400 tabular-nums">
                {b.achieved.toLocaleString()} / {b.target.toLocaleString()} ريال
              </div>
            </div>
          );
        })}
      </div>

      {canSeeLeaderboard && (
        <div className="rounded-xl border border-brand-100 bg-white p-5">
          <div className="mb-3 text-sm font-bold text-neutral-700">ترتيب البائعين حسب تحقيق الهدف</div>
          <div className="space-y-2">
            {leaderboard.map((s, i) => (
              <div key={s.employeeId} className="flex items-center gap-3 rounded-lg border border-neutral-100 px-4 py-2.5">
                <span className="w-5 text-center text-sm font-bold text-neutral-400 tabular-nums">{i + 1}</span>
                <span className="flex-1 text-sm font-medium text-neutral-800">{s.employee?.fullName}</span>
                <div className="hidden w-32 sm:block">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
                    <div className="h-full rounded-full bg-brand-600" style={{ width: `${Math.min(s.pct, 100)}%` }} />
                  </div>
                </div>
                <span className="w-12 text-left text-sm font-bold text-brand-700 tabular-nums">{s.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
