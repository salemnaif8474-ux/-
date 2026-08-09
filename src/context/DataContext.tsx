import { createContext, useContext, useState, type ReactNode } from "react";
import { APPROVAL_REQUESTS, AUDIT_LOG, CUSTOMERS, MONTHLY_TARGET } from "../data/mockData";
import type { ApprovalRequest, AuditLogEntry, Customer, MonthlyTargetState } from "../types";

interface DataContextValue {
  approvals: ApprovalRequest[];
  auditLog: AuditLogEntry[];
  decideApproval: (id: string, status: "approved" | "rejected", actor: string) => void;
  addAuditEntry: (entry: Omit<AuditLogEntry, "id">) => void;

  monthlyTarget: MonthlyTargetState;
  updateCompanyTarget: (newTargetSar: number, actor: string) => void;
  updateBranchTarget: (branch: string, newTargetSar: number, actor: string) => void;

  customers: Customer[];
  updateCustomer: (id: string, patch: Partial<Customer>, actor: string) => void;
  addCustomer: (customer: Customer, actor: string) => void;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

const KIND_CATEGORY: Record<ApprovalRequest["kind"], string> = {
  purchase: "تدقيق المشتريات",
  discount: "تدقيق المبيعات",
  return: "تدقيق حسابات العملاء",
  stock_adjustment: "تدقيق المخزون",
  transfer: "تدقيق الفروع",
  write_off: "تدقيق المخزون",
};

export function DataProvider({ children }: { children: ReactNode }) {
  const [approvals, setApprovals] = useState(APPROVAL_REQUESTS);
  const [auditLog, setAuditLog] = useState(AUDIT_LOG);
  const [monthlyTarget, setMonthlyTarget] = useState(MONTHLY_TARGET);
  const [customers, setCustomers] = useState(CUSTOMERS);

  function addAuditEntry(entry: Omit<AuditLogEntry, "id">) {
    setAuditLog((prev) => [{ ...entry, id: `al-${Date.now()}` }, ...prev]);
  }

  function decideApproval(id: string, status: "approved" | "rejected", actor: string) {
    const request = approvals.find((r) => r.id === id);
    setApprovals((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    if (request) {
      addAuditEntry({
        category: KIND_CATEGORY[request.kind],
        who: request.requestedBy,
        action: request.summary,
        when: new Date().toLocaleString("ar-SA", { dateStyle: "short", timeStyle: "short" }),
        before: "بانتظار الاعتماد",
        after: status === "approved" ? "معتمد" : "مرفوض",
        approvedBy: actor,
        result: status === "approved" ? "cleared" : "flagged",
      });
    }
  }

  function updateCompanyTarget(newTargetSar: number, actor: string) {
    setMonthlyTarget((prev) => {
      addAuditEntry({
        category: "تدقيق المبيعات",
        who: actor,
        action: "تعديل هدف الشهر لكل الشركة",
        when: new Date().toLocaleString("ar-SA", { dateStyle: "short", timeStyle: "short" }),
        before: `${prev.targetSar.toLocaleString()} ﷼`,
        after: `${newTargetSar.toLocaleString()} ﷼`,
        approvedBy: actor,
        result: "cleared",
      });
      return { ...prev, targetSar: newTargetSar };
    });
  }

  function updateBranchTarget(branch: string, newTargetSar: number, actor: string) {
    setMonthlyTarget((prev) => {
      const old = prev.branchBreakdown.find((b) => b.branch === branch);
      addAuditEntry({
        category: "تدقيق الفروع",
        who: actor,
        action: `تعديل هدف الشهر لفرع ${branch}`,
        when: new Date().toLocaleString("ar-SA", { dateStyle: "short", timeStyle: "short" }),
        before: `${(old?.target ?? 0).toLocaleString()} ﷼`,
        after: `${newTargetSar.toLocaleString()} ﷼`,
        approvedBy: actor,
        result: "cleared",
      });
      return {
        ...prev,
        branchBreakdown: prev.branchBreakdown.map((b) => (b.branch === branch ? { ...b, target: newTargetSar } : b)),
      };
    });
  }

  function updateCustomer(id: string, patch: Partial<Customer>, actor: string) {
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
    const customer = customers.find((c) => c.id === id);
    addAuditEntry({
      category: "تدقيق حسابات العملاء",
      who: actor,
      action: `تعديل بيانات العميل ${customer?.name ?? id}`,
      when: new Date().toLocaleString("ar-SA", { dateStyle: "short", timeStyle: "short" }),
      before: "بيانات سابقة",
      after: "بيانات محدّثة",
      approvedBy: actor,
      result: "cleared",
    });
  }

  function addCustomer(customer: Customer, actor: string) {
    setCustomers((prev) => [...prev, customer]);
    addAuditEntry({
      category: "تدقيق حسابات العملاء",
      who: actor,
      action: `إضافة عميل جديد: ${customer.name}`,
      when: new Date().toLocaleString("ar-SA", { dateStyle: "short", timeStyle: "short" }),
      before: "-",
      after: customer.name,
      approvedBy: actor,
      result: "cleared",
    });
  }

  return (
    <DataContext.Provider
      value={{
        approvals,
        auditLog,
        decideApproval,
        addAuditEntry,
        monthlyTarget,
        updateCompanyTarget,
        updateBranchTarget,
        customers,
        updateCustomer,
        addCustomer,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
