import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import { getSinglePackageAdmin } from "../../api/authApi";
import {
    ArrowLeft,
    Home,
    Wrench,
    CircleDollarSign,
    MapPin,
    CheckCircle2,
    Package,
    Mail,
    User,
    Calendar,
} from "lucide-react";
import toast from "react-hot-toast";

export default function PackageDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pkg, setPkg] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);
                const res = await getSinglePackageAdmin(id);
                setPkg(res.data);
            } catch (error) {
                toast.error("Failed to load package details");
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="text-center">
                    <div className="inline-block w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-3 text-sm text-gray-400 font-medium">Loading package details...</p>
                </div>
            </div>
        );
    }

    if (!pkg) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <p className="text-sm text-red-500 font-bold">Package not found.</p>
            </div>
        );
    }

    // Calculate component costs
    const totalServiceCost = pkg.services?.reduce((sum, s) => sum + (s.price || 0), 0) || 0;

    return (
        <>
            <PageMeta title={`${pkg.name} | Out Admin`} />
            <PageBreadcrumb pageTitle="Package Details" />

            {/* <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl text-gray-400 hover:text-brand-500 transition-all shadow-sm"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <PageBreadcrumb pageTitle="Package Details" />
                    </div>
                </div>
            </div> */}

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 pb-10">

                {/* ===== LEFT: MAIN CONTENT ===== */}
                <div className="xl:col-span-2 space-y-6">

                    {/* Package Header Card */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="p-3 bg-brand-500/10 rounded-2xl text-brand-500">
                                <Package size={24} />
                            </div>
                            <div className="flex-1">
                                <h1 className="text-xl font-black text-gray-900 dark:text-white">{pkg.name}</h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                                    {pkg.description || "No description provided."}
                                </p>
                            </div>
                            <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider ${pkg.isActive
                                ? "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400"
                                : "bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400"
                                }`}>
                                {pkg.isActive ? "Active" : "Inactive"}
                            </span>
                        </div>

                        {/* Stats Row */}
                        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-50 dark:border-gray-800">
                            <div className="text-center p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.03]">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Bundle Price</p>
                                <p className="text-2xl font-black text-brand-500">₹{pkg.price?.toLocaleString()}</p>
                            </div>
                            <div className="text-center p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.03]">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Services Cost</p>
                                <p className="text-2xl font-black text-orange-500">₹{totalServiceCost.toLocaleString()}</p>
                            </div>
                            <div className="text-center p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.03]">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Created</p>
                                <p className="text-sm font-bold text-gray-700 dark:text-gray-200 mt-1">
                                    {new Date(pkg.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Included Property */}
                    <ComponentCard title="Linked Property">
                        <div
                            className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 hover:border-brand-500/30 transition-all cursor-pointer group"
                            onClick={() => navigate(`/property-details/${pkg.property?._id}`)}
                        >
                            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 shadow-sm border border-blue-500/10">
                                <Home size={24} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-brand-500 transition-colors capitalize">
                                    {pkg.property?.name}
                                </h3>
                                <p className="text-[10px] text-gray-400 font-medium mt-0.5 flex items-center gap-1">
                                    <MapPin size={10} />
                                    Property ID: {pkg.property?._id?.slice(-8).toUpperCase()}
                                </p>
                            </div>
                            <span className="text-[10px] font-bold text-brand-500 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                                View →
                            </span>
                        </div>
                    </ComponentCard>

                    {/* Included Services */}
                    <ComponentCard title={`Included Services (${pkg.services?.length || 0})`}>
                        <div className="space-y-3">
                            {pkg.services?.length > 0 ? (
                                pkg.services.map((service, index) => (
                                    <div
                                        key={service._id}
                                        className="flex items-start gap-4 p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all"
                                    >
                                        <div className="p-2.5 bg-orange-500/10 rounded-xl text-orange-500 mt-0.5">
                                            <Wrench size={18} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-4">
                                                <h4 className="text-sm font-bold text-gray-900 dark:text-white capitalize">{service.name}</h4>
                                                <span className="text-sm font-black text-orange-600 dark:text-orange-400 whitespace-nowrap">
                                                    ₹{service.price?.toLocaleString()}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1 leading-relaxed line-clamp-2">
                                                {service.description || "No description available for this service."}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 text-gray-400 text-xs">
                                    No services linked to this package.
                                </div>
                            )}
                        </div>
                    </ComponentCard>
                </div>

                {/* ===== RIGHT: SIDEBAR ===== */}
                <div className="space-y-6">

                    {/* Provider Info */}
                    <ComponentCard title="Package Provider">
                        <div className="flex flex-col items-center text-center p-4">
                            <div className="w-20 h-20 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-500 mb-4 border-2 border-brand-500/20">
                                <span className="text-2xl font-black">
                                    {pkg.user?.firstName?.charAt(0)?.toUpperCase()}{pkg.user?.lastName?.charAt(0)?.toUpperCase()}
                                </span>
                            </div>
                            <h3 className="text-base font-black text-gray-900 dark:text-white capitalize">
                                {pkg.user?.firstName} {pkg.user?.lastName}
                            </h3>
                            <p className="text-[10px] text-brand-500 font-bold uppercase tracking-widest mt-1">Vendor</p>

                            <div className="w-full mt-6 space-y-3">
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/[0.03] text-left">
                                    <Mail size={14} className="text-gray-400" />
                                    <p className="text-xs text-gray-600 dark:text-gray-300 truncate">{pkg.user?.email}</p>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/[0.03] text-left">
                                    <User size={14} className="text-gray-400" />
                                    <p className="text-xs text-gray-600 dark:text-gray-300">ID: {pkg.user?._id?.slice(-8).toUpperCase()}</p>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate(`/vendor-details/${pkg.user?._id}`)}
                                className="w-full mt-6 py-3 rounded-xl bg-brand-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-brand-500/20 hover:bg-brand-600 active:scale-[0.98] transition-all"
                            >
                                View Vendor Profile
                            </button>
                        </div>
                    </ComponentCard>

                    {/* Location Info */}
                    {pkg.location?.coordinates && (
                        <ComponentCard title="Location">
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/[0.03]">
                                <MapPin size={16} className="text-brand-500" />
                                <div>
                                    <p className="text-xs font-bold text-gray-700 dark:text-gray-200">Coordinates</p>
                                    <p className="text-[10px] text-gray-400 mt-0.5">
                                        {pkg.location.coordinates[1]?.toFixed(4)}, {pkg.location.coordinates[0]?.toFixed(4)}
                                    </p>
                                </div>
                            </div>
                        </ComponentCard>
                    )}

                    {/* Quick Summary */}
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 text-white shadow-xl">
                        <div className="flex items-center gap-2 mb-4">
                            <CircleDollarSign size={16} className="text-brand-400" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-400">Price Breakdown</span>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-400">Property Stay</span>
                                <span className="font-bold">₹{(pkg.price - totalServiceCost).toLocaleString()}</span>
                            </div>
                            {pkg.services?.map((s) => (
                                <div key={s._id} className="flex justify-between items-center text-xs">
                                    <span className="text-gray-400 capitalize">{s.name}</span>
                                    <span className="font-bold">₹{s.price?.toLocaleString()}</span>
                                </div>
                            ))}
                            <div className="border-t border-white/10 pt-3 mt-3 flex justify-between items-center">
                                <span className="text-xs font-bold text-gray-300">Total Bundle</span>
                                <span className="text-lg font-black text-brand-400">₹{pkg.price?.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
