import { useMemo, useState } from "react";
import { DEFAULT_PERMISSIONS_BY_ROLE, EMPLOYEES, PERMISSION_MODULES } from "../data/mockData";
import { ROLE_LABELS, type Employee } from "../types";
import { RatingBadge } from "../components/RatingBadge";
import { EmptyState } from "../components/EmptyState";
import { exportToCsv } from "../lib/exportCsv";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { useToast } from "../context/ToastContext";
import { can } from "../lib/permissions";

const STATUS_LABEL: Record<Employee["status"], { label: string; className: string }> = {
  active: { label: "نشط", className: "bg-status-good-bg text-status-good" },
  suspended: { label: "موقوف", className: "bg-status-bad-bg text-status-bad" },
  leave: { label: "إجازة", className: "bg-status-warn-bg text-status-warn" },
};

export function EmployeeManagement() {
  const { currentEmployee } = useAuth();
  const { recordSecurityEvent } = useData();
  const { showToast } = useToast();
  const [selected, setSelected] = useState<Employee | null>(null);
  const [query, setQuery] = useState("");
  const [permissionsByEmployee, setPermissionsByEmployee] = useState<Record<string, Set<string>>>(() =>
    Object.fromEntries(EMPLOYEES.map((e) => [e.id, new Set(DEFAULT_PERMISSIONS_BY_ROLE[e.role])])),
  );

  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) return EMPLOYEES;
    return EMPLOYEES.filter(
      (e) => e.fullName.includes(q) || e.username.includes(q) || ROLE_LABELS[e.role].includes(q) || e.branch.includes(q),
    );
  }, [query]);

  const canEditPermissions = can(currentEmployee?.role, "permissions.edit");
  const canResetPassword = can(currentEmployee?.role, "users.resetPassword");

  function togglePermission(employee: Employee, moduleKey: string) {
    const moduleLabel = PERMISSION_MODULES.find((m) => m.key === moduleKey)?.label ?? moduleKey;
    const had = permissionsByEmployee[employee.id]?.has(moduleKey) ?? false;
    setPermissionsByEmployee((prev) => {
      const next = new Set(prev[employee.id]);
      if (next.has(moduleKey)) next.delete(moduleKey);
      else next.add(moduleKey);
      return { ...prev, [employee.id]: next };
    });
    recordSecurityEvent({
      category: "تدقيق الصلاحيات",
      who: currentEmployee!.fullName,
      action: `${had ? "سحب" : "منح"} صلاحية "${moduleLabel}" لـ ${employee.fullName}`,
      before: had ? "ممنوحة" : "غير ممنوحة",
      after: had ? "غير ممنوحة" : "ممنوحة",
      approvedBy: currentEmployee!.fullName,
      result: "cleared",
    });
  }

  function resetPassword(employee: Employee) {
    recordSecurityEvent({
      category: "تدقيق الصلاحيات",
      who: currentEmployee!.fullName,
      action: `إعادة تعيين كلمة مرور ${employee.fullName}`,
      before: "كلمة مرور سابقة",
      after: "كلمة مرور مؤقتة — يلزم تغييرها بأول دخول",
      approvedBy: currentEmployee!.fullName,
      result: "cleared",
    });
    showToast("تم إرسال كلمة مرور مؤقتة وتسجيل العملية بسجل التدقيق");
  }

  function handleExport() {
    exportToCsv(
      "الموظفون",
      filtered.map((e) => ({
        الاسم: e.fullName,
        "رقم الموظف": e.employeeNumber,
        اليوزر: e.username,
        الجوال: e.phone,
        الدور: ROLE_LABELS[e.role],
        الفرع: e.branch,
        الحالة: STATUS_LABEL[e.status].label,
        التقييم: e.rating,
      })),
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold text-neutral-800">إدارة الموظفين والصلاحيات</h1>
          <p className="text-sm text-neutral-500">بيانات كل موظف، دوره الوظيفي، وحالة حسابه — والصلاحيات التي يحددها المدير</p>
        </div>
        <button
          onClick={handleExport}
          className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-50"
        >
          تصدير CSV
        </button>
      </div>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="ابحث بالاسم أو اليوزر أو الدور أو الفرع..."
        className="w-full max-w-sm rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-brand-600 focus:outline-none"
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="overflow-x-auto rounded-xl border border-brand-100 bg-white lg:col-span-2">
          <table className="w-full text-right text-sm">
            <thead className="bg-brand-50 text-xs text-brand-700">
              <tr>
                <th className="px-4 py-3 font-semibold">الموظف</th>
                <th className="px-4 py-3 font-semibold">الدور</th>
                <th className="px-4 py-3 font-semibold">الفرع</th>
                <th className="px-4 py-3 font-semibold">الحالة</th>
                <th className="px-4 py-3 font-semibold">التقييم</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((emp) => (
                <tr
                  key={emp.id}
                  onClick={() => setSelected(emp)}
                  className={`cursor-pointer border-t border-neutral-100 hover:bg-brand-50/40 ${
                    selected?.id === emp.id ? "bg-brand-50/60" : ""
                  }`}
                >
                  <td className="px-4 py-3 font-medium text-neutral-800">{emp.fullName}</td>
                  <td className="px-4 py-3 text-neutral-500">{ROLE_LABELS[emp.role]}</td>
                  <td className="px-4 py-3 text-neutral-500">{emp.branch}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded px-2 py-0.5 text-[11px] font-semibold ${STATUS_LABEL[emp.status].className}`}>
                      {STATUS_LABEL[emp.status].label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <RatingBadge rating={emp.rating} />
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5}>
                    <EmptyState icon="search" title="لا توجد نتائج مطابقة" hint="جرّب كلمة بحث مختلفة" />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="rounded-xl border border-brand-100 bg-white p-5">
          {!selected ? (
            <div className="text-sm text-neutral-400">اضغط على موظف من الجدول لعرض بياناته الكاملة وصلاحياته</div>
          ) : (
            <div className="space-y-4">
              <div>
                <div className="font-bold text-neutral-800">{selected.fullName}</div>
                <div className="text-xs text-neutral-400">رقم الموظف: {selected.employeeNumber}</div>
              </div>
              <dl className="space-y-2 text-sm">
                <Row label="اسم المستخدم" value={selected.username} />
                <Row label="الجوال" value={selected.phone} />
                <Row label="الإيميل الشخصي" value={selected.personalEmail} />
                <Row label="الدور الوظيفي" value={ROLE_LABELS[selected.role]} />
                <Row label="الفرع" value={selected.branch} />
                <Row label="تاريخ التعيين" value={selected.hireDate} />
                <Row label="جهاز الدخول المرتبط" value={selected.boundDevice ?? "غير مسجّل"} />
              </dl>
              {canResetPassword && (
                <div className="border-t border-neutral-100 pt-3">
                  <button
                    onClick={() => resetPassword(selected)}
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-50"
                  >
                    إعادة تعيين كلمة المرور
                  </button>
                  <p className="mt-1.5 text-[11px] text-neutral-400">
                    كلمات المرور مخزّنة مشفّرة ولا يمكن عرضها لأي مستخدم — يمكن فقط إعادة تعيينها.
                  </p>
                </div>
              )}
              <div className="border-t border-neutral-100 pt-3">
                <div className="mb-2 text-xs font-semibold text-neutral-500">
                  الصلاحيات {canEditPermissions ? "(يحددها صاحب الشركة)" : "(للعرض فقط)"}
                </div>
                <div className="space-y-1.5">
                  {PERMISSION_MODULES.map((m) => {
                    const checked = permissionsByEmployee[selected.id]?.has(m.key) ?? false;
                    return (
                      <label
                        key={m.key}
                        className={`flex items-center justify-between rounded-lg border border-neutral-100 px-3 py-2 text-sm ${
                          canEditPermissions ? "cursor-pointer hover:bg-neutral-50" : "opacity-70"
                        }`}
                      >
                        <span className="text-neutral-700">{m.label}</span>
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={!canEditPermissions}
                          onChange={() => togglePermission(selected, m.key)}
                          className="h-4 w-4 accent-brand-600"
                        />
                      </label>
                    );
                  })}
                </div>
                {!canEditPermissions && (
                  <p className="mt-2 text-[11px] text-neutral-400">
                    تعديل الصلاحيات من صلاحية صاحب الشركة وحده.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-neutral-50 pb-1.5 tabular-nums">
      <dt className="text-neutral-400">{label}</dt>
      <dd className="font-medium text-neutral-700">{value}</dd>
    </div>
  );
}
