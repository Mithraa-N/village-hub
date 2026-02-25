import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";

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
                toast.success("Account created successfully as Viewer. You can now login.");
                navigate("/login");
            } else {
                setError(data.message || "Failed to create account.");
            }
        } catch (err) {
            setError("Unable to connect to server. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white p-4 font-sans">
            <div className="w-full max-w-md border-2 border-slate-200 p-8 rounded-lg">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-slate-900 border-b-4 border-primary inline-block pb-1">
                        Create Account
                    </h1>
                    <p className="mt-4 text-slate-600 font-medium">
                        Join Village Hub as a Citizen (Viewer)
                    </p>
                </div>

                <form onSubmit={handleSignup} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            required
                            className="w-full h-12 px-4 border-2 border-slate-300 rounded focus:border-primary outline-none"
                            placeholder="e.g. Rahul Sharma"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Username</label>
                        <input
                            type="text"
                            required
                            className="w-full h-12 px-4 border-2 border-slate-300 rounded focus:border-primary outline-none"
                            placeholder="e.g. rahul123"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Mobile Number</label>
                        <input
                            type="text"
                            required
                            className="w-full h-12 px-4 border-2 border-slate-300 rounded focus:border-primary outline-none"
                            placeholder="e.g. 9876543210"
                            value={formData.mobile}
                            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full h-12 px-4 border-2 border-slate-300 rounded focus:border-primary outline-none"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                        className={`w-full h-14 text-xl font-bold rounded transition-all ${isLoading ? "bg-slate-200 text-slate-500" : "bg-primary text-white hover:bg-primary/90"
                            }`}
                    >
                        {isLoading ? "CREATING..." : "SIGN UP"}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-slate-600">
                        Already have an account?{" "}
                        <Link to="/login" className="text-primary font-bold hover:underline">
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
