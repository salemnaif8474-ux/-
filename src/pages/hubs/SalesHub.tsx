import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { CUSTOMERS, PARTS, RETURN_REQUESTS, SALES_DOCS } from "../../data/mockData";
import { HubSection } from "../../components/HubSection";
import { Pill } from "../../components/Pill";

const DOC_STATUS_TONE = {
  draft: "neutral",
  sent: "warn",
  approved: "good",
  converted: "good",
  processing: "warn",
  completed: "good",
} as const;

const DOC_STATUS_LABEL: Record<string, string> = {
  draft: "مسودة",
  sent: "أُرسلت للعميل",
  approved: "معتمدة",
  converted: "تحوّلت لطلب",
  processing: "قيد التجهيز",
  completed: "مكتملة",
};

export function SalesHub() {
  const { currentEmployee } = useAuth();
  const [query, setQuery] = useState("");

  const filteredParts = useMemo(() => {
    const q = query.trim();
    if (!q) return PARTS;
    return PARTS.filter((p) => p.partNumber.includes(q) || p.name.includes(q) || p.vehicleCompat.includes(q));
  }, [query]);

  const myDocs = currentEmployee
    ? SALES_DOCS.filter((d) => d.sellerId === currentEmployee.id || currentEmployee.role !== "seller")
    : [];

  function customerName(id: string) {
    return CUSTOMERS.find((c) => c.id === id)?.name ?? "-";
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-800">مركز المبيعات</h1>
        <p className="text-sm text-neutral-500">
          البحث عن القطع، عروض الأسعار وطلبات البيع، توفر المخزون، والمرتجعات — بالإضافة إلى{" "}
          <Link to="/customers" className="text-brand-700 underline">عملائي</Link> و
          <Link to="/targets" className="text-brand-700 underline"> أداء المبيعات</Link>.
        </p>
      </div>

      <HubSection title="البحث عن القطع والكتالوج" description="بحث برقم القطعة، الاسم، أو نوع المركبة">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث برقم القطعة أو الاسم أو نوع السيارة..."
          className="mb-3 w-full max-w-md rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-brand-600 focus:outline-none"
        />
        <div className="table-scroll overflow-x-auto">
          <table className="w-full min-w-[640px] text-right text-sm">
            <thead className="bg-brand-50 text-xs text-brand-700">
              <tr>
                <th className="px-3 py-2 font-semibold">رقم القطعة</th>
                <th className="px-3 py-2 font-semibold">الاسم</th>
                <th className="px-3 py-2 font-semibold">التوافق</th>
                <th className="px-3 py-2 font-semibold">النوع</th>
                <th className="px-3 py-2 font-semibold">السعر</th>
                <th className="px-3 py-2 font-semibold">الفروع المتوفرة</th>
              </tr>
            </thead>
            <tbody>
              {filteredParts.map((p) => (
                <tr key={p.id} className="border-t border-neutral-100">
                  <td className="px-3 py-2 font-mono text-xs text-neutral-600">{p.partNumber}</td>
                  <td className="px-3 py-2 font-medium text-neutral-800">{p.name}</td>
                  <td className="px-3 py-2 text-neutral-500">{p.vehicleCompat}</td>
                  <td className="px-3 py-2">
                    <Pill tone={p.isOriginal ? "brand" : "neutral"}>{p.isOriginal ? "أصلي" : "بديل"}</Pill>
                  </td>
                  <td className="px-3 py-2 tabular-nums text-neutral-700">{p.price.toLocaleString()} ﷼</td>
                  <td className="px-3 py-2 text-xs text-neutral-500">
                    {p.stockByBranch.filter((b) => b.available > 0).length} من {p.stockByBranch.length} فروع
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </HubSection>

      <HubSection title="عروض الأسعار وطلبات البيع" description="إنشاء عرض سعر، تحويله لطلب، ومتابعة الحالة">
        <div className="table-scroll overflow-x-auto">
          <table className="w-full min-w-[560px] text-right text-sm">
            <thead className="bg-brand-50 text-xs text-brand-700">
              <tr>
                <th className="px-3 py-2 font-semibold">الرقم</th>
                <th className="px-3 py-2 font-semibold">النوع</th>
                <th className="px-3 py-2 font-semibold">العميل</th>
                <th className="px-3 py-2 font-semibold">القيمة</th>
                <th className="px-3 py-2 font-semibold">الخصم</th>
                <th className="px-3 py-2 font-semibold">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {myDocs.map((d) => {
                const total = d.items.reduce((s, i) => s + i.qty * i.unitPrice, 0) * (1 - d.discountPct / 100);
                return (
                  <tr key={d.id} className="border-t border-neutral-100">
                    <td className="px-3 py-2 font-mono text-xs text-neutral-600">{d.number}</td>
                    <td className="px-3 py-2 text-neutral-500">{d.type === "quotation" ? "عرض سعر" : "طلب بيع"}</td>
                    <td className="px-3 py-2 font-medium text-neutral-800">{customerName(d.customerId)}</td>
                    <td className="px-3 py-2 tabular-nums text-neutral-700">{total.toLocaleString()} ﷼</td>
                    <td className="px-3 py-2 tabular-nums text-neutral-500">{d.discountPct}%</td>
                    <td className="px-3 py-2">
                      <Pill tone={DOC_STATUS_TONE[d.status]}>{DOC_STATUS_LABEL[d.status]}</Pill>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </HubSection>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <HubSection title="توفر المخزون" description="الكمية المتاحة، المحجوزة، والواردة لكل فرع">
          <div className="space-y-3">
            {PARTS.slice(0, 3).map((p) => (
              <div key={p.id} className="rounded-lg border border-neutral-100 p-3 text-sm">
                <div className="mb-1 font-medium text-neutral-800">{p.name}</div>
                <div className="flex flex-wrap gap-3 text-xs text-neutral-500">
                  {p.stockByBranch.map((b) => (
                    <span key={b.branch}>
                      {b.branch}: <span className="tabular-nums font-semibold text-neutral-700">{b.available}</span>
                      {b.incoming > 0 && <span className="text-status-warn"> (+{b.incoming} واردة)</span>}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </HubSection>

        <HubSection
          title="النواقص وطلبات التعويض"
          description="القطع الناقصة وتاريخ الوصول المتوقع"
          action={
            <Link to="/chats" className="text-xs font-semibold text-brand-700 hover:underline">
              فتح شات النواقص ←
            </Link>
          }
        >
          <p className="text-sm text-neutral-600">
            القطع التي وصلت للحد الأدنى تظهر تلقائيًا في{" "}
            <Link to="/hub" className="text-brand-700 underline">مركز النواقص</Link> ويمكن للبائع طلب أولوية تجهيز
            من هناك أو عبر شات النواقص مباشرة.
          </p>
        </HubSection>
      </div>

      <HubSection title="المرتجعات والضمان">
        <div className="space-y-2">
          {RETURN_REQUESTS.map((r) => (
            <div key={r.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-neutral-100 px-4 py-2.5 text-sm">
              <div>
                <span className="font-medium text-neutral-800">{customerName(r.customerId)}</span>
                <span className="text-neutral-400"> · {r.partNumber} · {r.type === "warranty" ? "ضمان" : "إرجاع"}</span>
                <div className="text-xs text-neutral-500">{r.reason}</div>
              </div>
              <Pill tone={r.status === "approved" ? "good" : r.status === "rejected" ? "bad" : "warn"}>
                {r.status === "approved" ? "معتمد" : r.status === "rejected" ? "مرفوض" : "بانتظار المراجعة"}
              </Pill>
            </div>
          ))}
        </div>
      </HubSection>
    </div>
  );
}
