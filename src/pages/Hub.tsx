import { useAuth } from "../context/AuthContext";
import { SalesHub } from "./hubs/SalesHub";
import { ManagerHub } from "./hubs/ManagerHub";
import { AccountantHub } from "./hubs/AccountantHub";
import { ReceivingHub } from "./hubs/ReceivingHub";
import { BranchHub } from "./hubs/BranchHub";
import { ExecutiveHub } from "./hubs/ExecutiveHub";
import { ITHub } from "./hubs/ITHub";
import { ProcurementHub } from "./hubs/ProcurementHub";
import { AuditHub } from "./hubs/AuditHub";
import { CustomerCommsHub } from "./hubs/CustomerCommsHub";
import { ShortagesHub } from "./hubs/ShortagesHub";
import { HRHub } from "./hubs/HRHub";

export function Hub() {
  const { currentEmployee } = useAuth();
  if (!currentEmployee) return null;

  switch (currentEmployee.role) {
    case "owner":
      return <ExecutiveHub />;
    case "manager":
      return <ManagerHub />;
    case "seller":
      return <SalesHub />;
    case "accountant":
      return <AccountantHub />;
    case "preparer":
      return <ReceivingHub />;
    case "branch_manager":
      return <BranchHub />;
    case "it":
      return <ITHub />;
    case "purchasing":
      return <ProcurementHub />;
    case "review":
      return <AuditHub />;
    case "customer_relations":
      return <CustomerCommsHub />;
    case "shortages":
      return <ShortagesHub />;
    case "hr":
      return <HRHub />;
    default:
      return (
        <div className="rounded-xl border border-brand-100 bg-white p-6 text-sm text-neutral-500">
          لا يوجد مركز متخصص لهذا الدور بعد.
        </div>
      );
  }
}
