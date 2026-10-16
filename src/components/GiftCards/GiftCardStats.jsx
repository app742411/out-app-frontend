import React from "react";
import { Gift, CheckCircle2, Clock, Sparkles } from "lucide-react";
import { formatCurrency } from "../../utils/currency";

export default function GiftCardStats({ giftCards = [], totalCount = 0 }) {
  const activeCount = giftCards.filter((c) => c.isActive && (!c.expiryDate || new Date(c.expiryDate) > new Date())).length;
  const expiredOrInactiveCount = giftCards.filter(
    (c) => !c.isActive || (c.expiryDate && new Date(c.expiryDate) <= new Date())
  ).length;

  const totalValue = giftCards.reduce((acc, card) => acc + (Number(card.amount) || 0), 0);

  const stats = [
    {
      title: "Total Gift Cards",
      value: totalCount || giftCards.length,
      subtitle: "Lifetime issued vouchers",
      icon: <Gift className="w-6 h-6 text-brand-500" />,
      bg: "bg-brand-50 dark:bg-brand-500/10",
      border: "border-brand-200 dark:border-brand-800/40",
    },
    {
      title: "Active Cards",
      value: activeCount,
      subtitle: "Valid & ready to redeem",
      icon: <CheckCircle2 className="w-6 h-6 text-emerald-500" />,
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
      border: "border-emerald-200 dark:border-emerald-800/40",
    },
    {
      title: "Inactive / Expired",
      value: expiredOrInactiveCount,
      subtitle: "Needs renewal or deactivated",
      icon: <Clock className="w-6 h-6 text-amber-500" />,
      bg: "bg-amber-50 dark:bg-amber-500/10",
      border: "border-amber-200 dark:border-amber-800/40",
    },
    {
      title: "Total Card Value",
      value: formatCurrency(totalValue),
      subtitle: "Combined amount in SAR",
      icon: <Sparkles className="w-6 h-6 text-purple-500" />,
      bg: "bg-purple-50 dark:bg-purple-500/10",
      border: "border-purple-200 dark:border-purple-800/40",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className={`p-5 rounded-2xl border ${stat.border} bg-white dark:bg-gray-900 shadow-xs hover:shadow-md transition-all duration-200 flex items-center justify-between`}
        >
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {stat.title}
            </p>
            <h4 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
              {stat.value}
            </h4>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {stat.subtitle}
            </p>
          </div>
          <div className={`p-3 rounded-xl ${stat.bg} flex items-center justify-center`}>
            {stat.icon}
          </div>
        </div>
      ))}
    </div>
  );
}
