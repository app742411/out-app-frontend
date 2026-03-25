import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { Pencil, Trash2 } from "lucide-react";
import { deleteCommission } from "../../api/authApi";
import toast from "react-hot-toast";

export default function CommissionListComp({ commissions, loading, fetchCommissions, setEditCommission }) {
    const [actionLoading, setActionLoading] = useState(null);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this commission?")) return;

        setActionLoading(id);
        try {
            await deleteCommission(id);
            toast.success("Commission deleted successfully");
            if (fetchCommissions) fetchCommissions();
        } catch (error) {
            toast.error(error.message || "Failed to delete commission");
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="flex h-40 items-center justify-center rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-500 border-t-transparent"></div>
            </div>
        );
    }

    if (!commissions || commissions.length === 0) {
        return (
            <div className="flex h-40 items-center justify-center rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                <p className="text-gray-500 dark:text-gray-400">No commissions found.</p>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="overflow-visible">
                <Table className="min-w-full">
                    <TableHeader>
                        <TableRow>
                            <TableCell isHeader className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                Scope
                            </TableCell>
                            <TableCell isHeader className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                Category
                            </TableCell>
                            <TableCell isHeader className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                Type
                            </TableCell>
                            <TableCell isHeader className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                Value
                            </TableCell>
                            <TableCell isHeader className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                Status
                            </TableCell>
                            <TableCell isHeader className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {commissions?.map((comm) => (
                            <TableRow
                                key={comm._id}
                                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                            >
                                <TableCell className="px-6 py-4">
                                    {comm.scope}
                                </TableCell>

                                <TableCell className="px-6 py-4">
                                    {comm.scope === "CATEGORY" && comm.categoryId ? (
                                        <span className="truncate block max-w-[180px]">
                                            {comm.categoryId.category ||
                                                comm.categoryId.name ||
                                                comm.categoryId.title ||
                                                "Unknown Category"}
                                        </span>
                                    ) : (
                                        <span className="text-gray-400 text-xs italic">
                                            N/A
                                        </span>
                                    )}
                                </TableCell>

                                <TableCell className="px-6 py-4">
                                    {comm.commissionType === "PERCENTAGE"
                                        ? "Percentage (%)"
                                        : "Flat Amount"}
                                </TableCell>

                                <TableCell className="px-6 py-4 font-semibold text-gray-800 dark:text-white/90">
                                    {comm.commissionType === "PERCENTAGE"
                                        ? `${comm.value}%`
                                        : `$${comm.value}`}
                                </TableCell>

                                <TableCell className="px-6 py-4">
                                    <Badge size="sm" color={comm.isActive ? "success" : "error"}>
                                        {comm.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                </TableCell>

                                <TableCell className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-3">
                                        <button
                                            onClick={() => setEditCommission(comm)}
                                            className="p-2 rounded-lg text-gray-600 hover:text-green-600 hover:bg-green-50 dark:text-gray-400 dark:hover:text-green-400 dark:hover:bg-green-500/10 transition-colors"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>

                                        <button
                                            onClick={() => handleDelete(comm._id)}
                                            disabled={actionLoading === comm._id}
                                            className="p-2 rounded-lg text-gray-600 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-500/10 transition-colors disabled:opacity-50"
                                        >
                                            {actionLoading === comm._id ? (
                                                <div className="w-4 h-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent"></div>
                                            ) : (
                                                <Trash2 className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
