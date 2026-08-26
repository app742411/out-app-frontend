import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router";
import ComponentCard from "../common/ComponentCard";
import {
    getPropertyDetailsForAdmin,
    updatePropertyApproval,
    toggleRecommendedProperty
} from "../../api/authApi";
import apiClient from "../../api/apiClient";
import { formatCurrency } from "../../utils/currency";
import Button from "../ui/button/Button";
import toast from "react-hot-toast";
import PropertyBookingListComp from "../Bookings/PropertyBookingListComp";
import ReviewListComp from "../Reviews/ReviewListComp";
import {
    ArrowLeft,
    MapPin,
    Calendar,
    Clock,
    Tag,
    User,
    Mail,
    Smartphone,
    Star,
    ShieldCheck,
    CheckCircle2,
    XCircle,
    ExternalLink,
    Copy,
    Check,
    FileText,
    Download,
    Eye,
    Home,
    Bed,
    Bath,
    Waves,
    Key,
    Zap,
    Wifi,
    Utensils,
    Maximize,
    Users,
    Sparkles,
    AlertTriangle,
    Layers,
    Share2,
    CalendarCheck,
    Info
} from "lucide-react";

export default function ServicePropertyDetailsComp() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [approvalLoading, setApprovalLoading] = useState(false);
    const [recommendLoading, setRecommendLoading] = useState(false);
    const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const [copiedKey, setCopiedKey] = useState(null);

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

    const handleCopy = (text, key) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopiedKey(key);
        toast.success("Copied to clipboard!");
        setTimeout(() => setCopiedKey(null), 2000);
    };

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
        if (!property?.document) return;
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
            window.open(`${baseImgUrl}/uploads/propertyDocument/${property.document}`, "_blank");
        }
    };

    const renderGallery = (images, title, folderName, icon = <Home className="w-4 h-4" />) => {
        if (!images || images.length === 0) return null;

        return (
            <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {icon}
                    <span>{title} ({images.length})</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {images.map((img, idx) => (
                        <div
                            key={idx}
                            className="aspect-[4/3] rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 shadow-sm transition-transform hover:scale-[1.02] duration-300"
                        >
                            <img
                                src={`${baseImgUrl}/uploads/${folderName}/${img}`}
                                alt={`${title} ${idx + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                    e.currentTarget.parentElement.innerHTML =
                                        '<div class="w-full h-full flex items-center justify-center text-gray-400 text-xs p-2 text-center">Image Not Available</div>';
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-3 text-sm text-gray-500 font-medium">Loading property details...</p>
            </div>
        );
    }

    if (!property) {
        return (
            <div className="text-center p-12 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Property Not Found</h3>
                <p className="text-gray-500 text-sm mt-1 mb-4">The property you are looking for does not exist or has been removed.</p>
                <Button onClick={() => navigate(-1)} variant="outline">
                    Go Back
                </Button>
            </div>
        );
    }

    const coordinates = property.address?.location?.coordinates;
    const hasCoordinates = Array.isArray(coordinates) && coordinates.length === 2;
    const [longitude, latitude] = hasCoordinates ? coordinates : [null, null];

    return (
        <div className="space-y-6 w-full pb-10">
            {/* Top Navigation & Status Header */}
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition mt-0.5"
                            title="Go Back"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <div className="flex items-center gap-2.5 flex-wrap">
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
                                    {property.name}
                                </h1>
                                {property.category?.category && (
                                    <span className="text-xs font-bold px-3 py-1 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200/60 dark:border-gray-700">
                                        {property.category.category}
                                    </span>
                                )}
                                {property.shareCode && (
                                    <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 border border-purple-200/50 font-mono">
                                        <Share2 className="w-3.5 h-3.5" />
                                        {property.shareCode}
                                        <button
                                            onClick={() => handleCopy(property.shareCode, "shareCode")}
                                            className="hover:text-purple-700 ml-0.5"
                                            title="Copy Share Code"
                                        >
                                            {copiedKey === "shareCode" ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                                        </button>
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400 font-mono flex-wrap">
                                <span className="flex items-center gap-1">
                                    ID: {property._id}
                                    <button
                                        onClick={() => handleCopy(property._id, "propertyId")}
                                        className="hover:text-brand-500 transition ml-0.5"
                                        title="Copy Property ID"
                                    >
                                        {copiedKey === "propertyId" ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                                    </button>
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400 font-sans">
                                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                                    {property.address?.city || "Indore"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Action Controls & Status Badges */}
                    <div className="flex items-center gap-2.5 flex-wrap">
                        <span className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider ${
                            property.status === "publish" || property.status === "completed"
                                ? "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400 border border-green-200/50"
                                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border border-gray-200/50"
                        }`}>
                            ● {property.status || "Draft"}
                        </span>

                        <span className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider ${
                            property.approvalStatus === "approved"
                                ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200/50"
                                : property.approvalStatus === "rejected"
                                ? "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border border-red-200/50"
                                : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200/50"
                        }`}>
                            {property.approvalStatus || "Pending"}
                        </span>

                        <button
                            onClick={handleToggleRecommended}
                            disabled={recommendLoading}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer ${
                                property.isRecommended
                                    ? "bg-amber-400 text-white shadow-amber-400/20"
                                    : "bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-amber-500 border border-gray-200/60 dark:border-gray-700"
                            }`}
                        >
                            {recommendLoading ? (
                                <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <Star className="w-3.5 h-3.5" fill={property.isRecommended ? "currentColor" : "none"} />
                            )}
                            {property.isRecommended ? "Featured" : "Feature"}
                        </button>

                        <Link to={`/property-calendar/${id}`}>
                            <Button className="bg-brand-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm">
                                <CalendarCheck className="w-4 h-4" />
                                Calendar
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* 4-Grid Metric Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm">
                    <div className="flex items-center justify-between text-gray-400 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider">Nightly Rate</span>
                        <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-500/10 text-brand-500">
                            <Tag className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-2xl font-black text-gray-900 dark:text-white">
                        {formatCurrency(property.price || 0)}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                        Per Night Base Rate
                    </p>
                </div>

                <div className="p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm">
                    <div className="flex items-center justify-between text-gray-400 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider">Max Guests</span>
                        <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-500">
                            <Users className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-2xl font-black text-gray-900 dark:text-white">
                        {property.maxGuests || 0} <span className="text-sm font-normal text-gray-400">Guests</span>
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                        {property.bedRoom?.numBedroom || 0} Bedrooms, {property.restRoom?.numBathroom || 0} Bathrooms
                    </p>
                </div>

                <div className="p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm">
                    <div className="flex items-center justify-between text-gray-400 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider">Total Area</span>
                        <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-500">
                            <Maximize className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-2xl font-black text-gray-900 dark:text-white">
                        {property.area ? property.area.toLocaleString() : "N/A"} <span className="text-sm font-normal text-gray-400">sq.m (m²)</span>
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                        Instant Booking: {property.instantBooking ? "Enabled" : "Disabled"}
                    </p>
                </div>

                <div className="p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm">
                    <div className="flex items-center justify-between text-gray-400 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider">Available Units</span>
                        <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500">
                            <Layers className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-2xl font-black text-gray-900 dark:text-white">
                        {property.count || 1} <span className="text-sm font-normal text-gray-400">Units</span>
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                        Category: {property.category?.category || "VILLA"}
                    </p>
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 Columns */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Overview & Media Galleries */}
                    <ComponentCard title="Property Overview & Media">
                        <div className="space-y-6">
                            {/* Main Images */}
                            {renderGallery(property.media?.mainImage, "Main Image Gallery", "mainImage", <Home className="w-4 h-4 text-brand-500" />)}
                            
                            {/* Bedroom Images */}
                            {renderGallery(property.media?.bedroom, "Bedrooms Gallery", "bedroom", <Bed className="w-4 h-4 text-indigo-500" />)}

                            {/* Bathroom Images */}
                            {renderGallery(property.media?.bathroom, "Bathrooms Gallery", "bathroom", <Bath className="w-4 h-4 text-cyan-500" />)}

                            {/* Pool Images */}
                            {renderGallery(property.media?.pool, "Pool Gallery", "pool", <Waves className="w-4 h-4 text-blue-500" />)}

                            {/* Description */}
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                                    Description
                                </h4>
                                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                    {property.description || "No description provided for this property."}
                                </div>
                            </div>

                            {/* Main Amenities Chips */}
                            {property.mainAmenities && property.mainAmenities.length > 0 && (
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2.5">
                                        Main Amenities
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {property.mainAmenities.map((amenity, idx) => (
                                            <span
                                                key={idx}
                                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-50/50 dark:bg-brand-950/20 text-brand-700 dark:text-brand-400 border border-brand-200/50 text-xs font-bold capitalize"
                                            >
                                                <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                                                {amenity}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Property Features Badges */}
                            {property.propertyFeatures && property.propertyFeatures.length > 0 && (
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2.5">
                                        Property Features ({property.propertyFeatures.length})
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {property.propertyFeatures.map((feat) => (
                                            <span
                                                key={feat._id}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-gray-700 text-xs font-medium uppercase tracking-wider shadow-xs"
                                            >
                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                                {feat.feature}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Verification Document */}
                            {property.document && (
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                                        Verification Document
                                    </h4>
                                    <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
                                                <FileText className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900 dark:text-white">
                                                    {property.document}
                                                </p>
                                                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                                                    Official Property Document Attached
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <a
                                                href={`${baseImgUrl}/uploads/propertyDocument/${property.document}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:border-brand-500 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-sm transition"
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                                View
                                            </a>
                                            <button
                                                onClick={handleDownload}
                                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-sm transition"
                                            >
                                                <Download className="w-3.5 h-3.5" />
                                                Download
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Admin Approval Control Panel */}
                            <div className="p-4 bg-gray-50 dark:bg-gray-800/40 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <p className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                                        Administrative Approval Actions
                                    </p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        Current status: <strong className="uppercase text-brand-500">{property.approvalStatus || "Pending"}</strong>
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {(property.approvalStatus === "pending" || !property.approvalStatus || property.approvalStatus === "rejected") && (
                                        <button
                                            disabled={approvalLoading}
                                            onClick={() => handleApproval("approve")}
                                            className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                                        >
                                            {approvalLoading ? (
                                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            ) : (
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                            )}
                                            Approve Property
                                        </button>
                                    )}
                                    {(property.approvalStatus === "pending" || !property.approvalStatus || property.approvalStatus === "approved") && (
                                        <button
                                            disabled={approvalLoading}
                                            onClick={() => setRejectionModalOpen(true)}
                                            className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                                        >
                                            <XCircle className="w-3.5 h-3.5" />
                                            {property.approvalStatus === "approved" ? "Revoke Approval" : "Reject Property"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </ComponentCard>

                    {/* Room Configurations & Layout */}
                    <ComponentCard title="Room & Accommodation Details">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Bedroom Box */}
                            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 flex flex-col justify-between space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                        <Bed className="w-4 h-4" />
                                        <span>Bedrooms Configuration</span>
                                    </div>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50">
                                        {property.bedRoom?.numBedroom || 0} Rooms
                                    </span>
                                </div>
                                <div className="grid grid-cols-3 gap-2.5 pt-1 text-center">
                                    <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-xs">
                                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">Total Rooms</span>
                                        <span className="text-xl font-black text-gray-900 dark:text-white mt-1 block">
                                            {property.bedRoom?.numBedroom || 0}
                                        </span>
                                    </div>
                                    <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-xs">
                                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">Master Beds</span>
                                        <span className="text-xl font-black text-gray-900 dark:text-white mt-1 block">
                                            {property.bedRoom?.numMasterBed || 0}
                                        </span>
                                    </div>
                                    <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-xs">
                                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">Single Beds</span>
                                        <span className="text-xl font-black text-gray-900 dark:text-white mt-1 block">
                                            {property.bedRoom?.numSingleBed || 0}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Bathroom Box */}
                            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 flex flex-col justify-between space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                                        <Bath className="w-4 h-4" />
                                        <span>Bathrooms & Capacity</span>
                                    </div>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 border border-cyan-200/50">
                                        {property.restRoom?.numBathroom || 0} Baths
                                    </span>
                                </div>
                                <div className="grid grid-cols-3 gap-2.5 pt-1 text-center">
                                    <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-xs">
                                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">Bathrooms</span>
                                        <span className="text-xl font-black text-gray-900 dark:text-white mt-1 block">
                                            {property.restRoom?.numBathroom || 0}
                                        </span>
                                    </div>
                                    <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-xs">
                                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">Max Guests</span>
                                        <span className="text-xl font-black text-gray-900 dark:text-white mt-1 block">
                                            {property.maxGuests || 0}
                                        </span>
                                    </div>
                                    <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-xs">
                                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">Total Area</span>
                                        <span className="text-base font-black text-gray-900 dark:text-white mt-1 block truncate">
                                            {property.area ? `${property.area} m²` : "N/A"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {property.restRoom?.facilities && property.restRoom.facilities.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center gap-2 flex-wrap text-xs">
                                <span className="text-gray-400 font-semibold uppercase text-[10px] tracking-wider">Bathroom Facilities:</span>
                                {property.restRoom.facilities.map((fac, idx) => (
                                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium text-xs">
                                        {fac}
                                    </span>
                                ))}
                            </div>
                        )}
                    </ComponentCard>

                    {/* Swimming Pool Specifications (if present) */}
                    {property.pool && (
                        <ComponentCard title="Swimming Pool Specifications">
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                    <div className="p-3.5 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-100 dark:border-blue-900/30">
                                        <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 block mb-1">
                                            Dimensions (Square Meters)
                                        </span>
                                        <p className="text-base font-bold text-gray-900 dark:text-white">
                                            {property.pool.dimension?.height || "N/A"} × {property.pool.dimension?.width || "N/A"} m
                                            {property.pool.dimension?.height && property.pool.dimension?.width && (
                                                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 ml-1.5">
                                                    ({(property.pool.dimension.height * property.pool.dimension.width).toLocaleString()} m²)
                                                </span>
                                            )}
                                        </p>
                                    </div>

                                    <div className="p-3.5 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
                                        <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400 block mb-1">
                                            Gradient ({property.pool.gradient?.type || "Tiered"})
                                        </span>
                                        <p className="text-base font-bold text-gray-900 dark:text-white">
                                            Depth: {property.pool.gradient?.feet1 || 0} - {property.pool.gradient?.feet2 || 0} m
                                        </p>
                                    </div>

                                    <div className="p-3.5 bg-purple-50/50 dark:bg-purple-950/20 rounded-xl border border-purple-100 dark:border-purple-900/30">
                                        <span className="text-[10px] uppercase font-bold text-purple-600 dark:text-purple-400 block mb-1">
                                            Pool Category
                                        </span>
                                        <p className="text-base font-bold text-gray-900 dark:text-white capitalize">
                                            {property.pool.gradient?.type || "Standard"}
                                        </p>
                                    </div>
                                </div>

                                {property.pool.additional && property.pool.additional.length > 0 && (
                                    <div className="pt-2">
                                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">
                                            Additional Pool Features
                                        </span>
                                        <div className="flex flex-wrap gap-2">
                                            {property.pool.additional.map((item, idx) => (
                                                <span
                                                    key={idx}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border border-blue-200/40 text-xs font-medium"
                                                >
                                                    <Waves className="w-3.5 h-3.5 text-blue-500" />
                                                    {item}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ComponentCard>
                    )}

                    {/* Property Access & Key Instructions */}
                    {property.instructions && property.instructions.length > 0 && (
                        <ComponentCard title="Property Instructions & Access Guide">
                            <div className="space-y-3">
                                {property.instructions.map((inst, idx) => (
                                    <div
                                        key={inst._id || idx}
                                        className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 flex items-start gap-3.5"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <Key className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                                                    {inst.title}
                                                </h4>
                                                {inst.isActive && (
                                                    <span className="text-[10px] font-bold px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400 rounded-md">
                                                        Active
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
                                                {inst.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ComponentCard>
                    )}

                    {/* Policies & House Rules */}
                    {property.policies && (
                        <ComponentCard title="Policies & House Rules">
                            <div className="space-y-5">
                                {/* Timing Policies */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                                        <div>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                                                Check-In Time
                                            </span>
                                            <p className="text-base font-bold text-gray-900 dark:text-white mt-0.5">
                                                {property.policies.checkInTime || "N/A"}
                                            </p>
                                        </div>
                                        <Clock className="w-5 h-5 text-brand-500" />
                                    </div>

                                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                                        <div>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                                                Check-Out Time
                                            </span>
                                            <p className="text-base font-bold text-gray-900 dark:text-white mt-0.5">
                                                {property.policies.checkOutTime || "N/A"}
                                            </p>
                                        </div>
                                        <Clock className="w-5 h-5 text-brand-500" />
                                    </div>
                                </div>

                                {/* House Rules Badges */}
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2.5">
                                        House Rules
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Pets Allowed</span>
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                                property.policies.houseRules?.petsAllowed
                                                    ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                                                    : "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400"
                                            }`}>
                                                {property.policies.houseRules?.petsAllowed ? "Yes" : "No"}
                                            </span>
                                        </div>

                                        <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Smoking Allowed</span>
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                                property.policies.houseRules?.smokingAllowed
                                                    ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                                                    : "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400"
                                            }`}>
                                                {property.policies.houseRules?.smokingAllowed ? "Yes" : "No"}
                                            </span>
                                        </div>

                                        <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Parties Allowed</span>
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                                property.policies.houseRules?.partiesAllowed
                                                    ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                                                    : "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400"
                                            }`}>
                                                {property.policies.houseRules?.partiesAllowed ? "Yes" : "No"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Policies */}
                                {property.policies.additionalPolicies && property.policies.additionalPolicies.length > 0 && (
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                                            Additional Policies
                                        </h4>
                                        <ul className="space-y-2">
                                            {property.policies.additionalPolicies.map((p, idx) => (
                                                <li
                                                    key={idx}
                                                    className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/40 text-xs text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-gray-800"
                                                >
                                                    <div className="w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0" />
                                                    <span>{p}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </ComponentCard>
                    )}
                </div>

                {/* Right Column (Provider, Location, Metadata) */}
                <div className="space-y-6">
                    {/* Provider Information Card */}
                    <ComponentCard title="Property Owner / Host">
                        {property.user ? (
                            <div>
                                <div className="flex flex-col items-center text-center pb-5 border-b border-gray-100 dark:border-gray-800">
                                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-brand-500/20 mb-3 bg-brand-50 dark:bg-brand-950/40 relative shadow-sm flex items-center justify-center">
                                        {property.user.profile ? (
                                            <img
                                                src={`${baseImgUrl}/uploads/users/${property.user.profile}`}
                                                alt="Provider Profile"
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = "none";
                                                }}
                                            />
                                        ) : (
                                            <span className="text-2xl font-black text-brand-500 uppercase">
                                                {property.user.firstName?.charAt(0) || "U"}
                                            </span>
                                        )}
                                        {property.user.isActive && (
                                            <div className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full border-2 border-white dark:border-gray-900" title="Active Host">
                                                <Check className="w-3 h-3 stroke-[3]" />
                                            </div>
                                        )}
                                    </div>
                                    <h4 className="text-base font-bold text-gray-900 dark:text-white capitalize">
                                        {property.user.firstName} {property.user.lastName}
                                    </h4>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        {property.user.isActive ? "Active Host" : "Registered Host"}
                                    </p>
                                </div>

                                <div className="space-y-3.5 pt-4 text-xs">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400 flex items-center gap-1.5 font-medium">
                                            <Smartphone className="w-3.5 h-3.5" /> Phone
                                        </span>
                                        {property.user.phone ? (
                                            <a
                                                href={`tel:${property.user.phone}`}
                                                className="font-semibold text-gray-900 dark:text-white hover:text-brand-500 transition"
                                            >
                                                {property.user.phone}
                                            </a>
                                        ) : (
                                            <span className="text-gray-400">N/A</span>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400 flex items-center gap-1.5 font-medium">
                                            <Mail className="w-3.5 h-3.5" /> Email
                                        </span>
                                        <a
                                            href={`mailto:${property.user.email}`}
                                            className="font-semibold text-gray-900 dark:text-white hover:text-brand-500 transition truncate max-w-[180px]"
                                        >
                                            {property.user.email || "N/A"}
                                        </a>
                                    </div>

                                    <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                                        <span className="text-gray-400 uppercase font-semibold text-[10px] tracking-wider block mb-1">
                                            Host User ID
                                        </span>
                                        <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-2 rounded-lg font-mono text-[11px] text-gray-600 dark:text-gray-300">
                                            <span className="truncate mr-2">{property.user._id}</span>
                                            <button
                                                onClick={() => handleCopy(property.user._id, "hostUserId")}
                                                className="text-gray-400 hover:text-brand-500"
                                                title="Copy Host ID"
                                            >
                                                {copiedKey === "hostUserId" ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="pt-3">
                                        <Button
                                            variant="outline"
                                            className="w-full py-2.5 text-xs font-semibold"
                                            onClick={() => navigate(`/vendor-details/${property.user._id}`)}
                                        >
                                            View Host Profile
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-400 italic text-xs text-center py-4">No owner details available.</p>
                        )}
                    </ComponentCard>

                    {/* Location & GPS Map */}
                    <ComponentCard title="Property Location">
                        <div className="space-y-3.5 text-xs">
                            <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
                                <span>City:</span>
                                <span className="font-bold text-gray-900 dark:text-white capitalize">
                                    {property.address?.city || "Indore"}
                                </span>
                            </div>

                            {hasCoordinates && (
                                <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                                    <span className="text-gray-400 uppercase font-semibold text-[10px] tracking-wider block mb-1.5">
                                        GPS Coordinates
                                    </span>
                                    <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-2.5 rounded-xl font-mono text-[11px] mb-3">
                                        <span>[{latitude?.toFixed(4)}, {longitude?.toFixed(4)}]</span>
                                        <button
                                            onClick={() => handleCopy(`${latitude},${longitude}`, "coords")}
                                            className="text-gray-400 hover:text-brand-500"
                                            title="Copy Coordinates"
                                        >
                                            {copiedKey === "coords" ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                                        </button>
                                    </div>
                                    <a
                                        href={`https://www.google.com/maps?q=${latitude},${longitude}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold rounded-xl transition shadow-sm"
                                    >
                                        Open in Google Maps <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                </div>
                            )}
                        </div>
                    </ComponentCard>

                    {/* System Metadata Card */}
                    <ComponentCard title="System Metadata">
                        <div className="space-y-3 text-xs">
                            <div className="flex justify-between items-center text-gray-500">
                                <span>Created At:</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {property.createdAt ? new Date(property.createdAt).toLocaleString() : "N/A"}
                                </span>
                            </div>

                            {property.approvedAt && (
                                <div className="flex justify-between items-center text-gray-500">
                                    <span>Approved At:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {new Date(property.approvedAt).toLocaleString()}
                                    </span>
                                </div>
                            )}

                            {property.cancellationPolicy && (
                                <div className="flex justify-between items-center text-gray-500">
                                    <span>Cancellation Policy:</span>
                                    <span className="font-mono text-[11px] text-gray-700 dark:text-gray-300 truncate max-w-[140px]">
                                        {property.cancellationPolicy}
                                    </span>
                                </div>
                            )}

                            {property.category?._id && (
                                <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center text-gray-500">
                                    <span>Category ID:</span>
                                    <span className="font-mono text-[11px] text-gray-700 dark:text-gray-300 truncate max-w-[140px]">
                                        {property.category._id}
                                    </span>
                                </div>
                            )}
                        </div>
                    </ComponentCard>
                </div>
            </div>

            {/* Bookings Section */}
            <div id="bookings-section" className="mt-8">
                <PropertyBookingListComp propertyId={id} />
            </div>

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
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold dark:text-white">
                                    {property.approvalStatus === "approved" ? "Revoke Approval" : "Reject Property"}
                                </h4>
                                <p className="text-xs text-gray-500">
                                    {property.approvalStatus === "approved"
                                        ? "Please provide a reason for revoking approval."
                                        : "Please provide a reason for rejection."}
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
                                className="flex-1 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer border-0 bg-transparent"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={!rejectionReason.trim() || approvalLoading}
                                onClick={() => handleApproval("reject", rejectionReason)}
                                className="flex-1 py-3 rounded-2xl font-bold bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50 cursor-pointer border-0"
                            >
                                {approvalLoading ? "Processing..." : (property.approvalStatus === "approved" ? "Revoke Approval" : "Reject Property")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
