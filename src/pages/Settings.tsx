import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Bell, Palette, Shield, Save } from "lucide-react";
import { toast } from "sonner";
import { budgetLimits, categoryLabels, type BillCategory } from "@/data/bills";

const Settings = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [notifications, setNotifications] = useState({
    dueDateReminder: true,
    overdueAlert: true,
    paymentConfirmation: true,
    monthlyReport: false,
    budgetWarning: true,
  });

  const handleSaveProfile = () => {
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 fade-up">
      <div>
        <h2 className="text-xl font-bold mb-1">Settings</h2>
        <p className="text-sm text-muted-foreground">Manage your profile, preferences & notifications</p>
      </div>

      {/* Profile Section */}
      <div className="bg-card border border-border rounded-xl p-6 card-hover">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded-lg bg-primary/10 text-primary"><User className="h-5 w-5" /></div>
          <h3 className="font-semibold">Profile Information</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Full Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} className="bg-secondary border-border focus:border-primary" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Email</label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="bg-secondary border-border focus:border-primary" />
          </div>
        </div>
        <div className="flex items-center gap-4 mb-4">
          <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center text-primary text-2xl font-bold">
            {name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <p className="text-sm font-medium">{name || "User"}</p>
            <p className="text-xs text-muted-foreground">{email}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Member since March 2026</p>
          </div>
        </div>
        <Button onClick={handleSaveProfile} className="hover:scale-[1.02]">
          <Save className="h-4 w-4 mr-2" /> Save Changes
        </Button>
      </div>

      {/* Notification Preferences */}
      <div className="bg-card border border-border rounded-xl p-6 card-hover">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded-lg bg-accent/10 text-accent"><Bell className="h-5 w-5" /></div>
          <h3 className="font-semibold">Notification Preferences</h3>
        </div>
        <div className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border hover:border-primary/20 transition-colors">
              <div>
                <p className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</p>
                <p className="text-xs text-muted-foreground">
                  {key === "dueDateReminder" && "Get notified 3 days before due date"}
                  {key === "overdueAlert" && "Alert when a bill becomes overdue"}
                  {key === "paymentConfirmation" && "Confirm when a bill is marked paid"}
                  {key === "monthlyReport" && "Monthly spend summary via email"}
                  {key === "budgetWarning" && "Alert when spending nears budget limit"}
                </p>
              </div>
              <button
                onClick={() => setNotifications(n => ({ ...n, [key]: !value }))}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${value ? "bg-primary" : "bg-secondary border border-border"}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200 ${value ? "translate-x-5" : ""}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Budget Limits */}
      <div className="bg-card border border-border rounded-xl p-6 card-hover">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded-lg bg-primary/10 text-primary"><Shield className="h-5 w-5" /></div>
          <h3 className="font-semibold">Monthly Budget Limits</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {budgetLimits.map((bl) => (
            <div key={bl.category} className="bg-secondary/50 border border-border rounded-lg p-4 hover:border-primary/20 transition-colors">
              <label className="text-sm font-medium mb-1.5 block">{categoryLabels[bl.category]}</label>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-sm">₹</span>
                <Input defaultValue={bl.monthlyLimit} type="number" className="bg-secondary border-border focus:border-primary h-9" />
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">Current: ₹{bl.currentSpend.toLocaleString()}</p>
            </div>
          ))}
        </div>
        <Button className="mt-4 hover:scale-[1.02]" onClick={() => toast.success("Budget limits saved!")}>
          <Save className="h-4 w-4 mr-2" /> Save Budgets
        </Button>
      </div>

      {/* App Info */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-secondary"><Palette className="h-5 w-5 text-muted-foreground" /></div>
          <h3 className="font-semibold">About</h3>
        </div>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>Bill Manager v1.0.0</p>
          <p>Home Utility Bill Management System</p>
          <p>Built with React + Tailwind CSS + Recharts</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
