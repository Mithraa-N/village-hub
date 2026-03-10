import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setAuthToken, Role, getRoleDefaultPath } from "@/lib/auth";
import { toast } from "sonner";
import {
    Shield,
    UserCog,
    Eye,
    Lock,
    User,
    CheckCircle2,
    AlertCircle,
    Loader2,
    ArrowRight,
    Leaf,
    Sparkles,
    ShieldCheck
} from "lucide-react";

type LoginStep = "selection" | "form";

const Login = () => {
    const [step, setStep] = useState<LoginStep>("selection");
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleRoleSelect = (role: Role) => {
        setSelectedRole(role);
        setStep("form");
        setError("");
    };

    const handleBack = () => {
        setStep("selection");
        setIdentifier("");
        setPassword("");
        setError("");
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!identifier || !password || !selectedRole) return;

        setIsLoading(true);
        setError("");

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 12000);

            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier, password }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);
            const data = await response.json();

            if (response.ok) {
                const verifiedRole = data.user.role as Role;

                if (verifiedRole !== selectedRole) {
                    setError(`Verification mismatch. This ID is registered as ${verifiedRole}.`);
                    setIsLoading(false);
                    return;
                }

                setAuthToken(data.accessToken);
                toast.success(`Welcome back, ${verifiedRole}.`, {
                    description: "Your session has been securely initialized.",
                });

                const targetPath = getRoleDefaultPath(verifiedRole);
                navigate(targetPath, { replace: true });
            } else {
                setError(data.message || "Invalid credentials. Please verify your system ID and password.");
            }
        } catch (err: any) {
            setError("Connection Error: Unable to synchronize with the secure host.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center p-6 bg-slate-950 overflow-hidden">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
                style={{ backgroundImage: "url('/hero-bg.png')" }}
            >
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/90 via-slate-950/40 to-slate-900/10"></div>
                <div className="absolute inset-0 backdrop-blur-[2px]"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-5xl grid lg:grid-cols-2 gap-12 items-center">

                {/* Brand Side */}
                <div className="hidden lg:flex flex-col space-y-8 text-white">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 w-fit">
                            <Sparkles className="h-4 w-4 text-emerald-400" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-100">The Future of Rural Tech</span>
                        </div>
                        <h1 className="text-6xl font-black tracking-tight leading-[0.9]">
                            VILLAGE <br />
                            <span className="text-emerald-400">HUB.</span>
                        </h1>
                        <p className="text-xl text-slate-300 max-w-md font-medium leading-relaxed">
                            A premium management ecosystem designed to empower communities through digital innovation.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-8">
                        <Feature icon={<ShieldCheck className="h-5 w-5" />} text="Military Grade Security" />
                        <Feature icon={<Leaf className="h-5 w-5" />} text="Sustainability First" />
                        <Feature icon={<UserCog className="h-5 w-5" />} text="Total Transparency" />
                        <Feature icon={<Sparkles className="h-5 w-5" />} text="Advanced Analytics" />
                    </div>
                </div>

                {/* Login Card */}
                <div className="w-full max-w-[480px] mx-auto">
                    <div className="bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-[32px] overflow-hidden">

                        {/* Header */}
                        <div className="p-8 pb-4 text-center">
                            <div className="lg:hidden mb-8">
                                <h1 className="text-3xl font-black text-white tracking-tighter">VILLAGE HUB.</h1>
                            </div>
                            <h2 className="text-2xl font-bold text-white tracking-tight">Access Portal</h2>
                            <p className="text-slate-400 text-sm mt-1">Please select your role to continue</p>
                        </div>

                        {/* Transitions */}
                        <div className="p-8 pt-4">
                            {step === "selection" ? (
                                <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <RoleCard
                                        icon={<UserCog className="h-5 w-5" />}
                                        title="Administrator"
                                        description="Full system control & oversight"
                                        onClick={() => handleRoleSelect("ADMIN")}
                                    />
                                    <RoleCard
                                        icon={<Lock className="h-5 w-5" />}
                                        title="Operator"
                                        description="Manage logs & community data"
                                        onClick={() => handleRoleSelect("OPERATOR")}
                                    />
                                    <RoleCard
                                        icon={<Eye className="h-5 w-5" />}
                                        title="Viewer"
                                        description="Public records & inspection"
                                        onClick={() => handleRoleSelect("VIEWER")}
                                    />
                                </div>
                            ) : (
                                <form onSubmit={handleLogin} className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div className="flex items-center justify-between mb-2">
                                        <button
                                            type="button"
                                            onClick={handleBack}
                                            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors uppercase tracking-widest flex items-center gap-2"
                                        >
                                            <ArrowRight className="h-3 w-3 rotate-180" />
                                            Change Role
                                        </button>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-white/5 px-2 py-1 rounded">
                                            {selectedRole} Access
                                        </span>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">System Identifier</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                            <input
                                                type="text"
                                                required
                                                autoFocus
                                                value={identifier}
                                                onChange={(e) => setIdentifier(e.target.value)}
                                                className="w-full h-14 pl-12 pr-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:border-emerald-500/50 focus:bg-white/10 outline-none transition-all ring-0"
                                                placeholder="System ID or Email"
                                                disabled={isLoading}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Access Token</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                            <input
                                                type="password"
                                                required
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full h-14 pl-12 pr-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:border-emerald-500/50 focus:bg-white/10 outline-none transition-all ring-0"
                                                placeholder="••••••••"
                                                disabled={isLoading}
                                            />
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3">
                                            <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                                            <p className="text-xs font-semibold text-red-200 leading-tight text-left">{error}</p>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`w-full h-14 font-bold rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/20 active:scale-[0.98] ${isLoading
                                            ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                                            : "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                                            }`}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="animate-spin h-5 w-5" />
                                                Verifying...
                                            </>
                                        ) : (
                                            <>
                                                Initialize Access
                                                <ArrowRight className="h-4 w-4" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="relative z-10 mt-12 text-center">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em]">
                    Village Hub OS © 2026 • Powered by Digital Infrastructure
                </p>
            </div>
        </div>
    );
};

function Feature({ icon, text }: { icon: React.ReactNode; text: string }) {
    return (
        <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 border border-emerald-500/20">
                {icon}
            </div>
            <span className="text-sm font-semibold text-slate-200">{text}</span>
        </div>
    );
}

function RoleCard({ icon, title, description, onClick }: {
    icon: React.ReactNode;
    title: string;
    description: string;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className="w-full p-5 text-left bg-white/5 border border-white/10 hover:border-emerald-500/50 hover:bg-white/10 transition-all flex items-center gap-4 rounded-2xl group"
        >
            <div className="p-3 bg-white/5 rounded-xl text-slate-400 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 transition-all border border-transparent group-hover:border-emerald-500/20">
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <div className="font-bold text-white tracking-tight group-hover:text-emerald-400 transition-colors uppercase text-xs">{title}</div>
                <div className="text-[10px] font-medium text-slate-500 mt-0.5 group-hover:text-slate-400 transition-colors text-left">{description}</div>
            </div>
            <div className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                <ArrowRight size={16} className="text-emerald-400" />
            </div>
        </button>
    );
}

export default Login;
