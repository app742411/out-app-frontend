import React, { useState, useEffect } from "react";
import ComponentCard from "../common/ComponentCard";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import { Select } from "../ui/select/Select";
import { getAllPaymentTransactions } from "../../api/authApi";
import toast from "react-hot-toast";
import Pagination from "../common/Pagination";
import Badge from "../ui/badge/Badge";
import { useNavigate } from "react-router";
import { Eye, Search } from "lucide-react";

export default function TransactionListComp() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const navigate = useNavigate();

    const fetchTransactions = async (page = 1) => {
        try {
            setLoading(true);
            const res = await getAllPaymentTransactions({
                page,
                limit: 10,
                search,
                status,
            });
            setTransactions(res.data || []);
            setTotalPages(res.totalPages || 1);
            setCurrentPage(page);
        } catch (error) {
            toast.error("Failed to load transactions");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions(1);
    }, [search, status]);

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "success":
            case "captured":
            case "paid":
                return "success";
            case "pending":
            case "initiated":
                return "warning";
            case "failed":
            case "error":
                return "error";
            default:
                return "light";
        }
    };

    return (
        <ComponentCard title="Payment Transactions">
            {/* Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by Order ID, Tap Charge ID..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="">All Statuses</option>
                        <option value="success">Success</option>
                        <option value="pending">Pending</option>
                        <option value="failed">Failed</option>
                    </Select>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto">
                    {loading ? (
                        <div className="text-center p-12 text-gray-500">Loading transactions...</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableCell isHeader className="px-5 py-3 uppercase text-[11px] font-bold text-gray-400">Order ID</TableCell>
                                    <TableCell isHeader className="px-5 py-3 uppercase text-[11px] font-bold text-gray-400">User</TableCell>
                                    <TableCell isHeader className="px-5 py-3 uppercase text-[11px] font-bold text-gray-400">Tap Charge ID</TableCell>
                                    <TableCell isHeader className="px-5 py-3 uppercase text-[11px] font-bold text-gray-400">Amount</TableCell>
                                    <TableCell isHeader className="px-5 py-3 uppercase text-[11px] font-bold text-gray-400">Status</TableCell>
                                    <TableCell isHeader className="px-5 py-3 uppercase text-[11px] font-bold text-gray-400">Date</TableCell>
                                    <TableCell isHeader className="px-5 py-3 uppercase text-[11px] font-bold text-gray-400 text-right">Action</TableCell>
                                </TableRow>
                            </TableHeader>

                            <TableBody className="divide-y divide-dashed divide-gray-200 dark:divide-white/5">
                                {transactions.length > 0 ? (
                                    transactions.map((trx) => (
                                        <TableRow key={trx._id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                            <TableCell className="px-5 py-4 font-medium text-gray-900 dark:text-white">
                                                {trx.orderId}
                                            </TableCell>
                                            <TableCell className="px-5 py-4">
                                                <div className="text-sm">
                                                    <div className="font-semibold text-gray-800 dark:text-gray-200 capitalize">
                                                        {trx.booking?.user?.firstName} {trx.booking?.user?.lastName}
                                                    </div>
                                                    <div className="text-xs text-gray-400">{trx.booking?.user?.email}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-5 py-4 font-mono text-xs text-blue-500">
                                                {trx.tapChargeId}
                                            </TableCell>
                                            <TableCell className="px-5 py-4">
                                                <div className="font-bold text-gray-900 dark:text-white">
                                                    {trx.currency} {trx.totalAmount || trx.amount}
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
                                            <TableCell className="px-5 py-4 text-left">
                                                <button
                                                    onClick={() => navigate(`/transaction-details/${trx._id}`)}
                                                    className="p-2 hover:bg-brand-50 rounded-lg text-brand-500 transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </button>
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
