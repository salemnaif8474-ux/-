import { useAuth } from "../context/AuthContext";
import { CHAT_MESSAGES, EMPLOYEES, MONTHLY_TARGET, ROLE_HOME_HINT } from "../data/mockData";
import { Link } from "react-router-dom";
import { RatingBadge } from "../components/RatingBadge";

const ACTION_SOURCES: { key: keyof typeof CHAT_MESSAGES; label: string; to: string }[] = [
  { key: "price_changes", label: "طلبات تعديل أسعار بانتظار الموافقة", to: "/chats" },
  { key: "transfers", label: "حوالات عملاء بانتظار المطابقة", to: "/chats" },
  { key: "shortages", label: "نواقص مفتوحة لم تُحل بعد", to: "/chats" },
];

export function Dashboard() {
  const { currentEmployee } = useAuth();
  if (!currentEmployee) return null;

  const pct = Math.round((MONTHLY_TARGET.achievedSar / MONTHLY_TARGET.targetSar) * 100);

  const actionItems = ACTION_SOURCES.map((src) => ({
    ...src,
    count: CHAT_MESSAGES[src.key].filter((m) => m.status === "pending").length,
  })).filter((a) => a.count > 0);
  const badEmployeesCount = EMPLOYEES.filter((e) => e.rating === "bad").length;
  const isExecutive = ["owner", "manager"].includes(currentEmployee.role);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-800">لوحتك الرئيسية</h1>
        <p className="text-sm text-neutral-500">{ROLE_HOME_HINT[currentEmployee.role]}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-brand-100 bg-white p-5">
          <div className="text-xs text-neutral-400">هدف الشهر (كل الشركة)</div>
          <div className="mt-1 text-2xl font-bold text-brand-700 tabular-nums">{pct}%</div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-neutral-100">
            <div className="h-full rounded-full bg-brand-600" style={{ width: `${Math.min(pct, 100)}%` }} />
          </div>
          <div className="mt-2 text-xs text-neutral-400 tabular-nums">
            {MONTHLY_TARGET.achievedSar.toLocaleString()} / {MONTHLY_TARGET.targetSar.toLocaleString()} ريال
          </div>
        </div>

        <Link to="/chats" className="rounded-xl border border-brand-100 bg-white p-5 transition hover:border-brand-600">
          <div className="text-xs text-neutral-400">المحادثات</div>
          <div className="mt-1 text-2xl font-bold text-brand-700">7</div>
          <div className="mt-2 text-xs text-neutral-400">قنوات متخصصة حسب صلاحياتك</div>
        </Link>

        {currentEmployee.role === "owner" && (
          <Link to="/ratings" className="rounded-xl border border-brand-100 bg-white p-5 transition hover:border-brand-600">
            <div className="text-xs text-neutral-400">موظفون يحتاجون متابعة</div>
            <div className="mt-1 text-2xl font-bold text-status-bad">{badEmployeesCount}</div>
            <div className="mt-2 text-xs text-neutral-400">اضغط لعرض تقييم الموظفين</div>
          </Link>
        )}

        {currentEmployee.role !== "owner" && (
          <div className="rounded-xl border border-brand-100 bg-white p-5">
            <div className="text-xs text-neutral-400">تقييمك الحالي</div>
            <div className="mt-2">
              <RatingBadge rating={currentEmployee.rating} />
            </div>
            <div className="mt-2 text-xs text-neutral-400">{currentEmployee.ratingNote}</div>
          </div>
        )}
      </div>

      {isExecutive && actionItems.length > 0 && (
        <div className="rounded-xl border border-status-warn bg-status-warn-bg/40 p-5">
          <div className="mb-3 text-sm font-bold text-neutral-800">يحتاج قرارك الآن</div>
          <div className="space-y-2">
            {actionItems.map((item) => (
              <Link
                key={item.key}
                to={item.to}
                className="flex items-center justify-between rounded-lg bg-white px-4 py-2.5 text-sm transition hover:border-brand-600"
              >
                <span className="text-neutral-700">{item.label}</span>
                <span className="rounded-full bg-status-warn px-2.5 py-0.5 text-xs font-bold text-white tabular-nums">
                  {item.count}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {isExecutive && (
        <div className="rounded-xl border border-brand-100 bg-white p-5">
          <div className="mb-3 text-sm font-bold text-neutral-700">أداء الفروع مقابل الهدف</div>
          <div className="space-y-3">
            {MONTHLY_TARGET.branchBreakdown.map((b) => {
              const bp = Math.round((b.achieved / b.target) * 100);
              return (
                <div key={b.branch}>
                  <div className="mb-1 flex justify-between text-xs text-neutral-500">
                    <span>{b.branch}</span>
                    <span>{bp}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                    <div className="h-full rounded-full bg-brand-600" style={{ width: `${Math.min(bp, 100)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
