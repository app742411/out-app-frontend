import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";

import React, { useState, useEffect } from "react";
export default function RecentServices({ data: dashboardData }) {
    const [services, setServices] = useState([]);
    const baseURL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        if (dashboardData?.recentServices) {
            setServices(dashboardData.recentServices);
        }
    }, [dashboardData]);

    const getImageUrl = (service) => {
        if (service?.media?.images?.length > 0) {
            const cleanBaseURL = baseURL ? baseURL.replace(/\/$/, "") : "";
            return `${cleanBaseURL}/uploads/serviceIcon/${service.media.images[0]}`;
        }
        return "/images/service/apartment-01.jpg";
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
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">

            {/* Header */}
            <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                    Recent Services
                </h3>

                <div className="flex items-center gap-3">
                    <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-white/[0.03] dark:text-gray-400">
                        Filter
                    </button>

                    <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-white/[0.03] dark:text-gray-400">
                        See all
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="max-w-full overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableCell isHeader className="py-3">
                                Customer
                            </TableCell>
                            <TableCell isHeader className="py-3">
                                Service
                            </TableCell>
                            <TableCell isHeader className="py-3">
                                Schedule
                            </TableCell>
                            <TableCell isHeader className="py-3">
                                Price
                            </TableCell>
                            <TableCell isHeader className="py-3 text-right">
                                Status
                            </TableCell>
                        </TableRow>
                    </TableHeader>

                    <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {services.length > 0 ? services.map((booking) => (
                            <TableRow key={booking._id}>

                                {/* Customer */}
                                <TableCell className="py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="h-[50px] w-[50px] overflow-hidden rounded-md border border-gray-100 dark:border-gray-800">
                                            <img
                                                src={getImageUrl(booking.service)}
                                                alt={booking.user?.firstName}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90 capitalize">
                                                {booking.user?.firstName} {booking.user?.lastName}
                                            </p>
                                            <span className="text-gray-500 text-theme-xs dark:text-gray-400 lowercase">
                                                {booking.user?.email || "-"}
                                            </span>
                                        </div>
                                    </div>
                                </TableCell>

                                {/* Service */}
                                <TableCell className="py-3">
                                    <div>
                                        <p className="font-medium text-gray-800 dark:text-white/90">{booking.service?.name}</p>
                                        <span className="text-theme-xs text-gray-500 dark:text-gray-400">{booking.service?.location?.city || "-"}</span>
                                    </div>
                                </TableCell>

                                {/* Schedule */}
                                <TableCell className="py-3">
                                    <div className="text-theme-sm text-gray-800 dark:text-white/90">
                                        <p>{formatDate(booking.createdAt)}</p>
                                        <span className="text-theme-xs text-gray-500 dark:text-gray-400">
                                            {formatDate(booking.bookedDate)} {/* Adjust to actual field if time is available */}
                                        </span>
                                    </div>
                                </TableCell>

                                {/* Price */}
                                <TableCell className="py-3 font-medium text-gray-700 dark:text-gray-300">
                                    SAR {booking.totalAmount}
                                </TableCell>

                                {/* Status */}
                                <TableCell className="py-3 text-right">
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
                                <TableCell colSpan={5} className="py-8 text-center text-gray-500">
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