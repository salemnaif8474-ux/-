import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { useToast } from "../../context/ToastContext";
import { EMPLOYEES, PARTS, PURCHASE_ORDERS } from "../../data/mockData";
import { HubSection } from "../../components/HubSection";
import { Pill } from "../../components/Pill";
import { EmptyState } from "../../components/EmptyState";
import { buildIqamaAlerts } from "../../lib/iqama";

export function ExecutiveHub() {
  const { currentEmployee } = useAuth();
  const {
    monthlyTarget,
    suppliers,
    setSupplierApproval,
    supplierViolations,
    decideSupplierViolation,
    customerRequests,
    decideCustomerRequest,
  } = useData();
  const { showToast } = useToast();
  const inventoryValue = PARTS.reduce(
    (sum, p) => sum + p.costPrice * p.stockByBranch.reduce((s, b) => s + b.available, 0),
    0,
  );
  const revenue = monthlyTarget.achievedSar;
  const cogs = 640_000;
  const grossProfit = revenue - cogs;
  const marginPct = Math.round((grossProfit / revenue) * 100);
  const iqamaAlerts = buildIqamaAlerts(EMPLOYEES);
  const criticalIqama = iqamaAlerts.filter((a) => a.severity === "critical").length;
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
        <HubSection title="الموردون المعتمدون" description="اعتماد المورد أو إلغاؤه — صلاحية حصرية لصاحب الشركة">
          <div className="space-y-2">
            {suppliers.map((s) => (
              <div key={s.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-neutral-100 px-3 py-2 text-sm">
                <div>
                  <div className="font-medium text-neutral-800">{s.name}</div>
                  <div className="text-xs text-neutral-400">{s.category} · مدة التوريد {s.leadTimeDays} يوم</div>
                </div>
                <div className="flex items-center gap-2">
                  <Pill tone={s.approved ? "good" : "bad"}>{s.approved ? "معتمد" : "غير معتمد"}</Pill>
                  <button
                    onClick={() => {
                      setSupplierApproval(s.id, !s.approved, currentEmployee!.fullName);
                      showToast(s.approved ? "تم إلغاء اعتماد المورد" : "تم اعتماد المورد");
                    }}
                    className="rounded-lg border border-neutral-200 px-3 py-1 text-xs font-semibold text-neutral-600 hover:bg-neutral-50"
                  >
                    {s.approved ? "إلغاء الاعتماد" : "اعتماد"}
                  </button>
                </div>
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
            <li>
              إقامات تحتاج إجراء:{" "}
              <span className="font-semibold tabular-nums text-status-warn">{iqamaAlerts.length}</span>
              {criticalIqama > 0 && (
                <span className="font-semibold text-status-bad"> (منها {criticalIqama} عاجلة)</span>
              )}
            </li>
          </ul>
          {iqamaAlerts.length > 0 && (
            <ul className="mt-2 space-y-1 border-t border-neutral-100 pt-2">
              {iqamaAlerts.slice(0, 3).map((a) => (
                <li key={a.employeeId} className="text-xs text-neutral-500">
                  {a.message}
                </li>
              ))}
            </ul>
          )}
        </HubSection>
      </div>

      <HubSection
        title="مخالفات الشراء من موردين غير معتمدين"
        description="عمليات موقوفة تلقائيًا بانتظار قرارك — مع اسم الموظف والمورد والقطع والقيمة"
      >
        {supplierViolations.filter((v) => v.status === "held").length === 0 ? (
          <EmptyState icon="check" title="ما فيه مخالفات موقوفة" hint="كل عمليات الشراء تمت من موردين معتمدين" />
        ) : (
          <div className="space-y-2">
            {supplierViolations
              .filter((v) => v.status === "held")
              .map((v) => (
                <div key={v.id} className="rounded-lg border border-status-bad bg-status-bad-bg/40 p-3 text-sm">
                  <div className="font-semibold text-neutral-800">
                    {v.employeeName} حاول الشراء من {v.supplierName}
                  </div>
                  <div className="mt-1 text-xs text-neutral-600">
                    القطع: {v.parts} · القيمة: <span className="tabular-nums">{v.amount.toLocaleString()} ﷼</span> · {v.date}
                  </div>
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => {
                        decideSupplierViolation(v.id, "approved", currentEmployee!.fullName);
                        showToast("تم اعتماد العملية استثنائيًا");
                      }}
                      className="rounded-lg bg-brand-600 px-3 py-1 text-xs font-semibold text-white hover:bg-brand-700"
                    >
                      اعتماد استثنائي
                    </button>
                    <button
                      onClick={() => {
                        decideSupplierViolation(v.id, "rejected", currentEmployee!.fullName);
                        showToast("تم رفض العملية");
                      }}
                      className="rounded-lg border border-neutral-200 px-3 py-1 text-xs font-semibold text-neutral-600 hover:bg-neutral-50"
                    >
                      رفض
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </HubSection>

      <HubSection
        title="طلبات إضافة عملاء"
        description="لا يُضاف أي عميل للنظام إلا باعتمادك"
      >
        {customerRequests.filter((r) => r.status === "pending").length === 0 ? (
          <EmptyState icon="check" title="ما فيه طلبات معلّقة" hint="كل طلبات إضافة العملاء تمت معالجتها" />
        ) : (
          <div className="space-y-2">
            {customerRequests
              .filter((r) => r.status === "pending")
              .map((r) => (
                <div key={r.id} className="rounded-lg border border-status-warn bg-status-warn-bg/40 p-3 text-sm">
                  <div className="font-semibold text-neutral-800">{r.customer.name}</div>
                  <div className="mt-1 text-xs text-neutral-600">
                    مقدّم الطلب: {r.requestedByName} · جوال: {r.customer.phone}
                    {r.customer.crNumber ? ` · سجل تجاري: ${r.customer.crNumber}` : ""}
                    {r.customer.taxNumber ? ` · رقم ضريبي: ${r.customer.taxNumber}` : ""}
                  </div>
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => {
                        decideCustomerRequest(r.id, "approved", currentEmployee!.fullName);
                        showToast("تمت إضافة العميل بعد الاعتماد");
                      }}
                      className="rounded-lg bg-brand-600 px-3 py-1 text-xs font-semibold text-white hover:bg-brand-700"
                    >
                      اعتماد وإضافة
                    </button>
                    <button
                      onClick={() => {
                        decideCustomerRequest(r.id, "rejected", currentEmployee!.fullName);
                        showToast("تم رفض الطلب");
                      }}
                      className="rounded-lg border border-neutral-200 px-3 py-1 text-xs font-semibold text-neutral-600 hover:bg-neutral-50"
                    >
                      رفض
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </HubSection>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Link to="/audit" className="rounded-xl border border-brand-100 bg-white p-5 transition hover:border-brand-600">
          <div className="text-sm font-bold text-neutral-700">التدقيق والامتثال</div>
          <div className="mt-1 text-xs text-neutral-400">سجل كل عملية حساسة بالشركة — من قام بها ومتى</div>
        </Link>
        <Link to="/budget" className="rounded-xl border border-brand-100 bg-white p-5 transition hover:border-brand-600">
          <div className="text-sm font-bold text-neutral-700">ميزانية الشركة</div>
          <div className="mt-1 text-xs text-neutral-400">مقصورة عليك وحدك — لا يراها المدير العام ولا أي موظف</div>
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
