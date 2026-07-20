import React, { useState, useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PlatformFeeConfig from "../../components/Finance/PlatformFeeConfig";
import TaxConfig from "../../components/Finance/TaxConfig";
import AddCommissionComp from "../../components/Commissions/AddCommissionComp";
import CommissionListComp from "../../components/Commissions/CommissionListComp";
import { getPlatformConfig, getCommissions } from "../../api/authApi";
import toast from "react-hot-toast";

const FinanceSettings = () => {
    const [activeTab, setActiveTab] = useState("commission");

    // Platform Config States
    const [config, setConfig] = useState(null);
    const [configLoading, setConfigLoading] = useState(true);

    // Commission States
    const [commissions, setCommissions] = useState([]);
    const [commissionsLoading, setCommissionsLoading] = useState(true);
    const [editCommission, setEditCommission] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: 1,
        previousDisabled: true,
        nextDisabled: true,
        total: 0,
        limit: 10
    });
    const [filters, setFilters] = useState({
        scope: "",
        type: "",
        isActive: ""
    });

    const fetchConfig = async () => {
        try {
            setConfigLoading(true);
            const res = await getPlatformConfig();
            setConfig(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setConfigLoading(false);
        }
    };

    const fetchCommissions = async (page = 1, currentFilters = filters) => {
        try {
            setCommissionsLoading(true);
            const params = {
                page,
                limit: 10
            };
            if (currentFilters.scope) params.scope = currentFilters.scope;
            if (currentFilters.type) params.type = currentFilters.type;
            if (currentFilters.isActive !== "") {
                params.isActive = currentFilters.isActive === "true";
            }

            const res = await getCommissions(params);

            if (res.data && Array.isArray(res.data)) {
                setCommissions(res.data);
            } else if (Array.isArray(res)) {
                setCommissions(res);
            } else {
                setCommissions([]);
            }

            setPagination({
                page: res.page || page,
                limit: res.limit || 10,
                total: res.total || 0,
                totalPages: res.totalPages || 1,
                previousDisabled: res.previousDisabled ?? true,
                nextDisabled: res.nextDisabled ?? true
            });
        } catch (error) {
            toast.error(error.message || "Failed to fetch commissions");
        } finally {
            setCommissionsLoading(false);
        }
    };

    useEffect(() => {
        fetchConfig();
        fetchCommissions(1);
    }, []);

    return (
        <>
            <PageMeta title="Finance & Commission Settings - Out" />
            <PageBreadcrumb pageTitle="Finance & Commission" />

            <div className="space-y-6">
                {/* Modern Segmented Tab Switcher */}
                <div className="flex bg-gray-100/80 dark:bg-gray-800/85 p-0.5 rounded-xl border border-gray-200/30 self-start w-fit">
                    <button
                        onClick={() => setActiveTab("commission")}
                        className={`px-5 py-2 text-xs font-bold rounded-lg transition-all duration-150 cursor-pointer ${
                            activeTab === "commission" 
                                ? "bg-white dark:bg-gray-700 shadow-xs text-brand-600 dark:text-white" 
                                : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        }`}
                    >
                        Commission Management
                    </button>
                    <button
                        onClick={() => setActiveTab("platform")}
                        className={`px-5 py-2 text-xs font-bold rounded-lg transition-all duration-150 cursor-pointer ${
                            activeTab === "platform" 
                                ? "bg-white dark:bg-gray-700 shadow-xs text-brand-600 dark:text-white" 
                                : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        }`}
                    >
                        Platform Settings
                    </button>
                </div>

                {/* Tab content area */}
                <div className="transition-all duration-200">
                    {activeTab === "platform" && (
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white/90 mb-4 px-1">
                                Platform Settings
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <PlatformFeeConfig
                                    initialData={config?.platformFee}
                                    onUpdate={fetchConfig}
                                />
                                <TaxConfig
                                    initialData={config?.tax}
                                    onUpdate={fetchConfig}
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === "commission" && (
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white/90 mb-4 px-1">
                                Commission Management
                            </h2>
                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                                <div className="xl:col-span-1">
                                    <AddCommissionComp
                                        fetchCommissions={() => fetchCommissions(pagination.page)}
                                        editCommission={editCommission}
                                        setEditCommission={setEditCommission}
                                    />
                                </div>
                                <div className="xl:col-span-2">
                                    <CommissionListComp
                                        commissions={commissions}
                                        loading={commissionsLoading}
                                        pagination={pagination}
                                        filters={filters}
                                        setFilters={setFilters}
                                        fetchCommissions={fetchCommissions}
                                        setEditCommission={setEditCommission}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default FinanceSettings;
