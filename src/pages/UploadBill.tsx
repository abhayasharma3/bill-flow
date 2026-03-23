import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, FileText } from "lucide-react";
import { toast } from "sonner";
import { categoryLabels, categoryEmojis, type BillCategory } from "@/data/bills";

const UploadBill = () => {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<BillCategory>("electricity");
  const [billDate, setBillDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [desc, setDesc] = useState("");
  const [provider, setProvider] = useState("");
  const [accountNo, setAccountNo] = useState("");

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Bill uploaded successfully!");
    setFile(null);
    setAmount("");
    setDesc("");
    setProvider("");
    setAccountNo("");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 fade-up">
      <div>
        <h2 className="text-xl font-bold mb-1">Upload Bill</h2>
        <p className="text-sm text-muted-foreground">Upload your utility bill document and fill in details</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* File upload */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById("file-input")?.click()}
          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-300 ${
            dragOver ? "border-primary bg-primary/5 glow-sm" : "border-border hover:border-primary/50 hover:bg-secondary/30"
          }`}
        >
          <input id="file-input" type="file" accept=".pdf,.png,.jpg,.jpeg" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          {file ? (
            <div className="flex items-center justify-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              <span className="text-sm font-medium">{file.name}</span>
            </div>
          ) : (
            <>
              <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">Drag & drop or click to upload</p>
              <p className="text-xs text-muted-foreground mt-1">PDF, PNG, JPG up to 10MB</p>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Amount (₹)</label>
            <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="2340" required className="bg-secondary border-border focus:border-primary" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value as BillCategory)} className="w-full h-10 rounded-md bg-secondary border border-border px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring transition-colors">
              {(Object.keys(categoryLabels) as BillCategory[]).map(cat => (
                <option key={cat} value={cat}>{categoryEmojis[cat]} {categoryLabels[cat]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Provider</label>
            <Input value={provider} onChange={(e) => setProvider(e.target.value)} placeholder="Tata Power" className="bg-secondary border-border focus:border-primary" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Account Number</label>
            <Input value={accountNo} onChange={(e) => setAccountNo(e.target.value)} placeholder="TP-9283746" className="bg-secondary border-border focus:border-primary" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Bill Date</label>
            <Input type="date" value={billDate} onChange={(e) => setBillDate(e.target.value)} required className="bg-secondary border-border focus:border-primary" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Due Date</label>
            <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required className="bg-secondary border-border focus:border-primary" />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-1.5 block">Description</label>
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Monthly electricity bill…" rows={3} className="w-full rounded-md bg-secondary border border-border px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring transition-colors resize-none" />
        </div>

        <Button type="submit" className="w-full h-11 font-semibold hover:scale-[1.02]">
          <Upload className="h-4 w-4 mr-2" /> Upload & Save
        </Button>
      </form>
    </div>
  );
};

export default UploadBill;
