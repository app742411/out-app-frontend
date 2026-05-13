import React, { useEffect, useState } from "react";
import { useParams } from "react-router"; // note: using react-router as requested in the app
import { getServiceUserDetails, approveRejectServiceUser } from "../../api/authApi";
import ComponentCard from "../common/ComponentCard";
import toast from "react-hot-toast";
import VendorDocumentViewer from "./VendorDocumentViewer";
import Button from "../ui/button/Button";
export default function VendorPersonalDetailsComp() {
    const { id } = useParams();
    const [vendor, setVendor] = useState(null);
    const [loading, setLoading] = useState(true);

    const baseURL = import.meta.env.VITE_API_URL;


    // Reject Modal States
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState("");

    const fetchVendorDetails = async () => {
        try {
            setLoading(true);
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
        return <div className="p-6 text-center text-gray-500">Loading vendor details...</div>;
    }

    if (!vendor) {
        return <div className="p-6 text-center text-gray-500">Vendor not found.</div>;
    }

    return (
        <div className="space-y-4">
            <ComponentCard title="Vendor Profile">
                <div className="flex flex-col gap-6">
                    {/* Profile & Identity */}
                    <div className="flex items-center gap-4 pb-4 border-b border-gray-50 dark:border-gray-800">
                        <div className="w-20 h-20 flex-shrink-0 rounded-2xl border-2 border-brand-500/10 dark:border-brand-500/20 overflow-hidden shadow-sm bg-gray-50 dark:bg-white/5">
                            {vendor.profile ? (
                                <img
                                    src={`${baseURL}/uploads/users/${vendor.profile}`}
                                    alt={vendor.firstName}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = "/images/user/user-01.jpg";
                                    }}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-brand-500 text-2xl font-black uppercase">
                                    {vendor.firstName?.charAt(0)}
                                    {vendor.lastName?.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white capitalize">
                                {vendor.salutation ? `${vendor.salutation} ` : ""}
                                {vendor.firstName} {vendor.lastName}
                            </h2>
                            <p className="text-xs text-brand-500 font-bold uppercase tracking-wider">{vendor.role?.replace("_", " ")}</p>
                        </div>
                    </div>

                    {/* Contact details */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                            <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-transparent hover:border-brand-500/10 transition-all">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Contact Details</p>
                                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 truncate">{vendor.email}</p>
                                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mt-1">
                                    {vendor.phone || "-"}
                                </p>
                            </div>

                            <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-transparent hover:border-brand-500/10 transition-all">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Account Status</p>
                                <div className="flex items-center gap-2">
                                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${vendor.isActive ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
                                        {vendor.isActive ? "Active" : "Inactive"}
                                    </span>
                                    {vendor.status && (
                                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${vendor.status === 'approved' ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400' : 'bg-yellow-50 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400'}`}>
                                            {vendor.status}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-2 border-t border-gray-50 dark:border-gray-800 flex flex-col gap-2">
                        {vendor.isApproved === "pending" && (
                            <div className="grid grid-cols-2 gap-2">
                                <Button size="sm" className="bg-green-500 text-white hover:bg-green-600 rounded-xl" onClick={handleApprove}>
                                    Approve
                                </Button>
                                <Button size="sm" className="bg-red-500 text-white hover:bg-red-600 rounded-xl" onClick={handleRejectClick}>
                                    Reject
                                </Button>
                            </div>
                        )}
                        {vendor.isApproved === "approved" && (
                            <Button size="sm" variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 dark:border-red-500/20 dark:hover:bg-red-500/10 rounded-xl" onClick={handleRejectClick}>
                                Revoke Approval
                            </Button>
                        )}
                        {vendor.isApproved === "rejected" && (
                            <Button size="sm" className="bg-green-500 text-white hover:bg-green-600 rounded-xl" onClick={handleApprove}>
                                Approve Again
                            </Button>
                        )}
                    </div>
                </div>
            </ComponentCard>

            {vendor.address && (
                <ComponentCard title="Location">
                    <div className="text-sm space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-400">City</span>
                            <span className="font-semibold text-gray-700 dark:text-gray-200 capitalize">{vendor.address.city}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">State</span>
                            <span className="font-semibold text-gray-700 dark:text-gray-200 capitalize">{vendor.address.state}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Country</span>
                            <span className="font-semibold text-gray-700 dark:text-gray-200 capitalize">{vendor.address.country}</span>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-2 italic">{vendor.address.street}</p>
                    </div>
                </ComponentCard>
            )}

            {vendor.docs && (
                <VendorDocumentViewer
                    documentName={vendor.docs}
                    documentUrl={`${baseURL}/uploads/documents/${vendor.docs}`}
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
                            <button className="px-4 py-2 text-sm font-bold text-gray-500" onClick={() => setRejectModalOpen(false)}>Cancel</button>
                            <Button className="bg-red-500 text-white rounded-xl" onClick={handleRejectSubmit}>Confirm</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
