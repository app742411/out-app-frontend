import React from "react";
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHeader, 
    TableRow 
} from "../ui/table";
import Badge from "../ui/badge/Badge";

export default function EarningsTable({ transactions = [], isLoading = false, onExportCSV }) {
    return (
        <div className="overflow-hidden rounded-3xl border border-gray-250 bg-white/70 shadow-[0_8px_30px_rgb(0,0,0,0.012)] backdrop-blur-md dark:border-gray-800/80 dark:bg-gray-900/60 transition-all duration-300 hover:shadow-[0_15px_40px_rgba(70,95,255,0.03)]">
            <div className="p-5 sm:p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div>
                    <h3 className="text-base font-bold text-gray-800 dark:text-white/90">
                        Detailed Earnings Transactions
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">Breakdown of revenue, fees, taxes and payouts per booking.</p>
                </div>
                <button 
                    onClick={() => onExportCSV?.()}
                    id="export-earnings-csv"
                    className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-800 border border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white bg-white/50 dark:bg-white/[0.02] rounded-xl transition-all duration-150 shadow-xs active:scale-95 uppercase tracking-wider"
                >
                    Download CSV
                </button>
            </div>
            
            <div className="max-w-full overflow-x-auto">
                <Table>
                    <TableHeader className="bg-gray-50/50 dark:bg-white/[0.02]">
                        <TableRow>
                            <TableCell isHeader className="py-4 px-5 text-[11px] font-extrabold uppercase tracking-wider text-gray-400">Date</TableCell>
                            <TableCell isHeader className="py-4 px-5 text-[11px] font-extrabold uppercase tracking-wider text-gray-400">Order ID</TableCell>
                            <TableCell isHeader className="py-4 px-5 text-[11px] font-extrabold uppercase tracking-wider text-gray-400 text-right">Gross (SAR)</TableCell>
                            <TableCell isHeader className="py-4 px-5 text-[11px] font-extrabold uppercase tracking-wider text-gray-400 text-right">Refund (SAR)</TableCell>
                            <TableCell isHeader className="py-4 px-5 text-[11px] font-extrabold uppercase tracking-wider text-gray-400 text-right">Fee (SAR)</TableCell>
                            <TableCell isHeader className="py-4 px-5 text-[11px] font-extrabold uppercase tracking-wider text-gray-400 text-right">Tax (SAR)</TableCell>
                            <TableCell isHeader className="py-4 px-5 text-[11px] font-extrabold uppercase tracking-wider text-gray-400 text-right font-bold text-brand-500">Payout (SAR)</TableCell>
                            <TableCell isHeader className="py-4 px-5 text-[11px] font-extrabold uppercase tracking-wider text-gray-400 text-center pr-4">Status</TableCell>
                        </TableRow>
                    </TableHeader>

                    <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {isLoading ? (
                            [1, 2, 3].map((n) => (
                                <TableRow key={n}>
                                    <TableCell colSpan={8} className="py-8">
                                        <div className="h-6 w-full animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : transactions.length > 0 ? (
                            transactions.map((row, idx) => (
                                <TableRow key={row.orderId || idx} className="hover:bg-gray-50/30 dark:hover:bg-white/[0.01]">
                                    <TableCell className="py-4 px-5 text-xs text-gray-500 font-medium whitespace-nowrap">
                                        {new Date(row.date).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="py-4 px-5 text-xs font-semibold text-gray-800 dark:text-white">{row.orderId}</TableCell>
                                    <TableCell className="py-4 px-5 text-xs text-right font-bold text-gray-800 dark:text-white">
                                        {Number(row.gross || 0).toLocaleString()}
                                    </TableCell>
                                    <TableCell className="py-4 px-5 text-xs text-right text-red-500 font-bold">
                                        {row.refund > 0 ? `-${Number(row.refund).toLocaleString()}` : '0'}
                                    </TableCell>
                                    <TableCell className="py-4 px-5 text-xs text-right text-purple-500 font-medium">
                                        -{Number((row.platformFee || 0) + (row.adminCommission || 0)).toLocaleString()}
                                    </TableCell>
                                    <TableCell className="py-4 px-5 text-xs text-right text-orange-500 font-medium">
                                        -{Number(row.tax || 0).toLocaleString()}
                                    </TableCell>
                                    <TableCell className="py-4 px-5 text-xs text-right font-black text-gray-900 dark:text-white">
                                        {Number(row.payout || 0).toLocaleString()}
                                    </TableCell>
                                    <TableCell className="py-4 px-5 text-center pr-4">
                                        <Badge size="xs" color={
                                            row.status === 'completed' ? 'success' : 
                                            row.status === 'pending' ? 'warning' : 'error'
                                        }>
                                            {row.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} className="py-10 text-center text-gray-450 text-sm font-medium">
                                    No transactions found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
