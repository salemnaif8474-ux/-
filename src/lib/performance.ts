import type { Employee, PerformanceEvaluation, RatingColor } from "../types";

export type PerformanceGroup = "achieved" | "improving" | "needs_improvement";

const RANK: Record<RatingColor, number> = { bad: 0, warn: 1, good: 2 };

// An employee counts as improving when their latest monthly rating is better
// than the one before it, even if they have not reached target yet.
export function isImproving(employee: Employee): boolean {
  const ratings = employee.monthlyRatings;
  if (!ratings || ratings.length < 2) return false;
  const latest = ratings[ratings.length - 1];
  const previous = ratings[ratings.length - 2];
  return RANK[latest.rating] > RANK[previous.rating];
}

export function classifyPerformance(
  employee: Employee,
  evaluation: PerformanceEvaluation | undefined,
): PerformanceGroup {
  if (evaluation && evaluation.targetAchievedPct >= 100) return "achieved";
  if (isImproving(employee)) return "improving";
  return "needs_improvement";
}

export function groupByPerformance(
  employees: Employee[],
  evaluations: PerformanceEvaluation[],
): Record<PerformanceGroup, Employee[]> {
  const groups: Record<PerformanceGroup, Employee[]> = {
    achieved: [],
    improving: [],
    needs_improvement: [],
  };
  for (const employee of employees) {
    const evaluation = evaluations.find((e) => e.employeeId === employee.id);
    groups[classifyPerformance(employee, evaluation)].push(employee);
  }
  return groups;
}
