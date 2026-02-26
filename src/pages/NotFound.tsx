import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Access Violation: Unauthorized or non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary">
      <div className="max-w-md w-full bg-white border border-slate-200 p-12 rounded-sm text-center shadow-sm">
        <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-sm flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl font-bold">404</span>
        </div>
        <h1 className="text-xl font-bold text-slate-800 uppercase tracking-tight mb-2">Resource Not Found</h1>
        <p className="text-sm text-slate-500 font-medium mb-8">
          The requested system resource or directory does not exist or has been moved to a secure location.
        </p>
        <div className="flex flex-col gap-3">
          <a
            href="/"
            className="h-11 flex items-center justify-center bg-primary text-white font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-[#1a3d2e] transition-all border-b-2 border-[#0e221a]"
          >
            Return to Secure Dashboard
          </a>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Village Hub Digital · Access Monitoring Active</p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
