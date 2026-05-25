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

    const fetchCommissions = async (page = 1, currentFilters = filters) => {
        try {
            setLoading(true);
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
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCommissions(1);
    }, []);

    return (
        <>
            <PageMeta title="Commission Management" />
            <PageBreadcrumb pageTitle="Commission Management" />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Left Side: Add/Edit Form */}
                <div className="xl:col-span-1">
                    <AddCommissionComp
                        fetchCommissions={() => fetchCommissions(pagination.page)}
                        editCommission={editCommission}
                        setEditCommission={setEditCommission}
                    />
                </div>

                {/* Right Side: List/Data Table */}
                <div className="xl:col-span-2">
                    <CommissionListComp
                        commissions={commissions}
                        loading={loading}
                        pagination={pagination}
                        filters={filters}
                        setFilters={setFilters}
                        fetchCommissions={fetchCommissions}
                        setEditCommission={setEditCommission}
                    />
                </div>
            </div>
        </>
    );
}
