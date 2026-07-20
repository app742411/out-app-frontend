import React from "react";
import { 
    DollarSign, 
    ArrowUpRight, 
    ArrowDownRight, 
    Wallet,
    Percent,
    Receipt,
    RefreshCcw
} from "lucide-react";

const SummaryCard = ({ title, value, subValue, icon: Icon, iconBg, iconColor, trend, trendValue }) => (
    <div className="relative overflow-hidden rounded-3xl border border-gray-250 bg-white/70 p-6 dark:border-gray-800/80 dark:bg-gray-900/60 shadow-[0_8px_30px_rgb(0,0,0,0.012)] backdrop-blur-md transition-all duration-350 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(70,95,255,0.03)] group">
        <div className="flex items-center justify-between z-10 relative">
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-200/20 transition-all duration-300 group-hover:scale-108 ${iconBg}`}>
                <Icon className={`${iconColor} transition-transform duration-300 group-hover:rotate-6`} size={22} />
            </div>
            {trend && (
                <div className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${trend === 'up' ? "bg-green-500/10 text-green-600 border-green-500/20 dark:bg-green-500/15 dark:text-green-400" : "bg-red-500/10 text-red-600 border-red-500/20 dark:bg-red-500/15 dark:text-red-400"}`}>
                    {trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    <span>{trendValue}%</span>
                </div>
            )}
        </div>
        <div className="mt-5 z-10 relative">
            <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 dark:text-gray-500">{title}</p>
            <h4 className="mt-1.5 text-2xl font-black text-gray-850 dark:text-white">
                SAR {Number(value).toLocaleString()}
            </h4>
            {subValue && (
                <p className="mt-1 text-[11px] text-gray-400 dark:text-gray-500 font-medium">
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
            subValue: "Total booking volume"
        },
        {
            title: "Provider Payouts",
            value: stats?.providerPayouts || 0,
            icon: Wallet,
            iconBg: "bg-blue-500/10 dark:bg-blue-500/20",
            iconColor: "text-blue-500",
            subValue: "Net paid to owners"
        },
        {
            title: "Platform Fees",
            value: (stats?.platformFees || 0) + (stats?.adminCommission || 0),
            icon: Percent,
            iconBg: "bg-purple-500/10 dark:bg-purple-500/20",
            iconColor: "text-purple-500",
            subValue: "Admin & Platform commission"
        },
        {
            title: "Tax Expenses",
            value: stats?.taxExpenses || 0,
            icon: Receipt,
            iconBg: "bg-orange-500/10 dark:bg-orange-500/20",
            iconColor: "text-orange-500",
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
