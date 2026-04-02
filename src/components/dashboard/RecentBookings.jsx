import React from "react";
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHeader, 
    TableRow 
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { Eye } from "lucide-react";
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
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
            <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                    Recent Bookings
                </h3>
                <button 
                    onClick={() => navigate('/bookings')}
                    className="text-sm font-medium text-brand-500 hover:text-brand-600 transition-colors"
                >
                    View All Bookings
                </button>
            </div>

            <div className="max-w-full overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableCell isHeader className="py-3">Order ID</TableCell>
                            <TableCell isHeader className="py-3">Customer</TableCell>
                            <TableCell isHeader className="py-3">Property</TableCell>
                            <TableCell isHeader className="py-3">Date</TableCell>
                            <TableCell isHeader className="py-3">Amount</TableCell>
                            <TableCell isHeader className="py-3 text-right">Status</TableCell>
                        </TableRow>
                    </TableHeader>

                    <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {bookings.length > 0 ? bookings.map((booking) => (
                            <TableRow key={booking._id}>
                                <TableCell className="py-3">
                                    <span className="font-medium text-gray-800 dark:text-white/90">{booking.orderId}</span>
                                </TableCell>
                                <TableCell className="py-3 text-xs capitalize">
                                    <div>{booking.user?.firstName || "Unknown User"}</div>
                                    <div className="text-gray-400 lowercase">{booking.user?.email || "No Email"}</div>
                                </TableCell>
                                <TableCell className="py-3 text-theme-sm">{booking.property?.name || "N/A"}</TableCell>
                                <TableCell className="py-3 text-theme-sm text-gray-500">{formatDate(booking.createdAt)}</TableCell>
                                <TableCell className="py-3 font-semibold text-gray-800 dark:text-white">SAR {booking.totalAmount}</TableCell>
                                <TableCell className="py-3 text-right">
                                    <Badge size="sm" color={getStatusColor(booking.bookingStatus)}>
                                        {booking.bookingStatus}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={6} className="py-4 text-center text-gray-500">
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
