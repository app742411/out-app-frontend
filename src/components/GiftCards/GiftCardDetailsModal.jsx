import React, { useState, useEffect } from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import { getGiftCardById } from "../../api/giftCardApi";
import toast from "react-hot-toast";
import {
  Gift,
  Copy,
  Check,
  Calendar,
  Users,
  User,
  Clock,
  ShieldCheck,
  Wallet,
  Sparkles,
  RefreshCw,
  Eye,
  Pencil,
} from "lucide-react";
import { formatCurrency } from "../../utils/currency";

export default function GiftCardDetailsModal({
  isOpen,
  onClose,
  cardId,
  onEdit,
  onOpenWallet,
}) {
  const [loading, setLoading] = useState(false);
  const [card, setCard] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && cardId) {
      fetchDetails();
    } else {
      setCard(null);
    }
  }, [isOpen, cardId]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const res = await getGiftCardById(cardId);
      const data = res?.data || res?.giftCard || res;
      setCard(data);
    } catch (error) {
      const msg = error?.message || error?.error || "Failed to load gift card details";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = (code) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Gift Card Code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  const usedByList = card?.usedBy || [];
  const timesUsed = card?.timesUsed || usedByList.length || 0;
  const usageLimit = card?.usageLimit;
  const isUnlimited = usageLimit === null || usageLimit === undefined;
  const isExpired = card?.expiryDate && new Date(card.expiryDate) < new Date();

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center text-gray-400">
          <RefreshCw className="w-8 h-8 animate-spin text-brand-500 mb-2" />
          <p className="text-sm">Loading gift card details...</p>
        </div>
      ) : card ? (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800 pr-14 sm:pr-16">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center text-brand-600 dark:text-brand-400">
                <Gift className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {card.title || "Gift Card Details"}
                  </h2>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      card.isActive && !isExpired
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
                        : isExpired
                        ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                    }`}
                  >
                    {isExpired ? "Expired" : card.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  ID: <span className="font-mono">{card._id}</span>
                </p>
              </div>
            </div>

            {onEdit && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(card)}
                startIcon={<Pencil className="w-3.5 h-3.5 text-gray-500" />}
              >
                Edit
              </Button>
            )}
          </div>

          {/* Premium Voucher Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-gray-900 via-indigo-950 to-brand-900 text-white relative overflow-hidden shadow-lg border border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="text-[10px] tracking-widest uppercase text-brand-300 font-bold block mb-1">
                  OFFICIAL OUT VOUCHER
                </span>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-2xl sm:text-3xl font-extrabold tracking-wider bg-white/10 px-3 py-1 rounded-xl">
                    {card.code}
                  </span>
                  <button
                    onClick={() => handleCopyCode(card.code)}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white"
                    title="Copy code"
                  >
                    {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
                {card.description && (
                  <p className="text-xs text-gray-300 mt-2 max-w-md">{card.description}</p>
                )}
              </div>

              <div className="sm:text-right">
                <span className="text-xs text-gray-300 block uppercase tracking-wider">Face Value</span>
                <div className="text-3xl font-black text-white mt-0.5">
                  {formatCurrency(card.amount)}
                </div>
                <span className="text-[11px] text-brand-300">
                  Target: {card.targetType === "SPECIFIC_USER" ? "Specific User" : "All Users"}
                </span>
              </div>
            </div>
          </div>

          {/* Key Metric Blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
              <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Audience Scope</span>
              <div className="flex items-center gap-2 text-sm font-bold text-gray-800 dark:text-white">
                {card.targetType === "SPECIFIC_USER" ? (
                  <>
                    <User className="w-4 h-4 text-purple-500" />
                    Specific User
                  </>
                ) : (
                  <>
                    <Users className="w-4 h-4 text-brand-500" />
                    All Users (Public)
                  </>
                )}
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
              <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Usage / Limit</span>
              <div className="text-sm font-bold text-gray-800 dark:text-white">
                {timesUsed} / {isUnlimited ? "Unlimited" : usageLimit} used
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 mt-2 overflow-hidden">
                <div
                  className="bg-brand-500 h-1.5 rounded-full"
                  style={{
                    width: isUnlimited ? "100%" : `${Math.min(100, (timesUsed / (usageLimit || 1)) * 100)}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
              <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Validity Period</span>
              <div className="text-xs text-gray-700 dark:text-gray-300 space-y-0.5">
                <div>
                  <span className="text-gray-400">Start:</span>{" "}
                  {card.startDate ? new Date(card.startDate).toLocaleDateString() : "Immediate"}
                </div>
                <div>
                  <span className="text-gray-400">Expires:</span>{" "}
                  {card.expiryDate ? new Date(card.expiryDate).toLocaleDateString() : "No Expiry"}
                </div>
              </div>
            </div>
          </div>

          {/* Applicable User Card (if specific user) */}
          {card.targetType === "SPECIFIC_USER" && card.applicableUser && (
            <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-300 flex items-center justify-center font-bold text-sm">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-purple-600 dark:text-purple-400 font-bold">
                    Designated Recipient
                  </p>
                  <p className="text-sm font-bold text-gray-800 dark:text-white">
                    {card.applicableUser && typeof card.applicableUser === "object"
                      ? [card.applicableUser.firstName, card.applicableUser.lastName].filter(Boolean).join(" ") ||
                        card.applicableUser.name ||
                        card.applicableUser.email ||
                        card.applicableUser.phone ||
                        "Assigned Customer"
                      : card.applicableUser || "Specific User"}
                  </p>
                  {card.applicableUser && typeof card.applicableUser === "object" && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                      {card.applicableUser.email || card.applicableUser.phone || card.applicableUser._id}
                    </p>
                  )}
                </div>
              </div>

              {onOpenWallet && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    onOpenWallet(
                      card.applicableUser && typeof card.applicableUser === "object"
                        ? card.applicableUser._id
                        : card.applicableUser
                    )
                  }
                  startIcon={<Wallet className="w-4 h-4 text-emerald-600" />}
                >
                  Inspect User Wallet
                </Button>
              )}
            </div>
          )}

          {/* Redemption / Used By History */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-brand-500" />
              Redemption History ({usedByList.length})
            </h3>

            {usedByList.length > 0 ? (
              <div className="border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900">
                {usedByList.map((redemption, idx) => {
                  const userObj = redemption.user || redemption;
                  const isUserObj = Boolean(userObj && typeof userObj === "object");
                  const userName = isUserObj
                    ? [userObj.firstName, userObj.lastName].filter(Boolean).join(" ") ||
                      userObj.name ||
                      userObj.phone ||
                      userObj.email ||
                      "Customer"
                    : "Customer";

                  const userId = isUserObj ? userObj._id : userObj;

                  return (
                    <div
                      key={idx}
                      className="p-3.5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-xs">
                          {userName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-800 dark:text-white">
                            {userName}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            {redemption.usedAt
                              ? new Date(redemption.usedAt).toLocaleString()
                              : "Redeemed"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {onOpenWallet && userId && (
                          <button
                            onClick={() => onOpenWallet(userId)}
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-xs flex items-center gap-1 font-medium"
                            title="View Wallet"
                          >
                            <Wallet className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Wallet</span>
                          </button>
                        )}
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          {formatCurrency(redemption.amount || card.amount)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 text-gray-400 text-xs">
                No users have redeemed this gift card yet.
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      ) : (
        <div className="py-12 text-center text-gray-400 text-sm">Gift Card details not found.</div>
      )}
    </Modal>
  );
}
