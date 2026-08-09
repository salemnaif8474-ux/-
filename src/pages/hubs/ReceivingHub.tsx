import { PURCHASE_ORDERS, SUPPLIERS } from "../../data/mockData";
import { HubSection } from "../../components/HubSection";
import { Pill } from "../../components/Pill";
import type { PurchaseOrderStatus } from "../../types";

const STEPS: { key: PurchaseOrderStatus; label: string; hint: string }[] = [
  { key: "ordered", label: "استلام البضاعة", hint: "مقابل أمر الشراء" },
  { key: "partially_received", label: "التحقق من الكمية", hint: "مطابقة المستلم بالمطلوب" },
  { key: "received", label: "فحص الحالة والجودة", hint: "تسجيل حالة القطع عند الاستلام" },
  { key: "matched", label: "التخزين", hint: "تحديد مكان التخزين" },
];

function stepIndex(status: PurchaseOrderStatus) {
  const order: PurchaseOrderStatus[] = ["requested", "approved", "ordered", "partially_received", "received", "matched"];
  return order.indexOf(status);
}

export function ReceivingHub() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-800">استلام البضاعة</h1>
        <p className="text-sm text-neutral-500">
          مطابقة أمر الشراء (PO) بمحضر الاستلام (Goods Receipt) وفاتورة المورد قبل إقفال العملية ماليًا
        </p>
      </div>

      {PURCHASE_ORDERS.map((po) => {
        const supplier = SUPPLIERS.find((s) => s.id === po.supplierId);
        const idx = stepIndex(po.status);
        return (
          <HubSection
            key={po.id}
            title={`${po.number} — ${supplier?.name}`}
            description={`${po.branch} · طلب بواسطة ${po.requestedBy} · ${po.date}`}
            action={<Pill tone={po.invoiceMatched ? "good" : "warn"}>{po.invoiceMatched ? "مطابقة الفاتورة تمت" : "بانتظار مطابقة الفاتورة"}</Pill>}
          >
            <div className="mb-4 flex flex-wrap gap-2">
              {STEPS.map((step, i) => {
                const stepOrderIdx = stepIndex(step.key);
                const done = idx >= stepOrderIdx;
                return (
                  <div
                    key={step.key}
                    className={`flex-1 min-w-[140px] rounded-lg border px-3 py-2.5 text-xs ${
                      done ? "border-status-good bg-status-good-bg" : "border-neutral-200 bg-neutral-50"
                    }`}
                  >
                    <div className={`font-bold ${done ? "text-status-good" : "text-neutral-400"}`}>
                      {i + 1}. {step.label}
                    </div>
                    <div className="mt-0.5 text-neutral-500">{step.hint}</div>
                  </div>
                );
              })}
            </div>
            <div className="table-scroll overflow-x-auto">
              <table className="w-full min-w-[420px] text-right text-sm">
                <thead className="text-xs text-neutral-400">
                  <tr>
                    <th className="px-2 py-1 font-medium">القطعة</th>
                    <th className="px-2 py-1 font-medium">الكمية المطلوبة</th>
                    <th className="px-2 py-1 font-medium">تكلفة الوحدة</th>
                  </tr>
                </thead>
                <tbody>
                  {po.items.map((it) => (
                    <tr key={it.partNumber} className="border-t border-neutral-100">
                      <td className="px-2 py-1.5 text-neutral-700">{it.name}</td>
                      <td className="px-2 py-1.5 tabular-nums text-neutral-600">{it.qty}</td>
                      <td className="px-2 py-1.5 tabular-nums text-neutral-600">{it.unitCost.toLocaleString()} ﷼</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </HubSection>
        );
      })}
    </div>
  );
}
