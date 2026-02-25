import { useState, useEffect } from "react";
import { AppLayout } from "@/components/AppLayout";
import { getComplaintStatusClass, type ComplaintStatus } from "@/data/mockData";
import { Search, Filter, MoreVertical, Loader2 } from "lucide-react";
import { getUser, getAuthToken } from "@/lib/auth";
import { toast } from "sonner";

interface Complaint {
  id: string;
  title: string;
  description: string;
  status: string;
  category: string;
  submittedBy: string;
  assignedTo: string | null;
  submittedDate: string;
  ward: string;
  asset?: {
    id: string;
    name: string;
  };
}

const statuses: ComplaintStatus[] = ["Submitted", "Assigned", "In Progress", "Resolved", "Closed"];

const Complaints = () => {
  const user = getUser();
  const canManage = user?.role === "ADMIN" || user?.role === "OPERATOR";

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const fetchComplaints = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/v1/complaints", {
        headers: {
          "Authorization": `Bearer ${getAuthToken()}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setComplaints(data);
      } else {
        toast.error("Failed to load complaints");
      }
    } catch (err) {
      toast.error("Network error while loading complaints");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

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
            <span className={`status-badge ${getComplaintStatusClass(p.status as ComplaintStatus)}`}>{p.status}</span>
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
          className="w-full h-10 pl-9 pr-3 py-2 text-sm border rounded-md bg-card focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Table */}
      <div className="bg-card border rounded-md overflow-x-auto relative min-h-[200px]">
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">ID</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Issue</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Linked Asset</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Submitted By</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Assigned To</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
              {canManage && <th className="text-right px-4 py-3 font-medium text-muted-foreground">Manage</th>}
            </tr>
          </thead>

          <tbody>
            {filtered.map(c => (
              <tr key={c.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-4 py-4 font-mono text-[10px] text-muted-foreground" title={c.id}>
                  {c.id.split('-')[0]}...
                </td>
                <td className="px-4 py-4">
                  <div className="font-bold text-slate-900">{c.title}</div>
                  <div className="text-[10px] text-muted-foreground max-w-xs truncate">{c.description}</div>
                </td>
                <td className="px-4 py-4 text-xs">
                  {c.asset ? (
                    <div>
                      <div className="font-bold text-slate-700">{c.asset.name}</div>
                      <div className="text-[10px] text-muted-foreground">{c.asset.id.split('-')[0]}...</div>
                    </div>
                  ) : (
                    <span className="text-muted-foreground italic text-[10px]">No link</span>
                  )}
                </td>
                <td className="px-4 py-4">
                  <div className="font-medium text-slate-700">{c.submittedBy}</div>
                  <div className="text-[10px] text-muted-foreground uppercase">{c.ward || 'General'}</div>
                </td>
                <td className="px-4 py-4">
                  <span className={`status-badge ${getComplaintStatusClass(c.status as ComplaintStatus)}`}>
                    {c.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-muted-foreground text-xs font-medium">{c.assignedTo || "Unassigned"}</td>
                <td className="px-4 py-4 text-muted-foreground text-[11px] whitespace-nowrap">
                  {new Date(c.submittedDate).toLocaleDateString()}
                </td>
                {canManage && (
                  <td className="px-4 py-4 text-right">
                    <button title="Update status" className="p-1.5 hover:bg-muted rounded text-slate-500 transition-colors">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {filtered.length === 0 && !isLoading && (
              <tr>
                <td colSpan={canManage ? 8 : 7} className="px-4 py-12 text-center text-muted-foreground">
                  No complaints found matching your criteria.
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

