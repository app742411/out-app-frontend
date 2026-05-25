import React, { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { Pencil, Trash2, Filter } from "lucide-react";
import { deleteCommission } from "../../api/authApi";
import toast from "react-hot-toast";
import { Select } from "../ui/select/Select";
import Button from "../ui/button/Button";

export default function CommissionListComp({
    commissions,
    loading,
    pagination = { page: 1, totalPages: 1, previousDisabled: true, nextDisabled: true, total: 0 },
    filters = { scope: "", type: "", isActive: "" },
    setFilters,
    fetchCommissions,
    setEditCommission,
}) {
    const [actionLoading, setActionLoading] = useState(null);
    const [localFilters, setLocalFilters] = useState({
        scope: filters.scope || "",
        type: filters.type || "",
        isActive: filters.isActive || "",
    });

    // Synchronize localFilters if parent filters change (e.g., reset or change from elsewhere)
    useEffect(() => {
        setLocalFilters({
            scope: filters.scope || "",
            type: filters.type || "",
            isActive: filters.isActive || "",
        });
    }, [filters]);

    const handleFilterChange = (name, value) => {
        setLocalFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleApplyFilters = () => {
        if (setFilters) {
            setFilters(localFilters);
        }
        if (fetchCommissions) {
            fetchCommissions(1, localFilters);
        }
    };

    const handleResetFilters = () => {
        const cleared = { scope: "", type: "", isActive: "" };
        setLocalFilters(cleared);
        if (setFilters) {
            setFilters(cleared);
        }
        if (fetchCommissions) {
            fetchCommissions(1, cleared);
        }
    };

    const handlePrevPage = () => {
        if (fetchCommissions && !pagination.previousDisabled) {
            fetchCommissions(pagination.page - 1, localFilters);
        }
    };

    const handleNextPage = () => {
        if (fetchCommissions && !pagination.nextDisabled) {
            fetchCommissions(pagination.page + 1, localFilters);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this commission?")) return;

        setActionLoading(id);
        try {
            await deleteCommission(id);
            toast.success("Commission deleted successfully");
            if (fetchCommissions) {
                fetchCommissions(pagination.page, localFilters);
            }
        } catch (error) {
            toast.error(error.message || "Failed to delete commission");
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
            {/* Filter Section */}
            <div className="p-5 border-b border-gray-200 dark:border-gray-800">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                    <div className="flex-1 min-w-[140px]">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                            Scope
                        </label>
                        <Select
                            value={localFilters.scope}
                            onChange={(e) => handleFilterChange("scope", e.target.value)}
                        >
                            <option value="">All Scopes</option>
                            <option value="GLOBAL">Global</option>
                            <option value="CATEGORY">Category Specific</option>
                        </Select>
                    </div>

                    <div className="flex-1 min-w-[140px]">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                            Applicable To
                        </label>
                        <Select
                            value={localFilters.type}
                            onChange={(e) => handleFilterChange("type", e.target.value)}
                        >
                            <option value="">All Types</option>
                            <option value="PROPERTY">Property</option>
                            <option value="SERVICE">Service</option>
                        </Select>
                    </div>

                    <div className="flex-1 min-w-[140px]">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                            Status
                        </label>
                        <Select
                            value={localFilters.isActive}
                            onChange={(e) => handleFilterChange("isActive", e.target.value)}
                        >
                            <option value="">All Statuses</option>
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </Select>
                    </div>

                    <div className="flex items-center gap-2 mt-4 sm:mt-0">
                        <Button
                            onClick={handleApplyFilters}
                            className="bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm px-4 py-2.5 h-11"
                            startIcon={<Filter className="w-4 h-4" />}
                        >
                            Filter
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleResetFilters}
                            className="font-semibold text-sm px-4 py-2.5 h-11"
                        >
                            Reset
                        </Button>
                    </div>
                </div>
            </div>

            {/* Table or Loading Section */}
            {loading ? (
                <div className="flex h-60 items-center justify-center">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-500 border-t-transparent"></div>
                </div>
            ) : (
                <>
                    <div className="overflow-visible">
                        <Table className="min-w-full">
                            <TableHeader>
                                <TableRow>
                                    <TableCell isHeader className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                        Scope
                                    </TableCell>
                                    <TableCell isHeader className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                        Applicable To
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
                                {commissions.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-12 text-gray-500 dark:text-gray-400">
                                            <div className="flex flex-col items-center justify-center space-y-2">
                                                <Filter className="w-8 h-8 text-gray-300 dark:text-gray-600 mb-1" />
                                                <span className="font-medium text-sm">No commissions found.</span>
                                                <span className="text-xs text-gray-400">Try adjusting your filters or search.</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    commissions.map((comm) => (
                                        <TableRow
                                            key={comm._id}
                                            className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                        >
                                            <TableCell className="px-6 py-4 font-semibold text-gray-705 dark:text-white/95">
                                                {comm.scope}
                                            </TableCell>

                                            <TableCell className="px-6 py-4">
                                                <Badge size="sm" color={comm.type === "SERVICE" ? "warning" : "info"}>
                                                    {comm.type === "SERVICE" ? "Service" : "Property"}
                                                </Badge>
                                            </TableCell>

                                            <TableCell className="px-6 py-4">
                                                {comm.scope === "CATEGORY" ? (
                                                    comm.type === "SERVICE" ? (
                                                        <span className="truncate block max-w-[200px]">
                                                            {comm.serviceId ? (
                                                                <span className="font-semibold text-gray-900 dark:text-white block">
                                                                    {comm.serviceId.name || comm.serviceId.title || "Unknown Service"}
                                                                    <span className="text-[10px] text-gray-400 dark:text-gray-500 block font-normal">
                                                                        Cat: {comm.serviceCategoryId?.name || "Unknown Category"}
                                                                    </span>
                                                                </span>
                                                            ) : (
                                                                comm.serviceCategoryId?.name || "Unknown Category"
                                                            )}
                                                        </span>
                                                    ) : (
                                                        <span className="truncate block max-w-[180px]">
                                                            {comm.categoryId?.category ||
                                                                comm.categoryId?.name ||
                                                                comm.categoryId?.title ||
                                                                "Unknown Category"}
                                                        </span>
                                                    )
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
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Premium Pagination Bar */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/10">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            Showing page <span className="font-semibold text-gray-800 dark:text-white">{pagination.page}</span> of{" "}
                            <span className="font-semibold text-gray-800 dark:text-white">{pagination.totalPages}</span> ·{" "}
                            <span className="font-semibold text-gray-800 dark:text-white">{pagination.total}</span> commissions total
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handlePrevPage}
                                disabled={pagination.previousDisabled}
                                className="text-xs h-9 px-3 font-semibold text-gray-700 dark:text-gray-300"
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleNextPage}
                                disabled={pagination.nextDisabled}
                                className="text-xs h-9 px-3 font-semibold text-gray-700 dark:text-gray-300"
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
