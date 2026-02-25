import { AppLayout } from "@/components/AppLayout";
import { budgetEntries, formatCurrency } from "@/data/mockData";
import { Progress } from "@/components/ui/progress";

const Budget = () => {
  const totalAllocated = budgetEntries.reduce((s, b) => s + b.allocated, 0);
  const totalSpent = budgetEntries.reduce((s, b) => s + b.spent, 0);
  const totalPending = budgetEntries.reduce((s, b) => s + b.pending, 0);
  const totalRemaining = totalAllocated - totalSpent - totalPending;

  return (
    <AppLayout>
      <div className="page-header">
        <h1>Budget Tracking</h1>
        <p>Category-level budget allocation and expenditure · FY 2025-26</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="stat-card">
          <p className="text-xs font-medium text-muted-foreground mb-1">Total Allocated</p>
          <p className="text-xl font-heading font-bold">{formatCurrency(totalAllocated)}</p>
        </div>
        <div className="stat-card">
          <p className="text-xs font-medium text-muted-foreground mb-1">Total Spent</p>
          <p className="text-xl font-heading font-bold">{formatCurrency(totalSpent)}</p>
        </div>
        <div className="stat-card">
          <p className="text-xs font-medium text-muted-foreground mb-1">Pending</p>
          <p className="text-xl font-heading font-bold text-warning">{formatCurrency(totalPending)}</p>
        </div>
        <div className="stat-card">
          <p className="text-xs font-medium text-muted-foreground mb-1">Remaining</p>
          <p className="text-xl font-heading font-bold text-success">{formatCurrency(totalRemaining)}</p>
        </div>
      </div>

      {/* Budget Breakdown */}
      <div className="space-y-4 mb-6">
        {budgetEntries.map(entry => {
          const utilization = Math.round((entry.spent / entry.allocated) * 100);
          const pendingPercent = Math.round((entry.pending / entry.allocated) * 100);

          return (
            <div key={entry.id} className="bg-card border rounded-md p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-heading font-bold text-sm">{entry.category}</h3>
                  <p className="text-xs text-muted-foreground">{entry.linkedActivity}</p>
                </div>
                <span className="font-mono text-xs text-muted-foreground">{entry.id}</span>
              </div>

              <div className="mb-2">
                <Progress value={utilization} className="h-2" />
              </div>

              <div className="flex flex-wrap gap-4 text-xs">
                <span>
                  <span className="text-muted-foreground">Allocated: </span>
                  <span className="font-medium">{formatCurrency(entry.allocated)}</span>
                </span>
                <span>
                  <span className="text-muted-foreground">Spent: </span>
                  <span className="font-medium">{formatCurrency(entry.spent)} ({utilization}%)</span>
                </span>
                <span>
                  <span className="text-muted-foreground">Pending: </span>
                  <span className="font-medium text-warning">{formatCurrency(entry.pending)} ({pendingPercent}%)</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Table */}
      <h2 className="text-base font-bold mb-3">Detailed Budget Table</h2>
      <div className="bg-card border rounded-md overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">ID</th>
              <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Category</th>
              <th className="text-right px-3 py-2.5 font-medium text-muted-foreground">Allocated</th>
              <th className="text-right px-3 py-2.5 font-medium text-muted-foreground">Spent</th>
              <th className="text-right px-3 py-2.5 font-medium text-muted-foreground">Pending</th>
              <th className="text-right px-3 py-2.5 font-medium text-muted-foreground">Remaining</th>
              <th className="text-right px-3 py-2.5 font-medium text-muted-foreground">Utilization</th>
            </tr>
          </thead>
          <tbody>
            {budgetEntries.map(entry => {
              const remaining = entry.allocated - entry.spent - entry.pending;
              const util = Math.round((entry.spent / entry.allocated) * 100);
              return (
                <tr key={entry.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-3 py-2.5 font-mono text-xs text-muted-foreground">{entry.id}</td>
                  <td className="px-3 py-2.5 font-medium">{entry.category}</td>
                  <td className="px-3 py-2.5 text-right font-mono">{formatCurrency(entry.allocated)}</td>
                  <td className="px-3 py-2.5 text-right font-mono">{formatCurrency(entry.spent)}</td>
                  <td className="px-3 py-2.5 text-right font-mono text-warning">{formatCurrency(entry.pending)}</td>
                  <td className="px-3 py-2.5 text-right font-mono text-success">{formatCurrency(remaining)}</td>
                  <td className="px-3 py-2.5 text-right font-heading font-bold">{util}%</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-muted/50 font-medium">
              <td className="px-3 py-2.5" colSpan={2}>Total</td>
              <td className="px-3 py-2.5 text-right font-mono">{formatCurrency(totalAllocated)}</td>
              <td className="px-3 py-2.5 text-right font-mono">{formatCurrency(totalSpent)}</td>
              <td className="px-3 py-2.5 text-right font-mono text-warning">{formatCurrency(totalPending)}</td>
              <td className="px-3 py-2.5 text-right font-mono text-success">{formatCurrency(totalRemaining)}</td>
              <td className="px-3 py-2.5 text-right font-heading font-bold">{Math.round((totalSpent / totalAllocated) * 100)}%</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </AppLayout>
  );
};

export default Budget;
