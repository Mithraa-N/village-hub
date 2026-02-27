import { AppLayout } from "@/components/AppLayout";
import { useEffect, useState } from "react";
import { Shield, FileWarning, Loader2, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";
import { getUser } from "@/lib/auth";

interface AuditLogEntry {
    id: string;
    timestamp: string;
    userId: string;
    userRole: string;
    action: string;
    module: string;
    recordId: string | null;
    details: string | null;
}

const AuditLogs = () => {
    const [logs, setLogs] = useState<AuditLogEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

    // Derived to check if user sorting is active
    const [sortBy, setSortBy] = useState<'timestamp' | 'userId'>('timestamp');

    const fetchLogs = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("accessToken");
            const response = await fetch("http://localhost:5000/api/v1/audit-logs", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error("Failed to authenticate or fetch");
            const data = await response.json();
            setLogs(data);
        } catch (error) {
            console.error("Error fetching audit logs", error);
            toast.error("Security Fault: Verify system connection to fetch official logs");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const toggleSort = (field: 'timestamp' | 'userId') => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
        } else {
            setSortBy(field);
            setSortOrder('desc'); // default for timestamp usually
        }
    };

    const sortedLogs = [...logs].sort((a, b) => {
        if (sortBy === 'timestamp') {
            const dateA = new Date(a.timestamp).getTime();
            const dateB = new Date(b.timestamp).getTime();
            return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        } else {
            const comp = a.userId.localeCompare(b.userId);
            return sortOrder === 'desc' ? -comp : comp;
        }
    });

    return (
        <AppLayout>
            <div className="page-header border-b pb-6 mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                        <Shield className="h-6 w-6 text-primary" />
                        System Audit Logs
                    </h1>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">Immutable Security Registry - Official Eyes Only</p>
                </div>
                <div className="flex gap-4 items-center">
                    {isLoading && <Loader2 className="w-4 h-4 text-primary animate-spin" />}
                    <button onClick={fetchLogs} className="h-10 px-6 bg-primary text-white font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-[#1a3d2e] shadow-sm transition-all border-b-2 border-[#0e221a]">
                        Refresh Registry
                    </button>
                </div>
            </div>

            <section className="bg-white border border-slate-200 rounded-sm overflow-hidden shadow-sm mt-8">
                <div className="bg-destructive/10 px-5 py-4 border-b border-slate-200">
                    <h2 className="text-xs font-bold text-destructive uppercase flex items-center gap-2 tracking-widest">
                        <FileWarning className="w-4 h-4" />
                        Official Action Log (Read Only)
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50 border-b">
                                <th
                                    className="text-left px-5 py-4 font-bold text-slate-500 uppercase text-[10px] cursor-pointer hover:bg-slate-100 transition-colors"
                                    onClick={() => toggleSort('timestamp')}
                                >
                                    <div className="flex items-center gap-2">
                                        Timestamp
                                        <ArrowUpDown className="w-3 h-3" />
                                    </div>
                                </th>
                                <th
                                    className="text-left px-5 py-4 font-bold text-slate-500 uppercase text-[10px] cursor-pointer hover:bg-slate-100 transition-colors"
                                    onClick={() => toggleSort('userId')}
                                >
                                    <div className="flex items-center gap-2">
                                        System ID (Role)
                                        <ArrowUpDown className="w-3 h-3" />
                                    </div>
                                </th>
                                <th className="text-left px-5 py-4 font-bold text-slate-500 uppercase text-[10px]">Module</th>
                                <th className="text-left px-5 py-4 font-bold text-slate-500 uppercase text-[10px]">Action Type</th>
                                <th className="text-left px-5 py-4 font-bold text-slate-500 uppercase text-[10px]">Reference Record</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y relative">
                            {isLoading && logs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-5 py-8 text-center text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                                        Loading Secure Logs...
                                    </td>
                                </tr>
                            ) : sortedLogs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-5 py-8 text-center text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                                        Registry is Empty
                                    </td>
                                </tr>
                            ) : sortedLogs.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-5 py-4">
                                        <div className="font-bold text-slate-800 text-xs">
                                            {new Date(log.timestamp).toLocaleDateString()}
                                        </div>
                                        <div className="text-[9px] font-bold text-primary uppercase mt-0.5">
                                            {new Date(log.timestamp).toLocaleTimeString()}
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="font-bold text-slate-800 text-xs truncate max-w-[150px]" title={log.userId}>
                                            {log.userId}
                                        </div>
                                        <div className="text-[9px] font-bold text-primary uppercase mt-0.5">
                                            {log.userRole}
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className="px-2 py-0.5 bg-secondary text-primary rounded-sm text-[9px] font-bold uppercase tracking-widest">
                                            {log.module}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="font-bold text-slate-800 text-xs">
                                            {log.action}
                                        </div>
                                        {log.details && (
                                            <div className="text-[10px] text-slate-500 mt-1 max-w-[300px] truncate" title={log.details}>
                                                {log.details}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-5 py-4 font-mono text-[10px] text-slate-500 truncate max-w-[120px]" title={log.recordId || "N/A"}>
                                        {log.recordId || "--"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </AppLayout>
    );
};

export default AuditLogs;
