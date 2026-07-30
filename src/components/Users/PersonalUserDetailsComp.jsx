import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getUser } from "../../api/authApi";
import ComponentCard from "../common/ComponentCard";
import toast from "react-hot-toast";
import { 
  User, Mail, Phone, Calendar, Shield, ShieldCheck, ShieldAlert, 
  Award, FileText, Globe, CheckCircle, XCircle, AlertCircle, 
  Fingerprint, Info, Check, X, ShieldQuestion, UserCheck, AlertTriangle
} from "lucide-react";

export default function PersonalUserDetailsComp() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const baseURL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                setLoading(true);
                const res = await getUser(id);
                setUser(res.data);
            } catch (error) {
                toast.error("Failed to load user details");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchUserDetails();
    }, [id]);

    const formatDate = (dateStr) => {
        if (!dateStr) return "-";
        try {
            return new Date(dateStr).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        } catch (e) {
            return dateStr;
        }
    };

    const formatDateTime = (dateStr) => {
        if (!dateStr) return "-";
        try {
            return new Date(dateStr).toLocaleString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch (e) {
            return dateStr;
        }
    };

    if (loading) {
        return (
            <div className="p-12 text-center text-gray-500 dark:text-gray-400 flex flex-col items-center justify-center gap-3">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm font-medium">Loading user details...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="p-12 text-center text-gray-500 dark:text-gray-400 flex flex-col items-center justify-center gap-2 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
                <AlertCircle className="w-10 h-10 text-gray-400" />
                <p className="text-sm font-medium">User not found.</p>
            </div>
        );
    }

    const DetailItem = ({ icon: Icon, label, value, highlight = false, dir = "ltr" }) => (
        <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-800/50">
            {Icon && <Icon className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />}
            <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</p>
                <p 
                    dir={dir} 
                    className={`text-sm font-semibold mt-0.5 ${
                        highlight 
                            ? "text-blue-600 dark:text-blue-400" 
                            : "text-gray-900 dark:text-white"
                    } ${dir === "rtl" ? "text-right font-semibold text-lg" : ""}`}
                >
                    {value !== null && value !== undefined && value !== "" ? value : "-"}
                </p>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Profile Header Hero Section */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] shadow-sm">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="w-24 h-24 rounded-full border-4 border-gray-100 dark:border-gray-800 overflow-hidden flex-shrink-0 bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 text-3xl font-bold uppercase shadow-inner">
                        {user.firstName?.charAt(0)}
                        {user.lastName?.charAt(0)}
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {user.salutation ? `${user.salutation} ` : ""}
                                {user.firstName} {user.lastName}
                            </h2>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                                user.role === 'admin' 
                                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                            }`}>
                                {user.role || "user"}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            <span className="font-semibold text-gray-400">User ID:</span> {user.userId || "-"}
                        </p>
                        
                        {/* Status Badges Row */}
                        <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-4">
                            {/* Identity Verification Status Badge */}
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                                user.identityVerificationStatus === "VERIFIED" || user.isVerified
                                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                                    : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                            }`}>
                                {user.identityVerificationStatus === "VERIFIED" || user.isVerified ? (
                                    <>
                                        <ShieldCheck className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                                        Verified
                                    </>
                                ) : (
                                    <>
                                        <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                                        {user.identityVerificationStatus || "Unverified"}
                                    </>
                                )}
                            </span>

                            {/* Account Status Badge */}
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                                !user.isDeleted
                                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                            }`}>
                                {!user.isDeleted ? (
                                    <>
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                        Active Account
                                    </>
                                ) : (
                                    <>
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                        Deleted / Suspended
                                    </>
                                )}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Redesigned Info Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* 1. Account & Profile Info */}
                <ComponentCard title="Account Details">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <DetailItem icon={User} label="Salutation" value={user.salutation} />
                        <DetailItem icon={User} label="First Name" value={user.firstName} />
                        <DetailItem icon={User} label="Last Name" value={user.lastName} />
                        <DetailItem icon={Mail} label="Email Address" value={user.email} />
                        <DetailItem 
                            icon={Phone} 
                            label="Phone Number" 
                            value={
                                user.phone 
                                    ? (user.phone.startsWith("+") || (user.phoneCode && user.phone.startsWith(user.phoneCode))
                                        ? user.phone 
                                        : `${user.phoneCode || ""} ${user.phone}`)
                                    : "-"
                            } 
                        />
                        <DetailItem icon={Calendar} label="Date of Birth" value={formatDate(user.dateOfBirth)} />
                        <DetailItem icon={Award} label="Role" value={user.role} />
                        <DetailItem 
                            icon={Shield} 
                            label="Verification Status" 
                            value={user.isVerified ? "Verified" : "Not Verified"} 
                        />
                    </div>
                </ComponentCard>

                {/* 2. Identity Verification & Provider Details */}
                <ComponentCard title="Identity & Provider Verification">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <DetailItem icon={Fingerprint} label="Identity Type" value={user.identityType} />
                        <DetailItem icon={Fingerprint} label="Identity Number" value={user.identityNumber} />
                        <DetailItem 
                            icon={ShieldCheck} 
                            label="Verification Status" 
                            value={user.identityVerificationStatus} 
                            highlight={user.identityVerificationStatus === "VERIFIED"}
                        />
                        <DetailItem icon={Info} label="Verification Method" value={user.verificationMethod} />
                        <DetailItem icon={Globe} label="Verification Provider" value={user.verificationProvider} />
                        <DetailItem icon={Globe} label="Verification Service" value={user.verificationService} />
                        <DetailItem icon={FileText} label="Verification Reference" value={user.verificationReference} />
                        <DetailItem icon={Calendar} label="Verified At" value={formatDateTime(user.verifiedAt)} />
                    </div>
                </ComponentCard>

                {/* 3. Legal Arabic Name Details */}
                <ComponentCard title="Legal Name (Arabic)">
                    <div className="space-y-4">
                        <div className="bg-gray-50 dark:bg-white/[0.02] p-4 rounded-xl border border-gray-100 dark:border-gray-800/50">
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Legal Full Name (Arabic)</p>
                            <p dir="rtl" className="text-xl font-bold text-gray-900 dark:text-white text-right">
                                {user.legalFullNameAr || "-"}
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <DetailItem label="First Name (AR)" value={user.legalFirstNameAr} dir="rtl" />
                            <DetailItem label="Father Name (AR)" value={user.legalFatherNameAr} dir="rtl" />
                            <DetailItem label="Grandfather Name (AR)" value={user.legalGrandFatherNameAr} dir="rtl" />
                            <DetailItem label="Family Name (AR)" value={user.legalFamilyNameAr} dir="rtl" />
                        </div>
                    </div>
                </ComponentCard>

                {/* 4. Legal English Name Details */}
                <ComponentCard title="Legal Name (English)">
                    <div className="space-y-4">
                        <div className="bg-gray-50 dark:bg-white/[0.02] p-4 rounded-xl border border-gray-100 dark:border-gray-800/50">
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Legal Full Name (English)</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">
                                {user.legalFullNameEn || "-"}
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <DetailItem label="First Name (EN)" value={user.legalFirstNameEn || user.legalFirstName} />
                            <DetailItem label="Middle Name" value={user.legalMiddleName} />
                            <DetailItem label="Father Name (EN)" value={user.legalFatherNameEn} />
                            <DetailItem label="Grandfather Name (EN)" value={user.legalGrandFatherNameEn} />
                            <DetailItem label="Last Name / Family Name" value={user.legalLastName || user.legalFamilyNameEn} />
                        </div>
                    </div>
                </ComponentCard>
            </div>

            {/* 5. Admin Verification & Documents */}
            <ComponentCard title="Admin Verification & Identity Documents">
                <div className="space-y-6">
                    {/* Admin verification details banner if verified */}
                    {(user.adminVerifiedBy || user.adminVerifiedAt || user.adminRejectReason) ? (
                        <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                            user.adminRejectReason 
                                ? "bg-red-50/50 border-red-200 dark:bg-red-950/20 dark:border-red-900/50 text-red-800 dark:text-red-300"
                                : "bg-green-50/50 border-green-200 dark:bg-green-950/20 dark:border-green-900/50 text-green-800 dark:text-green-300"
                        }`}>
                            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm">
                                    {user.adminRejectReason ? "Admin Rejected Verification" : "Admin Verified Status"}
                                </h4>
                                <div className="mt-2 text-xs space-y-1 opacity-90">
                                    {user.adminVerifiedBy && <p><span className="font-semibold">Verified By:</span> {user.adminVerifiedBy}</p>}
                                    {user.adminVerifiedAt && <p><span className="font-semibold">Verified At:</span> {formatDateTime(user.adminVerifiedAt)}</p>}
                                    {user.adminRejectReason && <p><span className="font-semibold">Reason:</span> {user.adminRejectReason}</p>}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/30 dark:border-gray-800 dark:bg-white/[0.01] flex items-center gap-3 text-gray-500 dark:text-gray-400">
                            <Info className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            <p className="text-sm">No admin verification actions have been taken on this user account yet.</p>
                        </div>
                    )}

                    {/* Identity Documents List */}
                    <div>
                        <h4 className="text-sm font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-400" />
                            Uploaded Identity Documents ({user.identityDocuments?.length || 0})
                        </h4>
                        
                        {user.identityDocuments && user.identityDocuments.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {user.identityDocuments.map((doc, idx) => (
                                    <div key={idx} className="border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex flex-col justify-between hover:shadow-sm transition-shadow bg-white dark:bg-white/[0.01]">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs text-gray-400">Document #{idx + 1}</p>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                    {doc.name || `identity_document_${idx + 1}`}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex items-center justify-end">
                                            <a 
                                                href={doc.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                                            >
                                                View Document <Globe className="w-3 h-3" />
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="border border-dashed border-gray-200 dark:border-gray-800 rounded-xl p-6 text-center text-gray-400 dark:text-gray-500 text-sm">
                                No identity documents uploaded.
                            </div>
                        )}
                    </div>
                </div>
            </ComponentCard>
        </div>
    );
}
