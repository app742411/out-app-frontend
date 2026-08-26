import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { getServiceUserDetails, approveRejectServiceUser } from "../../api/authApi";
import ComponentCard from "../common/ComponentCard";
import toast from "react-hot-toast";
import VendorDocumentViewer from "./VendorDocumentViewer";
import Button from "../ui/button/Button";
import {
    User,
    Mail,
    Phone,
    ShieldCheck,
    ShieldAlert,
    CheckCircle2,
    Clock,
    XCircle,
    Copy,
    Check,
    ExternalLink,
    Briefcase,
    FileText,
    MapPin,
    AlertCircle,
    UserCheck,
} from "lucide-react";

export default function VendorPersonalDetailsComp() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [vendor, setVendor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [imgError, setImgError] = useState(false);
    const [copiedUserId, setCopiedUserId] = useState(false);

    const baseURL = import.meta.env.VITE_API_URL || "";

    // Reject Modal States
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState("");

    const fetchVendorDetails = async () => {
        try {
            setLoading(true);
            setImgError(false);
            const res = await getServiceUserDetails(id);
            setVendor(res.data);
        } catch (error) {
            toast.error("Failed to load vendor details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchVendorDetails();
    }, [id]);

    const handleCopyUserId = (text) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopiedUserId(true);
        toast.success("User ID copied to clipboard");
        setTimeout(() => setCopiedUserId(false), 2000);
    };

    const handleApprove = async () => {
        try {
            await approveRejectServiceUser(id, { status: "approved" });
            toast.success("Vendor approved successfully");
            fetchVendorDetails();
        } catch (error) {
            toast.error(error.message || "Failed to approve vendor");
        }
    };

    const handleRejectClick = () => {
        setRejectReason("");
        setRejectModalOpen(true);
    };

    const handleRejectSubmit = async () => {
        if (!rejectReason.trim()) {
            toast.error("Please provide a reason for rejection");
            return;
        }
        try {
            await approveRejectServiceUser(id, { status: "rejected", rejectReason });
            toast.success("Vendor rejected successfully");
            setRejectModalOpen(false);
            setRejectReason("");
            fetchVendorDetails();
        } catch (error) {
            toast.error(error.message || "Failed to reject vendor");
        }
    };

    if (loading) {
        return (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400 flex flex-col items-center justify-center gap-3 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs font-medium">Loading vendor details...</p>
            </div>
        );
    }

    if (!vendor) {
        return (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400 flex flex-col items-center justify-center gap-2 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-900">
                <AlertCircle className="w-8 h-8 text-gray-400" />
                <p className="text-sm font-medium">Vendor not found.</p>
            </div>
        );
    }

    const fullName = `${vendor.salutation ? `${vendor.salutation} ` : ""}${vendor.firstName || ""} ${vendor.lastName || ""}`.trim() || "Unnamed Vendor";

    const profileImageUrl = vendor.profile
        ? vendor.profile.startsWith("http")
            ? vendor.profile
            : `${baseURL.replace(/\/$/, "")}/uploads/users/${vendor.profile.replace(/^\//, "")}`
        : null;

    const approvalStatus = vendor.isApproved || vendor.status || "pending";

    return (
        <div className="space-y-4">
            {/* Main Vendor Profile Card */}
            <ComponentCard title="Vendor Profile">
                <div className="flex flex-col gap-5">
                    {/* Header: Avatar, Name, UserID & Role */}
                    <div className="flex items-start gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
                        <div className="w-18 h-18 sm:w-20 sm:h-20 flex-shrink-0 rounded-2xl border-2 border-brand-500/20 overflow-hidden shadow-sm bg-gradient-to-br from-brand-50 to-brand-100/50 dark:from-brand-950/40 dark:to-gray-800 flex items-center justify-center text-brand-600 dark:text-brand-400 font-bold text-2xl uppercase">
                            {profileImageUrl && !imgError ? (
                                <img
                                    src={profileImageUrl}
                                    alt={fullName}
                                    className="w-full h-full object-cover"
                                    onError={() => setImgError(true)}
                                />
                            ) : (
                                <span>
                                    {vendor.firstName?.charAt(0) || ""}
                                    {vendor.lastName?.charAt(0) || ""}
                                </span>
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white capitalize truncate" title={fullName}>
                                {fullName}
                            </h2>

                            <div className="flex items-center gap-2 mt-1">
                                <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400 border border-brand-100 dark:border-brand-500/20">
                                    {vendor.role ? vendor.role.replace(/_/g, " ") : "Service User"}
                                </span>
                            </div>

                            {vendor.userId && (
                                <div className="flex items-center gap-1.5 mt-2">
                                    <span className="text-[11px] font-mono font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded border border-gray-200/60 dark:border-gray-800">
                                        ID: {vendor.userId}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => handleCopyUserId(vendor.userId)}
                                        className="text-gray-400 hover:text-brand-500 p-1 rounded transition-colors"
                                        title="Copy User ID"
                                    >
                                        {copiedUserId ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Badges: Status, Verification, Approval */}
                    <div className="flex flex-wrap gap-2">
                        {/* Account Status Badge */}
                        <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                                vendor.isActive
                                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40"
                                    : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800/40"
                            }`}
                        >
                            <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                    vendor.isActive ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                                }`}
                            ></span>
                            {vendor.isActive ? "Active Account" : "Inactive Account"}
                        </span>

                        {/* Verification Status Badge */}
                        <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                                vendor.isVerified
                                    ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40"
                                    : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40"
                            }`}
                        >
                            {vendor.isVerified ? (
                                <>
                                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                    Verified Provider
                                </>
                            ) : (
                                <>
                                    <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                                    Unverified
                                </>
                            )}
                        </span>

                        {/* Approval Status Badge */}
                        <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold capitalize ${
                                approvalStatus === "approved"
                                    ? "bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300 border border-teal-200 dark:border-teal-800/40"
                                    : approvalStatus === "rejected"
                                    ? "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800/40"
                                    : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40"
                            }`}
                        >
                            {approvalStatus === "approved" ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                            ) : approvalStatus === "rejected" ? (
                                <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                            ) : (
                                <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                            )}
                            Approval: {approvalStatus}
                        </span>

                        {vendor.isDeleted && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300">
                                Deleted
                            </span>
                        )}
                    </div>

                    {/* Contact Details Grid */}
                    <div className="space-y-3">
                        <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                            Contact Information
                        </p>

                        <div className="space-y-2">
                            {/* Phone */}
                            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800/50">
                                <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center text-brand-500 flex-shrink-0">
                                    <Phone size={15} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[10px] font-medium text-gray-400 uppercase">Phone Number</p>
                                    <a
                                        href={vendor.phone ? `tel:${vendor.phone}` : undefined}
                                        className="text-xs font-semibold text-gray-800 dark:text-gray-200 hover:text-brand-500 transition-colors truncate block"
                                    >
                                        {vendor.phone || (vendor.phoneCode ? `${vendor.phoneCode}` : "-")}
                                    </a>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800/50">
                                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500 flex-shrink-0">
                                    <Mail size={15} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[10px] font-medium text-gray-400 uppercase">Email Address</p>
                                    {vendor.email ? (
                                        <a
                                            href={`mailto:${vendor.email}`}
                                            className="text-xs font-semibold text-gray-800 dark:text-gray-200 hover:text-blue-500 transition-colors truncate block"
                                        >
                                            {vendor.email}
                                        </a>
                                    ) : (
                                        <p className="text-xs text-gray-400 italic">No email address provided</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-2">
                        {vendor.userModelId && (
                            <Button
                                size="sm"
                                className="w-full bg-brand-500 hover:bg-brand-600 text-white rounded-xl flex items-center justify-center gap-2 shadow-sm font-medium"
                                onClick={() => navigate(`/user-details/${vendor.userModelId}`)}
                            >
                                <UserCheck size={16} />
                                View User Verification Info
                            </Button>
                        )}

                        {approvalStatus === "pending" && (
                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                    size="sm"
                                    className="bg-emerald-500 text-white hover:bg-emerald-600 rounded-xl"
                                    onClick={handleApprove}
                                >
                                    Approve
                                </Button>
                                <Button
                                    size="sm"
                                    className="bg-rose-500 text-white hover:bg-rose-600 rounded-xl"
                                    onClick={handleRejectClick}
                                >
                                    Reject
                                </Button>
                            </div>
                        )}

                        {approvalStatus === "approved" && (
                            <Button
                                size="sm"
                                variant="outline"
                                className="text-rose-500 border-rose-200 hover:bg-rose-50 dark:border-rose-500/20 dark:hover:bg-rose-500/10 rounded-xl"
                                onClick={handleRejectClick}
                            >
                                Revoke Approval
                            </Button>
                        )}

                        {approvalStatus === "rejected" && (
                            <Button
                                size="sm"
                                className="bg-emerald-500 text-white hover:bg-emerald-600 rounded-xl"
                                onClick={handleApprove}
                            >
                                Approve Again
                            </Button>
                        )}
                    </div>
                </div>
            </ComponentCard>

            {/* Service Offerings & Bio Card */}
            {(vendor.offeringDetails || vendor.description) && (
                <ComponentCard title="Offerings & Description">
                    <div className="space-y-4 text-xs">
                        {vendor.offeringDetails && (
                            <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800">
                                <div className="flex items-center gap-2 mb-1.5 text-brand-600 dark:text-brand-400">
                                    <Briefcase size={14} />
                                    <span className="font-bold text-[11px] uppercase tracking-wider">Offering Details</span>
                                </div>
                                <p className="text-gray-700 dark:text-gray-200 leading-relaxed break-words whitespace-pre-line font-medium">
                                    {vendor.offeringDetails}
                                </p>
                            </div>
                        )}

                        {vendor.description && (
                            <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800">
                                <div className="flex items-center gap-2 mb-1.5 text-gray-500 dark:text-gray-400">
                                    <FileText size={14} />
                                    <span className="font-bold text-[11px] uppercase tracking-wider">About / Description</span>
                                </div>
                                <p className="text-gray-700 dark:text-gray-200 leading-relaxed break-words whitespace-pre-line">
                                    {vendor.description}
                                </p>
                            </div>
                        )}
                    </div>
                </ComponentCard>
            )}

            {/* Location Information (if present) */}
            {vendor.address && (
                <ComponentCard title="Location">
                    <div className="text-xs space-y-2.5">
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                            <MapPin size={14} className="text-brand-500" />
                            <span className="font-bold text-[11px] uppercase tracking-wider">Registered Address</span>
                        </div>
                        {vendor.address.city && (
                            <div className="flex justify-between py-1 border-b border-gray-50 dark:border-gray-800">
                                <span className="text-gray-400">City</span>
                                <span className="font-semibold text-gray-700 dark:text-gray-200 capitalize">{vendor.address.city}</span>
                            </div>
                        )}
                        {vendor.address.state && (
                            <div className="flex justify-between py-1 border-b border-gray-50 dark:border-gray-800">
                                <span className="text-gray-400">State</span>
                                <span className="font-semibold text-gray-700 dark:text-gray-200 capitalize">{vendor.address.state}</span>
                            </div>
                        )}
                        {vendor.address.country && (
                            <div className="flex justify-between py-1 border-b border-gray-50 dark:border-gray-800">
                                <span className="text-gray-400">Country</span>
                                <span className="font-semibold text-gray-700 dark:text-gray-200 capitalize">{vendor.address.country}</span>
                            </div>
                        )}
                        {vendor.address.street && (
                            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-2 italic break-words">
                                {vendor.address.street}
                            </p>
                        )}
                    </div>
                </ComponentCard>
            )}

            {/* Documents Section (if present) */}
            {(vendor.docs || vendor.documents) && (
                <VendorDocumentViewer
                    documentName={vendor.docs || vendor.documents}
                    documentUrl={`${baseURL.replace(/\/$/, "")}/uploads/documents/${vendor.docs || vendor.documents}`}
                />
            )}

            {/* Reject Modal */}
            {rejectModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-gray-100 dark:border-gray-800">
                        <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">Reject Vendor</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Provide a reason for rejection.</p>
                        <textarea
                            className="w-full border border-gray-200 dark:border-gray-800 rounded-xl p-3 mb-4 outline-none focus:border-brand-500 bg-gray-50 dark:bg-white/5 text-sm"
                            placeholder="Reason..."
                            rows={3}
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                onClick={() => setRejectModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <Button className="bg-rose-500 text-white rounded-xl hover:bg-rose-600" onClick={handleRejectSubmit}>
                                Confirm Rejection
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
