import { useState, useEffect } from "react";
import { AppLayout } from "@/components/AppLayout";
import {
  getConditionClass,
  getComplaintStatusClass,
  formatCurrency,
  type AssetCondition,
  type ComplaintStatus
} from "@/data/mockData";
import { AlertTriangle, Building2, MessageSquareWarning, IndianRupee, Clock, Loader2, ArrowRight } from "lucide-react";
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
      <div className="page-header flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 capitalize">Namaste, {user?.name?.split(' ')[0] || "Citizen"}</h1>
          <p className="text-slate-500 font-medium">Village Hub Live Overview · FY 2025-26</p>
        </div>
        {user?.role !== "VIEWER" && (
          <div className="flex gap-2">
            <Link to="/ops/complaints" className="bg-slate-900 text-white px-5 py-2.5 rounded-lg text-xs font-bold hover:bg-slate-800 transition-all flex items-center gap-2">
              MANAGE COMPLAINTS
            </Link>
          </div>
        )}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<Building2 className="h-5 w-5 text-primary" />}
          label="Village Assets"
          value={stats.totalAssets}
          color="border-primary/20"
        />
        <StatCard
          icon={<AlertTriangle className="h-5 w-5 text-red-500" />}
          label="Faulty Assets"
          value={stats.faultyAssets}
          alert={stats.faultyAssets > 0}
          color="border-red-500/20"
        />
        <StatCard
          icon={<MessageSquareWarning className="h-5 w-5 text-orange-500" />}
          label="Open Issues"
          value={stats.openComplaints}
          alert={stats.openComplaints > 0}
          color="border-orange-500/20"
        />
        <StatCard
          icon={<IndianRupee className="h-5 w-5 text-green-600" />}
          label="Budget Spent"
          value={`${stats.utilizationPercent}%`}
          sub={formatCurrency(stats.totalSpent)}
          color="border-green-600/20"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Faulty Assets */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Infrastructure Alerts
            </h2>
            <Link to="/ops/assets" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
              VIEW ALL <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="bg-card border-2 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 bg-slate-50">
                  <th className="text-left px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Asset Name</th>
                  <th className="text-center px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y-2">
                {data?.faultyAssets.map(asset => (
                  <tr key={asset.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-800">{asset.name}</div>
                      <div className="text-[10px] font-medium text-slate-400">{asset.ward} · {asset.location}</div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`status-badge ${getConditionClass(asset.condition as AssetCondition)} text-[9px]`}>
                        {asset.condition}
                      </span>
                    </td>
                  </tr>
                ))}
                {(!data?.faultyAssets || data.faultyAssets.length === 0) && (
                  <tr>
                    <td colSpan={2} className="px-4 py-10 text-center text-slate-400 italic">
                      No critical alerts. All systems working normally.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Recent Complaints */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              Latest Complaints
            </h2>
            <Link to="/ops/complaints" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
              MANAGE ALL <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="bg-card border-2 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 bg-slate-50">
                  <th className="text-left px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Issue Details</th>
                  <th className="text-center px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y-2">
                {data?.recentComplaints.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-800">{c.title}</div>
                      <div className="text-[10px] font-medium text-slate-400">
                        {new Date(c.submittedDate).toLocaleDateString()} · By {c.submittedBy}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`status-badge ${getComplaintStatusClass(c.status as ComplaintStatus)} text-[9px]`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {(!data?.recentComplaints || data.recentComplaints.length === 0) && (
                  <tr>
                    <td colSpan={2} className="px-4 py-10 text-center text-slate-400 italic">
                      No recent complaints reported.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AppLayout>
  );
};

function StatCard({ icon, label, value, sub, alert, color }: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  alert?: boolean;
  color?: string;
}) {
  return (
    <div className={`stat-card p-5 border-2 rounded-2xl transition-all hover:shadow-lg ${color} ${alert ? "bg-red-50/10 border-red-200" : "bg-card shadow-sm"}`}>
      <div className="flex items-center gap-2 mb-3">
        <div className="p-2 rounded-lg bg-white shadow-sm border">
          {icon}
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</span>
      </div>
      <div className="text-3xl font-bold tracking-tight text-slate-900">{value}</div>
      {sub && <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{sub}</p>}
    </div>
  );
}

export default Dashboard;

