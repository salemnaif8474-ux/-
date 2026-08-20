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
  { to: "/", label: "الرئيسية", roles: "all" },
  { to: "/targets", label: "الأهداف الشهرية", roles: ROLES_EXCEPT_PREPARER },
  { to: "/chats", label: "المحادثات", roles: "all" },
  { to: "/customers", label: "عملائي", roles: ["seller", "owner", "manager", "branch_manager", "customer_relations"] },
  { to: "/budget", label: "ميزانية الشركة", roles: ["owner"] },
  { to: "/ratings", label: "تقييم الموظفين", roles: ["owner"] },
  { to: "/employees", label: "الموظفون والصلاحيات", roles: ["owner", "manager", "it", "hr"] },
  { to: "/profile", label: "حسابي", roles: "all" },
];
