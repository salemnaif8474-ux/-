export type Role =
  | "owner"
  | "review"
  | "seller"
  | "preparer"
  | "branch_manager"
  | "purchasing"
  | "shortages"
  | "it"
  | "accountant"
  | "hr"
  | "customer_relations";

export const ROLE_LABELS: Record<Role, string> = {
  owner: "صاحب الشركة",
  review: "المراجعة والتدقيق",
  seller: "بائع",
  preparer: "محضّر",
  branch_manager: "مسؤول فرع",
  purchasing: "المشتريات",
  shortages: "النواقص",
  it: "تقنية المعلومات",
  accountant: "محاسب",
  hr: "الموارد البشرية",
  customer_relations: "تواصل العملاء",
};

export type RatingColor = "good" | "warn" | "bad";

export interface Employee {
  id: string;
  fullName: string;
  username: string;
  phone: string;
  personalEmail: string;
  role: Role;
  branch: string;
  employeeNumber: string;
  hireDate: string;
  status: "active" | "suspended" | "leave";
  rating: RatingColor;
  ratingNote: string;
  mistakesLog: { date: string; note: string }[];
}

export type ChatKey =
  | "sales"
  | "shortages"
  | "transfers"
  | "cash_boxes"
  | "lost_goods"
  | "price_changes"
  | "employee_manager";

export interface ChatDef {
  key: ChatKey;
  label: string;
  description: string;
  roles: Role[];
  requiresApproval?: boolean;
  requiresAttachment?: boolean;
}

export interface ChatMessage {
  id: string;
  author: string;
  role: Role;
  time: string;
  text: string;
  status?: "pending" | "resolved" | "approved" | "mismatch";
  hasAttachment?: boolean;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  ownerSellerId: string | null;
}
