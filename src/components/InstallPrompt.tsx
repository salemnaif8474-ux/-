import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISSED_KEY = "installPromptDismissed";

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(DISMISSED_KEY) === "1");

  useEffect(() => {
    function handler(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    }
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const isStandalone =
    typeof window !== "undefined" && window.matchMedia?.("(display-mode: standalone)").matches;

  if (!deferredPrompt || dismissed || isStandalone) return null;

  function dismiss() {
    localStorage.setItem(DISMISSED_KEY, "1");
    setDismissed(true);
  }

  async function install() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  }

  return (
    <div className="animate-fade-slide-up mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-brand-100 bg-brand-50 px-4 py-3">
      <div className="text-sm text-brand-700">
        <span className="font-bold">ثبّت التطبيق</span> على جوالك عشان يفتح مثل تطبيق حقيقي بدون شريط المتصفح
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button
          onClick={install}
          className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-700"
        >
          تثبيت الآن
        </button>
        <button onClick={dismiss} className="text-xs text-neutral-500 hover:text-neutral-700">
          لاحقًا
        </button>
      </div>
    </div>
  );
}
