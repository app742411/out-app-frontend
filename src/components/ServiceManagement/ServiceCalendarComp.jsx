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
import { CalendarCheck, CalendarRange, Moon, CalendarX } from "lucide-react";

export default function ServiceCalendarComp({ serviceId }) {
    const navigate = useNavigate();
    const { isOpen, openModal, closeModal } = useModal();
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState({
        totalBookedDays: 0,
        confirmedBookingsCount: 0,
        pendingBookingsCount: 0,
        cancelledBookingsCount: 0
    });
    const [counts, setCounts] = useState({
        available: 0,
        booked: 0,
        pending: 0,
        blocked: 0
    });
    const [calendarStatusMap, setCalendarStatusMap] = useState(new Map());
    const [calendarBookingMap, setCalendarBookingMap] = useState(new Map());

    useEffect(() => {
        const fetchCalendarData = async () => {
            try {
                setLoading(true);
                const res = await getAdminServiceBookingCalendar(serviceId);
                const calendarData = res.calendar || [];

                const statusMap = new Map();
                const bookingDetailsMap = new Map();
                // Track unique bookings to avoid duplicates in the UI
                const bookingMap = new Map();
                const individualEvents = [];
                const coveredDates = new Set();

                let availableCount = 0;
                let bookedCount = 0;
                let pendingCount = 0;
                let blockedCount = 0;

                // Function to compute next date string (YYYY-MM-DD) for exclusive end date
                const getNextDateStr = (dateStr) => {
                    const d = new Date(dateStr);
                    d.setDate(d.getDate() + 1);
                    return d.toISOString().substring(0, 10);
                };

                // Style helper for pastel theme colors
                const getEventStyles = (status) => {
                    switch (status.toUpperCase()) {
                        case "AVAILABLE":
                            return {
                                bg: "#e6f4ea", // light green
                                border: "#10b981", // green-500
                                text: "#065f46", // green-800
                                label: "Available"
                            };
                        case "PENDING":
                            return {
                                bg: "#fef3c7", // light amber
                                border: "#f59e0b", // amber-500
                                text: "#92400e", // amber-800
                                label: "Pending"
                            };
                        case "BOOKED":
                        case "CONFIRMED":
                            return {
                                bg: "#fee2e2", // light red
                                border: "#ef4444", // red-500
                                text: "#991b1b", // red-800
                                label: "Booked"
                            };
                        default:
                            return {
                                bg: "#f3f4f6", // light gray
                                border: "#9ca3af", // gray-400
                                text: "#4b5563", // gray-600
                                label: "Unavailable"
                            };
                    }
                };

                // First pass: Calculate counts and parse bookings
                calendarData.forEach(item => {
                    const status = item.status || "AVAILABLE";
                    statusMap.set(item.date, status);

                    if (status === "AVAILABLE") {
                        availableCount++;
                    } else if (status === "BOOKED" || status === "CONFIRMED") {
                        bookedCount++;
                    } else if (status === "PENDING") {
                        pendingCount++;
                    } else {
                        blockedCount++;
                    }

                    if (item.booking && item.booking._id) {
                        const booking = item.booking;
                        bookingDetailsMap.set(item.date, booking);

                        if (!bookingMap.has(booking._id)) {
                            const isPending = status.toUpperCase() === "PENDING" || (booking.bookingStatus || "").toUpperCase() === "PENDING";
                            const styles = getEventStyles(isPending ? "PENDING" : "BOOKED");
                            const checkInDate = booking.checkIn ? booking.checkIn.substring(0, 10) : item.date;
                            let checkOutDate = booking.checkOut ? booking.checkOut.substring(0, 10) : item.date;
                            if (checkInDate === checkOutDate) {
                                checkOutDate = getNextDateStr(checkInDate);
                            }

                            bookingMap.set(booking._id, {
                                id: booking._id,
                                title: `${isPending ? 'PD' : 'BK'}: ${booking.bookingId || booking._id.slice(-6)}`,
                                start: checkInDate,
                                end: checkOutDate,
                                backgroundColor: styles.bg,
                                borderColor: styles.border,
                                textColor: styles.text,
                                allDay: true,
                                extendedProps: {
                                    ...booking,
                                    status: booking.bookingStatus || status,
                                    type: 'booking'
                                }
                            });
                        }
                        coveredDates.add(item.date);
                    }
                });

                // Second pass: handle non-booked dates (Available dates are colored on dayCell render, not as chips)
                calendarData.forEach(item => {
                    if (!coveredDates.has(item.date)) {
                        const status = item.status || "AVAILABLE";
                        if (status === "AVAILABLE") return; // Don't show available chip

                        const styles = getEventStyles(status);
                        individualEvents.push({
                            id: `status-${item.date}`,
                            title: styles.label === "Unavailable" ? "UA" : "Blocked",
                            start: item.date,
                            backgroundColor: styles.bg,
                            borderColor: styles.border,
                            textColor: styles.text,
                            allDay: true,
                            extendedProps: {
                                status: status,
                                type: 'status'
                            }
                        });
                    }
                });

                setCalendarStatusMap(statusMap);
                setCalendarBookingMap(bookingDetailsMap);
                setEvents([...Array.from(bookingMap.values()), ...individualEvents]);

                if (res.summary) {
                    setSummary(res.summary);
                }
                setCounts({
                    available: availableCount,
                    booked: bookedCount,
                    pending: pendingCount,
                    blocked: blockedCount
                });
            } catch (error) {
                toast.error("Failed to load calendar data");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (serviceId) {
            fetchCalendarData();
        }
    }, [serviceId]);

    const handleDateSelect = (selectInfo) => {
        setSelectedSlot({
            start: selectInfo.startStr,
            end: selectInfo.endStr
        });
        openModal();
    };

    const handleBookStatic = () => {
        const newBooking = {
            id: Date.now().toString(),
            title: "Manual Booking",
            start: selectedSlot.start,
            end: selectedSlot.end,
            backgroundColor: "#d1fae5",
            borderColor: "#10b981",
            textColor: "#065f46",
            extendedProps: { status: "booked", type: "manual" }
        };
        setEvents([...events, newBooking]);
        toast.success("Static booking created!");
        closeModal();
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
                /* Compact toolbar and elements */
                .fc .fc-toolbar {
                    margin-bottom: 0.5rem !important;
                    padding: 0 0.25rem !important;
                }
                .fc .fc-toolbar-title {
                    font-size: 13px !important;
                    font-weight: 700 !important;
                }
                .fc .fc-button {
                    padding: 0.2rem 0.4rem !important;
                    font-size: 10px !important;
                    height: 24px !important;
                    line-height: 1 !important;
                }
                .fc .fc-col-header-cell-cushion {
                    padding: 2px 0 !important;
                    font-size: 9px !important;
                    font-weight: 700 !important;
                }

                /* Compact cell sizes and custom padding */
                .fc .fc-daygrid-day-frame {
                    min-height: 48px !important;
                    padding: 1px !important;
                }
                .fc .fc-daygrid-day-top {
                    flex-direction: row !important;
                    justify-content: flex-end !important;
                    padding: 1px 2px 0 0 !important;
                }
                .fc-daygrid-day-number {
                    font-size: 9px !important;
                    font-weight: 700 !important;
                    padding: 0 !important;
                }
                .fc-daygrid-event {
                    margin-top: 1px !important;
                    margin-bottom: 1px !important;
                    padding: 0px 2px !important;
                    font-size: 8px !important;
                    border-radius: 3px !important;
                    line-height: 1.1 !important;
                }
                
                /* Cell Background override colors */
                .fc-day-available {
                    background-color: #d1fae5 !important; /* green-100 */
                }
                .dark .fc-day-available {
                    background-color: rgba(6, 78, 59, 0.4) !important; /* green-950 */
                }
                .fc-day-booked {
                    background-color: #fee2e2 !important; /* red-100 */
                }
                .dark .fc-day-booked {
                    background-color: rgba(127, 29, 29, 0.4) !important; /* red-950 */
                }
                .fc-day-pending {
                    background-color: #fef3c7 !important; /* amber-100 */
                }
                .dark .fc-day-pending {
                    background-color: rgba(120, 53, 4, 0.4) !important; /* amber-950 */
                }
                .fc-day-blocked {
                    background-color: #f3f4f6 !important; /* gray-100 */
                }
                .dark .fc-day-blocked {
                    background-color: rgba(31, 41, 55, 0.4) !important; /* gray-850 */
                }

                .fc-day-available .fc-daygrid-day-number {
                    color: #047857 !important;
                    font-weight: 800;
                }
                .dark .fc-day-available .fc-daygrid-day-number {
                    color: #34d399 !important;
                }
                .fc-day-booked .fc-daygrid-day-number {
                    color: #b91c1c !important;
                    font-weight: 800;
                }
                .dark .fc-day-booked .fc-daygrid-day-number {
                    color: #f87171 !important;
                }
                .fc-day-pending .fc-daygrid-day-number {
                    color: #b45309 !important;
                    font-weight: 800;
                }
                .dark .fc-day-pending .fc-daygrid-day-number {
                    color: #fbbf24 !important;
                }
                .fc-day-blocked .fc-daygrid-day-number {
                    color: #4b5563 !important;
                    font-weight: 800;
                }
                .dark .fc-day-blocked .fc-daygrid-day-number {
                    color: #9ca3af !important;
                }
            `}</style>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1 space-y-4">
                    <ComponentCard title="Monthly Overview">
                        <div className="grid grid-cols-2 gap-3">
                            {/* Available Days */}
                            <div className="group flex flex-col justify-between p-3 rounded-xl border border-emerald-200/60 dark:border-emerald-500/20 bg-gradient-to-br from-emerald-50/80 to-emerald-100/50 dark:from-emerald-950/20 dark:to-emerald-950/10 backdrop-blur-sm shadow-sm hover:shadow-md hover:shadow-emerald-500/5 hover:-translate-y-0.5 transition-all duration-300">
                                <div className="flex items-center justify-between">
                                    <span className="text-[9px] uppercase font-extrabold tracking-wider text-emerald-600 dark:text-emerald-400">Available</span>
                                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
                                        <CalendarCheck className="w-3.5 h-3.5" />
                                    </div>
                                </div>
                                <p className="text-xl font-black text-emerald-900 dark:text-emerald-100 mt-2 leading-none">
                                    {counts.available}
                                </p>
                            </div>

                            {/* Confirmed Bookings */}
                            <div className="group flex flex-col justify-between p-3 rounded-xl border border-brand-200/60 dark:border-brand-500/20 bg-gradient-to-br from-brand-50/80 to-brand-100/50 dark:from-brand-950/20 dark:to-brand-950/10 backdrop-blur-sm shadow-sm hover:shadow-md hover:shadow-brand-500/5 hover:-translate-y-0.5 transition-all duration-300">
                                <div className="flex items-center justify-between">
                                    <span className="text-[9px] uppercase font-extrabold tracking-wider text-brand-600 dark:text-brand-400">Confirmed</span>
                                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 text-white flex items-center justify-center shadow-md shadow-brand-500/20 shrink-0">
                                        <CalendarRange className="w-3.5 h-3.5" />
                                    </div>
                                </div>
                                <p className="text-xl font-black text-brand-900 dark:text-brand-100 mt-2 leading-none">
                                    {summary.confirmedBookingsCount}
                                </p>
                            </div>

                            {/* Pending Bookings */}
                            <div className="group flex flex-col justify-between p-3 rounded-xl border border-amber-200/60 dark:border-amber-500/20 bg-gradient-to-br from-amber-50/80 to-amber-100/50 dark:from-amber-950/20 dark:to-amber-950/10 backdrop-blur-sm shadow-sm hover:shadow-md hover:shadow-amber-500/5 hover:-translate-y-0.5 transition-all duration-300">
                                <div className="flex items-center justify-between">
                                    <span className="text-[9px] uppercase font-extrabold tracking-wider text-amber-600 dark:text-amber-400">Pending</span>
                                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
                                        <Moon className="w-3.5 h-3.5" />
                                    </div>
                                </div>
                                <p className="text-xl font-black text-amber-900 dark:text-amber-100 mt-2 leading-none">
                                    {summary.pendingBookingsCount}
                                </p>
                            </div>

                            {/* Cancelled Bookings */}
                            <div className="group flex flex-col justify-between p-3 rounded-xl border border-gray-200 dark:border-white/5 bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-white/[0.02] dark:to-white/[0.01] backdrop-blur-sm shadow-sm hover:shadow-md hover:shadow-gray-500/5 hover:-translate-y-0.5 transition-all duration-300">
                                <div className="flex items-center justify-between">
                                    <span className="text-[9px] uppercase font-extrabold tracking-wider text-gray-500 dark:text-gray-400">Cancelled</span>
                                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-gray-400 to-gray-600 text-white flex items-center justify-center shadow-md shadow-gray-500/10 shrink-0">
                                        <CalendarX className="w-3.5 h-3.5" />
                                    </div>
                                </div>
                                <p className="text-xl font-black text-gray-900 dark:text-gray-100 mt-2 leading-none">
                                    {summary.cancelledBookingsCount}
                                </p>
                            </div>
                        </div>

                        {/* Full Width Metric at the bottom: Total Booked Days */}
                        <div className="group mt-3 flex items-center gap-3 p-3 rounded-xl border border-rose-200/60 dark:border-rose-500/20 bg-gradient-to-br from-rose-50/80 to-rose-100/50 dark:from-rose-950/20 dark:to-rose-950/10 backdrop-blur-sm shadow-sm hover:shadow-md hover:shadow-rose-500/5 hover:-translate-y-0.5 transition-all duration-300">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-400 to-rose-600 text-white flex items-center justify-center shadow-md shadow-rose-500/20 shrink-0">
                                <Moon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1 flex justify-between items-center">
                                <p className="text-[10px] uppercase font-extrabold tracking-wider text-rose-600 dark:text-rose-400">Total Booked Days</p>
                                <p className="text-lg font-black text-rose-900 dark:text-rose-100">
                                    {summary.totalBookedDays}
                                </p>
                            </div>
                        </div>
                    </ComponentCard>

                    <ComponentCard title="Calendar Legends">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded bg-green-100 dark:bg-emerald-950/40 border border-green-300 dark:border-emerald-800 flex items-center justify-center">
                                    <span className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400">31</span>
                                </div>
                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Available Date</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded bg-rose-100 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 flex items-center justify-center">
                                    <span className="text-[10px] font-extrabold text-rose-700 dark:text-rose-400">31</span>
                                </div>
                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Booked Date</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded bg-amber-100 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 flex items-center justify-center">
                                    <span className="text-[10px] font-extrabold text-amber-700 dark:text-amber-400">31</span>
                                </div>
                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Pending Date</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 flex items-center justify-center">
                                    <span className="text-[10px] font-extrabold text-gray-600 dark:text-gray-400">31</span>
                                </div>
                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Blocked / Unavailable</span>
                            </div>
                        </div>
                    </ComponentCard>
                </div>

                <div className="lg:col-span-3">
                    <ComponentCard>
                        <div className="custom-calendar-container overflow-hidden rounded-xl">
                            {loading ? (
                                <div className="h-[400px] flex items-center justify-center">
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
                                    selectable={true}
                                    select={handleDateSelect}
                                    height={400}
                                    eventClassNames="cursor-pointer hover:opacity-80 transition-opacity"
                                    dayCellClassNames={(arg) => {
                                        const dateStr = formatDate(arg.date);
                                        const status = calendarStatusMap.get(dateStr);
                                        if (status === "AVAILABLE") {
                                            return ["fc-day-available", "ring-1", "ring-inset", "ring-emerald-500/30"];
                                        } else if (status === "PENDING") {
                                            return ["fc-day-pending", "ring-1", "ring-inset", "ring-amber-500/30"];
                                        } else if (status === "BOOKED" || status === "CONFIRMED") {
                                            return ["fc-day-booked", "ring-1", "ring-inset", "ring-rose-500/30"];
                                        } else if (status) {
                                            return ["fc-day-blocked", "ring-1", "ring-inset", "ring-gray-400/20"];
                                        }
                                        return [];
                                    }}
                                    dayCellDidMount={(arg) => {
                                        const dateStr = formatDate(arg.date);
                                        const status = calendarStatusMap.get(dateStr);
                                        const bookingInfo = calendarBookingMap.get(dateStr);

                                        let tooltip = `Date: ${dateStr}\nStatus: ${status || "AVAILABLE"}`;
                                        if (bookingInfo) {
                                            tooltip += `\nBooking ID: ${bookingInfo.bookingId || bookingInfo._id}\nGuest: ${bookingInfo.user?.name || "Guest"}\nCheck-in: ${bookingInfo.checkIn?.substring(0, 10)}\nCheck-out: ${bookingInfo.checkOut?.substring(0, 10)}\nPriority: ${bookingInfo.bookingStatus === 'confirmed' ? 'HIGH (Confirmed)' : 'MEDIUM (Pending)'}`;
                                        }
                                        arg.el.setAttribute("title", tooltip);
                                    }}
                                    eventContent={(eventInfo) => {
                                        const type = eventInfo.event.extendedProps?.type;
                                        const status = eventInfo.event.extendedProps?.status || '';

                                        let dotClass = "bg-gray-400";
                                        if (type === 'booking') {
                                            const isPending = status.toUpperCase() === 'PENDING';
                                            dotClass = isPending ? "bg-amber-50" : "bg-red-500";
                                        } else {
                                            if (status === 'AVAILABLE') {
                                                dotClass = "bg-emerald-500";
                                            } else if (status === 'PENDING') {
                                                dotClass = "bg-amber-500";
                                            } else if (status === 'UNAVAILABLE' || status === 'BLOCKED') {
                                                dotClass = "bg-gray-500";
                                            }
                                        }

                                        return (
                                            <div className="px-1 py-0.5 flex items-center gap-1 overflow-hidden w-full h-full">
                                                <div className={`w-1 h-1 rounded-full shrink-0 ${dotClass}`} />
                                                <span
                                                    className="truncate font-extrabold text-[8px]"
                                                    style={{ color: eventInfo.event.textColor }}
                                                >
                                                    {eventInfo.event.title}
                                                </span>
                                            </div>
                                        );
                                    }}
                                    eventClick={(info) => {
                                        if (info.event.extendedProps?.type === 'booking' && info.event.id) {
                                            navigate(`/booking-details/${info.event.id}`);
                                        }
                                    }}
                                />
                            )}
                        </div>
                    </ComponentCard>
                </div>
            </div>

            <Modal isOpen={isOpen} onClose={closeModal} className="max-w-md p-6">
                <div className="text-center">
                    <h3 className="text-lg font-bold mb-2">Create Static Booking</h3>
                    <p className="text-sm text-gray-500 mb-6">
                        Are you sure you want to book this service from <b>{selectedSlot?.start}</b> to <b>{selectedSlot?.end}</b>?
                    </p>
                    <div className="flex gap-4">
                        <Button variant="outline" className="flex-1" onClick={closeModal}>Cancel</Button>
                        <Button className="flex-1 bg-brand-500 text-white" onClick={handleBookStatic}>Confirm Booking</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
