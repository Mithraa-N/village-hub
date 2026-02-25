// Mock data for the Village Management System

export type AssetCategory = "School" | "Water Point" | "Road" | "Power" | "Health Center" | "Community Hall";
export type AssetCondition = "Working" | "Minor Issue" | "Major Fault" | "Under Repair" | "Decommissioned";
export type ComplaintStatus = "Submitted" | "Assigned" | "In Progress" | "Resolved" | "Closed";
export type UserRole = "Admin" | "Operator" | "Viewer";

export interface Asset {
  id: string;
  name: string;
  category: AssetCategory;
  ward: string;
  location: string;
  condition: AssetCondition;
  lastInspection: string;
  responsibleRole: string;
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  assetId: string | null;
  assetName: string | null;
  category: string;
  status: ComplaintStatus;
  submittedBy: string;
  assignedTo: string | null;
  submittedDate: string;
  resolvedDate: string | null;
  ward: string;
}

export interface BudgetEntry {
  id: string;
  category: string;
  allocated: number;
  spent: number;
  pending: number;
  linkedActivity: string;
  fiscalYear: string;
}

export interface MaintenanceLog {
  id: string;
  assetId: string;
  assetName: string;
  type: "Repair" | "Inspection" | "Replacement";
  description: string;
  date: string;
  cost: number;
  performedBy: string;
}

export const assets: Asset[] = [
  { id: "AST-001", name: "Primary School Block A", category: "School", ward: "Ward 1 - Ganeshpur", location: "Near Main Road, Block A", condition: "Working", lastInspection: "2025-12-10", responsibleRole: "Education Officer" },
  { id: "AST-002", name: "Handpump #14", category: "Water Point", ward: "Ward 2 - Lakshmipur", location: "Behind Temple, South Side", condition: "Minor Issue", lastInspection: "2025-11-28", responsibleRole: "Water Committee Head" },
  { id: "AST-003", name: "Village Road - Sector 3", category: "Road", ward: "Ward 1 - Ganeshpur", location: "Sector 3, NH-12 to Market", condition: "Major Fault", lastInspection: "2025-10-15", responsibleRole: "PWD Liaison" },
  { id: "AST-004", name: "Solar Street Light #7", category: "Power", ward: "Ward 3 - Rampur", location: "Junction near Post Office", condition: "Under Repair", lastInspection: "2025-12-01", responsibleRole: "Electricity Committee" },
  { id: "AST-005", name: "Sub Health Center", category: "Health Center", ward: "Ward 2 - Lakshmipur", location: "Main Market Road", condition: "Working", lastInspection: "2026-01-05", responsibleRole: "ANM Supervisor" },
  { id: "AST-006", name: "Community Hall", category: "Community Hall", ward: "Ward 1 - Ganeshpur", location: "Village Center", condition: "Minor Issue", lastInspection: "2025-11-20", responsibleRole: "Gram Panchayat Secretary" },
  { id: "AST-007", name: "Borewell #3", category: "Water Point", ward: "Ward 3 - Rampur", location: "Near School Compound", condition: "Decommissioned", lastInspection: "2025-09-10", responsibleRole: "Water Committee Head" },
  { id: "AST-008", name: "Middle School Block B", category: "School", ward: "Ward 2 - Lakshmipur", location: "East End, Near Pond", condition: "Working", lastInspection: "2026-01-12", responsibleRole: "Education Officer" },
  { id: "AST-009", name: "Transformer Unit #2", category: "Power", ward: "Ward 1 - Ganeshpur", location: "Behind Ration Shop", condition: "Major Fault", lastInspection: "2025-12-20", responsibleRole: "Electricity Committee" },
  { id: "AST-010", name: "Panchayat Road - Link", category: "Road", ward: "Ward 3 - Rampur", location: "Rampur to NH-12 Link", condition: "Working", lastInspection: "2026-02-01", responsibleRole: "PWD Liaison" },
];

export const complaints: Complaint[] = [
  { id: "CMP-001", title: "Handpump not working", description: "Handpump #14 leaking from base, low water output", assetId: "AST-002", assetName: "Handpump #14", category: "Water", status: "In Progress", submittedBy: "Rajesh Kumar", assignedTo: "Water Committee Head", submittedDate: "2026-02-10", resolvedDate: null, ward: "Ward 2 - Lakshmipur" },
  { id: "CMP-002", title: "Road pothole dangerous", description: "Large pothole on Sector 3 road causing accidents", assetId: "AST-003", assetName: "Village Road - Sector 3", category: "Road", status: "Submitted", submittedBy: "Sunita Devi", assignedTo: null, submittedDate: "2026-02-18", resolvedDate: null, ward: "Ward 1 - Ganeshpur" },
  { id: "CMP-003", title: "Street light not working", description: "Solar light #7 not turning on for 2 weeks", assetId: "AST-004", assetName: "Solar Street Light #7", category: "Power", status: "Assigned", submittedBy: "Mohan Lal", assignedTo: "Electricity Committee", submittedDate: "2026-02-12", resolvedDate: null, ward: "Ward 3 - Rampur" },
  { id: "CMP-004", title: "School roof leaking", description: "Roof leak in classroom 3, Block A during rain", assetId: "AST-001", assetName: "Primary School Block A", category: "Education", status: "Resolved", submittedBy: "Headmaster Singh", assignedTo: "PWD Liaison", submittedDate: "2026-01-15", resolvedDate: "2026-02-05", ward: "Ward 1 - Ganeshpur" },
  { id: "CMP-005", title: "No electricity for 3 days", description: "Transformer #2 blown, entire ward without power", assetId: "AST-009", assetName: "Transformer Unit #2", category: "Power", status: "In Progress", submittedBy: "Village Sarpanch", assignedTo: "Electricity Committee", submittedDate: "2026-02-20", resolvedDate: null, ward: "Ward 1 - Ganeshpur" },
  { id: "CMP-006", title: "Water quality issue", description: "Borewell water has yellow tint and bad smell", assetId: "AST-007", assetName: "Borewell #3", category: "Water", status: "Closed", submittedBy: "Anita Kumari", assignedTo: "Water Committee Head", submittedDate: "2025-12-01", resolvedDate: "2025-12-20", ward: "Ward 3 - Rampur" },
];

export const budgetEntries: BudgetEntry[] = [
  { id: "BDG-001", category: "Road Maintenance", allocated: 500000, spent: 320000, pending: 80000, linkedActivity: "Pothole repair - Sector 3", fiscalYear: "2025-26" },
  { id: "BDG-002", category: "Water Supply", allocated: 300000, spent: 180000, pending: 45000, linkedActivity: "Handpump repair & borewell maintenance", fiscalYear: "2025-26" },
  { id: "BDG-003", category: "Power Infrastructure", allocated: 250000, spent: 90000, pending: 120000, linkedActivity: "Street light repair, transformer replacement", fiscalYear: "2025-26" },
  { id: "BDG-004", category: "School Infrastructure", allocated: 400000, spent: 280000, pending: 60000, linkedActivity: "Roof repair, furniture, boundary wall", fiscalYear: "2025-26" },
  { id: "BDG-005", category: "Health Services", allocated: 200000, spent: 150000, pending: 25000, linkedActivity: "Medical supplies, facility upkeep", fiscalYear: "2025-26" },
  { id: "BDG-006", category: "Community Buildings", allocated: 150000, spent: 45000, pending: 30000, linkedActivity: "Hall painting, electrical work", fiscalYear: "2025-26" },
];

export const maintenanceLogs: MaintenanceLog[] = [
  { id: "MNT-001", assetId: "AST-001", assetName: "Primary School Block A", type: "Repair", description: "Roof patching in classroom 3", date: "2026-02-05", cost: 45000, performedBy: "Local Contractor - Ram Builders" },
  { id: "MNT-002", assetId: "AST-002", assetName: "Handpump #14", type: "Repair", description: "Replaced washer and cylinder", date: "2026-02-15", cost: 3500, performedBy: "PHE Department Mechanic" },
  { id: "MNT-003", assetId: "AST-004", assetName: "Solar Street Light #7", type: "Replacement", description: "Battery replacement pending", date: "2026-02-12", cost: 8000, performedBy: "Solar Vendor - GreenTech" },
  { id: "MNT-004", assetId: "AST-003", assetName: "Village Road - Sector 3", type: "Inspection", description: "Damage assessment after monsoon", date: "2025-10-15", cost: 0, performedBy: "PWD Junior Engineer" },
  { id: "MNT-005", assetId: "AST-009", assetName: "Transformer Unit #2", type: "Repair", description: "Coil rewinding in progress", date: "2026-02-22", cost: 65000, performedBy: "State Electricity Board" },
];

// Helper functions
export function getConditionClass(condition: AssetCondition): string {
  const map: Record<AssetCondition, string> = {
    "Working": "status-working",
    "Minor Issue": "status-minor",
    "Major Fault": "status-major",
    "Under Repair": "status-repair",
    "Decommissioned": "status-decommissioned",
  };
  return map[condition];
}

export function getComplaintStatusClass(status: ComplaintStatus): string {
  const map: Record<ComplaintStatus, string> = {
    "Submitted": "status-minor",
    "Assigned": "status-repair",
    "In Progress": "status-repair",
    "Resolved": "status-working",
    "Closed": "status-decommissioned",
  };
  return map[status];
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

export function getDashboardStats() {
  const totalAssets = assets.length;
  const faultyAssets = assets.filter(a => a.condition === "Major Fault" || a.condition === "Under Repair").length;
  const openComplaints = complaints.filter(c => c.status !== "Closed" && c.status !== "Resolved").length;
  const overdueComplaints = complaints.filter(c => {
    if (c.status === "Closed" || c.status === "Resolved") return false;
    const submitted = new Date(c.submittedDate);
    const now = new Date();
    const days = Math.floor((now.getTime() - submitted.getTime()) / (1000 * 60 * 60 * 24));
    return days > 7;
  }).length;
  const totalBudget = budgetEntries.reduce((s, b) => s + b.allocated, 0);
  const totalSpent = budgetEntries.reduce((s, b) => s + b.spent, 0);
  const utilizationPercent = Math.round((totalSpent / totalBudget) * 100);

  return { totalAssets, faultyAssets, openComplaints, overdueComplaints, totalBudget, totalSpent, utilizationPercent };
}
