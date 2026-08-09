import { useAuth } from "../context/AuthContext";
import { CUSTOMERS, EMPLOYEES } from "../data/mockData";

export function CustomerAssignments() {
  const { currentEmployee } = useAuth();
  if (!currentEmployee) return null;

  const isOwner = ["owner", "manager", "branch_manager"].includes(currentEmployee.role);
  const visibleCustomers = isOwner
    ? CUSTOMERS
    : CUSTOMERS.filter((c) => c.ownerSellerId === currentEmployee.id || c.ownerSellerId === null);

  function sellerName(id: string | null) {
    if (!id) return "زبون عابر — يخدمه أي بائع";
    return EMPLOYEES.find((e) => e.id === id)?.fullName ?? "-";
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-neutral-800">{isOwner ? "عملاء الشركة" : "عملائي"}</h1>
        <p className="text-sm text-neutral-500">
          كل عميل ثابت له بائع مسؤول عنه، والعملاء العابرون يقدر يخدمهم أي بائع
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-brand-100 bg-white">
        <table className="w-full text-right text-sm">
          <thead className="bg-brand-50 text-xs text-brand-700">
            <tr>
              <th className="px-4 py-3 font-semibold">اسم العميل</th>
              <th className="px-4 py-3 font-semibold">الجوال</th>
              <th className="px-4 py-3 font-semibold">البائع المسؤول</th>
            </tr>
          </thead>
          <tbody>
            {visibleCustomers.map((c) => (
              <tr key={c.id} className="border-t border-neutral-100">
                <td className="px-4 py-3 font-medium text-neutral-800">{c.name}</td>
                <td className="px-4 py-3 text-neutral-500">{c.phone}</td>
                <td className="px-4 py-3 text-neutral-500">{sellerName(c.ownerSellerId)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
