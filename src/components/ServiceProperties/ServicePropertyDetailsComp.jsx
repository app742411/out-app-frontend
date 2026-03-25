import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import ComponentCard from "../common/ComponentCard";
import { getPropertyDetailsForAdmin } from "../../api/authApi";
import Button from "../ui/button/Button";
import toast from "react-hot-toast";
import UserPropertiesList from "../Users/UserPropertiesList";
import PropertyBookingListComp from "../Bookings/PropertyBookingListComp";
import { useLocation } from "react-router";

export default function ServicePropertyDetailsComp() {
    const { id } = useParams();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showProperties, setShowProperties] = useState(false);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const activeTab = queryParams.get("tab") || "details";

    const baseURL = import.meta.env.VITE_API_URL || "";
    const baseImgUrl = baseURL.replace(/\/$/, "");

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);
                const res = await getPropertyDetailsForAdmin(id);
                if (res.success) {
                    setProperty(res.data);
                } else {
                    toast.error(res.message || "Failed to fetch property details");
                }
            } catch (error) {
                toast.error(error.message || "An error occurred");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchDetails();
        }
    }, [id]);

    if (loading) {
        return <div className="p-6 text-center text-gray-500">Loading property details...</div>;
    }

    if (!property) {
        return <div className="p-6 text-center text-red-500">Property not found.</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white/90 capitalize">
                    {property.name || "Unnamed Property"}
                </h2>
                <div className="flex gap-3">
                    <Link to={`/property-calendar/${id}`}>
                        <Button className="bg-brand-500 text-white">
                            View Availability Calendar
                        </Button>
                    </Link>
                    <Link to="/properties">
                        <Button variant="outline" className="text-gray-600 dark:text-gray-300">
                            Back to Properties
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Property Info summary */}
                <div className="lg:col-span-2 space-y-6">
                    <ComponentCard title="Property Details">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
                                <span className={`px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.1em] inline-block shadow-sm ${property.status === 'publish' || property.status === 'completed'
                                    ? 'bg-green-500 text-white shadow-green-500/20'
                                    : 'bg-orange-500 text-white shadow-orange-500/20'
                                    }`}>
                                    {property.status || "Draft"}
                                </span>
                            </div>
                        </div>

                        {property.document && (
                            <div className="mt-6 p-5 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-[2rem] border-2 border-indigo-100/50 dark:border-indigo-900/20 flex items-center justify-between group transition-all hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/20 group-hover:scale-110 transition-transform">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Property Document</p>
                                        <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-widest mt-0.5">Official Verification PDF Attached</p>
                                    </div>
                                </div>
                                <a
                                    href={`${baseImgUrl}/uploads/propertyDocument/${property.document}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-3 bg-white dark:bg-gray-800 shadow-md hover:shadow-xl rounded-2xl text-[10px] font-black text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all border border-indigo-100 dark:border-indigo-900/40 uppercase tracking-[0.15em] active:scale-95"
                                >
                                    View PDF
                                </a>
                            </div>
                        )}

                        <div className="mt-8">
                            <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Description</h4>
                            <div className="bg-white dark:bg-gray-800/40 p-6 rounded-[2rem] border border-gray-50 dark:border-gray-800 leading-relaxed text-gray-700 dark:text-gray-300 shadow-inner">
                                {property.description || "No description provided."}
                            </div>
                        </div>
                    </ComponentCard>

                    {/* Rooms and features */}
                    <ComponentCard title="Rooms & Amenities Setups">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="bg-gray-50 dark:bg-gray-800/40 p-5 rounded-3xl border border-gray-100 dark:border-gray-800/50">
                                <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                                    Bedroom Configuration
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-gray-400 font-bold uppercase">Total Bedrooms</span>
                                        <span className="text-xl font-bold text-gray-900 dark:text-white">{property.bedRoom?.numBedroom || 0}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-gray-400 font-bold uppercase">Master Beds</span>
                                        <span className="text-xl font-bold text-gray-900 dark:text-white">{property.bedRoom?.numMasterBed || 0}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-gray-400 font-bold uppercase">Single Beds</span>
                                        <span className="text-xl font-bold text-gray-900 dark:text-white">{property.bedRoom?.numSingleBed || 0}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-gray-400 font-bold uppercase">Total Capacity</span>
                                        <span className="text-xl font-bold text-indigo-600 underline decoration-indigo-200 underline-offset-4">{property.maxGuests || 0} Guests</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800/40 p-5 rounded-3xl border border-gray-100 dark:border-gray-800/50">
                                <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                    Bathroom Setup
                                </h4>
                                <div className="space-y-4">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-gray-400 font-bold uppercase">Total Bathrooms</span>
                                        <span className="text-xl font-bold text-gray-900 dark:text-white">{property.restRoom?.numBathroom || 0}</span>
                                    </div>
                                    {property.restRoom?.facilities?.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 pt-2">
                                            {property.restRoom.facilities.map((f, i) => (
                                                <span key={i} className="text-[8px] font-black uppercase px-2 py-0.5 bg-white dark:bg-gray-800 text-gray-500 rounded-md border border-gray-100 dark:border-gray-700">{f}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {property.pool && (
                            <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
                                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Pool Specifications</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-2xl border border-blue-100/50 dark:border-blue-900/20">
                                        <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-1">Dimensions</p>
                                        <p className="font-bold text-gray-900 dark:text-white">{property.pool.dimension?.height}cm × {property.pool.dimension?.width}cm</p>
                                    </div>
                                    <div className="bg-indigo-50 dark:bg-indigo-900/10 p-4 rounded-2xl border border-indigo-100/50 dark:border-indigo-900/20">
                                        <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mb-1">Gradient ({property.pool.gradient?.type || 'N/A'})</p>
                                        <p className="font-bold text-gray-900 dark:text-white">Depth: {property.pool.gradient?.feet1}ft - {property.pool.gradient?.feet2}ft</p>
                                    </div>
                                    <div className="md:col-span-1">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Pool Features</p>
                                        <div className="flex flex-wrap gap-2">
                                            {property.pool.additional?.map((item, idx) => (
                                                <span key={idx} className="text-[9px] font-medium bg-white dark:bg-gray-800 px-3 py-1 rounded-full border border-gray-100 dark:border-gray-850 shadow-sm">{item}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {property.propertyAmenities && property.propertyAmenities.length > 0 && (
                            <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
                                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Detailed Amenities List</h4>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {property.propertyAmenities.map((amn) => (
                                        <div key={amn._id} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-900 rounded-2xl border border-gray-50 dark:border-gray-800 shadow-sm transition-all hover:shadow-md">
                                            <div className="w-8 h-8 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-brand-500">
                                                <span className="text-[10px] font-black uppercase opacity-60">{amn.name?.charAt(0)}</span>
                                            </div>
                                            <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">{amn.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </ComponentCard>

                    <ComponentCard title="Policies & House Rules">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div>
                                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Timing Policies</h4>
                                <div className="flex gap-12 bg-white dark:bg-gray-800/40 p-6 rounded-[2rem] border border-gray-50 dark:border-gray-800 shadow-sm">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-indigo-500 font-black uppercase tracking-widest mb-1.5">Check-In After</span>
                                        <span className="text-2xl font-black text-gray-900 dark:text-white">{property.policies?.checkInTime || "3:00 PM"}</span>
                                    </div>
                                    <div className="w-px h-12 bg-gray-100 dark:bg-gray-700 self-center"></div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-orange-500 font-black uppercase tracking-widest mb-1.5">Check-Out Before</span>
                                        <span className="text-2xl font-black text-gray-900 dark:text-white">{property.policies?.checkOutTime || "11:00 AM"}</span>
                                    </div>
                                </div>

                                <div className="mt-8 space-y-4">
                                    <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global House Rules</h5>
                                    <div className="flex gap-3 flex-wrap">
                                        <div className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${property.policies?.houseRules?.petsAllowed ? 'bg-green-500 text-white' : 'bg-red-50 text-red-500 border border-red-100'}`}>
                                            {property.policies?.houseRules?.petsAllowed ? <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg> : <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" /></svg>}
                                            Pets Allowed
                                        </div>
                                        <div className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${property.policies?.houseRules?.smokingAllowed ? 'bg-green-500 text-white' : 'bg-red-50 text-red-500 border border-red-100'}`}>
                                            {property.policies?.houseRules?.smokingAllowed ? <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg> : <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" /></svg>}
                                            Smoking Allowed
                                        </div>
                                        <div className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${property.policies?.houseRules?.partiesAllowed ? 'bg-green-500 text-white' : 'bg-red-50 text-red-500 border border-red-100'}`}>
                                            {property.policies?.houseRules?.partiesAllowed ? <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg> : <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" /></svg>}
                                            Parties Allowed
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Additional Terms</h4>
                                <div className="space-y-3">
                                    {property.policies?.additionalPolicies?.length > 0 ? (
                                        property.policies.additionalPolicies.map((p, i) => {
                                            let content = p;
                                            try { if (p.startsWith("[")) content = JSON.parse(p)[0]; } catch (e) { }
                                            return (
                                                <div key={i} className="bg-gray-50 dark:bg-gray-800 p-5 rounded-3xl border border-gray-100 dark:border-gray-800 flex items-start gap-4">
                                                    <span className="w-6 h-6 shrink-0 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center font-black text-[10px]">{i + 1}</span>
                                                    <p className="text-sm italic text-gray-600 dark:text-gray-400">"{content}"</p>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p className="text-xs text-gray-400 italic">No additional policies provided.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </ComponentCard>
                </div>

                {/* Right Column: Owner & address */}
                <div className="space-y-6">
                    <ComponentCard title="Owner Information">
                        {property.user ? (
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xl font-bold text-gray-500 dark:text-gray-400 uppercase">
                                        {property.user.firstName?.charAt(0)}{property.user.lastName?.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800 dark:text-white/90 capitalize">
                                            {property.user.firstName} {property.user.lastName}
                                        </h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Service User</p>
                                    </div>
                                </div>

                                <div className="space-y-2 text-sm mt-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Email:</span>
                                        <span className="font-medium">{property.user.email}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Phone:</span>
                                        <span className="font-medium">{property.user.phone || "N/A"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Status:</span>
                                        <span className={`font-medium ${property.user.isActive ? 'text-green-600' : 'text-red-500'}`}>
                                            {property.user.isActive ? "Active" : "Blocked"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-500 italic text-sm text-center">No structural owner data.</p>
                        )}
                    </ComponentCard>

                    <ComponentCard title="Location">
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">City:</span>
                                <span className="font-medium capitalize">{property.address?.city || "N/A"}</span>
                            </div>
                        </div>
                    </ComponentCard>
                </div>
            </div>

            {/* Gallery Section */}
            <ComponentCard title="Media Gallery">
                {property.media && (property.media.mainImage?.length > 0 || property.media.bathroom?.length > 0 || property.media.bedroom?.length > 0) ? (
                    <div className="space-y-8">
                        {property.media.mainImage && property.media.mainImage.length > 0 && (
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 uppercase">Main Image(s)</h4>
                                <div className="flex gap-4 overflow-x-auto pb-4">
                                    {property.media.mainImage.map((img, i) => (
                                        <div key={i} className="min-w-[200px] h-[150px] flex-shrink-0 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800/50">
                                            <img
                                                src={`${baseImgUrl}/uploads/mainImage/${img}`}
                                                alt={`Main Property img ${i + 1}`}
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
                        )}

                        {property.media.bathroom && property.media.bathroom.length > 0 && (
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 uppercase">Bathroom Images</h4>
                                <div className="flex gap-4 overflow-x-auto pb-4">
                                    {property.media.bathroom.map((img, i) => (
                                        <div key={i} className="min-w-[200px] h-[150px] flex-shrink-0 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800/50">
                                            <img
                                                src={`${baseImgUrl}/uploads/bathroom/${img}`}
                                                alt={`Bathroom ${i + 1}`}
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
                        )}

                        {property.media.bedroom && property.media.bedroom.length > 0 && (
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 uppercase">Bedroom Images</h4>
                                <div className="flex gap-4 overflow-x-auto pb-4">
                                    {property.media.bedroom.map((img, i) => (
                                        <div key={i} className="min-w-[200px] h-[150px] flex-shrink-0 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800/50">
                                            <img
                                                src={`${baseImgUrl}/uploads/bedroom/${img}`}
                                                alt={`Bedroom ${i + 1}`}
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
                        )}
                    </div>
                ) : (
                    <div className="text-center p-8 text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-200 dark:border-gray-700">
                        No media available for this property.
                    </div>
                )}
            </ComponentCard>

            {/* Bookings Section */}
            <div id="bookings-section" className="mt-8">
                <PropertyBookingListComp propertyId={id} />
            </div>

            {/* Show more properties by this user */}
            {property.user?._id && (
                <div className="w-full pt-8 pb-4">
                    <div className="flex justify-center mb-8">
                        <Button
                            onClick={() => setShowProperties(!showProperties)}
                            className="bg-brand-500 hover:bg-brand-600 text-white"
                        >
                            {showProperties ? "Hide Properties" : "See all listed service properties"}
                        </Button>
                    </div>

                    {showProperties && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <UserPropertiesList userId={property.user._id} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
