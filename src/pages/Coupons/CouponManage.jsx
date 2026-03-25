import React, { useState, useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import AddCouponComp from "../../components/Coupons/AddCouponComp";
import CouponListComp from "../../components/Coupons/CouponListComp";
import { getCoupons } from "../../api/authApi";
import toast from "react-hot-toast";

export default function CouponManage() {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editCoupon, setEditCoupon] = useState(null);
    const [search, setSearch] = useState("");

    const fetchCoupons = async () => {
        try {
            setLoading(true);
            const res = await getCoupons({ limit: 100, search });
            // The API endpoint should return an array or object containing the coupons array
            if (res.data && Array.isArray(res.data)) {
                setCoupons(res.data);
            } else if (res.data && res.data.coupons) {
                setCoupons(res.data.coupons);
            } else if (Array.isArray(res)) {
                setCoupons(res);
            } else {
                setCoupons([]);
            }
        } catch (error) {
            toast.error(error.message || "Failed to fetch coupons");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, [search]);

    return (
        <>
            <PageMeta title="Coupon Management" />
            <PageBreadcrumb pageTitle="Coupon Management" />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Left Side: Add/Edit Form */}
                <div className="xl:col-span-1">
                    <AddCouponComp
                        fetchCoupons={fetchCoupons}
                        editCoupon={editCoupon}
                        setEditCoupon={setEditCoupon}
                    />
                </div>

                <div className="xl:col-span-2">
                    <CouponListComp
                        coupons={coupons}
                        loading={loading}
                        fetchCoupons={fetchCoupons}
                        setEditCoupon={setEditCoupon}
                        search={search}
                        setSearch={setSearch}
                    />
                </div>
            </div>
        </>
    );
}
