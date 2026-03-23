import { monthlyTotals, categoryColors, sampleBills, categoryLabels, type BillCategory } from "@/data/bills";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, AreaChart, Area } from "recharts";
import { TrendingUp, TrendingDown, Minus, ArrowUpRight, ArrowDownRight } from "lucide-react";

const tooltipStyle = {
  backgroundColor: "hsl(220, 18%, 13%)",
  border: "1px solid hsl(220, 14%, 20%)",
  borderRadius: 8,
  color: "hsl(210, 20%, 92%)",
};

const Trends = () => {
  const last = monthlyTotals[monthlyTotals.length - 1];
  const prev = monthlyTotals[monthlyTotals.length - 2];
  const diff = last.total - prev.total;
  const pct = ((diff / prev.total) * 100).toFixed(1);

  const categoryTrends: { category: BillCategory; current: number; previous: number; diff: number }[] = (
    Object.keys(categoryColors) as BillCategory[]
  ).map((cat) => ({
    category: cat,
    current: last[cat] || 0,
    previous: prev[cat] || 0,
    diff: (last[cat] || 0) - (prev[cat] || 0),
  }));

  // Average monthly spend
  const avgMonthly = Math.round(monthlyTotals.reduce((s, m) => s + m.total, 0) / monthlyTotals.length);
  // Highest month
  const highestMonth = monthlyTotals.reduce((a, b) => (a.total > b.total ? a : b));
  // Lowest month
  const lowestMonth = monthlyTotals.reduce((a, b) => (a.total < b.total ? a : b));

  // Category-wise total across all months
  const categoryTotalData = (Object.keys(categoryColors) as BillCategory[]).map(cat => {
    const total = sampleBills.filter(b => b.category === cat).reduce((s, b) => s + b.amount, 0);
    return { category: categoryLabels[cat], total, fill: categoryColors[cat] };
  });

  return (
    <div className="space-y-6 fade-up">
      <div>
        <h2 className="text-xl font-bold mb-1">Trend Analysis</h2>
        <p className="text-sm text-muted-foreground">Comprehensive bills analysis over the last 6 months</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 stagger-in">
        <MiniStat label="Avg. Monthly" value={`₹${avgMonthly.toLocaleString()}`} />
        <MiniStat label="Highest" value={`₹${highestMonth.total.toLocaleString()}`} sub={highestMonth.month} />
        <MiniStat label="Lowest" value={`₹${lowestMonth.total.toLocaleString()}`} sub={lowestMonth.month} />
        <MiniStat label="This Month" value={`₹${last.total.toLocaleString()}`} sub={`${diff > 0 ? "+" : ""}${pct}%`} />
      </div>

      {/* Overall trend chart */}
      <div className="bg-card border border-border rounded-xl p-5 card-hover">
        <h3 className="font-semibold mb-4">Overall Monthly Total</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={monthlyTotals}>
            <defs>
              <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(142, 60%, 45%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(142, 60%, 45%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 20%)" />
            <XAxis dataKey="month" stroke="hsl(215, 14%, 55%)" fontSize={12} />
            <YAxis stroke="hsl(215, 14%, 55%)" fontSize={12} />
            <Tooltip contentStyle={tooltipStyle} />
            <Area type="monotone" dataKey="total" stroke="hsl(142, 60%, 45%)" strokeWidth={2.5} fill="url(#totalGrad)" dot={{ fill: "hsl(142, 60%, 45%)", r: 4 }} activeDot={{ r: 6 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Category-wise trend */}
      <div className="bg-card border border-border rounded-xl p-5 card-hover">
        <h3 className="font-semibold mb-4">Category-wise Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyTotals}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 20%)" />
            <XAxis dataKey="month" stroke="hsl(215, 14%, 55%)" fontSize={12} />
            <YAxis stroke="hsl(215, 14%, 55%)" fontSize={12} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend />
            {(Object.keys(categoryColors) as BillCategory[]).map((cat) => (
              <Line key={cat} type="monotone" dataKey={cat} name={categoryLabels[cat]} stroke={categoryColors[cat]} strokeWidth={2} dot={{ r: 3 }} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Category total bar chart */}
      <div className="bg-card border border-border rounded-xl p-5 card-hover">
        <h3 className="font-semibold mb-4">Total Spend by Category (All Time)</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={categoryTotalData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 20%)" />
            <XAxis dataKey="category" stroke="hsl(215, 14%, 55%)" fontSize={11} />
            <YAxis stroke="hsl(215, 14%, 55%)" fontSize={12} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="total" radius={[6, 6, 0, 0]}>
              {categoryTotalData.map((d, i) => (
                <Cell key={i} fill={d.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category insights */}
      <div>
        <h3 className="font-semibold mb-3">Category Insights ({last.month} vs {prev.month})</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 stagger-in">
          {categoryTrends.map((ct) => (
            <div key={ct.category} className="bg-card border border-border rounded-xl p-4 card-hover">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{categoryLabels[ct.category]}</span>
                {ct.diff > 0 ? (
                  <span className="flex items-center gap-1 text-xs text-status-overdue"><ArrowUpRight className="h-3 w-3" />+₹{ct.diff}</span>
                ) : ct.diff < 0 ? (
                  <span className="flex items-center gap-1 text-xs text-primary"><ArrowDownRight className="h-3 w-3" />-₹{Math.abs(ct.diff)}</span>
                ) : (
                  <span className="text-xs text-muted-foreground">No change</span>
                )}
              </div>
              <p className="text-lg font-bold">₹{ct.current.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Previous: ₹{ct.previous.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Overall insights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 stagger-in">
        <InsightCard
          title="Monthly Change"
          value={`${diff > 0 ? "+" : ""}₹${diff.toLocaleString()} (${pct}%)`}
          icon={diff > 0 ? <TrendingUp className="h-5 w-5" /> : diff < 0 ? <TrendingDown className="h-5 w-5" /> : <Minus className="h-5 w-5" />}
          color={diff > 0 ? "text-status-overdue" : diff < 0 ? "text-primary" : "text-muted-foreground"}
          desc={`${last.month} vs ${prev.month}`}
        />
        <InsightCard
          title="6-Month Total"
          value={`₹${monthlyTotals.reduce((s, m) => s + m.total, 0).toLocaleString()}`}
          icon={<TrendingUp className="h-5 w-5" />}
          color="text-primary"
          desc="Combined utility spend"
        />
      </div>
    </div>
  );
};

const MiniStat = ({ label, value, sub }: { label: string; value: string; sub?: string }) => (
  <div className="bg-card border border-border rounded-xl p-4 card-hover">
    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
    <p className="text-lg font-bold">{value}</p>
    {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
  </div>
);

const InsightCard = ({ title, value, icon, color, desc }: { title: string; value: string; icon: React.ReactNode; color: string; desc: string }) => (
  <div className="bg-card border border-border rounded-xl p-5 card-hover">
    <div className={`flex items-center gap-2 mb-2 ${color}`}>
      {icon}
      <span className="text-sm font-medium text-muted-foreground">{title}</span>
    </div>
    <p className="text-lg font-bold">{value}</p>
    <p className="text-xs text-muted-foreground mt-1">{desc}</p>
  </div>
);

// Need to import Cell for BarChart
import { Cell } from "recharts";

export default Trends;
