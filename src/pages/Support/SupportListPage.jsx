import React, { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import SupportListComp from "../../components/Support/SupportListComp";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

export default function SupportListPage() {
    const [activeTab, setActiveTab] = useState("USER_SUPPORT");

    return (
        <>
            <PageMeta title="Support Management" />
            <PageBreadcrumb pageTitle="Support Management" />
            <div className="w-full">
                {/* <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Support Operations</h1> */}

                {/* Tab Navigation */}
                <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-800 mb-6">
                    <button
                        onClick={() => setActiveTab("USER_SUPPORT")}
                        className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${activeTab === "USER_SUPPORT"
                            ? "border-brand text-brand"
                            : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            }`}
                    >
                        User Support
                    </button>
                    <button
                        onClick={() => setActiveTab("SERVICE_SUPPORT")}
                        className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${activeTab === "SERVICE_SUPPORT"
                            ? "border-brand text-brand"
                            : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            }`}
                    >
                        Service Provider Support
                    </button>
                </div>

                {/* Tab Content */}
                <div>
                    {activeTab === "USER_SUPPORT" && (
                        <SupportListComp chatType="USER_SUPPORT" />
                    )}
                    {activeTab === "SERVICE_SUPPORT" && (
                        <SupportListComp chatType="SERVICE_SUPPORT" />
                    )}
                </div>
            </div>
        </>
    );
}
