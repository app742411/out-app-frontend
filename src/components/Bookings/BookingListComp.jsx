import React, { useState, useEffect } from "react";
import ComponentCard from "../common/ComponentCard";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import { getAllBookings, getCompletedBookings } from "../../api/authApi";
import toast from "react-hot-toast";
import Pagination from "../common/Pagination";
import Badge from "../ui/badge/Badge";
import { useNavigate } from "react-router";

const ITEMS_PER_PAGE = 10;

export default function BookingListComp({ defaultStatus = "all" }) {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [bookingStatus, setBookingStatus] = useState(defaultStatus);
    const [bookingType, setBookingType] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    const fetchBookings = async (page = 1) => {
        try {
            setLoading(true);
            const apiParams = {
                page,
                limit: ITEMS_PER_PAGE,
                search,
                type: bookingType,
                paymentStatus,
            };

            const res = bookingStatus === "completed" 
                ? await getCompletedBookings(apiParams)
                : await getAllBookings({ ...apiParams, status: bookingStatus || "all" });

            setBookings(res.data || []);
            setCurrentPage(page);
            setTotalPages(res.pagination?.totalPages || 1);
        } catch (error) {
            console.error("Fetch Bookings Error:", error);
            toast.error("Failed to load bookings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setBookingStatus(defaultStatus);
    }, [defaultStatus]);

    useEffect(() => {
        fetchBookings(currentPage || 1);
    }, [search, bookingStatus, paymentStatus, bookingType, currentPage]);

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "confirmed":
            case "completed":
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
        <ComponentCard title="All Bookings" className="">
            {/* Filters */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6 flex-wrap">
                <input
                    type="text"
                    placeholder="Search by Order ID..."
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-2.5 w-full md:w-1/4 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-2.5 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                    value={bookingStatus}
                    onChange={(e) => setBookingStatus(e.target.value)}
                >
                    <option value="all">All Status</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                </select>

                <select
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-2.5 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                    value={bookingType}
                    onChange={(e) => setBookingType(e.target.value)}
                >
                    <option value="">All Types</option>
                    <option value="PROPERTY">Property</option>
                    <option value="SERVICE">Service</option>
                    <option value="PACKAGE">Package</option>
                    <option value="PROPERTY_SERVICE">Property Service</option>
                </select>

                <select
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-2.5 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                >
                    <option value="">All Payments</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                </select>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto">
                    {loading ? (
                        <div className="text-center p-6 text-gray-500">Loading...</div>
                    ) : (
                        <Table>
                            <TableHeader className="text-left">
                                <TableRow>
                                    <TableCell isHeader className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Order ID</TableCell>
                                    <TableCell isHeader className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Type</TableCell>
                                    <TableCell isHeader className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Property/Service</TableCell>
                                    <TableCell isHeader className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">User</TableCell>
                                    <TableCell isHeader className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Check-In/Out</TableCell>
                                    <TableCell isHeader className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Guests</TableCell>
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
                                                        <div className="text-xs text-gray-600 dark:text-gray-400">
                                                            {booking.services.map(s => s.service?.name).filter(Boolean).join(", ") || "Service Booking"}
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-5 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold text-gray-800 dark:text-white/90 truncate max-w-[150px]" title={booking.user?.email}>
                                                        {booking.user?.firstName || booking.user?.lastName ? `${booking.user?.firstName || ""} ${booking.user?.lastName || ""}` : booking.user?.email}
                                                    </span>
                                                    <span className="text-[11px] text-gray-500 font-medium">{booking.user?.phone || "No Phone"}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-5 py-4 text-xs text-gray-600 dark:text-gray-400 font-medium">
                                                <div className="flex flex-col gap-0.5 whitespace-nowrap">
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-[10px] text-gray-400 font-bold uppercase w-7">In:</span>
                                                        <span>{booking.checkIn ? new Date(booking.checkIn).toLocaleDateString() : "-"}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-[10px] text-gray-400 font-bold uppercase w-7">Out:</span>
                                                        <span>{booking.checkOut ? new Date(booking.checkOut).toLocaleDateString() : "-"}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-5 py-4 text-center">
                                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                                    <div>{booking.adults} Adults</div>
                                                    <div>{booking.children} Kids</div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-5 py-4 text-center">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-gray-900 dark:text-white">
                                                        SAR {(booking.totalAmount || 0).toLocaleString()}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400 font-semibold uppercase">Inclusive</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-5 py-4">
                                                <div className="flex flex-col gap-1.5 items-center">
                                                    <Badge size="sm" color={getStatusColor(booking.bookingStatus)} className="w-[85px] justify-center capitalize font-bold tracking-tight">
                                                        {booking.bookingStatus}
                                                    </Badge>
                                                    <Badge size="sm" color={getStatusColor(booking.paymentStatus)} className="w-[85px] justify-center capitalize font-bold tracking-tight">
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
                                            No bookings found
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
