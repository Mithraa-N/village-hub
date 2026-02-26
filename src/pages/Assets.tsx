import { useState, useEffect } from "react";
import { AppLayout } from "@/components/AppLayout";
import { getConditionClass, type AssetCategory, type AssetCondition } from "@/data/mockData";
import { Search, Filter, Plus, Edit2, Loader2, Building2 } from "lucide-react";
import { getUser, getAuthToken } from "@/lib/auth";
import { toast } from "sonner";

interface Asset {
  id: string;
  name: string;
  category: string;
  ward: string;
  location: string;
  condition: string;
  responsibleRole: string;
}

const Assets = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<AssetCondition | "All">("All");
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
        toast.error("Failed to fetch asset registry");
      }
    } catch (err) {
      toast.error("Network synchronization error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "All" || asset.condition === filter;
    return matchesSearch && matchesFilter;
  });

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
      <div className="page-header border-b-2 border-slate-200 pb-8 mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="h-4 w-4 text-primary" />
            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Village Management Digital Portal</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tighter uppercase">Infrastructure Asset Registry</h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">Ministry of Rural Development · Inventory Control</p>
        </div>
        <button className="h-12 px-8 bg-primary text-white font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-[#1a3d2e] shadow-sm transition-all border-b-2 border-[#0e221a]">
          Register New Asset
        </button>
      </div>

      {/* Registry Condition Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="border border-slate-200 p-6 rounded-sm bg-white shadow-sm">
          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Total Enumerated Items</div>
          <div className="text-3xl font-bold text-slate-900 tracking-tighter">{assets.length}</div>
        </div>
        <div className="border border-warning/50 bg-warning/5 p-6 rounded-sm shadow-sm">
          <div className="text-[9px] font-bold text-[#b45309] uppercase tracking-widest mb-2">Minor Issues Detected</div>
          <div className="text-3xl font-bold text-slate-900 tracking-tighter">{assets.filter(a => a.condition === 'Minor Issue').length}</div>
        </div>
        <div className="border border-destructive/50 bg-destructive/5 p-6 rounded-sm shadow-sm">
          <div className="text-[9px] font-bold text-destructive uppercase tracking-widest mb-2">Critical Fault Warnings</div>
          <div className="text-3xl font-bold text-slate-900 tracking-tighter">{assets.filter(a => a.condition === 'Major Fault').length}</div>
        </div>
        <div className="border border-primary/50 bg-primary/5 p-6 rounded-sm shadow-sm">
          <div className="text-[9px] font-bold text-primary uppercase tracking-widest mb-2">Operational Index</div>
          <div className="text-3xl font-bold text-slate-900 tracking-tighter">
            {Math.round((assets.filter(a => a.condition === 'Working').length / assets.length) * 100)}%
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-secondary/50 p-6 border border-slate-200 rounded-sm mb-10 flex flex-wrap gap-6 items-end">
        <div className="flex-1 min-w-[300px]">
          <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Registry Search Operator</label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Type asset description or serial code to search..."
              className="w-full h-12 pl-12 pr-4 bg-white border border-slate-200 rounded-sm text-sm outline-none focus:border-primary font-bold text-slate-800 placeholder:text-slate-300 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="min-w-[200px]">
          <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Condition Filter</label>
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <select
              className="w-full h-12 pl-10 pr-4 bg-white border border-slate-200 rounded-sm text-[10px] font-bold uppercase outline-none focus:border-primary appearance-none cursor-pointer"
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
            >
              <option value="All">Full Asset Spectrum</option>
              <option value="Working">Verified Operational</option>
              <option value="Minor Issue">Minor Inspection Required</option>
              <option value="Major Fault">Critical Maintenance Alert</option>
              <option value="Under Repair">Maintenance in Progress</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-sm overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-secondary/30 border-b-2 border-slate-200">
              <th className="px-6 py-5 text-left font-bold text-slate-500 uppercase text-[10px] tracking-widest">Digital Registry Entry</th>
              <th className="px-6 py-5 text-left font-bold text-slate-500 uppercase text-[10px] tracking-widest">Geographic Allocation</th>
              <th className="px-6 py-5 text-center font-bold text-slate-500 uppercase text-[10px] tracking-widest">System Condition</th>
              <th className="px-6 py-5 text-right font-bold text-slate-500 uppercase text-[10px] tracking-widest">Administrative Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y border-t border-slate-100">
            {filteredAssets.map(asset => (
              <tr key={asset.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-5">
                  <div className="font-bold text-slate-900 text-xs uppercase tracking-tight">{asset.name}</div>
                  <div className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">DOMAIN: {asset.category} · SERIAL: {asset.id.split('-')[0]}</div>
                </td>
                <td className="px-6 py-5">
                  <div className="font-bold text-slate-700 text-[11px] uppercase tracking-tight">{asset.location}</div>
                  <div className="text-[9px] font-bold text-primary uppercase mt-1 tracking-widest">{asset.ward}</div>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className={`px-2.5 py-1 rounded-sm text-[9px] font-bold uppercase tracking-tighter shadow-sm border ${getConditionClass(asset.condition as AssetCondition)}`}>
                    {asset.condition}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex justify-end gap-3">
                    <button className="px-3 py-1.5 border border-slate-200 text-[9px] font-bold text-slate-600 hover:bg-slate-50 hover:text-primary transition-all uppercase tracking-widest rounded-sm">
                      Update Log
                    </button>
                    <button className="px-3 py-1.5 border border-slate-200 text-[9px] font-bold text-slate-400 hover:text-destructive hover:bg-destructive/5 transition-all uppercase tracking-widest rounded-sm">
                      Archive
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredAssets.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-20 text-center text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] italic bg-slate-50/30">
                  No records matching current criteria found in system database.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-12 pt-8 border-t border-slate-100 flex justify-between items-center">
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
          Showing {filteredAssets.length} of {assets.length} official records · Data Integrity Verified
        </p>
        <div className="flex gap-4">
          <span className="text-[9px] font-bold text-slate-300 uppercase">Export Registry (CSV/PDF)</span>
        </div>
      </div>
    </AppLayout>
  );
};

export default Assets;
