import { useState, useEffect } from "react";
import { AppLayout } from "@/components/AppLayout";
import {
  Search,
  Filter,
  Plus,
  Edit2,
  Loader2,
  Database,
  Zap,
  MapPin,
  History,
  MoreHorizontal,
  Box,
  AlertTriangle,
  ChevronRight,
  Maximize2,
  TrendingUp,
  Cpu,
  Layers,
  Globe,
  Compass
} from "lucide-react";
import { getAuthToken } from "@/lib/auth";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Asset {
  id: string;
  name: string;
  category: string;
  ward: string;
  location: string;
  condition: string;
  responsibleRole: string;
  updatedAt: string;
}

const Assets = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<string>("All");
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'spatial'>('grid');

  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [updateCondition, setUpdateCondition] = useState<string>("Working");
  const [isNewAssetModalOpen, setIsNewAssetModalOpen] = useState(false);
  const [newAssetData, setNewAssetData] = useState({
    name: "",
    category: "Infrastructure",
    ward: "General",
    location: "",
    condition: "Working",
    responsibleRole: "ADMIN"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAssets = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/v1/assets", {
        headers: {
          "Authorization": `Bearer ${getAuthToken()}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        // The backend might return fake if not seeded, but we already have seeds.
        setAssets(data);
      } else {
        toast.error("Hub Sync Failed", { description: "Remote registry server rejected communications." });
      }
    } catch (err) {
      toast.error("Offline Mode", { description: "Unable to establish secure uplink with the data hub." });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleCreateAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("http://localhost:5000/api/v1/assets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(newAssetData)
      });
      if (response.ok) {
        toast.success("Ecosystem Node Registered.", {
          description: "Asset identity successfully committed to the global ledger."
        });
        fetchAssets();
        setIsNewAssetModalOpen(false);
        setNewAssetData({ name: "", category: "Infrastructure", ward: "General", location: "", condition: "Working", responsibleRole: "ADMIN" });
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Registration Denied");
      }
    } catch {
      toast.error("Integrity Error", { description: "Encryption handshake failed during registration." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsset) return;

    try {
      const response = await fetch(`http://localhost:5000/api/v1/assets/${selectedAsset.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({ condition: updateCondition })
      });
      if (response.ok) {
        toast.success("Identity State Synced.", {
          description: "New operational status has been broadcast to all nodes."
        });
        fetchAssets();
        setSelectedAsset(null);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Command Rejected");
      }
    } catch {
      toast.error("Relay Timeout", { description: "Asset node controller is not responding." });
    }
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "All" || asset.condition === filter;
    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return (
      <AppLayout>
        <div className="h-[70vh] flex flex-col items-center justify-center gap-6">
          <div className="relative">
            <div className="h-16 w-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 bg-emerald-500/10 blur-xl animate-pulse rounded-full"></div>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[12px] font-black text-slate-900 uppercase tracking-[0.4em] mb-2 animate-pulse">Scanning Bio-Registry...</span>
            <div className="h-1 w-48 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 animate-progress origin-left"></div>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <style>{`
        @keyframes progress {
            0% { transform: scaleX(0); }
            50% { transform: scaleX(0.7); }
            100% { transform: scaleX(1); }
        }
        .spatial-grid {
            perspective: 2000px;
        }
        .spatial-card {
            transform: rotateX(5deg) rotateY(-5deg);
            transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .spatial-card:hover {
            transform: rotateX(0deg) rotateY(0deg) translateZ(20px);
            box-shadow: 0 40px 80px -20px rgba(0,0,0,0.15);
        }
        .hologram-effect {
            background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255,255,255,0.1);
        }
      `}</style>

      {/* Futuristic Header */}
      <div className="mb-12 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 glass-soft overflow-hidden relative group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <Cpu className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] leading-none">Autonomous Registry Hub</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none text-left">
            Kinetic <br className="sm:hidden" /> <span className="text-emerald-500">Assets.</span>
          </h1>
          <p className="text-slate-400 font-semibold text-sm max-w-lg italic text-left">
            Dynamic spatial monitoring and cryptographic condition tracking of the community's structural tokens.
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex bg-slate-100/50 backdrop-blur-md p-1.5 rounded-[22px] border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'grid' ? 'bg-white shadow-xl text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Standard Grid
            </button>
            <button
              onClick={() => setViewMode('spatial')}
              className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'spatial' ? 'bg-white shadow-xl text-emerald-500' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Spatial 3D
            </button>
          </div>

          <Dialog open={isNewAssetModalOpen} onOpenChange={setIsNewAssetModalOpen}>
            <DialogTrigger asChild>
              <button className="group h-16 pl-8 pr-10 bg-slate-950 text-white font-black text-[11px] uppercase tracking-[0.3em] rounded-[28px] hover:bg-slate-800 shadow-2xl shadow-slate-950/20 transition-all flex items-center gap-4 active:scale-[0.98]">
                <div className="p-2 bg-emerald-500 rounded-xl group-hover:rotate-90 transition-transform">
                  <Plus size={18} className="text-slate-950" />
                </div>
                Register Identity
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl bg-white rounded-[48px] border-none shadow-2xl p-0 overflow-hidden text-left">
              <div className="bg-slate-950 p-12 text-white relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-64 h-64 bg-emerald-500/20 blur-[100px] rounded-full animate-pulse"></div>
                <div className="relative z-10">
                  <div className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] mb-4">Node Authorization</div>
                  <DialogTitle className="text-5xl font-black uppercase tracking-tighter leading-[0.9]">Inject <br /> New Node.</DialogTitle>
                </div>
              </div>

              <form onSubmit={handleCreateAsset} className="p-12 space-y-8 bg-white">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Asset Nomenclature *</label>
                  <input
                    required
                    value={newAssetData.name}
                    onChange={e => setNewAssetData({ ...newAssetData, name: e.target.value })}
                    className="w-full h-16 px-8 bg-slate-50 border border-slate-100 rounded-[28px] text-[15px] font-bold text-slate-800 focus:bg-white focus:border-emerald-500/50 outline-none transition-all shadow-inner"
                    placeholder="e.g. CORE-PUMP-X2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Domain Classification *</label>
                    <select
                      value={newAssetData.category}
                      onChange={e => setNewAssetData({ ...newAssetData, category: e.target.value })}
                      className="w-full h-16 px-6 bg-slate-50 border border-slate-100 rounded-[28px] text-[11px] font-black uppercase tracking-widest outline-none transition-all"
                    >
                      <option>Infrastructure</option><option>Hydraulics</option><option>Power Grid</option><option>Edu-Center</option><option>Clinical</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sector (Ward) *</label>
                    <input required value={newAssetData.ward} onChange={e => setNewAssetData({ ...newAssetData, ward: e.target.value })} className="w-full h-16 px-8 bg-slate-50 border border-slate-100 rounded-[28px] text-[11px] font-black uppercase tracking-widest outline-none" placeholder="WARD-X" />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Spatial Mapping Data *</label>
                  <input required value={newAssetData.location} onChange={e => setNewAssetData({ ...newAssetData, location: e.target.value })} className="w-full h-16 px-8 bg-slate-50 border border-slate-100 rounded-[28px] text-[13px] font-bold" placeholder="GEO-LOC DATA" />
                </div>

                <div className="pt-6 flex gap-4">
                  <button type="button" onClick={() => setIsNewAssetModalOpen(false)} className="h-16 px-10 bg-slate-50 text-slate-500 font-black text-[11px] uppercase tracking-[0.2em] rounded-3xl hover:bg-slate-100 transition-all">Abort</button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 h-16 bg-emerald-500 text-slate-950 font-black text-[11px] uppercase tracking-[0.2em] rounded-3xl hover:bg-emerald-400 shadow-2xl shadow-emerald-500/30 transition-all">
                    {isSubmitting ? "TRANSMITTING..." : "COMMIT TO HUB"}
                  </button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Real-time Status Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        <StatusCard label="Active Nodes" value={assets.length} icon={<Database />} />
        <StatusCard label="Critical Alarms" value={assets.filter(a => a.condition.includes('Fault')).length} icon={<AlertTriangle />} variant="danger" />
        <StatusCard label="Sync Cluster" value="Active" icon={<Globe />} variant="success" />
        <StatusCard label="Last Sync" value={new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} icon={<Zap />} />
      </div>

      {/* Dynamic Controls */}
      <div className="flex flex-col md:flex-row gap-6 mb-12 items-center">
        <div className="flex-1 relative w-full">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Query asset identifier or geo-coordinates..."
            className="w-full h-16 pl-14 pr-8 bg-white border border-slate-100 rounded-3xl text-sm font-semibold shadow-[0_8px_30px_rgba(0,0,0,0.02)] focus:shadow-xl transition-all outline-none"
          />
        </div>
        <div className="flex items-center gap-4 bg-white p-2 border border-slate-100 rounded-3xl shadow-sm">
          <div className="flex p-1 bg-slate-50 rounded-2xl border border-slate-100">
            {['All', 'Working', 'Major Fault', 'Under Repair'].map((cond) => (
              <button
                key={cond}
                onClick={() => setFilter(cond)}
                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === cond ? 'bg-white shadow-sm text-emerald-500' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {cond === 'Working' ? 'Clean' : cond === 'Major Fault' ? 'Fault' : cond}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Asset Display Area */}
      <div className={`${viewMode === 'spatial' ? 'spatial-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10' : 'space-y-6'}`}>
        {filteredAssets.map((asset, idx) => (
          <div
            key={asset.id}
            className={`group bg-white rounded-[40px] border border-slate-100 overflow-hidden text-left relative transition-all ${viewMode === 'spatial' ? 'spatial-card p-10 hover:shadow-2xl' : 'flex items-center p-8 hover:translate-x-2'}`}
            style={{ transitionDelay: `${idx * 50}ms` }}
          >
            <div className={`flex-1 ${viewMode === 'spatial' ? 'mb-8' : 'flex items-center gap-8'}`}>
              <div className={`p-5 rounded-3xl border border-slate-100 shadow-sm transition-all group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white ${asset.condition.includes('Fault') ? 'text-rose-500 animate-pulse' : 'text-slate-400'}`}>
                {asset.category === 'Hydraulics' ? <Zap size={24} /> : <Box size={24} />}
              </div>

              <div className={viewMode === 'spatial' ? 'mt-6' : 'flex-1'}>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">{asset.category}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">ID:{asset.id.split('-')[0]}</span>
                </div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight group-hover:text-emerald-600 transition-colors uppercase">{asset.name}</h3>

                {viewMode === 'grid' && (
                  <div className="flex items-center gap-6 mt-3">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <MapPin size={12} className="text-emerald-500" />
                      {asset.location} · {asset.ward}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-300 uppercase tracking-widest italic">
                      <History size={12} />
                      Last Entry: {new Date(asset.updatedAt).toLocaleTimeString()}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className={`flex items-center gap-6 ${viewMode === 'spatial' ? 'justify-between' : 'justify-end'}`}>
              <div className="text-right">
                <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Operational State</div>
                <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${asset.condition === 'Working' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                  asset.condition === 'Major Fault' ? 'bg-rose-50 text-rose-500 border-rose-100' :
                    'bg-amber-50 text-amber-600 border-amber-100'
                  }`}>
                  {asset.condition}
                </span>
              </div>

              <button
                onClick={() => { setSelectedAsset(asset); setUpdateCondition(asset.condition); }}
                className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 hover:bg-slate-950 hover:text-white hover:border-slate-950 transition-all active:scale-95 group-hover:opacity-100"
              >
                <Maximize2 size={18} />
              </button>
            </div>

            {viewMode === 'spatial' && (
              <div className="mt-8 pt-8 border-t border-slate-50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <MapPin size={14} className="text-emerald-500" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{asset.ward}</span>
                </div>
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black uppercase text-slate-400">Op</div>
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-emerald-500 flex items-center justify-center text-[10px] font-black uppercase text-slate-950">Ac</div>
                </div>
              </div>
            )}
          </div>
        ))}

        {filteredAssets.length === 0 && (
          <div className="col-span-full bg-white rounded-[48px] border border-dashed border-slate-200 p-24 text-center">
            <div className="relative mx-auto w-24 h-24 mb-6">
              <div className="absolute inset-0 bg-emerald-500/10 blur-2xl rounded-full"></div>
              <Archive className="relative w-full h-full text-slate-200" />
            </div>
            <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">Registry Silent</h4>
            <p className="text-slate-400 text-sm font-semibold italic">No data nodes found for current search parameters.</p>
          </div>
        )}
      </div>

      {/* Condition Update Modal */}
      <Dialog open={!!selectedAsset} onOpenChange={o => !o && setSelectedAsset(null)}>
        <DialogContent className="sm:max-w-md bg-white rounded-[48px] border-none shadow-2xl p-0 overflow-hidden text-left">
          <div className="bg-emerald-500 p-10 text-slate-950 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-10">
              <Zap size={100} />
            </div>
            <div className="text-[10px] font-black text-slate-950/60 uppercase tracking-[0.4em] mb-4">Command Override</div>
            <DialogTitle className="text-4xl font-black uppercase tracking-tighter leading-none">Modify Asset <br /> Trajectory.</DialogTitle>
          </div>

          {selectedAsset && (
            <form onSubmit={handleUpdateStatus} className="p-10 space-y-8">
              <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-200/50 flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-slate-400 shadow-sm">
                  <Layers size={24} />
                </div>
                <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Target Identity</div>
                  <div className="text-lg font-black text-slate-900 leading-none uppercase">{selectedAsset.name}</div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-left block">Target Condition Node</label>
                <select
                  value={updateCondition}
                  onChange={e => setUpdateCondition(e.target.value)}
                  className="w-full h-16 px-8 bg-slate-50 border border-slate-200 rounded-[28px] text-[11px] font-black uppercase tracking-widest transition-all cursor-pointer outline-none focus:bg-white focus:border-emerald-500"
                >
                  <option value="Working">Operational</option>
                  <option value="Minor Issue">Minor Inspection</option>
                  <option value="Major Fault">Critical Hazard</option>
                  <option value="Under Repair">Maintenance Protocol</option>
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setSelectedAsset(null)} className="flex-1 h-14 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-600 transition-colors">Discard</button>
                <button type="submit" className="flex-[2] h-16 bg-slate-950 text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-3xl hover:bg-emerald-500 hover:text-slate-950 transition-all shadow-xl">
                  Commit State
                </button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>


      <footer className="mt-24 pt-12 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-8">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Spatial Registry OS • Trace Active • Secure Node</p>
        <div className="flex gap-10">
          <button className="text-[9px] font-black text-slate-400 hover:text-emerald-500 uppercase tracking-widest transition-colors">Mapping Docs</button>
          <button className="text-[9px] font-black text-slate-400 hover:text-emerald-500 uppercase tracking-widest transition-colors">System Health</button>
          <button className="text-[9px] font-black text-slate-400 hover:text-emerald-500 uppercase tracking-widest transition-colors">Relay Stats</button>
        </div>
      </footer>
    </AppLayout>
  );
};

function StatusCard({ label, value, trend, icon, variant }: { label: string; value: string | number; trend?: string; icon: React.ReactNode; variant?: 'success' | 'danger' }) {
  const variants = {
    success: 'text-emerald-500 border-emerald-50 bg-emerald-50/10',
    danger: 'text-rose-500 border-rose-50 bg-rose-50/10 animate-pulse',
    default: 'text-slate-300 border-slate-100 bg-white shadow-sm'
  };

  return (
    <div className={`p-10 rounded-[48px] border ${variants[variant || 'default']} group transition-all hover:scale-105 duration-500 text-left`}>
      <div className="flex justify-between items-start mb-8">
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-slate-300 group-hover:bg-emerald-500 group-hover:text-white transition-all transform group-hover:rotate-12">
          {icon}
        </div>
        {trend && <span className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter">{trend}</span>}
      </div>
      <div className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 opacity-50">{label}</div>
      <div className="text-4xl font-black tracking-tighter text-slate-900">{value}</div>
    </div>
  );
}

const Archive = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="5" x="2" y="3" rx="1" /><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" /><path d="M10 12h4" /></svg>
);

export default Assets;
