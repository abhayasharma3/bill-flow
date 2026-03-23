import { useMemo } from "react";
import { sampleBills, monthlyTotals, categoryColors } from "@/data/bills";
import { IndianRupee, AlertTriangle, Zap, Droplets, Wifi, Clock } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const Dashboard = () => {
  const stats = useMemo(() => {
    const marchBills = sampleBills.filter((b) => b.billDate.startsWith("2026-03"));
    const totalThisMonth = marchBills.reduce((s, b) => s + b.amount, 0);
    const pending = sampleBills.filter((b) => b.status === "unpaid" || b.status === "overdue");
    const upcoming = sampleBills.filter((b) => b.status === "unpaid").slice(0, 3);
    return { totalThisMonth, pendingCount: pending.length, upcoming };
  }, []);

  const pieData = [
    { name: "Electricity", value: 2340, color: categoryColors.electricity },
    { name: "Water", value: 580, color: categoryColors.water },
    { name: "Internet", value: 999, color: categoryColors.internet },
  ];

  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-in">
        <StatCard icon={<IndianRupee className="h-5 w-5" />} label="Total This Month" value={`₹${stats.totalThisMonth.toLocaleString()}`} accent="primary" />
        <StatCard icon={<AlertTriangle className="h-5 w-5" />} label="Pending Bills" value={stats.pendingCount.toString()} accent="accent" />
        <div className="bg-card border border-border rounded-xl p-5 card-hover">
          <p className="text-sm text-muted-foreground mb-3">Utilities Breakdown</p>
          <div className="flex gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-electricity/10 text-electricity transition-colors hover:bg-electricity/20">
              <Zap className="h-3 w-3" /> Electricity
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-water/10 text-water transition-colors hover:bg-water/20">
              <Droplets className="h-3 w-3" /> Water
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-internet/10 text-internet transition-colors hover:bg-internet/20">
              <Wifi className="h-3 w-3" /> Internet
            </span>
          </div>
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
              <Tooltip contentStyle={{ backgroundColor: "hsl(220, 18%, 13%)", border: "1px solid hsl(220, 14%, 20%)", borderRadius: 8, color: "hsl(210, 20%, 92%)" }} />
              <Line type="monotone" dataKey="total" stroke="hsl(142, 60%, 45%)" strokeWidth={2.5} dot={{ fill: "hsl(142, 60%, 45%)", r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 card-hover">
          <h3 className="font-semibold mb-4">Category Split (March)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {pieData.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "hsl(220, 18%, 13%)", border: "1px solid hsl(220, 14%, 20%)", borderRadius: 8, color: "hsl(210, 20%, 92%)" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Upcoming due bills */}
      <div className="bg-card border border-border rounded-xl p-5 fade-up">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Clock className="h-4 w-4 text-accent" /> Upcoming Due Bills
        </h3>
        <div className="space-y-3">
          {stats.upcoming.map((bill) => (
            <div key={bill.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border card-hover">
              <div className="flex items-center gap-3">
                <CategoryIcon category={bill.category} />
                <div>
                  <p className="text-sm font-medium capitalize">{bill.category}</p>
                  <p className="text-xs text-muted-foreground">Due: {bill.dueDate}</p>
                </div>
              </div>
              <span className="font-semibold">₹{bill.amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
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

const CategoryIcon = ({ category }: { category: string }) => {
  const icons: Record<string, React.ReactNode> = {
    electricity: <Zap className="h-4 w-4 text-electricity" />,
    water: <Droplets className="h-4 w-4 text-water" />,
    internet: <Wifi className="h-4 w-4 text-internet" />,
  };
  return <div className="p-2 rounded-lg bg-secondary">{icons[category]}</div>;
};

export default Dashboard;
