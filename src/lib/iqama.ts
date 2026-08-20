import type { Employee } from "../types";

export type IqamaSeverity = "critical" | "warning" | "ok";

export interface IqamaAlert {
  employeeId: string;
  employeeName: string;
  expiry: string;
  daysLeft: number;
  severity: Exclude<IqamaSeverity, "ok">;
  message: string;
}

export function daysUntil(dateIso: string, today = new Date()): number {
  const target = new Date(`${dateIso}T00:00:00`);
  const start = new Date(today.toISOString().slice(0, 10) + "T00:00:00");
  return Math.round((target.getTime() - start.getTime()) / 86_400_000);
}

// Red critical inside 15 days, yellow warning inside 30 — expired documents stay
// critical so they never drop off the list before they are renewed.
export function iqamaSeverity(daysLeft: number): IqamaSeverity {
  if (daysLeft <= 15) return "critical";
  if (daysLeft <= 30) return "warning";
  return "ok";
}

export function buildIqamaAlerts(employees: Employee[], today = new Date()): IqamaAlert[] {
  return employees
    .filter((e) => e.iqamaExpiry)
    .map((e) => {
      const daysLeft = daysUntil(e.iqamaExpiry!, today);
      return { employee: e, daysLeft, severity: iqamaSeverity(daysLeft) };
    })
    .filter((row) => row.severity !== "ok")
    .map(({ employee, daysLeft, severity }) => ({
      employeeId: employee.id,
      employeeName: employee.fullName,
      expiry: employee.iqamaExpiry!,
      daysLeft,
      severity: severity as Exclude<IqamaSeverity, "ok">,
      message:
        daysLeft < 0
          ? `عاجل: إقامة ${employee.fullName} منتهية منذ ${Math.abs(daysLeft)} يوم — التجديد مطلوب فورًا`
          : severity === "critical"
            ? `عاجل: إقامة ${employee.fullName} تنتهي خلال ${daysLeft} يوم — يتطلب إجراءً فوريًا`
            : `تنبيه: إقامة ${employee.fullName} تنتهي خلال ${daysLeft} يوم تقريبًا — التجديد مطلوب`,
    }))
    .sort((a, b) => a.daysLeft - b.daysLeft);
}
