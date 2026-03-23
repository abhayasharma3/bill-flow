import { useState, useMemo } from "react";
import { sampleBills, type Bill, type BillCategory, type BillStatus } from "@/data/bills";
import { Zap, Droplets, Wifi, Check, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const BillsList = () => {
  const [bills, setBills] = useState<Bill[]>(sampleBills);
  const [catFilter, setCatFilter] = useState<BillCategory | "all">("all");
  const [statusFilter, setStatusFilter] = useState<BillStatus | "all">("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return bills.filter((b) => {
      if (catFilter !== "all" && b.category !== catFilter) return false;
      if (statusFilter !== "all" && b.status !== statusFilter) return false;
      if (search && !b.description.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [bills, catFilter, statusFilter, search]);

  const markPaid = (id: string) => {
    setBills((prev) => prev.map((b) => (b.id === id ? { ...b, status: "paid" as BillStatus } : b)));
    toast.success("Bill marked as paid!");
  };

  const catIcon: Record<BillCategory, React.ReactNode> = {
    electricity: <Zap className="h-4 w-4 text-electricity" />,
    water: <Droplets className="h-4 w-4 text-water" />,
    internet: <Wifi className="h-4 w-4 text-internet" />,
  };

  const statusStyle: Record<BillStatus, string> = {
    paid: "bg-status-paid/10 text-status-paid",
    unpaid: "bg-status-unpaid/10 text-status-unpaid",
    overdue: "bg-status-overdue/10 text-status-overdue",
  };

  return (
    <div className="space-y-5 fade-up">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-end">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Category</label>
          <select value={catFilter} onChange={(e) => setCatFilter(e.target.value as any)} className="h-9 rounded-md bg-secondary border border-border px-3 text-sm text-foreground focus:border-primary focus:outline-none transition-colors">
            <option value="all">All</option>
            <option value="electricity">Electricity</option>
            <option value="water">Water</option>
            <option value="internet">Internet</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Status</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="h-9 rounded-md bg-secondary border border-border px-3 text-sm text-foreground focus:border-primary focus:outline-none transition-colors">
            <option value="all">All</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
        <div className="flex-1 min-w-[180px]">
          <label className="text-xs text-muted-foreground mb-1 block">Search</label>
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search bills…" className="h-9 bg-secondary border-border focus:border-primary" />
        </div>
        <Button variant="ghost" size="sm" onClick={() => { setCatFilter("all"); setStatusFilter("all"); setSearch(""); }}>Reset</Button>
      </div>

      {/* Bill cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 stagger-in">
        {filtered.map((bill) => (
          <div key={bill.id} className="bg-card border border-border rounded-xl p-4 card-hover flex items-center gap-4">
            <div className="p-2.5 rounded-lg bg-secondary flex-shrink-0 transition-transform duration-200 hover:scale-110">
              {catIcon[bill.category]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-lg">₹{bill.amount.toLocaleString()}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${statusStyle[bill.status]}`}>{bill.status}</span>
              </div>
              <p className="text-xs text-muted-foreground capitalize">{bill.category} · {bill.billDate} → {bill.dueDate}</p>
              <p className="text-xs text-muted-foreground truncate">{bill.description}</p>
            </div>
            <div className="flex gap-1.5 flex-shrink-0">
              {bill.status !== "paid" && (
                <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-status-paid/10 hover:text-status-paid" onClick={() => markPaid(bill.id)} title="Mark as Paid">
                  <Check className="h-4 w-4" />
                </Button>
              )}
              <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-primary/10 hover:text-primary" title="View Details">
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-sm">No bills match your filters</p>
        </div>
      )}
    </div>
  );
};

export default BillsList;
