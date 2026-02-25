import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/AppLayout";
import { getAuthToken } from "@/lib/auth";
import { toast } from "sonner";
import { UserPlus, Shield, UserCog, Power, PowerOff, Loader2 } from "lucide-react";

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
    const [formData, setFormData] = useState({
        username: "",
        mobile: "",
        name: "",
        password: "",
        role: "OPERATOR",
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
            console.error("Failed to fetch users");
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
                toast.success(`User ${formData.username} created successfully`);
                setFormData({
                    username: "",
                    mobile: "",
                    name: "",
                    password: "",
                    role: "OPERATOR",
                    department: ""
                });
                fetchUsers();
            } else {
                toast.error(data.message || "Failed to create user");
            }
        } catch (err) {
            toast.error("Connection error");
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
                toast.success("User status updated");
                fetchUsers();
            } else {
                toast.error("Failed to update status");
            }
        } catch (err) {
            toast.error("Network error");
        }
    };

    return (
        <AppLayout>
            <div className="page-header">
                <h1>User Management</h1>
                <p>Register and manage staff access levels</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Left Column: Register Form */}
                <div className="lg:col-span-1 border rounded-lg bg-card p-6 shadow-sm self-start">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <UserPlus className="h-5 w-5" />
                        Create Staff
                    </h2>
                    <form onSubmit={handleCreateUser} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase mb-1 text-slate-500">Name</label>
                            <input
                                type="text"
                                required
                                className="w-full h-10 px-3 border rounded text-sm outline-none focus:border-primary"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold uppercase mb-1 text-slate-500">Username</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full h-10 px-3 border rounded text-sm outline-none focus:border-primary"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase mb-1 text-slate-500">Mobile</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full h-10 px-3 border rounded text-sm outline-none focus:border-primary"
                                    value={formData.mobile}
                                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold uppercase mb-1 text-slate-500">Role</label>
                                <select
                                    className="w-full h-10 px-2 border rounded text-sm bg-white"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="OPERATOR">OPERATOR</option>
                                    <option value="ADMIN">ADMIN</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase mb-1 text-slate-500">Dept</label>
                                <input
                                    type="text"
                                    className="w-full h-10 px-3 border rounded text-sm outline-none focus:border-primary"
                                    value={formData.department}
                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase mb-1 text-slate-500">Password</label>
                            <input
                                type="password"
                                required
                                className="w-full h-10 px-3 border rounded text-sm outline-none focus:border-primary"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 bg-slate-900 text-white font-bold rounded hover:bg-slate-800 transition-colors disabled:bg-slate-200"
                        >
                            {isLoading ? "CREATING..." : "ADD ACCOUNT"}
                        </button>
                    </form>
                </div>

                {/* Right Column: User List */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-card border rounded-lg shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b flex justify-between items-center">
                            <h2 className="font-bold flex items-center gap-2">
                                <UserCog className="h-5 w-5 text-primary" />
                                Staff Directory
                            </h2>
                            {isFetching && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-muted/50 border-b">
                                        <th className="text-left px-6 py-3 font-medium text-muted-foreground">Staff Member</th>
                                        <th className="text-left px-6 py-3 font-medium text-muted-foreground">Role/Dept</th>
                                        <th className="text-center px-6 py-3 font-medium text-muted-foreground">Status</th>
                                        <th className="text-right px-6 py-3 font-medium text-muted-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {users.filter(u => u.role !== 'VIEWER').map(u => (
                                        <tr key={u.id} className="hover:bg-muted/30">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-900">{u.name}</div>
                                                <div className="text-xs text-muted-foreground">@{u.username} · {u.mobile}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${u.role === 'ADMIN' ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-600'}`}>
                                                    {u.role}
                                                </span>
                                                <div className="text-xs text-muted-foreground mt-1">{u.department || 'General'}</div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-flex px-2 py-1 rounded text-[10px] font-bold uppercase ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {u.isActive ? 'Active' : 'Disabled'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => toggleStatus(u.id, u.isActive)}
                                                    className={`p-2 rounded-full transition-colors ${u.isActive ? 'text-red-500 hover:bg-red-50' : 'text-green-500 hover:bg-green-50'}`}
                                                    title={u.isActive ? "Deactivate User" : "Activate User"}
                                                >
                                                    {u.isActive ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {users.length === 0 && !isFetching && (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground italic">
                                                No staff accounts found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default UserManagement;

