import { describe, expect, it } from "vitest";
import { buildIqamaAlerts, iqamaSeverity } from "./iqama";
import type { Employee } from "../types";

const TODAY = new Date("2026-08-19T00:00:00");

function employee(id: string, name: string, iqamaExpiry?: string): Employee {
  return {
    id,
    fullName: name,
    username: id,
    phone: "0500000000",
    personalEmail: `${id}@example.com`,
    role: "seller",
    branch: "فرع",
    employeeNumber: `EMP-${id}`,
    hireDate: "2024-01-01",
    status: "active",
    rating: "good",
    ratingNote: "",
    mistakesLog: [],
    iqamaExpiry,
  };
}

describe("iqamaSeverity", () => {
  it("flags 15 days or fewer as critical", () => {
    expect(iqamaSeverity(15)).toBe("critical");
    expect(iqamaSeverity(3)).toBe("critical");
    expect(iqamaSeverity(-4)).toBe("critical");
  });

  it("flags 16-30 days as a warning", () => {
    expect(iqamaSeverity(30)).toBe("warning");
    expect(iqamaSeverity(16)).toBe("warning");
  });

  it("leaves anything beyond 30 days alone", () => {
    expect(iqamaSeverity(31)).toBe("ok");
    expect(iqamaSeverity(200)).toBe("ok");
  });
});

describe("buildIqamaAlerts", () => {
  it("returns only employees inside the alert window, soonest first", () => {
    const alerts = buildIqamaAlerts(
      [
        employee("a", "موظف بعيد", "2027-01-01"),
        employee("b", "موظف حرج", "2026-08-25"),
        employee("c", "موظف تنبيه", "2026-09-10"),
        employee("d", "بدون إقامة"),
      ],
      TODAY,
    );

    expect(alerts.map((a) => a.employeeId)).toEqual(["b", "c"]);
    expect(alerts[0].severity).toBe("critical");
    expect(alerts[1].severity).toBe("warning");
  });

  it("keeps already-expired documents as critical", () => {
    const alerts = buildIqamaAlerts([employee("e", "منتهية", "2026-08-10")], TODAY);
    expect(alerts[0].severity).toBe("critical");
    expect(alerts[0].message).toContain("منتهية منذ");
  });

  it("names the employee in every alert message", () => {
    const alerts = buildIqamaAlerts([employee("f", "سعود الحربي", "2026-08-22")], TODAY);
    expect(alerts[0].message).toContain("سعود الحربي");
  });
});
