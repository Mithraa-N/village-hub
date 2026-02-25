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
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { title: "Dashboard", url: user?.role === "ADMIN" ? "/admin/dashboard" : "/dashboard", icon: LayoutDashboard, roles: ["ADMIN", "OPERATOR", "VIEWER"] },
    { title: "Assets", url: "/ops/assets", icon: Building2, roles: ["ADMIN", "OPERATOR"] },
    { title: "Complaints", url: "/complaints", icon: MessageSquareWarning, roles: ["ADMIN", "OPERATOR"] },
    { title: "Budget", url: "/admin/budget", icon: IndianRupee, roles: ["ADMIN"] },
    { title: "Users", url: "/admin/users", icon: UserCog, roles: ["ADMIN"] },
    { title: "Reports", url: "/admin/reports", icon: FileBarChart, roles: ["ADMIN"] },
  ].filter(item => user && item.roles.includes(user.role));




  return (
    <>
      {/* Mobile overlay */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-foreground/30 z-40 lg:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}

      {/* Mobile toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="fixed top-3 left-3 z-50 lg:hidden p-2 rounded-md bg-primary text-primary-foreground"
        aria-label="Toggle menu"
      >
        {collapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
      </button>

      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-40 h-screen
          bg-sidebar text-sidebar-foreground
          flex flex-col transition-all duration-200
          ${collapsed ? "-translate-x-full lg:translate-x-0 lg:w-16" : "w-60"}
        `}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 h-14 border-b border-sidebar-border">
          <div className="w-8 h-8 rounded bg-sidebar-accent flex items-center justify-center font-heading font-bold text-sm text-sidebar-accent-foreground">
            GP
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <h2 className="font-heading text-sm font-bold truncate">Gram Panchayat</h2>
              <p className="text-[10px] text-sidebar-foreground/60 truncate">Village Hub</p>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1 rounded hover:bg-sidebar-accent"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>

        {/* User Info */}
        {!collapsed && user && (
          <div className="px-4 py-4 border-b border-sidebar-border bg-sidebar-accent/30">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <UserIcon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{user.name}</p>
                <p className="text-[10px] uppercase font-bold text-primary/70">{user.role}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 py-3 px-2 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.url}
              to={item.url}
              end={item.url === "/"}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold"
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-2 py-3 border-t border-sidebar-border space-y-2">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm font-bold transition-colors text-red-500 hover:bg-red-50"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
          {!collapsed && (
            <p className="px-2 text-[10px] text-sidebar-foreground/50 text-center font-medium">
              Offline Ready · v1.0
            </p>
          )}
        </div>
      </aside>
    </>
  );
}


