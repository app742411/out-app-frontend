import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ComponentCard from "../common/ComponentCard";
import Badge from "../ui/badge/Badge";
import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";
import { getAdminBookingCalendar } from "../../api/authApi";
import { useModal } from "../../hooks/useModal";
import toast from "react-hot-toast";

import { useNavigate } from "react-router";

export default function ServicePropertyCalendarComp({ propertyId }) {
    const navigate = useNavigate();
    const { isOpen, openModal, closeModal } = useModal();
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCalendarData = async () => {
            try {
                setLoading(true);
                const res = await getAdminBookingCalendar(propertyId);
                const rawData = res.data || [];
                
                // Track unique bookings to avoid duplicates in the UI
                const bookingMap = new Map();
                const otherEvents = [];

                rawData.forEach(item => {
                    if (item.booking && item.booking._id) {
                        if (!bookingMap.has(item.booking._id)) {
                            bookingMap.set(item.booking._id, {
                                id: item.booking._id,
                                title: `Booked: ${item.booking.bookingStatus.toUpperCase()}`,
                                start: item.booking.checkIn,
                                end: item.booking.checkOut,
                                backgroundColor: "#ef4444",
                                borderColor: "#ef4444",
                                extendedProps: { ...item.booking, hotel: item.hotel }
                            });
                        }
                    } else if (item.date) {
                        // For dates without a full booking object, they might be blocked/individual entries
                        otherEvents.push({
                            id: item._id,
                            title: "Unavailable",
                            start: item.date,
                            backgroundColor: "#f59e0b",
                            borderColor: "#f59e0b",
                            allDay: true
                        });
                    }
                });

                setEvents([...Array.from(bookingMap.values()), ...otherEvents]);
            } catch (error) {
                toast.error("Failed to load calendar data");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        
        if (propertyId) {
            fetchCalendarData();
        }
    }, [propertyId]);

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
            backgroundColor: "#10b981", // Green for new booking
            borderColor: "#10b981",
            extendedProps: { status: "booked", type: "manual" }
        };
        setEvents([...events, newBooking]);
        toast.success("Static booking created!");
        closeModal();
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <ComponentCard title="Monthly Overview">
                        <div className="space-y-4">
                            <div className="p-3 bg-brand-50 dark:bg-brand-500/10 rounded-lg">
                                <p className="text-[10px] uppercase font-bold text-brand-600 dark:text-brand-400">Total Bookings</p>
                                <p className="text-2xl font-black text-brand-700 dark:text-brand-200">
                                    {events.filter(e => e.extendedProps?.bookingStatus).length}
                                </p>
                            </div>
                            <div className="p-3 bg-amber-50 dark:bg-amber-500/10 rounded-lg">
                                <p className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400">Blocked Days</p>
                                <p className="text-2xl font-black text-amber-700 dark:text-amber-200">
                                    {events.filter(e => e.title === "Unavailable").length}
                                </p>
                            </div>
                        </div>
                    </ComponentCard>

                    <ComponentCard title="Calendar Legends">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-red-500 ring-4 ring-red-500/20"></div>
                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Booked</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-amber-500 ring-4 ring-amber-500/20"></div>
                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Unavailable</span>
                            </div>
                        </div>
                    </ComponentCard>
                </div>

                <div className="lg:col-span-3">
                    <ComponentCard>
                        <div className="custom-calendar-container overflow-hidden rounded-xl">
                            {loading ? (
                                <div className="h-[500px] flex items-center justify-center">
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
                                    height="auto"
                                    eventClassNames="cursor-pointer hover:opacity-80 transition-opacity"
                                    eventContent={(eventInfo) => (
                                        <div className="px-2 py-1 flex items-center gap-1.5 overflow-hidden">
                                            <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                                eventInfo.event.extendedProps?.bookingStatus ? 'bg-white' : 'bg-gray-200'
                                            }`} />
                                            <span className="truncate font-bold text-[10px]">
                                                {eventInfo.event.title}
                                            </span>
                                        </div>
                                    )}
                                    eventClick={(info) => {
                                        if (info.event.id && info.event.extendedProps?.bookingStatus) {
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
                        Are you sure you want to book this property from <b>{selectedSlot?.start}</b> to <b>{selectedSlot?.end}</b>?
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
