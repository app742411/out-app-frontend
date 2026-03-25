import React from "react";
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHeader, 
    TableRow 
} from "../ui/table";
import Badge from "../ui/badge/Badge";

const mockEarningsData = [
    {
        id: "TRX_88A1",
        date: "2026-03-13",
        orderId: "ORD_43971CFB",
        serviceProvider: "Devi Lodhi Singh",
        grossAmount: 15200,
        platformFee: 1520,
        tax: 2280,
        refund: 0,
        payout: 11400,
        status: "completed"
    },
    {
        id: "TRX_77B2",
        date: "2026-03-12",
        orderId: "ORD_6D41ABC6",
        serviceProvider: "Ahmed Khan",
        grossAmount: 8500,
        platformFee: 850,
        tax: 1275,
        refund: 0,
        payout: 6375,
        status: "completed"
    },
    {
        id: "TRX_22D4",
        date: "2026-03-10",
        orderId: "ORD_1A7D8F22",
        serviceProvider: "Mohammed Ali",
        grossAmount: 5800,
        platformFee: 0,
        tax: 0,
        refund: 5800,
        payout: 0,
        status: "refunded"
    }
];

export default function EarningsTable() {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] shadow-sm">
            <div className="p-5 sm:p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                        Detailed Earnings Transactions
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">Breakdown of revenue, fees, taxes and payouts per booking.</p>
                </div>
                <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-theme-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-white/[0.03] dark:text-gray-400">
                    Download CSV
                </button>
            </div>
            
            <div className="max-w-full overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableCell isHeader className="py-4 px-5">Date</TableCell>
                            <TableCell isHeader className="py-4 px-5">Order ID</TableCell>
                            <TableCell isHeader className="py-4 px-5">Service Provider</TableCell>
                            <TableCell isHeader className="py-4 px-5 text-right">Gross (SAR)</TableCell>
                            <TableCell isHeader className="py-4 px-5 text-right">Refund (SAR)</TableCell>
                            <TableCell isHeader className="py-4 px-5 text-right">Fee (SAR)</TableCell>
                            <TableCell isHeader className="py-4 px-5 text-right">Tax (SAR)</TableCell>
                            <TableCell isHeader className="py-4 px-5 text-right font-bold text-brand-500">Payout (SAR)</TableCell>
                            <TableCell isHeader className="py-4 px-5 text-center">Status</TableCell>
                        </TableRow>
                    </TableHeader>

                    <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {mockEarningsData.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell className="py-4 px-5 text-sm text-gray-500">{row.date}</TableCell>
                                <TableCell className="py-4 px-5 text-sm font-medium">{row.orderId}</TableCell>
                                <TableCell className="py-4 px-5 text-sm">{row.serviceProvider}</TableCell>
                                <TableCell className="py-4 px-5 text-sm text-right font-medium">{row.grossAmount.toLocaleString()}</TableCell>
                                <TableCell className="py-4 px-5 text-sm text-right text-red-500 font-medium">{row.refund > 0 ? `-${row.refund.toLocaleString()}` : '0'}</TableCell>
                                <TableCell className="py-4 px-5 text-sm text-right text-purple-500">-{row.platformFee.toLocaleString()}</TableCell>
                                <TableCell className="py-4 px-5 text-sm text-right text-orange-500">-{row.tax.toLocaleString()}</TableCell>
                                <TableCell className="py-4 px-5 text-sm text-right font-bold text-gray-900 dark:text-white">{row.payout.toLocaleString()}</TableCell>
                                <TableCell className="py-4 px-5 text-center">
                                    <Badge size="xs" color={
                                        row.status === 'completed' ? 'success' : 
                                        row.status === 'pending' ? 'warning' : 'error'
                                    }>
                                        {row.status}
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
