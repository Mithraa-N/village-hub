import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { assets, getConditionClass, type AssetCategory, type AssetCondition } from "@/data/mockData";
import { Search, Filter } from "lucide-react";

const categories: AssetCategory[] = ["School", "Water Point", "Road", "Power", "Health Center", "Community Hall"];
const conditions: AssetCondition[] = ["Working", "Minor Issue", "Major Fault", "Under Repair", "Decommissioned"];

const Assets = () => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [conditionFilter, setConditionFilter] = useState<string>("All");

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
      <div className="page-header">
        <h1>Asset Registry</h1>
        <p>Village infrastructure assets — {assets.length} total records</p>
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
            className="w-full pl-9 pr-3 py-2 text-sm border rounded-md bg-card focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="text-sm border rounded-md px-2 py-2 bg-card focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="All">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={conditionFilter}
            onChange={e => setConditionFilter(e.target.value)}
            className="text-sm border rounded-md px-2 py-2 bg-card focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="All">All Conditions</option>
            {conditions.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border rounded-md overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">ID</th>
              <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Asset Name</th>
              <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Category</th>
              <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Ward / Location</th>
              <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Condition</th>
              <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Last Inspection</th>
              <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Responsible</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(asset => (
              <tr key={asset.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-3 py-2.5 font-mono text-xs text-muted-foreground">{asset.id}</td>
                <td className="px-3 py-2.5 font-medium">{asset.name}</td>
                <td className="px-3 py-2.5 text-muted-foreground">{asset.category}</td>
                <td className="px-3 py-2.5">
                  <div className="font-medium text-xs">{asset.ward}</div>
                  <div className="text-xs text-muted-foreground">{asset.location}</div>
                </td>
                <td className="px-3 py-2.5">
                  <span className={`status-badge ${getConditionClass(asset.condition)}`}>
                    {asset.condition}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap">{asset.lastInspection}</td>
                <td className="px-3 py-2.5 text-xs text-muted-foreground">{asset.responsibleRole}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-3 py-8 text-center text-muted-foreground">
                  No assets match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground mt-3">
        Showing {filtered.length} of {assets.length} assets
      </p>
    </AppLayout>
  );
};

export default Assets;
