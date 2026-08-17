import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ServiceCalendarComp from "../../components/ServiceManagement/ServiceCalendarComp";
import { getSingleServiceAdmin } from "../../api/authApi";
import { Wrench, MapPin } from "lucide-react";

export default function ServiceCalendarPage() {
    const { id } = useParams();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchService = async () => {
            try {
                const res = await getSingleServiceAdmin(id);
                setService(res.data);
            } catch (error) {
                console.error("Failed to fetch service details", error);
            } finally {
                setLoading(false);
            }
        };
        fetchService();
    }, [id]);

    return (
        <div className="w-full">
            <PageMeta title="Service Availability Calendar | Out Admin" />
            <PageBreadcrumb pageTitle="Service Calendar" />
            
            <div className="mt-6 space-y-6">
                {/* Service Brief Info */}
                {!loading && service && (
                    <div className="p-4 rounded-xl border border-gray-100 dark:border-white/5 bg-white dark:bg-white/[0.03] flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center text-brand-600">
                                <Wrench className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">
                                    {service.name}
                                </h1>
                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5" />
                                    {service.location?.city}, {service.location?.state}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <p className="text-[10px] uppercase font-bold text-gray-400">Base Price</p>
                                <p className="text-lg font-black text-brand-600 dark:text-brand-400">SAR {service.price}</p>
                            </div>
                        </div>
                    </div>
                )}

                <ServiceCalendarComp serviceId={id} />
            </div>
        </div>
    );
}
