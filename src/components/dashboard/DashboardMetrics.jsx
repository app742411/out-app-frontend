import React, { useEffect, useState } from "react";
import { 
    CalendarCheck, 
    Home, 
    Users, 
    CreditCard,
    TrendingUp,
    TrendingDown 
} from "lucide-react";

const MetricCard = ({ title, value, icon: Icon, subText, trend, trendValue, color }) => (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="flex items-center justify-between">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-white/[0.05]`}>
                <Icon className={`${color}`} size={24} />
            </div>
            {trend && (
                <div className={`flex items-center gap-1 text-xs font-medium ${trend === 'up' ? "text-green-500" : "text-red-500"}`}>
                    {trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    <span>{trendValue}%</span>
                </div>
            )}
        </div>
        <div className="mt-4">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <div className="flex items-baseline gap-2 mt-1">
                <h4 className="text-2xl font-bold text-gray-800 dark:text-white/90">{value}</h4>
                {subText && <span className="text-xs text-gray-400 font-normal">{subText}</span>}
            </div>
        </div>
    </div>
);

export default function DashboardMetrics({ data }) {
    const [metrics, setMetrics] = useState({
        bookings: 0,
        occupancy: 0,
        users: 0,
        revenue: 0
    });

    useEffect(() => {
        if (data?.stats) {
            setMetrics(prev => ({
                ...prev,
                bookings: data.stats.totalBookings || 0,
                revenue: data.stats.netRevenue || 0,
                occupancy: data.stats.occupancyRate || 0,
            }));
        }
    }, [data]);

    const cards = [
        {
            title: "Total Bookings",
            value: metrics.bookings,
            icon: CalendarCheck,
            color: "text-brand-500",
            trend: "up",
            trendValue: "12",
            subText: "vs last month"
        },
        {
            title: "Occupancy Rate",
            value: `${metrics.occupancy}%`,
            icon: Home,
            color: "text-blue-500",
            trend: "up",
            trendValue: "5.4",
            subText: "average capacity"
        },
        {
            title: "Total Service Users",
            value: metrics.users,
            icon: Users,
            color: "text-purple-500",
            trend: "up",
            trendValue: "8.2",
            subText: "platform wide"
        },
        {
            title: "Net Revenue",
            value: `SAR ${metrics.revenue.toLocaleString()}`,
            icon: CreditCard,
            color: "text-orange-500",
            trend: "up",
            trendValue: "14.5",
            subText: "gross income"
        }
    ];

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((card, idx) => (
                <MetricCard key={idx} {...card} />
            ))}
        </div>
    );
}
