import { useState } from "react";
import { PURCHASE_ORDERS } from "../../data/mockData";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { useToast } from "../../context/ToastContext";
import { HubSection } from "../../components/HubSection";
import { Pill } from "../../components/Pill";
import { exportToCsv } from "../../lib/exportCsv";
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
  const { currentEmployee } = useAuth();
  const { suppliers, reportSupplierViolation } = useData();
  const { showToast } = useToast();
  const [supplierId, setSupplierId] = useState("");
  const [parts, setParts] = useState("");
  const [amount, setAmount] = useState("");

  const totalValue = PURCHASE_ORDERS.reduce((s, po) => s + po.items.reduce((x, i) => x + i.qty * i.unitCost, 0), 0);

  // An employee may only buy from a supplier the owner approved, and only from
  // the subset assigned to them when such a list exists.
  const allowedIds = currentEmployee?.allowedSupplierIds;
  function isAllowedForMe(id: string) {
    const supplier = suppliers.find((s) => s.id === id);
    if (!supplier?.approved) return false;
    return !allowedIds || allowedIds.includes(id);
  }

  function submitPurchase(e: React.FormEvent) {
    e.preventDefault();
    const supplier = suppliers.find((s) => s.id === supplierId);
    if (!supplier || !parts.trim() || !amount) {
      showToast("أكمل بيانات طلب الشراء", "bad");
      return;
    }
    if (!isAllowedForMe(supplierId)) {
      reportSupplierViolation({
        employeeId: currentEmployee!.id,
        employeeName: currentEmployee!.fullName,
        supplierId: supplier.id,
        supplierName: supplier.name,
        parts: parts.trim(),
        amount: Number(amount),
      });
      showToast("المورد غير معتمد — تم إيقاف العملية وإشعار صاحب الشركة", "bad");
    } else {
      showToast("تم إرسال طلب الشراء للاعتماد");
    }
    setParts("");
    setAmount("");
    setSupplierId("");
  }

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
          <div className="text-xs text-neutral-400">الموردون المعتمدون</div>
          <div className="mt-1 text-2xl font-bold text-brand-700 tabular-nums">
            {suppliers.filter((s) => s.approved).length} / {suppliers.length}
          </div>
        </div>
        <div className="rounded-xl border border-brand-100 bg-white p-5">
          <div className="text-xs text-neutral-400">بانتظار مطابقة الفاتورة</div>
          <div className="mt-1 text-2xl font-bold text-status-warn tabular-nums">
            {PURCHASE_ORDERS.filter((po) => !po.invoiceMatched).length}
          </div>
        </div>
      </div>

      <HubSection
        title="أوامر الشراء"
        description="طلب الشراء ← أمر الشراء ← الاستلام ← المطابقة"
        action={
          <button
            onClick={() =>
              exportToCsv(
                "أوامر-الشراء",
                PURCHASE_ORDERS.map((po) => ({
                  الرقم: po.number,
                  المورد: suppliers.find((s) => s.id === po.supplierId)?.name ?? "",
                  الفرع: po.branch,
                  القيمة: po.items.reduce((s, i) => s + i.qty * i.unitCost, 0),
                  الحالة: STATUS_LABEL[po.status],
                  "مطابقة الفاتورة": po.invoiceMatched ? "مطابقة" : "غير مطابقة",
                })),
              )
            }
            className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-50"
          >
            تصدير CSV
          </button>
        }
      >
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
                const supplier = suppliers.find((s) => s.id === po.supplierId);
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

      <HubSection
        title="طلب شراء جديد"
        description="الشراء مسموح فقط من الموردين المعتمدين من صاحب الشركة"
      >
        <form onSubmit={submitPurchase} className="grid gap-3 sm:grid-cols-4">
          <select
            value={supplierId}
            onChange={(e) => setSupplierId(e.target.value)}
            className="rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-brand-600 focus:outline-none"
          >
            <option value="">اختر المورد</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} {s.approved ? "" : "— غير معتمد"}
              </option>
            ))}
          </select>
          <input
            value={parts}
            onChange={(e) => setParts(e.target.value)}
            placeholder="القطع المطلوبة"
            className="rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-brand-600 focus:outline-none sm:col-span-2"
          />
          <input
            inputMode="numeric"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="القيمة بالريال"
            className="rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-brand-600 focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-bold text-white hover:bg-brand-700 sm:col-span-4"
          >
            إرسال طلب الشراء
          </button>
        </form>
        {supplierId && !isAllowedForMe(supplierId) && (
          <div className="mt-3 rounded-lg border border-status-bad bg-status-bad-bg p-3 text-xs text-status-bad">
            هذا المورد غير معتمد لك — أي محاولة شراء منه ستُوقَف تلقائيًا ويُبلَّغ صاحب الشركة بالتفاصيل.
          </div>
        )}
      </HubSection>

      <HubSection title="إدارة الموردين" description="حالة الاعتماد، مدد التوريد، والأداء">
        <div className="space-y-2">
          {suppliers.map((s) => (
            <div key={s.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-neutral-100 px-4 py-2.5 text-sm">
              <div>
                <div className="font-medium text-neutral-800">{s.name}</div>
                <div className="text-xs text-neutral-400">{s.category} · {s.contact}</div>
              </div>
              <div className="flex items-center gap-3 text-xs text-neutral-500">
                <span>مدة التوريد: <span className="font-semibold tabular-nums">{s.leadTimeDays} يوم</span></span>
                <Pill tone={s.approved ? "good" : "bad"}>{s.approved ? "معتمد" : "غير معتمد"}</Pill>
                <Pill tone={s.rating === "good" ? "good" : s.rating === "warn" ? "warn" : "bad"}>
                  {s.rating === "good" ? "موثوق" : s.rating === "warn" ? "متوسط" : "ضعيف"}
                </Pill>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[11px] text-neutral-400">
          اعتماد الموردين أو إلغاؤه من صلاحية صاحب الشركة وحده.
        </p>
      </HubSection>

      <HubSection title="تحليلات المشتريات" description="التكاليف، أداء الموردين، التأخيرات، واتجاهات الشراء">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { l: "متوسط مدة التوريد", v: "6.3 يوم" },
            { l: "أوامر متأخرة", v: "1" },
            { l: "توفير من المقارنة", v: "3,200 ﷼" },
            { l: "نسبة الشراء من معتمد", v: "100%" },
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
