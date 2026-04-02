import React, { useState, useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ReportSummaryCards from "../../components/Reports/ReportSummaryCards";
import BookingStatusChart from "../../components/Reports/BookingStatusChart";
import RevenueLineChart from "../../components/Reports/RevenueLineChart";
import PropertyBarChart from "../../components/Reports/PropertyBarChart";
import CategoryPerformanceChart from "../../components/Reports/CategoryPerformanceChart";
import { getAdminReports, exportEarningsCSV, exportEarningsPDF } from "../../api/authApi";
import { Download } from "lucide-react";
import Button from "../../components/ui/button/Button";
import toast from "react-hot-toast";

export default function ReportsPage() {
    const [loading, setLoading] = useState(true);
    const [reportData, setReportData] = useState(null);

    useEffect(() => {
        const fetchReportData = async () => {
            try {
                setLoading(true);
                const res = await getAdminReports();
                if (res?.data) {
                    setReportData(res.data);
                }
            } catch (error) {
                console.error("Failed to load report data", error);
                toast.error("Failed to load latest analytics");
            } finally {
                setLoading(false);
            }
        };

        fetchReportData();
    }, []);

    const handleExport = async (type) => {
        try {
            toast.loading(`Preparing ${type} report...`, { id: "export-loading" });
            const res = await getAdminReports(type.toLowerCase());
            
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `admin_report_${new Date().toISOString().split('T')[0]}.${type.toLowerCase()}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            
            toast.success(`${type} Export successful`, { id: "export-loading" });
        } catch (error) {
            console.error(`Export failed: ${type}`, error);
            toast.error(`Failed to export ${type} report`, { id: "export-loading" });
        }
    };

    const handleExportEarnings = async (format) => {
        try {
            toast.loading(`Preparing Earnings ${format} report...`, { id: "exporting-earnings" });
            const res = format === "CSV" ? await exportEarningsCSV() : await exportEarningsPDF();
            
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Earnings_Report_${new Date().toISOString().split('T')[0]}.${format.toLowerCase()}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            
            toast.success(`Earnings ${format} report downloaded!`, { id: "exporting-earnings" });
        } catch (error) {
            console.error("Earnings Export failed", error);
            toast.error("Failed to generate earnings report", { id: "exporting-earnings" });
        }
    };

    return (
        <>
            <PageMeta title="Reports & Analytics | Out Admin" description="View detailed reports and analytics for the booking system." />
            <PageBreadcrumb pageTitle="Reports & Analytics" />
            
            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between -mt-2 mb-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400">View detailed reports and analytics for the booking system.</div>
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 mr-2">
                             <Button variant="outline" size="sm" onClick={() => handleExport("CSV")} id="export-summary-csv">
                                <Download size={14} className="mr-1.5" /> Summary CSV
                            </Button>
                            <Button size="sm" onClick={() => handleExport("PDF")} id="export-summary-pdf">
                                <Download size={14} className="mr-1.5" /> Summary PDF
                            </Button>
                        </div>

                        <div className="h-8 w-px bg-gray-200 dark:bg-gray-800 hidden md:block"></div>

                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleExportEarnings("CSV")} id="export-earnings-csv" className="border-green-200 text-green-600 hover:bg-green-50 dark:border-green-900 dark:text-green-400">
                                <Download size={14} className="mr-1.5" /> Earnings CSV
                            </Button>
                            <Button size="sm" onClick={() => handleExportEarnings("PDF")} id="export-earnings-pdf" className="bg-green-600 hover:bg-green-700">
                                <Download size={14} className="mr-1.5" /> Earnings PDF
                            </Button>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex h-96 items-center justify-center">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Summary Metrics */}
                        <ReportSummaryCards metrics={reportData?.stats} />

                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                            {/* Revenue Chart */}
                            <div className="lg:col-span-8">
                                <RevenueLineChart data={{ revenueGraph: reportData?.revenueGraph }} />
                            </div>

                            {/* Booking Status distribution */}
                            <div className="lg:col-span-4">
                                <BookingStatusChart data={{ bookingStatus: {
                                    confirmed: reportData?.bookingStatusChart?.find(i => i.name === "Confirmed")?.value || 0,
                                    pending: reportData?.bookingStatusChart?.find(i => i.name === "Pending")?.value || 0,
                                    cancelled: reportData?.bookingStatusChart?.find(i => i.name === "Cancelled")?.value || 0
                                }}} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                            {/* Location Analytics instead of property bar for now or keep both */}
                            <div className="lg:col-span-8">
                                <PropertyBarChart data={{ topProperties: reportData?.locationAnalytics?.map(l => ({ name: l._id, totalBookings: l.totalBookings })) }} />
                            </div>

                            {/* Category Distribution */}
                            <div className="lg:col-span-4">
                                <CategoryPerformanceChart data={reportData?.bookingsByCategory} />
                            </div>
                        </div>

                        {/* Additional Analytics Card */}
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                            <div className="lg:col-span-12 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
                                <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
                                    Quick Insights & Trends
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                                        <div>
                                            <p className="text-xs font-medium text-gray-500 uppercase">Retention Rate</p>
                                            <p className="text-sm font-bold text-gray-800 dark:text-white">{reportData?.retentionRate || 0}% Repeat Guests</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-medium text-green-500">Industry leading</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                                        <div>
                                            <p className="text-xs font-medium text-gray-500 uppercase">Top Search Location</p>
                                            <p className="text-sm font-bold text-gray-800 dark:text-white">{reportData?.locationAnalytics?.[0]?._id || "N/A"}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-medium text-blue-500">{reportData?.locationAnalytics?.[0]?.totalBookings || 0} Bookings</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                                        <div>
                                            <p className="text-xs font-medium text-gray-500 uppercase">Growth Rate</p>
                                            <p className="text-sm font-bold text-gray-800 dark:text-white">+{reportData?.stats?.revenueGrowthPercent || 0}% MoM</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-medium text-purple-500">Steady</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-between items-center text-xs text-gray-500">
                                    <p className="italic">*Insights are based on data from the last 30 days.</p>
                                    <p>Last updated: {new Date().toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
