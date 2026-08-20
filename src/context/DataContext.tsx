import { createContext, useContext, useState, type ReactNode } from "react";
import {
  APPROVAL_REQUESTS,
  AUDIT_LOG,
  COMPANY_BUDGET,
  CUSTOMER_REQUESTS,
  CUSTOMERS,
  MONTHLY_TARGET,
  SUPPLIER_VIOLATIONS,
  SUPPLIERS,
} from "../data/mockData";
import type {
  ApprovalRequest,
  AuditLogEntry,
  CompanyBudget,
  Customer,
  CustomerRequest,
  MonthlyTargetState,
  Supplier,
  SupplierViolation,
} from "../types";

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

  customerRequests: CustomerRequest[];
  requestCustomer: (request: Omit<CustomerRequest, "id" | "status" | "date">) => void;
  decideCustomerRequest: (id: string, status: "approved" | "rejected", actor: string) => void;

  budget: CompanyBudget;
  updateBudgetLine: (lineId: string, allocated: number, actor: string) => void;

  suppliers: Supplier[];
  setSupplierApproval: (supplierId: string, approved: boolean, actor: string) => void;

  supplierViolations: SupplierViolation[];
  reportSupplierViolation: (violation: Omit<SupplierViolation, "id" | "status" | "date">) => void;
  decideSupplierViolation: (id: string, status: "approved" | "rejected", actor: string) => void;

  recordSecurityEvent: (entry: Omit<AuditLogEntry, "id" | "when">) => void;
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
  const [customerRequests, setCustomerRequests] = useState(CUSTOMER_REQUESTS);
  const [budget, setBudget] = useState(COMPANY_BUDGET);
  const [suppliers, setSuppliers] = useState(SUPPLIERS);
  const [supplierViolations, setSupplierViolations] = useState(SUPPLIER_VIOLATIONS);

  function now() {
    return new Date().toLocaleString("ar-SA", { dateStyle: "short", timeStyle: "short" });
  }

  function addAuditEntry(entry: Omit<AuditLogEntry, "id">) {
    setAuditLog((prev) => [{ ...entry, id: `al-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` }, ...prev]);
  }

  function recordSecurityEvent(entry: Omit<AuditLogEntry, "id" | "when">) {
    addAuditEntry({ ...entry, when: now() });
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

  function requestCustomer(request: Omit<CustomerRequest, "id" | "status" | "date">) {
    const entry: CustomerRequest = {
      ...request,
      id: `cr-${Date.now()}`,
      status: "pending",
      date: new Date().toISOString().slice(0, 10),
    };
    setCustomerRequests((prev) => [entry, ...prev]);
    addAuditEntry({
      category: "تدقيق حسابات العملاء",
      who: request.requestedByName,
      action: `طلب إضافة عميل جديد: ${request.customer.name}`,
      when: now(),
      before: "-",
      after: "بانتظار اعتماد صاحب الشركة",
      approvedBy: "-",
      result: "pending",
    });
  }

  function decideCustomerRequest(id: string, status: "approved" | "rejected", actor: string) {
    const request = customerRequests.find((r) => r.id === id);
    setCustomerRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    if (!request) return;
    if (status === "approved") {
      setCustomers((prev) => [...prev, { ...request.customer, id: `c-${Date.now()}` }]);
    }
    addAuditEntry({
      category: "تدقيق حسابات العملاء",
      who: request.requestedByName,
      action: `اعتماد طلب إضافة عميل: ${request.customer.name}`,
      when: now(),
      before: "بانتظار الاعتماد",
      after: status === "approved" ? "تمت الإضافة" : "مرفوض",
      approvedBy: actor,
      result: status === "approved" ? "cleared" : "flagged",
    });
  }

  function updateBudgetLine(lineId: string, allocated: number, actor: string) {
    setBudget((prev) => {
      const line = prev.lines.find((l) => l.id === lineId);
      addAuditEntry({
        category: "تدقيق المحاسبة",
        who: actor,
        action: `تعديل ميزانية بند: ${line?.label ?? lineId}`,
        when: now(),
        before: `${(line?.allocated ?? 0).toLocaleString()} ﷼`,
        after: `${allocated.toLocaleString()} ﷼`,
        approvedBy: actor,
        result: "cleared",
      });
      const lines = prev.lines.map((l) => (l.id === lineId ? { ...l, allocated } : l));
      return { ...prev, lines, totalAllocated: lines.reduce((sum, l) => sum + l.allocated, 0) };
    });
  }

  function setSupplierApproval(supplierId: string, approved: boolean, actor: string) {
    setSuppliers((prev) => {
      const supplier = prev.find((s) => s.id === supplierId);
      addAuditEntry({
        category: "تدقيق الموردين",
        who: actor,
        action: `${approved ? "اعتماد" : "إلغاء اعتماد"} المورد: ${supplier?.name ?? supplierId}`,
        when: now(),
        before: supplier?.approved ? "معتمد" : "غير معتمد",
        after: approved ? "معتمد" : "غير معتمد",
        approvedBy: actor,
        result: approved ? "cleared" : "flagged",
      });
      return prev.map((s) => (s.id === supplierId ? { ...s, approved } : s));
    });
  }

  function reportSupplierViolation(violation: Omit<SupplierViolation, "id" | "status" | "date">) {
    setSupplierViolations((prev) => [
      { ...violation, id: `sv-${Date.now()}`, status: "held", date: new Date().toISOString().slice(0, 10) },
      ...prev,
    ]);
    addAuditEntry({
      category: "تدقيق الموردين",
      who: violation.employeeName,
      action: `محاولة شراء من مورد غير معتمد: ${violation.supplierName} — ${violation.parts}`,
      when: now(),
      before: "-",
      after: `العملية موقوفة (${violation.amount.toLocaleString()} ﷼) بانتظار قرار صاحب الشركة`,
      approvedBy: "-",
      result: "flagged",
    });
  }

  function decideSupplierViolation(id: string, status: "approved" | "rejected", actor: string) {
    const violation = supplierViolations.find((v) => v.id === id);
    setSupplierViolations((prev) => prev.map((v) => (v.id === id ? { ...v, status } : v)));
    if (!violation) return;
    addAuditEntry({
      category: "تدقيق الموردين",
      who: violation.employeeName,
      action: `قرار صاحب الشركة بمحاولة الشراء من ${violation.supplierName}`,
      when: now(),
      before: "موقوفة",
      after: status === "approved" ? "معتمدة استثنائيًا" : "مرفوضة",
      approvedBy: actor,
      result: status === "approved" ? "cleared" : "flagged",
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
        customerRequests,
        requestCustomer,
        decideCustomerRequest,
        budget,
        updateBudgetLine,
        suppliers,
        setSupplierApproval,
        supplierViolations,
        reportSupplierViolation,
        decideSupplierViolation,
        recordSecurityEvent,
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
