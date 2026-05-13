import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import ComponentCard from "../common/ComponentCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { getAllUserBookingsAdmin } from "../../api/authApi";
import toast from "react-hot-toast";
import Pagination from "../common/Pagination";

const ITEMS_PER_PAGE = 5;

export default function IndividualUserBooking() {
  const { id: userId } = useParams();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBookings = async (page = 1) => {
    try {
      setLoading(true);
      const res = await getAllUserBookingsAdmin(userId, {
        page,
        limit: ITEMS_PER_PAGE,
      });

      setBookings(res.data || []);
      setCurrentPage(page);
      setTotalPages(res.totalPages || 0);
    } catch (error) {
      toast.error(error.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchBookings(1);
    }
  }, [userId]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
      case "paid":
        return "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400";
      case "pending":
        return "bg-yellow-50 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400";
      case "cancelled":
        return "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400";
      default:
        return "bg-gray-50 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400";
    }
  };

  return (
    <ComponentCard title="User Bookings" className="mt-6">
      <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] overflow-visible">
        {loading ? (
          <div className="text-center p-6 text-gray-500">Loading...</div>
        ) : (
          <Table>
            <TableHeader className="text-left">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 text-left">
                  S.No.
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-left">
                  Hotel Name
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-left">
                  Check-In
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-left">
                  Check-Out
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-left">
                  Total Amount
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-left">
                  Booking Status
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-left">
                  Payment Status
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-left">
                  Order ID
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-center">
                  Action
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-dashed divide-gray-200 dark:divide-white/5">
              {bookings.length > 0 ? (
                bookings.map((booking, index) => (
                  <TableRow key={booking._id || index}>
                    <TableCell className="px-5 py-3 text-left text-gray-800 dark:text-white/90">
                      {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                    </TableCell>

                    <TableCell className="px-5 py-3 text-left text-gray-800 dark:text-white/90">
                      {booking.hotel?.name || "-"}
                    </TableCell>

                    <TableCell className="px-5 py-3 text-left text-gray-800 dark:text-white/90">
                      {booking.checkIn ? new Date(booking.checkIn).toLocaleDateString() : "-"}
                    </TableCell>

                    <TableCell className="px-5 py-3 text-left text-gray-800 dark:text-white/90">
                      {booking.checkOut ? new Date(booking.checkOut).toLocaleDateString() : "-"}
                    </TableCell>

                    <TableCell className="px-5 py-3 text-left text-gray-800 dark:text-white/90 font-medium">
                      ${(booking.totalAmount || booking.amount || 0).toFixed(2)}
                    </TableCell>

                    <TableCell className="px-5 py-3 text-left capitalize">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.bookingStatus)}`}>
                        {booking.bookingStatus || "-"}
                      </span>
                    </TableCell>

                    <TableCell className="px-5 py-3 text-left capitalize">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.paymentStatus)}`}>
                        {booking.paymentStatus || "-"}
                      </span>
                    </TableCell>

                    <TableCell className="px-5 py-3 text-left text-gray-500 dark:text-gray-400 text-sm">
                      {booking.orderId || "-"}
                    </TableCell>

                    <TableCell className="px-5 py-3 text-center">
                      <button
                        onClick={() => navigate(`/booking-details/${booking._id}`)}
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm transition-colors"
                      >
                        View
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-6 text-gray-500 text-left">
                    No bookings found for this user
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
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
