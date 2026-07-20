import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import ComponentCard from "../common/ComponentCard";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import Button from "../ui/button/Button";
import { getAllServiceUsers, blockUnblockUser, deleteServiceUser } from "../../api/authApi";
import toast from "react-hot-toast";
import Pagination from "../common/Pagination";
import { Select } from "../ui/select/Select";
import DeleteConfirmationModal from "../common/DeleteConfirmationModal";
import { EyeIcon, TrashBinIcon, CloseLineIcon, CheckLineIcon } from "../../icons";
import { timeAgo } from "../../utils/date";

const ITEMS_PER_PAGE = 10;


export default function VendorListComp() {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [approvalFilter, setApprovalFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [vendorToDelete, setVendorToDelete] = useState(null);
    const navigate = useNavigate();

    const baseURL = import.meta.env.VITE_API_URL;


    const fetchVendors = async (page = 1, isBackgroundPoll = false) => {
        try {
            if (!isBackgroundPoll) setLoading(true);

            const res = await getAllServiceUsers({
                page,
                limit: ITEMS_PER_PAGE,
                search,
                status: statusFilter,
                isApproved: approvalFilter,
            });

            setVendors(res.data || []);
            setCurrentPage(page);
            setTotalPages(Math.ceil((res.totalCount || res.total || 0) / ITEMS_PER_PAGE));
        } catch (error) {
            if (!isBackgroundPoll) toast.error("Failed to load vendors");
        } finally {
            if (!isBackgroundPoll) setLoading(false);
        }
    };

    useEffect(() => {
        fetchVendors(1);
    }, [search, statusFilter, approvalFilter]);

    useEffect(() => {
        const handleRefresh = () => {
            if (document.visibilityState === "visible") {
                fetchVendors(currentPage, true);
            }
        };

        window.addEventListener("focus", handleRefresh);
        document.addEventListener("visibilitychange", handleRefresh);

        return () => {
            window.removeEventListener("focus", handleRefresh);
            document.removeEventListener("visibilitychange", handleRefresh);
        };
    }, [currentPage, search, statusFilter, approvalFilter]);

    const handleBlockUnblock = async (vendorId, currentStatus) => {
        try {
            setLoading(true);
            await blockUnblockUser(vendorId, "service", !currentStatus);
            toast.success(`Vendor ${!currentStatus ? 'activated' : 'blocked'} successfully`);
            fetchVendors(currentPage);
        } catch (error) {
            toast.error(error.message || "Action failed");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteVendor = async () => {
        if (!vendorToDelete) return;
        try {
            setLoading(true);
            await deleteServiceUser(vendorToDelete);
            toast.success("Service Provider deleted successfully");
            setDeleteOpen(false);
            setVendorToDelete(null);
            fetchVendors(currentPage);
        } catch (error) {
            toast.error(error.message || "Failed to delete service provider");
        } finally {
            setLoading(false);
        }
    };




    return (
        <ComponentCard title="All Service Providers" className="">
            {/* Search + Filter */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6 bg-transparent">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Search service providers by name, email, userId..."
                        className="border border-gray-300 dark:border-gray-700 rounded-lg p-2 w-full dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="w-full md:w-56">
                    <Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </Select>
                </div>

                <div className="w-full md:w-56">
                    <Select
                        value={approvalFilter}
                        onChange={(e) => setApprovalFilter(e.target.value)}
                    >
                        <option value="">All Approval Status</option>
                        <option value="approved">Approved</option>
                        <option value="pending">Pending</option>
                        <option value="rejected">Rejected</option>
                    </Select>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] overflow-visible">
                <div className="max-w-full overflow-visible">
                    {loading ? (
                        <div className="text-center p-6 text-gray-500">Loading...</div>
                    ) : (
                        <Table>
                            <TableHeader className="text-left">
                                <TableRow>
                                    <TableCell isHeader className="px-5 py-3">
                                        S.No.
                                    </TableCell>
                                    <TableCell isHeader className="px-5 py-3">
                                        User ID
                                    </TableCell>
                                    <TableCell isHeader className="px-5 py-3">
                                        Vendor Details
                                    </TableCell>
                                    <TableCell isHeader className="px-5 py-3">
                                        Phone
                                    </TableCell>
                                    <TableCell isHeader className="px-5 py-3">
                                        Role
                                    </TableCell>
                                    <TableCell isHeader className="px-5 py-3">
                                        Status
                                    </TableCell>
                                    <TableCell isHeader className="px-5 py-3">
                                        Approval
                                    </TableCell>
                                    <TableCell isHeader className="px-5 py-3">
                                        Joined Date
                                    </TableCell>
                                    <TableCell isHeader className="px-5 py-3 text-right">
                                        Action
                                    </TableCell>
                                </TableRow>
                            </TableHeader>


                            <TableBody className="divide-y divide-dashed divide-gray-200 dark:divide-white/5">
                                {vendors.length > 0 ? (
                                    vendors.map((vendor, index) => (
                                        <TableRow key={vendor._id || index}>
                                            <TableCell className="px-5 py-3">
                                                {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                                            </TableCell>
                                            <TableCell className="px-5 py-3 font-medium text-gray-800 dark:text-white">
                                                {vendor.userId || "-"}
                                            </TableCell>
                                            <TableCell className="px-5 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 shrink-0 overflow-hidden rounded-full border border-gray-200 dark:border-gray-700">
                                                        {vendor.profile ? (
                                                            <img
                                                                src={
                                                                    vendor.profile
                                                                        ? `${baseURL.replace(/\/$/, "")}/uploads/users/${vendor.profile}`
                                                                        : "/images/user/user-01.jpg"
                                                                }
                                                                alt={vendor.firstName}
                                                                className="object-cover w-full h-full"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-full font-semibold uppercase text-xs">
                                                                {vendor.firstName?.charAt(0)}{vendor.lastName?.charAt(0)}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-gray-800 dark:text-white capitalize line-clamp-1">{vendor.firstName} {vendor.lastName}</span>
                                                        <span className="text-xs text-gray-500 line-clamp-1">{vendor.email || "-"}</span>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            <TableCell className="px-5 py-3">
                                                {vendor.phone ? vendor.phone : "-"}
                                            </TableCell>

                                            <TableCell className="px-5 py-3 capitalize">
                                                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                                                    {vendor.role ? vendor.role.replace('_', ' ') : "-"}
                                                </span>
                                            </TableCell>

                                            <TableCell className="px-5 py-3 text-center">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-medium ${vendor.isActive
                                                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                                                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                                                        }`}
                                                >
                                                    {vendor.isActive ? "Active" : "Inactive"}
                                                </span>
                                            </TableCell>

                                            <TableCell className="px-5 py-3">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${vendor.isApproved === "approved"
                                                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                                                        : vendor.isApproved === "pending"
                                                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                                                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                                                        }`}
                                                >
                                                    {vendor.isApproved || "pending"}
                                                </span>
                                            </TableCell>

                                            <TableCell className="px-5 py-3">
                                                <div className="flex flex-col">
                                                    <span>{vendor.createdAt ? new Date(vendor.createdAt).toLocaleDateString() : "-"}</span>
                                                    <span className="text-[10px] text-gray-400">{vendor.createdAt ? timeAgo(vendor.createdAt) : "-"}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-5 py-3 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {/* View Button */}
                                                    <button
                                                        onClick={() => navigate(`/vendor-details/${vendor._id}`)}
                                                        className="inline-flex items-center justify-center p-2 rounded-lg transition-all duration-155 text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20 cursor-pointer"
                                                        title="View"
                                                    >
                                                        <EyeIcon className="size-5 fill-current" />
                                                    </button>

                                                    {/* Block/Unblock Button */}
                                                    <button
                                                        onClick={() => handleBlockUnblock(vendor._id, vendor.isActive)}
                                                        className={`inline-flex items-center justify-center p-2 rounded-lg transition-all duration-155 cursor-pointer ${
                                                            vendor.isActive
                                                                ? "text-amber-600 bg-amber-50 hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:hover:bg-amber-500/20"
                                                                : "text-green-600 bg-green-50 hover:bg-green-100 dark:bg-green-500/10 dark:text-green-400 dark:hover:bg-green-500/20"
                                                        }`}
                                                        title={vendor.isActive ? "Block" : "Unblock"}
                                                    >
                                                        {vendor.isActive ? (
                                                            <CloseLineIcon className="size-5" />
                                                        ) : (
                                                            <CheckLineIcon className="size-5" />
                                                        )}
                                                    </button>

                                                    {/* Delete Button */}
                                                    <button
                                                        onClick={() => {
                                                            setVendorToDelete(vendor._id);
                                                            setDeleteOpen(true);
                                                        }}
                                                        className="inline-flex items-center justify-center p-2 rounded-lg transition-all duration-155 text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 cursor-pointer"
                                                        title="Delete"
                                                    >
                                                        <TrashBinIcon className="size-5" />
                                                    </button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={9} className="text-center py-6 text-gray-500">
                                            No service providers found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </div>

            {!loading && totalPages > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(newPage) => {
                        setCurrentPage(newPage);
                        fetchVendors(newPage);
                    }}
                />
            )}

            <DeleteConfirmationModal
                open={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                onConfirm={handleDeleteVendor}
                title="Delete Service Provider"
                message="Are you sure you want to delete this service provider? This action cannot be undone."
            />
        </ComponentCard>
    );
}
