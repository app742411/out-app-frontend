import React, { useState, useEffect } from "react";
import ComponentCard from "../common/ComponentCard";
import { Link, useNavigate } from "react-router";
import Button from "../ui/button/Button";
import { getAllProperties, getPendingProperties, updatePropertyApproval, deleteProperty, toggleRecommendedProperty } from "../../api/authApi";
import toast from "react-hot-toast";
import Pagination from "../common/Pagination";
import DeleteConfirmationModal from "../common/DeleteConfirmationModal";
import {
    Users,
    Maximize,
    Bed,
    Droplets,
    MapPin,
    Calendar as CalendarIcon,
    BookOpen,
    Eye,
    ChevronRight,
    Search,
    CheckCircle,
    XCircle,
    AlertCircle,
    Trash2,
    Star
} from "lucide-react";

const ITEMS_PER_PAGE = 8;

const getApprovalStatusColor = (status) => {
    switch (status?.toLowerCase()) {
        case "approved":
            return "bg-emerald-500 text-white";
        case "rejected":
            return "bg-red-500 text-white";
        case "pending":
            return "bg-amber-500 text-white";
        default:
            return "bg-gray-500 text-white";
    }
};

export default function ServicePropertiesList() {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [activeTab, setActiveTab] = useState("active"); // "active" or "pending"
    const [rejectionModal, setRejectionModal] = useState({ show: false, propId: null, reason: "" });
    const [approvalLoading, setApprovalLoading] = useState(null);
    const [recommendLoading, setRecommendLoading] = useState(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [propertyToDelete, setPropertyToDelete] = useState(null);

    const baseURL = import.meta.env.VITE_API_URL || "";

    const fetchProperties = async (isBackgroundPoll = false) => {
        try {
            if (!isBackgroundPoll) setLoading(true);
            let finalProperties = [];

            if (activeTab === "pending") {
                const res = await getPendingProperties();
                const pendingData = res.data || [];
                finalProperties = pendingData.map(prop => ({
                    ...prop,
                    owner: prop.userId ? {
                        id: prop.userId._id,
                        name: `${prop.userId.firstName || ""} ${prop.userId.lastName || ""}`.trim() || prop.userId.email,
                        email: prop.userId.email
                    } : null
                }));
            } else {
                const res = await getAllProperties({
                    page: 1,
                    limit: 10,
                    search,
                    status: "",
                });

                const usersData = res.data || [];
                usersData.forEach(user => {
                    if (user.properties && user.properties.length > 0) {
                        user.properties.forEach(prop => {
                            if (prop.status === 'publish' || prop.status === 'completed') {
                                finalProperties.push({
                                    ...prop,
                                    owner: {
                                        id: user._id,
                                        name: user.name || user.firstName || user.email?.split('@')[0],
                                        email: user.email,
                                    }
                                });
                            }
                        });
                    }
                });
            }

            setTotalPages(Math.ceil(finalProperties.length / ITEMS_PER_PAGE));
            setProperties(finalProperties);

        } catch (error) {
            if (!isBackgroundPoll) toast.error("Failed to load properties");
            console.error(error);
        } finally {
            if (!isBackgroundPoll) setLoading(false);
        }
    };

    useEffect(() => {
        fetchProperties();
        setCurrentPage(1);
    }, [search, activeTab]);

    // Real-time data refresh on focus or tab visibility to avoid continuous background polling
    useEffect(() => {
        const handleRefresh = () => {
            if (document.visibilityState === "visible") {
                fetchProperties(true);
            }
        };

        window.addEventListener("focus", handleRefresh);
        document.addEventListener("visibilitychange", handleRefresh);

        return () => {
            window.removeEventListener("focus", handleRefresh);
            document.removeEventListener("visibilitychange", handleRefresh);
        };
    }, [search, activeTab]);

    const handleApproval = async (id, action, reason = "") => {
        try {
            setApprovalLoading(id);
            const res = await updatePropertyApproval(id, action, reason);
            if (res.success) {
                toast.success(`Property ${action === "approve" ? "approved" : "rejected"} successfully`);
                setRejectionModal({ show: false, propId: null, reason: "" });
                fetchProperties();
            } else {
                toast.error(res.message || "Action failed");
            }
        } catch (error) {
            toast.error(error?.message || "Failed to perform action");
        } finally {
            setApprovalLoading(null);
        }
    };

    const handleToggleRecommended = async (id) => {
        try {
            setRecommendLoading(id);
            const res = await toggleRecommendedProperty(id);
            if (res.success) {
                toast.success(res.message || "Recommendation status updated");
                fetchProperties();
            } else {
                toast.error(res.message || "Failed to update recommendation");
            }
        } catch (error) {
            toast.error(error?.message || "Something went wrong");
        } finally {
            setRecommendLoading(null);
        }
    };

    const handleDeleteProperty = async () => {
        if (!propertyToDelete) return;
        try {
            setLoading(true);
            await deleteProperty(propertyToDelete);
            toast.success("Property deleted successfully");
            setDeleteOpen(false);
            setPropertyToDelete(null);
            fetchProperties();
        } catch (error) {
            toast.error(error.message || "Failed to delete property");
        } finally {
            setLoading(false);
        }
    };

    const paginatedProperties = properties.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const getImageUrl = (prop) => {
        let imageName = "";

        // Ensure we handle both array and string formats for mainImage
        if (Array.isArray(prop.media?.mainImage) && prop.media.mainImage.length > 0) {
            imageName = prop.media.mainImage[0];
        } else if (typeof prop.media?.mainImage === 'string' && prop.media.mainImage) {
            imageName = prop.media.mainImage;
        }

        if (imageName) {
            const cleanBaseURL = baseURL.replace(/\/$/, "");
            return `${cleanBaseURL}/uploads/mainImage/${imageName}`;
        }
        return;
    };

    return (
        <div className="space-y-6">
            {/* Tabs and Search Row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-2 md:pb-0">
                {/* TAB SWITCHER */}
                <div className="flex -mb-px">
                    <button
                        onClick={() => setActiveTab("active")}
                        className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 ${activeTab === "active"
                            ? "border-brand-500 text-brand-500"
                            : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            }`}
                    >
                        Active Properties
                    </button>
                    <button
                        onClick={() => setActiveTab("pending")}
                        className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 ${activeTab === "pending"
                            ? "border-brand-500 text-brand-500"
                            : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            }`}
                    >
                        Pending Approval
                    </button>
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-96 md:mb-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search properties, owners..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-brand-500/20 transition-all outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                        <div key={n} className="h-[420px] rounded-3xl bg-gray-100 dark:bg-gray-800 animate-pulse"></div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {paginatedProperties.length > 0 ? (
                        paginatedProperties.map((prop, index) => (
                            <div
                                key={prop._id || index}
                                className="group bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-2xl hover:shadow-brand-500/10 transition-all duration-500 hover:translate-y-[-6px]"
                            >
                                {/* Image Section */}
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={getImageUrl(prop)}
                                        alt={prop.name}
                                        onLoad={(e) => e.currentTarget.classList.remove('opacity-0')}
                                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 opacity-0 bg-gray-100 dark:bg-gray-800"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg ${getApprovalStatusColor(prop.approvalStatus)}`}>
                                            {prop.approvalStatus || "pending"}
                                        </span>
                                    </div>
                                    <div className="absolute top-4 right-4 flex gap-2 translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                        {activeTab === "active" && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleToggleRecommended(prop._id);
                                                }}
                                                disabled={recommendLoading === prop._id}
                                                className={`p-2 rounded-full shadow-lg transition-all ${prop.isRecommended
                                                    ? 'bg-yellow-400 text-white'
                                                    : 'bg-white/80 dark:bg-black/60 text-gray-400 hover:text-yellow-500'
                                                    }`}
                                                title={prop.isRecommended ? "Remove from Recommended" : "Set as Recommended"}
                                            >
                                                {recommendLoading === prop._id ? (
                                                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                                ) : (
                                                    <Star size={16} fill={prop.isRecommended ? "currentColor" : "none"} />
                                                )}
                                            </button>
                                        )}
                                        <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg ${prop.status === 'publish' || prop.status === 'completed'
                                            ? 'bg-green-500 text-white'
                                            : 'bg-orange-500 text-white'
                                            }`}>
                                            {prop.status || "Draft"}
                                        </span>
                                    </div>
                                    <div className="absolute bottom-4 left-4">
                                        <p className="bg-white/95 dark:bg-black/90 px-3 py-1 rounded-lg font-bold text-brand-600 dark:text-brand-400 shadow-sm">
                                            SAR {prop.price}
                                        </p>
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="p-5 space-y-4">
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-bold text-gray-900 dark:text-white truncate text-lg group-hover:text-brand-500 transition-colors">
                                                {prop.name || "Unnamed Property"}
                                            </h3>
                                            {prop.isRecommended && (
                                                <span className="text-[10px] font-bold text-yellow-600 bg-yellow-50 dark:bg-yellow-500/10 px-2 py-0.5 rounded-full">Recommended</span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                            <MapPin className="w-3 h-3" /> {prop.address?.city || "Unknown City"}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3 py-3 border-y border-gray-50 dark:border-gray-800/50">
                                        <div className="w-8 h-8 rounded-full bg-brand-50/50 dark:bg-brand-500/10 flex items-center justify-center text-brand-600 dark:text-brand-400 font-bold text-xs">
                                            {prop.owner?.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-[10px] uppercase text-gray-400 font-bold tracking-tighter">Owner</p>
                                            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate">
                                                {prop.owner?.name}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                            <Users className="w-3.5 h-3.5" />
                                            <span className="text-xs font-medium">{prop.maxGuests} Guests</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                            <Maximize className="w-3.5 h-3.5" />
                                            <span className="text-xs font-medium">{prop.area} SQM</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                            <Bed className="w-3.5 h-3.5" />
                                            <span className="text-xs font-medium">{prop.bedRoom?.numBedroom || 0} Beds</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                            <Droplets className="w-3.5 h-3.5" />
                                            <span className="text-xs font-medium">{prop.restRoom?.numBathroom || 0} Baths</span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    {activeTab === "active" ? (
                                        <div className="grid grid-cols-3 gap-2 pt-2">
                                            <button
                                                onClick={() => navigate(`/property-details/${prop._id}`)}
                                                className="flex flex-col items-center justify-center p-2 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-brand-50 dark:hover:bg-brand-500/10 hover:border-brand-500/30 transition-all group/btn"
                                                title="View Details"
                                            >
                                                <Eye className="w-4 h-4 text-gray-400 group-hover/btn:text-brand-500 transition-colors" />
                                                <span className="text-[9px] mt-1 font-bold uppercase text-gray-400 group-hover/btn:text-brand-500">View</span>
                                            </button>
                                            <button
                                                onClick={() => navigate(`/property-calendar/${prop._id}`)}
                                                className="flex flex-col items-center justify-center p-2 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:border-blue-500/30 transition-all group/btn"
                                                title="Calendar"
                                            >
                                                <CalendarIcon className="w-4 h-4 text-gray-400 group-hover/btn:text-blue-500 transition-colors" />
                                                <span className="text-[9px] mt-1 font-bold uppercase text-gray-400 group-hover/btn:text-blue-500">Dates</span>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setPropertyToDelete(prop._id);
                                                    setDeleteOpen(true);
                                                }}
                                                className="flex flex-col items-center justify-center p-2 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-red-50 dark:hover:bg-red-500/10 hover:border-red-500/30 transition-all group/btn"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4 text-gray-400 group-hover/btn:text-red-500 transition-colors" />
                                                <span className="text-[9px] mt-1 font-bold uppercase text-gray-400 group-hover/btn:text-red-500">Delete</span>
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-4 gap-2 pt-2">
                                            <button
                                                onClick={() => navigate(`/property-details/${prop._id}`)}
                                                className="flex flex-col items-center justify-center p-2 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-brand-50 dark:hover:bg-brand-500/10 hover:border-brand-500/30 transition-all group/btn"
                                                title="View Details"
                                            >
                                                <Eye className="w-4 h-4 text-gray-400 group-hover/btn:text-brand-500 transition-colors" />
                                                <span className="text-[9px] mt-1 font-bold uppercase text-gray-400 group-hover/btn:text-brand-500">View</span>
                                            </button>
                                            <button
                                                disabled={approvalLoading === prop._id}
                                                onClick={() => handleApproval(prop._id, "approve")}
                                                className="flex flex-col items-center justify-center p-2 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold transition-all shadow-md shadow-green-500/20 disabled:opacity-50"
                                            >
                                                {approvalLoading === prop._id ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <CheckCircle className="w-4 h-4 mb-0.5" />}
                                                <span className="text-[9px] font-bold uppercase">Approve</span>
                                            </button>
                                            <button
                                                disabled={approvalLoading === prop._id}
                                                onClick={() => setRejectionModal({ show: true, propId: prop._id, reason: "" })}
                                                className="flex flex-col items-center justify-center p-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold transition-all shadow-md shadow-orange-500/20 disabled:opacity-50"
                                            >
                                                <XCircle className="w-4 h-4 mb-0.5" />
                                                <span className="text-[9px] font-bold uppercase">Reject</span>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setPropertyToDelete(prop._id);
                                                    setDeleteOpen(true);
                                                }}
                                                className="flex flex-col items-center justify-center p-2 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-red-50 dark:hover:bg-red-500/10 hover:border-red-500/30 transition-all group/btn"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4 text-gray-400 group-hover/btn:text-red-500 transition-colors" />
                                                <span className="text-[9px] mt-1 font-bold uppercase text-gray-400 group-hover/btn:text-red-500">Delete</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center bg-gray-50 dark:bg-gray-800/20 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
                            <p className="text-gray-500 dark:text-gray-400">No properties found</p>
                        </div>
                    )}
                </div>
            )}
            {!loading && totalPages > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(newPage) => {
                        setCurrentPage(newPage);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                />
            )}

            {/* Rejection Reason Modal */}
            {rejectionModal.show && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-6 border border-gray-100 dark:border-gray-800 scale-in-center">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-500">
                                <AlertCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold dark:text-white">Reject Property</h4>
                                <p className="text-xs text-gray-500">Please provide a reason for rejection.</p>
                            </div>
                        </div>

                        <textarea
                            className="w-full h-32 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-white/[0.03] p-4 text-sm outline-none focus:ring-2 focus:ring-brand-500/20 dark:text-gray-100"
                            placeholder="Example: Images are not clear..."
                            value={rejectionModal.reason}
                            onChange={(e) => setRejectionModal(prev => ({ ...prev, reason: e.target.value }))}
                        />

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setRejectionModal({ show: false, propId: null, reason: "" })}
                                className="flex-1 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={!rejectionModal.reason.trim() || approvalLoading}
                                onClick={() => handleApproval(rejectionModal.propId, "reject", rejectionModal.reason)}
                                className="flex-1 py-3 rounded-2xl font-bold bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
                            >
                                {approvalLoading ? "Rejecting..." : "Reject Property"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <DeleteConfirmationModal
                open={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                onConfirm={handleDeleteProperty}
                title="Delete Property"
                message="Are you sure you want to delete this property? This action cannot be undone."
            />
        </div>
    );
}
