import React, { useState, useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import EarningsSummaryCards from "../../components/Finance/EarningsSummaryCards";
import EarningsChart from "../../components/Finance/EarningsChart";
import EarningsTable from "../../components/Finance/EarningsTable";
import { Download } from "lucide-react";
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

                        {/* Visualization Section - Full Width Chart */}
                        <div className="w-full">
                            <EarningsChart graphData={data?.graph} />
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
