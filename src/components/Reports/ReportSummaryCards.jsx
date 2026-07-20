import React from "react";
import { 
    Users, 
    Calendar, 
    TrendingUp, 
    DollarSign,
    ArrowUpRight,
    ArrowDownRight
} from "lucide-react";

const colorPresets = {
  "bg-brand-500": {
    containerBorder: "hover:border-brand-500/25",
    bg: "bg-brand-50/50 dark:bg-brand-500/10",
    border: "border-brand-500/15 dark:border-brand-500/25",
    glow: "bg-brand-500/5 dark:bg-brand-500/10",
    iconText: "text-brand-500",
    shadow: "shadow-[0_8px_30px_rgba(70,95,255,0.03)] hover:shadow-[0_20px_40px_rgba(70,95,255,0.12)]"
  },
  "bg-blue-500": {
    containerBorder: "hover:border-blue-500/25",
    bg: "bg-blue-50/50 dark:bg-blue-500/10",
    border: "border-blue-500/15 dark:border-blue-500/25",
    glow: "bg-blue-500/5 dark:bg-blue-500/10",
    iconText: "text-blue-500",
    shadow: "shadow-[0_8px_30px_rgba(59,130,246,0.03)] hover:shadow-[0_20px_40px_rgba(59,130,246,0.12)]"
  },
  "bg-purple-500": {
    containerBorder: "hover:border-purple-500/25",
    bg: "bg-purple-50/50 dark:bg-purple-500/10",
    border: "border-purple-500/15 dark:border-purple-500/25",
    glow: "bg-purple-500/5 dark:bg-purple-500/10",
    iconText: "text-purple-500",
    shadow: "shadow-[0_8px_30px_rgba(168,85,247,0.03)] hover:shadow-[0_20px_40px_rgba(168,85,247,0.12)]"
  },
  "bg-orange-500": {
    containerBorder: "hover:border-orange-500/25",
    bg: "bg-orange-50/50 dark:bg-orange-500/10",
    border: "border-orange-500/15 dark:border-orange-500/25",
    glow: "bg-orange-500/5 dark:bg-orange-500/10",
    iconText: "text-orange-500",
    shadow: "shadow-[0_8px_30px_rgba(249,115,22,0.03)] hover:shadow-[0_20px_40px_rgba(249,115,22,0.12)]"
  },
};

const SummaryCard = ({ title, value, icon: Icon, color, percentage, isTrendingUp }) => {
  const preset = colorPresets[color] || colorPresets["bg-brand-500"];

  return (
    <div className={`relative overflow-hidden rounded-3xl border border-gray-250 bg-white/70 p-6 backdrop-blur-md transition-all duration-350 hover:-translate-y-1.5 dark:border-gray-800/80 dark:bg-gray-900/60 group ${preset.containerBorder} ${preset.shadow}`}>
      {/* Background Glowing Blur */}
      <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none ${preset.glow}`} />

      <div className="flex items-center justify-between z-10 relative">
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border transition-all duration-350 group-hover:scale-108 ${preset.bg} ${preset.border}`}>
          <Icon className={`${preset.iconText} transition-transform duration-350 group-hover:rotate-6`} size={22} />
        </div>
        {percentage && percentage !== "0" && (
          <div className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full border ${
            isTrendingUp 
              ? "bg-green-500/10 text-green-600 border-green-500/20 dark:bg-green-500/15 dark:text-green-400" 
              : "bg-red-500/10 text-red-600 border-red-500/20 dark:bg-red-500/15 dark:text-red-400"
          }`}>
            {isTrendingUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            <span>{percentage}%</span>
          </div>
        )}
      </div>
      
      <div className="mt-5 z-10 relative">
        <p className="text-xs font-semibold tracking-wide uppercase text-gray-400 dark:text-gray-500">{title}</p>
        <div className="flex items-baseline gap-2 mt-1.5">
          <h4 className="text-2xl font-extrabold tracking-tight text-gray-850 dark:text-white">{value}</h4>
        </div>
      </div>
    </div>
  );
};

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
            percentage: null,
            isTrendingUp: true
        },
        {
            title: "Average Booking",
            value: `SAR ${metrics?.avgBooking?.toLocaleString() || "0"}`,
            icon: TrendingUp,
            color: "bg-orange-500",
            percentage: null,
            isTrendingUp: true
        }
    ];

    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((card, idx) => (
                <SummaryCard key={idx} {...card} />
            ))}
        </div>
    );
}
