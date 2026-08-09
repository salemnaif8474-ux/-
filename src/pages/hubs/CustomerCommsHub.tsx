import { Link } from "react-router-dom";
import { useData } from "../../context/DataContext";
import { SALES_DOCS } from "../../data/mockData";
import { HubSection } from "../../components/HubSection";
import { Pill } from "../../components/Pill";

const COMPLAINTS = [
  { id: "cp1", customer: "تركي المالكي", subject: "تأخر تسليم الطلب SO-3390", status: "open" as const, responseTime: "أقل من ساعتين" },
  { id: "cp2", customer: "ورشة النخبة للسيارات", subject: "استفسار عن ضمان طقم المساعدين", status: "resolved" as const, responseTime: "40 دقيقة" },
];

export function CustomerCommsHub() {
  const { customers } = useData();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-800">تواصل العملاء</h1>
        <p className="text-sm text-neutral-500">
          طلبات العملاء، متابعة الطلبات، الشكاوى، وسجل التواصل — إلى جانب{" "}
          <Link to="/customers" className="text-brand-700 underline">ملفات العملاء</Link>
        </p>
      </div>

      <HubSection title="تحديثات الطلبات" description="آخر حالة لكل طلب بيع نشط">
        <div className="space-y-2">
          {SALES_DOCS.filter((d) => d.type === "order").map((d) => {
            const customer = customers.find((c) => c.id === d.customerId);
            return (
              <div key={d.id} className="flex items-center justify-between rounded-lg border border-neutral-100 px-4 py-2.5 text-sm">
                <span className="text-neutral-700">{d.number} — {customer?.name}</span>
                <Pill tone={d.status === "completed" ? "good" : "warn"}>
                  {d.status === "completed" ? "تم التسليم" : "قيد التجهيز"}
                </Pill>
              </div>
            );
          })}
        </div>
      </HubSection>

      <HubSection title="الشكاوى والدعم" description="زمن الاستجابة لكل شكوى">
        <div className="space-y-2">
          {COMPLAINTS.map((c) => (
            <div key={c.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-neutral-100 px-4 py-2.5 text-sm">
              <div>
                <div className="font-medium text-neutral-800">{c.subject}</div>
                <div className="text-xs text-neutral-400">{c.customer} · زمن الاستجابة: {c.responseTime}</div>
              </div>
              <Pill tone={c.status === "resolved" ? "good" : "warn"}>{c.status === "resolved" ? "تم الحل" : "مفتوحة"}</Pill>
            </div>
          ))}
        </div>
      </HubSection>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <HubSection title="عروض الأسعار المرسلة للعملاء">
          <div className="space-y-1.5 text-sm">
            {SALES_DOCS.filter((d) => d.type === "quotation").map((d) => (
              <div key={d.id} className="flex justify-between border-b border-neutral-50 py-1">
                <span className="text-neutral-600">{d.number}</span>
                <span className="text-neutral-400">{customers.find((c) => c.id === d.customerId)?.name}</span>
              </div>
            ))}
          </div>
        </HubSection>

        <HubSection title="تذكيرات المتابعة">
          <ul className="space-y-1.5 text-sm text-neutral-600">
            <li>متابعة عرض السعر QT-1042 خلال يومين</li>
            <li>الاتصال بعميل ورشة النخبة لتأكيد رضاه عن الضمان</li>
          </ul>
        </HubSection>
      </div>
    </div>
  );
}
