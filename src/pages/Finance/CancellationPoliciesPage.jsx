import React, { useState, useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import CancellationPolicyForm from "../../components/Finance/CancellationPolicyForm";
import { getCancellationPolicies, upsertCancellationPolicies } from "../../api/authApi";
import toast from "react-hot-toast";

const CancellationPoliciesPage = () => {
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const fetchPolicies = async () => {
        try {
            setLoading(true);
            const res = await getCancellationPolicies();
            if (res.data && Array.isArray(res.data)) {
                setPolicies(res.data);
            } else if (res.policies && Array.isArray(res.policies)) {
                setPolicies(res.policies);
            } else if (Array.isArray(res)) {
                setPolicies(res);
            } else {
                setPolicies([]);
            }
        } catch (error) {
            console.error(error);
            // toast.error("Failed to fetch cancellation policies");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPolicies();
    }, []);

    const handleSave = async (updatedPolicies) => {
        try {
            setSaving(true);
            await upsertCancellationPolicies({ policies: updatedPolicies });
            toast.success("Cancellation policies updated successfully");
            fetchPolicies();
        } catch (error) {
            toast.error(error.message || "Failed to update policies");
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <PageMeta title="Cancellation Policies - Out" />
            <PageBreadcrumb pageTitle="Cancellation Policies" />

            <div className="space-y-8">
                <CancellationPolicyForm 
                    initialPolicies={policies} 
                    onSave={handleSave} 
                    loading={loading}
                    saving={saving}
                />
            </div>
        </>
    );
};

export default CancellationPoliciesPage;
