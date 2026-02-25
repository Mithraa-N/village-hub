import { AppLayout } from "@/components/AppLayout";
import { BarChart3, FileText, Download } from "lucide-react";

const Reports = () => {
    const reports = [
        { title: "Monthly Infrastructure Status", date: "Feb 2026", type: "PDF" },
        { title: "Budget Utilization Summary", date: "Q3 2025-26", type: "Excel" },
        { title: "Citizen Complaint Resolution", date: "Jan 2026", type: "PDF" },
    ];

    return (
        <AppLayout>
            <div className="page-header">
                <h1>Administrative Reports</h1>
                <p>Generated analytics and statutory reports for village council</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <section className="bg-card border rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-primary" />
                        Performance Overview
                    </h2>
                    <div className="space-y-4">
                        <div className="h-40 bg-slate-50 rounded-lg flex items-center justify-center border border-dashed border-slate-200">
                            <span className="text-slate-400 text-sm italic">Analytics charts would render here</span>
                        </div>
                    </div>
                </section>

                <section className="bg-card border rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        Recent Documents
                    </h2>
                    <div className="space-y-3">
                        {reports.map((r, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 hover:border-primary/30 transition-colors">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900">{r.title}</h3>
                                    <p className="text-xs text-slate-500">{r.date} · {r.type}</p>
                                </div>
                                <button className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors">
                                    <Download className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </AppLayout>
    );
};

export default Reports;
