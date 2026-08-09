import { PARTS, PURCHASE_ORDERS, SALES_DOCS, SUPPLIERS } from "../../data/mockData";
import { HubSection } from "../../components/HubSection";
import { Pill } from "../../components/Pill";

export function AccountantHub() {
  const inventoryValue = PARTS.reduce(
    (sum, p) => sum + p.costPrice * p.stockByBranch.reduce((s, b) => s + b.available, 0),
    0,
  );
  const salesTotal = SALES_DOCS.filter((d) => d.type === "order").reduce(
    (sum, d) => sum + d.items.reduce((s, i) => s + i.qty * i.unitPrice, 0) * (1 - d.discountPct / 100),
    0,
  );
  const payables = PURCHASE_ORDERS.filter((po) => !po.invoiceMatched).reduce(
    (sum, po) => sum + po.items.reduce((s, i) => s + i.qty * i.unitCost, 0),
    0,
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-800">المحاسبة</h1>
        <p className="text-sm text-neutral-500">دفتر الأستاذ، الذمم، الصندوق والبنك، محاسبة المخزون، والتقارير المالية</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-brand-100 bg-white p-5">
          <div className="text-xs text-neutral-400">مبيعات الفترة</div>
          <div className="mt-1 text-2xl font-bold text-brand-700 tabular-nums">{salesTotal.toLocaleString()} ﷼</div>
        </div>
        <div className="rounded-xl border border-brand-100 bg-white p-5">
          <div className="text-xs text-neutral-400">قيمة المخزون (تكلفة)</div>
          <div className="mt-1 text-2xl font-bold text-brand-700 tabular-nums">{inventoryValue.toLocaleString()} ﷼</div>
        </div>
        <div className="rounded-xl border border-brand-100 bg-white p-5">
          <div className="text-xs text-neutral-400">ذمم دائنة (موردين غير مطابَقة)</div>
          <div className="mt-1 text-2xl font-bold text-status-warn tabular-nums">{payables.toLocaleString()} ﷼</div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <HubSection title="المحاسبة العامة" description="دفتر الأستاذ، القيود، شجرة الحسابات، الفترات المحاسبية">
          <ul className="space-y-1.5 text-sm text-neutral-600">
            <li>عدد القيود هذا الشهر: <span className="font-semibold tabular-nums">312</span></li>
            <li>الفترة المحاسبية الحالية: <span className="font-semibold">أغسطس 2026</span></li>
            <li>قيود بانتظار الترحيل: <span className="font-semibold tabular-nums text-status-warn">6</span></li>
          </ul>
        </HubSection>

        <HubSection title="محاسبة المبيعات" description="فواتير البيع، إشعارات دائنة، تسوية المبيعات">
          <div className="space-y-1.5 text-sm">
            {SALES_DOCS.filter((d) => d.type === "order").map((d) => (
              <div key={d.id} className="flex justify-between border-b border-neutral-50 py-1">
                <span className="text-neutral-600">{d.number}</span>
                <Pill tone={d.status === "completed" ? "good" : "warn"}>{d.status === "completed" ? "مطابقة" : "قيد التسوية"}</Pill>
              </div>
            ))}
          </div>
        </HubSection>

        <HubSection title="المشتريات والذمم الدائنة" description="فواتير الموردين، أرصدة الموردين، الدفعات">
          <div className="space-y-1.5 text-sm">
            {PURCHASE_ORDERS.map((po) => {
              const supplier = SUPPLIERS.find((s) => s.id === po.supplierId);
              const value = po.items.reduce((s, i) => s + i.qty * i.unitCost, 0);
              return (
                <div key={po.id} className="flex justify-between border-b border-neutral-50 py-1">
                  <span className="text-neutral-600">{po.number} · {supplier?.name}</span>
                  <span className="tabular-nums font-semibold text-neutral-700">{value.toLocaleString()} ﷼</span>
                </div>
              );
            })}
          </div>
        </HubSection>

        <HubSection title="الذمم المدينة" description="مديونيات العملاء، الدفعات، تقارير الأعمار">
          <ul className="space-y-1.5 text-sm text-neutral-600">
            <li>إجمالي مستحق على العملاء: <span className="font-semibold tabular-nums">18,420 ﷼</span></li>
            <li>متأخر أكثر من 30 يوم: <span className="font-semibold tabular-nums text-status-bad">4,100 ﷼</span></li>
          </ul>
        </HubSection>

        <HubSection title="الصندوق والبنك" description="حركات نقدية وبنكية، مطابقة الصندوق والبنك">
          <p className="text-sm text-neutral-600">راجع الحركة اليومية عبر <a href="#/chats" className="text-brand-700 underline">شات صناديق المحلات</a> و<a href="#/chats" className="text-brand-700 underline">شات الحوالات</a>.</p>
        </HubSection>

        <HubSection title="محاسبة المخزون" description="تقييم المخزون، تكلفة البضاعة المباعة، تسويات المخزون">
          <ul className="space-y-1.5 text-sm text-neutral-600">
            <li>تكلفة البضاعة المباعة (الشهر): <span className="font-semibold tabular-nums">96,300 ﷼</span></li>
            <li>تسويات مخزون معلّقة: <span className="font-semibold tabular-nums text-status-warn">1</span></li>
          </ul>
        </HubSection>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <HubSection title="الضرائب والامتثال" description="السجلات الضريبية، الفواتير الضريبية، تقارير الامتثال">
          <p className="text-sm text-neutral-600">
            لا توجد ضريبة دخل على الرواتب في السعودية، لكن يجب أن تبقى سجلات الرواتب جاهزة لمراجعة
            هيئة الزكاة والضريبة والجمارك (ZATCA) في أي وقت.
          </p>
        </HubSection>

        <HubSection title="التقارير المالية" description="الأرباح والخسائر، الميزانية، التدفق النقدي، ميزان المراجعة">
          <div className="flex flex-wrap gap-2">
            {["الأرباح والخسائر", "الميزانية العمومية", "التدفق النقدي", "ميزان المراجعة"].map((r) => (
              <span key={r} className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-600">{r}</span>
            ))}
          </div>
        </HubSection>
      </div>
    </div>
  );
}
