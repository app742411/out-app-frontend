import React from "react";
import { 
    Users, 
    Calendar, 
    TrendingUp, 
    DollarSign 
} from "lucide-react";

const SummaryCard = ({ title, value, icon: Icon, color, percentage, isTrendingUp }) => (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="flex items-center justify-between">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
                <Icon className="text-white" size={24} />
            </div>
            {percentage && (
                <div className={`flex items-center gap-1 text-xs font-medium ${isTrendingUp ? "text-green-500" : "text-red-500"}`}>
                    <TrendingUp className={isTrendingUp ? "" : "rotate-180"} size={16} />
                    <span>{percentage}%</span>
                </div>
            )}
        </div>
        <div className="mt-4">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <h4 className="mt-1 text-2xl font-bold text-gray-800 dark:text-white/90">{value}</h4>
        </div>
    </div>
);

export default function ReportSummaryCards({ metrics }) {
    const cards = [
        {
            title: "Total Revenue",
            value: `SAR ${metrics?.totalRevenue?.toLocaleString() || "0"}`,
            icon: DollarSign,
            color: "bg-brand-500",
            percentage: metrics?.revenueGrowthPercent || "0",
            isTrendingUp: (metrics?.revenueGrowthPercent || 0) >= 0
        },
        {
            title: "Total Bookings",
            value: metrics?.totalBookings || "0",
            icon: Calendar,
            color: "bg-blue-500",
            percentage: metrics?.bookingGrowthPercent || "0",
            isTrendingUp: (metrics?.bookingGrowthPercent || 0) >= 0
        },
        {
            title: "Total Users",
            value: metrics?.totalUsers || "0",
            icon: Users,
            color: "bg-purple-500",
            percentage: "4.3",
            isTrendingUp: true
        },
        {
            title: "Average Booking",
            value: `SAR ${metrics?.avgBooking?.toLocaleString() || "0"}`,
            icon: TrendingUp,
            color: "bg-orange-500",
            percentage: "2.1",
            isTrendingUp: true
        }
    ];

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((card, idx) => (
                <SummaryCard key={idx} {...card} />
            ))}
        </div>
    );
}
