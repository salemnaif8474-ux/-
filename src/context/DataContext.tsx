import { createContext, useContext, useState, type ReactNode } from "react";
import { APPROVAL_REQUESTS, AUDIT_LOG } from "../data/mockData";
import type { ApprovalRequest, AuditLogEntry } from "../types";

interface DataContextValue {
  approvals: ApprovalRequest[];
  auditLog: AuditLogEntry[];
  decideApproval: (id: string, status: "approved" | "rejected", actor: string) => void;
  addAuditEntry: (entry: Omit<AuditLogEntry, "id">) => void;
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

  return (
    <DataContext.Provider value={{ approvals, auditLog, decideApproval, addAuditEntry }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
