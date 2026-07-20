import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import ComponentCard from "../common/ComponentCard";
import { getIdentityDetails, approveIdentity, rejectIdentity } from "../../api/identityApi";
import toast from "react-hot-toast";
import { ArrowLeftIcon } from "lucide-react";

export default function IdentityDetailsComp() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [approveModalOpen, setApproveModalOpen] = useState(false);
    const [rejectModal, setRejectModal] = useState({ open: false, reason: "" });

    const baseURL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);
                const res = await getIdentityDetails(id);
                setDetails(res.data);
            } catch (error) {
                toast.error(error.message || "Failed to fetch identity details");
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchDetails();
    }, [id]);

    const handleApprove = async () => {
        try {
            setLoading(true);
            await approveIdentity(id);
            toast.success("Identity approved successfully");
            setApproveModalOpen(false);
            navigate("/identity-manage");
        } catch (error) {
            toast.error(error.message || "Failed to approve identity");
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async () => {
        if (!rejectModal.reason.trim()) {
            toast.error("Rejection reason is required");
            return;
        }
        try {
            setLoading(true);
            await rejectIdentity(id, rejectModal.reason);
            toast.success("Identity rejected successfully");
            setRejectModal({ open: false, reason: "" });
            navigate("/identity-manage");
        } catch (error) {
            toast.error(error.message || "Failed to reject identity");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-6 text-center text-gray-500">Loading...</div>;
    }

    if (!details) {
        return <div className="p-6 text-center text-gray-500">No details found.</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate("/identity-manage")}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                    <ArrowLeftIcon size={20} />
                    <span>Back to Verifications</span>
                </button>
                {details.identityVerificationStatus === "PENDING" && (
                    <div className="flex gap-3">
                        <button
                            onClick={() => setRejectModal({ open: true, reason: "" })}
                            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 transition-colors"
                        >
                            Reject
                        </button>
                        <button
                            onClick={() => setApproveModalOpen(true)}
                            className="px-4 py-2 bg-brand-500 text-white rounded-lg font-medium hover:bg-brand-600 transition-colors shadow-sm shadow-brand-500/30"
                        >
                            Approve
                        </button>
                    </div>
                )}
            </div>

            <ComponentCard title="Verification Details">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">User Information</h3>
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl space-y-3">
                            <div className="grid grid-cols-2 gap-2">
                                <span className="text-gray-500 text-sm">Full Name:</span>
                                <span className="font-medium text-gray-900 dark:text-white capitalize">
                                    {details.salutation} {details.firstName} {details.lastName}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <span className="text-gray-500 text-sm">Email:</span>
                                <span className="font-medium text-gray-900 dark:text-white">{details.email}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <span className="text-gray-500 text-sm">Phone:</span>
                                <span className="font-medium text-gray-900 dark:text-white">{details.phone || "-"}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <span className="text-gray-500 text-sm">Role:</span>
                                <span className="font-medium text-gray-900 dark:text-white capitalize">{details.role}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <span className="text-gray-500 text-sm">Date of Birth:</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {details.dateOfBirth ? new Date(details.dateOfBirth).toLocaleDateString() : "-"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Identity Details</h3>
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl space-y-3">
                            <div className="grid grid-cols-2 gap-2">
                                <span className="text-gray-500 text-sm">Identity Type:</span>
                                <span className="font-medium text-gray-900 dark:text-white">{details.identityType}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <span className="text-gray-500 text-sm">Identity Number:</span>
                                <span className="font-medium text-gray-900 dark:text-white">{details.identityNumber || "-"}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <span className="text-gray-500 text-sm">Verification Status:</span>
                                <span className={`font-medium ${details.identityVerificationStatus === "PENDING" ? "text-amber-600" : (details.identityVerificationStatus === "APPROVED" || details.identityVerificationStatus === "VERIFIED") ? "text-green-600" : "text-red-600"}`}>
                                    {details.identityVerificationStatus}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <span className="text-gray-500 text-sm">Verification Method:</span>
                                <span className="font-medium text-gray-900 dark:text-white">{details.verificationMethod || "-"}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <span className="text-gray-500 text-sm">Verification Provider:</span>
                                <span className="font-medium text-gray-900 dark:text-white">{details.verificationProvider || "-"}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 px-4 pb-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-3">Uploaded Documents</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {details.identityDocuments && details.identityDocuments.length > 0 ? (
                            details.identityDocuments.map((doc, idx) => (
                                <div key={doc._id || idx} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex flex-col gap-3">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-gray-800 dark:text-white">{doc.documentType}</span>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${doc.status === "PENDING" ? "bg-amber-100 text-amber-700" : doc.status === "APPROVED" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                            {doc.status}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-500">File: {doc.originalFileName || "-"}</div>
                                    <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center">
                                        {doc.mimeType === 'application/pdf' ? (
                                            <iframe
                                                src={`${baseURL.replace(/\/$/, "")}/uploads/identityDocuments/${doc.documentUrl}`}
                                                className="w-full h-full border-0"
                                                title={doc.documentType}
                                            />
                                        ) : doc.mimeType && doc.mimeType.startsWith('image/') ? (
                                            <a href={`${baseURL.replace(/\/$/, "")}/uploads/identityDocuments/${doc.documentUrl}`} target="_blank" rel="noreferrer" className="w-full h-full flex items-center justify-center">
                                                <img 
                                                    src={`${baseURL.replace(/\/$/, "")}/uploads/identityDocuments/${doc.documentUrl}`} 
                                                    alt={doc.documentType} 
                                                    className="w-full h-full object-contain"
                                                />
                                            </a>
                                        ) : (
                                            <a 
                                                href={`${baseURL.replace(/\/$/, "")}/uploads/identityDocuments/${doc.documentUrl}`} 
                                                target="_blank" 
                                                rel="noreferrer"
                                                className="text-brand-500 hover:underline"
                                            >
                                                View Document
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-2 text-center py-4 text-gray-500 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl">
                                No documents uploaded
                            </div>
                        )}
                    </div>
                </div>
            </ComponentCard>

            {/* Approve Modal */}
            {approveModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
                    <div className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-2xl p-6 relative shadow-2xl border border-gray-100 dark:border-gray-800 animate-fadeIn">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Approve Identity</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                            Are you sure you want to approve this identity verification?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setApproveModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">
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
                            <button onClick={() => setRejectModal({ open: false, reason: "" })} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleReject} className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors">
                                Reject Identity
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
