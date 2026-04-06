import React, { useState, useEffect } from "react";
import { Modal } from "../ui/modal";
import { getNotificationDetails } from "../../api/authApi";
import { 
    Calendar, 
    CreditCard, 
    MessageSquare, 
    Bell, 
    Clock, 
    User, 
    Hash,
    Info,
    ArrowRight
} from "lucide-react";
import Badge from "../ui/badge/Badge";
import { Link } from "react-router";

const DetailRow = ({ icon: Icon, label, value, color = "text-gray-500" }) => (
    <div className="flex items-start gap-3 py-3 border-b border-gray-50 dark:border-gray-800 last:border-0 transition-all hover:bg-gray-50/50 dark:hover:bg-white/[0.02] px-2 rounded-xl">
        <div className={`shrink-0 mt-0.5 ${color}`}>
            <Icon size={18} />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{label}</p>
            <p className="text-sm font-black text-gray-900 dark:text-white break-words">{value || "N/A"}</p>
        </div>
    </div>
);

export default function NotificationDetailsModal({ isOpen, onClose, notificationId }) {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && notificationId) {
            fetchDetails();
        } else {
            setDetails(null);
        }
    }, [isOpen, notificationId]);

    const fetchDetails = async () => {
        try {
            setLoading(true);
            const res = await getNotificationDetails(notificationId);
            if (res?.data) {
                setDetails(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch notification details:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const getIcon = (type) => {
        switch (type) {
            case "BOOKING": return Calendar;
            case "PAYMENT": return CreditCard;
            case "CHAT": return MessageSquare;
            default: return Bell;
        }
    };

    const getColors = (type) => {
        switch (type) {
            case "BOOKING": return "bg-blue-500 shadow-blue-500/20 text-white";
            case "PAYMENT": return "bg-green-500 shadow-green-500/20 text-white";
            case "CHAT": return "bg-purple-500 shadow-purple-500/20 text-white";
            default: return "bg-brand shadow-brand/20 text-white";
        }
    };

    const formatCurrency = (amt) => {
        if (!amt) return "SAR 0.00";
        return new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR' }).format(amt);
    };

    const formatDate = (date) => {
        if (!date) return "";
        return new Date(date).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose}
            className="max-w-[500px]"
        >
            <div className="p-6 md:p-8">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-brand/20 border-t-brand rounded-full animate-spin mb-4"></div>
                        <p className="text-sm font-black text-gray-400 uppercase tracking-widest animate-pulse">Retrieving Alert Data...</p>
                    </div>
                ) : details ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Header Header */}
                        <div className="flex items-center gap-4 mb-8">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl ${getColors(details.type)} transition-transform hover:scale-110 duration-500`}>
                                {React.createElement(getIcon(details.type), { size: 32 })}
                            </div>
                            <div className="flex-1 min-w-0">
                                <Badge color={details.type === 'BOOKING' ? 'blue' : details.type === 'PAYMENT' ? 'success' : 'warning'} className="mb-2">
                                    {details.type}
                                </Badge>
                                <h3 className="text-xl font-black text-gray-900 dark:text-white leading-tight">
                                    {details.title}
                                </h3>
                            </div>
                        </div>

                        {/* Description Section */}
                        <div className="bg-gray-50 dark:bg-white/[0.03] p-5 rounded-3xl mb-8 border border-gray-100 dark:border-gray-800">
                            <div className="flex items-start gap-3">
                                <Info className="text-brand shrink-0 mt-1" size={20} />
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-300 leading-relaxed italic">
                                    "{details.body}"
                                </p>
                            </div>
                        </div>

                        {/* Data Sections */}
                        <div className="space-y-1 mb-8">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 px-2">Metadata Details</h4>
                            
                            {details.data?.bookingId && (
                                <DetailRow 
                                    icon={Hash} 
                                    label="Booking Identifier" 
                                    value={details.data.bookingId} 
                                    color="text-blue-500" 
                                />
                            )}
                            
                            {details.data?.totalAmount && (
                                <DetailRow 
                                    icon={CreditCard} 
                                    label="Financial Total" 
                                    value={formatCurrency(details.data.totalAmount)} 
                                    color="text-green-500" 
                                />
                            )}

                            {details.data?.bookingStatus && (
                                <DetailRow 
                                    icon={Info} 
                                    label="Status Logic" 
                                    value={details.data.bookingStatus.toUpperCase()} 
                                    color="text-orange-500" 
                                />
                            )}

                            {details.data?.checkIn && (
                                <DetailRow 
                                    icon={Calendar} 
                                    label="Timeline (Check-In)" 
                                    value={formatDate(details.data.checkIn)} 
                                    color="text-brand" 
                                />
                            )}

                            <DetailRow 
                                icon={Clock} 
                                label="Created At" 
                                value={formatDate(details.createdAt)} 
                            />
                        </div>

                        {/* Action Primary */}
                        <div className="flex gap-3 mt-4">
                            {details.referenceId && details.referenceType === 'Booking' && (
                                <Link 
                                    to={`/booking-details/${details.referenceId}`}
                                    onClick={onClose}
                                    className="flex-1 flex items-center justify-center gap-2 py-4 bg-brand hover:bg-brand-dark text-white rounded-2xl font-black text-sm transition-all shadow-xl shadow-brand/20 active:scale-95 duration-200"
                                >
                                    View Full Booking
                                    <ArrowRight size={18} />
                                </Link>
                            )}
                            <button 
                                onClick={onClose}
                                className="px-8 py-4 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-2xl font-black text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-all active:scale-95"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                            <Info className="text-red-500" size={32} />
                        </div>
                        <h4 className="text-lg font-black text-gray-900 dark:text-white mb-1">Data Mismatch</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Successfully reached server, but details were not found.</p>
                    </div>
                )}
            </div>
        </Modal>
    );
}
