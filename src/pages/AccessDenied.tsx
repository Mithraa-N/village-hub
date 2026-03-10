import { ShieldAlert, Home, Lock, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { getUser, getRoleDefaultPath } from "@/lib/auth";

const AccessDenied = () => {
    const user = getUser();
    const homePath = user ? getRoleDefaultPath(user.role) : "/login";

    return (
        <div className="min-h-screen relative flex items-center justify-center bg-slate-950 overflow-hidden font-sans">
            {/* Ambient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 via-slate-950 to-amber-500/10"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

            <div className="relative z-10 w-full max-w-lg p-6 animate-in fade-in zoom-in duration-700">
                <div className="bg-white/95 backdrop-blur-2xl rounded-[48px] border border-white/20 shadow-2xl p-10 lg:p-16 text-center">
                    <div className="relative mx-auto w-24 h-24 mb-10">
                        <div className="absolute inset-0 bg-rose-500/20 blur-2xl rounded-full animate-pulse"></div>
                        <div className="relative w-full h-full bg-rose-50 border border-rose-100 rounded-3xl flex items-center justify-center text-rose-500">
                            <Lock size={48} className="animate-bounce-slow" />
                        </div>
                    </div>

                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/10 rounded-lg border border-rose-500/20 mb-6">
                        <ShieldAlert className="h-3 w-3 text-rose-500" />
                        <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest leading-none">Authorization Mismatch</span>
                    </div>

                    <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter leading-none mb-6">
                        Access <span className="text-rose-500">Denied.</span>
                    </h1>

                    <p className="text-slate-400 font-semibold text-sm max-w-xs mx-auto mb-12 italic leading-relaxed">
                        Security protocol violation detected. System identity <span className="text-slate-800 font-black not-italic bg-slate-100 px-1.5 py-0.5 rounded-lg">{user?.name || 'ANONYMOUS'}</span> possesses insufficient clearance for this sector.
                    </p>

                    <div className="flex flex-col gap-4">
                        <Link
                            to={homePath}
                            className="group h-16 bg-slate-900 text-white font-black text-xs uppercase tracking-[0.3em] rounded-[24px] hover:bg-slate-800 shadow-xl shadow-slate-900/10 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                        >
                            <Home size={18} className="text-emerald-400" />
                            Secure Area
                        </Link>

                        <div className="flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 py-3 rounded-2xl border border-slate-100 italic">
                            <AlertCircle size={14} className="text-rose-400" />
                            Attempt logged with system timestamp
                        </div>
                    </div>

                    <div className="mt-12 flex items-center justify-center gap-4 border-t border-slate-50 pt-8">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">Integrated Hub OS • Security Registry Active</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccessDenied;
