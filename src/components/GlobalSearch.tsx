import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { EMPLOYEES, PARTS } from "../data/mockData";
import { can } from "../lib/permissions";
import { ROLE_LABELS } from "../types";

interface Result {
  key: string;
  label: string;
  sublabel: string;
  to: string;
}

export function GlobalSearch() {
  const { customers, budget } = useData();
  const { currentEmployee } = useAuth();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Search must never surface records the signed-in role cannot open — budget
  // lines are owner-only, staff records need users.manage, and a seller only
  // ever matches their own customers.
  const results = useMemo<Result[]>(() => {
    const q = query.trim();
    if (q.length < 2 || !currentEmployee) return [];
    const role = currentEmployee.role;

    const employeeResults: Result[] = can(role, "users.manage")
      ? EMPLOYEES.filter(
          (e) => e.fullName.includes(q) || e.username.includes(q) || e.employeeNumber.includes(q),
        ).map((e) => ({
          key: `emp-${e.id}`,
          label: e.fullName,
          sublabel: `موظف · ${ROLE_LABELS[e.role]}`,
          to: "/employees",
        }))
      : [];

    const visibleCustomers = can(role, "customers.viewAll")
      ? customers
      : customers.filter((c) => c.ownerSellerId === currentEmployee.id);

    const customerResults: Result[] = visibleCustomers
      .filter(
        (c) =>
          c.name.includes(q) ||
          c.phone.includes(q) ||
          c.taxNumber?.includes(q) ||
          c.crNumber?.includes(q),
      )
      .map((c) => ({
        key: `cust-${c.id}`,
        label: c.name,
        sublabel: "عميل",
        to: "/customers",
      }));

    const budgetResults: Result[] = can(role, "budget.view")
      ? budget.lines
          .filter((l) => l.label.includes(q))
          .map((l) => ({
            key: `budget-${l.id}`,
            label: l.label,
            sublabel: "بند ميزانية",
            to: "/budget",
          }))
      : [];

    const partResults: Result[] = PARTS.filter((p) => p.name.includes(q) || p.partNumber.includes(q)).map((p) => ({
      key: `part-${p.id}`,
      label: p.name,
      sublabel: `قطعة · ${p.partNumber}`,
      to: "/hub",
    }));

    return [...employeeResults, ...customerResults, ...budgetResults, ...partResults].slice(0, 8);
  }, [query, currentEmployee, customers, budget]);

  function openSearch() {
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function closeSearch() {
    setOpen(false);
    setQuery("");
  }

  return (
    <div className="relative">
      <button
        aria-label="بحث"
        onClick={openSearch}
        className="rounded-lg border border-neutral-200 p-2 text-neutral-600 hover:bg-neutral-50"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.35-4.35" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <>
          <button aria-label="إغلاق البحث" className="fixed inset-0 z-40" onClick={closeSearch} />
          <div className="absolute left-0 z-50 mt-2 w-80 rounded-xl border border-brand-100 bg-white p-3 shadow-lg">
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث عن موظف، عميل، أو قطعة..."
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-brand-600 focus:outline-none"
            />
            {query.trim().length >= 2 && (
              <div className="mt-2 max-h-72 overflow-y-auto">
                {results.length === 0 ? (
                  <div className="p-2 text-center text-xs text-neutral-400">ما فيه نتائج مطابقة</div>
                ) : (
                  results.map((r) => (
                    <button
                      key={r.key}
                      onClick={() => {
                        navigate(r.to);
                        closeSearch();
                      }}
                      className="block w-full rounded-lg px-3 py-2 text-right text-sm hover:bg-neutral-50"
                    >
                      <div className="font-medium text-neutral-800">{r.label}</div>
                      <div className="text-xs text-neutral-400">{r.sublabel}</div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
