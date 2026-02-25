import { useState, useEffect } from "react";
import { AppLayout } from "@/components/AppLayout";
import { formatCurrency } from "@/data/mockData";
import { Progress } from "@/components/ui/progress";
import { getAuthToken } from "@/lib/auth";
import { Loader2, TrendingUp, Wallet, Banknote, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

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
        toast.error("Failed to load budget data");
      }
    } catch (err) {
      toast.error("Network error on budget page");
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
      <div className="page-header">
        <h1>Budget Tracking</h1>
        <p>Category-level budget allocation and expenditure · FY 2025-26</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <BudgetStatCard
          icon={<Wallet className="h-5 w-5 text-blue-500" />}
          label="Total Allocated"
          value={formatCurrency(totalAllocated)}
          color="border-blue-500/20"
        />
        <BudgetStatCard
          icon={<TrendingUp className="h-5 w-5 text-green-600" />}
          label="Actual Spent"
          value={formatCurrency(totalSpent)}
          color="border-green-600/20"
        />
        <BudgetStatCard
          icon={<Clock className="h-5 w-5 text-orange-500" />}
          label="Pending Approval"
          value={formatCurrency(totalPending)}
          color="border-orange-500/20"
        />
        <BudgetStatCard
          icon={<ShieldCheck className="h-5 w-5 text-primary" />}
          label="Remaining Fund"
          value={formatCurrency(totalRemaining)}
          color="border-primary/20"
        />
      </div>

      {/* Budget Breakdown */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {entries.map(entry => {
          const utilization = Math.round((entry.spent / entry.allocated) * 100);
          const pendingPercent = Math.round((entry.pending / entry.allocated) * 100);

          return (
            <div key={entry.id} className="bg-card border-2 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{entry.category}</h3>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{entry.linkedActivity}</p>
                </div>
                <span className="font-mono text-[9px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">{entry.id.split('-')[0]}</span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-[10px] font-bold uppercase text-slate-500">
                  <span>Utilization</span>
                  <span>{utilization}%</span>
                </div>
                <Progress value={utilization} className="h-2" />
              </div>

              <div className="grid grid-cols-3 gap-2 py-3 border-t-2 border-slate-50">
                <div className="text-center">
                  <div className="text-[9px] font-bold text-slate-400 uppercase mb-0.5">Allocated</div>
                  <div className="text-xs font-bold text-slate-800">{formatCurrency(entry.allocated)}</div>
                </div>
                <div className="text-center border-x-2 border-slate-50">
                  <div className="text-[9px] font-bold text-slate-400 uppercase mb-0.5">Spent</div>
                  <div className="text-xs font-bold text-green-600">{formatCurrency(entry.spent)}</div>
                </div>
                <div className="text-center">
                  <div className="text-[9px] font-bold text-slate-400 uppercase mb-0.5">Pending</div>
                  <div className="text-xs font-bold text-orange-500">{formatCurrency(entry.pending)}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Table */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Banknote className="h-5 w-5 text-primary" />
          Detailed Budget Ledger
        </h2>
        <div className="bg-card border-2 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 bg-slate-50">
                <th className="text-left px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Category</th>
                <th className="text-right px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Allocated</th>
                <th className="text-right px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Spent</th>
                <th className="text-right px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Pending</th>
                <th className="text-right px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Balance</th>
                <th className="text-center px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Util.</th>
              </tr>
            </thead>
            <tbody className="divide-y-2">
              {entries.map(entry => {
                const remaining = entry.allocated - entry.spent - entry.pending;
                const util = Math.round((entry.spent / entry.allocated) * 100);
                return (
                  <tr key={entry.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-800">{entry.category}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{entry.fiscalYear}</div>
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-700">{formatCurrency(entry.allocated)}</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-green-600">{formatCurrency(entry.spent)}</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-orange-500">{formatCurrency(entry.pending)}</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">{formatCurrency(remaining)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${util > 80 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {util}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-slate-900 text-white font-bold">
                <td className="px-4 py-4 text-sm uppercase">Total Village Fund</td>
                <td className="px-4 py-4 text-right font-mono">{formatCurrency(totalAllocated)}</td>
                <td className="px-4 py-4 text-right font-mono text-green-400">{formatCurrency(totalSpent)}</td>
                <td className="px-4 py-4 text-right font-mono text-orange-400">{formatCurrency(totalPending)}</td>
                <td className="px-4 py-4 text-right font-mono">{formatCurrency(totalRemaining)}</td>
                <td className="px-4 py-4 text-center">{Math.round((totalSpent / totalAllocated) * 100)}%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </AppLayout>
  );
};

function BudgetStatCard({ icon, label, value, color }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className={`bg-card border-2 ${color} rounded-2xl p-5 shadow-sm hover:shadow-md transition-all`}>
      <div className="flex items-center gap-2 mb-3">
        <div className="p-2 rounded-lg bg-white shadow-sm border">{icon}</div>
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>
      </div>
      <div className="text-2xl font-bold tracking-tight text-slate-900">{value}</div>
    </div>
  );
}

const Clock = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
);

export default Budget;

