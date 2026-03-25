import React, { useState } from "react";
import { 
    Bell, 
    Calendar, 
    Home, 
    CreditCard, 
    MessageSquare, 
    CheckCircle2, 
    Clock, 
    AlertCircle 
} from "lucide-react";
import ComponentCard from "../common/ComponentCard";
import Badge from "../ui/badge/Badge";

// Mock notifications based on real app functionality
const initialNotifications = [
    {
        id: 1,
        type: "booking",
        title: "New Booking Received",
        message: "Devi Lodhi has booked 'Riyadh Garden Villa' for March 14, 2026.",
        time: "5 mins ago",
        status: "unread",
        icon: Calendar,
        color: "text-blue-500",
        bgColor: "bg-blue-50"
    },
    {
        id: 2,
        type: "property",
        title: "Property Under Review",
        message: "A new property 'Sea View Apartment' has been added by Vendor Ahmed and needs approval.",
        time: "1 hour ago",
        status: "unread",
        icon: Home,
        color: "text-purple-500",
        bgColor: "bg-purple-50"
    },
    {
        id: 3,
        type: "transaction",
        title: "Successful Transaction",
        message: "Payment of SAR 12,500 received for Order ORD_43971CFB.",
        time: "2 hours ago",
        status: "read",
        icon: CreditCard,
        color: "text-green-500",
        bgColor: "bg-green-50"
    },
    {
        id: 4,
        type: "support",
        title: "New Support Message",
        message: "Guest Anand Singh has raised a query regarding booking ORD_6D41ABC6.",
        time: "5 hours ago",
        status: "unread",
        icon: MessageSquare,
        color: "text-orange-500",
        bgColor: "bg-orange-50"
    },
    {
        id: 5,
        type: "system",
        title: "Policy Update",
        message: "The property cancellation policy has been updated across all listings.",
        time: "1 day ago",
        status: "read",
        icon: AlertCircle,
        color: "text-red-500",
        bgColor: "bg-red-50"
    }
];

export default function NotificationList() {
    const [notifications, setNotifications] = useState(initialNotifications);
    const [filter, setFilter] = useState("all");

    const markAsRead = (id) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, status: 'read' } : n));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, status: 'read' })));
    };

    const filteredNotifications = filter === "all" 
        ? notifications 
        : notifications.filter(n => n.status === filter);

    return (
        <ComponentCard 
            title="System Notifications"
            desc="Stay updated with the latest activities across bookings, properties, and finance."
        >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-lg w-fit">
                    <button
                        onClick={() => setFilter("all")}
                        className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${filter === "all" ? "bg-white dark:bg-gray-700 shadow-sm text-brand-500" : "text-gray-500"}`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter("unread")}
                        className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${filter === "unread" ? "bg-white dark:bg-gray-700 shadow-sm text-brand-500" : "text-gray-500"}`}
                    >
                        Unread
                    </button>
                </div>
                
                <button 
                    onClick={markAllAsRead}
                    className="text-sm font-medium text-brand-500 hover:text-brand-600 transition-colors"
                >
                    Mark all as read
                </button>
            </div>

            <div className="space-y-4">
                {filteredNotifications.length > 0 ? (
                    filteredNotifications.map((notification) => (
                        <div 
                            key={notification.id}
                            className={`group relative flex items-start gap-4 p-4 rounded-2xl border transition-all duration-300 ${
                                notification.status === 'unread' 
                                ? 'bg-white dark:bg-white/[0.03] border-brand-100 dark:border-brand-500/20' 
                                : 'bg-gray-50/50 dark:bg-transparent border-gray-100 dark:border-gray-800'
                            }`}
                        >
                            {/* Icon Wrapper */}
                            <div className={`shrink-0 flex items-center justify-center w-12 h-12 rounded-xl ${notification.bgColor} dark:bg-opacity-10`}>
                                <notification.icon className={notification.color} size={24} />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2 mb-1">
                                    <h4 className={`text-sm font-bold truncate ${notification.status === 'unread' ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                                        {notification.title}
                                    </h4>
                                    <span className="shrink-0 flex items-center gap-1 text-[10px] text-gray-400">
                                        <Clock size={12} />
                                        {notification.time}
                                    </span>
                                </div>
                                <p className={`text-sm leading-relaxed ${notification.status === 'unread' ? 'text-gray-600 dark:text-gray-300' : 'text-gray-500 dark:text-gray-500'}`}>
                                    {notification.message}
                                </p>
                                
                                <div className="mt-3 flex items-center gap-3">
                                    <Badge size="xs" color={notification.type === 'booking' ? 'blue' : notification.type === 'property' ? 'purple' : notification.type === 'transaction' ? 'success' : 'warning'}>
                                        {notification.type}
                                    </Badge>
                                    {notification.status === 'unread' && (
                                        <button 
                                            onClick={() => markAsRead(notification.id)}
                                            className="text-[11px] font-semibold text-brand-500 hover:underline"
                                        >
                                            Mark as read
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Unread Indicator */}
                            {notification.status === 'unread' && (
                                <div className="absolute top-4 right-4 w-2 h-2 bg-brand-500 rounded-full"></div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                            <Bell className="text-gray-400" size={32} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">No notifications</h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-[250px]">You're all caught up! There are no new notifications to show.</p>
                    </div>
                )}
            </div>
        </ComponentCard>
    );
}
