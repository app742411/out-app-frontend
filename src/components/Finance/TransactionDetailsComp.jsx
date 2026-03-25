import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import ComponentCard from "../common/ComponentCard";
import { getTransactionDetails } from "../../api/authApi";
import Button from "../ui/button/Button";
import Badge from "../ui/badge/Badge";
import toast from "react-hot-toast";
import { 
    ArrowLeft, 
    CreditCard, 
    Calendar, 
    User, 
    Building, 
    ReceiptText,
    CheckCircle2,
    Clock,
    XCircle,
    Hash
} from "lucide-react";

export default function TransactionDetailsComp() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [transaction, setTransaction] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);
                const res = await getTransactionDetails(id);
                setTransaction(res.data);
            } catch (error) {
                toast.error("Failed to load transaction details");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-500"></div>
            </div>
        );
    }

    if (!transaction) {
        return (
            <div className="text-center p-20">
                <p className="text-gray-500">Transaction not found.</p>
                <Button onClick={() => navigate(-1)} className="mt-4">Go Back</Button>
            </div>
        );
    }

    const { booking, rawResponse } = transaction;

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case "success":
            case "captured":
                return <CheckCircle2 className="w-5 h-5 text-green-500" />;
            case "pending":
            case "initiated":
                return <Clock className="w-5 h-5 text-amber-500" />;
            case "failed":
                return <XCircle className="w-5 h-5 text-red-500" />;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            Transaction Summary 
                            <span className="text-sm font-normal text-gray-500">#{transaction.orderId}</span>
                        </h2>
                        <p className="text-xs text-gray-500">Payment ID: {transaction.tapChargeId}</p>
                    </div>
                </div>
                <Badge color={transaction.status === 'success' ? 'success' : 'warning'}>
                    {transaction.status?.toUpperCase()}
                </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Payment Info */}
                <div className="lg:col-span-2 space-y-6">
                    <ComponentCard title="Payment Information" icon={<CreditCard className="w-5 h-5" />}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase font-bold text-gray-400">Total Amount</label>
                                <p className="text-2xl font-black text-brand-600 dark:text-brand-400">
                                    {transaction.currency} {transaction.totalAmount || transaction.amount}
                                </p>
                            </div>
                            <div className="space-y-1 text-right">
                                <label className="text-[10px] uppercase font-bold text-gray-400">Transaction Date</label>
                                <p className="text-sm font-semibold flex items-center justify-end gap-1">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    {new Date(transaction.createdAt).toLocaleString()}
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-dashed border-gray-100 dark:border-gray-800">
                            <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
                                <ReceiptText className="w-4 h-4 text-brand-500" />
                                Financial Breakdown
                            </h4>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Provider Amount</span>
                                    <span className="font-semibold">{transaction.currency} {transaction.providerAmount || 0}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Commission Amount</span>
                                    <span className="font-semibold text-orange-600">+{transaction.currency} {transaction.commissionAmount || 0}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Platform Fee</span>
                                    <span className="font-semibold">+{transaction.currency} {transaction.platformFee || 0}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Tax</span>
                                    <span className="font-semibold">+{transaction.currency} {transaction.tax || 0}</span>
                                </div>
                                {rawResponse?.couponId && (
                                    <div className="flex justify-between items-center text-sm pt-2 text-green-600 font-bold">
                                        <div className="flex items-center gap-1">
                                            <Hash className="w-3 h-3" /> Coupon Applied
                                        </div>
                                        <span>{rawResponse.couponId}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </ComponentCard>

                    <ComponentCard title="Raw Gateway Response" className="opacity-80">
                        <pre className="text-[11px] font-mono bg-gray-50 dark:bg-gray-950 p-4 rounded-xl overflow-auto text-gray-600 dark:text-gray-400 max-h-60">
                            {JSON.stringify(rawResponse, null, 2)}
                        </pre>
                    </ComponentCard>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    {/* Customer Info */}
                    <ComponentCard title="Customer Details" icon={<User className="w-5 h-5" />}>
                        {booking?.user ? (
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold">
                                        {booking.user.firstName?.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white capitalize">
                                            {booking.user.firstName} {booking.user.lastName}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">{booking.user.email}</p>
                                    </div>
                                </div>
                                <div className="pt-2 border-t border-gray-50 dark:border-gray-800">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Phone</p>
                                    <p className="text-xs font-medium">{booking.user.phone || "N/A"}</p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 italic text-center py-4">User data unavailable</p>
                        )}
                    </ComponentCard>

                    {/* Booking Info */}
                    <ComponentCard title="Related Booking" icon={<Building className="w-5 h-5" />}>
                        {booking ? (
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Property</p>
                                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{booking.hotel?.name || "Unknown Property"}</p>
                                    <p className="text-xs text-gray-500">{booking.hotel?.address?.city || "No Address"}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase">Check-In</p>
                                        <p className="text-xs font-semibold">{booking.checkIn ? new Date(booking.checkIn).toLocaleDateString() : "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase">Check-Out</p>
                                        <p className="text-xs font-semibold">{booking.checkOut ? new Date(booking.checkOut).toLocaleDateString() : "N/A"}</p>
                                    </div>
                                </div>
                                <Button 
                                    size="sm" 
                                    variant="outline" 
                                    fullWidth
                                    onClick={() => navigate(`/booking-details/${booking._id}`)}
                                >
                                    View Full Booking
                                </Button>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 italic text-center py-4">Booking data unavailable</p>
                        )}
                    </ComponentCard>
                </div>
            </div>
        </div>
    );
}
