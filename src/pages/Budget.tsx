import { useState, useEffect } from "react";
import { AppLayout } from "@/components/AppLayout";
import { formatCurrency } from "@/data/mockData";
import { Progress } from "@/components/ui/progress";
import { getAuthToken } from "@/lib/auth";
import { Loader2, TrendingUp, Wallet, Banknote, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface BudgetEntry {
  id: string;
  category: string;
  allocated: number;
  spent: number;
  pending: number;
  linkedActivity: string;
  fiscalYear: string;
}

const Budget = () => {
  const [entries, setEntries] = useState<BudgetEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ category: "", allocated: "", spent: "0", linkedActivity: "", fiscalYear: "" });

  const validateAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category || !formData.allocated || !formData.linkedActivity || !formData.fiscalYear) {
      toast.error("Validation Error: Mandatory fields (Category, Allocation, Activity, Fiscal Year) cannot be empty.");
      return;
    }
    const allocNum = Number(formData.allocated);
    const spentNum = Number(formData.spent);
    if (isNaN(allocNum) || allocNum < 0) {
      toast.error("Validation Error: Allocation must be a valid positive number.");
      return;
    }
    if (isNaN(spentNum) || spentNum < 0) {
      toast.error("Validation Error: Spent amount must be a valid positive number.");
      return;
    }
    if (spentNum > allocNum) {
      toast.error("Regulatory Violation: Budget spent must never exceed budget allocated.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/v1/budgets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({
          category: formData.category,
          allocated: allocNum,
          spent: spentNum,
          linkedActivity: formData.linkedActivity,
          fiscalYear: formData.fiscalYear
        })
      });
      if (response.ok) {
        toast.success("Budget entry securely allocated");
        fetchBudgets();
        setIsDialogOpen(false);
        setFormData({ category: "", allocated: "", spent: "0", linkedActivity: "", fiscalYear: "" });
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Server rejected submission");
      }
    } catch (err) {
      toast.error("Network communication failure");
    }
  };

  const fetchBudgets = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/v1/budgets", {
        headers: {
          "Authorization": `Bearer ${getAuthToken()}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setEntries(data);
      } else {
        toast.error("Failed to fetch official budget allocation records");
      }
    } catch (err) {
      toast.error("Network synchronization failure");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="h-[80vh] flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  const totalAllocated = entries.reduce((s, b) => s + b.allocated, 0);
  const totalSpent = entries.reduce((s, b) => s + b.spent, 0);
  const totalPending = entries.reduce((s, b) => s + b.pending, 0);
  const totalRemaining = totalAllocated - totalSpent - totalPending;

  return (
    <AppLayout>
      <div className="page-header border-b pb-6 mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Banknote className="h-6 w-6 text-primary" />
            Budgetary Allocation & Funds
          </h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">Village & Panchayat Financial Oversight · FY 2025-26</p>
        </div>
        <div className="flex gap-4">
          <div className="text-right border-r pr-4 border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Total Utilization</span>
            <span className="text-lg font-bold text-primary">{Math.round((totalSpent / totalAllocated) * 100)}%</span>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <button className="h-10 px-6 bg-primary text-white font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-[#1a3d2e] shadow-sm transition-all border-b-2 border-[#0e221a]">
                New Allocation
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold uppercase tracking-tight text-slate-800">Record Allocation</DialogTitle>
              </DialogHeader>
              <form onSubmit={validateAndSubmit} className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Head of Account / Category *</label>
                  <input type="text" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full h-10 px-3 border border-slate-200 rounded-sm text-sm outline-none focus:border-primary" placeholder="e.g. Infrastructure, Health" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Linked Activity *</label>
                  <input type="text" value={formData.linkedActivity} onChange={e => setFormData({ ...formData, linkedActivity: e.target.value })} className="w-full h-10 px-3 border border-slate-200 rounded-sm text-sm outline-none focus:border-primary" placeholder="e.g. School Repair" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Allocated Amount *</label>
                    <input type="number" min="0" value={formData.allocated} onChange={e => setFormData({ ...formData, allocated: e.target.value })} className="w-full h-10 px-3 border border-slate-200 rounded-sm text-sm outline-none focus:border-primary" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Already Spent</label>
                    <input type="number" min="0" value={formData.spent} onChange={e => setFormData({ ...formData, spent: e.target.value })} className="w-full h-10 px-3 border border-slate-200 rounded-sm text-sm outline-none focus:border-primary" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Fiscal Year *</label>
                  <input type="text" value={formData.fiscalYear} onChange={e => setFormData({ ...formData, fiscalYear: e.target.value })} className="w-full h-10 px-3 border border-slate-200 rounded-sm text-sm outline-none focus:border-primary" placeholder="e.g. 2025-26" />
                </div>
                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button type="submit" className="h-10 px-6 bg-primary text-white font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-[#1a3d2e] transition-all">
                    Authorize Entry
                  </button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <BudgetStatCard
          icon={<Wallet className="h-5 w-5" />}
          label="Total Allocated"
          value={formatCurrency(totalAllocated)}
        />
        <BudgetStatCard
          icon={<TrendingUp className="h-5 w-5" />}
          label="Actual Expenditure"
          value={formatCurrency(totalSpent)}
        />
        <BudgetStatCard
          icon={<ClockIcon className="h-5 w-5" />}
          label="Pending Clearance"
          value={formatCurrency(totalPending)}
        />
        <BudgetStatCard
          icon={<ShieldCheck className="h-5 w-5" />}
          label="Available Balance"
          value={formatCurrency(totalRemaining)}
        />
      </div>

      {/* Breakdown Grid */}
      <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Departmental Utilization Breakdown</h2>
      <div className="grid lg:grid-cols-2 gap-4 mb-10">
        {entries.map(entry => {
          const utilization = Math.round((entry.spent / entry.allocated) * 100);

          return (
            <div key={entry.id} className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm">
              <div className="flex items-start justify-between mb-3 border-b border-slate-50 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">{entry.category}</h3>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">{entry.linkedActivity}</p>
                </div>
                <span className="font-bold text-[9px] bg-secondary px-2 py-0.5 rounded-sm text-slate-500 border border-slate-200">ID: {entry.id.split('-')[0]}</span>
              </div>

              <div className="space-y-1.5 mb-4">
                <div className="flex justify-between text-[9px] font-bold uppercase text-slate-500">
                  <span>Current Utilization</span>
                  <span>{utilization}%</span>
                </div>
                <Progress value={utilization} className="h-1.5 bg-slate-100" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-secondary/30 p-2 rounded-sm border border-slate-100">
                  <div className="text-[8px] font-bold text-slate-400 uppercase">Allocated</div>
                  <div className="text-xs font-bold text-slate-800">{formatCurrency(entry.allocated)}</div>
                </div>
                <div className="bg-slate-50 p-2 rounded-sm border border-slate-100">
                  <div className="text-[8px] font-bold text-slate-400 uppercase">Spent</div>
                  <div className="text-xs font-bold text-primary">{formatCurrency(entry.spent)}</div>
                </div>
                <div className="bg-white p-2 rounded-sm border border-slate-100">
                  <div className="text-[8px] font-bold text-slate-400 uppercase">Pending</div>
                  <div className="text-xs font-bold text-warning">{formatCurrency(entry.pending)}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Table */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-l-4 border-primary pl-3">Official Budget Ledger</h2>
        <div className="bg-white border border-slate-200 rounded-sm overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary/50 border-b-2">
                <th className="text-left px-5 py-4 font-bold text-slate-600 uppercase text-[10px]">Head of Account</th>
                <th className="text-right px-5 py-4 font-bold text-slate-600 uppercase text-[10px]">Allocation</th>
                <th className="text-right px-5 py-4 font-bold text-slate-600 uppercase text-[10px]">Expenditure</th>
                <th className="text-right px-5 py-4 font-bold text-slate-600 uppercase text-[10px]">Pending</th>
                <th className="text-right px-5 py-4 font-bold text-slate-600 uppercase text-[10px]">Balance</th>
                <th className="text-center px-5 py-4 font-bold text-slate-600 uppercase text-[10px]">Util.%</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {entries.map(entry => {
                const remaining = entry.allocated - entry.spent - entry.pending;
                const util = Math.round((entry.spent / entry.allocated) * 100);
                return (
                  <tr key={entry.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-bold text-slate-800 text-xs">{entry.category}</div>
                      <div className="text-[9px] text-slate-400 font-bold uppercase">{entry.fiscalYear}</div>
                    </td>
                    <td className="px-5 py-4 text-right font-bold text-slate-700 text-xs">{formatCurrency(entry.allocated)}</td>
                    <td className="px-5 py-4 text-right font-bold text-primary text-xs">{formatCurrency(entry.spent)}</td>
                    <td className="px-5 py-4 text-right font-bold text-[#b45309] text-xs">{formatCurrency(entry.pending)}</td>
                    <td className="px-5 py-4 text-right font-bold text-slate-900 text-xs">{formatCurrency(remaining)}</td>
                    <td className="px-5 py-4 text-center">
                      <span className={`px-2 py-0.5 rounded-sm text-[9px] font-bold ${util > 85 ? 'bg-destructive text-white' : 'bg-success text-white'}`}>
                        {util}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-primary text-white font-bold">
                <td className="px-5 py-4 text-[10px] uppercase tracking-widest">Village Consolidated Fund</td>
                <td className="px-5 py-4 text-right text-xs">{formatCurrency(totalAllocated)}</td>
                <td className="px-5 py-4 text-right text-xs">{formatCurrency(totalSpent)}</td>
                <td className="px-5 py-4 text-right text-xs">{formatCurrency(totalPending)}</td>
                <td className="px-5 py-4 text-right text-xs">{formatCurrency(totalRemaining)}</td>
                <td className="px-5 py-4 text-center text-xs">{Math.round((totalSpent / totalAllocated) * 100)}%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </AppLayout>
  );
};

function BudgetStatCard({ icon, label, value }: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm transition-all">
      <div className="flex items-center gap-3 mb-2">
        <div className="text-primary">{icon}</div>
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>
      </div>
      <div className="text-2xl font-bold tracking-tight text-slate-800">{value}</div>
    </div>
  );
}

const ClockIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
);

export default Budget;
