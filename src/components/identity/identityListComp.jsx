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
import { getPendingIdentities, approveIdentity, rejectIdentity } from "../../api/identityApi";
import toast from "react-hot-toast";
import Pagination from "../common/Pagination";
import { EyeIcon, CheckLineIcon, CloseLineIcon } from "../../icons";

const ITEMS_PER_PAGE = 10;

export default function IdentityListComp() {
    const [identities, setIdentities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [approveModal, setApproveModal] = useState({ open: false, userId: null });
    const [rejectModal, setRejectModal] = useState({ open: false, userId: null, reason: "" });
    const navigate = useNavigate();

    const fetchIdentities = async (page = 1) => {
        try {
            setLoading(true);
            const res = await getPendingIdentities({
                page,
                limit: ITEMS_PER_PAGE,
            });
            setIdentities(res.data || []);
            setCurrentPage(page);
            setTotalPages(res.totalPages || Math.ceil((res.total || 0) / ITEMS_PER_PAGE) || 1);
        } catch (error) {
            toast.error(error.message || "Failed to load identity verifications");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIdentities(1);
    }, []);

    const handleApprove = async () => {
        if (!approveModal.userId) return;
        try {
            setLoading(true);
            await approveIdentity(approveModal.userId);
            toast.success("Identity approved successfully");
            setApproveModal({ open: false, userId: null });
            fetchIdentities(currentPage);
        } catch (error) {
            toast.error(error.message || "Failed to approve identity");
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async () => {
        if (!rejectModal.userId) return;
        if (!rejectModal.reason.trim()) {
            toast.error("Rejection reason is required");
            return;
        }
        try {
            setLoading(true);
            await rejectIdentity(rejectModal.userId, rejectModal.reason);
            toast.success("Identity rejected successfully");
            setRejectModal({ open: false, userId: null, reason: "" });
            fetchIdentities(currentPage);
        } catch (error) {
            toast.error(error.message || "Failed to reject identity");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ComponentCard title="Identity Verifications" className="">
            <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] overflow-visible mt-4">
                {loading ? (
                    <div className="text-center p-6 text-gray-500">Loading...</div>
                ) : (
                    <Table>
                        <TableHeader className="text-left">
                            <TableRow>
                                <TableCell isHeader className="px-5 py-3">S.No.</TableCell>
                                <TableCell isHeader className="px-5 py-3">Name</TableCell>
                                <TableCell isHeader className="px-5 py-3">Email</TableCell>
                                <TableCell isHeader className="px-5 py-3">Phone</TableCell>
                                <TableCell isHeader className="px-5 py-3">Type</TableCell>
                                <TableCell isHeader className="px-5 py-3">Status</TableCell>
                                <TableCell isHeader className="px-5 py-3 text-right">Action</TableCell>
                            </TableRow>
                        </TableHeader>

                        <TableBody className="divide-y divide-dashed divide-gray-200 dark:divide-white/5">
                            {identities.length > 0 ? (
                                identities.map((item, index) => (
                                    <TableRow key={item._id}>
                                        <TableCell className="px-5 py-3">
                                            {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                                        </TableCell>
                                        <TableCell className="px-5 py-3 font-semibold text-gray-800 dark:text-white capitalize">
                                            {item.firstName} {item.lastName}
                                        </TableCell>
                                        <TableCell className="px-5 py-3 text-gray-500">
                                            {item.email}
                                        </TableCell>
                                        <TableCell className="px-5 py-3">
                                            {item.phone || "-"}
                                        </TableCell>
                                        <TableCell className="px-5 py-3">
                                            {item.identityType}
                                        </TableCell>
                                        <TableCell className="px-5 py-3 capitalize">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.identityVerificationStatus === "PENDING" ? "bg-amber-100 text-amber-700" : (item.identityVerificationStatus === "APPROVED" || item.identityVerificationStatus === "VERIFIED") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                                {item.identityVerificationStatus || "PENDING"}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-5 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => navigate(`/identity-details/${item._id}`)}
                                                    className="inline-flex items-center justify-center p-2 rounded-lg transition-all duration-155 text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20 cursor-pointer"
                                                    title="View Details"
                                                >
                                                    <EyeIcon className="size-5 fill-current" />
                                                </button>
                                                {item.identityVerificationStatus === "PENDING" && (
                                                    <>
                                                        <button
                                                            onClick={() => setApproveModal({ open: true, userId: item._id })}
                                                            className="inline-flex items-center justify-center p-2 rounded-lg transition-all duration-155 text-green-600 bg-green-50 hover:bg-green-100 dark:bg-green-500/10 dark:text-green-400 dark:hover:bg-green-500/20 cursor-pointer"
                                                            title="Approve"
                                                        >
                                                            <CheckLineIcon className="size-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => setRejectModal({ open: true, userId: item._id, reason: "" })}
                                                            className="inline-flex items-center justify-center p-2 rounded-lg transition-all duration-155 text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 cursor-pointer"
                                                            title="Reject"
                                                        >
                                                            <CloseLineIcon className="size-5" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                                        No pending verifications found
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
                        fetchIdentities(newPage);
                    }}
                />
            )}

            {/* Approve Modal */}
            {approveModal.open && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
                    <div className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-2xl p-6 relative shadow-2xl border border-gray-100 dark:border-gray-800 animate-fadeIn">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Approve Identity</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                            Are you sure you want to approve this identity verification?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setApproveModal({ open: false, userId: null })} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleApprove} className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors">
                                Yes, Approve
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reject Modal */}
            {rejectModal.open && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
                    <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl p-6 relative shadow-2xl border border-gray-100 dark:border-gray-800 animate-fadeIn">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Reject Identity</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                            Please provide a reason for rejecting this identity verification.
                        </p>
                        <textarea
                            className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-800 dark:text-white mb-6 resize-none h-24"
                            placeholder="Enter rejection reason here..."
                            value={rejectModal.reason}
                            onChange={(e) => setRejectModal(prev => ({ ...prev, reason: e.target.value }))}
                        />
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setRejectModal({ open: false, userId: null, reason: "" })} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleReject} className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors">
                                Reject Identity
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </ComponentCard>
    );
}
