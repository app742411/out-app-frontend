import React, { useState, useEffect } from "react";
import ComponentCard from "../common/ComponentCard";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import { getPropertyBookings } from "../../api/authApi";
import toast from "react-hot-toast";
import Pagination from "../common/Pagination";
import Badge from "../ui/badge/Badge";
import { useNavigate } from "react-router";

const ITEMS_PER_PAGE = 10;

export default function PropertyBookingListComp({ propertyId }) {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    const fetchBookings = async (page = 1) => {
        if (!propertyId) return;
        try {
            setLoading(true);
            const res = await getPropertyBookings(propertyId, {
                page,
                limit: ITEMS_PER_PAGE,
            });

            setBookings(res.data || []);
            setCurrentPage(page);
            setTotalPages(res.pagination?.totalPages || 1);
        } catch (error) {
            toast.error("Failed to load property bookings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings(1);
    }, [propertyId]);

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
        <ComponentCard title="Property Bookings" className="">
            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto">
                    {loading ? (
                        <div className="text-center p-6 text-gray-500">Loading...</div>
                    ) : (
                        <Table>
                            <TableHeader className="text-left">
                                <TableRow>
                                    <TableCell isHeader className="px-5 py-3">Order ID</TableCell>
                                    <TableCell isHeader className="px-5 py-3">User</TableCell>
                                    <TableCell isHeader className="px-5 py-3">Check-In</TableCell>
                                    <TableCell isHeader className="px-5 py-3">Check-Out</TableCell>
                                    <TableCell isHeader className="px-5 py-3">Amount</TableCell>
                                    <TableCell isHeader className="px-5 py-3">Booking</TableCell>
                                    <TableCell isHeader className="px-5 py-3">Payment</TableCell>
                                    <TableCell isHeader className="px-5 py-3 text-right">Action</TableCell>
                                </TableRow>
                            </TableHeader>

                            <TableBody className="divide-y divide-dashed divide-gray-200 dark:divide-white/5">
                                {bookings.length > 0 ? (
                                    bookings.map((booking) => (
                                        <TableRow key={booking._id}>
                                            <TableCell className="px-5 py-3 font-medium text-gray-800 dark:text-white">
                                                {booking.orderId}
                                            </TableCell>
                                            <TableCell className="px-5 py-3">
                                                <div className="text-sm">
                                                    <div>{booking.user?.email}</div>
                                                    <div className="text-xs text-gray-400">{booking.user?.phone}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-5 py-3">
                                                {booking.checkIn ? new Date(booking.checkIn).toLocaleDateString() : "-"}
                                            </TableCell>
                                            <TableCell className="px-5 py-3">
                                                {booking.checkOut ? new Date(booking.checkOut).toLocaleDateString() : "-"}
                                            </TableCell>
                                            <TableCell className="px-5 py-3">
                                                ₹{booking.amount}
                                            </TableCell>
                                            <TableCell className="px-5 py-3">
                                                <Badge color={getStatusColor(booking.bookingStatus)}>
                                                    {booking.bookingStatus}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-5 py-3">
                                                <Badge color={getStatusColor(booking.paymentStatus)}>
                                                    {booking.paymentStatus}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-5 py-3 text-right">
                                                <button
                                                    onClick={() => navigate(`/booking-details/${booking._id}`)}
                                                    className="text-brand-500 hover:text-brand-600 font-medium text-sm"
                                                >
                                                    View
                                                </button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                                            No bookings found for this property
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
