import React, { useState, useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import AddBannerComp from "../../components/AppManage/AddBannerComp";
import BannerListComp from "../../components/AppManage/BannerListComp";
import { getBanners } from "../../api/authApi";
import toast from "react-hot-toast";

export default function AppManage() {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editBanner, setEditBanner] = useState(null);
    const [search, setSearch] = useState("");

    const fetchBanners = async () => {
        try {
            setLoading(true);
            const res = await getBanners();
            if (res.data && Array.isArray(res.data)) {
                setBanners(res.data);
            } else if (res.data && res.data.banners) {
                setBanners(res.data.banners);
            } else if (Array.isArray(res)) {
                setBanners(res);
            } else {
                setBanners([]);
            }
        } catch (error) {
            toast.error(error.message || "Failed to fetch banners");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    const filteredBanners = Array.isArray(banners) ? banners.filter((banner) =>
        banner.title?.toLowerCase().includes(search.toLowerCase()) ||
        banner.bannerType?.toLowerCase().includes(search.toLowerCase())
    ) : [];

    return (
        <>
            <PageMeta title="App Management" />
            <PageBreadcrumb pageTitle="App Management" />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-1">
                    <AddBannerComp
                        fetchBanners={fetchBanners}
                        editBanner={editBanner}
                        setEditBanner={setEditBanner}
                    />
                </div>

                <div className="xl:col-span-2">
                    <BannerListComp
                        banners={filteredBanners}
                        loading={loading}
                        fetchBanners={fetchBanners}
                        setEditBanner={setEditBanner}
                        search={search}
                        setSearch={setSearch}
                    />
                </div>
            </div>
        </>
    );
}
