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
            toast.error("Database synchronization failure");
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
                toast.success(`Account for ${formData.name} provisioned successfully`);
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
                toast.error(data.message || "Failed to provision staff account");
            }
        } catch (err) {
            toast.error("Connection integrity error");
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
                toast.success(`Access ${currentStatus ? 'revoked' : 'granted'} successfully`);
                fetchUsers();
            } else {
                toast.error("Authorization update failed");
            }
        } catch (err) {
            toast.error("Network communication failure");
        }
    };

    return (
        <AppLayout>
            <div className="page-header border-b pb-6 mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                        <Shield className="h-6 w-6 text-primary" />
                        Staff Access & User Management
                    </h1>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">Authorized Personnel Registry · Village Hub Digital</p>
                </div>
                <div className="text-right border-l pl-4 border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Total Active Users</span>
                    <span className="text-lg font-bold text-primary">{users.filter(u => u.isActive).length}</span>
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-8">
                {/* Left Column: Register Form */}
                <div className="lg:col-span-4 bg-white border border-slate-200 rounded-sm overflow-hidden self-start">
                    <div className="bg-secondary/50 px-5 py-4 border-b border-slate-200">
                        <h2 className="text-xs font-bold text-slate-700 uppercase flex items-center gap-2 tracking-widest">
                            <UserPlus className="h-4 w-4 text-primary" />
                            Provision New Account
                        </h2>
                    </div>
                    <form onSubmit={handleCreateUser} className="p-6 space-y-5">
                        <div className="space-y-1">
                            <label className="block text-[10px] font-bold uppercase text-slate-500 tracking-tight">Full Name (System Identity)</label>
                            <input
                                type="text"
                                required
                                className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-sm text-sm outline-none focus:border-primary font-medium"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="block text-[10px] font-bold uppercase text-slate-500 tracking-tight">Username</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-sm text-sm outline-none focus:border-primary font-medium"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="block text-[10px] font-bold uppercase text-slate-500 tracking-tight">Mobile Number</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-sm text-sm outline-none focus:border-primary font-medium"
                                    value={formData.mobile}
                                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="block text-[10px] font-bold uppercase text-slate-500 tracking-tight">System Role</label>
                                <select
                                    className="w-full h-11 px-3 bg-white border border-slate-200 rounded-sm text-xs font-bold uppercase outline-none focus:border-primary"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="OPERATOR">OPERATOR</option>
                                    <option value="ADMIN">ADMINISTRATOR</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="block text-[10px] font-bold uppercase text-slate-500 tracking-tight">Department Head</label>
                                <input
                                    type="text"
                                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-sm text-sm outline-none focus:border-primary font-medium"
                                    value={formData.department}
                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="block text-[10px] font-bold uppercase text-slate-500 tracking-tight">Access Password</label>
                            <input
                                type="password"
                                required
                                className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-sm text-sm outline-none focus:border-primary font-medium"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 bg-primary text-white font-bold text-xs uppercase tracking-[0.2em] rounded-sm hover:bg-[#1a3d2e] shadow-sm transition-all border-b-2 border-[#0e221a] disabled:opacity-50"
                        >
                            {isLoading ? "Synchronizing..." : "Authorize Account"}
                        </button>
                    </form>
                </div>

                {/* Right Column: User List */}
                <div className="lg:col-span-8 bg-white border border-slate-200 rounded-sm overflow-hidden shadow-sm">
                    <div className="bg-secondary/50 px-5 py-4 border-b border-slate-200 flex justify-between items-center">
                        <h2 className="text-xs font-bold text-slate-700 uppercase flex items-center gap-2 tracking-widest">
                            <UserCog className="h-4 w-4 text-primary" />
                            Official Staff Directory
                        </h2>
                        {isFetching && <Loader2 className="h-3 w-3 animate-spin text-primary" />}
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50 border-b">
                                    <th className="text-left px-5 py-4 font-bold text-slate-500 uppercase text-[10px]">Staff Profile</th>
                                    <th className="text-left px-5 py-4 font-bold text-slate-500 uppercase text-[10px]">Role/Dept</th>
                                    <th className="text-center px-5 py-4 font-bold text-slate-500 uppercase text-[10px]">Access Status</th>
                                    <th className="text-right px-5 py-4 font-bold text-slate-500 uppercase text-[10px]">Security Control</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {users.filter(u => u.role !== 'VIEWER').map(u => (
                                    <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-5 py-4">
                                            <div className="font-bold text-slate-800 text-xs">{u.name}</div>
                                            <div className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-tighter">@{u.username} · Mob: {u.mobile}</div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase ${u.role === 'ADMIN' ? 'bg-primary text-white' : 'bg-slate-200 text-slate-600'}`}>
                                                {u.role === 'ADMIN' ? 'Administrator' : 'Operator'}
                                            </span>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase mt-1">{u.department || 'General Administration'}</div>
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <span className={`px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase ${u.isActive ? 'bg-success/10 text-success border border-success/20' : 'bg-destructive/10 text-destructive border border-destructive/20'}`}>
                                                {u.isActive ? 'Access Granted' : 'Locked/Disabled'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <button
                                                onClick={() => toggleStatus(u.id, u.isActive)}
                                                className={`px-3 py-1.5 rounded-sm text-[9px] font-bold uppercase transition-all shadow-sm border-b-2 ${u.isActive ? 'bg-white text-destructive border-slate-200 hover:bg-red-50' : 'bg-primary text-white border-[#0e221a] hover:bg-[#1a3d2e]'}`}
                                                title={u.isActive ? "Revoke Access" : "Restore Access"}
                                            >
                                                {u.isActive ? "Revoke Access" : "Enable Access"}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {users.length === 0 && !isFetching && (
                                    <tr>
                                        <td colSpan={4} className="px-5 py-12 text-center text-slate-400 text-xs italic font-bold uppercase">
                                            No verified accounts found in the ministry database.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <p className="text-[9px] font-bold text-slate-400 mt-8 uppercase tracking-widest text-center">
                Unauthorized account provisioning is a punishable offense · All actions are logged with IP & Timestamp
            </p>
        </AppLayout>
    );
};

export default UserManagement;

