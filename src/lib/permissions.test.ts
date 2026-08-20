import { describe, expect, it } from "vitest";
import { ALL_ROLES } from "../data/navConfig";
import { can, roleSelectionMatches } from "./permissions";

describe("budget access", () => {
  it("grants budget access to the owner only", () => {
    const withBudget = ALL_ROLES.filter((r) => can(r, "budget.view"));
    expect(withBudget).toEqual(["owner"]);
  });

  it("denies budget access to the general manager", () => {
    expect(can("manager", "budget.view")).toBe(false);
    expect(can("manager", "budget.edit")).toBe(false);
  });

  it("denies budget access to every non-owner role", () => {
    for (const role of ALL_ROLES.filter((r) => r !== "owner")) {
      expect(can(role, "budget.view")).toBe(false);
      expect(can(role, "budget.edit")).toBe(false);
    }
  });
});

describe("restricted administrative capabilities", () => {
  it("keeps supplier approval, customer approval and company-wide ratings owner-only", () => {
    for (const capability of ["suppliers.approve", "customers.approve", "ratings.viewAll"] as const) {
      expect(ALL_ROLES.filter((r) => can(r, capability))).toEqual(["owner"]);
    }
  });

  it("keeps permission editing owner-only", () => {
    expect(ALL_ROLES.filter((r) => can(r, "permissions.edit"))).toEqual(["owner"]);
  });
});

describe("role selection at login", () => {
  it("accepts the assigned role", () => {
    expect(roleSelectionMatches("seller", "seller")).toBe(true);
  });

  it("rejects escalating to another role", () => {
    expect(roleSelectionMatches("seller", "manager")).toBe(false);
    expect(roleSelectionMatches("accountant", "owner")).toBe(false);
    expect(roleSelectionMatches("purchasing", "branch_manager")).toBe(false);
  });
});
