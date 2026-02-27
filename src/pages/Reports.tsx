import { AppLayout } from "@/components/AppLayout";
import { BarChart3, FileText, Download } from "lucide-react";
import { toast } from "sonner";

const Reports = () => {
    const reports = [
        { id: "REP-2026-001", title: "Monthly Infrastructure Status Report", date: "Feb 2026", type: "PDF", classification: "Public" },
        { id: "REP-2026-002", title: "Budget Utilization Summary (Consolidated)", date: "Q3 2025-26", type: "XLSX", classification: "Internal" },
        { id: "REP-2026-003", title: "Citizen Grievance Resolution Audit", date: "Jan 2026", type: "PDF", classification: "Authorized" },
    ];

    const handleGenerateReport = () => {
        toast.info("Report Module initializing...", { description: "Custom Report Generator will be enabled in the final deployment." });
    };

    return (
        <AppLayout>
            <div className="page-header border-b pb-6 mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                        <FileText className="h-6 w-6 text-primary" />
                        Statutory Reports & Analytics
                    </h1>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">Official Documentation & System Audit Logs</p>
                </div>
                <button
                    onClick={handleGenerateReport}
                    className="h-10 px-6 bg-primary text-white font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-[#1a3d2e] shadow-sm transition-all border-b-2 border-[#0e221a]"
                >
                    Generate Custom Report
                </button>
            </div>

            <div className="grid lg:grid-cols-12 gap-8">
                {/* Data Overview Section */}
                <section className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
                            <BarChart3 size={80} />
                        </div>
                        <div className="flex flex-col h-full">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Audit Completion Status</span>
                            <div className="text-3xl font-bold text-slate-800 tracking-tighter">94.2%</div>
                            <div className="mt-auto pt-4 border-t border-slate-50 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                                <span className="text-[9px] font-bold text-success uppercase">Internal Verification Positive</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
                            <FileText size={80} />
                        </div>
                        <div className="flex flex-col h-full">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Grievance Resolution Efficiency</span>
                            <div className="text-3xl font-bold text-slate-800 tracking-tighter">18.5 <span className="text-sm text-slate-400 font-medium tracking-normal">hrs</span></div>
                            <div className="mt-auto pt-4 border-t border-slate-50 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                                <span className="text-[9px] font-bold text-primary uppercase">Average Dispatch Time</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Download size={80} />
                        </div>
                        <div className="flex flex-col h-full">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Funds Utilization Index</span>
                            <div className="text-3xl font-bold text-slate-800 tracking-tighter">0.82 <span className="text-sm text-slate-400 font-medium tracking-normal">FYTD</span></div>
                            <div className="mt-auto pt-4 border-t border-slate-50 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#b45309]"></span>
                                <span className="text-[9px] font-bold text-[#b45309] uppercase">Within Nominal Parameters</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Report Registry Section */}
                <section className="lg:col-span-12 bg-white border border-slate-200 rounded-sm overflow-hidden shadow-sm mt-8">
                    <div className="bg-secondary/50 px-5 py-4 border-b border-slate-200">
                        <h2 className="text-xs font-bold text-slate-700 uppercase flex items-center gap-2 tracking-widest">
                            <Download className="w-4 h-4 text-primary" />
                            Official Document Registry
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50 border-b">
                                    <th className="text-left px-5 py-4 font-bold text-slate-500 uppercase text-[10px]">Document ID</th>
                                    <th className="text-left px-5 py-4 font-bold text-slate-500 uppercase text-[10px]">Title & Description</th>
                                    <th className="text-left px-5 py-4 font-bold text-slate-500 uppercase text-[10px]">Period</th>
                                    <th className="text-center px-5 py-4 font-bold text-slate-500 uppercase text-[10px]">Classification</th>
                                    <th className="text-right px-5 py-4 font-bold text-slate-500 uppercase text-[10px]">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {reports.map((r, i) => (
                                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-5 py-4 font-bold text-slate-400 text-[10px] tracking-widest">{r.id}</td>
                                        <td className="px-5 py-4">
                                            <div className="font-bold text-slate-800 text-xs">{r.title}</div>
                                            <div className="text-[9px] font-bold text-primary uppercase mt-0.5">Format: {r.type} Source: Official</div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="text-xs font-bold text-slate-600 uppercase">{r.date}</div>
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <span className={`px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase ${r.classification === 'Public' ? 'bg-success/10 text-success' :
                                                r.classification === 'Internal' ? 'bg-[#b45309]/10 text-[#b45309]' :
                                                    'bg-destructive/10 text-destructive'
                                                }`}>
                                                {r.classification}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <button
                                                onClick={handleGenerateReport}
                                                className="h-8 px-4 bg-white border border-slate-200 text-primary font-bold text-[9px] uppercase tracking-widest rounded-sm hover:bg-slate-50 transition-all shadow-sm"
                                            >
                                                Download {r.type}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>

            <p className="text-[9px] font-bold text-slate-400 mt-8 uppercase tracking-widest text-center">
                All generated reports are digitally signed and cryptographically verifiable.
            </p>
        </AppLayout>
    );
};

export default Reports;
