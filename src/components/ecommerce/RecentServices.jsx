import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";

const tableData = [
    {
        id: 1,
        customerName: "Andrew Sas",
        serviceType: "Apartment",
        location: "Miami Beach, FL",
        date: "Monday, 26 May",
        startTime: "09:00 AM",
        endTime: "10:00 AM",
        price: "$150.00",
        phone: "+1 305-555-1234",
        status: "Confirmed",
        image: "/images/service/apartment-01.jpg",
    },
    {
        id: 2,
        customerName: "Sarah Johnson",
        serviceType: "Villa",
        location: "Los Angeles, CA",
        date: "Wednesday, 28 May",
        startTime: "02:00 PM",
        endTime: "06:00 PM",
        price: "$600.00",
        phone: "+1 213-555-7890",
        status: "Pending",
        image: "/images/service/villa-01.jpg",
    },
    {
        id: 3,
        customerName: "Michael Brown",
        serviceType: "Apartment",
        location: "New York, NY",
        date: "Friday, 30 May",
        startTime: "11:00 AM",
        endTime: "01:00 PM",
        price: "$220.00",
        phone: "+1 646-555-4567",
        status: "Confirmed",
        image: "/images/service/apartment-02.jpg",
    },
    {
        id: 4,
        customerName: "Emma Wilson",
        serviceType: "Villa",
        location: "Dallas, TX",
        date: "Sunday, 02 June",
        startTime: "10:00 AM",
        endTime: "04:00 PM",
        price: "$750.00",
        phone: "+1 972-555-2345",
        status: "Canceled",
        image: "/images/service/villa-02.jpg",
    },
];

export default function RecentServices() {
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
                        {tableData.map((booking) => (
                            <TableRow key={booking.id}>

                                {/* Customer */}
                                <TableCell className="py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="h-[50px] w-[50px] overflow-hidden rounded-md border border-gray-100 dark:border-gray-800">
                                            <img
                                                src={booking.image}
                                                alt={booking.customerName}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                {booking.customerName}
                                            </p>
                                            <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                                                {booking.phone}
                                            </span>
                                        </div>
                                    </div>
                                </TableCell>

                                {/* Service */}
                                <TableCell className="py-3">
                                    <div>
                                        <p className="font-medium text-gray-800 dark:text-white/90">{booking.serviceType}</p>
                                        <span className="text-theme-xs text-gray-500 dark:text-gray-400">{booking.location}</span>
                                    </div>
                                </TableCell>

                                {/* Schedule */}
                                <TableCell className="py-3">
                                    <div className="text-theme-sm text-gray-800 dark:text-white/90">
                                        <p>{booking.date}</p>
                                        <span className="text-theme-xs text-gray-500 dark:text-gray-400">
                                            {booking.startTime} - {booking.endTime}
                                        </span>
                                    </div>
                                </TableCell>

                                {/* Price */}
                                <TableCell className="py-3 font-medium text-gray-700 dark:text-gray-300">
                                    {booking.price}
                                </TableCell>

                                {/* Status */}
                                <TableCell className="py-3 text-right">
                                    <Badge
                                        size="sm"
                                        color={
                                            booking.status === "Confirmed"
                                                ? "success"
                                                : booking.status === "Pending"
                                                    ? "warning"
                                                    : "error"
                                        }
                                    >
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