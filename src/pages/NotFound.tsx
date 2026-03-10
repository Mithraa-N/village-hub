import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import {
  ShieldAlert,
  ArrowLeft,
  Home,
  Search,
  Compass
} from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Access Violation:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-slate-950 overflow-hidden font-sans">
      {/* Ambient Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-slate-950 to-rose-500/5"></div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

      <div className="relative z-10 w-full max-w-lg p-6 animate-in fade-in zoom-in duration-700">
        <div className="bg-white/95 backdrop-blur-2xl rounded-[48px] border border-white/20 shadow-2xl p-10 lg:p-16 text-center">
          <div className="relative mx-auto w-24 h-24 mb-10">
            <div className="absolute inset-0 bg-rose-500/20 blur-2xl rounded-full animate-pulse"></div>
            <div className="relative w-full h-full bg-rose-50 border border-rose-100 rounded-3xl flex items-center justify-center text-rose-500">
              <Compass size={48} className="animate-spin-slow" />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/10 rounded-lg border border-rose-500/20 mb-6">
            <ShieldAlert className="h-3 w-3 text-rose-500" />
            <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest leading-none">Resource Disconnected</span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter leading-none mb-6">
            Lost in the <br /> <span className="text-rose-500">Ecosystem.</span>
          </h1>

          <p className="text-slate-400 font-semibold text-sm max-w-xs mx-auto mb-12 italic">
            The requested system node <code className="text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-lg not-italic font-black text-[10px]">{location.pathname}</code> does not exist or has been moved to a restricted sector.
          </p>

          <div className="flex flex-col gap-4">
            <Link
              to="/"
              className="group h-16 bg-slate-900 text-white font-black text-xs uppercase tracking-[0.3em] rounded-[24px] hover:bg-slate-800 shadow-xl shadow-slate-900/10 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              <Home size={18} className="text-emerald-400" />
              Return to Hub
            </Link>

            <button
              onClick={() => window.history.back()}
              className="h-14 bg-slate-50 text-slate-500 font-black text-[10px] uppercase tracking-widest rounded-2xl border border-slate-100 hover:bg-white hover:shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft size={16} />
              Reverse Navigation
            </button>
          </div>

          <div className="mt-12 flex items-center justify-center gap-4 border-t border-slate-50 pt-8">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">Integrated Hub OS • Error Code: 404</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
