import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { useNavigate } from "react-router";

import React, { useState, useEffect } from "react";
export default function RecentServices({ data: dashboardData }) {
    const navigate = useNavigate();
    const [services, setServices] = useState([]);
    const baseURL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        if (dashboardData?.recentServices) {
            setServices(dashboardData.recentServices);
        }
    }, [dashboardData]);

    const getInitials = (firstName, lastName) => {
        const first = firstName ? firstName.trim().charAt(0).toUpperCase() : "";
        const last = lastName ? lastName.trim().charAt(0).toUpperCase() : "";
        return first + last || "U";
    };

    const getAvatarBg = (name) => {
        const colors = [
            "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/25",
            "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/25",
            "bg-purple-500/10 text-purple-600 border-purple-500/20 dark:bg-purple-500/15 dark:text-purple-400 dark:border-purple-500/25",
            "bg-orange-500/10 text-orange-600 border-orange-500/20 dark:bg-orange-500/15 dark:text-orange-400 dark:border-orange-500/25",
            "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:bg-rose-500/15 dark:text-rose-400 dark:border-rose-500/25",
            "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:bg-amber-500/15 dark:text-amber-500/80 dark:border-amber-500/25",
            "bg-indigo-500/10 text-indigo-600 border-indigo-500/20 dark:bg-indigo-500/15 dark:text-indigo-400 dark:border-indigo-500/25"
        ];
        let hash = 0;
        const str = name || "";
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        const index = Math.abs(hash) % colors.length;
        return colors[index];
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        try {
            return new Date(dateString).toLocaleDateString();
        } catch(e) {
            return "N/A";
        }
    };

    return (
        <div className="overflow-hidden rounded-3xl border border-gray-250 bg-white/70 px-4 pb-4 pt-5 dark:border-gray-800/80 dark:bg-gray-900/60 shadow-[0_8px_30px_rgb(0,0,0,0.012)] backdrop-blur-md transition-all duration-300 hover:shadow-[0_15px_40px_rgba(70,95,255,0.03)] sm:px-6">

            {/* Header */}
            <div className="flex flex-col gap-2 mb-5 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-base font-bold text-gray-800 dark:text-white/90">
                    Recent Services
                </h3>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => navigate('/service-management')}
                        className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-800 border border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white bg-white/50 dark:bg-white/[0.02] rounded-xl transition-all duration-150 shadow-xs active:scale-95 uppercase tracking-wider"
                    >
                        See all
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="max-w-full overflow-x-auto">
                <Table>
                    <TableHeader className="bg-gray-50/50 dark:bg-white/[0.02]">
                        <TableRow>
                            <TableCell isHeader className="py-3 text-[11px] font-extrabold uppercase tracking-wider text-gray-400">
                                Customer
                            </TableCell>
                            <TableCell isHeader className="py-3 text-[11px] font-extrabold uppercase tracking-wider text-gray-400">
                                Service
                            </TableCell>
                            <TableCell isHeader className="py-3 text-[11px] font-extrabold uppercase tracking-wider text-gray-400">
                                Schedule
                            </TableCell>
                            <TableCell isHeader className="py-3 text-[11px] font-extrabold uppercase tracking-wider text-gray-400">
                                Price
                            </TableCell>
                            <TableCell isHeader className="py-3 text-[11px] font-extrabold uppercase tracking-wider text-gray-400 text-right pr-4">
                                Status
                            </TableCell>
                        </TableRow>
                    </TableHeader>

                    <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {services.length > 0 ? services.map((booking) => (
                            <TableRow key={booking._id} className="hover:bg-gray-50/30 dark:hover:bg-white/[0.01]">

                                {/* Customer */}
                                <TableCell className="py-3">
                                    <div className="flex items-center gap-3">
                                        {/* Colored Letter Avatar */}
                                        <div className={`h-[40px] w-[40px] rounded-xl flex items-center justify-center font-bold text-xs border shadow-xs shrink-0 transition-transform duration-200 hover:scale-105 ${getAvatarBg(booking.user?.firstName)}`}>
                                            {getInitials(booking.user?.firstName, booking.user?.lastName)}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-semibold text-gray-855 text-xs dark:text-white/90 capitalize truncate">
                                                {booking.user?.firstName} {booking.user?.lastName}
                                            </p>
                                            <span className="text-gray-400 text-[10px] dark:text-gray-500 lowercase truncate block mt-0.5">
                                                {booking.user?.email || "-"}
                                            </span>
                                        </div>
                                    </div>
                                </TableCell>

                                {/* Service */}
                                <TableCell className="py-3 text-xs">
                                    <div>
                                        <p className="font-semibold text-gray-800 dark:text-white">{booking.service?.name || "N/A"}</p>
                                        <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium mt-0.5 block">{booking.service?.location?.city || "-"}</span>
                                    </div>
                                </TableCell>

                                {/* Schedule */}
                                <TableCell className="py-3 text-xs">
                                    <div className="text-gray-600 dark:text-gray-300 font-medium">
                                        <p>{formatDate(booking.createdAt)}</p>
                                        <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 block">
                                            {formatDate(booking.bookedDate)}
                                        </span>
                                    </div>
                                </TableCell>

                                {/* Price */}
                                <TableCell className="py-3 text-xs font-bold text-gray-800 dark:text-white">
                                    SAR {booking.totalAmount?.toLocaleString()}
                                </TableCell>

                                {/* Status */}
                                <TableCell className="py-3 text-right pr-4">
                                    <Badge
                                        size="sm"
                                        color={
                                            booking.bookingStatus === "confirmed"
                                                ? "success"
                                                : booking.bookingStatus === "pending"
                                                    ? "warning"
                                                    : "error"
                                        }
                                    >
                                        {booking.bookingStatus}
                                    </Badge>
                                </TableCell>

                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={5} className="py-8 text-center text-gray-450 text-sm font-medium">
                                    No recent services found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
