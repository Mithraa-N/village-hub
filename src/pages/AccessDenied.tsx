import { AppLayout } from "@/components/AppLayout";
import { ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";
import { getUser, getRoleDefaultPath } from "@/lib/auth";

const AccessDenied = () => {
    const user = getUser();
    const homePath = user ? getRoleDefaultPath(user.role) : "/login";

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="max-w-md w-full bg-white border-2 border-red-100 rounded-xl p-8 text-center shadow-sm">
                <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShieldAlert className="w-10 h-10" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h1>
                <p className="text-slate-600 mb-8">
                    You do not have the necessary permissions to view this page. This action has been logged for security purposes.
                </p>
                <Link
                    to={homePath}
                    className="inline-block w-full py-3 px-4 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors"
                >
                    Return to Dashboard
                </Link>
            </div>
        </div>
    );
};

export default AccessDenied;
