import { AppLayout } from "@/components/AppLayout";
import {
    BarChart3,
    Plus,
    Layers,
    Activity,
    ShieldCheck,
    ChevronRight,
    Search,
    FileCheck,
    Download,
    Cpu,
    Zap,
    Archive
} from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { getAuthToken } from "@/lib/auth";

interface Report {
    id: string;
    title: string;
    date: string;
    type: string;
    classification: string;
    size: string;
}

const Reports = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [reports, setReports] = useState<Report[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchReports = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/v1/reports", {
                headers: {
                    "Authorization": `Bearer ${getAuthToken()}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setReports(data);
            }
        } catch (err) {
            toast.error("Registry Sync Failure");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const filteredReports = reports.filter(r =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleGenerateReport = () => {
        toast.info("Intelligence Core Initializing", {
            description: "The synthetic report engine is compiling the requested data nodes for transmission."
        });
    };

    if (isLoading) {
        return (
            <AppLayout>
                <div className="h-[70vh] flex flex-col items-center justify-center gap-8">
                    <div className="relative">
                        <div className="h-20 w-20 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <BarChart3 className="h-6 w-6 text-emerald-500 animate-pulse" />
                        </div>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] animate-pulse">Scanning Archive Registry...</span>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <style>{`
                .intel-card {
                    background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.7) 100%);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255,255,255,0.8);
                    transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
                }
                .intel-card:hover {
                    transform: translateY(-8px) scale(1.02);
                    box-shadow: 0 40px 80px -20px rgba(0,0,0,0.1);
                    border-color: rgba(16, 185, 129, 0.3);
                }
                .scan-line {
                    height: 2px;
                    background: linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.5), transparent);
                    position: absolute;
                    width: 100%;
                    top: 0;
                    animation: scan 3s linear infinite;
                }
                @keyframes scan {
                    0% { transform: translateY(0); opacity: 0; }
                    50% { opacity: 1; }
                    100% { transform: translateY(400px); opacity: 0; }
                }
            `}</style>

            {/* Kinetic Header */}
            <div className="mb-14 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 text-left relative">
                <div className="absolute -top-10 -left-10 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full -z-10"></div>

                <div className="space-y-6">
                    <div className="flex flex-wrap gap-4">
                        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 glass-soft">
                            <BarChart3 className="h-3.5 w-3.5 text-emerald-500" />
                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none">Intelligence Hub v1.0.4</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-none">
                            Official <span className="text-emerald-500">Analytics.</span>
                        </h1>
                        <p className="text-slate-400 font-bold text-base max-w-xl italic">
                            Comprehensive system intelligence and cryptographically verifiable audit reports for a transparent ecosystem.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-10 pr-6">
                    <div className="flex flex-col items-end border-r pr-10 border-slate-100">
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] leading-none mb-3">Data Integrity</span>
                        <span className="text-4xl font-black text-emerald-500 tracking-tighter leading-none">
                            100%
                            <span className="text-xs text-slate-300 font-black uppercase ml-2 tracking-widest">Signed</span>
                        </span>
                    </div>
                    <button
                        onClick={handleGenerateReport}
                        className="group h-16 pl-8 pr-12 bg-slate-950 text-white font-black text-[11px] uppercase tracking-[0.3em] rounded-[28px] hover:bg-emerald-500 hover:text-slate-950 shadow-2xl shadow-slate-950/20 transition-all flex items-center gap-6 active:scale-[0.98]"
                    >
                        <div className="p-3 bg-emerald-500 group-hover:bg-slate-950 rounded-xl transition-colors shadow-lg">
                            <Plus size={24} className="text-slate-950 group-hover:text-emerald-500 transition-colors" />
                        </div>
                        Synthesize New Intelligence
                    </button>
                </div>
            </div>

            {/* High-Tech Tactical Intelligence Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                <IntelligenceCard
                    label="Official Registry Nodes"
                    value={reports.length.toString()}
                    icon={<ShieldCheck />}
                    status="Verified Integrity"
                    variant="success"
                />
                <IntelligenceCard
                    label="Spectral Archive Status"
                    value="Synced"
                    sub="Remote"
                    icon={<Activity />}
                    status="Peak Flux"
                    variant="emerald"
                />
            </div>

            {/* Modern Intelligence Registry */}
            <div className="bg-white/90 backdrop-blur-2xl rounded-[48px] border border-white/50 shadow-2xl shadow-emerald-500/5 overflow-hidden text-left group">
                <div className="scan-line pointer-events-none"></div>

                <div className="p-12 border-b border-slate-50 flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                    <div className="space-y-3">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Intelligence Registry.</h2>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
                            <FileCheck className="h-4 w-4 text-emerald-500" />
                            Official Immutable Archive Nodes
                        </div>
                    </div>

                    <div className="flex-1 max-w-md w-full relative">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                        <input
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            placeholder="Query archive node nomenclatures..."
                            className="w-full h-14 pl-16 pr-8 bg-slate-50/50 border border-transparent rounded-[24px] text-sm font-bold placeholder:text-slate-300 outline-none focus:bg-white focus:border-emerald-500/30 transition-all"
                        />
                    </div>

                    <div className="flex bg-slate-50 p-2 rounded-[22px] border border-slate-100 shadow-inner">
                        <button className="px-8 py-3 bg-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl text-emerald-500">Live Hub</button>
                        <button className="px-8 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Archived</button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50/30">
                                <th className="px-10 py-6 text-left font-black text-slate-400 uppercase text-[11px] tracking-[0.4em]">Registry Entry</th>
                                <th className="px-10 py-6 text-left font-black text-slate-400 uppercase text-[11px] tracking-[0.4em]">Document Definition</th>
                                <th className="px-10 py-6 text-left font-black text-slate-400 uppercase text-[11px] tracking-[0.4em]">Temporal Data</th>
                                <th className="px-10 py-6 text-center font-black text-slate-400 uppercase text-[11px] tracking-[0.4em]">Sec-Tier</th>
                                <th className="px-10 py-6 text-right font-black text-slate-400 uppercase text-[11px] tracking-[0.4em]">Extraction</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredReports.map((r, i) => (
                                <tr key={r.id} className="group/row hover:bg-white transition-all transform hover:scale-[1.01] hover:shadow-2xl relative" style={{ transitionDelay: `${i * 50}ms` }}>
                                    <td className="px-10 py-10 text-left">
                                        <div className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-3">REF-{r.id.split('-').pop()}</div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Live Node</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-10 text-left">
                                        <div className="font-black text-slate-900 text-lg tracking-tight group-hover/row:text-emerald-600 transition-colors uppercase leading-none mb-3">{r.title}</div>
                                        <div className="flex items-center gap-4 flex-wrap">
                                            <span className="inline-flex items-center px-4 py-1.5 rounded-xl bg-slate-950 text-white text-[9px] font-black uppercase tracking-widest">{r.type} ARCHIVE</span>
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-100"></div>
                                            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest italic">{r.size} PAYLOAD</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-10 text-left">
                                        <div className="text-sm font-black text-slate-800 uppercase tracking-tighter">{r.date}</div>
                                        <div className="text-[9px] font-black text-slate-300 uppercase mt-2 tracking-widest">SYNC CYCLE ACTIVE</div>
                                    </td>
                                    <td className="px-10 py-10 text-center">
                                        <span className={`inline-flex items-center px-6 py-2.5 rounded-[20px] text-[10px] font-black uppercase tracking-widest shadow-inner border transition-all ${r.classification === 'Public' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-500/5' :
                                            r.classification === 'Internal' ? 'bg-amber-50 text-amber-600 border-amber-100 shadow-amber-500/5' :
                                                'bg-rose-50 text-rose-500 border-rose-100 shadow-rose-500/5 animate-pulse'
                                            }`}>
                                            {r.classification}
                                        </span>
                                    </td>
                                    <td className="px-10 py-10 text-right">
                                        <button
                                            onClick={handleGenerateReport}
                                            className="group/btn flex items-center justify-center gap-4 h-14 pl-8 pr-10 bg-slate-950 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-[24px] hover:bg-emerald-500 hover:text-slate-950 transition-all ml-auto shadow-xl hover:shadow-emerald-500/30 active:scale-[0.95]"
                                        >
                                            <Download size={18} className="group-hover/btn:-translate-y-1 transition-transform" />
                                            Extract Node
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredReports.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-10 py-48 text-center">
                                        <div className="flex flex-col items-center gap-10">
                                            <div className="relative">
                                                <div className="w-32 h-32 rounded-[50px] bg-slate-50 flex items-center justify-center text-slate-100 border border-dashed border-slate-200">
                                                    <Archive size={64} />
                                                </div>
                                                <div className="absolute inset-0 bg-emerald-500/5 blur-3xl scale-150"></div>
                                            </div>
                                            <div className="space-y-3">
                                                <h4 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">Registry Silicon.</h4>
                                                <p className="text-slate-400 text-xs font-black uppercase tracking-[0.5em]">Zero Archive Nodes Detected</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <footer className="mt-24 pt-12 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-8">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Unified Intelligence Matrix • Sync: v1.0.4 • SEC-ALPHA ACTIVE</p>
                <div className="flex gap-12">
                    <button className="text-[9px] font-black text-slate-400 hover:text-emerald-500 uppercase tracking-widest transition-colors">Spectral Guidelines</button>
                    <button className="text-[9px] font-black text-slate-400 hover:text-emerald-500 uppercase tracking-widest transition-colors">Privacy Nodes</button>
                    <button className="text-[9px] font-black text-slate-400 hover:text-emerald-500 uppercase tracking-widest transition-colors">Export Global Ledger</button>
                </div>
            </footer>
        </AppLayout>
    );
};

function IntelligenceCard({ label, value, sub, icon, status, variant, trend }: { label: string; value: string; sub?: string; icon: React.ReactNode; status: string; variant?: 'success' | 'emerald'; trend?: string }) {
    const variants = {
        success: 'text-emerald-500 border-emerald-50 shadow-emerald-500/5 bg-emerald-50/10',
        emerald: 'text-emerald-600 border-emerald-100 shadow-emerald-500/5 bg-emerald-50/20',
        default: 'text-slate-300 border-slate-100 shadow-slate-900/5 bg-white'
    };

    return (
        <div className={`intel-card p-10 rounded-[48px] border ${variants[variant || 'default']} group relative overflow-hidden text-left`}>
            <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-150 transition-transform">
                <Cpu size={120} />
            </div>

            <div className="flex justify-between items-start mb-10 relative z-10">
                <div className={`p-4 bg-slate-50 rounded-[22px] border border-slate-100 shadow-inner text-slate-300 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all transform group-hover:rotate-12`}>
                    {icon}
                </div>
                {trend && <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">{trend}</span>}
            </div>

            <div className="space-y-4 relative z-10">
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">{label}</div>
                <div className="flex items-baseline gap-4">
                    <div className="text-5xl font-black tracking-tighter text-slate-950 group-hover:text-emerald-600 transition-colors">{value}</div>
                    {sub && <div className="text-sm font-black text-slate-400 tracking-tight uppercase">{sub}</div>}
                </div>
            </div>

            <div className="mt-10 pt-8 border-t border-slate-50 flex items-center justify-between relative z-10">
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] flex items-center gap-3">
                    <Zap size={14} className="animate-pulse" />
                    {status}
                </span>
                <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-slate-950 group-hover:text-white transition-all transform group-hover:translate-x-2">
                    <ChevronRight size={18} />
                </div>
            </div>
        </div>
    );
}

export default Reports;
