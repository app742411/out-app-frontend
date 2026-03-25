import PageMeta from "../../components/common/PageMeta";
import React, { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import VendorPersonalDetailsComp from "../../components/Users/VendorPersonalDetailsComp";
import VendorServicesList from "../../components/Users/VendorServicesList";
import UserPropertiesList from "../../components/Users/UserPropertiesList";
import VendorMetricsCards from "../../components/Users/VendorMetricsCards";
import VendorPackagesList from "../../components/Users/VendorPackagesList";
import { useParams, useNavigate } from "react-router";
import { Home, LayoutGrid, ArrowLeft, UserCheck, Package } from "lucide-react";

export default function VendorDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("services");

    const tabs = [
        { id: "services", label: "Provided Services", icon: <LayoutGrid size={16} /> },
        { id: "properties", label: "Property Listings", icon: <Home size={16} /> },
        { id: "packages", label: "Packages", icon: <Package size={16} /> },
    ];

    return (
        <>
            <PageMeta title="Vendor Insights | Out Admin" />
            <PageBreadcrumb pageTitle="Vendor Report" />



            <div className="space-y-6 pb-8">
                {/* 1. TOP METRICS - Compact */}
                <VendorMetricsCards userId={id} />

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                    {/* 2. SIDEBAR: IDENTITY */}
                    <aside className="xl:col-span-4 space-y-6">
                        <VendorPersonalDetailsComp />
                    </aside>

                    {/* 3. MAIN: PORTFOLIO */}
                    <main className="xl:col-span-8 space-y-6">
                        {/* Compact Tab Navigation */}
                        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-1.5 shadow-sm flex gap-1.5">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold transition-all duration-300 ${activeTab === tab.id
                                        ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20"
                                        : "text-gray-400 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-white/5"
                                        }`}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Content Area */}
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                            {activeTab === "services" && <VendorServicesList userId={id} />}
                            {activeTab === "properties" && <UserPropertiesList userId={id} />}
                            {activeTab === "packages" && <VendorPackagesList userId={id} />}
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
