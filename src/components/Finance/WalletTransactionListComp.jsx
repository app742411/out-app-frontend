import React, { useState, useEffect } from "react";
import ComponentCard from "../common/ComponentCard";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import { getAllWalletTransactions } from "../../api/authApi";
import toast from "react-hot-toast";
import Pagination from "../common/Pagination";
import Badge from "../ui/badge/Badge";
import { Search, Filter, TrendingUp, TrendingDown } from "lucide-react";
import Select from "../ui/select/Select";
export default function WalletTransactionListComp() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");

    const fetchTransactions = async (page = 1) => {
        try {
            setLoading(true);
            const res = await getAllWalletTransactions({
                page,
                limit: 10,
                search,
                status,
            });
            setTransactions(res.data || []);
            setTotalPages(res.totalPages || 1);
            setCurrentPage(page);
        } catch (error) {
            toast.error("Failed to load wallet transactions");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions(1);
    }, [search, status]);

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "completed":
            case "success":
                return "success";
            case "pending":
                return "warning";
            case "failed":
                return "error";
            default:
                return "light";
        }
    };

    return (
        <ComponentCard title="Wallet Transactions">
            {/* Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by Order ID, Email..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <Select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="">All Statuses</option>
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                        <option value="failed">Failed</option>
                    </Select>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto">
                    {loading ? (
                        <div className="text-center p-12 text-gray-500">Loading wallet transactions...</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableCell isHeader className="px-5 py-3 uppercase text-[11px] font-bold text-gray-400">Order ID</TableCell>
                                    <TableCell isHeader className="px-5 py-3 uppercase text-[11px] font-bold text-gray-400">User</TableCell>
                                    <TableCell isHeader className="px-5 py-3 uppercase text-[11px] font-bold text-gray-400">Type</TableCell>
                                    <TableCell isHeader className="px-5 py-3 uppercase text-[11px] font-bold text-gray-400">Amount</TableCell>
                                    <TableCell isHeader className="px-5 py-3 uppercase text-[11px] font-bold text-gray-400">Status</TableCell>
                                    <TableCell isHeader className="px-5 py-3 uppercase text-[11px] font-bold text-gray-400">Date</TableCell>
                                    <TableCell isHeader className="px-5 py-3 uppercase text-[11px] font-bold text-gray-400">Description</TableCell>
                                </TableRow>
                            </TableHeader>

                            <TableBody className="divide-y divide-dashed divide-gray-200 dark:divide-white/5">
                                {transactions.length > 0 ? (
                                    transactions.map((trx) => (
                                        <TableRow key={trx._id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                            <TableCell className="px-5 py-4 font-medium text-gray-900 dark:text-white">
                                                {trx.bookingId?.orderId || "N/A"}
                                            </TableCell>
                                            <TableCell className="px-5 py-4">
                                                <div className="text-sm">
                                                    <div className="font-semibold text-gray-800 dark:text-gray-200 capitalize">
                                                        {trx.user?.firstName} {trx.user?.lastName}
                                                    </div>
                                                    <div className="text-xs text-gray-400">{trx.user?.email}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-5 py-4">
                                                <div className={`flex items-center gap-1.5 text-xs font-bold uppercase ${trx.type === 'credit' ? 'text-green-500' : 'text-red-500'}`}>
                                                    {trx.type === 'credit' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                                    {trx.type}
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-5 py-4">
                                                <div className={`font-bold ${trx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                                                    {trx.type === 'credit' ? '+' : '-'} SAR {trx.amount}
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-5 py-4">
                                                <Badge color={getStatusColor(trx.status)}>
                                                    {trx.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-5 py-4 text-xs text-gray-500">
                                                {new Date(trx.createdAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="px-5 py-4 text-xs text-gray-500 max-w-[200px] truncate">
                                                {trx.description}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                                            No transactions found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </div>

            {!loading && totalPages > 1 && (
                <div className="mt-6">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(newPage) => {
                            setCurrentPage(newPage);
                            fetchTransactions(newPage);
                        }}
                    />
                </div>
            )}
        </ComponentCard>
    );
}
