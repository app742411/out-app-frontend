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

// Mock data reflecting real app context
const recentBookings = [
    {
        id: "ORD_6D41ABC6",
        customer: { name: "Devi Lodhi", email: "devi@mail.com", profile: "/images/user/owner.jpg" },
        property: "Riyadh Garden Villa",
        checkIn: "2026-03-14",
        amount: "SAR 15,200",
        status: "confirmed"
    },
    {
        id: "ORD_43971CFB",
        customer: { name: "Anand Singh", email: "anand@mail.com", profile: "/images/user/user-01.jpg" },
        property: "Jeddah Sea View",
        checkIn: "2026-03-20",
        amount: "SAR 8,500",
        status: "pending"
    },
    {
        id: "ORD_9B2C4E51",
        customer: { name: "Sarah Khan", email: "sarah@mail.com", profile: "/images/user/user-22.jpg" },
        property: "Desert Palm Resort",
        checkIn: "2026-04-01",
        amount: "SAR 12,000",
        status: "confirmed"
    },
    {
        id: "ORD_1A7D8F22",
        customer: { name: "Mohammed Ali", email: "med@mail.com", profile: "/images/user/user-03.jpg" },
        property: "Mountain Retreat",
        checkIn: "2026-03-12",
        amount: "SAR 5,800",
        status: "cancelled"
    }
];

export default function RecentBookings() {
    const navigate = useNavigate();

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "confirmed": return "success";
            case "pending": return "warning";
            case "cancelled": return "error";
            default: return "light";
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
                        {recentBookings.map((booking) => (
                            <TableRow key={booking.id}>
                                <TableCell className="py-3">
                                    <span className="font-medium text-gray-800 dark:text-white/90">{booking.id}</span>
                                </TableCell>
                                <TableCell className="py-3 text-xs">
                                    <div>{booking.customer.name}</div>
                                    <div className="text-gray-400">{booking.customer.email}</div>
                                </TableCell>
                                <TableCell className="py-3 text-theme-sm">{booking.property}</TableCell>
                                <TableCell className="py-3 text-theme-sm text-gray-500">{booking.checkIn}</TableCell>
                                <TableCell className="py-3 font-semibold text-gray-800 dark:text-white">{booking.amount}</TableCell>
                                <TableCell className="py-3 text-right">
                                    <Badge size="sm" color={getStatusColor(booking.status)}>
                                        {booking.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
