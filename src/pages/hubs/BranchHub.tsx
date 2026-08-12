import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { EMPLOYEES, PARTS, PURCHASE_ORDERS } from "../../data/mockData";
import { HubSection } from "../../components/HubSection";
import { Pill } from "../../components/Pill";
import { RatingBadge } from "../../components/RatingBadge";
import { ROLE_LABELS } from "../../types";

export function BranchHub() {
  const { currentEmployee } = useAuth();
  if (!currentEmployee) return null;
  const branch = currentEmployee.branch;

  const branchStaff = EMPLOYEES.filter((e) => e.branch === branch);
  const branchPOs = PURCHASE_ORDERS.filter((po) => po.branch === branch);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-800">إدارة الفرع — {branch}</h1>
        <p className="text-sm text-neutral-500">
          صلاحياتك محدودة بفرعك، إلا إذا منحك المدير صلاحية إضافية. راجع أيضًا{" "}
          <Link to="/app" className="text-brand-700 underline">لوحة الفرع الرئيسية</Link> و
          <Link to="/app/targets" className="text-brand-700 underline"> الأهداف</Link>.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <HubSection title="موظفو الفرع" description={`${branchStaff.length} موظف`}>
          <div className="space-y-2">
            {branchStaff.map((e) => (
              <div key={e.id} className="flex items-center justify-between rounded-lg border border-neutral-100 px-3 py-2 text-sm">
                <div>
                  <div className="font-medium text-neutral-800">{e.fullName}</div>
                  <div className="text-xs text-neutral-400">{ROLE_LABELS[e.role]}</div>
                </div>
                <RatingBadge rating={e.rating} />
              </div>
            ))}
          </div>
        </HubSection>

        <HubSection title="مخزون الفرع" description="نظرة سريعة على أهم القطع">
          <div className="space-y-2">
            {PARTS.map((p) => {
              const stock = p.stockByBranch.find((b) => b.branch === branch);
              if (!stock) return null;
              const low = stock.available <= p.reorderPoint;
              return (
                <div key={p.id} className="flex items-center justify-between rounded-lg border border-neutral-100 px-3 py-2 text-sm">
                  <span className="text-neutral-700">{p.name}</span>
                  <Pill tone={low ? "bad" : "good"}>{stock.available} متوفر</Pill>
                </div>
              );
            })}
          </div>
        </HubSection>

        <HubSection title="طلبات الشراء الخاصة بالفرع">
          {branchPOs.length === 0 ? (
            <div className="text-sm text-neutral-400">لا توجد طلبات شراء مسجلة لهذا الفرع حاليًا</div>
          ) : (
            <div className="space-y-2">
              {branchPOs.map((po) => (
                <div key={po.id} className="flex items-center justify-between rounded-lg border border-neutral-100 px-3 py-2 text-sm">
                  <span className="text-neutral-700">{po.number}</span>
                  <Pill tone="warn">{po.status}</Pill>
                </div>
              ))}
            </div>
          )}
        </HubSection>

        <HubSection title="مصاريف الفرع" description="المصاريف التشغيلية المسجلة هذا الشهر">
          <ul className="space-y-1.5 text-sm text-neutral-600">
            <li>إيجار وصيانة: <span className="font-semibold tabular-nums">8,200 ﷼</span></li>
            <li>كهرباء وخدمات: <span className="font-semibold tabular-nums">2,150 ﷼</span></li>
            <li>مصاريف متنوعة: <span className="font-semibold tabular-nums">960 ﷼</span></li>
          </ul>
        </HubSection>
      </div>

      <HubSection title="تحويلات المخزون بين الفروع" description="طلب أو استقبال قطع من فروع أخرى بدل الشراء من جديد">
        <p className="text-sm text-neutral-600">
          تابع طلبات التحويل عبر <Link to="/app/hub" className="text-brand-700 underline">مركز النواقص</Link> أو من
          خلال الموافقات لدى المدير.
        </p>
      </HubSection>
    </div>
  );
}
