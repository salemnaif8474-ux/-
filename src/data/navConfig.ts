import type { Role } from "../types";

export interface NavItem {
  to: string;
  label: string;
  roles: Role[] | "all";
}

export const ALL_ROLES: Role[] = [
  "owner",
  "manager",
  "review",
  "seller",
  "preparer",
  "branch_manager",
  "purchasing",
  "shortages",
  "it",
  "accountant",
  "hr",
  "customer_relations",
];

export const ROLES_EXCEPT_PREPARER = ALL_ROLES.filter((r) => r !== "preparer");

export const NAV_ITEMS: NavItem[] = [
  { to: "/app", label: "الرئيسية", roles: "all" },
  { to: "/app/targets", label: "الأهداف الشهرية", roles: ROLES_EXCEPT_PREPARER },
  { to: "/app/chats", label: "المحادثات", roles: "all" },
  { to: "/app/customers", label: "عملائي", roles: ["seller", "owner", "manager", "branch_manager"] },
  { to: "/app/ratings", label: "تقييم الموظفين", roles: ["owner"] },
  { to: "/app/employees", label: "الموظفون والصلاحيات", roles: ["owner", "manager", "it", "hr"] },
  { to: "/app/profile", label: "حسابي", roles: "all" },
];
