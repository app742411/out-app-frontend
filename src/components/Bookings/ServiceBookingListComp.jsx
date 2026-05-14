import React, { useState, useEffect } from "react";
import ComponentCard from "../common/ComponentCard";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import { getServiceBookings } from "../../api/authApi";
import toast from "react-hot-toast";
import Pagination from "../common/Pagination";
import Badge from "../ui/badge/Badge";
import { useNavigate } from "react-router";

const ITEMS_PER_PAGE = 10;

export default function ServiceBookingListComp({ serviceId }) {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    const fetchBookings = async (page = 1) => {
        if (!serviceId) return;
        try {
            setLoading(true);
            const res = await getServiceBookings(serviceId, {
                page,
                limit: ITEMS_PER_PAGE,
            });

            setBookings(res.data || []);
            setCurrentPage(page);
            setTotalPages(res.pagination?.totalPages || 1);
        } catch (error) {
            toast.error("Failed to load service bookings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings(1);
    }, [serviceId]);

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
        <ComponentCard title="Service Bookings" className="">
            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto">
                    {loading ? (
                        <div className="text-center p-6 text-gray-500">Loading...</div>
                    ) : (
                        <Table>
                            <TableHeader className="text-left">
                                <TableRow>
                                    <TableCell isHeader className="px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Order ID</TableCell>
                                    <TableCell isHeader className="px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">User</TableCell>
                                    <TableCell isHeader className="px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</TableCell>
                                    <TableCell isHeader className="px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Amount</TableCell>
                                    <TableCell isHeader className="px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Status</TableCell>
                                    <TableCell isHeader className="px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Action</TableCell>
                                </TableRow>
                            </TableHeader>

                            <TableBody className="divide-y divide-dashed divide-gray-200 dark:divide-white/5">
                                {bookings.length > 0 ? (
                                    bookings.map((booking) => (
                                        <TableRow key={booking._id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                                            <TableCell className="px-5 py-4 font-medium text-gray-800 dark:text-white">
                                                {booking.orderId}
                                            </TableCell>
                                            <TableCell className="px-5 py-4">
                                                <div className="text-sm">
                                                    <div className="font-semibold text-gray-800 dark:text-white/90 truncate max-w-[150px]">
                                                        {booking.user?.firstName || booking.user?.lastName ? `${booking.user?.firstName || ""} ${booking.user?.lastName || ""}` : booking.user?.email}
                                                    </div>
                                                    <div className="text-xs text-gray-400">{booking.user?.phone}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-5 py-4 text-xs text-gray-600 dark:text-gray-400 font-medium">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-[10px] text-gray-400 font-bold uppercase w-8">From:</span>
                                                        <span>{booking.checkIn ? new Date(booking.checkIn).toLocaleDateString() : "-"}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-[10px] text-gray-400 font-bold uppercase w-8">To:</span>
                                                        <span>{booking.checkOut ? new Date(booking.checkOut).toLocaleDateString() : "-"}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-5 py-4 font-bold text-gray-900 dark:text-white">
                                                SAR {(booking.totalAmount || booking.amount || 0).toLocaleString()}
                                            </TableCell>
                                            <TableCell className="px-5 py-4 text-center">
                                                <div className="flex flex-col gap-1 items-center">
                                                    <Badge size="sm" color={getStatusColor(booking.bookingStatus)} className="w-[85px] justify-center capitalize font-bold">
                                                        {booking.bookingStatus}
                                                    </Badge>
                                                    <Badge size="sm" color={getStatusColor(booking.paymentStatus)} className="w-[85px] justify-center capitalize font-bold">
                                                        {booking.paymentStatus}
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-5 py-4 text-right">
                                                <button
                                                    onClick={() => navigate(`/booking-details/${booking._id}`)}
                                                    className="px-4 py-2 bg-brand-50 hover:bg-brand-100 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400 text-xs font-bold rounded-xl transition-all active:scale-95"
                                                >
                                                    View Details
                                                </button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-10 text-gray-500 italic bg-gray-50/50 dark:bg-white/[0.01]">
                                            No bookings found for this service
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </div>

            {!loading && totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(newPage) => {
                        setCurrentPage(newPage);
                        fetchBookings(newPage);
                    }}
                />
            )}
        </ComponentCard>
    );
}
