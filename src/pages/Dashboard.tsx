import { useState, useEffect } from "react";
import { AppLayout } from "@/components/AppLayout";
import {
  getConditionClass,
  getComplaintStatusClass,
  formatCurrency,
  type AssetCondition,
  type ComplaintStatus
} from "@/data/mockData";
import {
  AlertTriangle,
  Building2,
  MessageSquareWarning,
  IndianRupee,
  Clock,
  Loader2,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Activity,
  Calendar,
  Zap,
  ChevronRight,
  Database,
  Cpu,
  Globe,
  Layers,
  Terminal,
  Maximize2
} from "lucide-react";
import { getUser, getAuthToken } from "@/lib/auth";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface DashboardData {
  stats: {
    totalAssets: number;
    faultyAssets: number;
    openComplaints: number;
    totalSpent: number;
    utilizationPercent: number;
  };
  recentComplaints: any[];
  faultyAssets: any[];
}

const Dashboard = () => {
  const user = getUser();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeLayer, setActiveLayer] = useState<'infrastructure' | 'finance' | 'personnel'>('infrastructure');

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/v1/dashboard/stats", {
        headers: {
          "Authorization": `Bearer ${getAuthToken()}`
        }
      });
      if (response.ok) {
        const result = await response.json();
        setData(result);
      } else {
        toast.error("Hub Sync Error", {
          description: "Terminal was unable to handshake with the central intelligence core."
        });
      }
    } catch (err) {
      toast.error("Uplink Offline", {
        description: "Standard relay channels are non-responsive. Retrying..."
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="h-[70vh] flex flex-col items-center justify-center gap-8">
          <div className="relative">
            <div className="h-24 w-24 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Cpu className="h-8 w-8 text-emerald-500 animate-pulse" />
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] animate-pulse">Initializing Command Center...</span>
            <div className="h-1 w-48 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 animate-[progress_2s_infinite] origin-left"></div>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  const stats = data?.stats || {
    totalAssets: 0,
    faultyAssets: 0,
    openComplaints: 0,
    totalSpent: 0,
    utilizationPercent: 0
  };

  return (
    <AppLayout>
      <style>{`
            @keyframes progress {
                0% { transform: scaleX(0); }
                50% { transform: scaleX(0.7); }
                100% { transform: scaleX(1); }
            }
            .glass-panel {
                background: linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.3) 100%);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255,255,255,0.5);
            }
            .hero-gradient {
                background: radial-gradient(circle at top right, rgba(16, 185, 129, 0.1), transparent 400px),
                            radial-gradient(circle at bottom left, rgba(59, 130, 246, 0.05), transparent 400px);
            }
            .node-grid {
                background-image: radial-gradient(rgba(0,0,0,0.05) 1px, transparent 1px);
                background-size: 30px 30px;
            }
        `}</style>

      {/* Futuristic Command Header */}
      <div className="mb-14 relative group">
        <div className="absolute -inset-4 bg-emerald-500/5 rounded-[48px] blur-2xl group-hover:bg-emerald-500/10 transition-all duration-1000 -z-10"></div>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 text-left">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-4">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 glass-soft">
                <Activity className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none">OS: Kinetic v1.0.4</span>
              </div>
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-slate-900/5 rounded-2xl border border-slate-900/10 glass-soft">
                <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Security: Encrypted Node</span>
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-none">
                Command <span className="text-emerald-500">Center.</span>
              </h1>
              <p className="text-slate-400 font-bold text-base max-w-xl italic">
                Welcome back, {user?.name}. Global status: <span className="text-emerald-500 font-black uppercase">Nominal</span> across all synchronized village nodes.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-8 bg-white/80 backdrop-blur-xl p-4 pr-10 border border-white/50 rounded-[40px] shadow-2xl shadow-emerald-500/5">
            <div className="relative">
              <div className="w-16 h-16 rounded-3xl bg-slate-950 flex items-center justify-center text-white shadow-xl rotate-3 hover:rotate-0 transition-transform cursor-pointer">
                <Terminal className="h-7 w-7 text-emerald-500" />
              </div>
              <div className="absolute -top-2 -right-2 w-5 h-5 bg-emerald-500 rounded-full border-4 border-white animate-pulse"></div>
            </div>
            <div>
              <span className="text-[10px] font-black text-slate-300 block uppercase tracking-[0.3em] leading-none mb-2">Temporal Node</span>
              <span className="text-xl font-black text-slate-900 tracking-tight">{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Core Intelligence Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        <IntelligenceCard
          icon={<Building2 />}
          label="Managed Assets"
          value={stats.totalAssets}
          color="emerald"
        />
        <IntelligenceCard
          icon={<AlertTriangle />}
          label="Critical Alarms"
          value={stats.faultyAssets}
          status={stats.faultyAssets > 0 ? "Fault Detected" : "Pure Integrity"}
          color="amber"
          isAlert={stats.faultyAssets > 0}
        />
        <IntelligenceCard
          icon={<MessageSquareWarning />}
          label="Active Feed"
          value={stats.openComplaints}
          status="In Pipeline"
          color="rose"
        />
        <IntelligenceCard
          icon={<IndianRupee />}
          label="Capital Flow"
          value={stats.utilizationPercent + "%"}
          sub={formatCurrency(stats.totalSpent)}
          status="Authorized Flow"
          color="indigo"
        />
      </div>

      {/* Main Viewport */}
      <div className="grid lg:grid-cols-12 gap-10">
        {/* Left Aspect: Spatial Infrastructure Monitor */}
        <section className="lg:col-span-8 group">
          <div className="bg-white/90 backdrop-blur-2xl rounded-[48px] border border-white/50 shadow-2xl shadow-emerald-500/10 overflow-hidden relative min-h-[600px] flex flex-col text-left">
            <div className="p-10 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative z-10">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Spatial Monitor</h2>
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                  <Globe className="h-3 w-3 text-emerald-500" />
                  Real-time Node Conditions
                </p>
              </div>
              <div className="flex gap-4">
                <div className="flex p-1.5 bg-slate-50 rounded-2xl border border-slate-100">
                  {(['infrastructure', 'finance', 'personnel'] as const).map((layer) => (
                    <button
                      key={layer}
                      onClick={() => setActiveLayer(layer)}
                      className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeLayer === layer ? 'bg-white shadow-xl text-emerald-500' : 'text-slate-400'}`}
                    >
                      {layer}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex-1 relative overflow-hidden node-grid p-10 flex flex-col">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-emerald-50/20 -z-10"></div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50/30">
                      <th className="text-left px-8 py-5 font-black text-slate-400 uppercase text-[10px] tracking-[0.2em]">Node Identifier</th>
                      <th className="text-left px-8 py-5 font-black text-slate-400 uppercase text-[10px] tracking-[0.2em]">Geo-Tag</th>
                      <th className="text-right px-8 py-5 font-black text-slate-400 uppercase text-[10px] tracking-[0.2em]">Condition Node</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {data?.faultyAssets.map((asset, idx) => (
                      <tr key={asset.id} className="group/row hover:bg-white transition-all transform hover:-translate-y-1 hover:scale-[1.01] hover:shadow-xl relative" style={{ transitionDelay: `${idx * 50}ms` }}>
                        <td className="px-8 py-7">
                          <div className="font-black text-slate-900 text-base tracking-tight group-hover/row:text-emerald-500 transition-colors uppercase">{asset.name}</div>
                          <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-[0.4em] mt-1.5">NID-{asset.id.split('-')[0].toUpperCase()}</div>
                        </td>
                        <td className="px-8 py-7">
                          <div className="text-xs font-black text-slate-500 uppercase tracking-widest">{asset.ward}</div>
                          <div className="text-[10px] text-slate-300 font-bold mt-1 uppercase tracking-tighter italic">{asset.location}</div>
                        </td>
                        <td className="px-8 py-7 text-right">
                          <div className="flex items-center justify-end gap-4">
                            <span className={`inline-flex items-center px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-inner border ${getConditionClass(asset.condition as AssetCondition)}`}>
                              {asset.condition}
                            </span>
                            <button className="p-3 bg-slate-50 rounded-xl text-slate-200 hover:bg-emerald-500 hover:text-white transition-all opacity-0 group-hover/row:opacity-100">
                              <Maximize2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {(!data?.faultyAssets || data.faultyAssets.length === 0) && (
                      <tr>
                        <td colSpan={3} className="px-8 py-32 text-center">
                          <div className="flex flex-col items-center gap-6">
                            <div className="w-24 h-24 rounded-[40px] bg-emerald-50 flex items-center justify-center text-emerald-500 border border-emerald-100 shadow-sm relative group cursor-pointer hover:rotate-45 transition-transform duration-700">
                              <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full scale-0 group-hover:scale-150 transition-transform"></div>
                              <ShieldCheck size={48} className="relative z-10" />
                            </div>
                            <div className="space-y-2">
                              <p className="text-slate-900 text-lg font-black uppercase tracking-tighter">Zero Critical Alarms</p>
                              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">System Health: Optimal</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="mt-auto pt-10 flex justify-between items-center border-t border-slate-50">
                <div className="flex items-center gap-10">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Hub Integrity</span>
                    <span className="text-sm font-black text-emerald-500">SECURE NODE</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Last Update</span>
                    <span className="text-sm font-black text-slate-900 uppercase">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
                <Link to="/ops/assets" className="group flex items-center gap-4 h-14 pl-8 pr-10 bg-slate-950 text-white rounded-[24px] text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-slate-950 transition-all shadow-2xl">
                  Open Global Audit
                  <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Right Aspect: Kinetic Feedback Stream */}
        <section className="lg:col-span-4 space-y-10">
          <div>
            <div className="flex justify-between items-end mb-8 text-left">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Insight <br /> Stream.</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-3 flex items-center gap-2">
                  <Terminal className="h-3.5 w-3.5 text-emerald-500" />
                  Live Trace Pipeline
                </p>
              </div>
              <Link to="/complaints" className="p-4 bg-white rounded-2xl border border-slate-100 text-slate-400 hover:text-emerald-500 hover:border-emerald-100 transition-all shadow-sm">
                <Maximize2 size={18} />
              </Link>
            </div>

            <div className="grid gap-6 relative">
              <div className="absolute left-10 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-500/50 via-slate-100 to-transparent -z-10"></div>

              {data?.recentComplaints.slice(0, 5).map((c, i) => (
                <div key={c.id} className="group bg-white p-7 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-6 relative overflow-hidden" style={{ transitionDelay: `${i * 100}ms` }}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-2xl rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/10 transition-colors"></div>
                  <div className={`w-14 h-14 shrink-0 rounded-[22px] flex items-center justify-center border shadow-inner transform group-hover:rotate-12 transition-transform ${getComplaintStatusClass(c.status as ComplaintStatus)}`}>
                    <MessageSquareWarning size={24} />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="font-black text-slate-900 text-sm truncate uppercase tracking-tight group-hover:text-emerald-600 transition-colors">{c.title}</div>
                    <div className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1.5 flex items-center gap-2">
                      {new Date(c.submittedDate).toLocaleDateString()}
                      <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                      <span className="text-emerald-500">{c.category}</span>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                    <ChevronRight size={22} className="text-emerald-500" />
                  </div>
                </div>
              ))}
              {(!data?.recentComplaints || data.recentComplaints.length === 0) && (
                <div className="p-20 text-center bg-white border border-dashed border-slate-200 rounded-[48px] shadow-inner">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-200">
                      <Layers size={28} />
                    </div>
                    <p className="text-slate-400 text-xs font-black uppercase tracking-[0.4em]">Archive Neutral</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Engagement Matrix Overlay */}
          <div className="p-10 bg-slate-950 rounded-[48px] text-white shadow-2xl shadow-emerald-500/20 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500 text-left aspect-square lg:aspect-auto">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/10 blur-[100px] rounded-full group-hover:bg-emerald-500/20 transition-all duration-1000"></div>
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-500/5 blur-[80px] rounded-full"></div>

            <div className="relative z-10 flex flex-col justify-between h-full">
              <div className="flex justify-between items-start">
                <div className="p-4 bg-emerald-500 rounded-3xl text-slate-950 shadow-lg shadow-emerald-500/40">
                  <Globe className="h-8 w-8" />
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400 block mb-1">Local Network</span>
                  <span className="text-3xl font-black tracking-tighter">{stats.totalAssets} <span className="text-sm font-bold text-white/40">NODES</span></span>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <h3 className="text-4xl font-black uppercase tracking-tighter leading-none">Citizen <br /> Matrix.</h3>
                  </div>
                  <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Authorized Network Nodes</p>
                </div>

                <div className="space-y-3">
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[75%] shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
                  </div>
                  <div className="flex justify-between text-[9px] font-black uppercase tracking-[0.3em] text-white/30">
                    <span>Integration Status</span>
                    <span>System Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <footer className="mt-24 pt-12 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-8">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Integrated Hub OS • Trace Cycle: Active • Node: Synchronized</p>
        <div className="flex gap-10">
          <button className="text-[9px] font-black text-slate-400 hover:text-emerald-500 uppercase tracking-widest transition-colors">Protocol V1</button>
          <button className="text-[9px] font-black text-slate-400 hover:text-emerald-500 uppercase tracking-widest transition-colors">Security Trace</button>
          <button className="text-[9px] font-black text-slate-400 hover:text-emerald-500 uppercase tracking-widest transition-colors">Uplink Health</button>
        </div>
      </footer>
    </AppLayout>
  );
};

function IntelligenceCard({ icon, label, value, sub, status, trend, color, isAlert }: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  status?: string;
  trend?: string;
  color: 'emerald' | 'amber' | 'rose' | 'indigo';
  isAlert?: boolean;
}) {
  const colors = {
    emerald: 'text-emerald-500 border-emerald-50 shadow-emerald-500/10',
    amber: 'text-amber-500 border-amber-50 shadow-amber-500/10',
    rose: 'text-rose-500 border-rose-50 shadow-rose-500/10',
    indigo: 'text-indigo-500 border-indigo-50 shadow-indigo-500/10'
  };

  return (
    <div className={`bg-white p-10 rounded-[48px] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] transition-all hover:shadow-2xl hover:-translate-y-2 group relative overflow-hidden text-left`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50/50 rounded-full translate-x-12 -translate-y-12 group-hover:bg-emerald-50 transition-colors"></div>

      {isAlert && (
        <div className="absolute top-8 right-8">
          <span className="flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]"></span>
          </span>
        </div>
      )}

      <div className="flex justify-between items-start mb-10 relative z-10">
        <div className={`p-4 rounded-2xl bg-slate-50 border border-slate-100 ${colors[color].split(' ')[0]} transition-all group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-slate-950 group-hover:border-emerald-400`}>
          {icon}
        </div>
        {trend && (
          <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest">
            {trend}
          </div>
        )}
      </div>

      <div className="space-y-3 relative z-10">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 block">{label}</span>
        <div className="text-5xl font-black tracking-tighter text-slate-900 group-hover:text-emerald-600 transition-colors leading-none">{value}</div>
      </div>

      {(sub || status) && (
        <div className="mt-10 pt-8 border-t border-slate-50 flex items-center justify-between relative z-10">
          <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">{sub || "Node Verification"}</span>
          <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${isAlert ? 'text-rose-500' : 'text-emerald-500'}`}>{status || "Secured"}</span>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
