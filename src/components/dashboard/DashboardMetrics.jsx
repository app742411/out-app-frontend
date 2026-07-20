import React, { useEffect, useState } from "react";
import { 
    CalendarCheck, 
    Home, 
    Users, 
    CreditCard,
    TrendingUp,
    TrendingDown 
} from "lucide-react";

const colorPresets = {
  "text-brand-500": {
    containerBorder: "hover:border-brand-500/25",
    bg: "bg-brand-50/50 dark:bg-brand-500/10",
    border: "border-brand-500/15 dark:border-brand-500/25",
    glow: "bg-brand-500/5 dark:bg-brand-500/10",
    iconText: "text-brand-500",
    shadow: "shadow-[0_8px_30px_rgba(70,95,255,0.03)] hover:shadow-[0_20px_40px_rgba(70,95,255,0.12)]"
  },
  "text-blue-500": {
    containerBorder: "hover:border-blue-500/25",
    bg: "bg-blue-50/50 dark:bg-blue-500/10",
    border: "border-blue-500/15 dark:border-blue-500/25",
    glow: "bg-blue-500/5 dark:bg-blue-500/10",
    iconText: "text-blue-500",
    shadow: "shadow-[0_8px_30px_rgba(59,130,246,0.03)] hover:shadow-[0_20px_40px_rgba(59,130,246,0.12)]"
  },
  "text-purple-500": {
    containerBorder: "hover:border-purple-500/25",
    bg: "bg-purple-50/50 dark:bg-purple-500/10",
    border: "border-purple-500/15 dark:border-purple-500/25",
    glow: "bg-purple-500/5 dark:bg-purple-500/10",
    iconText: "text-purple-500",
    shadow: "shadow-[0_8px_30px_rgba(168,85,247,0.03)] hover:shadow-[0_20px_40px_rgba(168,85,247,0.12)]"
  },
  "text-orange-500": {
    containerBorder: "hover:border-orange-500/25",
    bg: "bg-orange-50/50 dark:bg-orange-500/10",
    border: "border-orange-500/15 dark:border-orange-500/25",
    glow: "bg-orange-500/5 dark:bg-orange-500/10",
    iconText: "text-orange-500",
    shadow: "shadow-[0_8px_30px_rgba(249,115,22,0.03)] hover:shadow-[0_20px_40px_rgba(249,115,22,0.12)]"
  },
  "text-green-500": {
    containerBorder: "hover:border-green-500/25",
    bg: "bg-green-50/50 dark:bg-green-500/10",
    border: "border-green-500/15 dark:border-green-500/25",
    glow: "bg-green-500/5 dark:bg-green-500/10",
    iconText: "text-green-500",
    shadow: "shadow-[0_8px_30px_rgba(16,185,129,0.03)] hover:shadow-[0_20px_40px_rgba(16,185,129,0.12)]"
  },
  "text-red-500": {
    containerBorder: "hover:border-red-500/25",
    bg: "bg-red-50/50 dark:bg-red-500/10",
    border: "border-red-500/15 dark:border-red-500/25",
    glow: "bg-red-500/5 dark:bg-red-500/10",
    iconText: "text-red-500",
    shadow: "shadow-[0_8px_30px_rgba(239,68,68,0.03)] hover:shadow-[0_20px_40px_rgba(239,68,68,0.12)]"
  },
};

const MetricCard = ({ title, value, icon: Icon, subText, trend, trendValue, color }) => {
  const preset = colorPresets[color] || colorPresets["text-brand-500"];

  return (
    <div className={`relative overflow-hidden rounded-3xl border border-gray-250 bg-white/70 p-6 backdrop-blur-md transition-all duration-350 hover:-translate-y-1.5 dark:border-gray-800/80 dark:bg-gray-900/60 group ${preset.containerBorder} ${preset.shadow}`}>
      {/* Background Glowing Blur */}
      <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none ${preset.glow}`} />

      <div className="flex items-center justify-between z-10 relative">
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border transition-all duration-350 group-hover:scale-108 ${preset.bg} ${preset.border}`}>
          <Icon className={`${preset.iconText} transition-transform duration-350 group-hover:rotate-6`} size={22} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full border ${
            trend === 'up' 
              ? "bg-green-500/10 text-green-600 border-green-500/20 dark:bg-green-500/15 dark:text-green-400" 
              : "bg-red-500/10 text-red-600 border-red-500/20 dark:bg-red-500/15 dark:text-red-400"
          }`}>
            {trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <span>{trendValue}%</span>
          </div>
        )}
      </div>
      
      <div className="mt-5 z-10 relative">
        <p className="text-xs font-semibold tracking-wide uppercase text-gray-400 dark:text-gray-500">{title}</p>
        <div className="flex items-baseline gap-2 mt-1.5">
          <h4 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">{value}</h4>
        </div>
        {subText && (
          <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium mt-1">
            {subText}
          </p>
        )}
      </div>
    </div>
  );
};

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
                users: data.stats.totalUsers || data.stats.totalServiceUsers || 0
            }));
        }
    }, [data]);

    const cards = [
        {
            title: "Total Bookings",
            value: metrics.bookings,
            icon: CalendarCheck,
            color: "text-green-500",
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
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((card, idx) => (
                <MetricCard key={idx} {...card} />
            ))}
        </div>
    );
}
