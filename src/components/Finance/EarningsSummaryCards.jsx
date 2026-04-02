import React from "react";
import { 
    DollarSign, 
    TrendingUp, 
    ArrowUpRight, 
    ArrowDownRight, 
    Wallet,
    Percent,
    Receipt,
    RefreshCcw
} from "lucide-react";

const SummaryCard = ({ title, value, subValue, icon: Icon, iconBg, iconColor, trend, trendValue }) => (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBg}`}>
                <Icon className={iconColor} size={24} />
            </div>
            {trend && (
                <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${trend === 'up' ? "bg-green-50 text-green-600 dark:bg-green-500/10" : "bg-red-50 text-red-600 dark:bg-red-500/10"}`}>
                    {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    <span>{trendValue}%</span>
                </div>
            )}
        </div>
        <div className="mt-4">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <h4 className="mt-1 text-2xl font-bold text-gray-800 dark:text-white/90">
                SAR {Number(value).toLocaleString()}
            </h4>
            {subValue && (
                <p className="mt-1 text-xs text-gray-400 font-normal">
                    {subValue}
                </p>
            )}
        </div>
    </div>
);

export default function EarningsSummaryCards({ stats }) {
    const cards = [
        {
            title: "Gross Revenue",
            value: stats?.grossRevenue || 0,
            icon: DollarSign,
            iconBg: "bg-brand-500/10 dark:bg-brand-500/20",
            iconColor: "text-brand-500",
            trend: "up",
            trendValue: "12.5",
            subValue: "Total booking volume"
        },
        {
            title: "Provider Payouts",
            value: stats?.providerPayouts || 0,
            icon: Wallet,
            iconBg: "bg-blue-500/10 dark:bg-blue-500/20",
            iconColor: "text-blue-500",
            trend: "up",
            trendValue: "8.2",
            subValue: "Net paid to owners"
        },
        {
            title: "Platform Fees",
            value: (stats?.platformFees || 0) + (stats?.adminCommission || 0),
            icon: Percent,
            iconBg: "bg-purple-500/10 dark:bg-purple-500/20",
            iconColor: "text-purple-500",
            trend: "up",
            trendValue: "15.4",
            subValue: "Admin & Platform commission"
        },
        {
            title: "Tax Expenses",
            value: stats?.taxExpenses || 0,
            icon: Receipt,
            iconBg: "bg-orange-500/10 dark:bg-orange-500/20",
            iconColor: "text-orange-500",
            trendValue: "2.1",
            subValue: "VAT and service costs"
        },
        {
            title: "Refund Amount",
            value: stats?.refundAmount || 0,
            icon: RefreshCcw,
            iconBg: "bg-red-500/10 dark:bg-red-500/20",
            iconColor: "text-red-500",
            subValue: "Total processed refunds"
        }
    ];

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {cards.map((card, idx) => (
                <SummaryCard key={idx} {...card} />
            ))}
        </div>
    );
}
