import { describe, expect, it } from "vitest";
import { classifyPerformance, isImproving } from "./performance";
import type { Employee, PerformanceEvaluation } from "../types";

function employee(overrides: Partial<Employee> = {}): Employee {
  return {
    id: "x1",
    fullName: "موظف تجريبي",
    username: "test.u",
    phone: "0500000000",
    personalEmail: "t@example.com",
    role: "seller",
    branch: "فرع",
    employeeNumber: "EMP-9999",
    hireDate: "2024-01-01",
    status: "active",
    rating: "warn",
    ratingNote: "",
    mistakesLog: [],
    ...overrides,
  };
}

function evaluation(pct: number): PerformanceEvaluation {
  return {
    employeeId: "x1",
    month: "2026-08",
    score: 70,
    targetAchievedPct: pct,
    strengths: [],
    issues: [],
    improvements: [],
    managerComment: "",
    status: "warn",
  };
}

describe("isImproving", () => {
  it("detects a rating that moved up month over month", () => {
    const emp = employee({
      monthlyRatings: [
        { month: "2026-07", rating: "bad", note: "" },
        { month: "2026-08", rating: "warn", note: "" },
      ],
    });
    expect(isImproving(emp)).toBe(true);
  });

  it("does not treat a decline or a flat trend as improvement", () => {
    const declining = employee({
      monthlyRatings: [
        { month: "2026-07", rating: "good", note: "" },
        { month: "2026-08", rating: "bad", note: "" },
      ],
    });
    const flat = employee({
      monthlyRatings: [
        { month: "2026-07", rating: "warn", note: "" },
        { month: "2026-08", rating: "warn", note: "" },
      ],
    });
    expect(isImproving(declining)).toBe(false);
    expect(isImproving(flat)).toBe(false);
  });

  it("needs at least two months of history", () => {
    expect(isImproving(employee({ monthlyRatings: [{ month: "2026-08", rating: "good", note: "" }] }))).toBe(false);
    expect(isImproving(employee())).toBe(false);
  });
});

describe("classifyPerformance", () => {
  it("marks employees at or above target as achieved", () => {
    expect(classifyPerformance(employee(), evaluation(100))).toBe("achieved");
    expect(classifyPerformance(employee(), evaluation(118))).toBe("achieved");
  });

  it("marks an under-target but rising employee as improving", () => {
    const emp = employee({
      monthlyRatings: [
        { month: "2026-07", rating: "bad", note: "" },
        { month: "2026-08", rating: "good", note: "" },
      ],
    });
    expect(classifyPerformance(emp, evaluation(80))).toBe("improving");
  });

  it("marks an under-target employee with no improvement as needing improvement", () => {
    expect(classifyPerformance(employee(), evaluation(62))).toBe("needs_improvement");
    expect(classifyPerformance(employee(), undefined)).toBe("needs_improvement");
  });
});
