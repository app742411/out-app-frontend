import React from "react";
import { Link } from "react-router";
import { PlusCircle, Home, Calendar, Briefcase, Tag } from "lucide-react";

export default function QuickActions({ isVertical = false }) {
  const actions = [
    {
      title: "Bookings List",
      icon: <Calendar className="w-4 h-4" />,
      path: "/bookings",
      styleClass: "bg-blue-500/8 text-blue-600 dark:text-blue-400 border border-blue-500/15 hover:bg-blue-500/18 hover:border-blue-500/30",
    },
    {
      title: "Services List",
      icon: <Briefcase className="w-4 h-4" />,
      path: "/service-management",
      styleClass: "bg-amber-500/8 text-amber-600 dark:text-amber-500 border border-amber-500/15 hover:bg-amber-500/18 hover:border-amber-500/30",
    },
    {
      title: "Properties List",
      icon: <Home className="w-4 h-4" />,
      path: "/properties",
      styleClass: "bg-emerald-500/8 text-emerald-600 dark:text-emerald-400 border border-emerald-500/15 hover:bg-emerald-500/18 hover:border-emerald-500/30",
    },
    {
      title: "Coupons List",
      icon: <Tag className="w-4 h-4" />,
      path: "/coupanmange",
      styleClass: "bg-purple-500/8 text-purple-600 dark:text-purple-400 border border-purple-500/15 hover:bg-purple-500/18 hover:border-purple-500/30",
    },
  ];

  return (
    <div className={`bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.05] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.012)] flex flex-col justify-between h-full ${
      isVertical ? "w-full" : "lg:flex-row lg:items-center gap-3.5"
    }`}>
      {/* Title */}
      <h3 className={`text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2 whitespace-nowrap shrink-0 ${
        isVertical ? "mb-4 pb-2 border-b border-gray-100 dark:border-gray-800" : ""
      }`}>
        <PlusCircle className="w-4 h-4 text-brand-500 dark:text-brand-400 animate-pulse" />
        Quick Actions
      </h3>

      {/* Buttons row/column */}
      <div className={`grid gap-2.5 w-full ${
        isVertical ? "grid-cols-1" : "grid-cols-2 md:flex md:flex-row lg:w-auto"
      }`}>
        {actions.map((action, index) => (
          <Link
            key={index}
            to={action.path}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 active:scale-95 font-medium text-xs tracking-wide flex-1 md:flex-initial ${action.styleClass}`}
          >
            {action.icon}
            <span className="font-semibold whitespace-nowrap">{action.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
