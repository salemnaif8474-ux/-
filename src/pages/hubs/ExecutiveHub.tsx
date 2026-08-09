import { Link } from "react-router-dom";
import { useData } from "../../context/DataContext";
import { EMPLOYEES, PARTS, PURCHASE_ORDERS, SUPPLIERS } from "../../data/mockData";
import { HubSection } from "../../components/HubSection";
import { Pill } from "../../components/Pill";

export function ExecutiveHub() {
  const { monthlyTarget } = useData();
  const inventoryValue = PARTS.reduce(
    (sum, p) => sum + p.costPrice * p.stockByBranch.reduce((s, b) => s + b.available, 0),
    0,
  );
  const revenue = monthlyTarget.achievedSar;
  const cogs = 640_000;
  const grossProfit = revenue - cogs;
  const marginPct = Math.round((grossProfit / revenue) * 100);
  const badEmployees = EMPLOYEES.filter((e) => e.rating === "bad").length;
  const openPOs = PURCHASE_ORDERS.filter((po) => po.status !== "matched").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-800">اللوحة التنفيذية</h1>
        <p className="text-sm text-neutral-500">
          مؤشرات ما وراء لوحة <Link to="/" className="text-brand-700 underline">الرئيسية</Link> — الربحية،
          المخزون، الموردين، العملاء، والمخاطر
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat label="الربح الإجمالي" value={`${grossProfit.toLocaleString()} ﷼`} />
        <Stat label="هامش الربح" value={`${marginPct}%`} />
        <Stat label="قيمة المخزون" value={`${inventoryValue.toLocaleString()} ﷼`} />
        <Stat label="أوامر شراء مفتوحة" value={String(openPOs)} tone={openPOs > 0 ? "warn" : "good"} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <HubSection title="أداء الموردين">
          <div className="space-y-2">
            {SUPPLIERS.map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-lg border border-neutral-100 px-3 py-2 text-sm">
                <div>
                  <div className="font-medium text-neutral-800">{s.name}</div>
                  <div className="text-xs text-neutral-400">{s.category} · مدة التوريد {s.leadTimeDays} يوم</div>
                </div>
                <Pill tone={s.rating === "good" ? "good" : s.rating === "warn" ? "warn" : "bad"}>
                  {s.rating === "good" ? "موثوق" : s.rating === "warn" ? "متوسط" : "ضعيف"}
                </Pill>
              </div>
            ))}
          </div>
        </HubSection>

        <HubSection title="التدفق النقدي والذمم" description="نظرة تنفيذية سريعة">
          <ul className="space-y-1.5 text-sm text-neutral-600">
            <li>تدفق نقدي صافٍ (الشهر): <span className="font-semibold tabular-nums text-status-good">+64,200 ﷼</span></li>
            <li>ذمم مدينة (عملاء): <span className="font-semibold tabular-nums">18,420 ﷼</span></li>
            <li>ذمم دائنة (موردين): <span className="font-semibold tabular-nums text-status-warn">4,320 ﷼</span></li>
          </ul>
        </HubSection>

        <HubSection title="مؤشرات استراتيجية (KPIs)">
          <ul className="space-y-1.5 text-sm text-neutral-600">
            <li>تكلفة اكتساب البيع الواحد: <span className="font-semibold tabular-nums">—</span></li>
            <li>معدل تحويل عروض الأسعار لطلبات: <span className="font-semibold tabular-nums">61%</span></li>
            <li>معدل دوران المخزون: <span className="font-semibold tabular-nums">4.2×/سنة</span></li>
          </ul>
        </HubSection>

        <HubSection
          title="تنبيهات المخاطر"
          action={
            <Link to="/ratings" className="text-xs font-semibold text-brand-700 hover:underline">
              عرض تقييم الموظفين ←
            </Link>
          }
        >
          <ul className="space-y-1.5 text-sm text-neutral-600">
            <li>
              موظفون بأداء ضعيف: <span className="font-semibold tabular-nums text-status-bad">{badEmployees}</span>
            </li>
            <li>
              فاتورة مورد غير مطابقة: <span className="font-semibold tabular-nums text-status-warn">{openPOs}</span>
            </li>
          </ul>
        </HubSection>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Link to="/audit" className="rounded-xl border border-brand-100 bg-white p-5 transition hover:border-brand-600">
          <div className="text-sm font-bold text-neutral-700">التدقيق والامتثال</div>
          <div className="mt-1 text-xs text-neutral-400">سجل كل عملية حساسة بالشركة — من قام بها ومتى</div>
        </Link>
        <div className="rounded-xl border border-brand-100 bg-white p-5">
          <div className="text-sm font-bold text-neutral-700">التقارير التنفيذية</div>
          <div className="mt-1 flex flex-wrap gap-2">
            {["تقرير شامل شهري", "مقارنة الفروع", "تقرير الموردين", "تقرير العملاء"].map((r) => (
              <span key={r} className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-600">{r}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "good" | "warn" }) {
  const color = tone === "warn" ? "text-status-warn" : tone === "good" ? "text-status-good" : "text-brand-700";
  return (
    <div className="rounded-xl border border-brand-100 bg-white p-4">
      <div className="text-xs text-neutral-400">{label}</div>
      <div className={`mt-1 text-xl font-bold tabular-nums ${color}`}>{value}</div>
    </div>
  );
}
