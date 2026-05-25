import React from "react";
import { Link } from "react-router";
import { PlusCircle, Home, Calendar, Briefcase, Tag } from "lucide-react";

export default function QuickActions() {
  const actions = [
    {
      title: "Bookings List",
      icon: <Calendar className="w-5 h-5" />,
      path: "/bookings",
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600",
    },
    {
      title: "Services List",
      icon: <Briefcase className="w-5 h-5" />,
      path: "/service-management",
      color: "bg-amber-500",
      hoverColor: "hover:bg-amber-600",
    },
    {
      title: "Properties List",
      icon: <Home className="w-5 h-5" />,
      path: "/properties",
      color: "bg-emerald-500",
      hoverColor: "hover:bg-emerald-600",
    },
    {
      title: "Coupons List",
      icon: <Tag className="w-5 h-5" />,
      path: "/coupanmange",
      color: "bg-purple-500",
      hoverColor: "hover:bg-purple-600",
    },
  ];

  return (
    <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.05] p-5 shadow-sm">
      <h3 className="text-sm font-bold text-gray-800 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
        <PlusCircle className="w-4 h-4 text-brand-500" />
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {actions.map((action, index) => (
          <Link
            key={index}
            to={action.path}
            className={`flex items-center justify-center gap-2 p-3 ${action.color} ${action.hoverColor} text-white rounded-xl transition-all duration-200 active:scale-95 shadow-md shadow-${action.color.replace('bg-', '')}/20`}
          >
            {action.icon}
            <span className="text-[11px] sm:text-xs font-semibold tracking-wide">{action.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
