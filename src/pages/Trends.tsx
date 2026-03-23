import { monthlyTotals, categoryColors } from "@/data/bills";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

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

  const elecTrend = last.electricity - prev.electricity;

  return (
    <div className="space-y-6 fade-up">
      <div>
        <h2 className="text-xl font-bold mb-1">Trend Analysis</h2>
        <p className="text-sm text-muted-foreground">Bills over the last 6 months</p>
      </div>

      {/* Overall trend chart */}
      <div className="bg-card border border-border rounded-xl p-5 card-hover">
        <h3 className="font-semibold mb-4">Overall Monthly Total</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyTotals}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 20%)" />
            <XAxis dataKey="month" stroke="hsl(215, 14%, 55%)" fontSize={12} />
            <YAxis stroke="hsl(215, 14%, 55%)" fontSize={12} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line type="monotone" dataKey="total" stroke="hsl(142, 60%, 45%)" strokeWidth={2.5} dot={{ fill: "hsl(142, 60%, 45%)", r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
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
            <Line type="monotone" dataKey="electricity" stroke={categoryColors.electricity} strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="water" stroke={categoryColors.water} strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="internet" stroke={categoryColors.internet} strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 stagger-in">
        <InsightCard
          title="Monthly Change"
          value={`${diff > 0 ? "+" : ""}₹${diff.toLocaleString()} (${pct}%)`}
          icon={diff > 0 ? <TrendingUp className="h-5 w-5" /> : diff < 0 ? <TrendingDown className="h-5 w-5" /> : <Minus className="h-5 w-5" />}
          color={diff > 0 ? "destructive" : diff < 0 ? "primary" : "muted-foreground"}
          desc={`${last.month} vs ${prev.month}`}
        />
        <InsightCard
          title="Electricity Trend"
          value={elecTrend > 0 ? "Increasing 📈" : elecTrend < 0 ? "Decreasing 📉" : "Stable"}
          icon={<TrendingUp className="h-5 w-5" />}
          color={elecTrend > 0 ? "destructive" : "primary"}
          desc={`₹${prev.electricity} → ₹${last.electricity}`}
        />
      </div>
    </div>
  );
};

const InsightCard = ({ title, value, icon, color, desc }: { title: string; value: string; icon: React.ReactNode; color: string; desc: string }) => (
  <div className="bg-card border border-border rounded-xl p-5 card-hover">
    <div className={`flex items-center gap-2 mb-2 text-${color}`}>
      {icon}
      <span className="text-sm font-medium text-muted-foreground">{title}</span>
    </div>
    <p className="text-lg font-bold">{value}</p>
    <p className="text-xs text-muted-foreground mt-1">{desc}</p>
  </div>
);

export default Trends;
