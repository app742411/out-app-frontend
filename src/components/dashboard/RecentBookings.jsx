import React from "react";
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHeader, 
    TableRow 
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { useNavigate } from "react-router";

export default function RecentBookings({ data }) {
    const [bookings, setBookings] = React.useState([]);
    const navigate = useNavigate();

    React.useEffect(() => {
        if (data?.recentBookings) {
            setBookings(data.recentBookings);
        }
    }, [data]);

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "confirmed": return "success";
            case "pending": return "warning";
            case "cancelled": return "error";
            default: return "light";
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        try {
            return new Date(dateString).toISOString().split('T')[0];
        } catch(e) {
            return "-";
        }
    };

    return (
        <div className="overflow-hidden rounded-3xl border border-gray-250 bg-white/70 px-4 pb-4 pt-5 dark:border-gray-800/80 dark:bg-gray-900/60 shadow-[0_8px_30px_rgb(0,0,0,0.012)] backdrop-blur-md transition-all duration-300 hover:shadow-[0_15px_40px_rgba(70,95,255,0.03)] sm:px-6">
            <div className="flex flex-col gap-2 mb-5 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-base font-bold text-gray-800 dark:text-white/90">
                    Recent Bookings
                </h3>
                <button 
                    onClick={() => navigate('/bookings')}
                    className="text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors uppercase tracking-wider"
                >
                    View All Bookings
                </button>
            </div>

            <div className="max-w-full overflow-x-auto">
                <Table>
                    <TableHeader className="bg-gray-50/50 dark:bg-white/[0.02]">
                        <TableRow>
                            <TableCell isHeader className="py-3 text-[11px] font-extrabold uppercase tracking-wider text-gray-400">Order ID</TableCell>
                            <TableCell isHeader className="py-3 text-[11px] font-extrabold uppercase tracking-wider text-gray-400">Customer</TableCell>
                            <TableCell isHeader className="py-3 text-[11px] font-extrabold uppercase tracking-wider text-gray-400">Property</TableCell>
                            <TableCell isHeader className="py-3 text-[11px] font-extrabold uppercase tracking-wider text-gray-400">Date</TableCell>
                            <TableCell isHeader className="py-3 text-[11px] font-extrabold uppercase tracking-wider text-gray-400">Amount</TableCell>
                            <TableCell isHeader className="py-3 text-[11px] font-extrabold uppercase tracking-wider text-gray-400 text-right pr-4">Status</TableCell>
                        </TableRow>
                    </TableHeader>

                    <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {bookings.length > 0 ? bookings.map((booking) => (
                            <TableRow key={booking._id} className="hover:bg-gray-50/30 dark:hover:bg-white/[0.01]">
                                <TableCell className="py-3 text-xs">
                                    <span className="font-semibold text-gray-800 dark:text-white">{booking.orderId}</span>
                                </TableCell>
                                <TableCell className="py-3 text-xs capitalize">
                                    <div className="font-semibold text-gray-800 dark:text-white/90">{booking.user?.firstName || "Unknown User"}</div>
                                    <div className="text-gray-400 lowercase text-[10px] mt-0.5">{booking.user?.email || "No Email"}</div>
                                </TableCell>
                                <TableCell className="py-3 text-xs text-gray-600 dark:text-gray-300 font-medium">{booking.property?.name || "N/A"}</TableCell>
                                <TableCell className="py-3 text-xs text-gray-500 font-medium">{formatDate(booking.createdAt)}</TableCell>
                                <TableCell className="py-3 text-xs font-bold text-gray-800 dark:text-white">SAR {booking.totalAmount?.toLocaleString()}</TableCell>
                                <TableCell className="py-3 text-right pr-4">
                                    <Badge size="sm" color={getStatusColor(booking.bookingStatus)}>
                                        {booking.bookingStatus}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={6} className="py-8 text-center text-gray-450 text-sm font-medium">
                                    No recent bookings found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
