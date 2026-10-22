import React, { useState } from "react";
import ComponentCard from "../common/ComponentCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Button from "../ui/button/Button";
import {
  Pencil,
  Trash2,
  Eye,
  Tag,
  Sparkles,
  Users,
  Globe,
  Copy,
  Check,
  Search,
  Filter,
  RotateCcw,
  Percent,
  Coins,
  Calendar,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { deleteCoupon } from "../../api/authApi";
import toast from "react-hot-toast";
import { formatCurrency } from "../../utils/currency";

export default function CouponListComp({
  coupons = [],
  loading = false,
  fetchCoupons,
  setEditCoupon,
  search = "",
  setSearch,
  couponType = "",
  setCouponType,
  userRestriction = "",
  setUserRestriction,
  status = "",
  setStatus,
  pagination = { page: 1, pageSize: 10, total: 0, totalPages: 1 },
  setPage,
  setPageSize,
  onViewDetails,
  onOpenRefundModal,
}) {
  const [copiedCode, setCopiedCode] = useState(null);

  const handleDelete = async (id, code) => {
    if (!window.confirm(`Are you sure you want to delete coupon "${code}"?`)) return;
    try {
      await deleteCoupon(id);
      toast.success(`Coupon ${code} deleted successfully`);
      if (fetchCoupons) fetchCoupons();
    } catch (error) {
      toast.error(error.message || "Failed to delete coupon");
    }
  };

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Copied "${code}"`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const hasActiveFilters = Boolean(search || couponType || userRestriction || status);

  const handleResetFilters = () => {
    if (setSearch) setSearch("");
    if (setCouponType) setCouponType("");
    if (setUserRestriction) setUserRestriction("");
    if (setStatus) setStatus("");
    if (setPage) setPage(1);
  };

  const now = new Date();

  return (
    <ComponentCard title="Active & Configured Coupons">
      {/* Top Filter and Search Bar */}
      <div className="space-y-3 mb-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by coupon code prefix or keyword..."
              className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white placeholder:text-gray-400 focus:outline-hidden focus:border-brand-500"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                if (setPage) setPage(1);
              }}
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  if (setPage) setPage(1);
                }}
                className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Override Refund & Reversal Trigger */}
          {onOpenRefundModal && (
            <Button
              size="sm"
              variant="outline"
              className="text-xs h-9 gap-1.5 border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400 shrink-0"
              onClick={onOpenRefundModal}
              title="Execute Admin Override Refund and reverse cashback"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Override Refund & Reversal
            </Button>
          )}
        </div>

        {/* Filter Pills / Selectors */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-gray-400 font-medium flex items-center gap-1 text-[11px] mr-1">
            <Filter className="w-3 h-3" /> Filters:
          </span>

          {/* Coupon Type Filter */}
          <select
            className="px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-gray-700 dark:text-gray-300 font-medium focus:outline-hidden"
            value={couponType}
            onChange={(e) => {
              setCouponType(e.target.value);
              if (setPage) setPage(1);
            }}
          >
            <option value="">All Types</option>
            <option value="DISCOUNT">🏷️ Discount Only</option>
            <option value="CASHBACK">✨ Cashback Only</option>
          </select>

          {/* Audience Restriction Filter */}
          <select
            className="px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-gray-700 dark:text-gray-300 font-medium focus:outline-hidden"
            value={userRestriction}
            onChange={(e) => {
              setUserRestriction(e.target.value);
              if (setPage) setPage(1);
            }}
          >
            <option value="">All Audiences</option>
            <option value="ALL">🌐 All Customers</option>
            <option value="SPECIFIC">👥 Specific Whitelist</option>
          </select>

          {/* Status Filter */}
          <select
            className="px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-gray-700 dark:text-gray-300 font-medium focus:outline-hidden"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              if (setPage) setPage(1);
            }}
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="EXPIRED">Expired</option>
            <option value="INACTIVE">Inactive</option>
          </select>

          {/* Reset Filters button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs text-brand-600 dark:text-brand-400 hover:underline px-1.5 py-1"
            >
              Reset Filters
            </button>
          )}

          <div className="ml-auto text-gray-400 text-[11px]">
            {loading ? "Searching..." : `${pagination.total || coupons.length} total coupons`}
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-visible rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/70 dark:bg-gray-800/40 text-[11px] uppercase font-bold text-gray-400">
                <TableCell isHeader className="px-4 py-3">Code</TableCell>
                <TableCell isHeader className="px-4 py-3">Type & Reward</TableCell>
                <TableCell isHeader className="px-4 py-3">Audience</TableCell>
                <TableCell isHeader className="px-4 py-3">Min Spend</TableCell>
                <TableCell isHeader className="px-4 py-3">Validity</TableCell>
                <TableCell isHeader className="px-4 py-3">Usage</TableCell>
                <TableCell isHeader className="px-4 py-3">Status</TableCell>
                <TableCell isHeader className="px-4 py-3 text-right">Actions</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-gray-400 text-xs">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading coupons...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : coupons.length > 0 ? (
                coupons.map((coupon) => {
                  const isCashback = coupon.couponType === "CASHBACK";
                  const isPercentage = coupon.discountType === "PERCENTAGE";
                  const isSpecific = coupon.userRestriction === "SPECIFIC";
                  const applicableCount = Array.isArray(coupon.applicableUsers)
                    ? coupon.applicableUsers.length
                    : 0;
                  const isExpired =
                    coupon.status === "EXPIRED" ||
                    (coupon.expiryDate && new Date(coupon.expiryDate) < now);

                  return (
                    <TableRow
                      key={coupon._id}
                      className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-colors"
                    >
                      {/* 1. Code */}
                      <TableCell className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-black text-sm uppercase text-gray-900 dark:text-white tracking-wider">
                            {coupon.code}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(coupon.code)}
                            className="p-1 rounded text-gray-400 hover:text-brand-600 transition-colors"
                            title="Copy Code"
                          >
                            {copiedCode === coupon.code ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        {coupon.firstTimeUserOnly && (
                          <span className="inline-block mt-0.5 text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                            First-time only
                          </span>
                        )}
                      </TableCell>

                      {/* 2. Type & Reward */}
                      <TableCell className="px-4 py-3.5">
                        <div className="space-y-1">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                              isCashback
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60"
                                : "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60"
                            }`}
                          >
                            {isCashback ? (
                              <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                            ) : (
                              <Tag className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                            )}
                            {coupon.couponType || "DISCOUNT"}
                          </span>

                          <div className="text-xs font-bold text-gray-900 dark:text-gray-100">
                            {isPercentage ? (
                              <span>
                                {coupon.discountValue}% Off
                                {coupon.maxDiscount ? (
                                  <span className="text-[10px] text-gray-400 font-normal ml-1">
                                    (Cap: {formatCurrency(coupon.maxDiscount)})
                                  </span>
                                ) : null}
                              </span>
                            ) : (
                              <span>{formatCurrency(coupon.discountValue)} Flat</span>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      {/* 3. Audience */}
                      <TableCell className="px-4 py-3.5">
                        {isSpecific ? (
                          <button
                            type="button"
                            onClick={() => onViewDetails && onViewDetails(coupon._id)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 hover:bg-purple-100 transition-colors border border-purple-200 dark:border-purple-800"
                            title="Click to view whitelisted users"
                          >
                            <Users className="w-3.5 h-3.5 text-purple-500" />
                            <span>Specific ({applicableCount})</span>
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 font-medium">
                            <Globe className="w-3.5 h-3.5 text-blue-500" />
                            All Customers
                          </span>
                        )}
                      </TableCell>

                      {/* 4. Min Spend */}
                      <TableCell className="px-4 py-3.5 text-xs font-semibold text-gray-800 dark:text-gray-200">
                        {coupon.minAmount && Number(coupon.minAmount) > 0 ? (
                          formatCurrency(coupon.minAmount)
                        ) : (
                          <span className="text-gray-400 font-normal">None (0 SAR)</span>
                        )}
                      </TableCell>

                      {/* 5. Validity */}
                      <TableCell className="px-4 py-3.5 text-xs">
                        <div className="flex flex-col whitespace-nowrap text-gray-600 dark:text-gray-400">
                          <span className="text-[11px]">
                            {coupon.startDate
                              ? new Date(coupon.startDate).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })
                              : "Now"}
                          </span>
                          <span className="text-gray-400 text-[10px]">until</span>
                          <span
                            className={`font-semibold ${
                              isExpired
                                ? "text-red-500 line-through"
                                : "text-gray-900 dark:text-white"
                            }`}
                          >
                            {coupon.expiryDate
                              ? new Date(coupon.expiryDate).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })
                              : "No expiry"}
                          </span>
                        </div>
                      </TableCell>

                      {/* 6. Usage / Limit */}
                      <TableCell className="px-4 py-3.5 text-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 font-semibold text-gray-800 dark:text-gray-200">
                            <span>{coupon.usedCount || 0}</span>
                            <span className="text-gray-400 font-normal">
                              / {coupon.usageLimit ? coupon.usageLimit : "∞"}
                            </span>
                          </div>
                          {coupon.usageLimit && Number(coupon.usageLimit) > 0 && (
                            <div className="w-16 h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                              <div
                                className="h-full bg-brand-500 rounded-full"
                                style={{
                                  width: `${Math.min(
                                    100,
                                    ((coupon.usedCount || 0) / coupon.usageLimit) * 100
                                  )}%`,
                                }}
                              ></div>
                            </div>
                          )}
                        </div>
                      </TableCell>

                      {/* 7. Status */}
                      <TableCell className="px-4 py-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                            isExpired
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                              : coupon.isActive
                              ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                              : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                          }`}
                        >
                          {isExpired ? "Expired" : coupon.isActive ? "Active" : "Inactive"}
                        </span>
                      </TableCell>

                      {/* 8. Actions */}
                      <TableCell className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => onViewDetails && onViewDetails(coupon._id)}
                            title="View Full Details & Whitelisted Users"
                            className="p-1.5 rounded-lg text-gray-500 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setEditCoupon(coupon)}
                            title="Edit Coupon"
                            className="p-1.5 rounded-lg text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(coupon._id, coupon.code)}
                            title="Delete Coupon"
                            className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-gray-400 text-xs">
                    <AlertCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    No coupons found matching current search or filter criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Bar */}
        {pagination.totalPages > 1 && (
          <div className="p-3 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
            <div>
              Showing page <strong className="text-gray-900 dark:text-white">{pagination.page}</strong> of{" "}
              <strong className="text-gray-900 dark:text-white">{pagination.totalPages}</strong> (
              {pagination.total} total items)
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={pagination.page <= 1 || loading}
                onClick={() => setPage && setPage(pagination.page - 1)}
                className="h-8 px-2.5 text-xs"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Previous
              </Button>

              <span className="font-mono text-xs px-2 text-gray-700 dark:text-gray-300">
                {pagination.page} / {pagination.totalPages}
              </span>

              <Button
                size="sm"
                variant="outline"
                disabled={pagination.page >= pagination.totalPages || loading}
                onClick={() => setPage && setPage(pagination.page + 1)}
                className="h-8 px-2.5 text-xs"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </ComponentCard>
  );
}
