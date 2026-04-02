import React, { useState, useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import EarningsSummaryCards from "../../components/Finance/EarningsSummaryCards";
import EarningsChart from "../../components/Finance/EarningsChart";
import EarningsTable from "../../components/Finance/EarningsTable";
import { Download, Calendar, TrendingUp } from "lucide-react";
import Button from "../../components/ui/button/Button";
import toast from "react-hot-toast";
import { getAdminEarningsDashboard, exportEarningsCSV, exportEarningsPDF } from "../../api/authApi";
import Pagination from "../../components/common/Pagination";

export default function EarningsReportPage() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const fetchEarningsData = async (page = 1) => {
        try {
            setLoading(true);
            const res = await getAdminEarningsDashboard({ page, limit: 10 });
            if (res?.data) {
                setData(res.data);
                setCurrentPage(page);
            }
        } catch (error) {
            console.error("Failed to load earnings data", error);
            toast.error("Failed to load latest financial data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEarningsData();
    }, []);

    const handleExport = async (format) => {
        try {
            toast.loading(`Preparing ${format} report...`, { id: "exporting" });
            const res = format === "CSV" ? await exportEarningsCSV() : await exportEarningsPDF();
            
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Earnings_Report_${new Date().toISOString().split('T')[0]}.${format.toLowerCase()}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            
            toast.success(`${format} report downloaded!`, { id: "exporting" });
        } catch (error) {
            console.error("Export failed", error);
            toast.error("Failed to generate report", { id: "exporting" });
        }
    };

    return (
        <>
            <PageMeta 
                title="Detailed Financial Earnings | Out Admin" 
                description="Holistic view of revenue, payouts, expenses, and platform fees." 
            />
            
            <PageBreadcrumb pageTitle="Earnings Report" />

            <div className="space-y-6 pb-10">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between -mt-2 mb-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Comprehensive financial audit of all booking transactions.</p>
                    <div className="flex items-center gap-3">
                        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl shadow-sm">
                            <button className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-gray-700 shadow-sm text-brand-500 transition-all">
                                Monthly
                            </button>
                            <button className="px-4 py-1.5 text-xs font-semibold rounded-lg text-gray-500 hover:text-gray-700 transition-all">
                                Yearly
                            </button>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleExport("PDF")}>
                            <Download size={16} className="mr-2" /> PDF Report
                        </Button>
                    </div>
                </div>

                {loading && !data ? (
                    <div className="flex h-96 items-center justify-center">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Key Financial Metrics */}
                        <EarningsSummaryCards stats={data?.stats} />

                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                            {/* Visualization Section */}
                            <div className="lg:col-span-8">
                                <EarningsChart graphData={data?.graph} />
                            </div>

                            {/* Snapshot Profile */}
                            <div className="lg:col-span-4 space-y-6">
                                <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] shadow-sm">
                                    <h3 className="mb-4 text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <Calendar size={14} /> Current Fee Structure
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-white/[0.02]">
                                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Admin Commission</span>
                                            <span className="text-sm font-bold text-brand-500">10%</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-white/[0.02]">
                                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">VAT / Service Tax</span>
                                            <span className="text-sm font-bold text-gray-800 dark:text-white">15%</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50 dark:bg-blue-500/5">
                                            <span className="text-sm font-medium text-blue-600">Next Payout Cycle</span>
                                            <span className="text-sm font-bold text-blue-700">15 March</span>
                                        </div>
                                    </div>
                                    <Button className="w-full mt-6" variant="outline" size="sm">
                                        Manage Settings
                                    </Button>
                                </div>

                                <div className="rounded-2xl border border-gray-200 bg-gray-900 p-6 shadow-xl text-white relative overflow-hidden">
                                    <div className="relative z-10">
                                        <h3 className="font-bold flex items-center gap-2 mb-2">
                                            <TrendingUp size={18} className="text-green-400" /> Financial Insight
                                        </h3>
                                        <p className="text-[11px] text-gray-400 leading-relaxed uppercase font-bold tracking-wider mb-2">Growth Alert</p>
                                        <p className="text-sm text-gray-100 leading-relaxed">
                                            Riyadh properties are generating 40% higher platform fees this quarter. Net profit has crossed SAR {Number(data?.stats?.grossRevenue || 0).toLocaleString()} for the first time.
                                        </p>
                                    </div>
                                    <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-brand-500/20 rounded-full blur-2xl"></div>
                                </div>
                            </div>
                        </div>

                        {/* Detailed Data View */}
                        <div className="space-y-4">
                            <EarningsTable transactions={data?.transactions} isLoading={loading} onExportCSV={() => handleExport("CSV")} />
                            
                            {!loading && data?.pagination && data.pagination.total > 0 && (
                                <div className="flex justify-center mt-6">
                                    <Pagination 
                                        currentPage={data.pagination.page}
                                        totalPages={Math.ceil(data.pagination.total / data.pagination.limit)}
                                        onPageChange={(page) => fetchEarningsData(page)}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
