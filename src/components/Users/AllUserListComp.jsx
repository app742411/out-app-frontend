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
import { getAllUsers, blockUnblockUser, deleteUser } from "../../api/authApi";
import toast from "react-hot-toast";
import Pagination from "../common/Pagination";
import { Select } from "../ui/select/Select";
import DeleteConfirmationModal from "../common/DeleteConfirmationModal";
import { EyeIcon, TrashBinIcon, CloseLineIcon, CheckLineIcon } from "../../icons";
import { timeAgo } from "../../utils/date";

const ITEMS_PER_PAGE = 10;

export default function AllUserListComp() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const navigate = useNavigate();

    const baseURL = import.meta.env.VITE_API_URL;

    const fetchUsers = async (page = 1, isBackgroundPoll = false) => {
        try {
            if (!isBackgroundPoll) setLoading(true);

            const res = await getAllUsers({
                page,
                limit: ITEMS_PER_PAGE,
                search,
                status: statusFilter,
            });

            setUsers(res.data || []);
            setCurrentPage(page);
            setTotalPages(Math.ceil((res.totalCount || res.total || 0) / ITEMS_PER_PAGE));
        } catch (error) {
            if (!isBackgroundPoll) toast.error("Failed to load users");
        } finally {
            if (!isBackgroundPoll) setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(1);
    }, [search, statusFilter]);

    // Real-time data refresh on focus or tab visibility to avoid continuous background polling
    useEffect(() => {
        const handleRefresh = () => {
            if (document.visibilityState === "visible") {
                fetchUsers(currentPage, true);
            }
        };

        window.addEventListener("focus", handleRefresh);
        document.addEventListener("visibilitychange", handleRefresh);

        return () => {
            window.removeEventListener("focus", handleRefresh);
            document.removeEventListener("visibilitychange", handleRefresh);
        };
    }, [currentPage, search, statusFilter]);

    const handleBlockUnblock = async (userId, currentStatus) => {
        try {
            setLoading(true);
            await blockUnblockUser(userId, "user", !currentStatus);
            toast.success(`User ${!currentStatus ? 'activated' : 'blocked'} successfully`);
            fetchUsers(currentPage);
        } catch (error) {
            toast.error(error.message || "Action failed");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async () => {
        if (!userToDelete) return;
        try {
            setLoading(true);
            await deleteUser(userToDelete);
            toast.success("User deleted successfully");
            setDeleteOpen(false);
            setUserToDelete(null);
            fetchUsers(currentPage);
        } catch (error) {
            toast.error(error.message || "Failed to delete user");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ComponentCard title="All Users" className="">
            {/* Search + Filter */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6 bg-transparent">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Search users by name, email, userId..."
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
            </div>

            {/* Table */}
            <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] overflow-visible">
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
                                    User Info
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3">
                                    Identity Details
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3">
                                    Joined Date
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 text-center">
                                    Status
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 text-right">
                                    Action
                                </TableCell>
                            </TableRow>
                        </TableHeader>

                        <TableBody className="divide-y divide-dashed divide-gray-200 dark:divide-white/5">
                            {users.length > 0 ? (
                                users.map((user, index) => (
                                    <TableRow key={user._id || index}>
                                        <TableCell className="px-5 py-3">
                                            {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                                        </TableCell>

                                        <TableCell className="px-5 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 shrink-0 overflow-hidden rounded-full border border-gray-200 dark:border-gray-700">
                                                    {user.profile ? (
                                                        <img
                                                            src={
                                                                user.profile
                                                                    ? `${baseURL.replace(/\/$/, "")}/uploads/users/${user.profile}`
                                                                    : "/images/user/user-01.jpg"
                                                            }
                                                            alt={user.firstName}
                                                            className="object-cover w-full h-full"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-full font-semibold uppercase text-xs">
                                                            {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-gray-800 dark:text-white capitalize line-clamp-1">{user.firstName} {user.lastName}</span>
                                                    <span className="text-xs text-gray-500 line-clamp-1">{user.email || "No Email"}</span>
                                                    <span className="text-xs text-gray-500 line-clamp-1">{user.phone ? `${user.phoneCode || ""} ${user.phone}` : "No Phone"}</span>
                                                </div>
                                            </div>
                                        </TableCell>

                                        <TableCell className="px-5 py-3">
                                            <div className="flex flex-col items-start gap-1.5">
                                                {user.identityType && (
                                                    <span className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                                        {user.identityType}
                                                    </span>
                                                )}
                                                <div className="flex gap-2 items-center flex-wrap">
                                                    {user.identityVerificationStatus ? (
                                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${user.identityVerificationStatus === "PENDING" ? "bg-amber-100 text-amber-700" : (user.identityVerificationStatus === "APPROVED" || user.identityVerificationStatus === "VERIFIED") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                                            {user.identityVerificationStatus}
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                                                            UNVERIFIED
                                                        </span>
                                                    )}
                                                    
                                                    {user.verificationProvider === "YAKEEN" && (
                                                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                                                            YAKEEN
                                                        </span>
                                                    )}
                                                    
                                                    {user.verificationMethod === "MANUAL" && (
                                                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                                                            MANUAL
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>

                                        <TableCell className="px-5 py-3">
                                            <div className="flex flex-col">
                                                <span>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}</span>
                                                <span className="text-[10px] text-gray-400">{user.createdAt ? timeAgo(user.createdAt) : "-"}</span>
                                            </div>
                                        </TableCell>

                                        <TableCell className="px-5 py-3 text-center">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${user.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                                {user.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </TableCell>

                                        <TableCell className="px-5 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {/* View Button */}
                                                <button
                                                    onClick={() => navigate(`/user-details/${user._id}`)}
                                                    className="inline-flex items-center justify-center p-2 rounded-lg transition-all duration-155 text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20 cursor-pointer"
                                                    title="View"
                                                >
                                                    <EyeIcon className="size-5 fill-current" />
                                                </button>

                                                {/* Block/Unblock Button */}
                                                <button
                                                    onClick={() => handleBlockUnblock(user._id, user.isActive)}
                                                    className={`inline-flex items-center justify-center p-2 rounded-lg transition-all duration-155 cursor-pointer ${
                                                        user.isActive
                                                            ? "text-amber-600 bg-amber-50 hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:hover:bg-amber-500/20"
                                                            : "text-green-600 bg-green-50 hover:bg-green-100 dark:bg-green-500/10 dark:text-green-400 dark:hover:bg-green-500/20"
                                                    }`}
                                                    title={user.isActive ? "Block" : "Unblock"}
                                                >
                                                    {user.isActive ? (
                                                        <CloseLineIcon className="size-5" />
                                                    ) : (
                                                        <CheckLineIcon className="size-5" />
                                                    )}
                                                </button>

                                                {/* Delete Button */}
                                                <button
                                                    onClick={() => {
                                                        setUserToDelete(user._id);
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
                                    <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                                        No users found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
            </div>

            {!loading && totalPages > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(newPage) => {
                        setCurrentPage(newPage);
                        fetchUsers(newPage);
                    }}
                />
            )}

            <DeleteConfirmationModal
                open={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                onConfirm={handleDeleteUser}
                title="Delete User"
                message="Are you sure you want to delete this user? This action cannot be undone."
            />
        </ComponentCard>
    );
}
