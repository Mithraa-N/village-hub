import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setAuthToken, setUser, User, Role } from "@/lib/auth";
import { toast } from "sonner";

const Login = () => {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!identifier || !password) return;

        setIsLoading(true);
        setError("");

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout for rural connections

            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier, password }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            const data = await response.json();

            if (response.ok) {
                setAuthToken(data.accessToken);
                setUser(data.user);

                toast.success(`Welcome back, ${data.user.name}`);

                // Role-based redirection
                const role = data.user.role as Role;
                if (role === "ADMIN") navigate("/");
                else if (role === "OPERATOR") navigate("/");
                else navigate("/"); // Default for now, generic dashboard
            } else {
                setError("Invalid username or password. Please try again.");
            }
        } catch (err: any) {
            if (err.name === "AbortError") {
                setError("Connection too slow. Please check your internet and try again.");
            } else {
                setError("Unable to connect to server. Please try again later.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white p-4 font-sans">
            <div className="w-full max-w-md border-2 border-slate-200 p-8 rounded-lg">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-slate-900 border-b-4 border-primary inline-block pb-1">
                        Village Hub Login
                    </h1>
                    <p className="mt-4 text-slate-600 font-medium">
                        Authorized Personnel Only
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label
                            htmlFor="identifier"
                            className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide"
                        >
                            Username / Mobile Number
                        </label>
                        <input
                            id="identifier"
                            type="text"
                            required
                            className="w-full h-14 px-4 text-lg border-2 border-slate-300 rounded focus:border-primary focus:ring-0 outline-none transition-colors"
                            placeholder="e.g. 9876543210"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            className="w-full h-14 px-4 text-lg border-2 border-slate-300 rounded focus:border-primary focus:ring-0 outline-none transition-colors"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-bold">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full h-16 text-xl font-bold rounded transition-all flex items-center justify-center ${isLoading
                                ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                                : "bg-primary text-white hover:bg-primary/90 active:scale-[0.98]"
                            }`}
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-6 w-6 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Connecting...
                            </span>
                        ) : "LOGIN"}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                    <p className="text-xs text-slate-400 font-medium">
                        System Version 1.0.4 · Village Hub Digital administration
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
