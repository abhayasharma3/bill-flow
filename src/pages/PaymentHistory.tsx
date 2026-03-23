import { paymentHistory, sampleBills, categoryLabels, type BillCategory } from "@/data/bills";
import { CreditCard, Zap, Droplets, Wifi, Flame, Tv, Smartphone, Calendar } from "lucide-react";

const methodColors: Record<string, string> = {
  UPI: "bg-primary/10 text-primary",
  "Credit Card": "bg-accent/10 text-accent",
  "Debit Card": "bg-water/10 text-water",
  "Net Banking": "bg-internet/10 text-internet",
  Cash: "bg-secondary text-secondary-foreground",
};

const PaymentHistory = () => {
  const grouped = paymentHistory.reduce<Record<string, typeof paymentHistory>>((acc, p) => {
    const month = p.paidDate.slice(0, 7);
    if (!acc[month]) acc[month] = [];
    acc[month].push(p);
    return acc;
  }, {});

  const monthLabels: Record<string, string> = {
    "2026-03": "March 2026",
    "2026-02": "February 2026",
    "2026-01": "January 2026",
    "2025-12": "December 2025",
  };

  const totalPaid = paymentHistory.reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-6 fade-up">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold mb-1">Payment History</h2>
          <p className="text-sm text-muted-foreground">Complete record of all your payments</p>
        </div>
        <div className="bg-card border border-border rounded-xl px-5 py-3">
          <p className="text-xs text-muted-foreground">Total Paid</p>
          <p className="text-xl font-bold text-primary">₹{totalPaid.toLocaleString()}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 stagger-in">
        <MiniStat label="Transactions" value={paymentHistory.length.toString()} />
        <MiniStat label="Most Used" value="UPI" />
        <MiniStat label="Avg. Payment" value={`₹${Math.round(totalPaid / paymentHistory.length).toLocaleString()}`} />
        <MiniStat label="This Month" value={`₹${paymentHistory.filter(p => p.paidDate.startsWith("2026-03")).reduce((s, p) => s + p.amount, 0).toLocaleString()}`} />
      </div>

      {/* Timeline */}
      {Object.entries(grouped)
        .sort(([a], [b]) => b.localeCompare(a))
        .map(([month, payments]) => (
          <div key={month} className="fade-up">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm">{monthLabels[month] || month}</h3>
              <span className="text-xs text-muted-foreground">({payments.length} payments · ₹{payments.reduce((s, p) => s + p.amount, 0).toLocaleString()})</span>
            </div>
            <div className="space-y-2 ml-2 border-l-2 border-border pl-4">
              {payments.map((p) => {
                const bill = sampleBills.find(b => b.id === p.billId);
                return (
                  <div key={p.id} className="bg-card border border-border rounded-xl p-4 card-hover flex items-center gap-4">
                    <div className="p-2.5 rounded-lg bg-status-paid/10 flex-shrink-0">
                      <CreditCard className="h-4 w-4 text-status-paid" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-bold">₹{p.amount.toLocaleString()}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${methodColors[p.method] || "bg-secondary"}`}>
                          {p.method}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {bill ? categoryLabels[bill.category] : "Bill"} · {bill?.provider}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-mono">{p.transactionId} · {p.paidDate}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
    </div>
  );
};

const MiniStat = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-card border border-border rounded-xl p-4 card-hover">
    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
    <p className="text-lg font-bold">{value}</p>
  </div>
);

export default PaymentHistory;
