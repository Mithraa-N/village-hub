import { useState, useEffect } from "react";
import { AppLayout } from "@/components/AppLayout";
import { formatCurrency } from "@/data/mockData";
import { Progress } from "@/components/ui/progress";
import { getAuthToken } from "@/lib/auth";
import {
  Loader2,
  TrendingUp,
  Wallet,
  Banknote,
  ShieldCheck,
  Plus,
  ArrowRight,
  PieChart,
  ArrowUpRight,
  History,
  Zap,
  ChevronRight,
  DollarSign,
  Terminal,
  Activity,
  Maximize2,
  Layers,
  Cpu,
  Globe,
  Clock
} from "lucide-react";
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
  const [formData, setFormData] = useState({ category: "", allocated: "", spent: "0", pending: "0", linkedActivity: "", fiscalYear: "" });

  const validateAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category || !formData.allocated || !formData.linkedActivity || !formData.fiscalYear) {
      toast.error("Packet Incomplete", {
        description: "Mandatory fields must be populated for ledger authorization."
      });
      return;
    }
    const allocNum = Number(formData.allocated);
    const spentNum = Number(formData.spent);
    const pendingNum = Number(formData.pending);

    if (isNaN(allocNum) || allocNum < 0) {
      toast.error("Format Error", { description: "Allocation must be a positive numerical primitive." });
      return;
    }
    if (isNaN(spentNum) || spentNum < 0) {
      toast.error("Format Error", { description: "Expenditure must be a positive numerical primitive." });
      return;
    }
    if (isNaN(pendingNum) || pendingNum < 0) {
      toast.error("Format Error", { description: "Pending allocation must be a positive numerical primitive." });
      return;
    }
    if ((spentNum + pendingNum) > allocNum) {
      toast.error("Security Halt", { description: "Expenditure overflow detected. Combined spent and pending cannot exceed allocated capacity." });
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
          pending: pendingNum,
          linkedActivity: formData.linkedActivity,
          fiscalYear: formData.fiscalYear
        })
      });
      if (response.ok) {
        toast.success("Authorization Synced.", {
          description: "Financial node successfully merged into the community ledger."
        });
        fetchBudgets();
        setIsDialogOpen(false);
        setFormData({ category: "", allocated: "", spent: "0", pending: "0", linkedActivity: "", fiscalYear: "" });
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Ledger Rejection");
      }
    } catch (err) {
      toast.error("Uplink Terminal Error");
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
        toast.error("Registry Fetch Failure");
      }
    } catch (err) {
      toast.error("Sync Synchronization Fault");
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
        <div className="h-[70vh] flex flex-col items-center justify-center gap-8">
          <div className="relative">
            <div className="h-20 w-20 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Banknote className="h-6 w-6 text-emerald-500 animate-pulse" />
            </div>
          </div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] animate-pulse">Accessing Secure Ledger...</span>
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
      <style>{`
            .capital-card {
                background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.7) 100%);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255,255,255,0.8);
                box-shadow: 0 10px 40px -10px rgba(0,0,0,0.05);
                transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
            }
            .capital-card:hover {
                transform: translateY(-8px) scale(1.02);
                box-shadow: 0 30px 60px -15px rgba(0,0,0,0.1);
                border-color: rgba(16, 185, 129, 0.3);
            }
            .glow-bar {
                box-shadow: 0 0 10px rgba(16, 185, 129, 0.4);
            }
        `}</style>

      {/* Kinetic Header */}
      <div className="mb-14 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 text-left relative">
        <div className="absolute -top-10 -left-10 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full -z-10"></div>

        <div className="space-y-6">
          <div className="flex flex-wrap gap-4">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 glass-soft">
              <Terminal className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none">Fiscal Hub v1.0.4</span>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-none">
              Community <span className="text-emerald-500">Capital.</span>
            </h1>
            <p className="text-slate-400 font-bold text-base max-w-xl italic">
              Cryptographically verified financial tracking and budgetary node allocation system.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-10 pr-6">
          <div className="flex flex-col items-end border-r pr-10 border-slate-100">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] leading-none mb-3">Cycle Load</span>
            <span className="text-4xl font-black text-emerald-500 tracking-tighter leading-none">
              {totalAllocated > 0 ? Math.round((totalSpent / totalAllocated) * 100) : 0}%
              <span className="text-xs text-slate-300 font-black uppercase ml-2 tracking-widest">Utilized</span>
            </span>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <button className="group h-16 pl-8 pr-10 bg-slate-950 text-white font-black text-[11px] uppercase tracking-[0.3em] rounded-[28px] hover:bg-emerald-500 hover:text-slate-950 shadow-2xl shadow-slate-950/20 transition-all flex items-center gap-4 active:scale-[0.98]">
                <div className="p-2 bg-emerald-500 group-hover:bg-slate-950 rounded-xl transition-colors">
                  <Plus size={20} className="text-slate-950 group-hover:text-emerald-500 transition-colors" />
                </div>
                Commit Funding
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl bg-white rounded-[48px] border-none shadow-2xl p-0 overflow-hidden text-left">
              <div className="bg-slate-950 p-12 text-white relative">
                <div className="absolute top-0 right-0 p-12 opacity-10">
                  <DollarSign size={140} />
                </div>
                <DialogHeader className="relative z-10">
                  <div className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] mb-4">Financial Authorization Required</div>
                  <DialogTitle className="text-5xl font-black uppercase tracking-tighter leading-[0.9]">Inject Capital <br /> Allocation.</DialogTitle>
                </DialogHeader>
              </div>

              <form onSubmit={validateAndSubmit} className="p-12 space-y-10">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Head ID *</label>
                    <input
                      required
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className="w-full h-16 px-8 bg-slate-50 border border-slate-100 rounded-[28px] text-[15px] font-bold text-slate-800 focus:border-emerald-500/50 focus:bg-white outline-none transition-all shadow-inner"
                      placeholder="e.g. INFRA-MAINT"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Fiscal Cycle *</label>
                    <input
                      required
                      value={formData.fiscalYear}
                      onChange={e => setFormData({ ...formData, fiscalYear: e.target.value })}
                      className="w-full h-16 px-6 bg-slate-50 border border-slate-100 rounded-[28px] text-[11px] font-black uppercase tracking-widest outline-none transition-all"
                      placeholder="e.g. 2025-26"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Community Node *</label>
                  <input
                    required
                    value={formData.linkedActivity}
                    onChange={e => setFormData({ ...formData, linkedActivity: e.target.value })}
                    className="w-full h-16 px-8 bg-slate-50 border border-slate-100 rounded-[28px] text-[15px] font-bold text-slate-800 outline-none transition-all shadow-inner"
                    placeholder="e.g. CORE PUMP RESTORATION"
                  />
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 text-left block">Initial Saturation *</label>
                    <div className="relative">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-500 text-sm font-black italic">₹</div>
                      <input
                        type="number"
                        required
                        value={formData.allocated}
                        onChange={e => setFormData({ ...formData, allocated: e.target.value })}
                        className="w-full h-16 pl-10 pr-4 bg-slate-50 border border-slate-100 rounded-[24px] text-[15px] font-black text-slate-800 transition-all outline-none focus:bg-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 text-left block">Immediate Drain</label>
                    <div className="relative">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-rose-500 text-sm font-black italic">₹</div>
                      <input
                        type="number"
                        value={formData.spent}
                        onChange={e => setFormData({ ...formData, spent: e.target.value })}
                        className="w-full h-16 pl-10 pr-4 bg-slate-50 border border-slate-100 rounded-[24px] text-[15px] font-black text-slate-800 transition-all outline-none focus:bg-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 text-left block">Pending Commit</label>
                    <div className="relative">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-amber-500 text-sm font-black italic">₹</div>
                      <input
                        type="number"
                        value={formData.pending}
                        onChange={e => setFormData({ ...formData, pending: e.target.value })}
                        className="w-full h-16 pl-10 pr-4 bg-slate-50 border border-slate-100 rounded-[24px] text-[15px] font-black text-slate-800 transition-all outline-none focus:bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-8 flex gap-6">
                  <button type="button" onClick={() => setIsDialogOpen(false)} className="h-16 px-10 bg-slate-50 text-slate-400 font-black text-[11px] uppercase tracking-widest rounded-[28px] border border-slate-100 hover:bg-slate-100 transition-all">Abort</button>
                  <button type="submit" className="flex-1 h-16 bg-emerald-500 text-slate-950 font-black text-[12px] uppercase tracking-[0.3em] rounded-[28px] hover:bg-emerald-400 shadow-2xl shadow-emerald-500/30 transition-all active:scale-[0.95]">
                    Authorize Commitment
                  </button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Global Capital Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        <MatrixCard label="Allocated Capital" value={totalAllocated} icon={<Wallet />} isCurrency />
        <MatrixCard label="Operational Drain" value={totalSpent} icon={<TrendingUp />} isCurrency variant="success" />
        <MatrixCard label="Pending Packets" value={totalPending} icon={<Clock />} isCurrency variant="danger" />
        <MatrixCard label="Liquid Buffer" value={totalRemaining} icon={<ShieldCheck />} isCurrency />
      </div>

      {/* Tactical Expenditure Node Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        {entries.map((entry, idx) => {
          const utilization = entry.allocated > 0 ? Math.round((entry.spent / entry.allocated) * 100) : 0;

          return (
            <div key={entry.id} className="capital-card p-10 flex flex-col group relative overflow-hidden text-left" style={{ transitionDelay: `${idx * 50}ms` }}>
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform">
                <PieChart size={100} />
              </div>

              <div className="flex items-start justify-between gap-6 mb-8 relative z-10">
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-2 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                    ID-{entry.id.split('-')[0].toUpperCase()}
                  </div>
                  <h3 className="text-xl font-black text-slate-950 uppercase tracking-tighter truncate group-hover:text-emerald-600 transition-colors">{entry.category}</h3>
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-2">{entry.linkedActivity}</p>
                </div>
                <div className="w-12 h-12 bg-slate-950 rounded-2xl flex items-center justify-center text-emerald-500 shadow-xl group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                  <Maximize2 size={16} />
                </div>
              </div>

              <div className="space-y-4 mb-10 relative z-10">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Saturation Level</span>
                  <span className={`text-[12px] font-black tracking-tight ${utilization > 85 ? 'text-rose-500' : 'text-emerald-500'}`}>{utilization}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner flex">
                  <div
                    className={`h-full transition-all duration-1000 glow-bar ${utilization > 85 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                    style={{ width: `${utilization}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 relative z-10 mt-auto">
                <div className="space-y-1.5">
                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] block">Allocated</span>
                  <span className="text-lg font-black text-slate-800 tracking-tighter">{formatCurrency(entry.allocated)}</span>
                </div>
                <div className="space-y-1.5 text-right">
                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] block">Liquid Buffer</span>
                  <span className="text-lg font-black text-emerald-500 tracking-tighter">{formatCurrency(entry.allocated - entry.spent - entry.pending)}</span>
                </div>
              </div>
            </div>
          );
        })}

        {entries.length === 0 && (
          <div className="col-span-full bg-white rounded-[60px] border border-dashed border-slate-200 p-40 text-center shadow-inner">
            <div className="relative mx-auto w-32 h-32 mb-10">
              <div className="absolute inset-0 bg-emerald-500/5 blur-3xl rounded-full"></div>
              <Banknote className="relative w-full h-full text-slate-100" />
            </div>
            <h4 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-4">Capital Ledger Empty</h4>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-[0.3em]">No financial allocation nodes detected.</p>
          </div>
        )}
      </div>

      {/* Unified Secure Ledger */}
      <div className="bg-white/90 backdrop-blur-2xl border border-white/50 rounded-[48px] overflow-hidden shadow-2xl shadow-emerald-500/5">
        <div className="p-12 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 text-left">
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase whitespace-nowrap">Unified Secure Ledger.</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              Audited Capital Trajectory Nodes
            </p>
          </div>
          <button className="group flex items-center gap-4 h-14 px-8 bg-slate-950 text-white rounded-[24px] text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-slate-950 transition-all shadow-xl">
            Export Audit Trace
            <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-10 py-6 text-left font-black text-slate-400 uppercase text-[10px] tracking-[0.3em]">Capital Node</th>
                <th className="px-10 py-6 text-right font-black text-slate-400 uppercase text-[10px] tracking-[0.3em]">Saturation</th>
                <th className="px-10 py-6 text-right font-black text-slate-400 uppercase text-[10px] tracking-[0.3em]">Drilled Drain</th>
                <th className="px-10 py-6 text-right font-black text-slate-400 uppercase text-[10px] tracking-[0.3em]">Liquid Buff</th>
                <th className="px-10 py-6 text-center font-black text-slate-400 uppercase text-[10px] tracking-[0.3em]">Trace Index</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {entries.map(entry => {
                const remaining = entry.allocated - entry.spent - entry.pending;
                const util = entry.allocated > 0 ? Math.round((entry.spent / entry.allocated) * 100) : 0;
                return (
                  <tr key={entry.id} className="group hover:bg-white transition-all text-left">
                    <td className="px-10 py-8">
                      <div className="font-black text-slate-950 text-base tracking-tight group-hover:text-emerald-500 transition-colors uppercase">{entry.category}</div>
                      <div className="text-[10px] text-slate-300 font-black uppercase tracking-widest mt-2">{entry.fiscalYear} • CYCLE-{entry.id.split('-')[0].toUpperCase()}</div>
                    </td>
                    <td className="px-10 py-8 text-right font-black text-slate-400 text-sm tracking-tighter">{formatCurrency(entry.allocated)}</td>
                    <td className="px-10 py-8 text-right font-black text-emerald-600 text-sm tracking-tighter">{formatCurrency(entry.spent)}</td>
                    <td className="px-10 py-8 text-right font-black text-slate-900 text-sm tracking-tighter">{formatCurrency(remaining)}</td>
                    <td className="px-10 py-8 text-center">
                      <div className={`inline-flex items-center gap-3 px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-inner border ${util > 85 ? 'bg-rose-50 text-rose-500 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${util > 85 ? 'bg-rose-500' : 'bg-emerald-500'} animate-pulse`}></div>
                        {util}% IN-PLAY
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-slate-950 text-white font-black overflow-hidden relative">
                <div className="absolute inset-0 bg-emerald-500/5 blur-3xl"></div>
                <td className="px-10 py-12 text-[12px] uppercase tracking-[0.4em] relative z-10">Consolidated Hub Liquid</td>
                <td className="px-10 py-12 text-right text-sm tracking-widest opacity-40 relative z-10">{formatCurrency(totalAllocated)}</td>
                <td className="px-10 py-12 text-right text-sm tracking-widest text-emerald-400 relative z-10">{formatCurrency(totalSpent)}</td>
                <td className="px-10 py-12 text-right text-sm tracking-widest relative z-10">{formatCurrency(totalRemaining)}</td>
                <td className="px-10 py-12 text-center text-[10px] tracking-[0.2em] relative z-10">
                  <div className="flex items-center justify-center gap-4">
                    <Activity size={18} className="text-emerald-400 animate-pulse" />
                    {totalAllocated > 0 ? Math.round((totalSpent / totalAllocated) * 100) : 0}% OVERALL FLOW
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <footer className="mt-24 pt-12 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-8">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Integrated Capital OS • Financial Trace Active</p>
        <div className="flex gap-12">
          <button className="text-[9px] font-black text-slate-400 hover:text-emerald-500 uppercase tracking-widest transition-colors">Capital Packet Docs</button>
          <button className="text-[9px] font-black text-slate-400 hover:text-emerald-500 uppercase tracking-widest transition-colors">Ledger Health</button>
          <button className="text-[9px] font-black text-slate-400 hover:text-emerald-500 uppercase tracking-widest transition-colors">Audit Export</button>
        </div>
      </footer>
    </AppLayout>
  );
};

function MatrixCard({ label, value, icon, variant, isCurrency }: { label: string; value: string | number; icon: React.ReactNode; variant?: 'success' | 'danger'; isCurrency?: boolean }) {
  const variants = {
    success: 'text-emerald-500 border-emerald-50 bg-emerald-50/10',
    danger: 'text-rose-500 border-rose-50 bg-rose-50/10 animate-pulse',
    default: 'text-slate-300 border-slate-100 bg-white'
  };

  return (
    <div className={`p-10 rounded-[48px] border ${variants[variant || 'default']} shadow-sm group hover:scale-105 transition-all text-left`}>
      <div className="flex justify-between items-start mb-8">
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner text-slate-300 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all">
          {icon}
        </div>
      </div>
      <div className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 text-slate-300">{label}</div>
      <div className={`text-3xl font-black tracking-tighter ${variant === 'success' ? 'text-emerald-600' : 'text-slate-950'}`}>
        {isCurrency ? formatCurrency(value as number) : value}
      </div>
    </div>
  );
}

export default Budget;
