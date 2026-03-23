export type BillCategory = "electricity" | "water" | "internet";
export type BillStatus = "paid" | "unpaid" | "overdue";

export interface Bill {
  id: string;
  category: BillCategory;
  amount: number;
  billDate: string;
  dueDate: string;
  status: BillStatus;
  description: string;
}

export const sampleBills: Bill[] = [
  { id: "1", category: "electricity", amount: 2340, billDate: "2026-03-01", dueDate: "2026-03-15", status: "paid", description: "March electricity" },
  { id: "2", category: "water", amount: 580, billDate: "2026-03-03", dueDate: "2026-03-20", status: "unpaid", description: "March water supply" },
  { id: "3", category: "internet", amount: 999, billDate: "2026-03-05", dueDate: "2026-03-25", status: "unpaid", description: "Broadband monthly" },
  { id: "4", category: "electricity", amount: 2780, billDate: "2026-02-01", dueDate: "2026-02-15", status: "paid", description: "Feb electricity" },
  { id: "5", category: "water", amount: 620, billDate: "2026-02-03", dueDate: "2026-02-18", status: "paid", description: "Feb water supply" },
  { id: "6", category: "internet", amount: 999, billDate: "2026-02-05", dueDate: "2026-02-25", status: "paid", description: "Feb broadband" },
  { id: "7", category: "electricity", amount: 1980, billDate: "2026-01-01", dueDate: "2026-01-15", status: "paid", description: "Jan electricity" },
  { id: "8", category: "water", amount: 540, billDate: "2026-01-03", dueDate: "2026-01-18", status: "paid", description: "Jan water" },
  { id: "9", category: "internet", amount: 999, billDate: "2026-01-05", dueDate: "2026-01-25", status: "paid", description: "Jan broadband" },
  { id: "10", category: "electricity", amount: 3100, billDate: "2025-12-01", dueDate: "2025-12-15", status: "paid", description: "Dec electricity" },
  { id: "11", category: "water", amount: 710, billDate: "2025-12-03", dueDate: "2025-12-18", status: "paid", description: "Dec water" },
  { id: "12", category: "electricity", amount: 2500, billDate: "2025-11-01", dueDate: "2025-11-15", status: "paid", description: "Nov electricity" },
  { id: "13", category: "water", amount: 490, billDate: "2025-11-03", dueDate: "2025-11-18", status: "paid", description: "Nov water" },
  { id: "14", category: "internet", amount: 999, billDate: "2025-11-05", dueDate: "2025-11-25", status: "paid", description: "Nov broadband" },
  { id: "15", category: "electricity", amount: 2650, billDate: "2025-10-01", dueDate: "2025-10-15", status: "overdue", description: "Oct electricity – overdue" },
];

export const monthlyTotals = [
  { month: "Oct", electricity: 2650, water: 0, internet: 0, total: 2650 },
  { month: "Nov", electricity: 2500, water: 490, internet: 999, total: 3989 },
  { month: "Dec", electricity: 3100, water: 710, internet: 0, total: 3810 },
  { month: "Jan", electricity: 1980, water: 540, internet: 999, total: 3519 },
  { month: "Feb", electricity: 2780, water: 620, internet: 999, total: 4399 },
  { month: "Mar", electricity: 2340, water: 580, internet: 999, total: 3919 },
];

export const categoryColors: Record<BillCategory, string> = {
  electricity: "hsl(38, 92%, 55%)",
  water: "hsl(200, 80%, 55%)",
  internet: "hsl(280, 65%, 60%)",
};

export const statusColors: Record<BillStatus, string> = {
  paid: "hsl(142, 60%, 45%)",
  unpaid: "hsl(45, 93%, 55%)",
  overdue: "hsl(0, 72%, 55%)",
};
