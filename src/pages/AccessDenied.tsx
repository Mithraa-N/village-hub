import { AppLayout } from "@/components/AppLayout";
import { ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";
import { getUser, getRoleDefaultPath } from "@/lib/auth";

const AccessDenied = () => {
    const user = getUser();
    const homePath = user ? getRoleDefaultPath(user.role) : "/login";

    return (
        <div className="min-h-screen flex items-center justify-center bg-secondary p-6">
            <div className="max-w-md w-full bg-white border border-slate-200 p-12 text-center rounded-sm shadow-sm transition-all">
                <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-sm flex items-center justify-center mx-auto mb-6">
                    <ShieldAlert className="w-10 h-10" />
                </div>
                <h2 className="text-[10px] font-bold text-destructive uppercase tracking-[0.2em] mb-2">Security protocol violation</h2>
                <h1 className="text-xl font-bold text-slate-900 uppercase tracking-tight mb-4">Access Restricted</h1>
                <p className="text-sm text-slate-500 font-medium mb-10 leading-relaxed">
                    Account mismatch or insufficient authorization privileges detected. This access attempt has been logged with system identity: <span className="text-slate-800 font-bold">{user?.name || 'ANONYMOUS'}</span>.
                </p>
                <div className="flex flex-col gap-3">
                    <Link
                        to={homePath}
                        className="h-12 flex items-center justify-center bg-primary text-white font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-[#1a3d2e] transition-colors border-b-2 border-[#0e221a]"
                    >
                        Return to Secure Area
                    </Link>
                    <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-widest">Village Hub Digital · Ministry of Rural Development</p>
                </div>
            </div>
        </div>
    );
};

export default AccessDenied;
