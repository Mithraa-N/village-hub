import { useState, useEffect } from "react";
import { AppLayout } from "@/components/AppLayout";
import { getAuthToken } from "@/lib/auth";
import {
    History,
    Shield,
    Activity,
    Terminal,
    Cpu,
    Search,
    Filter,
    CheckCircle2,
    AlertCircle,
    FileCode,
    Globe,
    Database,
    Layers,
    Zap,
    ChevronRight,
    Maximize2
} from "lucide-react";
import { toast } from "sonner";

interface AuditLog {
    id: string;
    action: string;
    details: string;
    module: string;
    userId: string;
    timestamp: string;
    ipAddress: string | null;
    user?: {
        name: string;
    };
}

const AuditLogs = () => {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchLogs = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/v1/audit-logs", {
                headers: {
                    "Authorization": `Bearer ${getAuthToken()}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setLogs(data);
            }
        } catch (err) {
            toast.error("Ledger Sync Failure");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const filteredLogs = logs.filter(log =>
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.module.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return (
            <AppLayout>
                <div className="h-[70vh] flex flex-col items-center justify-center gap-8">
                    <div className="relative">
                        <div className="h-20 w-20 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <History className="h-6 w-6 text-emerald-500 animate-pulse" />
                        </div>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] animate-pulse">Decrypting Audit Ledgers...</span>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <style>{`
                .audit-row {
                    transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
                }
                .audit-row:hover {
                    background: rgba(16, 185, 129, 0.02) !important;
                    transform: translateX(4px);
                }
                .code-pill {
                    font-family: 'JetBrains Mono', 'Courier New', monospace;
                }
            `}</style>

            {/* Kinetic Header */}
            <div className="mb-14 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 text-left relative">
                <div className="absolute -top-10 -left-10 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full -z-10"></div>

                <div className="space-y-6">
                    <div className="flex flex-wrap gap-4">
                        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 glass-soft">
                            <Shield className="h-3.5 w-3.5 text-emerald-500" />
                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none">Security Trace: Active</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-none">
                            Audit <span className="text-emerald-500">Ledger.</span>
                        </h1>
                        <p className="text-slate-400 font-bold text-base max-w-xl italic">
                            Immutable cryptographic trace of all system-level state transitions and authorized personnel operations.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-10 pr-6">
                    <div className="flex flex-col items-end border-r pr-10 border-slate-100">
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] leading-none mb-3">Total Traces</span>
                        <span className="text-4xl font-black text-emerald-500 tracking-tighter leading-none">
                            {logs.length}
                            <span className="text-xs text-slate-300 font-black uppercase ml-2 tracking-widest">Nodes</span>
                        </span>
                    </div>
                    <div className="w-16 h-16 rounded-[24px] bg-slate-950 flex items-center justify-center text-emerald-400 shadow-2xl relative group cursor-pointer">
                        <div className="absolute inset-0 bg-emerald-500/10 blur-xl rounded-full scale-150 animate-pulse"></div>
                        <Database size={28} className="relative z-10" />
                    </div>
                </div>
            </div>

            {/* Modern High-Performance Controls */}
            <div className="bg-white/80 backdrop-blur-xl border border-white/50 p-4 rounded-[40px] mb-12 shadow-2xl shadow-emerald-500/5 group text-left">
                <div className="flex flex-col lg:flex-row items-center gap-6">
                    <div className="flex-1 w-full relative">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Query ledger for actions, identifiers, or personnel tags..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full h-16 pl-16 pr-8 bg-slate-50/50 border border-transparent rounded-[28px] text-[15px] font-bold text-slate-800 placeholder:text-slate-300 outline-none focus:bg-white focus:border-emerald-500/30 transition-all"
                        />
                    </div>
                    <div className="flex gap-4 p-2 bg-slate-50 rounded-[28px]">
                        <button className="h-12 px-8 bg-white text-[10px] font-black uppercase tracking-widest rounded-3xl shadow-lg border border-slate-100 text-emerald-500">All Modules</button>
                        <button className="h-12 px-8 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Critical Traces</button>
                    </div>
                </div>
            </div>

            {/* Kinetic Audit Table */}
            <div className="bg-white/90 backdrop-blur-2xl border border-white/50 rounded-[48px] overflow-hidden shadow-2xl shadow-emerald-500/5 text-left">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-10 py-6 text-left font-black text-slate-400 uppercase text-[10px] tracking-[0.3em]">Temporal Node</th>
                                <th className="px-10 py-6 text-left font-black text-slate-400 uppercase text-[10px] tracking-[0.3em]">Personnel</th>
                                <th className="px-10 py-6 text-left font-black text-slate-400 uppercase text-[10px] tracking-[0.3em]">Operational Node</th>
                                <th className="px-10 py-6 text-left font-black text-slate-400 uppercase text-[10px] tracking-[0.3em]">Context / Payload</th>
                                <th className="px-10 py-6 text-right font-black text-slate-400 uppercase text-[10px] tracking-[0.3em]">Network Trace</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredLogs.map((log, idx) => (
                                <tr key={log.id} className="audit-row group bg-transparent">
                                    <td className="px-10 py-8">
                                        <div className="text-xs font-black text-slate-900 tracking-tighter uppercase leading-none mb-1.5">{new Date(log.timestamp).toLocaleDateString()}</div>
                                        <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
                                            <Activity size={10} className="text-emerald-500 animate-pulse" />
                                            {new Date(log.timestamp).toLocaleTimeString()}
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all font-black text-[10px]">
                                                {log.user?.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div className="font-black text-slate-950 text-xs tracking-tight uppercase group-hover:text-emerald-600 transition-colors leading-none">{log.user?.name || "SYS-NODE"}</div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-slate-950 text-white text-[9px] font-black uppercase tracking-widest leading-none mb-1.5 shadow-lg shadow-slate-900/10">
                                            <Terminal size={10} className="text-emerald-400" />
                                            {log.module}
                                        </div>
                                        <div className="text-[11px] font-black text-slate-600 uppercase tracking-tight ml-1">{log.action.replace(/_/g, ' ')}</div>
                                    </td>
                                    <td className="px-10 py-8 max-w-md">
                                        <p className="text-slate-400 text-[11px] font-semibold italic group-hover:text-slate-500 transition-colors leading-relaxed">
                                            &gt; {log.details}
                                        </p>
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <div className="text-[10px] font-mono font-bold text-slate-300 flex flex-col items-end gap-1.5">
                                            <span className="px-3 py-1 bg-slate-50 rounded-lg border border-slate-100 uppercase tracking-tighter">IP: {log.ipAddress || "0.0.0.0"}</span>
                                            <span className="text-[8px] font-black text-emerald-400/60 tracking-widest">ENCRYPTED-TRACE</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredLogs.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-10 py-40 text-center">
                                        <div className="flex flex-col items-center gap-6">
                                            <div className="w-20 h-20 rounded-[32px] bg-slate-50 flex items-center justify-center text-slate-100 border border-dashed border-slate-200">
                                                <History size={40} />
                                            </div>
                                            <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter">No Traces Found</h4>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <footer className="mt-24 pt-12 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-8">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Integrated Audit OS • Tracing Cycle: v1.0.4</p>
                <div className="flex gap-12">
                    <button className="text-[9px] font-black text-slate-400 hover:text-emerald-500 uppercase tracking-widest transition-colors">Audit Export Guidelines</button>
                    <button className="text-[9px] font-black text-slate-400 hover:text-emerald-500 uppercase tracking-widest transition-colors">Legal Compliance Nodes</button>
                    <button className="text-[9px] font-black text-slate-400 hover:text-emerald-500 uppercase tracking-widest transition-colors">Registry Status</button>
                </div>
            </footer>
        </AppLayout>
    );
};

export default AuditLogs;
