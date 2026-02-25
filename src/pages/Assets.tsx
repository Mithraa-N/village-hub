import { useState, useEffect } from "react";
import { AppLayout } from "@/components/AppLayout";
import { getConditionClass, type AssetCategory, type AssetCondition } from "@/data/mockData";
import { Search, Filter, Plus, Edit2, Loader2 } from "lucide-react";
import { getUser, getAuthToken } from "@/lib/auth";
import { toast } from "sonner";

interface Asset {
  id: string;
  name: string;
  category: string;
  ward: string;
  location: string;
  condition: string;
  lastInspection: string;
  responsibleRole: string;
}

const categories = ["School", "Water Point", "Road", "Power", "Health Center", "Community Hall"];
const conditions = ["Working", "Minor Issue", "Major Fault", "Under Repair", "Decommissioned"];

const Assets = () => {
  const user = getUser();
  const canModify = user?.role === "ADMIN" || user?.role === "OPERATOR";

  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [conditionFilter, setConditionFilter] = useState<string>("All");

  const fetchAssets = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/v1/assets", {
        headers: {
          "Authorization": `Bearer ${getAuthToken()}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setAssets(data);
      } else {
        toast.error("Failed to load assets");
      }
    } catch (err) {
      toast.error("Network error while loading assets");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const filtered = assets.filter(a => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.id.toLowerCase().includes(search.toLowerCase()) ||
      a.ward.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === "All" || a.category === categoryFilter;
    const matchCondition = conditionFilter === "All" || a.condition === conditionFilter;
    return matchSearch && matchCategory && matchCondition;
  });

  return (
    <AppLayout>
      <div className="page-header flex justify-between items-end">
        <div>
          <h1>Asset Registry</h1>
          <p>Village infrastructure assets — {assets.length} total records</p>
        </div>
        {canModify && (
          <button className="bg-primary text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors">
            <Plus className="h-5 w-5" />
            NEW ASSET
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, ID, or ward..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-3 py-2 text-sm border rounded-md bg-card focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="h-10 text-sm border rounded-md px-2 py-2 bg-card focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="All">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={conditionFilter}
            onChange={e => setConditionFilter(e.target.value)}
            className="h-10 text-sm border rounded-md px-2 py-2 bg-card focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="All">All Conditions</option>
            {conditions.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
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
              <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">ID</th>
              <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Asset Name</th>
              <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Category</th>
              <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Ward / Location</th>
              <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Condition</th>
              <th className="text-left px-3 py-2.5 font-medium text-muted-foreground text-center">Last Insp</th>
              <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Responsible</th>
              {canModify && <th className="text-right px-3 py-2.5 font-medium text-muted-foreground">Actions</th>}
            </tr>
          </thead>

          <tbody>
            {filtered.map(asset => (
              <tr key={asset.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-3 py-2.5 font-mono text-[10px] text-muted-foreground truncate max-w-[80px]" title={asset.id}>
                  {asset.id.split('-')[0]}...
                </td>
                <td className="px-3 py-2.5 font-bold text-slate-900">{asset.name}</td>
                <td className="px-3 py-2.5">
                  <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-bold uppercase">{asset.category}</span>
                </td>
                <td className="px-3 py-2.5">
                  <div className="font-bold text-[11px]">{asset.ward}</div>
                  <div className="text-[10px] text-muted-foreground">{asset.location}</div>
                </td>
                <td className="px-3 py-2.5">
                  <span className={`status-badge ${getConditionClass(asset.condition as AssetCondition)} text-[10px]`}>
                    {asset.condition}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-muted-foreground text-[11px] text-center">
                  {new Date(asset.lastInspection).toLocaleDateString()}
                </td>
                <td className="px-3 py-2.5 text-[11px] text-muted-foreground font-medium">{asset.responsibleRole}</td>
                {canModify && (
                  <td className="px-3 py-2.5 text-right">
                    <button className="p-1.5 hover:bg-primary/10 rounded text-primary transition-colors">
                      <Edit2 className="h-4 w-4" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {filtered.length === 0 && !isLoading && (
              <tr>
                <td colSpan={canModify ? 8 : 7} className="px-3 py-12 text-center text-muted-foreground">
                  No assets found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-[10px] font-bold text-muted-foreground mt-3 uppercase tracking-wider">
        Displaying {filtered.length} of {assets.length} live records from council database
      </p>
    </AppLayout>
  );
};

export default Assets;

