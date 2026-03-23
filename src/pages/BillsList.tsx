import { useState, useMemo } from "react";
import { sampleBills, categoryLabels, categoryEmojis, type Bill, type BillCategory, type BillStatus } from "@/data/bills";
import { Zap, Droplets, Wifi, Flame, Tv, Smartphone, Check, Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const BillsList = () => {
  const [bills, setBills] = useState<Bill[]>(sampleBills);
  const [catFilter, setCatFilter] = useState<BillCategory | "all">("all");
  const [statusFilter, setStatusFilter] = useState<BillStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);

  const filtered = useMemo(() => {
    return bills.filter((b) => {
      if (catFilter !== "all" && b.category !== catFilter) return false;
      if (statusFilter !== "all" && b.status !== statusFilter) return false;
      if (search && !b.description.toLowerCase().includes(search.toLowerCase()) && !b.provider?.toLowerCase().includes(search.toLowerCase())) return false;
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
    gas: <Flame className="h-4 w-4 text-gas" />,
    dth: <Tv className="h-4 w-4 text-dth" />,
    phone: <Smartphone className="h-4 w-4 text-phone" />,
  };

  const statusStyle: Record<BillStatus, string> = {
    paid: "bg-status-paid/10 text-status-paid",
    unpaid: "bg-status-unpaid/10 text-status-unpaid",
    overdue: "bg-status-overdue/10 text-status-overdue",
  };

  const totalFiltered = filtered.reduce((s, b) => s + b.amount, 0);

  return (
    <div className="space-y-5 fade-up">
      {/* Summary bar */}
      <div className="flex flex-wrap items-center gap-4 bg-card border border-border rounded-xl p-4">
        <div>
          <p className="text-xs text-muted-foreground">Showing</p>
          <p className="text-lg font-bold">{filtered.length} bills</p>
        </div>
        <div className="h-8 w-px bg-border" />
        <div>
          <p className="text-xs text-muted-foreground">Total Amount</p>
          <p className="text-lg font-bold text-primary">₹{totalFiltered.toLocaleString()}</p>
        </div>
        <div className="h-8 w-px bg-border" />
        <div>
          <p className="text-xs text-muted-foreground">Unpaid</p>
          <p className="text-lg font-bold text-status-unpaid">{filtered.filter(b => b.status === "unpaid").length}</p>
        </div>
        <div className="h-8 w-px bg-border" />
        <div>
          <p className="text-xs text-muted-foreground">Overdue</p>
          <p className="text-lg font-bold text-status-overdue">{filtered.filter(b => b.status === "overdue").length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-end">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Category</label>
          <select value={catFilter} onChange={(e) => setCatFilter(e.target.value as any)} className="h-9 rounded-md bg-secondary border border-border px-3 text-sm text-foreground focus:border-primary focus:outline-none transition-colors">
            <option value="all">All Categories</option>
            {(Object.keys(categoryLabels) as BillCategory[]).map(cat => (
              <option key={cat} value={cat}>{categoryEmojis[cat]} {categoryLabels[cat]}</option>
            ))}
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
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by description or provider…" className="h-9 bg-secondary border-border focus:border-primary" />
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
              <p className="text-xs text-muted-foreground">{categoryLabels[bill.category]} · {bill.provider}</p>
              <p className="text-xs text-muted-foreground">{bill.billDate} → {bill.dueDate}</p>
            </div>
            <div className="flex gap-1.5 flex-shrink-0">
              {bill.status !== "paid" && (
                <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-status-paid/10 hover:text-status-paid" onClick={() => markPaid(bill.id)} title="Mark as Paid">
                  <Check className="h-4 w-4" />
                </Button>
              )}
              <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-primary/10 hover:text-primary" onClick={() => setSelectedBill(bill)} title="View Details">
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-sm">No bills match your filters</p>
          <Button variant="ghost" size="sm" className="mt-2" onClick={() => { setCatFilter("all"); setStatusFilter("all"); setSearch(""); }}>Clear filters</Button>
        </div>
      )}

      {/* Bill Detail Modal */}
      {selectedBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setSelectedBill(null)}>
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-lg fade-up shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-secondary">{catIcon[selectedBill.category]}</div>
                <div>
                  <h3 className="font-bold text-lg">{categoryLabels[selectedBill.category]} Bill</h3>
                  <p className="text-xs text-muted-foreground">{selectedBill.provider}</p>
                </div>
              </div>
              <button onClick={() => setSelectedBill(null)} className="p-1 rounded-lg hover:bg-secondary transition-colors">
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5">
              <DetailItem label="Amount" value={`₹${selectedBill.amount.toLocaleString()}`} />
              <DetailItem label="Status" value={selectedBill.status.toUpperCase()} />
              <DetailItem label="Bill Date" value={selectedBill.billDate} />
              <DetailItem label="Due Date" value={selectedBill.dueDate} />
              <DetailItem label="Account No." value={selectedBill.accountNumber} />
              <DetailItem label="Description" value={selectedBill.description} />
              {selectedBill.units && <DetailItem label="Units" value={selectedBill.units.toString()} />}
              {selectedBill.previousReading && selectedBill.currentReading && (
                <DetailItem label="Meter Reading" value={`${selectedBill.previousReading} → ${selectedBill.currentReading}`} />
              )}
            </div>

            {selectedBill.status !== "paid" && (
              <Button className="w-full" onClick={() => { markPaid(selectedBill.id); setSelectedBill(null); }}>
                <Check className="h-4 w-4 mr-2" /> Mark as Paid
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const DetailItem = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-secondary/50 rounded-lg p-3">
    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">{label}</p>
    <p className="text-sm font-medium">{value}</p>
  </div>
);

export default BillsList;
