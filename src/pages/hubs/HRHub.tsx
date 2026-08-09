import { EMPLOYEES, LEAVE_REQUESTS, NITAQAT_STATUS } from "../../data/mockData";
import { HubSection } from "../../components/HubSection";
import { Pill } from "../../components/Pill";
import { ROLE_LABELS } from "../../types";

const NITAQAT_BAND_LABEL = {
  platinum: "بلاتيني",
  high_green: "أخضر مرتفع",
  medium_green: "أخضر متوسط",
  low_green: "أخضر منخفض",
  red: "أحمر",
} as const;

const LEAVE_TYPE_LABEL = { annual: "إجازة سنوية", sick: "إجازة مرضية", emergency: "إجازة طارئة" } as const;

function daysUntil(dateStr: string) {
  const diff = new Date(dateStr).getTime() - new Date("2026-08-09").getTime();
  return Math.round(diff / (1000 * 60 * 60 * 24));
}

export function HRHub() {
  const withIqama = EMPLOYEES.filter((e) => e.iqamaExpiry).sort(
    (a, b) => daysUntil(a.iqamaExpiry!) - daysUntil(b.iqamaExpiry!),
  );

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
          <div className="text-xs text-neutral-400">إقامات تنتهي خلال 30 يوم</div>
          <div className="mt-1 text-2xl font-bold text-status-warn tabular-nums">
            {withIqama.filter((e) => daysUntil(e.iqamaExpiry!) <= 30).length}
          </div>
        </div>
        <div className="rounded-xl border border-brand-100 bg-white p-5">
          <div className="text-xs text-neutral-400">طلبات إجازة معلّقة</div>
          <div className="mt-1 text-2xl font-bold text-status-warn tabular-nums">
            {LEAVE_REQUESTS.filter((l) => l.status === "pending").length}
          </div>
        </div>
      </div>

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
