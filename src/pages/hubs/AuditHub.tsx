import { useMemo, useState } from "react";
import { useData } from "../../context/DataContext";
import { HubSection } from "../../components/HubSection";
import { Pill } from "../../components/Pill";
import { exportToCsv } from "../../lib/exportCsv";

const CATEGORIES = [
  "تدقيق المبيعات",
  "تدقيق المشتريات",
  "تدقيق المخزون",
  "تدقيق الصندوق",
  "تدقيق المحاسبة",
  "تدقيق الموردين",
  "تدقيق حسابات العملاء",
  "تدقيق الفروع",
  "تدقيق نشاط الموظفين",
  "تدقيق الصلاحيات",
  "تدقيق الامتثال",
  "تدقيق الأسعار",
];

const RESULT_LABEL = { flagged: "بحاجة متابعة", cleared: "سليم", pending: "قيد المراجعة" } as const;
const RESULT_TONE = { flagged: "bad", cleared: "good", pending: "warn" } as const;

export function AuditHub() {
  const { auditLog } = useData();
  const [category, setCategory] = useState<string>("all");
  const entries = category === "all" ? auditLog : auditLog.filter((e) => e.category === category);

  const presentCategories = useMemo(() => new Set(auditLog.map((e) => e.category)), [auditLog]);

  function handleExport() {
    exportToCsv(
      "سجل-التدقيق",
      entries.map((e) => ({
        الفئة: e.category,
        من: e.who,
        الوقت: e.when,
        الإجراء: e.action,
        قبل: e.before,
        بعد: e.after,
        الاعتماد: e.approvedBy,
        النتيجة: e.result,
      })),
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-800">التدقيق والمراجعة</h1>
        <p className="text-sm text-neutral-500">
          قسم مستقل عن العمليات اليومية — كل عملية حساسة تُسجَّل: من قام بها، ماذا فعل، متى، وما الذي تغيّر
        </p>
      </div>

      <HubSection title="فئات التدقيق" description="12 مجال تدقيق يغطيها هذا القسم">
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setCategory("all")}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${category === "all" ? "bg-brand-600 text-white" : "bg-neutral-100 text-neutral-600"}`}
          >
            الكل
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              disabled={!presentCategories.has(c)}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                category === c
                  ? "bg-brand-600 text-white"
                  : presentCategories.has(c)
                    ? "bg-neutral-100 text-neutral-600"
                    : "bg-neutral-50 text-neutral-300"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </HubSection>

      <HubSection
        title="سجل التدقيق"
        description="Who → What → When → Before → After → Approval → Result"
        action={
          <button
            onClick={handleExport}
            className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-50"
          >
            تصدير CSV
          </button>
        }
      >
        <div className="table-scroll overflow-x-auto">
          <table className="w-full min-w-[760px] text-right text-sm">
            <thead className="bg-brand-50 text-xs text-brand-700">
              <tr>
                <th className="px-3 py-2 font-semibold">الفئة</th>
                <th className="px-3 py-2 font-semibold">من</th>
                <th className="px-3 py-2 font-semibold">الإجراء</th>
                <th className="px-3 py-2 font-semibold">قبل</th>
                <th className="px-3 py-2 font-semibold">بعد</th>
                <th className="px-3 py-2 font-semibold">الاعتماد</th>
                <th className="px-3 py-2 font-semibold">النتيجة</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e) => (
                <tr key={e.id} className="border-t border-neutral-100 align-top">
                  <td className="px-3 py-2 text-neutral-500">{e.category}</td>
                  <td className="px-3 py-2 font-medium text-neutral-800">
                    {e.who}
                    <div className="text-[11px] font-normal text-neutral-400">{e.when}</div>
                  </td>
                  <td className="px-3 py-2 text-neutral-600">{e.action}</td>
                  <td className="px-3 py-2 tabular-nums text-neutral-500">{e.before}</td>
                  <td className="px-3 py-2 tabular-nums text-neutral-700">{e.after}</td>
                  <td className="px-3 py-2 text-neutral-500">{e.approvedBy}</td>
                  <td className="px-3 py-2">
                    <Pill tone={RESULT_TONE[e.result]}>{RESULT_LABEL[e.result]}</Pill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </HubSection>

      <div className="rounded-xl border border-status-warn bg-status-warn-bg/40 p-5 text-sm text-neutral-700">
        سجل التدقيق غير قابل للتعديل أو الحذف من قِبل أي مستخدم — حتى صاحب الشركة أو المدير — للحفاظ على
        موثوقية المراجعة الداخلية.
      </div>
    </div>
  );
}
