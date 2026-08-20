import type { Employee, Role } from "../types";
import { roleSelectionMatches } from "./permissions";

export type LoginFailure =
  | "unknown_user"
  | "empty_password"
  | "wrong_password"
  | "role_mismatch"
  | "inactive_account";

export type LoginResult = { ok: true; employee: Employee } | { ok: false; reason: LoginFailure };

// SHA-256 so a password is never held or compared in plain text. A browser-only
// app cannot keep a secret from its own user, so this mirrors the intended
// server behaviour rather than replacing it — real verification belongs on a
// backend that never ships the hashes to the client.
export async function hashPassword(password: string): Promise<string> {
  const bytes = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function verifyLogin(
  employees: Employee[],
  username: string,
  password: string,
  selectedRole: Role | "",
): Promise<LoginResult> {
  const employee = employees.find((e) => e.username === username.trim());
  if (!employee) return { ok: false, reason: "unknown_user" };
  if (!password) return { ok: false, reason: "empty_password" };
  if (employee.status === "suspended") return { ok: false, reason: "inactive_account" };

  const hash = await hashPassword(password);
  if (employee.passwordHash && employee.passwordHash !== hash) {
    return { ok: false, reason: "wrong_password" };
  }

  if (!selectedRole || !roleSelectionMatches(employee.role, selectedRole)) {
    return { ok: false, reason: "role_mismatch" };
  }

  return { ok: true, employee };
}

export const LOGIN_FAILURE_MESSAGE: Record<LoginFailure, string> = {
  unknown_user: "اسم المستخدم غير صحيح",
  empty_password: "الرجاء إدخال كلمة المرور",
  wrong_password: "كلمة المرور غير صحيحة",
  role_mismatch: "الدور الوظيفي المختار لا يطابق الدور المعتمد لحسابك — تواصل مع صاحب الشركة",
  inactive_account: "هذا الحساب موقوف — تواصل مع صاحب الشركة",
};
