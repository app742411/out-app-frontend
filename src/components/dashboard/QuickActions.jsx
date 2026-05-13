import React from "react";
import { Link } from "react-router";
import { PlusCircle, Home, CalendarPlus, UserPlus, Tag } from "lucide-react";

export default function QuickActions() {
  const actions = [
    {
      title: "Add Property",
      icon: <Home className="w-5 h-5" />,
      path: "/property-setup",
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600",
    },
    {
      title: "Add Service",
      icon: <PlusCircle className="w-5 h-5" />,
      path: "/service-setup",
      color: "bg-brand-500",
      hoverColor: "hover:bg-brand-600",
    },
    {
      title: "Add Vendor",
      icon: <UserPlus className="w-5 h-5" />,
      path: "/vendors",
      color: "bg-emerald-500",
      hoverColor: "hover:bg-emerald-600",
    },
    {
      title: "Create Coupon",
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
