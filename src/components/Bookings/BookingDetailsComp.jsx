import React, { useState, useEffect } from "react";
import ComponentCard from "../common/ComponentCard";
import { getBookingDetails } from "../../api/authApi";
import { useParams, useNavigate } from "react-router";
import toast from "react-hot-toast";
import Badge from "../ui/badge/Badge";
import Button from "../ui/button/Button";
import UserPropertiesList from "../Users/UserPropertiesList";
import { formatCurrency } from "../../utils/currency";
import {
    Calendar,
    Clock,
    MapPin,
    Users,
    CheckCircle2,
    XCircle,
    AlertCircle,
    CreditCard,
    Home,
    ShieldCheck,
    FileText,
    ExternalLink,
    Copy,
    Check,
    Phone,
    Mail,
    User as UserIcon,
    ArrowLeft,
    Bed,
    Bath,
    Sparkles,
    Waves,
    Receipt,
    Percent,
    AlertTriangle,
    ChevronDown,
    ChevronUp,
    Wrench,
    Package as PackageIcon,
    Timer
} from "lucide-react";

export default function BookingDetailsComp() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showProperties, setShowProperties] = useState(false);
    const [showRawJson, setShowRawJson] = useState(false);
    const [copiedKey, setCopiedKey] = useState(null);

    const baseURL = import.meta.env.VITE_API_URL || "";
    const baseImgUrl = baseURL.replace(/\/$/, "");

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);
                const res = await getBookingDetails(id);
                setBooking(res.data);
            } catch (error) {
                toast.error("Failed to load booking details");
            } finally {
                setLoading(false);
            }
        };
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

    const getStatusBadge = (status) => {
        const s = status?.toLowerCase();
        if (["confirmed", "success", "paid", "completed", "approved"].includes(s)) {
            return <Badge color="success">{status}</Badge>;
        }
        if (["pending", "approval_pending"].includes(s)) {
            return <Badge color="warning">{status}</Badge>;
        }
        if (["cancelled", "failed", "rejected"].includes(s)) {
            return <Badge color="error">{status}</Badge>;
        }
        return <Badge color="light">{status || "Unknown"}</Badge>;
    };

    const calculateNights = (checkIn, checkOut) => {
        if (!checkIn || !checkOut) return null;
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const formatTime12h = (time24) => {
        if (!time24) return "N/A";
        const parts = time24.split(":");
        if (parts.length < 2) return time24;
        let hours = parseInt(parts[0], 10);
        const minutes = parts[1];
        if (isNaN(hours)) return time24;
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;
        return `${hours}:${minutes} ${ampm}`;
    };

    const calculateTimeDuration = (startTime, endTime) => {
        if (!startTime || !endTime) return null;
        const [startH, startM] = startTime.split(":").map(Number);
        const [endH, endM] = endTime.split(":").map(Number);
        if (isNaN(startH) || isNaN(endH)) return null;
        let diffMinutes = (endH * 60 + (endM || 0)) - (startH * 60 + (startM || 0));
        if (diffMinutes < 0) diffMinutes += 24 * 60; // wrap around
        const hours = Math.floor(diffMinutes / 60);
        const mins = diffMinutes % 60;
        if (hours > 0 && mins > 0) return `${hours} hr${hours > 1 ? "s" : ""} ${mins} min`;
        if (hours > 0) return `${hours} hr${hours > 1 ? "s" : ""}`;
        return `${mins} mins`;
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-3 text-sm text-gray-500 font-medium">Loading booking details...</p>
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="text-center p-12 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Booking Not Found</h3>
                <p className="text-gray-500 text-sm mt-1 mb-4">The booking you are looking for does not exist or has been removed.</p>
                <Button onClick={() => navigate(-1)} variant="outline">
                    Go Back
                </Button>
            </div>
        );
    }

    const {
        property,
        hotel,
        user,
        services = [],
        package: pkg,
        priceBreakdown = {},
        providerBreakdown = [],
        policySnapshot,
        paymentTransaction,
        bookingType = "PROPERTY"
    } = booking;

    const isServiceBooking = bookingType?.toUpperCase() === "SERVICE" || (services.length > 0 && !property && !hotel);
    const isPackageBooking = bookingType?.toUpperCase() === "PACKAGE" || (!!pkg && !property && !hotel);
    const activeProperty = property || hotel;
    const nights = calculateNights(booking.checkIn, booking.checkOut);
    const firstService = services && services.length > 0 ? services[0] : null;

    const coordinates = activeProperty?.address?.location?.coordinates;
    const hasCoordinates = Array.isArray(coordinates) && coordinates.length === 2;
    const [longitude, latitude] = hasCoordinates ? coordinates : [null, null];

    const renderImages = (images, title, folderName, icon = <Home className="w-4 h-4" />) => {
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
                            className="relative group rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 aspect-[4/3] shadow-sm"
                        >
                            <img
                                src={`${baseImgUrl}/uploads/${folderName}/${img}`}
                                alt={`${title} ${idx + 1}`}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
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

    return (
        <div className="space-y-6 w-full pb-10">
            {/* Top Navigation & Status Banner */}
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                            title="Back"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Order #{booking.orderId || "N/A"}
                                </h1>
                                <button
                                    onClick={() => handleCopy(booking.orderId, "orderId")}
                                    className="text-gray-400 hover:text-brand-500 transition"
                                    title="Copy Order ID"
                                >
                                    {copiedKey === "orderId" ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                </button>
                                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400 border border-brand-200/50">
                                    {booking.bookingType || "SERVICE"}
                                </span>
                            </div>
                            <p className="text-xs text-gray-400 mt-0.5 font-mono flex items-center gap-1">
                                ID: {booking._id}
                                <button
                                    onClick={() => handleCopy(booking._id, "bookingId")}
                                    className="hover:text-brand-500 transition ml-1"
                                    title="Copy Booking ID"
                                >
                                    {copiedKey === "bookingId" ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-xl border border-gray-100 dark:border-gray-700">
                            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Booking:</span>
                            {getStatusBadge(booking.bookingStatus)}
                        </div>
                        <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-xl border border-gray-100 dark:border-gray-700">
                            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Payment:</span>
                            {getStatusBadge(booking.paymentStatus)}
                        </div>
                        {booking.webhookProcessed && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400 px-2.5 py-1.5 rounded-xl border border-emerald-100 dark:border-emerald-900/50">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Webhook Verified
                            </span>
                        )}
                        {booking.isAmountReleased ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/30 dark:text-blue-400 px-2.5 py-1.5 rounded-xl border border-blue-100 dark:border-blue-900/50">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Payout Released
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-400 px-2.5 py-1.5 rounded-xl border border-amber-100 dark:border-amber-900/50">
                                <Clock className="w-3.5 h-3.5" /> Payout Pending
                            </span>
                        )}
                    </div>
                </div>

                {/* Notification / Acceptance Alert if applicable */}
                {booking.pendingReason && booking.bookingStatus === "pending" && (
                    <div className="mt-4 p-3.5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-xl flex items-center justify-between gap-3 text-amber-800 dark:text-amber-300 flex-wrap">
                        <div className="flex items-center gap-2.5 text-xs font-medium">
                            <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-600" />
                            <span>
                                <strong>Pending Reason:</strong> {booking.pendingReason.replace(/_/g, " ").toUpperCase()}
                            </span>
                        </div>
                        {booking.acceptanceDeadline && (
                            <span className="text-[11px] bg-amber-100 dark:bg-amber-900/50 px-2.5 py-1 rounded-lg font-mono">
                                Acceptance Deadline: {new Date(booking.acceptanceDeadline).toLocaleString()}
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Quick Metrics 4-Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm">
                    <div className="flex items-center justify-between text-gray-400 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider">Total Amount</span>
                        <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-500/10 text-brand-500">
                            <Receipt className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-2xl font-black text-gray-900 dark:text-white">
                        {formatCurrency(booking.totalAmount || booking.amount || 0)}
                    </p>
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
                        <span>Paid via Tap Gateway</span>
                    </div>
                </div>

                {/* Metric 2: Schedule / Date */}
                <div className="p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm">
                    <div className="flex items-center justify-between text-gray-400 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider">
                            {isServiceBooking ? "Service Timing" : "Stay Duration"}
                        </span>
                        <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-500">
                            <Calendar className="w-4 h-4" />
                        </div>
                    </div>
                    {isServiceBooking && firstService ? (
                        <>
                            <p className="text-lg font-black text-gray-900 dark:text-white">
                                {firstService.serviceDate ? new Date(firstService.serviceDate).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "Date N/A"}
                            </p>
                            <p className="mt-1 text-xs text-gray-500 flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-blue-500" />
                                {formatTime12h(firstService.serviceStartTime)} - {formatTime12h(firstService.serviceEndTime)}
                                {firstService.serviceStartTime && firstService.serviceEndTime && (
                                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                                        ({calculateTimeDuration(firstService.serviceStartTime, firstService.serviceEndTime)})
                                    </span>
                                )}
                            </p>
                        </>
                    ) : (
                        <>
                            <p className="text-2xl font-black text-gray-900 dark:text-white">
                                {nights !== null ? `${nights} ${nights === 1 ? "Night" : "Nights"}` : "N/A"}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                                {booking.checkIn ? new Date(booking.checkIn).toLocaleDateString() : ""} - {booking.checkOut ? new Date(booking.checkOut).toLocaleDateString() : ""}
                            </p>
                        </>
                    )}
                </div>

                {/* Metric 3: Guests / Attendees */}
                <div className="p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm">
                    <div className="flex items-center justify-between text-gray-400 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider">Guests</span>
                        <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-500">
                            <Users className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-2xl font-black text-gray-900 dark:text-white">
                        {(booking.adults || 0) + (booking.children || 0)} <span className="text-sm font-normal text-gray-400">Total</span>
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                        {booking.adults || 0} Adults, {booking.children || 0} Children
                    </p>
                </div>

                {/* Metric 4: Provider Payout */}
                <div className="p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm">
                    <div className="flex items-center justify-between text-gray-400 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider">Provider Payout</span>
                        <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500">
                            <CreditCard className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-2xl font-black text-gray-900 dark:text-white">
                        {formatCurrency(booking.providerAmount || 0)}
                    </p>
                    <p className="mt-1 text-xs text-gray-500 flex items-center gap-1">
                        Status: <span className="font-semibold uppercase text-brand-500">{providerBreakdown[0]?.payoutReleaseStatus || (booking.isAmountReleased ? "RELEASED" : "PENDING")}</span>
                    </p>
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 Columns */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Booked Services Details (Prominent when bookingType is SERVICE or services present) */}
                    {services && services.length > 0 && (
                        <ComponentCard title={isServiceBooking ? "Booked Service Details" : "Additional Booked Services"}>
                            <div className="space-y-4">
                                {services.map((item, idx) => {
                                    const serviceInfo = item.service || {};
                                    const durationStr = calculateTimeDuration(item.serviceStartTime, item.serviceEndTime);

                                    return (
                                        <div
                                            key={item._id || idx}
                                            className="p-5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40 space-y-4 shadow-sm"
                                        >
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-200/60 dark:border-gray-700/60">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-xl bg-brand-500/10 dark:bg-brand-500/20 text-brand-500 flex items-center justify-center flex-shrink-0">
                                                        <Wrench className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                                                {serviceInfo.name || item.name || "Service Item"}
                                                            </h3>
                                                            {serviceInfo._id && (
                                                                <button
                                                                    onClick={() => navigate(`/service-details/${serviceInfo._id}`)}
                                                                    className="inline-flex items-center gap-1 text-xs text-brand-500 hover:underline font-semibold"
                                                                    title="View Service Details"
                                                                >
                                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                                    View Service
                                                                </button>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-gray-400 font-mono mt-0.5">
                                                            Service ID: {serviceInfo._id || item._id}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="text-right">
                                                    <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Service Fee</span>
                                                    <p className="text-xl font-black text-brand-500 dark:text-white">
                                                        {formatCurrency(item.price || serviceInfo.price || 0)}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Service Schedule Breakdown Cards */}
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                {/* Scheduled Date */}
                                                <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700/60">
                                                    <div className="flex items-center gap-1.5 text-xs text-gray-400 uppercase font-semibold mb-1">
                                                        <Calendar className="w-3.5 h-3.5 text-brand-500" />
                                                        <span>Service Date</span>
                                                    </div>
                                                    <p className="font-bold text-sm text-gray-900 dark:text-white">
                                                        {item.serviceDate ? new Date(item.serviceDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : "N/A"}
                                                    </p>
                                                </div>

                                                {/* Time Slot */}
                                                <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700/60">
                                                    <div className="flex items-center gap-1.5 text-xs text-gray-400 uppercase font-semibold mb-1">
                                                        <Clock className="w-3.5 h-3.5 text-blue-500" />
                                                        <span>Time Slot</span>
                                                    </div>
                                                    <p className="font-bold text-sm text-gray-900 dark:text-white">
                                                        {formatTime12h(item.serviceStartTime)} - {formatTime12h(item.serviceEndTime)}
                                                    </p>
                                                </div>

                                                {/* Slot Duration */}
                                                <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700/60">
                                                    <div className="flex items-center gap-1.5 text-xs text-gray-400 uppercase font-semibold mb-1">
                                                        <Timer className="w-3.5 h-3.5 text-purple-500" />
                                                        <span>Duration</span>
                                                    </div>
                                                    <p className="font-bold text-sm text-gray-900 dark:text-white">
                                                        {durationStr || "Flexible"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </ComponentCard>
                    )}

                    {/* Booking Schedule & Information Card */}
                    <ComponentCard title={isServiceBooking ? "Booking Schedule & Timestamps" : "Stay & Booking Schedule"}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {booking.checkIn && (
                                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
                                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                                        <Calendar className="w-4 h-4 text-brand-500" />
                                        <span>Check-In</span>
                                    </div>
                                    <p className="text-base font-bold text-gray-900 dark:text-white">
                                        {new Date(booking.checkIn).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5" />
                                        Time: {activeProperty?.policies?.checkInTime || "N/A"}
                                    </p>
                                </div>
                            )}

                            {booking.checkOut && (
                                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
                                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                                        <Calendar className="w-4 h-4 text-brand-500" />
                                        <span>Check-Out</span>
                                    </div>
                                    <p className="text-base font-bold text-gray-900 dark:text-white">
                                        {new Date(booking.checkOut).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5" />
                                        Time: {activeProperty?.policies?.checkOutTime || "N/A"}
                                    </p>
                                </div>
                            )}

                            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
                                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                                    <Users className="w-4 h-4 text-brand-500" />
                                    <span>Guests Count</span>
                                </div>
                                <p className="text-base font-bold text-gray-900 dark:text-white">
                                    {booking.adults || 0} Adults, {booking.children || 0} Children
                                </p>
                                {activeProperty?.maxGuests && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        Max Capacity: {activeProperty.maxGuests} Guests
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Extra metadata list */}
                        <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                            <div>
                                <span className="text-gray-400 uppercase font-semibold text-[10px] tracking-wider block">Created On</span>
                                <p className="font-medium text-gray-800 dark:text-gray-200 mt-0.5">
                                    {booking.createdAt ? new Date(booking.createdAt).toLocaleString() : "N/A"}
                                </p>
                            </div>
                            <div>
                                <span className="text-gray-400 uppercase font-semibold text-[10px] tracking-wider block">Last Updated</span>
                                <p className="font-medium text-gray-800 dark:text-gray-200 mt-0.5">
                                    {booking.updatedAt ? new Date(booking.updatedAt).toLocaleString() : "N/A"}
                                </p>
                            </div>
                            <div>
                                <span className="text-gray-400 uppercase font-semibold text-[10px] tracking-wider block">Review Status</span>
                                <p className="font-medium text-gray-800 dark:text-gray-200 mt-0.5">
                                    {booking.reviewGiven ? (
                                        <span className="text-green-600 font-semibold">Review Submitted</span>
                                    ) : (
                                        <span className="text-gray-400">Not Reviewed</span>
                                    )}
                                </p>
                            </div>
                            <div>
                                <span className="text-gray-400 uppercase font-semibold text-[10px] tracking-wider block">Check-in Notified</span>
                                <p className="font-medium text-gray-800 dark:text-gray-200 mt-0.5">
                                    {booking.isCheckInNotified ? "Yes" : "No"}
                                </p>
                            </div>
                        </div>
                    </ComponentCard>

                    {/* Booked Package Details (if present) */}
                    {pkg && (
                        <ComponentCard title="Booked Package Details">
                            <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                                        <PackageIcon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-gray-900 dark:text-white">{pkg.name || "Package"}</h4>
                                            {pkg._id && (
                                                <button
                                                    onClick={() => navigate(`/package-details/${pkg._id}`)}
                                                    className="inline-flex items-center gap-1 text-xs text-brand-500 hover:underline"
                                                >
                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500">{pkg.description || "No description provided"}</p>
                                    </div>
                                </div>
                                <p className="font-bold text-gray-900 dark:text-white text-base">
                                    {formatCurrency(pkg.price || 0)}
                                </p>
                            </div>
                        </ComponentCard>
                    )}

                    {/* Property Details & Gallery (if present) */}
                    {activeProperty && (
                        <ComponentCard title="Booked Property Information">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-gray-100 dark:border-gray-800">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white capitalize">
                                            {activeProperty.name || "Untitled Property"}
                                        </h3>
                                        <button
                                            onClick={() => navigate(`/property-details/${activeProperty._id}`)}
                                            className="inline-flex items-center gap-1 text-xs text-brand-500 hover:text-brand-600 font-semibold transition"
                                            title="Open property details page"
                                        >
                                            <ExternalLink className="w-3.5 h-3.5" />
                                            View Property
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500 dark:text-gray-400 flex-wrap">
                                        <span className="flex items-center gap-1">
                                            <MapPin className="w-3.5 h-3.5 text-red-500" />
                                            City: <strong>{activeProperty.address?.city || "N/A"}</strong>
                                        </span>
                                        {hasCoordinates && (
                                            <a
                                                href={`https://www.google.com/maps?q=${latitude},${longitude}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-blue-500 hover:underline"
                                            >
                                                <span>[{latitude?.toFixed(4)}, {longitude?.toFixed(4)}]</span>
                                                <ExternalLink className="w-3 h-3" />
                                            </a>
                                        )}
                                        <span>•</span>
                                        <span>Base Price: <strong>{formatCurrency(activeProperty.price || 0)}</strong> / night</span>
                                        <span>•</span>
                                        <span>Max Guests: <strong>{activeProperty.maxGuests || "N/A"}</strong></span>
                                    </div>
                                </div>
                            </div>

                            {activeProperty.description && (
                                <div className="my-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Description</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                                        {activeProperty.description}
                                    </p>
                                </div>
                            )}

                            {/* Media Galleries */}
                            <div className="mt-6 space-y-6">
                                {renderImages(activeProperty.media?.mainImage, "Main Image", "mainImage", <Home className="w-4 h-4 text-brand-500" />)}
                                {renderImages(activeProperty.media?.bedroom, "Bedrooms", "bedroom", <Bed className="w-4 h-4 text-indigo-500" />)}
                                {renderImages(activeProperty.media?.bathroom, "Bathrooms", "bathroom", <Bath className="w-4 h-4 text-cyan-500" />)}
                                {renderImages(activeProperty.media?.pool, "Pool & Outdoors", "pool", <Waves className="w-4 h-4 text-blue-500" />)}
                            </div>
                        </ComponentCard>
                    )}

                    {/* Cancellation Policy Snapshot */}
                    {policySnapshot && (
                        <ComponentCard title="Cancellation Policy">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-100 dark:border-gray-800">
                                    <div>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Policy Type</span>
                                        <p className="text-base font-bold text-gray-900 dark:text-white capitalize">
                                            {policySnapshot.name || "Standard Policy"}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Cancellation Fee</span>
                                        <p className="text-base font-bold text-brand-500 dark:text-white">
                                            {formatCurrency(policySnapshot.cancellationFee || 0)}
                                        </p>
                                    </div>
                                </div>

                                {policySnapshot.rules && policySnapshot.rules.length > 0 && (
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                                            Refund Rules Breakdown
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {policySnapshot.rules.map((rule, index) => (
                                                <div
                                                    key={rule._id || index}
                                                    className="p-3.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 flex items-center justify-between shadow-xs"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <div className="p-2 rounded-lg bg-green-50 dark:bg-green-950/30 text-green-600">
                                                            <Percent className="w-4 h-4" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-bold text-gray-900 dark:text-white">
                                                                {rule.refundPercentage}% Refund
                                                            </p>
                                                            <p className="text-[11px] text-gray-500">
                                                                Cancel up to {rule.from} {rule.unit} before
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Badge color="success">{rule.refundPercentage}%</Badge>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {booking.isCancelled && (
                                    <div className="p-3.5 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-xl flex items-center justify-between text-xs text-red-700 dark:text-red-400">
                                        <span><strong>Booking is Cancelled</strong></span>
                                        <span>Refund Status: <strong>{booking.refundStatus || "N/A"}</strong> ({formatCurrency(booking.refundAmount || 0)})</span>
                                    </div>
                                )}
                            </div>
                        </ComponentCard>
                    )}

                    {/* House Rules & Policies (if property booking) */}
                    {activeProperty?.policies && (
                        <ComponentCard title="House Rules & Policies">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                                <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">Pets Allowed</span>
                                    <Badge color={activeProperty.policies.houseRules?.petsAllowed ? "success" : "light"}>
                                        {activeProperty.policies.houseRules?.petsAllowed ? "Allowed" : "Not Allowed"}
                                    </Badge>
                                </div>
                                <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">Smoking Allowed</span>
                                    <Badge color={activeProperty.policies.houseRules?.smokingAllowed ? "success" : "light"}>
                                        {activeProperty.policies.houseRules?.smokingAllowed ? "Allowed" : "Not Allowed"}
                                    </Badge>
                                </div>
                                <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">Parties Allowed</span>
                                    <Badge color={activeProperty.policies.houseRules?.partiesAllowed ? "success" : "light"}>
                                        {activeProperty.policies.houseRules?.partiesAllowed ? "Allowed" : "Not Allowed"}
                                    </Badge>
                                </div>
                            </div>

                            {activeProperty.policies.additionalPolicies?.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Additional Policies
                                    </h4>
                                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {activeProperty.policies.additionalPolicies.map((policy, idx) => (
                                            <li
                                                key={idx}
                                                className="flex items-center gap-2 p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/30 text-xs text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-gray-800"
                                            >
                                                <div className="w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0" />
                                                <span>{policy}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </ComponentCard>
                    )}
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                    {/* Customer Information Card */}
                    <ComponentCard title="Customer Information">
                        <div className="flex flex-col items-center text-center pb-5 border-b border-gray-100 dark:border-gray-800">
                            <div className="w-18 h-18 rounded-full overflow-hidden border-2 border-brand-500/20 mb-3 bg-brand-50 dark:bg-brand-950/40 flex items-center justify-center text-brand-500 shadow-sm">
                                {user?.profile ? (
                                    <img
                                        src={`${baseImgUrl}/uploads/users/${user.profile}`}
                                        alt="User Profile"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.style.display = "none";
                                        }}
                                    />
                                ) : (
                                    <span className="text-2xl font-black uppercase">
                                        {user?.email?.charAt(0) || "U"}
                                    </span>
                                )}
                            </div>
                            <h4 className="text-base font-bold text-gray-900 dark:text-white capitalize">
                                {user?.name || user?.email?.split("@")[0] || "User"}
                            </h4>
                            <p className="text-xs text-gray-400 mt-0.5">{user?.email || "No email"}</p>
                        </div>

                        <div className="space-y-3.5 pt-4 text-xs">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-400 flex items-center gap-1.5 font-medium">
                                    <Phone className="w-3.5 h-3.5" /> Phone
                                </span>
                                {user?.phone ? (
                                    <a
                                        href={`tel:${user.phone}`}
                                        className="font-semibold text-gray-900 dark:text-white hover:text-brand-500 transition"
                                    >
                                        {user.phone}
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
                                    href={`mailto:${user?.email}`}
                                    className="font-semibold text-gray-900 dark:text-white hover:text-brand-500 transition truncate max-w-[180px]"
                                >
                                    {user?.email || "N/A"}
                                </a>
                            </div>

                            <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                                <span className="text-gray-400 uppercase font-semibold text-[10px] tracking-wider block mb-1">
                                    User ID
                                </span>
                                <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-2 rounded-lg font-mono text-[11px] text-gray-600 dark:text-gray-300">
                                    <span className="truncate mr-2">{user?._id || "N/A"}</span>
                                    <button
                                        onClick={() => handleCopy(user?._id, "userId")}
                                        className="text-gray-400 hover:text-brand-500"
                                        title="Copy User ID"
                                    >
                                        {copiedKey === "userId" ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {user?._id && (
                            <div className="mt-5">
                                <Button
                                    onClick={() => setShowProperties(!showProperties)}
                                    variant="outline"
                                    className="w-full py-2.5 text-xs font-semibold"
                                >
                                    {showProperties ? "Hide User Properties" : "View User Properties"}
                                </Button>
                            </div>
                        )}
                    </ComponentCard>

                    {/* Financial Summary */}
                    <ComponentCard title="Financial Breakdown">
                        <div className="space-y-3 text-xs">
                            {(priceBreakdown.propertyPrice > 0 || (activeProperty?.price && !isServiceBooking)) && (
                                <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
                                    <span>Property Price</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        {formatCurrency(priceBreakdown.propertyPrice || activeProperty?.price || 0)}
                                    </span>
                                </div>
                            )}

                            {(priceBreakdown.packagePrice > 0 || pkg) && (
                                <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
                                    <span>Package Price</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        {formatCurrency(priceBreakdown.packagePrice || pkg?.price || 0)}
                                    </span>
                                </div>
                            )}

                            {(priceBreakdown.servicePrice > 0 || isServiceBooking) && (
                                <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
                                    <span>Service Price</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        {formatCurrency(priceBreakdown.servicePrice || firstService?.price || 0)}
                                    </span>
                                </div>
                            )}

                            <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
                                <span>Platform Fee</span>
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    + {formatCurrency(booking.platformFee || 0)}
                                </span>
                            </div>

                            <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
                                <span>Tax (VAT)</span>
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    + {formatCurrency(booking.tax || 0)}
                                </span>
                            </div>

                            {booking.couponId && (
                                <div className="flex justify-between items-center text-green-600 dark:text-green-400">
                                    <span>Coupon Discount</span>
                                    <span className="font-semibold">- {formatCurrency(booking.discountAmount || 0)}</span>
                                </div>
                            )}

                            <div className="flex justify-between items-center text-gray-500 pt-2 border-t border-dashed border-gray-200 dark:border-gray-700">
                                <span className="italic">Provider Amount (Net)</span>
                                <span className="font-bold text-gray-800 dark:text-gray-200">
                                    {formatCurrency(booking.providerAmount || 0)}
                                </span>
                            </div>

                            <div className="flex justify-between items-center text-gray-500">
                                <span className="italic">Admin Commission</span>
                                <span className="font-semibold text-emerald-600">
                                    {formatCurrency(booking.commissionAmount || 0)}
                                </span>
                            </div>

                            <div className="flex justify-between items-center font-black text-lg pt-3 border-t border-gray-200 dark:border-gray-700 mt-3 text-gray-900 dark:text-white">
                                <span>Total Paid</span>
                                <span className="text-brand-500 dark:text-white">
                                    {formatCurrency(booking.totalAmount || booking.amount || 0)}
                                </span>
                            </div>
                        </div>
                    </ComponentCard>

                    {/* Provider Breakdown Card */}
                    {providerBreakdown && providerBreakdown.length > 0 && (
                        <ComponentCard title="Provider Payout Breakdown">
                            <div className="space-y-3">
                                {providerBreakdown.map((item, idx) => (
                                    <div
                                        key={item._id || idx}
                                        className="p-3.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40 space-y-2 text-xs"
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold uppercase tracking-wider text-[10px] text-gray-400">
                                                Type: {item.type || (isServiceBooking ? "Service" : "Property")}
                                            </span>
                                            <Badge color={item.payoutReleaseStatus === "RELEASED" ? "success" : "warning"}>
                                                {item.payoutReleaseStatus || "PENDING"}
                                            </Badge>
                                        </div>
                                        <div className="flex justify-between items-center font-bold text-sm text-gray-900 dark:text-white">
                                            <span>Allocated Payout:</span>
                                            <span className="text-emerald-600 dark:text-emerald-400">
                                                {formatCurrency(item.amount || 0)}
                                            </span>
                                        </div>
                                        <div className="pt-1.5 border-t border-gray-200/50 dark:border-gray-700/50 flex flex-col gap-1 text-[11px] text-gray-500 font-mono">
                                            <span>Provider ID: {item.user}</span>
                                            <span>Ref ID: {item.referenceId}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ComponentCard>
                    )}

                    {/* Payment Gateway Transaction (Tap) */}
                    {paymentTransaction && (
                        <ComponentCard title="Payment & Gateway Details">
                            <div className="space-y-3 text-xs">
                                <div>
                                    <span className="text-gray-400 uppercase font-semibold text-[10px] tracking-wider block">
                                        Tap Charge ID
                                    </span>
                                    <div className="flex items-center justify-between bg-blue-50/50 dark:bg-blue-950/20 p-2 rounded-lg border border-blue-100 dark:border-blue-900/30 mt-1">
                                        <span className="font-mono text-blue-600 dark:text-blue-400 font-semibold truncate mr-2">
                                            {booking.tapChargeId || paymentTransaction.tapChargeId}
                                        </span>
                                        <button
                                            onClick={() => handleCopy(booking.tapChargeId || paymentTransaction.tapChargeId, "chargeId")}
                                            className="text-gray-400 hover:text-blue-500"
                                            title="Copy Charge ID"
                                        >
                                            {copiedKey === "chargeId" ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500">Transaction Status</span>
                                    {getStatusBadge(paymentTransaction.status)}
                                </div>

                                {paymentTransaction.rawResponse?.status && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500">Gateway Status</span>
                                        <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase text-[11px]">
                                            {paymentTransaction.rawResponse.status}
                                        </span>
                                    </div>
                                )}

                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500">Currency</span>
                                    <span className="font-bold text-gray-900 dark:text-white">
                                        {paymentTransaction.currency || "SAR"}
                                    </span>
                                </div>

                                <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                                    <span className="text-gray-400 uppercase font-semibold text-[10px] tracking-wider block mb-1">
                                        Transaction ID
                                    </span>
                                    <p className="font-mono text-[11px] text-gray-500 break-all">
                                        {paymentTransaction._id}
                                    </p>
                                </div>

                                {/* Collapsible JSON */}
                                {paymentTransaction.rawResponse && (
                                    <div className="pt-2">
                                        <button
                                            onClick={() => setShowRawJson(!showRawJson)}
                                            className="w-full flex items-center justify-between py-2 text-xs font-semibold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                        >
                                            <span>Raw Gateway Response</span>
                                            {showRawJson ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                        </button>
                                        {showRawJson && (
                                            <pre className="mt-2 p-3 bg-gray-900 text-gray-300 rounded-xl text-[10px] overflow-auto max-h-56 scrollbar-hide">
                                                {JSON.stringify(paymentTransaction.rawResponse, null, 2)}
                                            </pre>
                                        )}
                                    </div>
                                )}
                            </div>
                        </ComponentCard>
                    )}
                </div>
            </div>

            {/* Collapsible / Expandable User Properties List */}
            {showProperties && (
                <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <UserPropertiesList userId={user?._id} />
                </div>
            )}
        </div>
    );
}
