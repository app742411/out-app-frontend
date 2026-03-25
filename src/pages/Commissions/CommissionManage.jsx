import React, { useState, useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import AddCommissionComp from "../../components/Commissions/AddCommissionComp";
import CommissionListComp from "../../components/Commissions/CommissionListComp";
import { getCommissions } from "../../api/authApi";
import toast from "react-hot-toast";

export default function CommissionManage() {
    const [commissions, setCommissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editCommission, setEditCommission] = useState(null);

    const fetchCommissions = async () => {
        try {
            setLoading(true);
            const res = await getCommissions();
            // Map the nested payload from example 
            if (res.data && Array.isArray(res.data)) {
                setCommissions(res.data);
            } else if (Array.isArray(res)) {
                setCommissions(res);
            } else {
                setCommissions([]);
            }
        } catch (error) {
            toast.error(error.message || "Failed to fetch commissions");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCommissions();
    }, []);

    return (
        <>
            <PageMeta title="Commission Management" />
            <PageBreadcrumb pageTitle="Commission Management" />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Left Side: Add/Edit Form */}
                <div className="xl:col-span-1">
                    <AddCommissionComp
                        fetchCommissions={fetchCommissions}
                        editCommission={editCommission}
                        setEditCommission={setEditCommission}
                    />
                </div>

                {/* Right Side: List/Data Table */}
                <div className="xl:col-span-2">
                    <CommissionListComp
                        commissions={commissions}
                        loading={loading}
                        fetchCommissions={fetchCommissions}
                        setEditCommission={setEditCommission}
                    />
                </div>
            </div>
        </>
    );
}
