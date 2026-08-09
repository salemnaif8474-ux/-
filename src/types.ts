export type Role =
  | "owner"
  | "manager"
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
  manager: "المدير العام",
  review: "المراجعة والتدقيق",
  seller: "بائع قطع غيار",
  preparer: "مسؤول الاستلام",
  branch_manager: "مسؤول فرع",
  purchasing: "المشتريات",
  shortages: "النواقص",
  it: "تقنية المعلومات",
  accountant: "محاسب",
  hr: "الموارد البشرية",
  customer_relations: "تواصل العملاء",
};

export type RatingColor = "good" | "warn" | "bad";

export interface MonthlyRating {
  month: string;
  rating: RatingColor;
  note: string;
}

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
  monthlyRatings?: MonthlyRating[];
  boundDevice?: string | null;
  iqamaExpiry?: string;
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
  attachmentName?: string;
  attachmentUrl?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  ownerSellerId: string | null;
  taxNumber?: string;
  crNumber?: string;
  street?: string;
  district?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  buildingNumber?: string;
}

export interface BranchTarget {
  branch: string;
  target: number;
  achieved: number;
}

export interface MonthlyTargetState {
  targetSar: number;
  achievedSar: number;
  branchBreakdown: BranchTarget[];
}

export interface BranchStock {
  branch: string;
  available: number;
  reserved: number;
  incoming: number;
}

export interface Part {
  id: string;
  partNumber: string;
  name: string;
  vehicleCompat: string;
  isOriginal: boolean;
  price: number;
  costPrice: number;
  reorderPoint: number;
  safetyStock: number;
  stockByBranch: BranchStock[];
}

export type SalesDocStatus = "draft" | "sent" | "approved" | "converted" | "processing" | "completed";

export interface SalesDoc {
  id: string;
  number: string;
  type: "quotation" | "order";
  customerId: string;
  sellerId: string;
  items: { partNumber: string; name: string; qty: number; unitPrice: number }[];
  discountPct: number;
  status: SalesDocStatus;
  date: string;
}

export interface ReturnRequest {
  id: string;
  customerId: string;
  partNumber: string;
  type: "return" | "warranty";
  reason: string;
  status: "pending" | "approved" | "rejected";
  date: string;
}

export interface Supplier {
  id: string;
  name: string;
  category: string;
  leadTimeDays: number;
  rating: RatingColor;
  contact: string;
}

export type PurchaseOrderStatus = "requested" | "approved" | "ordered" | "partially_received" | "received" | "matched";

export interface PurchaseOrder {
  id: string;
  number: string;
  supplierId: string;
  items: { partNumber: string; name: string; qty: number; unitCost: number }[];
  status: PurchaseOrderStatus;
  requestedBy: string;
  branch: string;
  date: string;
  invoiceMatched: boolean;
}

export interface AuditLogEntry {
  id: string;
  category: string;
  who: string;
  action: string;
  when: string;
  before: string;
  after: string;
  approvedBy: string;
  result: "flagged" | "cleared" | "pending";
}

export type ITTicketCategory = "incident" | "problem" | "change" | "access";

export interface ITTicket {
  id: string;
  subject: string;
  requester: string;
  category: ITTicketCategory;
  priority: "low" | "medium" | "high";
  status: "open" | "in_progress" | "resolved";
  createdAt: string;
  slaHours: number;
}

export interface ApprovalRequest {
  id: string;
  kind: "purchase" | "discount" | "return" | "stock_adjustment" | "transfer" | "write_off";
  summary: string;
  requestedBy: string;
  branch: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  date: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  type: "annual" | "sick" | "emergency";
  fromDate: string;
  toDate: string;
  status: "pending" | "approved" | "rejected";
}

export interface NitaqatStatus {
  band: "platinum" | "high_green" | "medium_green" | "low_green" | "red";
  saudizationPct: number;
  requiredPct: number;
}
