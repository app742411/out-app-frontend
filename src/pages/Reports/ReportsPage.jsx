import React, { useState, useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ReportSummaryCards from "../../components/Reports/ReportSummaryCards";
import BookingStatusChart from "../../components/Reports/BookingStatusChart";
import RevenueLineChart from "../../components/Reports/RevenueLineChart";
import PropertyBarChart from "../../components/Reports/PropertyBarChart";
import CategoryPerformanceChart from "../../components/Reports/CategoryPerformanceChart";
import { getAdminReports } from "../../api/authApi";
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

    return (
        <>
            <PageMeta title="Reports & Analytics | Out Admin" description="View detailed reports and analytics for the booking system." />
            <PageBreadcrumb pageTitle="Reports & Analytics" />
            
            <div className="space-y-6 pb-10">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between -mt-2 mb-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Detailed overview of booking metrics and financial charts.</div>
                    <div className="flex items-center gap-3 shrink-0">
                         <Button variant="outline" size="sm" onClick={() => handleExport("CSV")} id="export-summary-csv">
                            <Download size={14} className="mr-1.5" /> Summary CSV
                        </Button>
                        <Button size="sm" onClick={() => handleExport("PDF")} id="export-summary-pdf">
                            <Download size={14} className="mr-1.5" /> Summary PDF
                        </Button>
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
                            <div className="lg:col-span-12 rounded-3xl border border-gray-250 bg-white/70 p-6 dark:border-gray-800/80 dark:bg-gray-900/60 shadow-[0_8px_30px_rgb(0,0,0,0.012)] backdrop-blur-md transition-all duration-300 hover:shadow-[0_15px_40px_rgba(70,95,255,0.03)]">
                                <h3 className="mb-4 text-base font-bold text-gray-800 dark:text-white/90">
                                    Quick Insights & Trends
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/50 border border-gray-150/40 dark:border-gray-800/40 dark:bg-white/[0.01]">
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Retention Rate</p>
                                            <p className="text-sm font-extrabold text-gray-800 dark:text-white mt-1">{reportData?.retentionRate || 0}% Repeat Guests</p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="text-xs font-bold text-green-600 dark:text-green-400">Excellent</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/50 border border-gray-150/40 dark:border-gray-800/40 dark:bg-white/[0.01]">
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Top Search Location</p>
                                            <p className="text-sm font-extrabold text-gray-800 dark:text-white mt-1 truncate max-w-[150px]">{reportData?.locationAnalytics?.[0]?._id || "N/A"}</p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="text-xs font-bold text-blue-600 dark:text-blue-400">{reportData?.locationAnalytics?.[0]?.totalBookings || 0} Bookings</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/50 border border-gray-150/40 dark:border-gray-800/40 dark:bg-white/[0.01]">
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Growth Rate</p>
                                            <p className="text-sm font-extrabold text-gray-800 dark:text-white mt-1">+{reportData?.stats?.revenueGrowthPercent || 0}% MoM</p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="text-xs font-bold text-purple-600 dark:text-purple-400">Steady</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-between items-center text-[10px] font-medium text-gray-400 dark:text-gray-500">
                                    <p className="italic">*Insights are based on data from the last 30 days.</p>
                                    <p>Last updated: {new Date().toLocaleTimeString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
