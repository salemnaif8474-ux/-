import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Logo } from "../components/Logo";
import { COMPANY_NAME, EMPLOYEES } from "../data/mockData";
import { ROLE_LABELS } from "../types";

export function Login() {
  const { currentEmployee, loginAs } = useAuth();
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(true);
  const [splashLeaving, setSplashLeaving] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

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
        className={`flex h-screen flex-col items-center justify-center gap-4 bg-brand-700 transition-opacity duration-300 ${
          splashLeaving ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="animate-splash-logo">
          <Logo size={96} />
        </div>
        <div className="animate-splash-text text-2xl font-bold text-white">{COMPANY_NAME}</div>
        <div className="mt-2 h-1 w-40 overflow-hidden rounded-full bg-white/20">
          <div className="animate-splash-bar h-full rounded-full bg-white" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="animate-fade-slide-up w-full max-w-sm rounded-2xl border border-brand-100 bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-col items-center gap-3">
          <Logo size={64} />
          <div className="text-lg font-bold text-brand-700">{COMPANY_NAME}</div>
          <div className="text-xs text-neutral-400">تسجيل دخول الموظفين</div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-600">اسم المستخدم</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-brand-600 focus:outline-none"
              placeholder="مثال: ahmed.q"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-600">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-brand-600 focus:outline-none"
              placeholder="••••••••"
            />
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
  );
}
