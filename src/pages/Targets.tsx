import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { EMPLOYEES, SELLER_PERFORMANCE } from "../data/mockData";

export function Targets() {
  const { currentEmployee } = useAuth();
  const { monthlyTarget, updateCompanyTarget, updateBranchTarget } = useData();
  const [companyInput, setCompanyInput] = useState(String(monthlyTarget.targetSar));
  const [branchInputs, setBranchInputs] = useState<Record<string, string>>(() =>
    Object.fromEntries(monthlyTarget.branchBreakdown.map((b) => [b.branch, String(b.target)])),
  );
  const [savedFlash, setSavedFlash] = useState<string | null>(null);

  if (!currentEmployee) return null;

  const canEditCompany = ["owner", "manager"].includes(currentEmployee.role);
  const canSeeLeaderboard = ["owner", "manager", "branch_manager", "seller"].includes(currentEmployee.role);

  function canEditBranch(branch: string) {
    if (canEditCompany) return true;
    return currentEmployee!.role === "branch_manager" && currentEmployee!.branch === branch;
  }

  function flash(label: string) {
    setSavedFlash(label);
    setTimeout(() => setSavedFlash(null), 2000);
  }

  function saveCompanyTarget() {
    const value = Number(companyInput.replace(/[^\d]/g, ""));
    if (!value || !currentEmployee) return;
    updateCompanyTarget(value, currentEmployee.fullName);
    flash("company");
  }

  function saveBranchTarget(branch: string) {
    const value = Number((branchInputs[branch] ?? "").replace(/[^\d]/g, ""));
    if (!value || !currentEmployee) return;
    updateBranchTarget(branch, value, currentEmployee.fullName);
    flash(branch);
  }

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
          {canEditCompany ? "بصفتك من الإدارة، أنت من يحدد هدف هذا الشهر لكل الفروع" : "تقدم كل فرع مقابل الهدف الذي حدده صاحب الشركة"}
        </p>
      </div>

      {canEditCompany && (
        <div className="flex flex-col items-stretch gap-3 rounded-xl border border-brand-100 bg-white p-5 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="mb-1 block text-xs font-medium text-neutral-500">هدف الشهر (ريال) — كل الشركة</label>
            <input
              value={companyInput}
              onChange={(e) => setCompanyInput(e.target.value)}
              inputMode="numeric"
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm tabular-nums focus:border-brand-600 focus:outline-none"
            />
          </div>
          <button
            onClick={saveCompanyTarget}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-bold text-white hover:bg-brand-700"
          >
            حفظ الهدف
          </button>
          {savedFlash === "company" && <span className="text-xs font-semibold text-status-good">تم الحفظ ✓</span>}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {monthlyTarget.branchBreakdown.map((b) => {
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
              {canEditBranch(b.branch) && (
                <div className="mt-3 flex items-center gap-2 border-t border-neutral-100 pt-3">
                  <input
                    value={branchInputs[b.branch] ?? String(b.target)}
                    onChange={(e) => setBranchInputs((prev) => ({ ...prev, [b.branch]: e.target.value }))}
                    inputMode="numeric"
                    className="w-full rounded-lg border border-neutral-200 px-2 py-1.5 text-xs tabular-nums focus:border-brand-600 focus:outline-none"
                  />
                  <button
                    onClick={() => saveBranchTarget(b.branch)}
                    className="shrink-0 rounded-lg border border-neutral-200 px-2.5 py-1.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-50"
                  >
                    حفظ
                  </button>
                </div>
              )}
              {savedFlash === b.branch && <div className="mt-1 text-xs font-semibold text-status-good">تم الحفظ ✓</div>}
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
