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
import DeleteConfirmationModal from "../common/DeleteConfirmationModal";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";

const ITEMS_PER_PAGE = 10;

export default function AllUserListComp() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [openDropdownId, setOpenDropdownId] = useState(null);
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
            setOpenDropdownId(null);
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
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 bg-transparent">
                <input
                    type="text"
                    placeholder="Search users by name, email, userId..."
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
                                {/* <TableCell isHeader className="px-5 py-3">
                                        User ID
                                    </TableCell> */}
                                <TableCell isHeader className="px-5 py-3">
                                    User
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3">
                                    Phone
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3">
                                    Role
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
                            {users.length > 0 ? (
                                users.map((user, index) => (
                                    <TableRow key={user._id || index}>
                                        <TableCell className="px-5 py-3">
                                            {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                                        </TableCell>

                                        <TableCell className="px-5 py-3">
                                            <div className="w-10 h-10 overflow-hidden rounded-full border border-gray-200 dark:border-gray-700">
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
                                        </TableCell>

                                        {/* <TableCell className="px-5 py-3 font-medium text-gray-800 dark:text-white">
                                                {user.userId || "-"}
                                            </TableCell> */}

                                        <TableCell className="px-5 py-3">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-gray-800 dark:text-white capitalize line-clamp-1">{user.firstName} {user.lastName}</span>
                                                <span className="text-xs text-gray-500 line-clamp-1">{user.email || "-"}</span>
                                            </div>
                                        </TableCell>

                                        <TableCell className="px-5 py-3">
                                            {user.phone ? `${user.phoneCode || ""} ${user.phone}` : "-"}
                                        </TableCell>

                                        <TableCell className="px-5 py-3 capitalize">
                                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                                                {user.role || "-"}
                                            </span>
                                        </TableCell>

                                        <TableCell className="px-5 py-3">
                                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}
                                        </TableCell>
                                        <TableCell className="px-5 py-3 text-center">
                                            <div className="flex items-center justify-left">
                                                <div className="relative">
                                                    <button
                                                        type="button"
                                                        className="dropdown-toggle p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                                                        onClick={() =>
                                                            setOpenDropdownId(openDropdownId === user._id ? null : user._id)
                                                        }
                                                    >
                                                        <MoreDotIcon className="text-gray-400 size-5" />
                                                    </button>

                                                    <Dropdown
                                                        isOpen={openDropdownId === user._id}
                                                        onClose={() => setOpenDropdownId(null)}
                                                        className="w-40 p-2 right-0 mt-2 absolute"
                                                    >
                                                        <DropdownItem
                                                            onItemClick={() => {
                                                                navigate(`/user-details/${user._id}`);
                                                                setOpenDropdownId(null);
                                                            }}
                                                            className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                                                        >
                                                            View
                                                        </DropdownItem>

                                                        <DropdownItem
                                                            onItemClick={() => handleBlockUnblock(user._id, user.isActive)}
                                                            className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                                                        >
                                                            {user.isActive ? "Block" : "Unblock"}
                                                        </DropdownItem>

                                                        <DropdownItem
                                                            onItemClick={() => {
                                                                setUserToDelete(user._id);
                                                                setDeleteOpen(true);
                                                                setOpenDropdownId(null);
                                                            }}
                                                            className="flex w-full font-normal text-left text-red-500 rounded-lg hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                                                        >
                                                            Delete
                                                        </DropdownItem>
                                                    </Dropdown>
                                                </div>
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
