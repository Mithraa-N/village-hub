import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setAuthToken, Role, getRoleDefaultPath } from "@/lib/auth";
import { toast } from "sonner";
import { Shield, UserCog, Eye, Lock, User, Phone, CheckCircle2, AlertCircle } from "lucide-react";

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

                // CRITICAL: Check if verified role matches selected context
                if (verifiedRole !== selectedRole) {
                    setError(`Access type mismatch. This account is registered as ${verifiedRole}. Please select the correct role.`);
                    setIsLoading(false);
                    return;
                }

                setAuthToken(data.accessToken);
                toast.success(`Namaste, ${data.user.name}. Authentication Successful.`);

                const targetPath = getRoleDefaultPath(verifiedRole);
                navigate(targetPath, { replace: true });
            } else {
                setError(data.message || "Invalid credentials. Please verify your details.");
            }
        } catch (err: any) {
            if (err.name === "AbortError") {
                setError("Connection timed out. Please try again on a stable network.");
            } else {
                setError("Network error. Unable to reach the central administration server.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8faf7] p-4">
            {/* Header Section */}
            <div className="w-full max-w-xl text-center mb-10">
                <div className="flex justify-center mb-4">
                    <div className="bg-primary p-3 rounded-full shadow-md border-4 border-white">
                        <Shield className="h-10 w-10 text-white" />
                    </div>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight font-heading">
                    VILLAGE HUB DIGITAL SYSTEM
                </h1>
                <p className="text-slate-600 font-bold mt-2 uppercase tracking-widest text-xs border-y border-slate-200 py-2 inline-block px-4">
                    Government of Rural Administration · Official Portal
                </p>
            </div>

            <div className="w-full max-w-[500px] bg-white border-2 border-slate-200 rounded-xl shadow-sm overflow-hidden transition-all duration-300">
                <div className="bg-primary/5 px-8 py-4 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-sm font-bold text-primary flex items-center gap-2">
                        {step === "selection" ? "STEP 1: SELECT ACCESS" : "STEP 2: VERIFY IDENTITY"}
                    </span>
                    {step === "form" && (
                        <button
                            onClick={handleBack}
                            className="text-[10px] font-bold text-slate-400 hover:text-primary underline uppercase"
                        >
                            Change Role
                        </button>
                    )}
                </div>

                <div className="p-8">
                    {step === "selection" ? (
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">Select Access Type</h2>

                            <RoleCard
                                icon={<UserCog className="h-6 w-6" />}
                                title="ADMIN"
                                description="Full system control & staff management"
                                onClick={() => handleRoleSelect("ADMIN")}
                            />

                            <RoleCard
                                icon={<Lock className="h-6 w-6" />}
                                title="OPERATOR"
                                description="Asset registry & complaint management"
                                onClick={() => handleRoleSelect("OPERATOR")}
                            />

                            <RoleCard
                                icon={<Eye className="h-6 w-6" />}
                                title="VIEWER"
                                description="Read-only dashboard for monitoring"
                                onClick={() => handleRoleSelect("VIEWER")}
                            />
                        </div>
                    ) : (
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="mb-4 bg-slate-50 p-4 rounded-lg border flex items-center gap-3">
                                <div className="bg-primary/10 p-2 rounded text-primary">
                                    {selectedRole === "ADMIN" ? <UserCog size={20} /> : selectedRole === "OPERATOR" ? <Lock size={20} /> : <Eye size={20} />}
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Selected Role</div>
                                    <div className="font-bold text-slate-800">{selectedRole}</div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider flex items-center gap-1">
                                    <User size={12} /> Username / Mobile Number
                                </label>
                                <input
                                    type="text"
                                    required
                                    autoFocus
                                    className="w-full h-14 px-4 text-lg border-2 border-slate-200 rounded-lg focus:border-primary focus:ring-0 outline-none transition-all placeholder:text-slate-300 font-medium"
                                    placeholder="Enter your ID"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider flex items-center gap-1">
                                    <CheckCircle2 size={12} /> Password / Security PIN
                                </label>
                                <input
                                    type="password"
                                    required
                                    className="w-full h-14 px-4 text-lg border-2 border-slate-200 rounded-lg focus:border-primary focus:ring-0 outline-none transition-all placeholder:text-slate-300 font-medium"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>

                            {error && (
                                <div className="p-4 bg-red-50 border-2 border-red-100 rounded-lg flex items-start gap-3">
                                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
                                    <p className="text-sm font-bold text-red-700 leading-tight">{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full h-16 text-lg font-bold rounded-lg transition-all flex items-center justify-center gap-3 shadow-md ${isLoading
                                    ? "bg-slate-200 text-slate-400 cursor-not-allowed border-0"
                                    : "bg-primary text-white hover:bg-[#1a3d2e] active:scale-[0.98] border-b-4 border-[#0e221a]"
                                    }`}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        AUTHENTICATING...
                                    </>
                                ) : "SECURE LOGIN"}
                            </button>
                        </form>
                    )}
                </div>
            </div>

            {/* Footer Notice */}
            <div className="mt-8 text-center max-w-md">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] leading-relaxed">
                    This system is for authorized government use only.
                    Unauthorized access attempts are logged and monitored.
                    <br />
                    Village Hub © 2026 · Digital India Initiative
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
            className="w-full p-5 text-left border-2 border-slate-100 rounded-xl hover:border-primary hover:bg-primary/5 transition-all group flex items-center gap-5 shadow-sm hover:shadow-md"
        >
            <div className="bg-slate-50 p-3 rounded-lg text-slate-400 group-hover:text-primary group-hover:bg-white transition-colors border group-hover:border-primary/20">
                {icon}
            </div>
            <div>
                <h3 className="font-bold text-slate-800 tracking-tight">{title}</h3>
                <p className="text-xs text-slate-500 font-medium">{description}</p>
            </div>
        </button>
    );
}

export default Login;

