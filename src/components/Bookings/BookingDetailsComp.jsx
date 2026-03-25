import React, { useState, useEffect } from "react";
import ComponentCard from "../common/ComponentCard";
import { getBookingDetails } from "../../api/authApi";
import { useParams } from "react-router";
import toast from "react-hot-toast";
import Badge from "../ui/badge/Badge";
import Button from "../ui/button/Button";
import UserPropertiesList from "../Users/UserPropertiesList";

export default function BookingDetailsComp() {
    const { id } = useParams();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showProperties, setShowProperties] = useState(false);
    const baseURL = import.meta.env.VITE_API_URL;

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
        fetchDetails();
    }, [id]);

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "confirmed":
            case "success":
            case "paid":
                return "success";
            case "pending":
                return "warning";
            case "cancelled":
            case "failed":
                return "error";
            default:
                return "light";
        }
    };

    if (loading) return <div className="text-center p-12 text-gray-500">Loading details...</div>;
    if (!booking) return <div className="text-center p-12 text-red-500">Booking not found</div>;

    const { property, hotel, user, services } = booking;
    const activeProperty = property || hotel;

    const renderImages = (images, title, type) => {
        if (!images || images.length === 0) return null;
        let folder = "mainImage";
        if (type === "bedroom") folder = "bedroom";
        if (type === "bathroom") folder = "bathroom";

        return (
            <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wider">{title}</h4>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    {images.map((img, idx) => (
                        <div key={idx} className="min-w-[200px] h-[150px] flex-shrink-0 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                            <img 
                                src={`${baseURL.replace(/\/$/, "")}/uploads/${folder}/${img}`} 
                                alt={`${title} ${idx + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                    e.currentTarget.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-400 text-xs text-center p-2">Image Not Found</div>';
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Booking Info */}
                <div className="lg:col-span-2 space-y-6">
                    <ComponentCard title="Booking Information">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                            <div>
                                <label className="text-xs text-gray-500 uppercase">Order ID</label>
                                <p className="font-medium text-gray-900 dark:text-white">{booking.orderId}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase">Total Amount</label>
                                <p className="font-bold text-gray-900 dark:text-white text-lg">{booking.paymentTransaction?.currency || "SAR"} {booking.totalAmount || booking.amount}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase">Booking Status</label>
                                <div className="mt-1">
                                    <Badge color={getStatusColor(booking.bookingStatus)}>{booking.bookingStatus}</Badge>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase">Payment Status</label>
                                <div className="mt-1">
                                    <Badge color={getStatusColor(booking.paymentStatus)}>{booking.paymentStatus}</Badge>
                                    {booking.webhookProcessed && <span className="ml-2 text-[10px] text-green-500 font-medium uppercase tracking-tight">● Webhook Processed</span>}
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase">Booking Type</label>
                                <div className="mt-1">
                                    <Badge color="info" className="uppercase">{booking.bookingType?.replace("_", " ")}</Badge>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase">Check-In</label>
                                <p className="font-medium">{booking.checkIn ? new Date(booking.checkIn).toLocaleDateString() : "N/A"}</p>
                                <p className="text-xs text-gray-400">{activeProperty?.policies?.checkInTime || "N/A"}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase">Check-Out</label>
                                <p className="font-medium">{booking.checkOut ? new Date(booking.checkOut).toLocaleDateString() : "N/A"}</p>
                                <p className="text-xs text-gray-400">{activeProperty?.policies?.checkOutTime || "N/A"}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase">Guests</label>
                                <p className="font-medium">{booking.adults || 0} Adults, {booking.children || 0} Children</p>
                                <p className="text-xs text-gray-400">Capacity: {activeProperty?.maxGuests ? `Up to ${activeProperty.maxGuests} guests` : "N/A"}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase">Booked On</label>
                                <p className="font-medium">{booking.createdAt ? new Date(booking.createdAt).toLocaleString() : "N/A"}</p>
                            </div>
                        </div>
                    </ComponentCard>

                    {/* Services Details */}
                    {services && services.length > 0 && (
                        <ComponentCard title="Booked Services">
                            <div className="space-y-4">
                                {services.map((s, idx) => (
                                    <div key={idx} className="flex justify-between items-center p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-500">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900 dark:text-white">{s.service?.name || "Service Name N/A"}</p>
                                                <p className="text-xs text-gray-500">Service ID: {s.service?._id || s._id || "N/A"}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-gray-900 dark:text-white">
                                                {booking.paymentTransaction?.currency || "SAR"} {(s.price || s.service?.price || 0).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ComponentCard>
                    )}

                    {/* Policies & Rules */}
                    {activeProperty?.policies && (
                        <ComponentCard title="Policies & House Rules">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center">
                                    <span className="text-xs text-gray-500 mb-1 uppercase">Pets</span>
                                    <Badge color={activeProperty.policies.houseRules?.petsAllowed ? "success" : "light"}>
                                        {activeProperty.policies.houseRules?.petsAllowed ? "Allowed" : "Not Allowed"}
                                    </Badge>
                                </div>
                                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center">
                                    <span className="text-xs text-gray-500 mb-1 uppercase">Smoking</span>
                                    <Badge color={activeProperty.policies.houseRules?.smokingAllowed ? "success" : "light"}>
                                        {activeProperty.policies.houseRules?.smokingAllowed ? "Allowed" : "Not Allowed"}
                                    </Badge>
                                </div>
                                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center">
                                    <span className="text-xs text-gray-500 mb-1 uppercase">Parties</span>
                                    <Badge color={activeProperty.policies.houseRules?.partiesAllowed ? "success" : "light"}>
                                        {activeProperty.policies.houseRules?.partiesAllowed ? "Allowed" : "Not Allowed"}
                                    </Badge>
                                </div>
                            </div>

                            {activeProperty.policies.additionalPolicies?.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">Additional Policies</h4>
                                    <ul className="space-y-2">
                                        {activeProperty.policies.additionalPolicies.map((policy, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0"></span>
                                                {policy}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </ComponentCard>
                    )}

                    {activeProperty && (
                        <ComponentCard title="Property Details">
                            <div className="mb-4">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white capitalize">{activeProperty.name}</h3>
                                <p className="text-gray-500 flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                    {activeProperty.address?.city || "N/A"}
                                </p>
                                <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm whitespace-pre-wrap">{activeProperty.description || "No description available"}</p>
                            </div>
                            
                            {renderImages(activeProperty.media?.mainImage, "Main Image", "mainImage")}
                            {renderImages(activeProperty.media?.bedroom, "Bedroom Gallery", "bedroom")}
                            {renderImages(activeProperty.media?.bathroom, "Bathroom Gallery", "bathroom")}
                        </ComponentCard>
                    )}
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <ComponentCard title="User Information">
                        <div className="flex flex-col items-center mb-6">
                            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-brand-500/20 mb-3 bg-gray-100 flex items-center justify-center">
                                {user?.profile ? (
                                    <img 
                                        src={`${baseURL.replace(/\/$/, "")}/uploads/users/${user.profile}`} 
                                        alt="User Profile"
                                        className="w-full h-full object-cover"
                                        onError={(e) => { e.currentTarget.src = "/images/user/user-01.jpg"; }}
                                    />
                                ) : (
                                    <span className="text-2xl font-bold text-brand-500">
                                        {user?.email?.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">{user?.name || user?.email?.split('@')[0]}</p>
                            <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>
                        <div className="space-y-4 border-t pt-4">
                            <div>
                                <label className="text-xs text-gray-500 uppercase">Phone Number</label>
                                <p className="font-medium text-sm">{user?.phone || "N/A"}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase">User ID</label>
                                <p className="font-mono text-[10px] break-all text-gray-400">{user?._id}</p>
                            </div>
                        </div>
                    </ComponentCard>

                    {booking.paymentTransaction && (
                        <ComponentCard title="Payment & Transaction">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-gray-500 uppercase">Tap Charge ID</label>
                                    <p className="font-mono text-xs break-all text-blue-500">{booking.tapChargeId || booking.paymentTransaction.tapChargeId}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase">Transaction Status</label>
                                    <div className="mt-1">
                                        <Badge color={getStatusColor(booking.paymentTransaction.status)}>
                                            {booking.paymentTransaction.status}
                                        </Badge>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase">Currency</label>
                                    <p className="font-medium">{booking.paymentTransaction.currency}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase">Transaction ID</label>
                                    <p className="font-mono text-[10px] text-gray-400 break-all">{booking.paymentTransaction._id}</p>
                                </div>
                                {booking.paymentTransaction.rawResponse?.couponId && (
                                    <div>
                                        <label className="text-xs text-brand-500 uppercase font-semibold">Coupon Used</label>
                                        <p className="font-mono text-[10px] text-brand-600 break-all">{booking.paymentTransaction.rawResponse.couponId}</p>
                                    </div>
                                )}
                            </div>
                        </ComponentCard>
                    )}

                    <ComponentCard title="Technical Details">
                        <details className="cursor-pointer">
                            <summary className="text-xs text-gray-400 uppercase font-medium">View Raw Transaction Response</summary>
                            <pre className="mt-4 p-4 bg-gray-900 text-gray-300 rounded-lg text-[10px] overflow-auto max-h-60 scrollbar-hide">
                                {JSON.stringify(booking.paymentTransaction?.rawResponse, null, 2)}
                            </pre>
                        </details>
                    </ComponentCard>
                    
                    <ComponentCard title="Financial Summary">
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Property Price</span>
                                <span className="text-gray-900 dark:text-white font-medium">
                                    {booking.paymentTransaction?.currency || "SAR"} {(booking.priceBreakdown?.propertyPrice || 0).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Service Price</span>
                                <span className="text-gray-900 dark:text-white font-medium">
                                    {booking.paymentTransaction?.currency || "SAR"} {(booking.priceBreakdown?.servicePrice || 0).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Platform Fee</span>
                                <span className="text-gray-900 dark:text-white font-medium">
                                    + {booking.paymentTransaction?.currency || "SAR"} {(booking.platformFee || 0).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Tax</span>
                                <span className="text-gray-900 dark:text-white font-medium">
                                    + {booking.paymentTransaction?.currency || "SAR"} {(booking.tax || 0).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between border-t border-dashed pt-2 mt-2">
                                <span className="text-gray-500 italic">Commission (Inc.)</span>
                                <span className="text-green-600 font-medium">
                                    {booking.paymentTransaction?.currency || "SAR"} {(booking.commissionAmount || 0).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between font-bold text-xl pt-4 border-t mt-4">
                                <span className="text-gray-900 dark:text-white">Total Amount</span>
                                <span className="text-brand-500">
                                    {booking.paymentTransaction?.currency || "SAR"} {(booking.totalAmount || booking.amount || 0).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </ComponentCard>

                    <Button
                        onClick={() => setShowProperties(!showProperties)}
                        variant="outline"
                        className="w-full py-3"
                    >
                        {showProperties ? "Hide User Properties" : "View User Properties"}
                    </Button>
                </div>
            </div>

            {showProperties && (
                <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <UserPropertiesList userId={user?._id} />
                </div>
            )}
        </div>
    );
}
