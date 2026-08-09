import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { CHAT_MESSAGES, EMPLOYEES, IT_TICKETS, LEAVE_REQUESTS } from "../data/mockData";

interface NotificationItem {
  label: string;
  count: number;
  to: string;
  roles: string[];
}

export function NotificationBell() {
  const { currentEmployee } = useAuth();
  const { approvals } = useData();
  const [open, setOpen] = useState(false);
  if (!currentEmployee) return null;

  const items: NotificationItem[] = [
    {
      label: "طلبات تعديل أسعار معلّقة",
      count: CHAT_MESSAGES.price_changes.filter((m) => m.status === "pending").length,
      to: "/chats",
      roles: ["owner", "manager", "accountant"],
    },
    {
      label: "حوالات بانتظار المطابقة",
      count: CHAT_MESSAGES.transfers.filter((m) => m.status === "pending").length,
      to: "/chats",
      roles: ["owner", "manager", "accountant"],
    },
    {
      label: "نواقص مفتوحة",
      count: CHAT_MESSAGES.shortages.filter((m) => m.status === "pending").length,
      to: "/chats",
      roles: ["owner", "manager", "preparer", "purchasing", "shortages", "branch_manager", "review"],
    },
    {
      label: "عمليات بانتظار اعتمادك",
      count: approvals.filter((a) => a.status === "pending").length,
      to: "/hub",
      roles: ["manager"],
    },
    {
      label: "طلبات إجازة معلّقة",
      count: LEAVE_REQUESTS.filter((l) => l.status === "pending").length,
      to: "/hub",
      roles: ["hr", "owner", "manager"],
    },
    {
      label: "تذاكر دعم مفتوحة",
      count: IT_TICKETS.filter((t) => t.status !== "resolved").length,
      to: "/hub",
      roles: ["it"],
    },
    {
      label: "موظفون يحتاجون متابعة",
      count: EMPLOYEES.filter((e) => e.rating === "bad").length,
      to: "/ratings",
      roles: ["owner"],
    },
  ];

  const relevant = items.filter((i) => i.roles.includes(currentEmployee.role) && i.count > 0);
  const total = relevant.reduce((s, i) => s + i.count, 0);

  return (
    <div className="relative">
      <button
        aria-label="الإشعارات"
        onClick={() => setOpen((v) => !v)}
        className="relative rounded-lg border border-neutral-200 p-2 text-neutral-600 hover:bg-neutral-50"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {total > 0 && (
          <span className="absolute -left-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-status-bad px-1 text-[10px] font-bold text-white tabular-nums">
            {total}
          </span>
        )}
      </button>

      {open && (
        <>
          <button aria-label="إغلاق" className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 z-50 mt-2 w-72 rounded-xl border border-brand-100 bg-white p-2 shadow-lg">
            {relevant.length === 0 ? (
              <div className="p-3 text-center text-xs text-neutral-400">لا توجد إشعارات جديدة</div>
            ) : (
              relevant.map((i) => (
                <Link
                  key={i.label}
                  to={i.to}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm hover:bg-neutral-50"
                >
                  <span className="text-neutral-700">{i.label}</span>
                  <span className="rounded-full bg-status-warn px-2 py-0.5 text-[11px] font-bold text-white tabular-nums">
                    {i.count}
                  </span>
                </Link>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
