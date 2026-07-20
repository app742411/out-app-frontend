import React, { useState, useEffect } from "react";
import {
    Bell,
    Calendar,
    CreditCard,
    MessageSquare,
    Clock,
    Trash2,
    Home,
    Shield,
} from "lucide-react";
import { useNavigate } from "react-router";
import Badge from "../ui/badge/Badge";
import {
    getAllNotificationsAdmin,
    adminDeleteNotifications,
    getNotificationDetails
} from "../../api/authApi";
import { useSocket } from "../../context/SocketContext";
import toast from "react-hot-toast";
import NotificationDetailsModal from "./NotificationDetailsModal";

export default function NotificationList() {
    const { notifications, setNotifications, setNotificationCount } = useSocket();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const [selectedId, setSelectedId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const params = {
                isDeleted: false
            };
            const res = await getAllNotificationsAdmin(params);
            if (res?.data) {
                setNotifications(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
            toast.error("Failed to load notifications");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleNotificationClick = async (notification) => {
        const id = notification._id;
        const refId = notification.referenceId;
        const type = notification.type?.toUpperCase() || notification.referenceType?.toUpperCase();

        const wasUnread = !notification.isRead;
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
        if (wasUnread) {
            setNotificationCount(prev => Math.max(0, prev - 1));
        }

        try {
            getNotificationDetails(id);
        } catch (e) {
            // Asynchronous background call
        }

        let path = null;
        switch (type) {
            case "BOOKING":
                const bookingId = refId || notification.data?.bookingId;
                if (bookingId) path = `/booking-details/${bookingId}`;
                break;
            case "PROPERTY":
                const propertyId = refId || notification.data?.propertyId;
                if (propertyId) path = `/property-details/${propertyId}`;
                break;
            case "SERVICE":
                const serviceId = refId || notification.data?.serviceId;
                if (serviceId) path = `/service-details/${serviceId}`;
                break;
            case "CHAT":
            case "CONVERSATION":
                path = "/support";
                break;
            case "PAYMENT":
            case "REFUND":
            case "TRANSACTION":
                path = refId ? `/transaction-details/${refId}` : `/transaction-logs`;
                break;
        }

        if (path) {
            navigate(path);
        } else {
            setSelectedId(id);
            setIsModalOpen(true);
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        try {
            await adminDeleteNotifications([id]);
            setNotifications(notifications.filter(n => n._id !== id));
            toast.success("Notification deleted");
        } catch (error) {
            toast.error("Failed to delete notification");
        }
    };

    const handleClearAll = async () => {
        if (notifications.length === 0) return;
        if (!window.confirm("Are you sure you want to delete all visible notifications?")) return;

        try {
            const ids = notifications.map(n => n._id);
            await adminDeleteNotifications(ids);
            setNotifications([]);
            setNotificationCount(0);
            toast.success("All notifications deleted");
        } catch (error) {
            toast.error("Failed to clear notifications");
        }
    };

    const getIcon = (type) => {
        switch (type?.toUpperCase()) {
            case "BOOKING": return Calendar;
            case "PAYMENT": return CreditCard;
            case "REFUND": return Trash2;
            case "CHAT": return MessageSquare;
            case "PROPERTY": return Home;
            case "SERVICE": return Shield;
            default: return Bell;
        }
    };

    const getColor = (type) => {
        switch (type?.toUpperCase()) {
            case "BOOKING": return "text-blue-600 bg-blue-500/10 border-blue-500/20 dark:text-blue-400";
            case "PAYMENT": return "text-green-600 bg-green-500/10 border-green-500/20 dark:text-green-400";
            case "REFUND": return "text-red-600 bg-red-500/10 border-red-500/20 dark:text-red-400";
            case "CHAT": return "text-purple-600 bg-purple-500/10 border-purple-500/20 dark:text-purple-400";
            case "PROPERTY": return "text-amber-600 bg-amber-500/10 border-amber-500/20 dark:text-amber-400";
            case "SERVICE": return "text-teal-600 bg-teal-500/10 border-teal-500/20 dark:text-teal-400";
            default: return "text-gray-500 bg-gray-500/10 border-gray-500/20 dark:text-gray-400";
        }
    };

    const formatTime = (date) => {
        if (!date) return "";
        return new Date(date).toLocaleString(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short'
        });
    };

    return (
        <div className="rounded-3xl border border-gray-250 bg-white/70 p-6 dark:border-gray-800/80 dark:bg-gray-900/60 shadow-[0_8px_30px_rgb(0,0,0,0.012)] backdrop-blur-md transition-all duration-300 hover:shadow-[0_15px_40px_rgba(70,95,255,0.03)]">
            
            {/* Header / Actions Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h3 className="text-base font-bold text-gray-800 dark:text-white/90">
                        System Notifications
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">Stay updated with the latest activities across bookings, properties, and finance.</p>
                </div>
                <div className="flex items-center shrink-0">
                    <button
                        onClick={handleClearAll}
                        disabled={notifications.length === 0}
                        className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-red-500 hover:text-red-600 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 rounded-xl transition-all duration-150 shadow-xs active:scale-95 uppercase tracking-wider disabled:opacity-40 disabled:pointer-events-none"
                    >
                        <Trash2 size={14} />
                        Purge All
                    </button>
                </div>
            </div>

            <div className="space-y-3.5">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 opacity-60">
                        <div className="w-8 h-8 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin mb-4"></div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Syncing Notifications</p>
                    </div>
                ) : notifications.length > 0 ? (
                    notifications.map((notification) => {
                        const Icon = getIcon(notification.type);
                        const colors = getColor(notification.type);
                        return (
                            <div
                                key={notification._id}
                                onClick={() => handleNotificationClick(notification)}
                                className={`group relative flex items-start gap-4 p-4.5 rounded-2xl border transition-all duration-200 cursor-pointer hover:shadow-[0_8px_30px_rgba(70,95,255,0.02)] hover:scale-[1.008] active:scale-100 ${!notification.isRead
                                    ? 'bg-white/80 dark:bg-white/[0.02] border-brand-500/25 shadow-xs'
                                    : 'bg-gray-50/30 dark:bg-transparent border-gray-100/60 dark:border-gray-800/40 opacity-75'
                                    }`}
                            >
                                <div className={`shrink-0 flex items-center justify-center w-12 h-12 rounded-xl border transition-transform duration-300 group-hover:scale-105 ${colors}`}>
                                    <Icon size={20} />
                                </div>

                                <div className="flex-1 min-w-0 pr-12">
                                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                        <Badge size="xs" color={
                                            notification.type === 'BOOKING' ? 'info' :
                                                notification.type === 'PAYMENT' ? 'success' :
                                                    notification.type === 'REFUND' ? 'error' :
                                                        notification.type === 'CHAT' ? 'primary' :
                                                            notification.type === 'PROPERTY' ? 'warning' :
                                                                notification.type === 'SERVICE' ? 'success' : 'primary'
                                        }>
                                            {notification.type}
                                        </Badge>
                                        <span className="flex items-center gap-1 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                                            <Clock size={10} className="text-gray-300" />
                                            {formatTime(notification.createdAt)}
                                        </span>
                                    </div>

                                    <h4 className={`text-sm font-bold mb-1 ${!notification.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                                        {notification.title}
                                    </h4>

                                    <p className={`text-xs leading-relaxed font-medium line-clamp-1 italic ${!notification.isRead ? 'text-gray-500 dark:text-gray-400' : 'text-gray-450 dark:text-gray-500'}`}>
                                        {notification.body || notification.message}
                                    </p>
                                </div>

                                <div className="absolute top-4.5 right-4.5 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <button
                                        onClick={(e) => handleDelete(e, notification._id)}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 border border-gray-100 dark:border-gray-800 rounded-xl transition-all shadow-xs bg-white dark:bg-gray-800"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                {!notification.isRead && (
                                    <div className="absolute top-5 right-5 w-2 h-2 bg-brand-500 rounded-full shadow-lg shadow-brand-500/40 group-hover:opacity-0 transition-opacity"></div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in duration-300">
                        <div className="w-16 h-16 bg-gray-150/40 dark:bg-gray-800/40 rounded-2xl flex items-center justify-center mb-5 shadow-xs border border-gray-100/40 dark:border-gray-800/40">
                            <Bell className="text-gray-300 dark:text-gray-600" size={28} />
                        </div>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1.5">No notifications found</h3>
                        <p className="text-gray-400 dark:text-gray-500 max-w-[240px] text-xs font-medium leading-relaxed">
                            You're all caught up! No notifications in this category.
                        </p>
                    </div>
                )}
            </div>

            <NotificationDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                notificationId={selectedId}
            />
        </div>
    );
}
