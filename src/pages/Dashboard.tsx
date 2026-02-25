import { AppLayout } from "@/components/AppLayout";
import {
  getDashboardStats,
  assets,
  complaints,
  maintenanceLogs,
  getConditionClass,
  getComplaintStatusClass,
  formatCurrency,
} from "@/data/mockData";
import { AlertTriangle, Building2, MessageSquareWarning, IndianRupee, Clock } from "lucide-react";
import { getUser } from "@/lib/auth";

const stats = getDashboardStats();

const Dashboard = () => {
  const user = getUser();

  return (
    <AppLayout>
      <div className="page-header">
        <h1>Welcome, {user?.name || "User"}</h1>
        <p>Village infrastructure overview · FY 2025-26 · Role: <span className="font-bold text-primary">{user?.role}</span></p>
      </div>


      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard
          icon={<Building2 className="h-5 w-5 text-primary" />}
          label="Total Assets"
          value={stats.totalAssets}
        />
        <StatCard
          icon={<AlertTriangle className="h-5 w-5 text-destructive" />}
          label="Faulty Assets"
          value={stats.faultyAssets}
          alert={stats.faultyAssets > 0}
        />
        <StatCard
          icon={<MessageSquareWarning className="h-5 w-5 text-warning" />}
          label="Open Complaints"
          value={stats.openComplaints}
          sub={`${stats.overdueComplaints} overdue`}
          alert={stats.overdueComplaints > 0}
        />
        <StatCard
          icon={<IndianRupee className="h-5 w-5 text-info" />}
          label="Budget Used"
          value={`${stats.utilizationPercent}%`}
          sub={formatCurrency(stats.totalSpent)}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Faulty Assets */}
        <section>
          <h2 className="text-base font-bold mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            Assets Needing Attention
          </h2>
          <div className="bg-card border rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">ID</th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Asset</th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {assets
                  .filter(a => a.condition !== "Working" && a.condition !== "Decommissioned")
                  .map(asset => (
                    <tr key={asset.id} className="border-b last:border-0">
                      <td className="px-3 py-2 font-mono text-xs text-muted-foreground">{asset.id}</td>
                      <td className="px-3 py-2">
                        <div className="font-medium">{asset.name}</div>
                        <div className="text-xs text-muted-foreground">{asset.ward}</div>
                      </td>
                      <td className="px-3 py-2">
                        <span className={`status-badge ${getConditionClass(asset.condition)}`}>
                          {asset.condition}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Recent Complaints */}
        <section>
          <h2 className="text-base font-bold mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4 text-warning" />
            Recent Complaints
          </h2>
          <div className="bg-card border rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">ID</th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Issue</th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {complaints
                  .filter(c => c.status !== "Closed")
                  .slice(0, 5)
                  .map(c => (
                    <tr key={c.id} className="border-b last:border-0">
                      <td className="px-3 py-2 font-mono text-xs text-muted-foreground">{c.id}</td>
                      <td className="px-3 py-2">
                        <div className="font-medium">{c.title}</div>
                        <div className="text-xs text-muted-foreground">{c.submittedDate} · {c.ward}</div>
                      </td>
                      <td className="px-3 py-2">
                        <span className={`status-badge ${getComplaintStatusClass(c.status)}`}>
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Recent Maintenance */}
      <section className="mt-6">
        <h2 className="text-base font-bold mb-3">Recent Maintenance Activity</h2>
        <div className="bg-card border rounded-md overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">Date</th>
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">Asset</th>
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">Type</th>
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">Description</th>
                <th className="text-right px-3 py-2 font-medium text-muted-foreground">Cost</th>
              </tr>
            </thead>
            <tbody>
              {maintenanceLogs.slice(0, 5).map(log => (
                <tr key={log.id} className="border-b last:border-0">
                  <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">{log.date}</td>
                  <td className="px-3 py-2 font-medium">{log.assetName}</td>
                  <td className="px-3 py-2">
                    <span className={`status-badge ${log.type === "Repair" ? "status-minor" : log.type === "Replacement" ? "status-major" : "status-decommissioned"}`}>
                      {log.type}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">{log.description}</td>
                  <td className="px-3 py-2 text-right font-mono">{log.cost > 0 ? formatCurrency(log.cost) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AppLayout>
  );
};

function StatCard({ icon, label, value, sub, alert }: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  alert?: boolean;
}) {
  return (
    <div className={`stat-card ${alert ? "border-destructive/30" : ""}`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
      </div>
      <div className="text-2xl font-heading font-bold">{value}</div>
      {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  );
}

export default Dashboard;
