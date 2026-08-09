import { useState } from "react";
import { Link } from "react-router-dom";
import { IT_TICKETS } from "../../data/mockData";
import { HubSection } from "../../components/HubSection";
import { Pill } from "../../components/Pill";
import type { ITTicketCategory } from "../../types";

const CATEGORY_LABEL: Record<ITTicketCategory, string> = {
  incident: "عطل",
  problem: "مشكلة جذرية",
  change: "طلب تغيير",
  access: "طلب صلاحية",
};

const STATUS_LABEL: Record<string, string> = { open: "مفتوحة", in_progress: "قيد المعالجة", resolved: "تم الحل" };

export function ITHub() {
  const [filter, setFilter] = useState<ITTicketCategory | "all">("all");
  const tickets = filter === "all" ? IT_TICKETS : IT_TICKETS.filter((t) => t.category === filter);
  const openCount = IT_TICKETS.filter((t) => t.status !== "resolved").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-800">مركز تقنية المعلومات</h1>
        <p className="text-sm text-neutral-500">الدعم الفني، إدارة الأصول والبرمجيات، مراقبة البنية التحتية، والأمن السيبراني</p>
      </div>

      <HubSection
        title={`تذاكر الدعم الفني (${openCount} مفتوحة)`}
        description="الحوادث، المشاكل الجذرية، طلبات التغيير، وطلبات الصلاحيات"
        action={
          <div className="flex gap-1.5">
            {(["all", "incident", "problem", "change", "access"] as const).map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                  filter === c ? "bg-brand-600 text-white" : "bg-neutral-100 text-neutral-600"
                }`}
              >
                {c === "all" ? "الكل" : CATEGORY_LABEL[c]}
              </button>
            ))}
          </div>
        }
      >
        <div className="space-y-2">
          {tickets.map((t) => (
            <div key={t.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-neutral-100 px-4 py-2.5 text-sm">
              <div>
                <div className="font-medium text-neutral-800">{t.subject}</div>
                <div className="text-xs text-neutral-400">
                  {t.requester} · {CATEGORY_LABEL[t.category]} · SLA {t.slaHours} ساعة · {t.createdAt}
                </div>
              </div>
              <div className="flex gap-1.5">
                <Pill tone={t.priority === "high" ? "bad" : t.priority === "medium" ? "warn" : "neutral"}>
                  {t.priority === "high" ? "عاجل" : t.priority === "medium" ? "متوسط" : "منخفض"}
                </Pill>
                <Pill tone={t.status === "resolved" ? "good" : "warn"}>{STATUS_LABEL[t.status]}</Pill>
              </div>
            </div>
          ))}
        </div>
      </HubSection>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Link to="/employees" className="rounded-xl border border-brand-100 bg-white p-5 transition hover:border-brand-600">
          <div className="text-sm font-bold text-neutral-700">المستخدمون والصلاحيات</div>
          <div className="mt-1 text-xs text-neutral-400">إنشاء/تعطيل حسابات، أدوار، وطلبات وصول</div>
        </Link>
        <HubSection title="الأجهزة والأصول">
          <ul className="space-y-1 text-sm text-neutral-600">
            <li>أجهزة مسجلة: <span className="font-semibold tabular-nums">47</span></li>
            <li>طابعات: <span className="font-semibold tabular-nums">9</span></li>
            <li>أجهزة شبكة: <span className="font-semibold tabular-nums">12</span></li>
          </ul>
        </HubSection>
        <HubSection title="البرمجيات والتراخيص">
          <ul className="space-y-1 text-sm text-neutral-600">
            <li>تراخيص نشطة: <span className="font-semibold tabular-nums">23</span></li>
            <li>تحتاج تجديد خلال 30 يوم: <span className="font-semibold tabular-nums text-status-warn">2</span></li>
          </ul>
        </HubSection>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <HubSection title="مراقبة البنية التحتية">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-600">حالة الأنظمة</span>
            <Pill tone="good">كل الأنظمة تعمل</Pill>
          </div>
        </HubSection>
        <HubSection title="النسخ الاحتياطي والاستعادة">
          <ul className="space-y-1 text-sm text-neutral-600">
            <li>آخر نسخة احتياطية: <span className="font-semibold">اليوم 03:00 ص</span></li>
            <li>الحالة: <Pill tone="good">ناجحة</Pill></li>
          </ul>
        </HubSection>
        <HubSection title="الأمن السيبراني">
          <ul className="space-y-1 text-sm text-neutral-600">
            <li>تنبيهات أمنية مفتوحة: <span className="font-semibold tabular-nums">0</span></li>
            <li>محاولات دخول مشبوهة (7 أيام): <span className="font-semibold tabular-nums">1</span></li>
          </ul>
        </HubSection>
      </div>

      <HubSection title="تقارير الأداء و SLA">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <MiniStat label="تذاكر مفتوحة" value={String(openCount)} />
          <MiniStat label="متوسط وقت الحل" value="5.2 ساعة" />
          <MiniStat label="التزام SLA" value="94%" />
          <MiniStat label="جاهزية الأنظمة" value="99.8%" />
        </div>
      </HubSection>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-neutral-50 p-3 text-center">
      <div className="text-lg font-bold text-brand-700 tabular-nums">{value}</div>
      <div className="text-[11px] text-neutral-500">{label}</div>
    </div>
  );
}
