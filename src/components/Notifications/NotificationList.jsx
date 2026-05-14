import React, { useState, useEffect } from "react";
import {
    Bell,
    Calendar,
    CreditCard,
    MessageSquare,
    Clock,
    Trash2,
    Filter,
} from "lucide-react";
import ComponentCard from "../common/ComponentCard";
import Badge from "../ui/badge/Badge";
import { getAllNotificationsAdmin, adminDeleteNotifications } from "../../api/authApi";
import { useSocket } from "../../context/SocketContext";
import toast from "react-hot-toast";
import NotificationDetailsModal from "./NotificationDetailsModal";
import Select from "../ui/select/Select";

export default function NotificationList() {
    const { notifications, setNotifications } = useSocket();
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState("all");
    const [activeTab, setActiveTab] = useState("active");

    const [selectedId, setSelectedId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const params = {
                isDeleted: activeTab === "deleted",
                type: filterType === "all" ? undefined : filterType
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
    }, [filterType, activeTab]);

    const handleNotificationClick = (id) => {
        setSelectedId(id);
        setIsModalOpen(true);
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation(); // Don't trigger modal
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
            toast.success("All notifications deleted");
        } catch (error) {
            toast.error("Failed to clear notifications");
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case "BOOKING": return Calendar;
            case "PAYMENT": return CreditCard;
            case "REFUND": return Trash2;
            case "CHAT": return MessageSquare;
            default: return Bell;
        }
    };

    const getColor = (type) => {
        switch (type) {
            case "BOOKING": return "text-blue-500 bg-blue-50";
            case "PAYMENT": return "text-green-500 bg-green-50";
            case "REFUND": return "text-red-500 bg-red-50";
            case "CHAT": return "text-purple-500 bg-purple-50";
            default: return "text-gray-500 bg-gray-50";
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
        <ComponentCard
            title="System Notifications"
            desc="Stay updated with the latest activities across bookings, properties, and finance."
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
                        <button
                            onClick={() => setActiveTab("active")}
                            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === "active" ? "bg-white dark:bg-gray-700 shadow-sm text-brand" : "text-gray-500 hover:text-gray-700"}`}
                        >
                            Active
                        </button>
                        <button
                            onClick={() => setActiveTab("deleted")}
                            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === "deleted" ? "bg-white dark:bg-gray-700 shadow-sm text-brand" : "text-gray-500 hover:text-gray-700"}`}
                        >
                            Trash
                        </button>
                    </div>

                    <div className="relative group">
                        <Select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        // className="pl-4 pr-10 py-2 text-xs font-black uppercase tracking-widest bg-gray-50 dark:bg-gray-800 border-none rounded-xl appearance-none cursor-pointer focus:ring-2 focus:ring-brand/20 transition-all text-gray-700 dark:text-gray-200"
                        >
                            <option value="all">All Types</option>
                            <option value="BOOKING">Bookings</option>
                            <option value="CHAT">Conversations</option>
                            <option value="PAYMENT">Payments</option>
                            <option value="REFUND">Refunds</option>
                        </Select>
                        <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleClearAll}
                        disabled={notifications.length === 0}
                        className="flex items-center gap-2 px-6 py-2.5 text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl transition-all disabled:opacity-50 border border-transparent hover:border-red-100"
                    >
                        <Trash2 size={16} />
                        Purge All
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 opacity-60">
                        <div className="w-10 h-10 border-4 border-brand/20 border-t-brand rounded-full animate-spin mb-4"></div>
                        <p className="text-xs font-black uppercase tracking-widest text-gray-400">Syncing Notifications</p>
                    </div>
                ) : notifications.length > 0 ? (
                    notifications.map((notification) => {
                        const Icon = getIcon(notification.type);
                        const colors = getColor(notification.type);
                        return (
                            <div
                                key={notification._id}
                                onClick={() => handleNotificationClick(notification._id)}
                                className={`group relative flex items-start gap-4 p-5 rounded-[2rem] border transition-all duration-300 cursor-pointer hover:shadow-2xl hover:shadow-brand/5 hover:scale-[1.01] active:scale-100 ${!notification.isRead
                                    ? 'bg-white dark:bg-white/[0.03] border-brand/20 shadow-lg shadow-brand/5'
                                    : 'bg-gray-50/50 dark:bg-transparent border-gray-100 dark:border-gray-800 opacity-80'
                                    }`}
                            >
                                <div className={`shrink-0 flex items-center justify-center w-16 h-16 rounded-2xl ${colors} dark:bg-opacity-10 shadow-sm transition-transform group-hover:scale-110 duration-500`}>
                                    <Icon size={32} />
                                </div>

                                <div className="flex-1 min-w-0 pr-10">
                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                        <Badge size="xs" color={
                                            notification.type === 'BOOKING' ? 'blue' :
                                                notification.type === 'PAYMENT' ? 'success' :
                                                    notification.type === 'REFUND' ? 'error' : 'warning'
                                        }>
                                            {notification.type}
                                        </Badge>
                                        <span className="flex items-center gap-1 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                            <Clock size={12} />
                                            {formatTime(notification.createdAt)}
                                        </span>
                                    </div>

                                    <h4 className={`text-base font-black mb-1 ${!notification.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                                        {notification.title}
                                    </h4>

                                    <p className={`text-sm leading-relaxed font-medium line-clamp-1 italic ${!notification.isRead ? 'text-gray-600 dark:text-gray-300' : 'text-gray-500 dark:text-gray-500'}`}>
                                        {notification.body || notification.message}
                                    </p>
                                </div>

                                <div className="absolute top-5 right-5 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <button
                                        onClick={(e) => handleDelete(e, notification._id)}
                                        className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all shadow-sm bg-white dark:bg-gray-800"
                                        title="Delete"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>

                                {!notification.isRead && (
                                    <div className="absolute top-5 right-5 w-3 h-3 bg-brand rounded-full shadow-lg shadow-brand/40 group-hover:opacity-0 transition-opacity"></div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-500">
                        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-[2.5rem] flex items-center justify-center mb-6 shadow-inner border border-gray-50 dark:border-gray-800">
                            <Bell className="text-gray-300" size={40} />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">Clean Slate</h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-[300px] text-sm font-medium leading-relaxed">
                            {filterType === "all"
                                ? "You're all caught up! No notifications in this category yet."
                                : `No ${filterType.toLowerCase()} notifications found at the moment.`}
                        </p>
                    </div>
                )}
            </div>

            <NotificationDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                notificationId={selectedId}
            />
        </ComponentCard>
    );
}
