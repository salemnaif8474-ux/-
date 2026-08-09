import { useState } from "react";
import { NavLink, Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Logo } from "./Logo";
import { COMPANY_NAME, ROLE_HUB_LABEL } from "../data/mockData";
import { NAV_ITEMS } from "../data/navConfig";
import { ROLE_LABELS } from "../types";
import { NotificationBell } from "./NotificationBell";
import { GlobalSearch } from "./GlobalSearch";

export function Layout() {
  const { currentEmployee, logout } = useAuth();
  const location = useLocation();
  const [navOpen, setNavOpen] = useState(false);

  if (!currentEmployee) return <Navigate to="/login" replace />;

  const hubLabel = ROLE_HUB_LABEL[currentEmployee.role];
  const visibleNav = NAV_ITEMS.filter(
    (item) => item.roles === "all" || item.roles.includes(currentEmployee.role),
  );
  if (hubLabel) {
    visibleNav.splice(1, 0, { to: "/hub", label: hubLabel, roles: "all" });
  }

  const sidebar = (
    <>
      <div className="flex items-center gap-3 border-b border-brand-100 px-5 py-5">
        <Logo size={40} />
        <div>
          <div className="text-sm font-bold text-brand-700">{COMPANY_NAME}</div>
          <div className="text-xs text-neutral-500">نظام إدارة داخلي</div>
        </div>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {visibleNav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            onClick={() => setNavOpen(false)}
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
    </>
  );

  const currentLabel = visibleNav.find((n) => (n.to === "/" ? location.pathname === "/" : location.pathname.startsWith(n.to)))?.label;

  return (
    <div className="flex min-h-screen bg-neutral-50 text-neutral-900">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-l border-brand-100 bg-white lg:flex">{sidebar}</aside>

      {/* Mobile sidebar overlay */}
      {navOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            aria-label="إغلاق القائمة"
            className="absolute inset-0 bg-neutral-900/40"
            onClick={() => setNavOpen(false)}
          />
          <aside className="absolute inset-y-0 right-0 flex w-72 flex-col bg-white shadow-xl">{sidebar}</aside>
        </div>
      )}

      <div className="flex min-h-screen flex-1 flex-col overflow-x-hidden">
        <header className="flex items-center justify-between gap-3 border-b border-brand-100 bg-white px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              aria-label="فتح القائمة"
              onClick={() => setNavOpen(true)}
              className="rounded-lg border border-neutral-200 p-2 text-neutral-600 lg:hidden"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
              </svg>
            </button>
            <div>
              <div className="text-xs text-neutral-500">{currentLabel ?? ""}</div>
              <div className="text-sm font-bold text-neutral-800 sm:hidden">{currentEmployee.fullName}</div>
              <div className="hidden text-sm text-neutral-500 sm:block">مرحبًا بك</div>
              <div className="hidden font-bold text-neutral-800 sm:block">{currentEmployee.fullName}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <GlobalSearch />
            <NotificationBell />
            <span className="hidden rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 sm:inline">
              {ROLE_LABELS[currentEmployee.role]}
            </span>
            <span className="hidden rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-600 lg:inline">
              {currentEmployee.branch}
            </span>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
