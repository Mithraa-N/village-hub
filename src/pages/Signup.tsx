import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import {
    UserPlus,
    ArrowRight,
    ShieldCheck,
    Shield,
    ChevronRight,
    Loader2,
    CheckCircle2
} from "lucide-react";

const Signup = () => {
    const [formData, setFormData] = useState({
        username: "",
        mobile: "",
        name: "",
        password: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const response = await fetch("http://localhost:5000/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Identity Provisioned.", {
                    description: "Your citizen account has been created. You can now access the hub."
                });
                navigate("/login");
            } else {
                setError(data.message || "Identity construction failed.");
            }
        } catch (err) {
            setError("Communication link severed. Retry later.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center bg-slate-950 overflow-hidden font-sans">
            {/* Ambient Background Elements */}
            <div className="absolute inset-0 bg-[url('/hero-bg.png')] bg-cover bg-center opacity-30 grayscale-[0.5]"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-slate-950 to-indigo-500/10"></div>

            {/* Animated Grid Pattern */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-150"></div>

            <div className="relative z-10 w-full max-w-xl p-4 lg:p-10 animate-in fade-in zoom-in duration-1000">
                <div className="bg-white/95 backdrop-blur-2xl rounded-[48px] border border-white/20 shadow-2xl p-8 lg:p-16 text-left">
                    <div className="mb-12 text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/20 mb-6">
                            <UserPlus className="h-3 w-3 text-emerald-500" />
                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none">Citizen Onboarding</span>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter leading-none mb-4">
                            Join the <br /> <span className="text-emerald-500">Ecosystem.</span>
                        </h1>
                        <p className="text-slate-400 font-semibold text-sm italic">
                            Provision your digital identity for the Smart Village Hub.
                        </p>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Identity Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-bold text-slate-800 focus:bg-white focus:border-emerald-500/50 outline-none transition-all shadow-inner"
                                    placeholder="e.g. Rahul Sharma"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Preferred Alias</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-bold text-slate-800 focus:bg-white focus:border-emerald-500/50 outline-none transition-all shadow-inner"
                                    placeholder="jcarter_22"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Linking Identifier (Mobile)</label>
                            <input
                                type="text"
                                required
                                className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-bold text-slate-800 focus:bg-white focus:border-emerald-500/50 outline-none transition-all shadow-inner"
                                placeholder="e.g. 9876543210"
                                value={formData.mobile}
                                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                disabled={isLoading}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Security Trace (Password)</label>
                            <input
                                type="password"
                                required
                                className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-bold text-slate-800 focus:bg-white focus:border-emerald-500/50 outline-none transition-all shadow-inner"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                disabled={isLoading}
                            />
                        </div>

                        {error && (
                            <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-100 rounded-2xl animate-in slide-in-from-top-2 duration-300">
                                <Shield className="h-5 w-5 text-rose-500 shrink-0" />
                                <p className="text-rose-600 text-xs font-black uppercase tracking-tight leading-none">{error}</p>
                            </div>
                        )}

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="group w-full h-16 bg-slate-900 text-white font-black text-xs uppercase tracking-[0.3em] rounded-[24px] hover:bg-slate-800 shadow-2xl shadow-slate-900/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin text-emerald-400" />
                                        PROVISIONING...
                                    </>
                                ) : (
                                    <>
                                        COMMENCE ONBOARDING
                                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-12 pt-10 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Already indexed?{" "}
                            <Link to="/login" className="text-emerald-500 hover:text-emerald-600 transition-colors ml-1">
                                Secure Login
                            </Link>
                        </p>
                        <div className="flex items-center gap-4 text-slate-300">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 size={12} className="text-emerald-500" />
                                <span className="text-[9px] font-black uppercase tracking-widest">TLS 1.3</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 size={12} className="text-emerald-500" />
                                <span className="text-[9px] font-black uppercase tracking-widest">256-BIT CRYPT</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
