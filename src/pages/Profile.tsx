import { useAuth } from "../context/AuthContext";
import { DEFAULT_PERMISSIONS_BY_ROLE, PERMISSION_MODULES } from "../data/mockData";
import { RatingBadge } from "../components/RatingBadge";
import { ROLE_LABELS } from "../types";

export function Profile() {
  const { currentEmployee } = useAuth();
  if (!currentEmployee) return null;

  const myPermissions = DEFAULT_PERMISSIONS_BY_ROLE[currentEmployee.role];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-neutral-800">حسابي</h1>
        <p className="text-sm text-neutral-500">بياناتك وصلاحياتك كما حددها المدير</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-brand-100 bg-white p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="font-bold text-neutral-800">{currentEmployee.fullName}</div>
              <div className="text-xs text-neutral-500">رقم الموظف: {currentEmployee.employeeNumber}</div>
            </div>
            <RatingBadge rating={currentEmployee.rating} />
          </div>
          <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
            <Row label="اسم المستخدم" value={currentEmployee.username} />
            <Row label="الجوال" value={currentEmployee.phone} />
            <Row label="الإيميل الشخصي" value={currentEmployee.personalEmail} />
            <Row label="الدور الوظيفي" value={ROLE_LABELS[currentEmployee.role]} />
            <Row label="الفرع" value={currentEmployee.branch} />
            <Row label="تاريخ التعيين" value={currentEmployee.hireDate} />
          </dl>
          {currentEmployee.role !== "owner" && (
            <div className="mt-4 rounded-lg bg-neutral-50 p-4 text-sm text-neutral-600">{currentEmployee.ratingNote}</div>
          )}
        </div>

        <div className="rounded-xl border border-brand-100 bg-white p-5">
          <div className="mb-3 text-sm font-bold text-neutral-700">الأقسام المتاحة لك</div>
          <div className="space-y-2">
            {PERMISSION_MODULES.map((m) => {
              const allowed = myPermissions.includes(m.key);
              return (
                <div key={m.key} className="flex items-center justify-between rounded-lg border border-neutral-100 px-3 py-2 text-sm">
                  <span className={allowed ? "text-neutral-700" : "text-neutral-400"}>{m.label}</span>
                  <span className={`text-xs font-semibold ${allowed ? "text-status-good" : "text-neutral-400"}`}>
                    {allowed ? "مفعّل" : "غير متاح"}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-3 text-xs text-neutral-400">لتعديل صلاحياتك تواصل مع الإدارة أو IT</div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-neutral-50 py-1.5 tabular-nums">
      <dt className="text-neutral-500">{label}</dt>
      <dd className="font-medium text-neutral-700">{value}</dd>
    </div>
  );
}
