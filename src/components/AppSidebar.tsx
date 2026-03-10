import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  MessageSquareWarning,
  IndianRupee,
  Menu,
  X,
  LogOut,
  User as UserIcon,
  UserCog,
  FileBarChart,
  Shield,
  Sparkles,
  Zap,
  Globe,
  Bell
} from "lucide-react";

import { useState } from "react";
import { logout, getUser } from "@/lib/auth";

export function AppSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = getUser();

  const navItems = [
    { title: "Dashboard", url: user?.role === "ADMIN" ? "/admin/dashboard" : "/dashboard", icon: LayoutDashboard, roles: ["ADMIN", "OPERATOR", "VIEWER"] },
    { title: "Smart Assets", url: "/ops/assets", icon: Building2, roles: ["ADMIN", "OPERATOR"] },
    { title: "Grievances", url: "/complaints", icon: MessageSquareWarning, roles: ["ADMIN", "OPERATOR"] },
    { title: "Budgeting", url: "/admin/budget", icon: IndianRupee, roles: ["ADMIN"] },
    { title: "User Control", url: "/admin/users", icon: UserCog, roles: ["ADMIN", "OPERATOR"] },
    { title: "Insights", url: "/admin/reports", icon: FileBarChart, roles: ["ADMIN"] },
    { title: "Audit Log", url: "/admin/audit-logs", icon: Shield, roles: ["ADMIN"] },
  ].filter(item => user && item.roles.includes(user.role));

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = (
    <nav className="flex-1 py-6 space-y-1 px-3">
      <div className="px-3 mb-4">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400/80">Navigation</span>
      </div>
      {navItems.map((item) => (
        <NavLink
          key={item.url}
          to={item.url}
          end={item.url === "/"}
          className="flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-all rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/5 group"
          activeClassName="bg-emerald-500/10 text-emerald-400 shadow-sm shadow-emerald-500/5"
          onClick={() => setMobileOpen(false)}
        >
          <item.icon className="h-5 w-5 shrink-0 transition-transform group-hover:scale-110" />
          <span>{item.title}</span>
        </NavLink>
      ))}
    </nav>
  );

  const footerInfo = (
    <div className="px-6 py-6 border-t border-slate-100 bg-slate-50/50">
      <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-1.5 bg-emerald-500/10 rounded-lg">
            <Zap className="h-3.5 w-3.5 text-emerald-500" />
          </div>
          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none">Smart Hub Active</span>
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
          <span>System Nominal</span>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-emerald-600">Stable Sync</span>
          </div>
        </div>
      </div>
      <p className="text-[9px] text-center mt-6 font-bold text-slate-300 uppercase tracking-[0.3em]">Village Hub OS v1.0</p>
    </div>
  );

  return (
    <>
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 z-50 flex items-center px-6 lg:px-8">
        <div className="flex items-center gap-4 lg:w-60 shrink-0">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2.5 hover:bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center transition-all bg-white shadow-sm"
          >
            {mobileOpen ? <X size={20} className="text-slate-600" /> : <Menu size={20} className="text-slate-600" />}
          </button>

          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Globe size={18} className="text-white" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-sm font-black tracking-tighter text-slate-900 leading-none">VILLAGE HUB.</h2>
              <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest mt-0.5">Community OS</span>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex flex-1 justify-center">
          <div className="bg-slate-50 px-4 py-1.5 rounded-full border border-slate-100 flex items-center gap-2 shadow-inner">
            <Sparkles size={12} className="text-emerald-500" />
            <span className="text-[10px] font-bold tracking-[0.15em] text-slate-500 uppercase">Interactive Digital Ecosystem</span>
          </div>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <button className="p-2.5 hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-all rounded-xl border border-slate-200 bg-white relative">
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 border-2 border-white rounded-full"></span>
          </button>

          {user && (
            <div className="hidden md:flex items-center gap-3 pl-3 border-l border-slate-200 ml-2">
              <div className="flex flex-col items-end">
                <span className="text-xs font-black text-slate-900 leading-none uppercase tracking-tight">{user.name}</span>
                <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest mt-1">{user.role}</span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200">
                <UserIcon size={18} className="text-slate-500" />
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center justify-center p-2.5 bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 border border-slate-200 rounded-xl transition-all shadow-sm group ml-2"
            title="Log Out"
          >
            <LogOut size={18} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside
        className="fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 bg-white text-slate-600 border-r border-slate-100 hidden lg:flex flex-col"
      >
        {navLinks}
        {footerInfo}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/20 backdrop-blur-sm z-30 lg:hidden mt-16"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar Content */}
      <aside
        className={`
          fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 bg-white text-slate-600 border-r border-slate-100 
          lg:hidden flex flex-col transition-transform duration-300
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {navLinks}
        <div className="mt-auto">
          {footerInfo}
        </div>
      </aside>
    </>
  );
}
