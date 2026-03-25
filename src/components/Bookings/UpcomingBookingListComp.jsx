import React, { useState, useEffect } from "react";
import ComponentCard from "../common/ComponentCard";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import { getAdminUpcomingBookings } from "../../api/authApi";
import toast from "react-hot-toast";
import Pagination from "../common/Pagination";
import Badge from "../ui/badge/Badge";
import { useNavigate } from "react-router";

const ITEMS_PER_PAGE = 10;

export default function UpcomingBookingListComp() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    const fetchUpcomingBookings = async (page = 1) => {
        try {
            setLoading(true);
            const res = await getAdminUpcomingBookings({
                page,
                limit: ITEMS_PER_PAGE,
            });

            setBookings(res.data || []);
            setCurrentPage(page);
            setTotalPages(res.totalPages || 1);
        } catch (error) {
            toast.error("Failed to load upcoming bookings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUpcomingBookings(1);
    }, []);

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "confirmed":
            case "success":
            case "paid":
                return "success";
            case "pending":
                return "warning";
            case "cancelled":
            case "failed":
                return "error";
            default:
                return "light";
        }
    };

    return (
        <ComponentCard title="Upcoming Bookings" className="">
            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto">
                    {loading ? (
                        <div className="text-center p-6 text-gray-500 font-medium">Loading upcoming bookings...</div>
                    ) : (
                        <Table>
                            <TableHeader className="text-left">
                                <TableRow>
                                    <TableCell isHeader className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Order ID</TableCell>
                                    <TableCell isHeader className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Type</TableCell>
                                    <TableCell isHeader className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Property/Service</TableCell>
                                    <TableCell isHeader className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">User</TableCell>
                                    <TableCell isHeader className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Guests</TableCell>
                                    <TableCell isHeader className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Check-in/Out</TableCell>
                                    <TableCell isHeader className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Amount</TableCell>
                                    <TableCell isHeader className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Status</TableCell>
                                    <TableCell isHeader className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Action</TableCell>
                                </TableRow>
                            </TableHeader>

                            <TableBody className="divide-y divide-dashed divide-gray-200 dark:divide-white/5">
                                {bookings.length > 0 ? (
                                    bookings.map((booking) => (
                                        <TableRow key={booking._id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                                            <TableCell className="px-5 py-4">
                                                <div className="font-semibold text-gray-800 dark:text-white/90">
                                                    {booking.orderId}
                                                </div>
                                                <div className="text-[10px] text-gray-400 uppercase tracking-tighter">
                                                    {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : "-"}
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-5 py-4">
                                                <Badge
                                                    variant="light"
                                                    color={booking.bookingType === "PROPERTY" ? "info" : booking.bookingType === "SERVICE" ? "primary" : "warning"}
                                                    className="text-[10px] uppercase font-bold"
                                                >
                                                    {booking.bookingType?.replace("_", " ")}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-5 py-4">
                                                <div className="max-w-[200px]">
                                                    {booking.property ? (
                                                        <>
                                                            <div className="font-medium text-gray-800 dark:text-white/90 truncate" title={booking.property.name}>
                                                                {booking.property.name}
                                                            </div>
                                                            <div className="text-xs text-gray-500 truncate">
                                                                {booking.property.address?.city}
                                                            </div>
                                                        </>
                                                    ) : booking.services?.length > 0 ? (
                                                        <div className="text-[10px] text-gray-600 dark:text-gray-400 line-clamp-2">
                                                            {booking.services.map(s => s.service?.name).filter(Boolean).join(", ") || "Service Only"}
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-5 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        {booking.user?.firstName} {booking.user?.lastName}
                                                    </span>
                                                    <span className="text-xs text-gray-400">{booking.user?.phone}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-5 py-4 text-center">
                                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                                    <div>{booking.adults || 0} Ad</div>
                                                    <div>{booking.children || 0} Kd</div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">
                                                <div className="flex flex-col whitespace-nowrap">
                                                    <span>In: {booking.checkIn ? new Date(booking.checkIn).toLocaleDateString() : "-"}</span>
                                                    <span>Out: {booking.checkOut ? new Date(booking.checkOut).toLocaleDateString() : "-"}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-5 py-4">
                                                <span className="font-bold text-gray-900 dark:text-white">
                                                    SAR {(booking.totalAmount || 0).toLocaleString()}
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-5 py-4 text-center">
                                                <div className="flex flex-col gap-1 items-center">
                                                    <Badge size="sm" color={getStatusColor(booking.bookingStatus)} className="w-full justify-center capitalize">
                                                        {booking.bookingStatus}
                                                    </Badge>
                                                    <Badge size="sm" color={getStatusColor(booking.paymentStatus)} className="w-full justify-center capitalize">
                                                        {booking.paymentStatus}
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-5 py-4 text-right">
                                                <button
                                                    onClick={() => navigate(`/booking-details/${booking._id}`)}
                                                    className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-xs font-semibold hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                                                >
                                                    View
                                                </button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-10 text-gray-500">
                                            No upcoming bookings found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </div>

            {!loading && totalPages > 1 && (
                <div className="mt-6">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(newPage) => {
                            setCurrentPage(newPage);
                            fetchUpcomingBookings(newPage);
                        }}
                    />
                </div>
            )}
        </ComponentCard>
    );
}
