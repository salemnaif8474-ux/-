import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { translations } from "../i18n/translations";
import type { Language, Translation } from "../i18n/translations";

interface LanguageContextValue {
  language: Language;
  toggleLanguage: () => void;
  t: Translation;
  dir: "ltr" | "rtl";
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("ar");
  const dir: "ltr" | "rtl" = language === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
    return () => {
      document.documentElement.lang = "ar";
      document.documentElement.dir = "rtl";
    };
  }, [language, dir]);

  function toggleLanguage() {
    setLanguage((prev) => (prev === "ar" ? "en" : "ar"));
  }

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t: translations[language], dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}
