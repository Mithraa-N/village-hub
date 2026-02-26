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
} from "lucide-react";

import { useState } from "react";
import { logout, getUser } from "@/lib/auth";

export function AppSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = getUser();

  const navItems = [
    { title: "DASHBOARD", url: user?.role === "ADMIN" ? "/admin/dashboard" : "/dashboard", icon: LayoutDashboard, roles: ["ADMIN", "OPERATOR", "VIEWER"] },
    { title: "ASSETS", url: "/ops/assets", icon: Building2, roles: ["ADMIN", "OPERATOR"] },
    { title: "GRIEVANCES", url: "/complaints", icon: MessageSquareWarning, roles: ["ADMIN", "OPERATOR"] },
    { title: "BUDGET", url: "/admin/budget", icon: IndianRupee, roles: ["ADMIN"] },
    { title: "USER MANAGEMENT", url: "/admin/users", icon: UserCog, roles: ["ADMIN"] },
    { title: "SYSTEM REPORTS", url: "/admin/reports", icon: FileBarChart, roles: ["ADMIN"] },
  ].filter(item => user && item.roles.includes(user.role));

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = (
    <nav className="flex-1 py-10 space-y-1">
      {navItems.map((item) => (
        <NavLink
          key={item.url}
          to={item.url}
          end={item.url === "/"}
          className="flex items-center gap-4 px-6 py-4 text-[10px] font-bold tracking-widest transition-all text-sidebar-foreground hover:bg-slate-200/40 border-l-4 border-transparent uppercase"
          activeClassName="bg-sidebar-accent text-primary border-primary shadow-sm"
          onClick={() => setMobileOpen(false)}
        >
          <item.icon className="h-5 w-5 shrink-0 text-primary" />
          <span>{item.title}</span>
        </NavLink>
      ))}
    </nav>
  );

  const footerInfo = (
    <div className="px-6 py-10 border-t border-sidebar-border bg-sidebar/30">
      <div className="space-y-4">
        <div className="flex flex-col gap-1">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Network Status</span>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></div>
            <span className="text-[10px] font-bold text-slate-600 uppercase">Secure Connect</span>
          </div>
        </div>

        <div className="p-3 bg-white border border-slate-200 rounded-sm">
          <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Session Identity</p>
          <p className="text-[10px] font-bold text-primary truncate">SEC-VHD-{new Date().getFullYear()}</p>
        </div>
      </div>

      <p className="text-[8px] text-center mt-12 font-bold text-slate-400 uppercase tracking-[0.3em]">Village Hub Digital v1.0</p>
    </div>
  );

  return (
    <>
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 h-14 bg-primary text-white z-50 flex items-center px-4 shadow-sm">
        <div className="flex items-center gap-3 lg:w-60 shrink-0">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 hover:bg-white/10 rounded-sm border border-white/20 flex items-center gap-2"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            <span className="text-[9px] font-bold tracking-widest uppercase hidden sm:inline">{mobileOpen ? 'Close' : 'Menu'}</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm bg-white/20 flex items-center justify-center font-bold text-sm">GP</div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xs font-bold truncate tracking-tight">GRAM PANCHAYAT</h2>
              <p className="text-[9px] font-bold text-white/70 uppercase">Village Hub Digital</p>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex flex-1 justify-center">
          <span className="text-[10px] font-bold tracking-[0.3em] text-white/40 uppercase">Authorized Personnel Only</span>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold ml-auto">
          {user && (
            <div className="hidden md:flex flex-col items-end border-r border-white/30 pr-6 mr-2">
              <span className="leading-none uppercase tracking-[0.1em] text-[10px] text-white/90">Authorized Identity</span>
              <span className="text-sm font-black text-white uppercase mt-1 tracking-tight">{user.name}</span>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-sm flex items-center gap-2 transition-all group"
          >
            <LogOut size={14} className="group-hover:translate-x-1 transition-transform" />
            <span className="hidden sm:inline uppercase tracking-widest text-[9px]">Terminate Session</span>
          </button>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside
        className="fixed top-14 left-0 z-40 h-[calc(100vh-3.5rem)] w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border hidden lg:flex flex-col"
      >
        {navLinks}
        {footerInfo}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden mt-14"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar Content */}
      <aside
        className={`
          fixed top-14 left-0 z-40 h-[calc(100vh-3.5rem)] w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border 
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


