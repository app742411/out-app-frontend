import React, { useState, useEffect, useCallback } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import AddCouponComp from "../../components/Coupons/AddCouponComp";
import CouponListComp from "../../components/Coupons/CouponListComp";
import CouponDetailsModal from "../../components/Coupons/CouponDetailsModal";
import AdminRefundModal from "../../components/Coupons/AdminRefundModal";
import UserWalletModal from "../../components/GiftCards/UserWalletModal";
import { getCoupons } from "../../api/authApi";
import toast from "react-hot-toast";
import useDebounce from "../../hooks/useDebounce";

export default function CouponManage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editCoupon, setEditCoupon] = useState(null);

  // Filters & Search
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);
  const [couponType, setCouponType] = useState("");
  const [userRestriction, setUserRestriction] = useState("");
  const [status, setStatus] = useState("");

  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 1,
  });

  // Modals state
  const [viewCouponId, setViewCouponId] = useState(null);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [walletModalState, setWalletModalState] = useState({
    isOpen: false,
    userId: "",
    userName: "",
  });

  const fetchCoupons = useCallback(
    async (
      searchVal = debouncedSearch,
      cType = couponType,
      uRest = userRestriction,
      st = status,
      currentPage = pagination.page,
      currentPageSize = pagination.pageSize
    ) => {
      try {
        setLoading(true);
        const res = await getCoupons({
          page: currentPage,
          pageSize: currentPageSize,
          limit: currentPageSize,
          search: searchVal,
          couponType: cType,
          userRestriction: uRest,
          status: st,
        });

        // Handle various backend response wrappers
        const list = res?.data?.coupons || res?.data || (Array.isArray(res) ? res : []);
        setCoupons(Array.isArray(list) ? list : []);

        if (res?.pagination) {
          setPagination({
            page: res.pagination.page || currentPage,
            pageSize: res.pagination.pageSize || currentPageSize,
            total: res.pagination.total !== undefined ? res.pagination.total : list.length,
            totalPages: res.pagination.totalPages || Math.ceil((res.pagination.total || list.length) / currentPageSize) || 1,
          });
        } else {
          setPagination((prev) => ({
            ...prev,
            total: list.length,
            totalPages: Math.ceil(list.length / prev.pageSize) || 1,
          }));
        }
      } catch (error) {
        console.error("Failed to fetch coupons:", error);
        toast.error(error?.message || "Failed to fetch coupons");
        setCoupons([]);
      } finally {
        setLoading(false);
      }
    },
    [debouncedSearch, couponType, userRestriction, status, pagination.page, pagination.pageSize]
  );

  useEffect(() => {
    fetchCoupons(debouncedSearch, couponType, userRestriction, status, pagination.page, pagination.pageSize);
  }, [debouncedSearch, couponType, userRestriction, status, pagination.page, pagination.pageSize]);

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleOpenWalletModal = (userId, userName) => {
    setWalletModalState({
      isOpen: true,
      userId: userId || "",
      userName: userName || "",
    });
  };

  return (
    <>
      <PageMeta title="Coupon Management | Out Admin" />
      <PageBreadcrumb pageTitle="Coupon Management" />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Form: Add / Edit Coupon */}
        <div className="xl:col-span-5 2xl:col-span-4">
          <AddCouponComp
            fetchCoupons={fetchCoupons}
            editCoupon={editCoupon}
            setEditCoupon={setEditCoupon}
          />
        </div>

        {/* Right Table: Filterable List */}
        <div className="xl:col-span-7 2xl:col-span-8">
          <CouponListComp
            coupons={coupons}
            loading={loading}
            fetchCoupons={fetchCoupons}
            setEditCoupon={(c) => {
              setEditCoupon(c);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            search={search}
            setSearch={setSearch}
            couponType={couponType}
            setCouponType={setCouponType}
            userRestriction={userRestriction}
            setUserRestriction={setUserRestriction}
            status={status}
            setStatus={setStatus}
            pagination={pagination}
            setPage={handlePageChange}
            onViewDetails={(id) => setViewCouponId(id)}
            onOpenRefundModal={() => setIsRefundModalOpen(true)}
          />
        </div>
      </div>

      {/* Coupon Full Details Modal */}
      <CouponDetailsModal
        isOpen={Boolean(viewCouponId)}
        onClose={() => setViewCouponId(null)}
        couponId={viewCouponId}
        onEdit={(coupon) => {
          setViewCouponId(null);
          setEditCoupon(coupon);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onInspectWallet={handleOpenWalletModal}
      />

      {/* Admin Override Refund & Reversal Modal */}
      <AdminRefundModal
        isOpen={isRefundModalOpen}
        onClose={() => setIsRefundModalOpen(false)}
        onSuccess={() => fetchCoupons()}
      />

      {/* User Wallet & Ledger Inspector Modal */}
      <UserWalletModal
        isOpen={walletModalState.isOpen}
        onClose={() => setWalletModalState({ isOpen: false, userId: "", userName: "" })}
        userId={walletModalState.userId}
        userName={walletModalState.userName}
      />
    </>
  );
}
