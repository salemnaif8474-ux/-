import { NavLink, Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Logo } from "./Logo";
import { COMPANY_NAME } from "../data/mockData";
import { ROLE_LABELS, type Role } from "../types";

interface NavItem {
  to: string;
  label: string;
  roles: Role[] | "all";
}

const NAV_ITEMS: NavItem[] = [
  { to: "/", label: "الرئيسية", roles: "all" },
  { to: "/targets", label: "الأهداف الشهرية", roles: "all" },
  { to: "/chats", label: "المحادثات", roles: "all" },
  { to: "/customers", label: "عملائي", roles: ["seller", "owner", "branch_manager"] },
  { to: "/ratings", label: "تقييم الموظفين", roles: ["owner"] },
  { to: "/employees", label: "الموظفون والصلاحيات", roles: ["owner", "it", "hr"] },
];

export function Layout() {
  const { currentEmployee, logout } = useAuth();

  if (!currentEmployee) return <Navigate to="/login" replace />;

  const visibleNav = NAV_ITEMS.filter(
    (item) => item.roles === "all" || item.roles.includes(currentEmployee.role),
  );

  return (
    <div className="flex min-h-screen bg-white text-neutral-900">
      <aside className="flex w-64 shrink-0 flex-col border-l border-brand-100 bg-white">
        <div className="flex items-center gap-3 border-b border-brand-100 px-5 py-5">
          <Logo size={40} />
          <div>
            <div className="text-sm font-bold text-brand-700">{COMPANY_NAME}</div>
            <div className="text-xs text-neutral-400">نظام إدارة داخلي</div>
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {visibleNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `block rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-brand-600 text-white"
                    : "text-neutral-700 hover:bg-brand-50 hover:text-brand-700"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-brand-100 px-3 py-4">
          <button
            onClick={logout}
            className="w-full rounded-lg px-4 py-2.5 text-right text-sm font-medium text-neutral-500 hover:bg-status-bad-bg hover:text-status-bad"
          >
            تسجيل الخروج
          </button>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-brand-100 bg-white px-6 py-4">
          <div>
            <div className="text-sm text-neutral-400">مرحبًا بك</div>
            <div className="font-bold text-neutral-800">{currentEmployee.fullName}</div>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
              {ROLE_LABELS[currentEmployee.role]}
            </span>
            <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-500">
              {currentEmployee.branch}
            </span>
          </div>
        </header>
        <main className="flex-1 bg-neutral-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
