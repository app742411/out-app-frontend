import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ServicePropertyCalendarComp from "../../components/ServiceProperties/ServicePropertyCalendarComp";
import { getPropertyDetailsForAdmin } from "../../api/authApi";
import { Building, MapPin } from "lucide-react";

export default function ServicePropertyCalendarPage() {
    const { id } = useParams();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const res = await getPropertyDetailsForAdmin(id);
                setProperty(res.data);
            } catch (error) {
                console.error("Failed to fetch property details", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProperty();
    }, [id]);

    return (
        <div className="w-full">
            <PageMeta title="Property Availability Calendar | Out Admin" />
            <PageBreadcrumb pageTitle="Property Calendar" />
            
            <div className="mt-6 space-y-6">
                {/* Property Brief Info */}
                {!loading && property && (
                    <div className="p-4 rounded-xl border border-gray-100 dark:border-white/5 bg-white dark:bg-white/[0.03] flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center text-brand-600">
                                <Building className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">
                                    {property.name}
                                </h1>
                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5" />
                                    {property.address?.city}, {property.address?.state}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <p className="text-[10px] uppercase font-bold text-gray-400">Base Price</p>
                                <p className="text-lg font-black text-brand-600 dark:text-brand-400">SAR {property.price}</p>
                            </div>
                        </div>
                    </div>
                )}

                <ServicePropertyCalendarComp propertyId={id} />
            </div>
        </div>
    );
}
