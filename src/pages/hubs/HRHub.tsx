import { EMPLOYEES, LEAVE_REQUESTS, NITAQAT_STATUS } from "../../data/mockData";
import { HubSection } from "../../components/HubSection";
import { Pill } from "../../components/Pill";
import { EmptyState } from "../../components/EmptyState";
import { buildIqamaAlerts, daysUntil } from "../../lib/iqama";
import { ROLE_LABELS } from "../../types";

const NITAQAT_BAND_LABEL = {
  platinum: "بلاتيني",
  high_green: "أخضر مرتفع",
  medium_green: "أخضر متوسط",
  low_green: "أخضر منخفض",
  red: "أحمر",
} as const;

const LEAVE_TYPE_LABEL = { annual: "إجازة سنوية", sick: "إجازة مرضية", emergency: "إجازة طارئة" } as const;

export function HRHub() {
  const withIqama = EMPLOYEES.filter((e) => e.iqamaExpiry).sort(
    (a, b) => daysUntil(a.iqamaExpiry!) - daysUntil(b.iqamaExpiry!),
  );
  const alerts = buildIqamaAlerts(EMPLOYEES);
  const critical = alerts.filter((a) => a.severity === "critical");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-800">الموارد البشرية</h1>
        <p className="text-sm text-neutral-500">متابعة الإقامات، طلبات الإجازات، ونسبة السعودة (نطاقات)</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-brand-100 bg-white p-5">
          <div className="text-xs text-neutral-400">نطاق السعودة (نطاقات)</div>
          <div className="mt-1 text-xl font-bold text-status-good">{NITAQAT_BAND_LABEL[NITAQAT_STATUS.band]}</div>
          <div className="mt-2 text-xs text-neutral-400 tabular-nums">
            نسبة السعودة {NITAQAT_STATUS.saudizationPct}% (المطلوب {NITAQAT_STATUS.requiredPct}%)
          </div>
        </div>
        <div className="rounded-xl border border-brand-100 bg-white p-5">
          <div className="text-xs text-neutral-400">إقامات تحتاج إجراء</div>
          <div className="mt-1 text-2xl font-bold text-status-warn tabular-nums">{alerts.length}</div>
          <div className="mt-1 text-[11px] text-neutral-400">
            منها <span className="font-semibold text-status-bad tabular-nums">{critical.length}</span> عاجلة (15 يوم أو أقل)
          </div>
        </div>
        <div className="rounded-xl border border-brand-100 bg-white p-5">
          <div className="text-xs text-neutral-400">طلبات إجازة معلّقة</div>
          <div className="mt-1 text-2xl font-bold text-status-warn tabular-nums">
            {LEAVE_REQUESTS.filter((l) => l.status === "pending").length}
          </div>
        </div>
      </div>

      <HubSection
        title="تنبيهات انتهاء الإقامات"
        description="تنبيه أصفر قبل شهر · تنبيه أحمر عاجل قبل 15 يوم — يصل للموارد البشرية ولصاحب الشركة"
      >
        {alerts.length === 0 ? (
          <EmptyState icon="check" title="ما فيه إقامات قريبة الانتهاء" hint="كل الإقامات سارية لأكثر من شهر" />
        ) : (
          <div className="space-y-2">
            {alerts.map((a) => (
              <div
                key={a.employeeId}
                className={`rounded-lg border p-3 text-sm ${
                  a.severity === "critical"
                    ? "border-status-bad bg-status-bad-bg/40"
                    : "border-status-warn bg-status-warn-bg/40"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium text-neutral-800">{a.message}</span>
                  <Pill tone={a.severity === "critical" ? "bad" : "warn"}>
                    {a.severity === "critical" ? "عاجل" : "تنبيه"}
                  </Pill>
                </div>
                <div className="mt-1 text-xs text-neutral-500">تاريخ الانتهاء: {a.expiry}</div>
              </div>
            ))}
          </div>
        )}
      </HubSection>

      <HubSection title="متابعة الإقامات" description="مرتبة حسب الأقرب انتهاءً">
        {withIqama.length === 0 ? (
          <div className="text-sm text-neutral-400">لا توجد إقامات مسجّلة بعد</div>
        ) : (
          <div className="space-y-2">
            {withIqama.map((e) => {
              const days = daysUntil(e.iqamaExpiry!);
              const tone = days <= 14 ? "bad" : days <= 30 ? "warn" : "good";
              return (
                <div key={e.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-neutral-100 px-4 py-2.5 text-sm">
                  <div>
                    <span className="font-medium text-neutral-800">{e.fullName}</span>
                    <span className="text-neutral-400"> · {ROLE_LABELS[e.role]} · {e.branch}</span>
                  </div>
                  <Pill tone={tone}>تنتهي بعد {days} يوم ({e.iqamaExpiry})</Pill>
                </div>
              );
            })}
          </div>
        )}
      </HubSection>

      <HubSection title="طلبات الإجازات">
        <div className="space-y-2">
          {LEAVE_REQUESTS.map((l) => {
            const emp = EMPLOYEES.find((e) => e.id === l.employeeId);
            return (
              <div key={l.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-neutral-100 px-4 py-2.5 text-sm">
                <div>
                  <span className="font-medium text-neutral-800">{emp?.fullName}</span>
                  <span className="text-neutral-400"> · {LEAVE_TYPE_LABEL[l.type]} · {l.fromDate} إلى {l.toDate}</span>
                </div>
                <Pill tone={l.status === "approved" ? "good" : l.status === "rejected" ? "bad" : "warn"}>
                  {l.status === "approved" ? "معتمدة" : l.status === "rejected" ? "مرفوضة" : "بانتظار الاعتماد"}
                </Pill>
              </div>
            );
          })}
        </div>
      </HubSection>

      <HubSection title="التدريب ودعم صندوق تنمية الموارد البشرية (هدف)" description="متابعة طلبات الدعم والتدريب الإلكتروني">
        <ul className="space-y-1.5 text-sm text-neutral-600">
          <li>موظفون مسجّلون بمنصة دروب: <span className="font-semibold tabular-nums">4</span></li>
          <li>طلبات دعم أجور قيد المراجعة: <span className="font-semibold tabular-nums">1</span></li>
        </ul>
      </HubSection>
    </div>
  );
}
