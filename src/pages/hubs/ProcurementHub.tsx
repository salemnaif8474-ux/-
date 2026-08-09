import { PURCHASE_ORDERS, SUPPLIERS } from "../../data/mockData";
import { HubSection } from "../../components/HubSection";
import { Pill } from "../../components/Pill";
import type { PurchaseOrderStatus } from "../../types";

const STATUS_LABEL: Record<PurchaseOrderStatus, string> = {
  requested: "مطلوب",
  approved: "معتمد",
  ordered: "تم الطلب",
  partially_received: "استلام جزئي",
  received: "مستلم",
  matched: "مطابق ماليًا",
};

const STATUS_TONE: Record<PurchaseOrderStatus, "neutral" | "warn" | "good"> = {
  requested: "neutral",
  approved: "warn",
  ordered: "warn",
  partially_received: "warn",
  received: "good",
  matched: "good",
};

export function ProcurementHub() {
  const totalValue = PURCHASE_ORDERS.reduce((s, po) => s + po.items.reduce((x, i) => x + i.qty * i.unitCost, 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-800">المشتريات</h1>
        <p className="text-sm text-neutral-500">من طلب الشراء إلى أمر الشراء، الاستلام، والمطابقة المالية — دورة واحدة متكاملة</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-brand-100 bg-white p-5">
          <div className="text-xs text-neutral-400">قيمة أوامر الشراء المفتوحة</div>
          <div className="mt-1 text-2xl font-bold text-brand-700 tabular-nums">{totalValue.toLocaleString()} ﷼</div>
        </div>
        <div className="rounded-xl border border-brand-100 bg-white p-5">
          <div className="text-xs text-neutral-400">عدد الموردين النشطين</div>
          <div className="mt-1 text-2xl font-bold text-brand-700 tabular-nums">{SUPPLIERS.length}</div>
        </div>
        <div className="rounded-xl border border-brand-100 bg-white p-5">
          <div className="text-xs text-neutral-400">بانتظار مطابقة الفاتورة</div>
          <div className="mt-1 text-2xl font-bold text-status-warn tabular-nums">
            {PURCHASE_ORDERS.filter((po) => !po.invoiceMatched).length}
          </div>
        </div>
      </div>

      <HubSection title="أوامر الشراء" description="طلب الشراء ← أمر الشراء ← الاستلام ← المطابقة">
        <div className="table-scroll overflow-x-auto">
          <table className="w-full min-w-[620px] text-right text-sm">
            <thead className="bg-brand-50 text-xs text-brand-700">
              <tr>
                <th className="px-3 py-2 font-semibold">الرقم</th>
                <th className="px-3 py-2 font-semibold">المورد</th>
                <th className="px-3 py-2 font-semibold">الفرع</th>
                <th className="px-3 py-2 font-semibold">القيمة</th>
                <th className="px-3 py-2 font-semibold">الحالة</th>
                <th className="px-3 py-2 font-semibold">مطابقة الفاتورة</th>
              </tr>
            </thead>
            <tbody>
              {PURCHASE_ORDERS.map((po) => {
                const supplier = SUPPLIERS.find((s) => s.id === po.supplierId);
                const value = po.items.reduce((s, i) => s + i.qty * i.unitCost, 0);
                return (
                  <tr key={po.id} className="border-t border-neutral-100">
                    <td className="px-3 py-2 font-mono text-xs text-neutral-600">{po.number}</td>
                    <td className="px-3 py-2 text-neutral-700">{supplier?.name}</td>
                    <td className="px-3 py-2 text-neutral-500">{po.branch}</td>
                    <td className="px-3 py-2 tabular-nums text-neutral-700">{value.toLocaleString()} ﷼</td>
                    <td className="px-3 py-2"><Pill tone={STATUS_TONE[po.status]}>{STATUS_LABEL[po.status]}</Pill></td>
                    <td className="px-3 py-2">
                      <Pill tone={po.invoiceMatched ? "good" : "neutral"}>{po.invoiceMatched ? "مطابقة" : "—"}</Pill>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </HubSection>

      <HubSection title="إدارة الموردين" description="بيانات الموردين، الأسعار، مدد التوريد، والأداء">
        <div className="space-y-2">
          {SUPPLIERS.map((s) => (
            <div key={s.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-neutral-100 px-4 py-2.5 text-sm">
              <div>
                <div className="font-medium text-neutral-800">{s.name}</div>
                <div className="text-xs text-neutral-400">{s.category} · {s.contact}</div>
              </div>
              <div className="flex items-center gap-3 text-xs text-neutral-500">
                <span>مدة التوريد: <span className="font-semibold tabular-nums">{s.leadTimeDays} يوم</span></span>
                <Pill tone={s.rating === "good" ? "good" : s.rating === "warn" ? "warn" : "bad"}>
                  {s.rating === "good" ? "موثوق" : s.rating === "warn" ? "متوسط" : "ضعيف"}
                </Pill>
              </div>
            </div>
          ))}
        </div>
      </HubSection>

      <HubSection title="تحليلات المشتريات" description="التكاليف، أداء الموردين، التأخيرات، واتجاهات الشراء">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { l: "متوسط مدة التوريد", v: "6.3 يوم" },
            { l: "أوامر متأخرة", v: "1" },
            { l: "توفير من المقارنة", v: "3,200 ﷼" },
            { l: "الالتزام بالميزانية", v: "92%" },
          ].map((s) => (
            <div key={s.l} className="rounded-lg bg-neutral-50 p-3 text-center">
              <div className="text-lg font-bold text-brand-700 tabular-nums">{s.v}</div>
              <div className="text-[11px] text-neutral-500">{s.l}</div>
            </div>
          ))}
        </div>
      </HubSection>
    </div>
  );
}
