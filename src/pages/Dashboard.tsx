import { useMemo } from "react";
import { sampleBills, monthlyTotals, categoryColors, budgetLimits, paymentHistory, categoryLabels, categoryEmojis, type BillCategory } from "@/data/bills";
import { IndianRupee, AlertTriangle, Zap, Droplets, Wifi, Clock, Flame, Tv, Smartphone, TrendingUp, CreditCard, ShieldCheck, PiggyBank } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from "recharts";

const tooltipStyle = {
  backgroundColor: "hsl(220, 18%, 13%)",
  border: "1px solid hsl(220, 14%, 20%)",
  borderRadius: 8,
  color: "hsl(210, 20%, 92%)",
};

const Dashboard = () => {
  const stats = useMemo(() => {
    const marchBills = sampleBills.filter((b) => b.billDate.startsWith("2026-03"));
    const totalThisMonth = marchBills.reduce((s, b) => s + b.amount, 0);
    const pending = sampleBills.filter((b) => b.status === "unpaid" || b.status === "overdue");
    const upcoming = sampleBills.filter((b) => b.status === "unpaid").slice(0, 4);
    const totalPaid = sampleBills.filter(b => b.status === "paid").reduce((s, b) => s + b.amount, 0);
    const overdueBills = sampleBills.filter(b => b.status === "overdue");
    const totalBills = sampleBills.length;
    const paidBills = sampleBills.filter(b => b.status === "paid").length;
    return { totalThisMonth, pendingCount: pending.length, upcoming, totalPaid, overdueBills, totalBills, paidBills };
  }, []);

  const pieData = (Object.keys(categoryColors) as BillCategory[]).map(cat => {
    const total = sampleBills.filter(b => b.billDate.startsWith("2026-03") && b.category === cat).reduce((s, b) => s + b.amount, 0);
    return { name: categoryLabels[cat], value: total, color: categoryColors[cat] };
  }).filter(d => d.value > 0);

  const recentPayments = paymentHistory.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-in">
        <StatCard icon={<IndianRupee className="h-5 w-5" />} label="Total This Month" value={`₹${stats.totalThisMonth.toLocaleString()}`} accent="primary" />
        <StatCard icon={<AlertTriangle className="h-5 w-5" />} label="Pending Bills" value={stats.pendingCount.toString()} accent="accent" />
        <StatCard icon={<ShieldCheck className="h-5 w-5" />} label="Total Paid" value={`₹${stats.totalPaid.toLocaleString()}`} accent="primary" />
        <StatCard icon={<PiggyBank className="h-5 w-5" />} label="Payment Rate" value={`${Math.round((stats.paidBills / stats.totalBills) * 100)}%`} accent="primary" />
      </div>

      {/* Utilities breakdown pills */}
      <div className="bg-card border border-border rounded-xl p-5 card-hover fade-up">
        <p className="text-sm text-muted-foreground mb-3">Utilities Tracked</p>
        <div className="flex gap-2 flex-wrap">
          {(Object.keys(categoryLabels) as BillCategory[]).map(cat => (
            <span key={cat} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-secondary border border-border transition-all duration-200 hover:border-primary/40 hover:bg-primary/5">
              <CategoryIcon category={cat} size={3} />
              {categoryLabels[cat]}
            </span>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 stagger-in">
        <div className="bg-card border border-border rounded-xl p-5 card-hover">
          <h3 className="font-semibold mb-4">Monthly Totals</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthlyTotals}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 20%)" />
              <XAxis dataKey="month" stroke="hsl(215, 14%, 55%)" fontSize={12} />
              <YAxis stroke="hsl(215, 14%, 55%)" fontSize={12} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="total" stroke="hsl(142, 60%, 45%)" strokeWidth={2.5} dot={{ fill: "hsl(142, 60%, 45%)", r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 card-hover">
          <h3 className="font-semibold mb-4">Category Split (March)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={95} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {pieData.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Budget Progress */}
      <div className="bg-card border border-border rounded-xl p-5 fade-up">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" /> Budget Limits (March)
        </h3>
        <div className="space-y-4">
          {budgetLimits.map((bl) => {
            const pct = Math.min((bl.currentSpend / bl.monthlyLimit) * 100, 100);
            const isOver = pct >= 90;
            return (
              <div key={bl.category}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <CategoryIcon category={bl.category} size={3} />
                    <span className="text-sm font-medium">{categoryLabels[bl.category]}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    ₹{bl.currentSpend.toLocaleString()} / ₹{bl.monthlyLimit.toLocaleString()}
                  </span>
                </div>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`progress-bar ${isOver ? "bg-status-overdue" : "bg-primary"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Payments & Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Upcoming due bills */}
        <div className="bg-card border border-border rounded-xl p-5 fade-up">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4 text-accent" /> Upcoming Due Bills
          </h3>
          <div className="space-y-3">
            {stats.upcoming.map((bill) => (
              <div key={bill.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border card-hover">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-secondary">
                    <CategoryIcon category={bill.category} size={4} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{categoryLabels[bill.category]}</p>
                    <p className="text-xs text-muted-foreground">Due: {bill.dueDate}</p>
                    <p className="text-[10px] text-muted-foreground">{bill.provider}</p>
                  </div>
                </div>
                <span className="font-semibold">₹{bill.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent payments */}
        <div className="bg-card border border-border rounded-xl p-5 fade-up fade-up-delay-1">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-primary" /> Recent Payments
          </h3>
          <div className="space-y-3">
            {recentPayments.map((p) => {
              const bill = sampleBills.find(b => b.id === p.billId);
              return (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border card-hover">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-status-paid/10">
                      <CreditCard className="h-4 w-4 text-status-paid" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{bill ? categoryLabels[bill.category] : "Bill"}</p>
                      <p className="text-xs text-muted-foreground">{p.paidDate} · {p.method}</p>
                      <p className="text-[10px] text-muted-foreground font-mono">{p.transactionId}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-status-paid">₹{p.amount.toLocaleString()}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Overdue warning */}
      {stats.overdueBills.length > 0 && (
        <div className="bg-status-overdue/5 border border-status-overdue/20 rounded-xl p-5 fade-up">
          <h3 className="font-semibold mb-3 flex items-center gap-2 text-status-overdue">
            <AlertTriangle className="h-4 w-4" /> Overdue Bills Alert
          </h3>
          <div className="space-y-2">
            {stats.overdueBills.map(bill => (
              <div key={bill.id} className="flex items-center justify-between p-3 rounded-lg bg-status-overdue/5 border border-status-overdue/10">
                <div className="flex items-center gap-3">
                  <CategoryIcon category={bill.category} size={4} />
                  <div>
                    <p className="text-sm font-medium">{categoryLabels[bill.category]}</p>
                    <p className="text-xs text-muted-foreground">Was due: {bill.dueDate} · {bill.provider}</p>
                  </div>
                </div>
                <span className="font-semibold text-status-overdue">₹{bill.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent: string }) => (
  <div className="bg-card border border-border rounded-xl p-5 card-hover">
    <div className="flex items-center gap-3 mb-2">
      <div className={`p-2 rounded-lg ${accent === "primary" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"}`}>
        {icon}
      </div>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
    <p className="text-2xl font-bold tracking-tight">{value}</p>
  </div>
);

const CategoryIcon = ({ category, size = 4 }: { category: BillCategory; size?: number }) => {
  const iconClass = `h-${size} w-${size}`;
  const icons: Record<BillCategory, React.ReactNode> = {
    electricity: <Zap className={`${iconClass} text-electricity`} />,
    water: <Droplets className={`${iconClass} text-water`} />,
    internet: <Wifi className={`${iconClass} text-internet`} />,
    gas: <Flame className={`${iconClass} text-gas`} />,
    dth: <Tv className={`${iconClass} text-dth`} />,
    phone: <Smartphone className={`${iconClass} text-phone`} />,
  };
  return <>{icons[category]}</>;
};

export default Dashboard;
