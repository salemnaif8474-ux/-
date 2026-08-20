import type { Role } from "../types";

// Single source of truth for what each role may do. Route guards, nav, search
// and notifications all read from here so a capability can never be granted in
// one place and forgotten in another.
export type Capability =
  | "budget.view"
  | "budget.edit"
  | "users.manage"
  | "users.resetPassword"
  | "permissions.edit"
  | "suppliers.approve"
  | "suppliers.purchase"
  | "customers.approve"
  | "customers.requestAdd"
  | "customers.viewAll"
  | "ratings.viewAll"
  | "targets.view"
  | "targets.edit"
  | "audit.view"
  | "hr.view";

// Budget capabilities are deliberately absent from every role except owner —
// the general manager is excluded by explicit company policy.
const ROLE_CAPABILITIES: Record<Role, Capability[]> = {
  owner: [
    "budget.view",
    "budget.edit",
    "users.manage",
    "users.resetPassword",
    "permissions.edit",
    "suppliers.approve",
    "suppliers.purchase",
    "customers.approve",
    "customers.viewAll",
    "ratings.viewAll",
    "targets.view",
    "targets.edit",
    "audit.view",
    "hr.view",
  ],
  manager: [
    "users.manage",
    "customers.viewAll",
    "customers.requestAdd",
    "targets.view",
    "targets.edit",
    "audit.view",
  ],
  review: ["targets.view", "audit.view"],
  seller: ["customers.requestAdd", "targets.view"],
  preparer: [],
  branch_manager: ["customers.viewAll", "customers.requestAdd", "targets.view"],
  purchasing: ["suppliers.purchase", "targets.view"],
  shortages: ["targets.view"],
  it: ["users.manage", "users.resetPassword", "targets.view"],
  accountant: ["targets.view"],
  hr: ["users.manage", "targets.view", "hr.view"],
  customer_relations: ["customers.requestAdd", "targets.view"],
};

export function can(role: Role | undefined | null, capability: Capability): boolean {
  if (!role) return false;
  return ROLE_CAPABILITIES[role]?.includes(capability) ?? false;
}

export function capabilitiesFor(role: Role): Capability[] {
  return ROLE_CAPABILITIES[role] ?? [];
}

// A login is only valid when the role the user picked is the role actually
// assigned to their account — picking a different role must never widen access.
export function roleSelectionMatches(assignedRole: Role, selectedRole: Role): boolean {
  return assignedRole === selectedRole;
}
