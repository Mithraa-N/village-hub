import { useState, useEffect } from "react";
import { AppLayout } from "@/components/AppLayout";
import { getComplaintStatusClass, type ComplaintStatus } from "@/data/mockData";
import { Search, Filter, MoreVertical, Loader2, MessageSquareWarning } from "lucide-react";
import { getUser, getAuthToken } from "@/lib/auth";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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

  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [updateStatus, setUpdateStatus] = useState<string>("In Progress");
  const [closingRemark, setClosingRemark] = useState("");

  const [isNewEntryOpen, setIsNewEntryOpen] = useState(false);
  const [newEntryData, setNewEntryData] = useState({ title: "", description: "", priority: "Medium", category: "Infrastructure" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("http://localhost:5000/api/v1/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${getAuthToken()}` },
        body: JSON.stringify(newEntryData)
      });
      if (response.ok) {
        toast.success("New grievance officially registered.");
        fetchComplaints();
        setIsNewEntryOpen(false);
        setNewEntryData({ title: "", description: "", priority: "Medium", category: "Infrastructure" });
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to register grievance");
      }
    } catch {
      toast.error("Network communication failure");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    // Strict Validation Rule: A complaint cannot be closed without a closing remark
    if (["Closed", "Resolved"].includes(updateStatus)) {
      if (!closingRemark || closingRemark.trim() === "") {
        toast.error("Validation Error: A mandatory closing remark is required before closing a grievance.");
        return;
      }
    }

    try {
      const response = await fetch(`http://localhost:5000/api/v1/complaints/${selectedComplaint.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({
          status: updateStatus,
          closingRemark: closingRemark
        })
      });

      if (response.ok) {
        toast.success("Complaint record securely updated.");
        fetchComplaints();
        setSelectedComplaint(null);
        setClosingRemark("");
      } else {
        const err = await response.json();
        toast.error(err.message || "Server rejected status update");
      }
    } catch {
      toast.error("Network communication failure");
    }
  };

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
        toast.error("Failed to load official complaint records");
      }
    } catch (err) {
      toast.error("Network communication failure");
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

  const pipeline = statuses.map(s => ({
    status: s,
    count: complaints.filter(c => c.status === s).length,
  }));

  if (isLoading) {
    return (
      <AppLayout>
        <div className="h-[80vh] flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="page-header border-b pb-6 mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <MessageSquareWarning className="h-6 w-6 text-primary" />
            Citizen Grievance Portal
          </h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">Village & Panchayat Service Request Monitoring</p>
        </div>
        <div className="flex gap-3">
          <div className="text-right hidden sm:block border-r pr-4 border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Active Complaints</span>
            <span className="text-lg font-bold text-primary">{complaints.filter(c => c.status !== 'Closed').length}</span>
          </div>
          <button
            onClick={() => setIsNewEntryOpen(true)}
            className="h-10 px-6 bg-primary text-white font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-[#1a3d2e] shadow-sm transition-all border-b-2 border-[#0e221a]"
          >
            New Entry
          </button>
        </div>
      </div>

      <div className="bg-secondary p-5 border border-slate-200 rounded-sm mb-8">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ID, Subject or Citizen Name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full h-11 pl-10 pr-4 bg-white border border-slate-200 rounded-sm text-sm outline-none focus:border-primary font-medium"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="w-full text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1 mb-1">
              <Filter size={12} /> Status Pipeline:
            </span>
            {pipeline.map(p => (
              <button
                key={p.status}
                onClick={() => setStatusFilter(statusFilter === p.status ? "All" : p.status)}
                className={`
                    flex items-center gap-2 px-3 py-1.5 rounded-sm text-[10px] font-bold border transition-all uppercase tracking-tighter
                    ${statusFilter === p.status
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "bg-white border-slate-200 hover:bg-slate-50 text-slate-600"}
                    `}
              >
                <span>{p.status}</span>
                <span className={`px-1.5 py-0.5 rounded-sm ${statusFilter === p.status ? 'bg-white/20' : 'bg-slate-100 text-slate-500'}`}>{p.count}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-sm overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-secondary/50 border-b-2">
              <th className="px-4 py-4 text-left font-bold text-slate-600 uppercase text-[10px]">Grievance Details</th>
              <th className="px-4 py-4 text-left font-bold text-slate-600 uppercase text-[10px]">Infrastructure Link</th>
              <th className="px-4 py-4 text-left font-bold text-slate-600 uppercase text-[10px]">Reporting Citizen</th>
              <th className="px-4 py-4 text-center font-bold text-slate-600 uppercase text-[10px]">Workflow Status</th>
              <th className="px-4 py-4 text-right font-bold text-slate-600 uppercase text-[10px]">Operations</th>
            </tr>
          </thead>

          <tbody className="divide-y whitespace-nowrap lg:whitespace-normal">
            {filtered.map(c => (
              <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-4">
                  <div className="font-bold text-slate-800 text-xs">{c.title}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5 font-bold uppercase tracking-tighter truncate max-w-[200px]">ID: {c.id.split('-')[0]} · {c.category}</div>
                </td>
                <td className="px-4 py-4">
                  {c.asset ? (
                    <div>
                      <div className="font-bold text-slate-700 text-xs">{c.asset.name}</div>
                      <div className="text-[10px] font-bold text-primary uppercase mt-0.5">{c.ward || 'Main Ward'}</div>
                    </div>
                  ) : (
                    <span className="text-slate-300 italic text-[10px] font-bold uppercase">No Asset Linked</span>
                  )}
                </td>
                <td className="px-4 py-4">
                  <div className="font-bold text-slate-700 text-xs">{c.submittedBy}</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{new Date(c.submittedDate).toLocaleDateString()}</div>
                </td>
                <td className="px-4 py-4 text-center">
                  <span className={`px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase ${getComplaintStatusClass(c.status as ComplaintStatus)}`}>
                    {c.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-right font-bold text-[10px]">
                  {canManage ? (
                    <button
                      onClick={() => { setSelectedComplaint(c); setUpdateStatus(c.status); setClosingRemark(""); }}
                      className="text-primary hover:underline uppercase transition-all"
                    >
                      Process Action
                    </button>
                  ) : (
                    <span className="text-slate-300 uppercase">View Only</span>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-slate-400 text-xs italic">
                  No grievances found matching the current database synchronization.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-[9px] font-bold text-slate-400 mt-4 uppercase tracking-widest">
        Authorized Access Only · System Log Active
      </p>

      {/* Action Processing Modal */}
      <Dialog open={!!selectedComplaint} onOpenChange={(open) => !open && setSelectedComplaint(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold uppercase tracking-tight text-slate-800">Process Action</DialogTitle>
          </DialogHeader>
          {selectedComplaint && (
            <form onSubmit={handleUpdateStatus} className="space-y-4 py-4">
              <div className="bg-slate-50 p-3 rounded-sm border border-slate-100 mb-4">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Target ID</div>
                <div className="text-xs font-bold text-slate-800">{selectedComplaint.id}</div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Change Workflow Status *</label>
                <select
                  className="w-full h-10 px-3 bg-white border border-slate-200 rounded-sm text-sm outline-none focus:border-primary font-medium"
                  value={updateStatus}
                  onChange={e => setUpdateStatus(e.target.value)}
                >
                  <option value="Submitted">Submitted (Awaiting Assignment)</option>
                  <option value="Assigned">Assigned for Resolution</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved (Pending Audit)</option>
                  <option value="Closed">Closed Officially</option>
                </select>
              </div>

              {(updateStatus === "Resolved" || updateStatus === "Closed") && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <label className="flex justify-between items-center text-[10px] font-bold text-destructive uppercase tracking-widest">
                    <span>Mandatory Closing Remark *</span>
                    <span className="text-[8px] bg-destructive/10 text-destructive px-1.5 py-0.5 rounded-sm">Required</span>
                  </label>
                  <textarea
                    value={closingRemark}
                    onChange={e => setClosingRemark(e.target.value)}
                    className="w-full p-3 min-h-[100px] border border-destructive/30 rounded-sm text-sm outline-none focus:border-destructive bg-destructive/5 placeholder:text-destructive/40"
                    placeholder="Enter official resolution details..."
                  />
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button type="submit" className="h-10 px-6 bg-primary text-white font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-[#1a3d2e] shadow-sm transition-all border-b-2 border-[#0e221a]">
                  Execute Operation
                </button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* New Grievance Entry Modal */}
      <Dialog open={isNewEntryOpen} onOpenChange={setIsNewEntryOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold uppercase tracking-tight text-slate-800">Register New Grievance</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateComplaint} className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Incident Title *</label>
              <input required value={newEntryData.title} onChange={e => setNewEntryData({ ...newEntryData, title: e.target.value })} className="w-full h-10 px-3 border border-slate-200 rounded-sm text-sm" placeholder="e.g. Broken Water Pipe" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Detail Description *</label>
              <textarea required value={newEntryData.description} onChange={e => setNewEntryData({ ...newEntryData, description: e.target.value })} className="w-full h-24 p-3 border border-slate-200 rounded-sm text-sm resize-none" placeholder="Provide clear details of the incident..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Category *</label>
                <select value={newEntryData.category} onChange={e => setNewEntryData({ ...newEntryData, category: e.target.value })} className="w-full h-10 px-3 bg-white border border-slate-200 rounded-sm text-sm font-medium">
                  <option>Infrastructure</option><option>Sanitation</option><option>Electrical</option><option>Water</option><option>General</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Priority *</label>
                <select value={newEntryData.priority} onChange={e => setNewEntryData({ ...newEntryData, priority: e.target.value })} className="w-full h-10 px-3 bg-white border border-slate-200 rounded-sm text-sm font-medium">
                  <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
                </select>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button type="submit" disabled={isSubmitting} className="h-10 px-6 bg-primary text-white font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-[#1a3d2e] shadow-sm transition-all border-b-2 border-[#0e221a] disabled:opacity-50">
                {isSubmitting ? "Processing..." : "Submit Grievance"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Complaints;

