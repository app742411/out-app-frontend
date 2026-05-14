import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import ComponentCard from "../common/ComponentCard";
import { getPropertyDetailsForAdmin, updatePropertyApproval, toggleRecommendedProperty } from "../../api/authApi";
import apiClient from "../../api/apiClient";
import { formatCurrency } from "../../utils/currency";
import Button from "../ui/button/Button";
import toast from "react-hot-toast";
import UserPropertiesList from "../Users/UserPropertiesList";
import PropertyBookingListComp from "../Bookings/PropertyBookingListComp";
import { useLocation } from "react-router";
import ReviewListComp from "../Reviews/ReviewListComp";
import { Mail, Smartphone, Star } from "lucide-react";
import { useNavigate } from "react-router";

export default function ServicePropertyDetailsComp() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showProperties, setShowProperties] = useState(false);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const activeTab = queryParams.get("tab") || "details";

    const [approvalLoading, setApprovalLoading] = useState(false);
    const [recommendLoading, setRecommendLoading] = useState(false);
    const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");

    const baseURL = import.meta.env.VITE_API_URL || "";
    const baseImgUrl = baseURL.replace(/\/$/, "");

    const fetchDetails = async (isBackground = false) => {
        try {
            if (!isBackground) setLoading(true);
            const res = await getPropertyDetailsForAdmin(id);
            if (res.success) {
                setProperty(res.data);
            } else {
                toast.error(res.message || "Failed to fetch property details");
            }
        } catch (error) {
            toast.error(error.message || "An error occurred");
            console.error(error);
        } finally {
            if (!isBackground) setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchDetails();
        }
    }, [id]);

    const handleApproval = async (action, reason = "") => {
        try {
            setApprovalLoading(true);
            const apiAction = action === "approve" ? "approve" : "reject";
            const res = await updatePropertyApproval(id, apiAction, reason);
            if (res.success) {
                toast.success(`Property ${action === "approve" ? "approved" : "rejected"} successfully`);
                setRejectionModalOpen(false);
                setRejectionReason("");
                fetchDetails(true);
            } else {
                toast.error(res.message || "Action failed");
            }
        } catch (error) {
            toast.error(error?.message || "Failed to update property status");
        } finally {
            setApprovalLoading(false);
        }
    };

    const handleToggleRecommended = async () => {
        try {
            setRecommendLoading(true);
            const res = await toggleRecommendedProperty(id);
            if (res.success) {
                toast.success(res.message || "Recommendation status updated");
                fetchDetails(true);
            } else {
                toast.error(res.message || "Failed to update recommendation");
            }
        } catch (error) {
            toast.error(error?.message || "Something went wrong");
        } finally {
            setRecommendLoading(false);
        }
    };


    const handleDownload = async (e) => {
        e.preventDefault();
        try {
            const fileUrl = `/uploads/propertyDocument/${property.document}`;
            const res = await apiClient.get(fileUrl, { responseType: 'blob' });
            const blob = res.data;
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = property.document || "property_document.pdf";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error("Failed to download file:", error);
            // Fallback
            window.open(`${baseImgUrl}/uploads/propertyDocument/${property.document}`, "_blank");
        }
    };

    if (loading) {
        return <div className="p-6 text-center text-gray-500">Loading property details...</div>;
    }

    if (!property) {
        return <div className="p-6 text-center text-red-500">Property not found.</div>;
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Property Info summary */}
                <div className="lg:col-span-2 space-y-6">
                    <ComponentCard
                        title="Property Details"
                        action={
                            <Link to={`/property-calendar/${id}`}>
                                <Button className="bg-brand-500 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-xl border-0">
                                    View Availability Calendar
                                </Button>
                            </Link>
                        }
                    >
                        <div className="space-y-6">
                            {/* Main Image Gallery */}
                            {property.media?.mainImage?.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {property.media.mainImage.map((img, idx) => (
                                        <div key={idx} className="aspect-[4/3] rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm transition-transform hover:scale-[1.02] duration-300">
                                            <img
                                                src={`${baseImgUrl}/uploads/mainImage/${img}`}
                                                alt={`Property ${idx}`}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = "none";
                                                    e.currentTarget.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-400 text-[10px] text-center p-2 bg-gray-50 dark:bg-gray-800/50">No Image</div>';
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Status & Highlights Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 py-6 border-y border-gray-100 dark:border-gray-800">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Platform Status</p>
                                    <span className={`px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.1em] inline-block shadow-sm ${property.status === 'publish' || property.status === 'completed'
                                        ? 'bg-green-500 text-white shadow-green-500/20'
                                        : 'bg-orange-500 text-white shadow-orange-500/20'
                                        }`}>
                                        {property.status || "Draft"}
                                    </span>
                                </div>

                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Approval Status</p>
                                    <span className={`px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.1em] inline-block shadow-sm ${property.approvalStatus === 'approved'
                                        ? 'bg-blue-500 text-white shadow-blue-500/20'
                                        : property.approvalStatus === 'rejected'
                                            ? 'bg-red-500 text-white shadow-red-500/20'
                                            : 'bg-yellow-500 text-yellow-950 dark:text-yellow-400 shadow-yellow-500/10'
                                        }`}>
                                        {property.approvalStatus || "Pending"}
                                    </span>
                                </div>

                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Recommendation</p>
                                    <button
                                        onClick={handleToggleRecommended}
                                        disabled={recommendLoading}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.1em] transition-all shadow-sm ${property.isRecommended
                                            ? 'bg-yellow-400 text-white shadow-yellow-400/20'
                                            : 'bg-gray-100 dark:bg-white/5 text-gray-400 hover:text-yellow-500'
                                            }`}
                                    >
                                        {recommendLoading ? (
                                            <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <Star size={12} fill={property.isRecommended ? "currentColor" : "none"} />
                                        )}
                                        {property.isRecommended ? "Featured" : "Recommend"}
                                    </button>
                                </div>

                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Category</p>
                                    <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider bg-gray-50 dark:bg-white/5 px-3 py-1.5 rounded-xl border border-gray-100 dark:border-gray-800 inline-block shadow-sm">
                                        {property.category?.category || "N/A"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Pricing ({property.priceType || 'Flat'})</p>
                                    <p className="text-xs font-black text-brand-600 dark:text-brand-400 bg-brand-50/50 dark:bg-brand-500/10 px-3 py-1.5 rounded-xl inline-block shadow-sm">
                                        {formatCurrency(property.price || 0)}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white capitalize">{property.name}</h3>
                                <div className="flex items-center gap-1.5 text-gray-500">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    <span className="text-[11px] font-bold uppercase tracking-wider">{property.address?.city}, {property.address?.state}, {property.address?.country}</span>
                                </div>
                            </div>

                            <div className="pt-2">
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Description</h4>
                                <div className="bg-white dark:bg-gray-800/40 p-6 rounded-2xl border border-gray-50 dark:border-gray-800 leading-relaxed text-gray-700 dark:text-gray-300 shadow-inner italic">
                                    "{property.description || "No description provided."}"
                                </div>
                            </div>

                            {/* Approval Action Panel */}
                            <div className="mt-6 p-5 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">Administrative Status Actions</p>
                                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest mt-0.5">Approve or reject this property listing for active publication</p>
                                </div>
                                <div className="flex gap-2.5">
                                    {(property.approvalStatus === 'pending' || !property.approvalStatus || property.approvalStatus === 'rejected') && (
                                        <button
                                            disabled={approvalLoading}
                                            onClick={() => handleApproval("approve")}
                                            className="px-5 py-2.5 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white text-[10px] font-black rounded-2xl shadow-lg shadow-green-500/20 uppercase tracking-[0.12em] transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer font-bold border-0"
                                        >
                                            {approvalLoading ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : (
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                            )}
                                            Approve
                                        </button>
                                    )}
                                    {(property.approvalStatus === 'pending' || !property.approvalStatus || property.approvalStatus === 'approved') && (
                                        <button
                                            disabled={approvalLoading}
                                            onClick={() => setRejectionModalOpen(true)}
                                            className="px-5 py-2.5 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-[10px] font-black rounded-2xl shadow-lg shadow-red-500/20 uppercase tracking-[0.12em] transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer font-bold border-0"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                            {property.approvalStatus === 'approved' ? 'Revoke Approval' : 'Reject'}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {property.document && (
                                <div className="mt-6 p-5 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl border-2 border-indigo-100/50 dark:border-indigo-900/20 flex items-center justify-between group transition-all hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/20 group-hover:scale-110 transition-transform">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Property Document</p>
                                            <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-widest mt-0.5">Official Verification PDF Attached</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <a
                                            href={`${baseImgUrl}/uploads/propertyDocument/${property.document}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-5 py-3 bg-white dark:bg-gray-800 shadow-md hover:shadow-xl rounded-2xl text-[10px] font-black text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all border border-indigo-100 dark:border-indigo-900/40 uppercase tracking-[0.15em] active:scale-95 flex items-center gap-2"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                            View PDF
                                        </a>
                                        <button
                                            onClick={handleDownload}
                                            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-xl text-white rounded-2xl text-[10px] font-black transition-all uppercase tracking-[0.15em] active:scale-95 flex items-center gap-2 cursor-pointer border-0"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                            Download
                                        </button>
                                    </div>
                                </div>
                            )}

                        </div>
                    </ComponentCard>

                    {/* Rooms and features */}
                    <ComponentCard title="Rooms & Amenities Setups">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="bg-gray-50 dark:bg-gray-800/40 p-5 rounded-3xl border border-gray-100 dark:border-gray-800/50">
                                <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                                    Bedroom Configuration
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-gray-400 font-bold uppercase">Total Bedrooms</span>
                                        <span className="text-xl font-bold text-gray-900 dark:text-white">{property.bedRoom?.numBedroom || 0}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-gray-400 font-bold uppercase">Master Beds</span>
                                        <span className="text-xl font-bold text-gray-900 dark:text-white">{property.bedRoom?.numMasterBed || 0}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-gray-400 font-bold uppercase">Single Beds</span>
                                        <span className="text-xl font-bold text-gray-900 dark:text-white">{property.bedRoom?.numSingleBed || 0}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-gray-400 font-bold uppercase">Total Capacity</span>
                                        <span className="text-xl font-bold text-indigo-600 underline decoration-indigo-200 underline-offset-4">{property.maxGuests || 0} Guests</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800/40 p-5 rounded-3xl border border-gray-100 dark:border-gray-800/50">
                                <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                    Bathroom Setup
                                </h4>
                                <div className="space-y-4">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-gray-400 font-bold uppercase">Total Bathrooms</span>
                                        <span className="text-xl font-bold text-gray-900 dark:text-white">{property.restRoom?.numBathroom || 0}</span>
                                    </div>
                                    {property.restRoom?.facilities?.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 pt-2">
                                            {property.restRoom.facilities.map((f, i) => (
                                                <span key={i} className="text-[8px] font-black uppercase px-2 py-0.5 bg-white dark:bg-gray-800 text-gray-500 rounded-md border border-gray-100 dark:border-gray-700">{f}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {property.pool && (
                            <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
                                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Pool Specifications</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-2xl border border-blue-100/50 dark:border-blue-900/20">
                                        <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-1">Dimensions</p>
                                        <p className="font-bold text-gray-900 dark:text-white">{(property.pool.dimension?.height / 100).toFixed(1)}m × {(property.pool.dimension?.width / 100).toFixed(1)}m</p>
                                    </div>
                                    <div className="bg-indigo-50 dark:bg-indigo-900/10 p-4 rounded-2xl border border-indigo-100/50 dark:border-indigo-900/20">
                                        <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mb-1">Gradient ({property.pool.gradient?.type || 'N/A'})</p>
                                        <p className="font-bold text-gray-900 dark:text-white">Depth: {property.pool.gradient?.feet1}ft - {property.pool.gradient?.feet2}ft</p>
                                    </div>
                                    <div className="md:col-span-1">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Pool Features</p>
                                        <div className="flex flex-wrap gap-2">
                                            {property.pool.additional?.map((item, idx) => (
                                                <span key={idx} className="text-[9px] font-medium bg-white dark:bg-gray-800 px-3 py-1 rounded-full border border-gray-100 dark:border-gray-850 shadow-sm">{item}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {property.propertyAmenities && property.propertyAmenities.length > 0 && (
                            <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
                                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Detailed Amenities List</h4>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {property.propertyAmenities.map((amn) => (
                                        <div key={amn._id} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-900 rounded-2xl border border-gray-50 dark:border-gray-800 shadow-sm transition-all hover:shadow-md">
                                            <div className="w-8 h-8 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-brand-500">
                                                <span className="text-[10px] font-black uppercase opacity-60">{amn.name?.charAt(0)}</span>
                                            </div>
                                            <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">{amn.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {property.propertyFeatures && property.propertyFeatures.length > 0 && (
                            <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
                                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Property Features</h4>
                                <div className="flex flex-wrap gap-2.5">
                                    {property.propertyFeatures.map((feat) => (
                                        <span
                                            key={feat._id}
                                            className="text-[9px] font-black uppercase tracking-wider px-4 py-2 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 rounded-2xl border border-indigo-100/30 dark:border-indigo-900/20 shadow-sm"
                                        >
                                            {feat.feature}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </ComponentCard>

                    <ComponentCard title="Policies & House Rules">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div>
                                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Timing Policies</h4>
                                <div className="flex gap-12 bg-white dark:bg-gray-800/40 p-6 rounded-[2rem] border border-gray-50 dark:border-gray-800 shadow-sm">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-indigo-500 font-black uppercase tracking-widest mb-1.5">Check-In After</span>
                                        <span className="text-2xl font-black text-gray-900 dark:text-white">{property.policies?.checkInTime || "3:00 PM"}</span>
                                    </div>
                                    <div className="w-px h-12 bg-gray-100 dark:bg-gray-700 self-center"></div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-orange-500 font-black uppercase tracking-widest mb-1.5">Check-Out Before</span>
                                        <span className="text-2xl font-black text-gray-900 dark:text-white">{property.policies?.checkOutTime || "11:00 AM"}</span>
                                    </div>
                                </div>

                                <div className="mt-8 space-y-4">
                                    <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global House Rules</h5>
                                    <div className="flex gap-3 flex-wrap">
                                        <div className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${property.policies?.houseRules?.petsAllowed ? 'bg-green-500 text-white' : 'bg-red-50 text-red-500 border border-red-100'}`}>
                                            {property.policies?.houseRules?.petsAllowed ? <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg> : <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" /></svg>}
                                            Pets Allowed
                                        </div>
                                        <div className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${property.policies?.houseRules?.smokingAllowed ? 'bg-green-500 text-white' : 'bg-red-50 text-red-500 border border-red-100'}`}>
                                            {property.policies?.houseRules?.smokingAllowed ? <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg> : <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" /></svg>}
                                            Smoking Allowed
                                        </div>
                                        <div className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${property.policies?.houseRules?.partiesAllowed ? 'bg-green-500 text-white' : 'bg-red-50 text-red-500 border border-red-100'}`}>
                                            {property.policies?.houseRules?.partiesAllowed ? <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg> : <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" /></svg>}
                                            Parties Allowed
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Additional Terms</h4>
                                <div className="space-y-3">
                                    {property.policies?.additionalPolicies?.length > 0 ? (
                                        property.policies.additionalPolicies.map((p, i) => {
                                            let content = p;
                                            try { if (p.startsWith("[")) content = JSON.parse(p)[0]; } catch (e) { }
                                            return (
                                                <div key={i} className="bg-gray-50 dark:bg-gray-800 p-5 rounded-3xl border border-gray-100 dark:border-gray-800 flex items-start gap-4">
                                                    <span className="w-6 h-6 shrink-0 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center font-black text-[10px]">{i + 1}</span>
                                                    <p className="text-sm italic text-gray-600 dark:text-gray-400">"{content}"</p>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p className="text-xs text-gray-400 italic">No additional policies provided.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </ComponentCard>
                </div>

                {/* Right Column: Owner & address */}
                <div className="space-y-6 lg:sticky lg:top-6 h-fit">
                    <ComponentCard title="Provider Details">
                        {property.user ? (
                            <div className="flex flex-col items-center text-center">
                                <div className="flex flex-col items-center text-center pb-4 border-b border-gray-100 dark:border-gray-800 mb-6 w-full">
                                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-brand-500/20 p-1 mb-4 relative">
                                        {property.user.profile ? (
                                            <img
                                                src={`${baseImgUrl}/uploads/users/${property.user.profile}`}
                                                alt="Provider"
                                                className="w-full h-full object-cover rounded-full"
                                                onError={(e) => e.target.src = "/images/user/user-01.jpg"}
                                            />
                                        ) : (
                                            <div className="w-full h-full rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-2xl font-bold text-gray-400 uppercase">
                                                {property.user.firstName?.charAt(0)}{property.user.lastName?.charAt(0)}
                                            </div>
                                        )}
                                        {property.user.isVerified && (
                                            <div className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full border-2 border-white dark:border-gray-900">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="font-bold text-lg dark:text-white capitalize">
                                        {property.user.firstName} {property.user.lastName}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {property.user.isVerified ? "Verified Provider" : "Registered Provider"}
                                    </p>
                                </div>

                                <div className="space-y-4 w-full">
                                    <div className="flex items-center gap-3">
                                        <Mail className="text-gray-400" size={18} />
                                        <span className="text-sm text-gray-600 dark:text-gray-400 truncate">{property.user.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Smartphone className="text-gray-400" size={18} />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">{property.user.phone || "Not provided"}</span>
                                    </div>
                                </div>

                                <div className="mt-8 w-full">
                                    <Button variant="outline" className="w-full" size="sm" onClick={() => navigate(`/vendor-details/${property.user?._id}`)}>
                                        View Provider Profile
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-500 italic text-sm text-center">No structural owner data.</p>
                        )}
                    </ComponentCard>

                    <ComponentCard title="Location">
                        <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 font-medium">City:</span>
                                <span className="font-bold text-gray-900 dark:text-white capitalize">{property.address?.city || "N/A"}</span>
                            </div>
                        </div>
                    </ComponentCard>
                </div>
            </div>

            {/* Gallery Section */}
            <ComponentCard title="Media Gallery">
                {property.media && (property.media.mainImage?.length > 0 || property.media.bathroom?.length > 0 || property.media.bedroom?.length > 0) ? (
                    <div className="space-y-8">
                        {property.media.mainImage && property.media.mainImage.length > 0 && (
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 uppercase">Main Image(s)</h4>
                                <div className="flex gap-4 overflow-x-auto pb-4">
                                    {property.media.mainImage.map((img, i) => (
                                        <div key={i} className="min-w-[200px] h-[150px] flex-shrink-0 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800/50">
                                            <img
                                                src={`${baseImgUrl}/uploads/mainImage/${img}`}
                                                alt={`Main Property img ${i + 1}`}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = "none";
                                                    e.currentTarget.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-400 text-xs text-center p-2">Image Not Found</div>';
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {property.media.bathroom && property.media.bathroom.length > 0 && (
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 uppercase">Bathroom Images</h4>
                                <div className="flex gap-4 overflow-x-auto pb-4">
                                    {property.media.bathroom.map((img, i) => (
                                        <div key={i} className="min-w-[200px] h-[150px] flex-shrink-0 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800/50">
                                            <img
                                                src={`${baseImgUrl}/uploads/bathroom/${img}`}
                                                alt={`Bathroom ${i + 1}`}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = "none";
                                                    e.currentTarget.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-400 text-xs text-center p-2">Image Not Found</div>';
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {property.media.bedroom && property.media.bedroom.length > 0 && (
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 uppercase">Bedroom Images</h4>
                                <div className="flex gap-4 overflow-x-auto pb-4">
                                    {property.media.bedroom.map((img, i) => (
                                        <div key={i} className="min-w-[200px] h-[150px] flex-shrink-0 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800/50">
                                            <img
                                                src={`${baseImgUrl}/uploads/bedroom/${img}`}
                                                alt={`Bedroom ${i + 1}`}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = "none";
                                                    e.currentTarget.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-400 text-xs text-center p-2">Image Not Found</div>';
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center p-8 text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-200 dark:border-gray-700">
                        No media available for this property.
                    </div>
                )}
            </ComponentCard>

            {/* Bookings Section */}
            <div id="bookings-section" className="mt-8">
                <PropertyBookingListComp propertyId={id} />
            </div>



            {/* Show more properties by this user */}
            {/* {property.user?._id && (
                <div className="w-full pt-8 pb-4">
                    <div className="flex justify-center mb-8">
                        <Button
                            onClick={() => setShowProperties(!showProperties)}
                            className="bg-brand-500 hover:bg-brand-600 text-white"
                        >
                            {showProperties ? "Hide Properties" : "See all listed service properties"}
                        </Button>
                    </div>

                    {showProperties && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <UserPropertiesList userId={property.user._id} />
                        </div>
                    )}
                </div>
            )} */}
            {/* Reviews Section */}
            <div id="reviews-section" className="mt-8">
                <ReviewListComp type="property" id={id} />
            </div>

            {/* Rejection Reason Modal */}
            {rejectionModalOpen && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-6 border border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-500">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            </div>
                            <div>
                                <h4 className="text-xl font-bold dark:text-white">
                                    {property.approvalStatus === 'approved' ? 'Revoke Approval' : 'Reject Property'}
                                </h4>
                                <p className="text-xs text-gray-500">
                                    {property.approvalStatus === 'approved'
                                        ? 'Please provide a reason for revoking approval.'
                                        : 'Please provide a reason for rejection.'}
                                </p>
                            </div>
                        </div>

                        <textarea
                            className="w-full h-32 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-white/[0.03] p-4 text-sm outline-none focus:ring-2 focus:ring-brand-500/20 dark:text-gray-100"
                            placeholder="Example: Images are not clear..."
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                        />

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setRejectionModalOpen(false)}
                                className="flex-1 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={!rejectionReason.trim() || approvalLoading}
                                onClick={() => handleApproval("reject", rejectionReason)}
                                className="flex-1 py-3 rounded-2xl font-bold bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50 cursor-pointer border-0"
                            >
                                {approvalLoading ? "Processing..." : (property.approvalStatus === 'approved' ? "Revoke Approval" : "Reject Property")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
