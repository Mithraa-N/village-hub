import { useState, useEffect } from "react";
import { AppLayout } from "@/components/AppLayout";
import {
  getConditionClass,
  getComplaintStatusClass,
  formatCurrency,
  type AssetCondition,
  type ComplaintStatus
} from "@/data/mockData";
import { AlertTriangle, Building2, MessageSquareWarning, IndianRupee, Clock, Loader2, ArrowRight, Shield } from "lucide-react";
import { getUser, getAuthToken } from "@/lib/auth";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface DashboardData {
  stats: {
    totalAssets: number;
    faultyAssets: number;
    openComplaints: number;
    totalSpent: number;
    utilizationPercent: number;
  };
  recentComplaints: any[];
  faultyAssets: any[];
}

const Dashboard = () => {
  const user = getUser();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/v1/dashboard/stats", {
        headers: {
          "Authorization": `Bearer ${getAuthToken()}`
        }
      });
      if (response.ok) {
        const result = await response.json();
        setData(result);
      } else {
        toast.error("Failed to load dashboard data");
      }
    } catch (err) {
      toast.error("Network error on dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="h-[80vh] flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  const stats = data?.stats || {
    totalAssets: 0,
    faultyAssets: 0,
    openComplaints: 0,
    totalSpent: 0,
    utilizationPercent: 0
  };

  return (
    <AppLayout>
      <div className="page-header flex flex-col md:flex-row justify-between items-start md:items-end border-b-2 border-slate-200 pb-8 mb-10 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Village Management Digital Portal</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tighter uppercase">Administrative Overview</h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">Ministry of Rural Development · Session Active</p>
        </div>
        <div className="flex gap-6 items-center bg-slate-50 p-4 border border-slate-200 rounded-sm">
          <div className="text-right border-r pr-6 border-slate-200">
            <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-widest mb-1">Authenticated Account</span>
            <span className="text-xs font-bold text-slate-800 uppercase tracking-tight">{user?.name}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-widest mb-1">Access Tier</span>
            <span className="px-2 py-0.5 bg-primary/10 text-primary text-[9px] font-bold rounded-sm uppercase">{user?.role}</span>
          </div>
        </div>
      </div>

      {/* Official Status Banner */}
      <div className="bg-primary/5 border border-primary/20 p-4 mb-8 flex items-center justify-between rounded-sm">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
          <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">System Operational · All modules synchronized with block server</span>
        </div>
        <span className="text-[9px] font-bold text-slate-400 uppercase">Last Registry Sync: {new Date().toLocaleTimeString()}</span>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard
          icon={<Building2 className="h-5 w-5" />}
          label="Total Registered Assets"
          value={stats.totalAssets}
        />
        <StatCard
          icon={<AlertTriangle className="h-5 w-5" />}
          label="Immediate Fault Alerts"
          value={stats.faultyAssets}
          variant="warning"
        />
        <StatCard
          icon={<MessageSquareWarning className="h-5 w-5" />}
          label="Pending Grievances"
          value={stats.openComplaints}
          variant="danger"
        />
        <StatCard
          icon={<IndianRupee className="h-5 w-5" />}
          label="Funds Utilization"
          value={`${stats.utilizationPercent}%`}
          sub={`Ledger: ${formatCurrency(stats.totalSpent)}`}
        />
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Faulty Assets */}
        <section className="lg:col-span-6 space-y-4">
          <div className="flex justify-between items-center border-l-4 border-primary pl-4 py-1">
            <div>
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Infrastructure Status Report</h2>
              <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">Critical maintenance required</p>
            </div>
            <Link to="/ops/assets" className="px-3 py-1.5 border border-slate-200 text-[9px] font-bold text-primary hover:bg-slate-50 transition-all uppercase tracking-widest rounded-sm">
              Inspect Inventory
            </Link>
          </div>
          <div className="bg-white border border-slate-200 rounded-sm overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-secondary/30">
                  <th className="text-left px-5 py-4 font-bold text-slate-600 uppercase text-[10px] tracking-widest">Asset Description / ID</th>
                  <th className="text-center px-5 py-4 font-bold text-slate-600 uppercase text-[10px] tracking-widest">Condition Code</th>
                </tr>
              </thead>
              <tbody className="divide-y border-t border-slate-100">
                {data?.faultyAssets.map(asset => (
                  <tr key={asset.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-bold text-slate-800 text-xs uppercase tracking-tight">{asset.name}</div>
                      <div className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter mt-1">{asset.ward} · {asset.location}</div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`px-2 py-1 rounded-sm text-[9px] font-bold uppercase tracking-tighter shadow-sm border ${getConditionClass(asset.condition as AssetCondition)}`}>
                        {asset.condition}
                      </span>
                    </td>
                  </tr>
                ))}
                {(!data?.faultyAssets || data.faultyAssets.length === 0) && (
                  <tr>
                    <td colSpan={2} className="px-4 py-16 text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest italic bg-slate-50/30">
                      Zero critical failures reported in database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Recent Complaints */}
        <section className="lg:col-span-6 space-y-4">
          <div className="flex justify-between items-center border-l-4 border-[#b45309] pl-4 py-1">
            <div>
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Grievance Dispatch Log</h2>
              <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">Live citizen communications</p>
            </div>
            <Link to="/complaints" className="px-3 py-1.5 border border-slate-200 text-[9px] font-bold text-[#b45309] hover:bg-slate-50 transition-all uppercase tracking-widest rounded-sm">
              Manage Pipeline
            </Link>
          </div>
          <div className="bg-white border border-slate-200 rounded-sm overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-secondary/30">
                  <th className="text-left px-5 py-4 font-bold text-slate-600 uppercase text-[10px] tracking-widest">Case Details</th>
                  <th className="text-center px-5 py-4 font-bold text-slate-600 uppercase text-[10px] tracking-widest">Status Auth</th>
                </tr>
              </thead>
              <tbody className="divide-y border-t border-slate-100">
                {data?.recentComplaints.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-bold text-slate-800 text-xs uppercase tracking-tight">{c.title}</div>
                      <div className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter mt-1">
                        {new Date(c.submittedDate).toLocaleDateString()} · SERIAL: {c.id.split('-')[0]}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`px-2 py-1 rounded-sm text-[9px] font-bold uppercase tracking-tighter shadow-sm border ${getComplaintStatusClass(c.status as ComplaintStatus)}`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {(!data?.recentComplaints || data.recentComplaints.length === 0) && (
                  <tr>
                    <td colSpan={2} className="px-4 py-16 text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest italic bg-slate-50/30">
                      No active citizen grievances recorded.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <div className="mt-16 pt-8 border-t border-slate-100 flex justify-between items-center">
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Village Hub Digital System · V1.0.4-SECURE</p>
        <div className="flex gap-4">
          <span className="text-[9px] font-bold text-primary uppercase">Official Documentation</span>
          <span className="text-[9px] font-bold text-primary uppercase">Security Policy</span>
        </div>
      </div>
    </AppLayout>
  );
};

function StatCard({ icon, label, value, sub, variant }: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  variant?: 'default' | 'warning' | 'danger';
}) {
  const variantClasses = {
    default: 'border-slate-200',
    warning: 'border-warning/50 bg-warning/5',
    danger: 'border-destructive/50 bg-destructive/5'
  };

  return (
    <div className={`border p-6 rounded-sm shadow-sm transition-all hover:shadow-md ${variantClasses[variant || 'default']}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={variant === 'danger' ? 'text-destructive' : variant === 'warning' ? 'text-[#b45309]' : 'text-primary'}>
          {icon}
        </div>
        <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-500 whitespace-nowrap">{label}</span>
      </div>
      <div className="text-3xl font-bold tracking-tighter text-slate-900 mb-1">{value}</div>
      {sub && <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase border-t pt-2 border-slate-100">{sub}</p>}
    </div>
  );
}

export default Dashboard;


