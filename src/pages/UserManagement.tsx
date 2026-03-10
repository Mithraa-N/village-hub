import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/AppLayout";
import { getAuthToken, getUser } from "@/lib/auth";
import { toast } from "sonner";
import {
    UserPlus,
    Shield,
    UserCog,
    Power,
    PowerOff,
    Loader2,
    ShieldCheck,
    Layers,
    User,
    Lock,
    Key,
    Activity,
    Smartphone,
    Terminal,
    Fingerprint,
    Cpu,
    Zap,
    Maximize2
} from "lucide-react";

interface UserRecord {
    id: string;
    username: string;
    mobile: string;
    name: string;
    role: string;
    department: string;
    isActive: boolean;
    lastLogin: string | null;
}

const UserManagement = () => {
    const currentUser = getUser();
    const isOperator = currentUser?.role === "OPERATOR";

    const [formData, setFormData] = useState({
        username: "",
        mobile: "",
        name: "",
        password: "",
        role: isOperator ? "VIEWER" : "OPERATOR",
        department: ""
    });
    const [users, setUsers] = useState<UserRecord[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    const fetchUsers = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/v1/users", {
                headers: {
                    "Authorization": `Bearer ${getAuthToken()}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            }
        } catch (err) {
            toast.error("Hub Sync Failure", { description: "Unable to reconcile the personnel registry." });
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch("http://localhost:5000/api/v1/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${getAuthToken()}`
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Identity Provisioned.", {
                    description: `Access credentials for node ${formData.name} have been securely generated.`
                });
                setFormData({
                    username: "",
                    mobile: "",
                    name: "",
                    password: "",
                    role: isOperator ? "VIEWER" : "OPERATOR",
                    department: ""
                });
                fetchUsers();
            } else {
                toast.error(data.message || "Uplink Denial");
            }
        } catch (err) {
            toast.error("Security Fault", { description: "Encryption handshake failed during provisioning." });
        } finally {
            setIsLoading(false);
        }
    };

    const toggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            const response = await fetch(`http://localhost:5000/api/v1/users/${id}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${getAuthToken()}`
                },
                body: JSON.stringify({ isActive: !currentStatus }),
            });

            if (response.ok) {
                toast.success(currentStatus ? "Identity De-authorized." : "Identity Restored.", {
                    description: "Authorization state broadcast to all network nodes."
                });
                fetchUsers();
            } else {
                toast.error("Command Override Rejected");
            }
        } catch (err) {
            toast.error("Network Latency Fault");
        }
    };

    return (
        <AppLayout>
            <style>{`
                .identity-card {
                    background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.7) 100%);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255,255,255,0.8);
                    transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
                }
                .identity-card:hover {
                    box-shadow: 0 30px 60px -15px rgba(0,0,0,0.1);
                    border-color: rgba(16, 185, 129, 0.3);
                }
                .fingerprint-glow {
                    filter: drop-shadow(0 0 8px rgba(16, 185, 129, 0.4));
                }
            `}</style>

            {/* Kinetic Header */}
            <div className="mb-14 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 text-left relative">
                <div className="absolute -top-10 -left-10 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full -z-10"></div>

                <div className="space-y-6">
                    <div className="flex flex-wrap gap-4">
                        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 glass-soft">
                            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none">Security Protocol Active</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-none">
                            Identity <span className="text-emerald-500">Hub.</span>
                        </h1>
                        <p className="text-slate-400 font-bold text-base max-w-xl italic">
                            Personnel registry management with integrated role-based access control and biometric identity traces.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-10 pr-6">
                    <div className="flex flex-col items-end border-r pr-10 border-slate-100">
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] leading-none mb-3">Verified Nodes</span>
                        <span className="text-4xl font-black text-emerald-500 tracking-tighter leading-none">
                            {users.filter(u => u.isActive).length}
                            <span className="text-xs text-slate-300 font-black uppercase ml-2 tracking-widest">Active</span>
                        </span>
                    </div>
                    <div className="w-16 h-16 rounded-[24px] bg-slate-950 flex items-center justify-center text-emerald-500 shadow-2xl relative group cursor-pointer hover:rotate-12 transition-transform">
                        <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full scale-0 group-hover:scale-150 transition-transform"></div>
                        <Fingerprint size={28} className="relative z-10 fingerprint-glow" />
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-10">
                {/* Left Aspect: Identity Provisioning Terminal */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-white/90 backdrop-blur-2xl rounded-[48px] border border-white/50 shadow-2xl shadow-emerald-500/5 overflow-hidden text-left">
                        <div className="p-10 border-b border-slate-50 flex items-center gap-5">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/20">
                                <UserPlus size={24} />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                                Provision <br /> Node.
                            </h2>
                        </div>
                        <form onSubmit={handleCreateUser} className="p-10 space-y-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Identity Nomenclature *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. CORE-OPERATOR-01"
                                    className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-[22px] text-[14px] font-bold text-slate-800 outline-none focus:bg-white focus:border-emerald-500/50 transition-all shadow-inner"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Access Alias *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="alias_node"
                                        className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-[22px] text-[13px] font-bold text-slate-800 outline-none focus:bg-white focus:border-emerald-500/50 transition-all"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Comm Trace *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="9876543210"
                                        className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-[22px] text-[13px] font-bold text-slate-800 outline-none focus:bg-white focus:border-emerald-500/50 transition-all"
                                        value={formData.mobile}
                                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3 text-left">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Auth Tier *</label>
                                    <select
                                        className="w-full h-14 px-5 bg-slate-50 border border-slate-100 rounded-[22px] text-[10px] font-black uppercase tracking-widest outline-none transition-all cursor-pointer appearance-none focus:bg-white"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        disabled={isOperator}
                                    >
                                        {!isOperator && <option value="OPERATOR">OPERATOR</option>}
                                        {!isOperator && <option value="ADMIN">ADMIN</option>}
                                        <option value="VIEWER">VIEWER</option>
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Domain Link</label>
                                    <input
                                        type="text"
                                        placeholder="Hub-Ops"
                                        className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-[22px] text-[13px] font-bold text-slate-800 outline-none focus:bg-white transition-all"
                                        value={formData.department}
                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Crypt-Key Sequence *</label>
                                <div className="relative">
                                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                                    <input
                                        type="password"
                                        required
                                        placeholder="••••••••••••"
                                        className="w-full h-14 pl-14 pr-6 bg-slate-50 border border-slate-100 rounded-[22px] text-[14px] font-bold text-slate-800 outline-none focus:bg-white transition-all shadow-inner"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="group w-full h-16 bg-slate-950 text-white font-black text-[12px] uppercase tracking-[0.3em] rounded-[24px] hover:bg-emerald-500 hover:text-slate-950 shadow-2xl shadow-slate-950/20 transition-all flex items-center justify-center gap-4 active:scale-[0.98] disabled:opacity-50"
                            >
                                <Key size={20} className="group-hover:rotate-45 transition-transform" />
                                {isLoading ? "SYNCHRONIZING..." : "Inject Identity"}
                            </button>
                        </form>
                    </div>

                    <div className="p-8 bg-emerald-500 rounded-[48px] text-slate-950 shadow-xl shadow-emerald-500/10 flex flex-col justify-between aspect-square lg:aspect-auto">
                        <div className="flex justify-between items-start">
                            <div className="p-4 bg-slate-950 text-emerald-500 rounded-3xl shadow-lg">
                                <ShieldCheck size={32} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-950/40">Secure Node</span>
                        </div>
                        <div className="text-left mt-10">
                            <h3 className="text-3xl font-black tracking-tighter uppercase leading-none mb-4">Integrity <br /> Guard Active.</h3>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-950/60 leading-relaxed">
                                Continuous spatial monitoring and access trace logging is standard for all provisioned identities.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Aspect: Global Personnel Registry */}
                <div className="lg:col-span-8">
                    <div className="bg-white/90 backdrop-blur-2xl rounded-[48px] border border-white/50 shadow-2xl shadow-emerald-500/5 overflow-hidden text-left">
                        <div className="p-10 border-b border-slate-50 flex justify-between items-center text-left">
                            <div className="space-y-1">
                                <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Personnel Registry.</h2>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                                    <Terminal size={12} className="text-emerald-500" />
                                    Active Identity Nodes
                                </div>
                            </div>
                            {isFetching && <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />}
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-slate-50/50">
                                        <th className="px-10 py-6 text-left font-black text-slate-400 uppercase text-[10px] tracking-[0.3em]">Identity Node</th>
                                        <th className="px-10 py-6 text-left font-black text-slate-400 uppercase text-[10px] tracking-[0.3em]">Auth Tier</th>
                                        <th className="px-10 py-6 text-center font-black text-slate-400 uppercase text-[10px] tracking-[0.3em]">State</th>
                                        <th className="px-10 py-6 text-right font-black text-slate-400 uppercase text-[10px] tracking-[0.3em]">Override</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {users.map((u, idx) => (
                                        <tr key={u.id} className="group hover:bg-white transition-all transform hover:scale-[1.01] hover:shadow-xl relative" style={{ transitionDelay: `${idx * 50}ms` }}>
                                            <td className="px-10 py-8 text-left">
                                                <div className="flex items-center gap-6">
                                                    <div className="relative">
                                                        <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all transform group-hover:rotate-12">
                                                            <User size={24} />
                                                        </div>
                                                        {u.isActive && <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-white rounded-full"></div>}
                                                    </div>
                                                    <div>
                                                        <div className="font-black text-slate-950 text-base tracking-tight group-hover:text-emerald-600 transition-colors uppercase">{u.name}</div>
                                                        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                                                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]">@{u.username}</span>
                                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-100"></div>
                                                            <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-300 uppercase italic">
                                                                <Activity size={10} className="text-emerald-500" />
                                                                Last: {u.lastLogin ? new Date(u.lastLogin).toLocaleTimeString() : 'N/A'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-left">
                                                <span className={`inline-flex items-center px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${u.role === 'ADMIN' ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]' :
                                                    u.role === 'OPERATOR' ? 'bg-slate-950 text-white border-slate-800' :
                                                        'bg-slate-50 text-slate-400 border-slate-100'
                                                    }`}>
                                                    {u.role}
                                                </span>
                                                <div className="text-[10px] font-black text-slate-300 mt-2.5 uppercase tracking-widest">{u.department || 'GENERAL-UNIT'}</div>
                                            </td>
                                            <td className="px-10 py-8 text-center">
                                                <span className={`inline-flex items-center px-5 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-widest border transition-all ${u.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-500 border-rose-100 shadow-[0_0_15px_rgba(244,63,94,0.1)]'
                                                    }`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full mr-2 ${u.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>
                                                    {u.isActive ? 'OPERATIONAL' : 'REVOKED'}
                                                </span>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <button
                                                    onClick={() => toggleStatus(u.id, u.isActive)}
                                                    disabled={isOperator && u.role !== 'VIEWER'}
                                                    className={`group/btn flex items-center justify-center gap-3 h-12 px-6 border rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all ml-auto ${isOperator && u.role !== 'VIEWER'
                                                        ? 'bg-slate-50 text-slate-200 border-slate-100 cursor-not-allowed opacity-30'
                                                        : u.isActive
                                                            ? 'bg-white text-rose-500 border-rose-100 hover:bg-rose-50'
                                                            : 'bg-emerald-500 text-slate-950 border-emerald-400 hover:bg-emerald-400 shadow-xl shadow-emerald-500/20'
                                                        }`}
                                                >
                                                    {u.isActive ? (
                                                        <>
                                                            <PowerOff size={14} className="group-hover/btn:scale-110 transition-transform" />
                                                            Disable
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Power size={14} className="group-hover/btn:scale-110 animate-pulse transition-transform" />
                                                            Restore
                                                        </>
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {users.length === 0 && !isFetching && (
                                        <tr>
                                            <td colSpan={4} className="px-10 py-40 text-center">
                                                <div className="flex flex-col items-center gap-6">
                                                    <div className="w-24 h-24 rounded-[40px] bg-slate-50 flex items-center justify-center text-slate-200 border border-dashed border-slate-200">
                                                        <Cpu size={48} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Registry Silent</h4>
                                                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">Zero Personnel Nodes Detected</p>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="mt-14 flex items-center justify-center lg:justify-start gap-5">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Integrated Identity Flux • High-Security Hub Environment • Encrypted</p>
                    </div>
                </div>
            </div>

            <footer className="mt-24 pt-12 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-8">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Unified Identity OS • Trace Cycle: Active • SEC-LEVEL-ALPHA</p>
                <div className="flex gap-12">
                    <button className="text-[9px] font-black text-slate-400 hover:text-emerald-500 uppercase tracking-widest transition-colors">Auth Protocols</button>
                    <button className="text-[9px] font-black text-slate-400 hover:text-emerald-500 uppercase tracking-widest transition-colors">Access Logs</button>
                    <button className="text-[9px] font-black text-slate-400 hover:text-emerald-500 uppercase tracking-widest transition-colors">Security Audit</button>
                </div>
            </footer>
        </AppLayout>
    );
};

export default UserManagement;
