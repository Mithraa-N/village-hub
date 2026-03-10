import { useState, useEffect } from "react";
import { AppLayout } from "@/components/AppLayout";
import { getComplaintStatusClass, type ComplaintStatus } from "@/data/mockData";
import {
  Search,
  Filter,
  MoreVertical,
  Loader2,
  MessageSquareWarning,
  Plus,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronRight,
  Layers,
  Activity,
  User,
  ClipboardCheck,
  Terminal,
  Zap,
  Maximize2,
  Lock,
  Target
} from "lucide-react";
import { getUser, getAuthToken } from "@/lib/auth";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Complaint {
  id: string;
  title: string;
  description: string;
  status: string;
  category: string;
  submittedBy: string;
  assignedTo: string | null;
  submittedDate: string;
  ward: string;
  asset?: {
    id: string;
    name: string;
  };
}

const statuses: ComplaintStatus[] = ["Submitted", "Assigned", "In Progress", "Resolved", "Closed"];

const Complaints = () => {
  const user = getUser();
  const canManage = user?.role === "ADMIN" || user?.role === "OPERATOR";

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [updateStatus, setUpdateStatus] = useState<string>("In Progress");
  const [closingRemark, setClosingRemark] = useState("");

  const [isNewEntryOpen, setIsNewEntryOpen] = useState(false);
  const [newEntryData, setNewEntryData] = useState({ title: "", description: "", priority: "Medium", category: "Infrastructure" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("http://localhost:5000/api/v1/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${getAuthToken()}` },
        body: JSON.stringify(newEntryData)
      });
      if (response.ok) {
        toast.success("Identity Insight Injected.", {
          description: "New grievance data has been securely committed to the kinetic pipeline."
        });
        fetchComplaints();
        setIsNewEntryOpen(false);
        setNewEntryData({ title: "", description: "", priority: "Medium", category: "Infrastructure" });
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Uplink Denial");
      }
    } catch {
      toast.error("Hub Sync Timeout", { description: "Encryption handshake failed during injection." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    if (["Closed", "Resolved"].includes(updateStatus)) {
      if (!closingRemark || closingRemark.trim() === "") {
        toast.error("Trace Audit Failure", {
          description: "A cryptographic closing remark is mandatory for cycle termination."
        });
        return;
      }
    }

    try {
      const response = await fetch(`http://localhost:5000/api/v1/complaints/${selectedComplaint.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({
          status: updateStatus,
          closingRemark: closingRemark
        })
      });

      if (response.ok) {
        toast.success("Nexus State Synced.", {
          description: `Grievance node ${selectedComplaint.id.split('-')[0]} transitioned to ${updateStatus}.`
        });
        fetchComplaints();
        setSelectedComplaint(null);
        setClosingRemark("");
      } else {
        const err = await response.json();
        toast.error(err.message || "Command Override Denied");
      }
    } catch {
      toast.error("Multiplexer Error", { description: "Signal lost during state transition." });
    }
  };

  const fetchComplaints = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/v1/complaints", {
        headers: {
          "Authorization": `Bearer ${getAuthToken()}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setComplaints(data);
      } else {
        toast.error("Pipeline Sync Failure");
      }
    } catch (err) {
      toast.error("Terminal Offline");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const filtered = complaints.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.submittedBy.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const pipeline = statuses.map(s => ({
    status: s,
    count: complaints.filter(c => c.status === s).length,
  }));

  if (isLoading) {
    return (
      <AppLayout>
        <div className="h-[70vh] flex flex-col items-center justify-center gap-8">
          <div className="relative">
            <div className="h-20 w-20 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Layers className="h-6 w-6 text-emerald-500 animate-pulse" />
            </div>
          </div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] animate-pulse">Scanning Insight Pipeline...</span>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <style>{`
            .node-card {
                background: linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 100%);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255,255,255,0.8);
                transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
            }
            .node-card:hover {
                transform: translateY(-5px) scale(1.01);
                box-shadow: 0 40px 80px -20px rgba(0,0,0,0.08);
                border-color: rgba(16, 185, 129, 0.3);
            }
            .status-indicator {
                box-shadow: 0 0 15px currentColor;
            }
        `}</style>

      {/* Kinetic Header */}
      <div className="mb-14 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 text-left relative">
        <div className="absolute -top-10 -left-10 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full -z-10"></div>

        <div className="space-y-6">
          <div className="flex flex-wrap gap-4">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 glass-soft">
              <Terminal className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none">Insight Flux Active</span>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-none">
              Grievance <span className="text-emerald-500">Flux.</span>
            </h1>
            <p className="text-slate-400 font-bold text-base max-w-xl italic">
              Real-time monitoring and cryptographic processing of citizen-origin infrastructure feedback nodes.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-8 pr-4">
          <div className="flex flex-col items-end border-r pr-8 border-slate-100">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] leading-none mb-3">Pipeline Status</span>
            <span className="text-4xl font-black text-emerald-500 tracking-tighter leading-none">
              {complaints.filter(c => c.status !== 'Closed').length}
              <span className="text-xs text-slate-300 font-black uppercase ml-2 tracking-widest">Active</span>
            </span>
          </div>
          <button
            onClick={() => setIsNewEntryOpen(true)}
            className="group h-16 pl-8 pr-10 bg-slate-950 text-white font-black text-[11px] uppercase tracking-[0.3em] rounded-[28px] hover:bg-emerald-500 hover:text-slate-950 shadow-2xl shadow-slate-950/20 transition-all flex items-center gap-4 active:scale-[0.98]"
          >
            <div className="p-2 bg-emerald-500 group-hover:bg-slate-950 rounded-xl transition-colors">
              <Plus size={20} className="text-slate-950 group-hover:text-emerald-500 transition-colors" />
            </div>
            Inject Feedback
          </button>
        </div>
      </div>

      {/* Modern High-Performance Controls */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/50 p-4 rounded-[40px] mb-12 shadow-2xl shadow-emerald-500/5 group">
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <div className="flex-1 w-full relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-hover:text-emerald-500 transition-colors" />
            <input
              type="text"
              placeholder="Query node identifier, payload content, or origin..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full h-16 pl-16 pr-8 bg-slate-50/50 border border-transparent rounded-[28px] text-[15px] font-bold text-slate-800 placeholder:text-slate-300 outline-none focus:bg-white focus:border-emerald-500/30 transition-all"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {pipeline.map(p => (
              <button
                key={p.status}
                onClick={() => setStatusFilter(statusFilter === p.status ? "All" : p.status)}
                className={`
                    flex items-center gap-3 h-14 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all
                    ${statusFilter === p.status
                    ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-xl shadow-emerald-500/20"
                    : "bg-white border-slate-100 hover:bg-slate-50 text-slate-400"}
                    `}
              >
                <span>{p.status}</span>
                <span className={`flex items-center justify-center w-7 h-7 rounded-lg text-[9px] ${statusFilter === p.status ? 'bg-slate-950/10' : 'bg-slate-50 text-slate-300'}`}>{p.count}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Kinetic Data Stream */}
      <div className="grid grid-cols-1 gap-6">
        {filtered.map((c, i) => (
          <div
            key={c.id}
            className="node-card p-10 flex flex-col lg:flex-row items-center gap-10 group relative overflow-hidden text-left"
            style={{ transitionDelay: `${i * 50}ms` }}
          >
            <div className="absolute top-0 right-0 p-10 opacity-[0.03] rotate-12 flex shrink-0">
              <MessageSquareWarning size={150} />
            </div>

            <div className="flex-1 w-full space-y-4">
              <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full status-indicator ${getComplaintStatusClass(c.status as ComplaintStatus).split(' ')[1]}`}></div>
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">SYNC-{c.id.split('-')[0].toUpperCase()}</span>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-100"></div>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{c.category} Node</span>
              </div>

              <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase group-hover:text-emerald-600 transition-colors leading-tight">{c.title}</h3>
              <p className="text-slate-400 text-sm font-semibold italic line-clamp-2 max-w-3xl leading-relaxed">
                &gt; {c.description}
              </p>
            </div>

            <div className="flex flex-wrap lg:flex-nowrap items-center gap-10 w-full lg:w-auto">
              <div className="flex items-center gap-5 border-r border-slate-100 pr-10">
                <div className="w-12 h-12 rounded-2xl bg-slate-950 flex items-center justify-center text-white shadow-xl">
                  <User size={20} />
                </div>
                <div>
                  <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Origin Node</div>
                  <div className="text-xs font-black text-slate-800 uppercase tracking-tight">{c.submittedBy}</div>
                </div>
              </div>

              <div className="flex-1 lg:flex-none text-center">
                <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-2">Operational State</div>
                <span className={`inline-flex items-center px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${getComplaintStatusClass(c.status as ComplaintStatus)}`}>
                  {c.status}
                </span>
              </div>

              <div className="flex items-center gap-4">
                {canManage ? (
                  <button
                    onClick={() => { setSelectedComplaint(c); setUpdateStatus(c.status); setClosingRemark(""); }}
                    className="w-16 h-16 bg-slate-50 text-slate-300 hover:bg-slate-950 hover:text-emerald-500 border border-slate-100 hover:border-slate-950 transition-all rounded-[24px] flex items-center justify-center active:scale-90"
                    title="Open Command Node"
                  >
                    <Maximize2 size={24} />
                  </button>
                ) : (
                  <div className="w-16 h-16 bg-slate-50 flex items-center justify-center text-slate-200 rounded-[24px] border border-slate-100">
                    <Lock size={20} />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="bg-white rounded-[60px] border border-dashed border-slate-200 p-40 text-center shadow-inner">
            <div className="relative mx-auto w-32 h-32 mb-10">
              <div className="absolute inset-0 bg-emerald-500/5 blur-3xl rounded-full animate-pulse"></div>
              <Layers className="relative w-full h-full text-slate-100" />
            </div>
            <h4 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-4">Pipeline Quiescence</h4>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-[0.3em] font-mono">No active insight nodes detected for current query.</p>
          </div>
        )}
      </div>

      {/* Secure Command Modal */}
      <Dialog open={!!selectedComplaint} onOpenChange={(open) => !open && setSelectedComplaint(null)}>
        <DialogContent className="sm:max-w-2xl bg-white rounded-[48px] border-none shadow-2xl p-0 overflow-hidden text-left">
          <div className="bg-slate-950 p-12 text-white relative">
            <div className="absolute top-0 right-0 p-12 opacity-10">
              <Zap size={140} />
            </div>
            <DialogHeader className="relative z-10">
              <div className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] mb-4">Command Override Authorized</div>
              <DialogTitle className="text-5xl font-black uppercase tracking-tighter leading-[0.9]">Transition <br /> Pipeline State.</DialogTitle>
            </DialogHeader>
          </div>

          {selectedComplaint && (
            <div className="p-12">
              <form onSubmit={handleUpdateStatus} className="space-y-10">
                <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 shadow-inner flex items-center gap-8">
                  <div className="w-16 h-16 rounded-3xl bg-white shadow-lg flex items-center justify-center text-emerald-500">
                    <Target size={32} />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Target Node UID</div>
                    <div className="text-xl font-black text-slate-900 uppercase tracking-tight">{selectedComplaint.title}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] ml-1">New Operational State *</label>
                  <select
                    className="w-full h-16 px-8 bg-slate-50 border border-slate-100 rounded-[28px] text-[12px] font-black uppercase tracking-widest outline-none focus:border-emerald-500/50 focus:bg-white transition-all appearance-none cursor-pointer"
                    value={updateStatus}
                    onChange={e => setUpdateStatus(e.target.value)}
                  >
                    <option value="Submitted">Awaiting Node Allocation</option>
                    <option value="Assigned">Resource Sync Complete</option>
                    <option value="In Progress">Active Restoration</option>
                    <option value="Resolved">Verification Node Active</option>
                    <option value="Closed">Cycle Termination</option>
                  </select>
                </div>

                {(updateStatus === "Resolved" || updateStatus === "Closed") && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] ml-1 flex justify-between items-center">
                      Cryptographic Log *
                      <span className="text-[9px] bg-emerald-500 text-slate-950 px-3 py-1 rounded-full font-black">AUDIT REQUIRED</span>
                    </label>
                    <textarea
                      required
                      value={closingRemark}
                      onChange={e => setClosingRemark(e.target.value)}
                      className="w-full p-8 min-h-[160px] bg-slate-50 border border-slate-100 rounded-[32px] text-[15px] font-bold text-slate-800 outline-none focus:border-emerald-500/50 focus:bg-white transition-all placeholder:text-slate-300 shadow-inner"
                      placeholder="Enter detailed immutable resolution data..."
                    />
                  </div>
                )}

                <div className="pt-6 flex gap-6">
                  <button type="button" onClick={() => setSelectedComplaint(null)} className="h-16 px-10 bg-slate-50 text-slate-400 font-black text-[11px] uppercase tracking-widest rounded-[28px] border border-slate-100 hover:bg-slate-100 transition-all">Abort</button>
                  <button type="submit" className="flex-1 h-16 bg-emerald-500 text-slate-950 font-black text-[12px] uppercase tracking-[0.3em] rounded-[28px] hover:bg-emerald-400 shadow-2xl shadow-emerald-500/30 transition-all transform active:scale-95">
                    Commit State Trace
                  </button>
                </div>
              </form>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* New Node Injection Modal */}
      <Dialog open={isNewEntryOpen} onOpenChange={setIsNewEntryOpen}>
        <DialogContent className="sm:max-w-2xl bg-white rounded-[50px] border-none shadow-2xl p-0 overflow-hidden text-left">
          <div className="bg-emerald-500 p-12 text-slate-950 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-10">
              <Layers size={140} />
            </div>
            <DialogHeader className="relative z-10">
              <div className="text-[10px] font-black text-slate-950/60 uppercase tracking-[0.3em] mb-4">Pipeline Ingress</div>
              <DialogTitle className="text-5xl font-black uppercase tracking-tighter leading-[0.9]">Inject New <br /> Feedback Node.</DialogTitle>
            </DialogHeader>
          </div>

          <form onSubmit={handleCreateComplaint} className="p-12 space-y-10">
            <div className="space-y-4">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Node Identifier *</label>
              <input
                required
                value={newEntryData.title}
                onChange={e => setNewEntryData({ ...newEntryData, title: e.target.value })}
                className="w-full h-16 px-8 bg-slate-50 border border-slate-100 rounded-[28px] text-[15px] font-bold text-slate-800 focus:border-emerald-500/50 focus:bg-white outline-none transition-all shadow-inner"
                placeholder="Brief nomenclature for this incident..."
              />
            </div>

            <div className="space-y-4">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Data Payload *</label>
              <textarea
                required
                value={newEntryData.description}
                onChange={e => setNewEntryData({ ...newEntryData, description: e.target.value })}
                className="w-full h-40 p-8 bg-slate-50 border border-slate-100 rounded-[32px] text-[15px] font-bold text-slate-800 focus:border-emerald-500/50 focus:bg-white outline-none transition-all resize-none shadow-inner"
                placeholder="Full observational data stream..."
              />
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Domain *</label>
                <select value={newEntryData.category} onChange={e => setNewEntryData({ ...newEntryData, category: e.target.value })} className="w-full h-16 px-6 bg-slate-50 border border-slate-100 rounded-[28px] text-[11px] font-black uppercase tracking-widest outline-none transition-all cursor-pointer">
                  <option>Infrastructure</option><option>Sanitation</option><option>Electrical</option><option>Water</option><option>General</option>
                </select>
              </div>
              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Priority Mapping *</label>
                <select value={newEntryData.priority} onChange={e => setNewEntryData({ ...newEntryData, priority: e.target.value })} className="w-full h-16 px-6 bg-slate-50 border border-slate-100 rounded-[28px] text-[11px] font-black uppercase tracking-widest transition-all cursor-pointer">
                  <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
                </select>
              </div>
            </div>

            <div className="pt-6 flex gap-6">
              <button type="button" onClick={() => setIsNewEntryOpen(false)} className="h-16 px-10 bg-slate-50 text-slate-500 font-black text-[11px] uppercase tracking-widest rounded-[28px] border border-slate-100 hover:bg-slate-100 transition-all">Dismiss</button>
              <button type="submit" disabled={isSubmitting} className="flex-1 h-16 bg-emerald-500 text-slate-950 font-black text-[12px] uppercase tracking-[0.3em] rounded-[28px] hover:bg-emerald-400 shadow-2xl shadow-emerald-500/20 transition-all active:scale-[0.98]">
                {isSubmitting ? "SYNCHRONIZING..." : "INJECT NODE"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <footer className="mt-24 pt-12 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-8">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Integrated Insight Flux • Sync: v1.0.4 • Trace: Active</p>
        <div className="flex gap-12">
          <button className="text-[9px] font-black text-slate-400 hover:text-emerald-500 uppercase tracking-widest transition-colors">Flow Chart</button>
          <button className="text-[9px] font-black text-slate-400 hover:text-emerald-500 uppercase tracking-widest transition-colors">Latency Data</button>
          <button className="text-[9px] font-black text-slate-400 hover:text-emerald-500 uppercase tracking-widest transition-colors">Registry Uplink</button>
        </div>
      </footer>
    </AppLayout>
  );
};

export default Complaints;
