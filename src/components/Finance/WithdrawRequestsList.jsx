import React, { useState, useEffect } from "react";
import { 
    getWithdrawRequests, 
    updateWithdrawStatus 
} from "../../api/authApi";
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHeader, 
    TableRow 
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Button from "../ui/button/Button";
import toast from "react-hot-toast";
import { 
    Calendar,
    User,
    CreditCard,
    CheckCircle,
    XCircle,
    Info,
    Search
} from "lucide-react";

export default function WithdrawRequestsList() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [rejectReason, setRejectReason] = useState("");
    const [updatingStatus, setUpdatingStatus] = useState(false);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const res = await getWithdrawRequests();
            setRequests(res.data || []);
        } catch (error) {
            toast.error("Failed to fetch withdraw requests");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleAction = async (id, status, reason = "") => {
        try {
            setUpdatingStatus(true);
            const payload = { status };
            if (reason) payload.rejectReason = reason;

            await updateWithdrawStatus(id, payload);
            toast.success(`Request ${status} successfully`);
            setShowRejectModal(false);
            setRejectReason("");
            fetchRequests();
        } catch (error) {
            toast.error(error.message || `Failed to ${status} request`);
        } finally {
            setUpdatingStatus(false);
        }
    };

    const filteredRequests = requests.filter(req => 
        req.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.bankDetails?.bankName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-white/[0.03] p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text"
                        placeholder="Search by vendor name, email or bank..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-transparent focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <select className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-transparent text-sm outline-none">
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {/* List Table */}
            <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] shadow-sm overflow-hidden">
                <div className="max-w-full overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableCell isHeader className="py-4 px-5">Vendor Details</TableCell>
                                <TableCell isHeader className="py-4 px-5 text-right">Amount (SAR)</TableCell>
                                <TableCell isHeader className="py-4 px-5">Bank Details</TableCell>
                                <TableCell isHeader className="py-4 px-5">Requested Date</TableCell>
                                <TableCell isHeader className="py-4 px-5 text-center">Status</TableCell>
                                <TableCell isHeader className="py-4 px-5 text-right">Actions</TableCell>
                            </TableRow>
                        </TableHeader>

                        <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {loading ? (
                                [1, 2, 3].map(i => (
                                    <TableRow key={i}>
                                        <TableCell colSpan={6} className="py-8"><div className="h-4 bg-gray-100 dark:bg-gray-800 animate-pulse rounded w-full"></div></TableCell>
                                    </TableRow>
                                ))
                            ) : filteredRequests.length > 0 ? (
                                filteredRequests.map((req) => (
                                    <TableRow key={req._id}>
                                        <TableCell className="py-4 px-5">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center text-brand-600 font-bold">
                                                    {req.user?.firstName?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-800 dark:text-white/90 text-sm">
                                                        {req.user?.firstName} {req.user?.lastName}
                                                    </p>
                                                    <p className="text-xs text-gray-500">{req.user?.email}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 px-5 text-right font-bold text-gray-900 dark:text-white">
                                            {req.amount.toLocaleString()}
                                        </TableCell>
                                        <TableCell className="py-4 px-5">
                                            <div className="text-xs space-y-1">
                                                <p className="font-medium text-gray-700 dark:text-gray-300">{req.bankDetails?.bankName}</p>
                                                <p className="text-gray-500">A/C: {req.bankDetails?.accountNumber}</p>
                                                <p className="text-gray-500">IFSC: {req.bankDetails?.ifscCode}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 px-5 text-sm text-gray-500">
                                            {new Date(req.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="py-4 px-5 text-center">
                                            <Badge size="xs" color={
                                                req.status === 'approved' ? 'success' : 
                                                req.status === 'pending' ? 'warning' : 'error'
                                            }>
                                                {req.status}
                                            </Badge>
                                            {req.status === 'rejected' && req.rejectReason && (
                                                <div className="mt-1 flex justify-center">
                                                    <div className="group relative">
                                                        <Info size={14} className="text-gray-400 cursor-help" />
                                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 bg-gray-900 text-white text-[10px] rounded shadow-xl z-10">
                                                            Reason: {req.rejectReason}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="py-4 px-5 text-right">
                                            {req.status === 'pending' && (
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button 
                                                        size="sm" 
                                                        className="bg-green-500 hover:bg-green-600 h-8 px-3"
                                                        onClick={() => handleAction(req._id, 'approved')}
                                                    >
                                                        <CheckCircle size={14} className="mr-1" /> Approve
                                                    </Button>
                                                    <Button 
                                                        size="sm" 
                                                        variant="outline"
                                                        className="text-red-500 border-red-500 hover:bg-red-50 h-8 px-3"
                                                        onClick={() => {
                                                            setSelectedRequest(req);
                                                            setShowRejectModal(true);
                                                        }}
                                                    >
                                                        <XCircle size={14} className="mr-1" /> Reject
                                                    </Button>
                                                </div>
                                            )}
                                            {req.status !== 'pending' && (
                                                <span className="text-xs text-gray-400 italic">No actions available</span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="py-10 text-center text-gray-500">
                                        No withdrawal requests found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 z-99999 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md p-6 shadow-2xl border border-gray-100 dark:border-gray-800 animate-fade-in-up">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <XCircle className="text-red-500" /> Reject Request
                            </h3>
                            <button onClick={() => setShowRejectModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <XCircle size={20} />
                            </button>
                        </div>
                        
                        <p className="text-sm text-gray-500 mb-6">
                            You are about to reject the withdrawal request for <span className="font-bold text-gray-700 dark:text-gray-300">{selectedRequest?.user?.firstName}</span> of <span className="font-bold text-brand-500">SAR {selectedRequest?.amount}</span>. Please provide a reason.
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rejection Reason</label>
                                <textarea 
                                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-white/[0.02] focus:ring-2 focus:ring-red-500/20 outline-none transition-all text-sm min-h-[100px]"
                                    placeholder="e.g. Insufficient wallet balance, Invalid bank details..."
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                ></textarea>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Button 
                                    className="flex-1 h-11" 
                                    variant="outline"
                                    onClick={() => setShowRejectModal(false)}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    className="flex-1 h-11 bg-red-500 hover:bg-red-600"
                                    onClick={() => handleAction(selectedRequest?._id, 'rejected', rejectReason)}
                                    disabled={!rejectReason.trim() || updatingStatus}
                                >
                                    {updatingStatus ? "Processing..." : "Confirm Reject"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
