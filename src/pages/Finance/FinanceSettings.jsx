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
    // Platform Config States
    const [config, setConfig] = useState(null);
    const [configLoading, setConfigLoading] = useState(true);

    // Commission States
    const [commissions, setCommissions] = useState([]);
    const [commissionsLoading, setCommissionsLoading] = useState(true);
    const [editCommission, setEditCommission] = useState(null);

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

    const fetchCommissions = async () => {
        try {
            setCommissionsLoading(true);
            const res = await getCommissions();
            if (res.data && Array.isArray(res.data)) {
                setCommissions(res.data);
            } else if (Array.isArray(res)) {
                setCommissions(res);
            } else {
                setCommissions([]);
            }
        } catch (error) {
            toast.error(error.message || "Failed to fetch commissions");
        } finally {
            setCommissionsLoading(false);
        }
    };

    useEffect(() => {
        fetchConfig();
        fetchCommissions();
    }, []);

    return (
        <>
            <PageMeta title="Finance & Commission Settings - Out" />
            <PageBreadcrumb pageTitle="Finance & Commission" />

            <div className="space-y-8">
                {/* Platform Settings Section */}
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

                <hr className="border-gray-200 dark:border-gray-800" />

                {/* Commission Management Section */}
                <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white/90 mb-4 px-1">
                        Commission Management
                    </h2>
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        <div className="xl:col-span-1">
                            <AddCommissionComp
                                fetchCommissions={fetchCommissions}
                                editCommission={editCommission}
                                setEditCommission={setEditCommission}
                            />
                        </div>
                        <div className="xl:col-span-2">
                            <CommissionListComp
                                commissions={commissions}
                                loading={commissionsLoading}
                                fetchCommissions={fetchCommissions}
                                setEditCommission={setEditCommission}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FinanceSettings;
