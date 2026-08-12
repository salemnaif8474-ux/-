import { PARTS } from "../../data/mockData";
import { HubSection } from "../../components/HubSection";
import { Pill } from "../../components/Pill";
import { EmptyState } from "../../components/EmptyState";
import { computeShortages, computeTransferCandidates, suggestedReorderQty } from "../../lib/inventory";

export function ShortagesHub() {
  const shortages = computeShortages(PARTS);
  const transferCandidates = computeTransferCandidates(PARTS);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-800">النواقص وإعادة الطلب</h1>
        <p className="text-sm text-neutral-500">
          يعتمد على نقطة إعادة الطلب (Reorder Point) ومخزون الأمان (Safety Stock) لكل قطعة وفرع
        </p>
      </div>

      <HubSection
        title={`قطع وصلت للحد الأدنى (${shortages.length})`}
        description="الكمية المتاحة أقل من أو تساوي نقطة إعادة الطلب"
      >
        {shortages.length === 0 ? (
          <EmptyState icon="check" title="لا توجد نواقص حاليًا" hint="كل القطع فوق نقطة إعادة الطلب" />
        ) : (
          <div className="table-scroll overflow-x-auto">
            <table className="w-full min-w-[560px] text-right text-sm">
              <thead className="bg-brand-50 text-xs text-brand-700">
                <tr>
                  <th className="px-3 py-2 font-semibold">القطعة</th>
                  <th className="px-3 py-2 font-semibold">الفرع</th>
                  <th className="px-3 py-2 font-semibold">المتاح</th>
                  <th className="px-3 py-2 font-semibold">نقطة الطلب</th>
                  <th className="px-3 py-2 font-semibold">مخزون الأمان</th>
                  <th className="px-3 py-2 font-semibold">الكمية المقترحة للطلب</th>
                </tr>
              </thead>
              <tbody>
                {shortages.map(({ part, branch }) => (
                  <tr key={`${part.id}-${branch.branch}`} className="border-t border-neutral-100">
                    <td className="px-3 py-2 font-medium text-neutral-800">{part.name}</td>
                    <td className="px-3 py-2 text-neutral-500">{branch.branch}</td>
                    <td className="px-3 py-2 tabular-nums"><Pill tone="bad">{branch.available}</Pill></td>
                    <td className="px-3 py-2 tabular-nums text-neutral-500">{part.reorderPoint}</td>
                    <td className="px-3 py-2 tabular-nums text-neutral-500">{part.safetyStock}</td>
                    <td className="px-3 py-2 tabular-nums font-semibold text-brand-700">
                      {suggestedReorderQty(part, branch.available)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </HubSection>

      <HubSection title="فرص النقل بين الفروع" description="بدل الشراء من جديد، انقل من فرع فيه فائض">
        {transferCandidates.length === 0 ? (
          <EmptyState icon="inbox" title="لا توجد فرص نقل مناسبة حاليًا" />
        ) : (
          <div className="space-y-2">
            {transferCandidates.map(({ part, from, to }, i) => (
              <div key={i} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-neutral-100 px-4 py-2.5 text-sm">
                <span className="text-neutral-700">
                  {part.name}: من <span className="font-semibold">{from.branch}</span> ({from.available} متاح) إلى{" "}
                  <span className="font-semibold">{to.branch}</span> ({to.available} فقط)
                </span>
                <Pill tone="warn">فرصة نقل</Pill>
              </div>
            ))}
          </div>
        )}
      </HubSection>

      <HubSection title="تحليلات النواقص">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { l: "أكثر قطعة تكررت نقصها", v: "فلتر زيت" },
            { l: "قيمة مبيعات مفقودة تقديرية", v: "9,600 ﷼" },
            { l: "متوسط مدة النقص", v: "3.2 يوم" },
            { l: "المورد الأكثر تأخيرًا", v: "شركة النجم" },
          ].map((s) => (
            <div key={s.l} className="rounded-lg bg-neutral-50 p-3 text-center">
              <div className="text-base font-bold text-brand-700">{s.v}</div>
              <div className="text-[11px] text-neutral-500">{s.l}</div>
            </div>
          ))}
        </div>
      </HubSection>
    </div>
  );
}
