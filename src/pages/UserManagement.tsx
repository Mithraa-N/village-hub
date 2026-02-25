import React, { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { getAuthToken } from "@/lib/auth";
import { toast } from "sonner";
import { UserPlus, Shield, UserCog } from "lucide-react";

const UserManagement = () => {
    const [formData, setFormData] = useState({
        username: "",
        mobile: "",
        name: "",
        password: "",
        role: "OPERATOR",
        department: ""
    });
    const [isLoading, setIsLoading] = useState(false);

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
                toast.success(`User ${formData.username} created successfully as ${formData.role}`);
                setFormData({
                    username: "",
                    mobile: "",
                    name: "",
                    password: "",
                    role: "OPERATOR",
                    department: ""
                });
            } else {
                toast.error(data.message || "Failed to create user");
            }
        } catch (err) {
            toast.error("Connection error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AppLayout>
            <div className="page-header">
                <h1>User Management</h1>
                <p>Register new staff members (Operators & Admins)</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Information Card */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
                        <h3 className="font-bold flex items-center gap-2 mb-3 text-slate-900">
                            <Shield className="h-5 w-5 text-primary" />
                            Access Control Policy
                        </h3>
                        <ul className="text-sm space-y-3 text-slate-600">
                            <li className="flex gap-2">
                                <span className="font-bold text-primary">•</span>
                                <strong>Admins:</strong> Full access to all modules including budget and users.
                            </li>
                            <li className="flex gap-2">
                                <span className="font-bold text-primary">•</span>
                                <strong>Operators:</strong> Can manage assets and complaints but no budget access.
                            </li>
                            <li className="flex gap-2">
                                <span className="font-bold text-primary">•</span>
                                <strong>Security:</strong> All creations are logged for government auditing.
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Create User Form */}
                <div className="lg:col-span-2">
                    <div className="bg-card border rounded-lg p-6">
                        <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <UserPlus className="h-5 w-5" />
                            Register New Staff Member
                        </h2>

                        <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold uppercase mb-1 text-slate-500 underline underline-offset-4">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full h-11 px-4 border rounded focus:border-primary outline-none font-medium text-sm"
                                    placeholder="Full Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase mb-1 text-slate-500">Username</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full h-11 px-4 border rounded focus:border-primary outline-none font-medium text-sm"
                                    placeholder="Username"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase mb-1 text-slate-500">Mobile Number</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full h-11 px-4 border rounded focus:border-primary outline-none font-medium text-sm"
                                    placeholder="Mobile Number"
                                    value={formData.mobile}
                                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase mb-1 text-slate-500">Assign Role</label>
                                <select
                                    required
                                    className="w-full h-11 px-4 border rounded focus:border-primary outline-none font-medium text-sm bg-white"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="OPERATOR">OPERATOR (Field Staff)</option>
                                    <option value="ADMIN">ADMIN (Office Manager)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase mb-1 text-slate-500">Department</label>
                                <input
                                    type="text"
                                    className="w-full h-11 px-4 border rounded focus:border-primary outline-none font-medium text-sm"
                                    placeholder="e.g. Water, Education"
                                    value={formData.department}
                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold uppercase mb-1 text-slate-500">Password</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full h-11 px-4 border rounded focus:border-primary outline-none font-medium text-sm"
                                    placeholder="Initial Password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>

                            <div className="md:col-span-2 pt-4">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`w-full h-12 font-bold rounded flex items-center justify-center gap-2 ${isLoading ? "bg-slate-100 text-slate-400" : "bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                                        }`}
                                >
                                    {isLoading ? "PROCESSSING..." : (
                                        <>
                                            <UserCog className="h-5 w-5" />
                                            CREATE STAFF ACCOUNT
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default UserManagement;
