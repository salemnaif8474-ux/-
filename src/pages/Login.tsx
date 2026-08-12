import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Logo } from "../components/Logo";
import { BrandPattern } from "../components/BrandPattern";
import { COMPANY_NAME, COMPANY_NAME_EN, EMPLOYEES } from "../data/mockData";
import { ROLE_LABELS } from "../types";

export function Login() {
  const { currentEmployee, loginAs } = useAuth();
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(true);
  const [splashLeaving, setSplashLeaving] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const branchCount = useMemo(() => new Set(EMPLOYEES.map((e) => e.branch)).size, []);

  useEffect(() => {
    const leaveTimer = setTimeout(() => setSplashLeaving(true), 1200);
    const hideTimer = setTimeout(() => setShowSplash(false), 1500);
    return () => {
      clearTimeout(leaveTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (currentEmployee) return <Navigate to="/" replace />;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const emp = EMPLOYEES.find((x) => x.username === username.trim());
    if (!emp) {
      setError("اسم المستخدم غير صحيح");
      return;
    }
    if (!password) {
      setError("الرجاء إدخال كلمة المرور");
      return;
    }
    setError("");
    loginAs(emp.id);
    navigate("/");
  }

  if (showSplash) {
    return (
      <div
        className={`relative flex h-screen flex-col items-center justify-center gap-4 overflow-hidden bg-brand-700 transition-opacity duration-300 ${
          splashLeaving ? "opacity-0" : "opacity-100"
        }`}
      >
        <BrandPattern opacity={0.1} />
        <div className="relative animate-splash-logo">
          <Logo size={96} />
        </div>
        <div className="relative animate-splash-text text-3xl font-bold text-white">{COMPANY_NAME}</div>
        <div className="relative animate-splash-text text-sm font-semibold text-white/80" dir="ltr">
          {COMPANY_NAME_EN}
        </div>
        <div className="relative animate-splash-text text-xs text-white/60">نظام إدارة داخلي شامل</div>
        <div className="relative mt-2 h-1 w-40 overflow-hidden rounded-full bg-white/20">
          <div className="animate-splash-bar h-full rounded-full bg-white" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Brand hero panel — desktop only */}
      <div className="relative hidden w-[42%] shrink-0 flex-col justify-between overflow-hidden bg-brand-700 p-10 text-white lg:flex">
        <BrandPattern opacity={0.08} />
        <div className="relative flex items-center gap-3">
          <Logo size={44} />
          <div>
            <div className="text-lg font-bold">{COMPANY_NAME}</div>
            <div className="text-[11px] text-white/70" dir="ltr">{COMPANY_NAME_EN}</div>
          </div>
        </div>
        <div className="relative">
          <h1 className="text-3xl font-bold leading-tight text-wrap-balance">
            كل قسم بشركتك،
            <br />
            بمكان واحد.
          </h1>
          <p className="mt-3 max-w-sm text-sm text-white/70">
            مبيعات، مخزون، مشتريات، محاسبة، وتدقيق — منظومة واحدة مترابطة لكل موظف حسب دوره.
          </p>
          <div className="mt-6 flex gap-3">
            <div className="rounded-lg bg-white/10 px-4 py-2.5">
              <div className="text-xl font-bold tabular-nums">{branchCount}</div>
              <div className="text-[11px] text-white/60">فروع</div>
            </div>
            <div className="rounded-lg bg-white/10 px-4 py-2.5">
              <div className="text-xl font-bold tabular-nums">11</div>
              <div className="text-[11px] text-white/60">قسمًا متخصصًا</div>
            </div>
            <div className="rounded-lg bg-white/10 px-4 py-2.5">
              <div className="text-xl font-bold tabular-nums">{EMPLOYEES.length}</div>
              <div className="text-[11px] text-white/60">موظف</div>
            </div>
          </div>
        </div>
        <div className="relative text-xs text-white/50">نظام إدارة داخلي — للاستخدام الرسمي فقط</div>
      </div>

      {/* Login form */}
      <div className="flex flex-1 items-center justify-center bg-neutral-50 px-4 py-10">
        <div className="animate-fade-slide-up w-full max-w-sm overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-xl">
          <div className="h-1.5 bg-brand-600" />
          <div className="p-8">
            <div className="mb-6 flex flex-col items-center gap-3 lg:hidden">
              <Logo size={64} />
              <div className="text-center">
                <div className="text-lg font-bold text-brand-700">{COMPANY_NAME}</div>
                <div className="text-xs text-neutral-400" dir="ltr">{COMPANY_NAME_EN}</div>
              </div>
            </div>
            <div className="mb-6 hidden items-center justify-center lg:flex">
              <span className="rounded-full bg-brand-50 px-3 py-1 text-[11px] font-semibold text-brand-700">
                دخول آمن ومربوط بجهاز العمل
              </span>
            </div>
            <div className="mb-6 text-center">
              <div className="text-lg font-bold text-neutral-800">تسجيل دخول الموظفين</div>
              <div className="text-xs text-neutral-400">أدخل بياناتك للمتابعة إلى لوحتك</div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-600">اسم المستخدم</label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-neutral-400">
                    <UserIcon />
                  </span>
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 py-2 pe-9 ps-3 text-sm focus:border-brand-600 focus:outline-none"
                    placeholder="مثال: ahmed.q"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-600">كلمة المرور</label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-neutral-400">
                    <LockIcon />
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 py-2 pe-9 ps-3 text-sm focus:border-brand-600 focus:outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              {error && <div className="text-xs font-medium text-status-bad">{error}</div>}
              <p className="text-[11px] leading-relaxed text-neutral-400">
                حسابك مربوط بجهاز جوال العمل المسجّل فقط — الدخول من جهاز آخر يحتاج موافقة IT
              </p>
              <button
                type="submit"
                className="w-full rounded-lg bg-brand-600 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700"
              >
                تسجيل الدخول
              </button>
            </form>

            <div className="mt-6 border-t border-neutral-100 pt-4">
              <div className="mb-2 text-xs text-neutral-400">دخول تجريبي سريع (للمعاينة فقط):</div>
              <div className="flex flex-wrap gap-2">
                {EMPLOYEES.map((emp) => (
                  <button
                    key={emp.id}
                    onClick={() => {
                      loginAs(emp.id);
                      navigate("/");
                    }}
                    className="rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-xs text-brand-700 hover:bg-brand-100"
                  >
                    {ROLE_LABELS[emp.role]} · {emp.fullName.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function UserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" strokeLinecap="round" />
    </svg>
  );
}
