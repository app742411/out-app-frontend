import React, { useState, useEffect } from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import { getCouponById } from "../../api/authApi";
import toast from "react-hot-toast";
import {
  Tag,
  Sparkles,
  Percent,
  Coins,
  Users,
  Globe,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Wallet,
  Pencil,
  Search,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { formatCurrency } from "../../utils/currency";

export default function CouponDetailsModal({
  isOpen,
  onClose,
  couponId,
  onEdit,
  onInspectWallet,
}) {
  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [userSearch, setUserSearch] = useState("");

  useEffect(() => {
    if (isOpen && couponId) {
      fetchDetails(couponId);
    } else {
      setCoupon(null);
      setUserSearch("");
    }
  }, [isOpen, couponId]);

  const fetchDetails = async (id) => {
    try {
      setLoading(true);
      const res = await getCouponById(id);
      const data = res?.data || res;
      setCoupon(data);
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Failed to load coupon details");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (!coupon?.code) return;
    navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    toast.success(`Copied code "${coupon.code}"`);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  const isCashback = coupon?.couponType === "CASHBACK";
  const isPercentage = coupon?.discountType === "PERCENTAGE";
  const isSpecific = coupon?.userRestriction === "SPECIFIC";
  const usersList = Array.isArray(coupon?.applicableUsers) ? coupon.applicableUsers : [];

  const filteredUsers = usersList.filter((u) => {
    if (!userSearch) return true;
    const q = userSearch.toLowerCase();
    const name = `${u.firstName || ""} ${u.lastName || ""}`.toLowerCase();
    const email = (u.email || "").toLowerCase();
    const phone = (u.phone || "").toLowerCase();
    const uid = (u.userId || u._id || "").toLowerCase();
    return name.includes(q) || email.includes(q) || phone.includes(q) || uid.includes(q);
  });

  const now = new Date();
  const isExpired = coupon?.expiryDate && new Date(coupon.expiryDate) < now;
  const isUpcoming = coupon?.startDate && new Date(coupon.startDate) > now;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl p-6 sm:p-7 max-h-[90vh] overflow-y-auto">
      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center text-gray-400">
          <div className="w-10 h-10 border-3 border-brand-500 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-sm font-medium">Loading coupon details...</p>
        </div>
      ) : coupon ? (
        <div className="space-y-6">
          {/* Header Card */}
          <div
            className={`p-5 rounded-2xl relative overflow-hidden border ${
              isCashback
                ? "bg-gradient-to-br from-amber-500/10 via-emerald-500/10 to-teal-500/10 border-emerald-500/30"
                : "bg-gradient-to-br from-brand-500/10 via-blue-500/10 to-indigo-500/10 border-brand-500/30"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 pr-8">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isCashback
                      ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30"
                      : "bg-brand-500 text-white shadow-md shadow-brand-500/30"
                  }`}
                >
                  {isCashback ? <Sparkles className="w-6 h-6" /> : <Tag className="w-6 h-6" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-black tracking-wider text-gray-900 dark:text-white uppercase font-mono">
                      {coupon.code}
                    </h2>
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="p-1 rounded-md text-gray-500 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-white/60 dark:hover:bg-gray-800 transition-colors"
                      title="Copy coupon code"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                    {isCashback
                      ? "Cashback Coupon • Credited to customer wallet after checkout"
                      : "Instant Discount Coupon • Applied directly to booking subtotal"}
                  </p>
                </div>
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                    isCashback
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300/40"
                      : "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-300/40"
                  }`}
                >
                  {coupon.couponType}
                </span>

                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    coupon.isActive && !isExpired
                      ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                      : isExpired
                      ? "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                  }`}
                >
                  {isExpired ? "Expired" : isUpcoming ? "Upcoming" : coupon.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                Benefit Rate
              </span>
              <p className="text-lg font-black text-gray-900 dark:text-white mt-1">
                {isPercentage ? `${coupon.discountValue}%` : formatCurrency(coupon.discountValue)}
              </p>
              <span className="text-[11px] text-gray-500 mt-0.5 block">
                {isPercentage
                  ? coupon.maxDiscount
                    ? `Capped at ${formatCurrency(coupon.maxDiscount)}`
                    : "No upper cap"
                  : "Fixed deduction"}
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                Min Booking Spend
              </span>
              <p className="text-lg font-black text-gray-900 dark:text-white mt-1">
                {formatCurrency(coupon.minAmount || 0)}
              </p>
              <span className="text-[11px] text-gray-500 mt-0.5 block">Required subtotal</span>
            </div>

            <div className="p-3.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                Audience Scope
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                {isSpecific ? (
                  <>
                    <Users className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                      Specific ({usersList.length})
                    </span>
                  </>
                ) : (
                  <>
                    <Globe className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                      All Customers
                    </span>
                  </>
                )}
              </div>
              <span className="text-[11px] text-gray-500 mt-0.5 block">
                {isSpecific ? "Whitelisted only" : "Open platform"}
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                Usage / Limit
              </span>
              <p className="text-lg font-black text-gray-900 dark:text-white mt-1">
                {coupon.usedCount || 0}{" "}
                <span className="text-xs font-normal text-gray-400">
                  / {coupon.usageLimit ? coupon.usageLimit : "∞"}
                </span>
              </p>
              <span className="text-[11px] text-gray-500 mt-0.5 block">
                {coupon.firstTimeUserOnly ? "1st-time bookings only" : "All repeat bookings"}
              </span>
            </div>
          </div>

          {/* Dates & Validity Section */}
          <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-500 shrink-0" />
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Valid From</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {coupon.startDate ? new Date(coupon.startDate).toLocaleString() : "Immediately"}
                </span>
              </div>
            </div>

            <div className="hidden sm:block text-gray-300 dark:text-gray-600">→</div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-red-500 shrink-0" />
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Expires At</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleString() : "Never"}
                </span>
              </div>
            </div>
          </div>

          {/* Whitelisted Users Section (If SPECIFIC) */}
          {isSpecific && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-purple-500" />
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                    Whitelisted Customers ({usersList.length})
                  </h3>
                </div>
                {usersList.length > 3 && (
                  <div className="relative w-48">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Filter users..."
                      className="w-full pl-8 pr-2 py-1 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                    />
                  </div>
                )}
              </div>

              {filteredUsers.length > 0 ? (
                <div className="max-h-56 overflow-y-auto rounded-xl border border-gray-200 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900">
                  {filteredUsers.map((user, idx) => {
                    const uid = user._id || user;
                    const fullName =
                      [user.firstName, user.lastName].filter(Boolean).join(" ") ||
                      user.name ||
                      `User ${idx + 1}`;
                    return (
                      <div
                        key={uid}
                        className="p-3 flex items-center justify-between gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {user.profile ? (
                            <img
                              src={user.profile}
                              alt={fullName}
                              className="w-8 h-8 rounded-full object-cover shrink-0 border border-gray-200 dark:border-gray-700"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 font-bold flex items-center justify-center text-xs shrink-0">
                              {fullName.charAt(0).toUpperCase()}
                            </div>
                          )}

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-900 dark:text-white truncate">
                                {fullName}
                              </span>
                              {user.userId && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                                  {user.userId}
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                              {user.phone && <span className="mr-2 font-mono">{user.phone}</span>}
                              {user.email && <span>{user.email}</span>}
                              {!user.phone && !user.email && (
                                <span className="font-mono text-gray-400">ID: {uid}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {onInspectWallet && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs h-7 px-2.5 gap-1 shrink-0"
                            onClick={() => {
                              onInspectWallet(uid, fullName);
                            }}
                          >
                            <Wallet className="w-3 h-3 text-emerald-500" />
                            Inspect Wallet
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-gray-400 border border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
                  {usersList.length === 0
                    ? "No specific users were attached to this coupon."
                    : "No users matched your filter criteria."}
                </div>
              )}
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-3">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>

            {onEdit && (
              <Button
                variant="primary"
                onClick={() => {
                  onClose();
                  onEdit(coupon);
                }}
                startIcon={<Pencil className="w-3.5 h-3.5" />}
              >
                Edit Coupon
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="py-12 text-center text-gray-400 text-sm">
          <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          Coupon not found
        </div>
      )}
    </Modal>
  );
}
