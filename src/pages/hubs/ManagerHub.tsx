import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { HubSection } from "../../components/HubSection";
import { Pill } from "../../components/Pill";
import type { ApprovalRequest } from "../../types";

const KIND_LABEL: Record<ApprovalRequest["kind"], string> = {
  purchase: "أمر شراء",
  discount: "خصم إضافي",
  return: "إرجاع",
  stock_adjustment: "تسوية مخزون",
  transfer: "نقل بين فروع",
  write_off: "شطب / إتلاف",
};

export function ManagerHub() {
  const { currentEmployee } = useAuth();
  const { approvals, decideApproval } = useData();
  const pending = approvals.filter((r) => r.status === "pending");
  const decided = approvals.filter((r) => r.status !== "pending");

  function decide(id: string, status: "approved" | "rejected") {
    decideApproval(id, status, currentEmployee?.fullName ?? "غير معروف");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-800">الموافقات والصلاحيات</h1>
        <p className="text-sm text-neutral-500">
          إدارة شاملة، مع فصل الاعتماد عن التنفيذ في العمليات الحساسة — كل عملية معتمدة تُسجَّل تلقائيًا في سجل التدقيق.
        </p>
      </div>

      <HubSection
        title={`عمليات بانتظار اعتمادك (${pending.length})`}
        description="مشتريات، خصومات، مرتجعات، تسويات مخزون، تحويلات، وعمليات شطب"
      >
        {pending.length === 0 ? (
          <div className="text-sm text-neutral-400">لا يوجد طلبات معلّقة حاليًا</div>
        ) : (
          <div className="space-y-2">
            {pending.map((r) => (
              <div key={r.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-neutral-100 px-4 py-3 text-sm">
                <div>
                  <div className="flex items-center gap-2">
                    <Pill tone="brand">{KIND_LABEL[r.kind]}</Pill>
                    <span className="font-medium text-neutral-800">{r.summary}</span>
                  </div>
                  <div className="mt-1 text-xs text-neutral-400">
                    {r.requestedBy} · {r.branch} · {r.date}
                    {r.amount > 0 && <span className="tabular-nums"> · {r.amount.toLocaleString()} ﷼</span>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => decide(r.id, "approved")}
                    className="rounded bg-status-good-bg px-3 py-1.5 text-xs font-semibold text-status-good hover:opacity-80"
                  >
                    اعتماد
                  </button>
                  <button
                    onClick={() => decide(r.id, "rejected")}
                    className="rounded bg-status-bad-bg px-3 py-1.5 text-xs font-semibold text-status-bad hover:opacity-80"
                  >
                    رفض
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </HubSection>

      {decided.length > 0 && (
        <HubSection title="سجل القرارات الأخيرة">
          <div className="space-y-2">
            {decided.map((r) => (
              <div key={r.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-neutral-100 px-4 py-2.5 text-sm">
                <span className="text-neutral-700">{r.summary}</span>
                <Pill tone={r.status === "approved" ? "good" : "bad"}>{r.status === "approved" ? "معتمد" : "مرفوض"}</Pill>
              </div>
            ))}
          </div>
        </HubSection>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Link to="/employees" className="rounded-xl border border-brand-100 bg-white p-5 transition hover:border-brand-600">
          <div className="text-sm font-bold text-neutral-700">الموظفون والصلاحيات</div>
          <div className="mt-1 text-xs text-neutral-400">تعيين الأدوار وتحديد صلاحيات كل موظف</div>
        </Link>
        <Link to="/targets" className="rounded-xl border border-brand-100 bg-white p-5 transition hover:border-brand-600">
          <div className="text-sm font-bold text-neutral-700">أهداف المبيعات والفروع</div>
          <div className="mt-1 text-xs text-neutral-400">تحديد ومتابعة أهداف كل فرع وبائع</div>
        </Link>
        <Link to="/audit" className="rounded-xl border border-status-warn bg-status-warn-bg/40 p-5 transition hover:border-status-warn">
          <div className="text-sm font-bold text-neutral-800">سجل التدقيق</div>
          <div className="mt-1 text-xs text-neutral-600">
            للاطلاع فقط — لا يملك أي مستخدم، بما فيهم المدير، صلاحية تعديل سجل التدقيق نفسه
          </div>
        </Link>
      </div>
    </div>
  );
}
