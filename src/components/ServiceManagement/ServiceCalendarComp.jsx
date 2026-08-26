import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ComponentCard from "../common/ComponentCard";
import Badge from "../ui/badge/Badge";
import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";
import { getAdminServiceBookingCalendar } from "../../api/authApi";
import { useModal } from "../../hooks/useModal";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import {
    CalendarCheck,
    CalendarRange,
    Moon,
    CalendarX,
    Clock,
    User,
    Phone,
    Mail,
    ExternalLink,
    ChevronRight,
    Sparkles,
    Calendar as CalendarIcon,
    CheckCircle2,
    AlertCircle,
    Info
} from "lucide-react";

const formatTime12h = (timeStr) => {
    if (!timeStr) return "";
    const parts = timeStr.split(":");
    let hour = parseInt(parts[0], 10);
    const minute = parts[1] || "00";
    if (isNaN(hour)) return timeStr;
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
};

const formatSlotRange12h = (slotStr) => {
    if (!slotStr) return "";
    const parts = slotStr.split(" - ");
    if (parts.length === 2) {
        return `${formatTime12h(parts[0])} - ${formatTime12h(parts[1])}`;
    }
    return slotStr;
};

export default function ServiceCalendarComp({ serviceId }) {
    const navigate = useNavigate();
    const { isOpen, openModal, closeModal } = useModal();
    const [selectedDayData, setSelectedDayData] = useState(null);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [serviceInfo, setServiceInfo] = useState(null);
    const [summary, setSummary] = useState({
        totalBookedDays: 0,
        confirmedBookingsCount: 0,
        pendingBookingsCount: 0,
        cancelledBookingsCount: 0,
        workingDays: [],
        workingHours: null
    });
    const [counts, setCounts] = useState({
        available: 0,
        booked: 0,
        pending: 0,
        blocked: 0
    });
    const [pendingBookingsList, setPendingBookingsList] = useState([]);
    const [confirmedBookingsList, setConfirmedBookingsList] = useState([]);
    const [calendarDataMap, setCalendarDataMap] = useState(new Map());
    const [activeTab, setActiveTab] = useState("calendar"); // "calendar" | "pending" | "confirmed"

    useEffect(() => {
        const fetchCalendarData = async () => {
            try {
                setLoading(true);
                const res = await getAdminServiceBookingCalendar(serviceId);
                
                if (res.service) {
                    setServiceInfo(res.service);
                }
                if (res.summary) {
                    setSummary(res.summary);
                }

                const pending = res.pendingBookings || [];
                const confirmed = res.confirmedBookings || [];
                const cancelled = res.cancelledBookings || [];
                const calendarDays = res.calendar || [];

                setPendingBookingsList(pending);
                setConfirmedBookingsList(confirmed);

                const dayMap = new Map();
                const eventList = [];

                let availableCount = 0;
                let bookedCount = 0;
                let pendingCount = 0;
                let blockedCount = 0;

                // Index all calendar days
                calendarDays.forEach((day) => {
                    dayMap.set(day.date, day);
                    const isWorking = day.isWorkingDay !== false;
                    
                    // Check if day has any pending or booked slots
                    const hasPendingSlot = day.slots?.some((s) => s.status === "PENDING" || (s.booking && s.booking.bookingStatus === "pending"));
                    const hasBookedSlot = day.slots?.some((s) => s.status === "BOOKED" || (s.booking && s.booking.bookingStatus === "confirmed"));

                    if (!isWorking) {
                        blockedCount++;
                    } else if (hasBookedSlot) {
                        bookedCount++;
                    } else if (hasPendingSlot) {
                        pendingCount++;
                    } else {
                        availableCount++;
                    }
                });

                // Helper for event styling
                const getEventStyles = (status) => {
                    switch (status?.toUpperCase()) {
                        case "PENDING":
                            return {
                                bg: "#fef3c7",
                                border: "#f59e0b",
                                text: "#92400e",
                                label: "Pending"
                            };
                        case "CONFIRMED":
                        case "BOOKED":
                            return {
                                bg: "#fee2e2",
                                border: "#ef4444",
                                text: "#991b1b",
                                label: "Booked"
                            };
                        case "CANCELLED":
                            return {
                                bg: "#f3f4f6",
                                border: "#9ca3af",
                                text: "#4b5563",
                                label: "Cancelled"
                            };
                        default:
                            return {
                                bg: "#d1fae5",
                                border: "#10b981",
                                text: "#065f46",
                                label: "Available"
                            };
                    }
                };

                // Add pending bookings to events
                pending.forEach((b) => {
                    const s = b.services?.[0];
                    const dateStr = s?.serviceDate ? s.serviceDate.substring(0, 10) : (b.checkIn ? b.checkIn.substring(0, 10) : "");
                    const startTime = s?.serviceStartTime || "00:00";
                    const endTime = s?.serviceEndTime || "23:59";
                    const guestName = b.user?.firstName ? `${b.user.firstName} ${b.user.lastName || ""}`.trim() : "Guest";
                    const style = getEventStyles("PENDING");

                    if (dateStr) {
                        eventList.push({
                            id: `pending-${b._id}`,
                            title: `⏳ ${guestName} (${formatTime12h(startTime)} - ${formatTime12h(endTime)})`,
                            start: `${dateStr}T${startTime}:00`,
                            end: `${dateStr}T${endTime}:00`,
                            backgroundColor: style.bg,
                            borderColor: style.border,
                            textColor: style.text,
                            extendedProps: {
                                booking: b,
                                status: "PENDING",
                                type: "booking",
                                slotTime: `${startTime} - ${endTime}`
                            }
                        });
                    }
                });

                // Add confirmed bookings to events
                confirmed.forEach((b) => {
                    const s = b.services?.[0];
                    const dateStr = s?.serviceDate ? s.serviceDate.substring(0, 10) : (b.checkIn ? b.checkIn.substring(0, 10) : "");
                    const startTime = s?.serviceStartTime || "00:00";
                    const endTime = s?.serviceEndTime || "23:59";
                    const guestName = b.user?.firstName ? `${b.user.firstName} ${b.user.lastName || ""}`.trim() : "Guest";
                    const style = getEventStyles("CONFIRMED");

                    if (dateStr) {
                        eventList.push({
                            id: `confirmed-${b._id}`,
                            title: `✓ ${guestName} (${formatTime12h(startTime)} - ${formatTime12h(endTime)})`,
                            start: `${dateStr}T${startTime}:00`,
                            end: `${dateStr}T${endTime}:00`,
                            backgroundColor: style.bg,
                            borderColor: style.border,
                            textColor: style.text,
                            extendedProps: {
                                booking: b,
                                status: "CONFIRMED",
                                type: "booking",
                                slotTime: `${startTime} - ${endTime}`
                            }
                        });
                    }
                });

                setCalendarDataMap(dayMap);
                setEvents(eventList);
                setCounts({
                    available: availableCount,
                    booked: bookedCount || confirmed.length,
                    pending: pendingCount || pending.length,
                    blocked: blockedCount
                });
            } catch (error) {
                toast.error("Failed to load service calendar data");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (serviceId) {
            fetchCalendarData();
        }
    }, [serviceId]);

    const handleDateClick = (arg) => {
        const dateStr = arg.dateStr;
        const dayInfo = calendarDataMap.get(dateStr);
        
        // Find bookings for this day
        const dayPending = pendingBookingsList.filter(
            (b) => (b.services?.[0]?.serviceDate || "").substring(0, 10) === dateStr
        );
        const dayConfirmed = confirmedBookingsList.filter(
            (b) => (b.services?.[0]?.serviceDate || "").substring(0, 10) === dateStr
        );

        setSelectedDayData({
            date: dateStr,
            dayOfWeek: dayInfo?.dayOfWeek || new Date(dateStr).toLocaleDateString("en-US", { weekday: "long" }),
            isWorkingDay: dayInfo ? dayInfo.isWorkingDay : true,
            workingHours: dayInfo?.workingHours || summary.workingHours,
            slots: dayInfo?.slots || [],
            pendingBookings: dayPending,
            confirmedBookings: dayConfirmed,
            status: dayInfo?.status || "AVAILABLE"
        });
        openModal();
    };

    const formatDate = (date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
    };

    return (
        <div className="space-y-6">
            <style>{`
                .fc .fc-toolbar {
                    margin-bottom: 0.75rem !important;
                    padding: 0 0.5rem !important;
                }
                .fc .fc-toolbar-title {
                    font-size: 15px !important;
                    font-weight: 800 !important;
                    color: inherit !important;
                }
                .fc .fc-button {
                    padding: 0.35rem 0.65rem !important;
                    font-size: 11px !important;
                    font-weight: 600 !important;
                    border-radius: 8px !important;
                    height: 30px !important;
                    line-height: 1 !important;
                    text-transform: capitalize !important;
                }
                .fc .fc-col-header-cell-cushion {
                    padding: 6px 0 !important;
                    font-size: 11px !important;
                    font-weight: 700 !important;
                }
                .fc .fc-daygrid-day-frame {
                    min-height: 70px !important;
                    padding: 2px !important;
                    transition: all 0.15s ease;
                }
                .fc .fc-daygrid-day-frame:hover {
                    background-color: rgba(99, 102, 241, 0.05);
                }
                .fc .fc-daygrid-day-top {
                    flex-direction: row !important;
                    justify-content: flex-end !important;
                    padding: 2px 4px 0 0 !important;
                }
                .fc-daygrid-day-number {
                    font-size: 11px !important;
                    font-weight: 800 !important;
                    padding: 0 !important;
                }
                .fc-daygrid-event {
                    margin-top: 2px !important;
                    margin-bottom: 2px !important;
                    padding: 1px 4px !important;
                    font-size: 9px !important;
                    border-radius: 4px !important;
                    line-height: 1.2 !important;
                    font-weight: 700 !important;
                }
                
                .fc-day-available {
                    background-color: rgba(16, 185, 129, 0.08) !important;
                }
                .dark .fc-day-available {
                    background-color: rgba(16, 185, 129, 0.15) !important;
                }
                .fc-day-booked {
                    background-color: rgba(239, 68, 68, 0.08) !important;
                }
                .dark .fc-day-booked {
                    background-color: rgba(239, 68, 68, 0.15) !important;
                }
                .fc-day-pending {
                    background-color: rgba(245, 158, 11, 0.12) !important;
                }
                .dark .fc-day-pending {
                    background-color: rgba(245, 158, 11, 0.2) !important;
                }
                .fc-day-blocked {
                    background-color: rgba(156, 163, 175, 0.08) !important;
                }
                .dark .fc-day-blocked {
                    background-color: rgba(156, 163, 175, 0.12) !important;
                }

                .fc-day-available .fc-daygrid-day-number {
                    color: #059669 !important;
                }
                .dark .fc-day-available .fc-daygrid-day-number {
                    color: #34d399 !important;
                }
                .fc-day-booked .fc-daygrid-day-number {
                    color: #dc2626 !important;
                }
                .dark .fc-day-booked .fc-daygrid-day-number {
                    color: #f87171 !important;
                }
                .fc-day-pending .fc-daygrid-day-number {
                    color: #d97706 !important;
                }
                .dark .fc-day-pending .fc-daygrid-day-number {
                    color: #fbbf24 !important;
                }
            `}</style>

            {/* Top Stat Overview Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {/* Available Days */}
                <div className="p-3.5 rounded-2xl border border-emerald-100 dark:border-emerald-500/20 bg-gradient-to-br from-emerald-50/70 to-emerald-100/40 dark:from-emerald-950/20 dark:to-emerald-950/10 shadow-xs">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 dark:text-emerald-400">Available Days</span>
                        <div className="w-7 h-7 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                            <CalendarCheck className="w-3.5 h-3.5" />
                        </div>
                    </div>
                    <p className="text-2xl font-black text-emerald-950 dark:text-emerald-100 mt-2">
                        {counts.available}
                    </p>
                </div>

                {/* Confirmed Bookings */}
                <div className="p-3.5 rounded-2xl border border-blue-100 dark:border-blue-500/20 bg-gradient-to-br from-blue-50/70 to-blue-100/40 dark:from-blue-950/20 dark:to-blue-950/10 shadow-xs">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-blue-700 dark:text-blue-400">Confirmed</span>
                        <div className="w-7 h-7 rounded-xl bg-blue-500 text-white flex items-center justify-center shadow-xs">
                            <CalendarRange className="w-3.5 h-3.5" />
                        </div>
                    </div>
                    <p className="text-2xl font-black text-blue-950 dark:text-blue-100 mt-2">
                        {summary.confirmedBookingsCount || confirmedBookingsList.length}
                    </p>
                </div>

                {/* Pending Bookings */}
                <div className="p-3.5 rounded-2xl border border-amber-100 dark:border-amber-500/20 bg-gradient-to-br from-amber-50/70 to-amber-100/40 dark:from-amber-950/20 dark:to-amber-950/10 shadow-xs">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700 dark:text-amber-400">Pending</span>
                        <div className="w-7 h-7 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                            <Clock className="w-3.5 h-3.5" />
                        </div>
                    </div>
                    <p className="text-2xl font-black text-amber-950 dark:text-amber-100 mt-2">
                        {summary.pendingBookingsCount || pendingBookingsList.length}
                    </p>
                </div>

                {/* Cancelled Bookings */}
                <div className="p-3.5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-900/40 dark:to-gray-900/20 shadow-xs">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 dark:text-gray-400">Cancelled</span>
                        <div className="w-7 h-7 rounded-xl bg-gray-400 dark:bg-gray-600 text-white flex items-center justify-center shadow-xs">
                            <CalendarX className="w-3.5 h-3.5" />
                        </div>
                    </div>
                    <p className="text-2xl font-black text-gray-900 dark:text-gray-100 mt-2">
                        {summary.cancelledBookingsCount || 0}
                    </p>
                </div>

                {/* Working Hours & Operating Days */}
                <div className="col-span-2 sm:col-span-2 lg:col-span-1 p-3.5 rounded-2xl border border-purple-100 dark:border-purple-500/20 bg-gradient-to-br from-purple-50/70 to-purple-100/40 dark:from-purple-950/20 dark:to-purple-950/10 shadow-xs">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-purple-700 dark:text-purple-400">Working Hours</span>
                        <div className="w-7 h-7 rounded-xl bg-purple-500 text-white flex items-center justify-center shadow-xs">
                            <Sparkles className="w-3.5 h-3.5" />
                        </div>
                    </div>
                    <p className="text-sm font-black text-purple-950 dark:text-purple-100 mt-2">
                        {serviceInfo?.workingHours || summary.workingHours ? (
                            `${formatTime12h((serviceInfo?.workingHours || summary.workingHours).start)} - ${formatTime12h((serviceInfo?.workingHours || summary.workingHours).end)}`
                        ) : (
                            "Standard Hours"
                        )}
                    </p>
                    <p className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold mt-0.5">
                        {(serviceInfo?.workingDays || summary.workingDays || []).length} Active Days / Wk
                    </p>
                </div>
            </div>

            {/* Navigation Tabs for Views */}
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-2">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setActiveTab("calendar")}
                        className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                            activeTab === "calendar"
                                ? "bg-brand-500 text-white shadow-sm"
                                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                    >
                        📅 Calendar Grid
                    </button>
                    <button
                        onClick={() => setActiveTab("pending")}
                        className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                            activeTab === "pending"
                                ? "bg-amber-500 text-white shadow-sm"
                                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                    >
                        ⏳ Pending Bookings
                        {pendingBookingsList.length > 0 && (
                            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 font-black">
                                {pendingBookingsList.length}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab("confirmed")}
                        className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                            activeTab === "confirmed"
                                ? "bg-blue-500 text-white shadow-sm"
                                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                    >
                        ✓ Confirmed Bookings
                        {confirmedBookingsList.length > 0 && (
                            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 font-black">
                                {confirmedBookingsList.length}
                            </span>
                        )}
                    </button>
                </div>

                <div className="hidden md:flex items-center gap-4 text-xs font-semibold text-gray-500">
                    <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Available Day
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Pending Slot
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Booked Slot
                    </span>
                </div>
            </div>

            {/* Main Content Area */}
            {activeTab === "calendar" && (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Left Sidebar: Service Schedule & Legends */}
                    <div className="lg:col-span-1 space-y-4">
                        {/* Weekly Working Days */}
                        <ComponentCard title="Weekly Operating Days">
                            <div className="space-y-1.5">
                                {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => {
                                    const isEnabled = (serviceInfo?.workingDays || summary.workingDays || []).includes(day);
                                    return (
                                        <div
                                            key={day}
                                            className={`flex items-center justify-between p-2 rounded-xl text-xs font-semibold ${
                                                isEnabled
                                                    ? "bg-emerald-50/60 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900/30"
                                                    : "bg-gray-50 dark:bg-gray-800/30 text-gray-400 dark:text-gray-600"
                                            }`}
                                        >
                                            <span>{day}</span>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                                isEnabled ? "bg-emerald-500 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                                            }`}>
                                                {isEnabled ? "Open" : "Closed"}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </ComponentCard>

                        {/* Calendar Instructions Card */}
                        <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 text-xs text-indigo-900 dark:text-indigo-300 space-y-2">
                            <div className="flex items-center gap-2 font-bold text-indigo-700 dark:text-indigo-400">
                                <Info className="w-4 h-4" />
                                <span>Day Inspector Tip</span>
                            </div>
                            <p className="leading-relaxed text-gray-600 dark:text-gray-400">
                                Click on any calendar date to inspect all individual <b>time slots</b>, operating hours, and active customer reservations for that day.
                            </p>
                        </div>
                    </div>

                    {/* Right Area: FullCalendar */}
                    <div className="lg:col-span-3">
                        <ComponentCard>
                            <div className="custom-calendar-container overflow-hidden rounded-xl">
                                {loading ? (
                                    <div className="h-[480px] flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
                                    </div>
                                ) : (
                                    <FullCalendar
                                        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
                                        initialView="dayGridMonth"
                                        headerToolbar={{
                                            left: "prev,next today",
                                            center: "title",
                                            right: "dayGridMonth,timeGridWeek"
                                        }}
                                        events={events}
                                        dateClick={handleDateClick}
                                        height={560}
                                        eventClassNames="cursor-pointer hover:opacity-85 transition-opacity"
                                        dayCellClassNames={(arg) => {
                                            const dateStr = formatDate(arg.date);
                                            const dayInfo = calendarDataMap.get(dateStr);
                                            if (!dayInfo) return [];

                                            const hasPending = pendingBookingsList.some(
                                                (b) => (b.services?.[0]?.serviceDate || "").substring(0, 10) === dateStr
                                            );
                                            const hasConfirmed = confirmedBookingsList.some(
                                                (b) => (b.services?.[0]?.serviceDate || "").substring(0, 10) === dateStr
                                            );

                                            if (!dayInfo.isWorkingDay) {
                                                return ["fc-day-blocked"];
                                            } else if (hasConfirmed) {
                                                return ["fc-day-booked", "ring-1", "ring-inset", "ring-rose-500/30"];
                                            } else if (hasPending) {
                                                return ["fc-day-pending", "ring-1", "ring-inset", "ring-amber-500/40"];
                                            } else if (dayInfo.status === "AVAILABLE") {
                                                return ["fc-day-available", "ring-1", "ring-inset", "ring-emerald-500/20"];
                                            }
                                            return [];
                                        }}
                                        dayCellDidMount={(arg) => {
                                            const dateStr = formatDate(arg.date);
                                            const dayInfo = calendarDataMap.get(dateStr);
                                            let tooltip = `Date: ${dateStr}\nStatus: ${dayInfo?.isWorkingDay ? "Operating" : "Closed"}`;
                                            if (dayInfo?.workingHours) {
                                                tooltip += `\nHours: ${formatTime12h(dayInfo.workingHours.start)} - ${formatTime12h(dayInfo.workingHours.end)}`;
                                            }
                                            if (dayInfo?.slots?.length) {
                                                tooltip += `\nSlots Available: ${dayInfo.slots.length}`;
                                            }
                                            arg.el.setAttribute("title", tooltip);
                                        }}
                                        eventClick={(info) => {
                                            const booking = info.event.extendedProps?.booking;
                                            if (booking && booking._id) {
                                                navigate(`/booking-details/${booking._id}`);
                                            }
                                        }}
                                    />
                                )}
                            </div>
                        </ComponentCard>
                    </div>
                </div>
            )}

            {/* Pending Bookings Tab */}
            {activeTab === "pending" && (
                <ComponentCard title={`Pending Service Bookings (${pendingBookingsList.length})`}>
                    {pendingBookingsList.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 text-sm">
                            No pending service bookings for this service.
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100 dark:divide-gray-800">
                            {pendingBookingsList.map((booking) => {
                                const s = booking.services?.[0];
                                const slotTime = s ? `${formatTime12h(s.serviceStartTime)} - ${formatTime12h(s.serviceEndTime)}` : "N/A";
                                const serviceDate = s?.serviceDate ? new Date(s.serviceDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" }) : "N/A";

                                return (
                                    <div key={booking._id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-start gap-3.5">
                                            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-600 flex items-center justify-center shrink-0">
                                                <Clock className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono text-xs font-bold text-gray-900 dark:text-white">
                                                        {booking.orderId || booking._id}
                                                    </span>
                                                    <Badge color="warning" size="sm">
                                                        Pending Approval
                                                    </Badge>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                                                    <User className="w-3.5 h-3.5" />
                                                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                                                        {booking.user?.firstName} {booking.user?.lastName}
                                                    </span>
                                                    {booking.user?.phone && (
                                                        <>
                                                            <span>•</span>
                                                            <Phone className="w-3 h-3" />
                                                            <span>{booking.user.phone}</span>
                                                        </>
                                                    )}
                                                </p>
                                                <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400 mt-1.5">
                                                    <span className="flex items-center gap-1 font-semibold text-brand-600 dark:text-brand-400">
                                                        <CalendarIcon className="w-3.5 h-3.5" />
                                                        {serviceDate}
                                                    </span>
                                                    <span>•</span>
                                                    <span className="font-semibold">
                                                        Slot: {slotTime}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 self-end md:self-center">
                                            <div className="text-right">
                                                <span className="text-[10px] text-gray-400 uppercase font-bold block">Total Amount</span>
                                                <span className="text-base font-black text-gray-900 dark:text-white">
                                                    SAR {booking.totalAmount?.toFixed(2) || "0.00"}
                                                </span>
                                            </div>
                                            <Button
                                                size="sm"
                                                onClick={() => navigate(`/booking-details/${booking._id}`)}
                                                className="flex items-center gap-1.5 bg-brand-500 text-white font-bold"
                                            >
                                                <span>View Details</span>
                                                <ExternalLink className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </ComponentCard>
            )}

            {/* Confirmed Bookings Tab */}
            {activeTab === "confirmed" && (
                <ComponentCard title={`Confirmed Service Bookings (${confirmedBookingsList.length})`}>
                    {confirmedBookingsList.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 text-sm">
                            No confirmed bookings recorded yet.
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100 dark:divide-gray-800">
                            {confirmedBookingsList.map((booking) => {
                                const s = booking.services?.[0];
                                const slotTime = s ? `${formatTime12h(s.serviceStartTime)} - ${formatTime12h(s.serviceEndTime)}` : "N/A";
                                const serviceDate = s?.serviceDate ? new Date(s.serviceDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" }) : "N/A";

                                return (
                                    <div key={booking._id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-start gap-3.5">
                                            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-600 flex items-center justify-center shrink-0">
                                                <CheckCircle2 className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono text-xs font-bold text-gray-900 dark:text-white">
                                                        {booking.orderId || booking._id}
                                                    </span>
                                                    <Badge color="success" size="sm">
                                                        Confirmed
                                                    </Badge>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                                                    <User className="w-3.5 h-3.5" />
                                                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                                                        {booking.user?.firstName} {booking.user?.lastName}
                                                    </span>
                                                    {booking.user?.phone && (
                                                        <>
                                                            <span>•</span>
                                                            <Phone className="w-3 h-3" />
                                                            <span>{booking.user.phone}</span>
                                                        </>
                                                    )}
                                                </p>
                                                <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400 mt-1.5">
                                                    <span className="flex items-center gap-1 font-semibold text-brand-600 dark:text-brand-400">
                                                        <CalendarIcon className="w-3.5 h-3.5" />
                                                        {serviceDate}
                                                    </span>
                                                    <span>•</span>
                                                    <span className="font-semibold">
                                                        Slot: {slotTime}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 self-end md:self-center">
                                            <div className="text-right">
                                                <span className="text-[10px] text-gray-400 uppercase font-bold block">Total Amount</span>
                                                <span className="text-base font-black text-gray-900 dark:text-white">
                                                    SAR {booking.totalAmount?.toFixed(2) || "0.00"}
                                                </span>
                                            </div>
                                            <Button
                                                size="sm"
                                                onClick={() => navigate(`/booking-details/${booking._id}`)}
                                                className="flex items-center gap-1.5 bg-brand-500 text-white font-bold"
                                            >
                                                <span>View Details</span>
                                                <ExternalLink className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </ComponentCard>
            )}

            {/* Interactive Day Inspector Modal */}
            <Modal isOpen={isOpen} onClose={closeModal} className="max-w-2xl p-6">
                {selectedDayData && (
                    <div className="space-y-5">
                        {/* Day Header */}
                        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
                            <div>
                                <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                                    <CalendarIcon className="w-5 h-5 text-brand-600" />
                                    <span>
                                        {new Date(selectedDayData.date + "T00:00:00").toLocaleDateString("en-US", {
                                            weekday: "long",
                                            month: "long",
                                            day: "numeric",
                                            year: "numeric"
                                        })}
                                    </span>
                                </h3>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    Operating Status & Slot Schedule Inspector
                                </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                selectedDayData.isWorkingDay
                                    ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300"
                                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                            }`}>
                                {selectedDayData.isWorkingDay ? "Operating Day" : "Off Day"}
                            </span>
                        </div>

                        {/* Working Hours Metric */}
                        {selectedDayData.workingHours && (
                            <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Working Window:</span>
                                <span className="text-sm font-black text-gray-900 dark:text-white">
                                    {formatTime12h(selectedDayData.workingHours.start)} - {formatTime12h(selectedDayData.workingHours.end)}
                                </span>
                            </div>
                        )}

                        {/* Day Bookings (if any pending/confirmed on this day) */}
                        {(selectedDayData.pendingBookings.length > 0 || selectedDayData.confirmedBookings.length > 0) && (
                            <div className="space-y-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">
                                    Active Reservations for This Day:
                                </span>
                                <div className="space-y-2">
                                    {selectedDayData.pendingBookings.map((b) => (
                                        <div
                                            key={b._id}
                                            className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <Clock className="w-4 h-4 text-amber-600" />
                                                <div>
                                                    <p className="text-xs font-bold text-gray-900 dark:text-white">
                                                        {b.user?.firstName} {b.user?.lastName} (Pending)
                                                    </p>
                                                    <p className="text-[11px] text-gray-500">
                                                        Slot: {formatSlotRange12h(b.services?.[0]?.serviceStartTime + " - " + b.services?.[0]?.serviceEndTime)}
                                                    </p>
                                                </div>
                                            </div>
                                            <Button
                                                size="sm"
                                                onClick={() => {
                                                    closeModal();
                                                    navigate(`/booking-details/${b._id}`);
                                                }}
                                                className="bg-amber-600 text-white font-bold text-xs"
                                            >
                                                View
                                            </Button>
                                        </div>
                                    ))}

                                    {selectedDayData.confirmedBookings.map((b) => (
                                        <div
                                            key={b._id}
                                            className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/40 flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                                                <div>
                                                    <p className="text-xs font-bold text-gray-900 dark:text-white">
                                                        {b.user?.firstName} {b.user?.lastName} (Confirmed)
                                                    </p>
                                                    <p className="text-[11px] text-gray-500">
                                                        Slot: {formatSlotRange12h(b.services?.[0]?.serviceStartTime + " - " + b.services?.[0]?.serviceEndTime)}
                                                    </p>
                                                </div>
                                            </div>
                                            <Button
                                                size="sm"
                                                onClick={() => {
                                                    closeModal();
                                                    navigate(`/booking-details/${b._id}`);
                                                }}
                                                className="bg-blue-600 text-white font-bold text-xs"
                                            >
                                                View
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Configured Time Slots for the day */}
                        <div className="space-y-2.5">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                    Configured Time Slots ({selectedDayData.slots?.length || 0})
                                </span>
                            </div>

                            {(!selectedDayData.slots || selectedDayData.slots.length === 0) ? (
                                <div className="p-6 text-center text-xs text-gray-400 bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-800">
                                    No specific hourly slots configured for this day.
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1">
                                    {selectedDayData.slots.map((slot, index) => {
                                        const isAvailable = slot.status === "AVAILABLE" || slot.isFreeToBook;
                                        return (
                                            <div
                                                key={index}
                                                className={`p-3 rounded-xl border transition-all ${
                                                    isAvailable
                                                        ? "bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-800/40"
                                                        : "bg-rose-50/40 dark:bg-rose-950/20 border-rose-200/60 dark:border-rose-800/40"
                                                }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-black text-gray-900 dark:text-white font-mono">
                                                        {formatSlotRange12h(slot.timeSlot || `${slot.startTime} - ${slot.endTime}`)}
                                                    </span>
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                                        isAvailable
                                                            ? "bg-emerald-500 text-white"
                                                            : "bg-rose-500 text-white"
                                                    }`}>
                                                        {slot.status || (isAvailable ? "AVAILABLE" : "BOOKED")}
                                                    </span>
                                                </div>
                                                {slot.booking && (
                                                    <div className="mt-2 pt-2 border-t border-gray-200/40 dark:border-gray-700/40 text-[11px] text-gray-500">
                                                        Booking: {slot.booking.bookingId || slot.booking._id}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                            <Button variant="outline" onClick={closeModal}>
                                Close Inspector
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}

