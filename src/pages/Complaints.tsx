import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { complaints, getComplaintStatusClass, type ComplaintStatus } from "@/data/mockData";
import { Search, Filter } from "lucide-react";

const statuses: ComplaintStatus[] = ["Submitted", "Assigned", "In Progress", "Resolved", "Closed"];

const Complaints = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const filtered = complaints.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.submittedBy.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Pipeline counts
  const pipeline = statuses.map(s => ({
    status: s,
    count: complaints.filter(c => c.status === s).length,
  }));

  return (
    <AppLayout>
      <div className="page-header">
        <h1>Complaints & Service Requests</h1>
        <p>Citizen complaints linked to village assets and services</p>
      </div>

      {/* Status Pipeline */}
      <div className="flex flex-wrap gap-2 mb-5">
        {pipeline.map(p => (
          <button
            key={p.status}
            onClick={() => setStatusFilter(statusFilter === p.status ? "All" : p.status)}
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-md text-sm border transition-colors
              ${statusFilter === p.status
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-border hover:bg-muted"}
            `}
          >
            <span className={`status-badge ${getComplaintStatusClass(p.status)}`}>{p.status}</span>
            <span className="font-heading font-bold text-xs">{p.count}</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search complaints..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm border rounded-md bg-card focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Table */}
      <div className="bg-card border rounded-md overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">ID</th>
              <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Issue</th>
              <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Linked Asset</th>
              <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Submitted By</th>
              <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Status</th>
              <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Assigned To</th>
              <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-3 py-2.5 font-mono text-xs text-muted-foreground">{c.id}</td>
                <td className="px-3 py-2.5">
                  <div className="font-medium">{c.title}</div>
                  <div className="text-xs text-muted-foreground max-w-xs truncate">{c.description}</div>
                </td>
                <td className="px-3 py-2.5 text-xs">
                  {c.assetName ? (
                    <div>
                      <div className="font-medium">{c.assetName}</div>
                      <div className="text-muted-foreground">{c.assetId}</div>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-3 py-2.5 text-muted-foreground">{c.submittedBy}</td>
                <td className="px-3 py-2.5">
                  <span className={`status-badge ${getComplaintStatusClass(c.status)}`}>
                    {c.status}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-muted-foreground text-xs">{c.assignedTo || "—"}</td>
                <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap">{c.submittedDate}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-3 py-8 text-center text-muted-foreground">
                  No complaints match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
};

export default Complaints;
