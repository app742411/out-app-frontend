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
import { getAllServiceUsers, blockUnblockUser } from "../../api/authApi";
import toast from "react-hot-toast";
import Pagination from "../common/Pagination";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";

const ITEMS_PER_PAGE = 10;


export default function VendorListComp() {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [openDropdownId, setOpenDropdownId] = useState(null);
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
    }, [search, statusFilter]);

    // Real-time data refresh on focus or tab visibility to avoid continuous background polling
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
    }, [currentPage, search, statusFilter]);

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
            setOpenDropdownId(null);
        }
    };




    return (
        <ComponentCard title="All Service Providers" className="">
            {/* Search + Filter */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 bg-transparent">
                <input
                    type="text"
                    placeholder="Search service providers by name, email, userId..."
                    className="border rounded-lg p-2 w-full md:w-1/2 dark:bg-gray-800 dark:text-white"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    className="border rounded-lg p-2 dark:bg-gray-800 dark:text-white"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
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
                                        Profile
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
                                            <TableCell className="px-5 py-3">
                                                <div className="w-10 h-10 overflow-hidden rounded-full border border-gray-200 dark:border-gray-700">
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
                                            </TableCell>

                                            <TableCell className="px-5 py-3 font-medium text-gray-800 dark:text-white">
                                                {vendor.userId || "-"}
                                            </TableCell>

                                            <TableCell className="px-5 py-3">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-gray-800 dark:text-white capitalize line-clamp-1">{vendor.firstName} {vendor.lastName}</span>
                                                    <span className="text-xs text-gray-500 line-clamp-1">{vendor.email || "-"}</span>
                                                </div>
                                            </TableCell>

                                            <TableCell className="px-5 py-3">
                                                {vendor.phone ? `${vendor.phoneCode || ""} ${vendor.phone}` : "-"}
                                            </TableCell>

                                            <TableCell className="px-5 py-3 capitalize">
                                                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                                                    {vendor.role ? vendor.role.replace('_', ' ') : "-"}
                                                </span>
                                            </TableCell>

                                            <TableCell className="px-5 py-3">
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
                                                {vendor.createdAt ? new Date(vendor.createdAt).toLocaleDateString() : "-"}
                                            </TableCell>
                                            <TableCell className="px-5 py-3 text-right">
                                                <div className="flex items-center justify-end">
                                                    <div className="relative">
                                                        <button
                                                            type="button"
                                                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors dropdown-toggle"
                                                            onClick={() =>
                                                                setOpenDropdownId(openDropdownId === vendor._id ? null : vendor._id)
                                                            }
                                                        >
                                                            <MoreDotIcon className="text-gray-400 size-5" />
                                                        </button>

                                                        <Dropdown
                                                            isOpen={openDropdownId === vendor._id}
                                                            onClose={() => setOpenDropdownId(null)}
                                                            className="w-40 p-2 right-0 mt-2 absolute"
                                                        >
                                                            <DropdownItem
                                                                onItemClick={() => {
                                                                    navigate(`/vendor-details/${vendor._id}`);
                                                                    setOpenDropdownId(null);
                                                                }}
                                                            >
                                                                View
                                                            </DropdownItem>

                                                            <DropdownItem
                                                                onItemClick={() =>
                                                                    handleBlockUnblock(vendor._id, vendor.isActive)
                                                                }
                                                            >
                                                                {vendor.isActive ? "Block" : "Unblock"}
                                                            </DropdownItem>
                                                        </Dropdown>
                                                    </div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-6 text-gray-500">
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
        </ComponentCard>
    );
}
