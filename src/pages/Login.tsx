import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setAuthToken, Role, getRoleDefaultPath } from "@/lib/auth";
import { toast } from "sonner";
import { Shield, UserCog, Eye, Lock, User, CheckCircle2, AlertCircle, Loader2, ArrowRight } from "lucide-react";

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
                    setError(`Account verification failed. This ID is registered as ${verifiedRole}.`);
                    setIsLoading(false);
                    return;
                }

                setAuthToken(data.accessToken);
                toast.success(`Access Authorization Granted: ${verifiedRole}.`);

                const targetPath = getRoleDefaultPath(verifiedRole);
                navigate(targetPath, { replace: true });
            } else {
                setError(data.message || "Authentication failed. Invalid system credentials.");
            }
        } catch (err: any) {
            setError("Synchronization Fault: System host is currently unreachable.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
            <div className="w-full max-w-2xl text-center mb-16">
                <div className="inline-flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-primary text-white rounded-sm flex items-center justify-center font-bold text-xl">GP</div>
                    <div className="h-10 w-[2px] bg-slate-200"></div>
                    <div className="text-left">
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tighter leading-none">GRAM PANCHAYAT</h1>
                        <p className="text-[11px] font-bold text-primary uppercase tracking-[0.2em] mt-1">Village Hub Digital Portal</p>
                    </div>
                </div>
                <div className="h-0.5 bg-slate-100 w-full mb-2"></div>
                <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px]">
                    Authorized Government Personnel Entry System
                </p>
            </div>

            <div className="w-full max-w-[440px] bg-white border border-slate-200 shadow-sm">
                <div className="bg-secondary px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2">
                        {step === "selection" ? <Shield className="h-4 w-4 text-primary" /> : <Lock className="h-4 w-4 text-primary" />}
                        {step === "selection" ? "Standard Access Selection" : `System Authentication: ${selectedRole}`}
                    </span>
                    {step === "form" && (
                        <button
                            onClick={handleBack}
                            className="text-[10px] font-bold text-primary hover:underline uppercase tracking-tighter"
                        >
                            Change Role
                        </button>
                    )}
                </div>

                <div className="p-10">
                    {step === "selection" ? (
                        <div className="space-y-4">
                            <RoleCard
                                icon={<UserCog className="h-6 w-6" />}
                                title="ADMINISTRATOR"
                                description="Full system authority & staff oversight"
                                onClick={() => handleRoleSelect("ADMIN")}
                            />

                            <RoleCard
                                icon={<Lock className="h-6 w-6" />}
                                title="OPERATOR"
                                description="Inventory & grievance data management"
                                onClick={() => handleRoleSelect("OPERATOR")}
                            />

                            <RoleCard
                                icon={<Eye className="h-6 w-6" />}
                                title="EXTERNAL VIEWER"
                                description="Registry inspection & read-only access"
                                onClick={() => handleRoleSelect("VIEWER")}
                            />
                        </div>
                    ) : (
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="mb-8 bg-secondary/50 p-5 rounded-sm border border-slate-200 flex items-center gap-4">
                                <div className="bg-primary text-white p-2.5 rounded-sm">
                                    {selectedRole === "ADMIN" ? <UserCog size={24} /> : selectedRole === "OPERATOR" ? <Lock size={24} /> : <Eye size={24} />}
                                </div>
                                <div>
                                    <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Active Access Domain</div>
                                    <div className="font-bold text-slate-800 text-sm tracking-tight">{selectedRole} PORTAL</div>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                    Official System ID / Mobile
                                </label>
                                <input
                                    type="text"
                                    required
                                    autoFocus
                                    className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-sm focus:border-primary focus:bg-white outline-none transition-all font-bold text-slate-800"
                                    placeholder="Enter verified identifier"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                    Access Pin / Security Password
                                </label>
                                <input
                                    type="password"
                                    required
                                    className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-sm focus:border-primary focus:bg-white outline-none transition-all font-bold text-slate-800"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>

                            {error && (
                                <div className="p-4 bg-destructive/10 border-l-4 border-destructive rounded-sm flex items-start gap-3">
                                    <AlertCircle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
                                    <p className="text-[11px] font-bold text-destructive uppercase tracking-tighter leading-tight">{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full h-14 font-bold rounded-sm transition-all flex items-center justify-center gap-3 shadow-sm text-xs uppercase tracking-[0.3em] ${isLoading
                                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                                    : "bg-primary text-white hover:bg-[#1a3d2e] border-b-2 border-[#0e221a]"
                                    }`}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin h-5 w-5" />
                                        SYNCHRONIZING...
                                    </>
                                ) : "INITIALIZE SECURE LOGIN"}
                            </button>
                        </form>
                    )}
                </div>
            </div>

            <div className="mt-12 text-center max-w-lg border-t pt-8 border-slate-100">
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] leading-relaxed">
                    Legal Notice: This system is for verified government functionaries only.
                    Any attempt at unauthorized access violates Subsection 4.b of the Information Technology Act.
                    <br />
                    <span className="text-primary/60 mt-2 block">VILLAGE HUB DIGITAL INFRASTRUCTURE © 2026</span>
                </p>
            </div>
        </div>
    );
};

function RoleCard({ icon, title, description, onClick }: {
    icon: React.ReactNode;
    title: string;
    description: string;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className="w-full p-6 text-left bg-white border border-slate-200 hover:border-primary hover:bg-slate-50 transition-all flex items-center gap-5 rounded-sm group relative"
        >
            <div className="text-slate-400 group-hover:text-primary transition-colors">
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <div className="font-bold text-slate-800 tracking-tight text-sm uppercase">{title}</div>
                <div className="text-[10px] font-medium text-slate-400 mt-0.5">{description}</div>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight size={16} className="text-primary" />
            </div>
        </button>
    );
}

export default Login;
