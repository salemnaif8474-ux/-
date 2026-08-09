import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { EMPLOYEES } from "../data/mockData";
import type { Employee } from "../types";

interface AuthContextValue {
  currentEmployee: Employee | null;
  loginAs: (employeeId: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [employeeId, setEmployeeId] = useState<string | null>(() => localStorage.getItem("currentEmployeeId"));

  const currentEmployee = useMemo(
    () => EMPLOYEES.find((e) => e.id === employeeId) ?? null,
    [employeeId],
  );

  function loginAs(id: string) {
    localStorage.setItem("currentEmployeeId", id);
    setEmployeeId(id);
  }

  function logout() {
    localStorage.removeItem("currentEmployeeId");
    setEmployeeId(null);
  }

  return (
    <AuthContext.Provider value={{ currentEmployee, loginAs, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
