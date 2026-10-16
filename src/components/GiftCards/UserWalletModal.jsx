import React, { useState, useEffect } from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import { getUserWallet } from "../../api/giftCardApi";
import { getAllUsers } from "../../api/authApi";
import toast from "react-hot-toast";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Gift,
  RefreshCw,
  Search,
  User,
  CheckCircle,
  XCircle,
  Clock,
  History,
} from "lucide-react";
import { formatCurrency } from "../../utils/currency";

export default function UserWalletModal({ isOpen, onClose, userId: initialUserId, userName: initialUserName }) {
  const [currentUserId, setCurrentUserId] = useState(initialUserId || "");
  const [walletData, setWalletData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchUserId, setSearchUserId] = useState(initialUserId || "");

  // Quick user search helper
  const [userQuery, setUserQuery] = useState("");
  const [foundUsers, setFoundUsers] = useState([]);
  const [searchingUsers, setSearchingUsers] = useState(false);

  useEffect(() => {
    if (initialUserId) {
      setCurrentUserId(initialUserId);
      setSearchUserId(initialUserId);
      fetchWallet(initialUserId);
    } else {
      setWalletData(null);
      setCurrentUserId("");
      setSearchUserId("");
    }
  }, [initialUserId, isOpen]);

  const fetchWallet = async (uid) => {
    if (!uid || !uid.trim()) {
      toast.error("Please provide a valid User ID");
      return;
    }
    try {
      setLoading(true);
      const res = await getUserWallet(uid.trim());
      // Handle response structure
      const data = res?.data || res;
      setWalletData(data);
      setCurrentUserId(uid.trim());
    } catch (error) {
      const msg = error?.message || error?.error || "Failed to load user wallet";
      toast.error(msg);
      setWalletData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchWallet(searchUserId);
  };

  const handleSearchUsers = async (q) => {
    setUserQuery(q);
    if (!q || q.length < 2) {
      setFoundUsers([]);
      return;
    }
    try {
      setSearchingUsers(true);
      const res = await getAllUsers({ page: 1, limit: 10, search: q });
      if (res && res.data) setFoundUsers(res.data);
      else if (Array.isArray(res)) setFoundUsers(res);
    } catch {
      // silent catch
    } finally {
      setSearchingUsers(false);
    }
  };

  const selectUser = (u) => {
    setSearchUserId(u._id);
    setCurrentUserId(u._id);
    fetchWallet(u._id);
    setFoundUsers([]);
    setUserQuery("");
  };

  // Wallet extraction:
  // Can be in walletData.wallet or walletData directly
  const wallet = walletData?.wallet || walletData || {};
  const balance = Number(wallet.balance ?? walletData?.balance ?? 0);
  const currency = wallet.currency || walletData?.currency || "SAR";
  const isActive = wallet.isActive !== false && walletData?.isActive !== false;
  const transactions = walletData?.transactions || wallet.transactions || [];
  const associatedGiftCards = walletData?.giftCards || walletData?.associatedGiftCards || [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800 mb-6 pr-14 sm:pr-16">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center text-brand-600 dark:text-brand-400">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">User Wallet & Ledger</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Inspect user credits, gift card balances, and transaction history
            </p>
          </div>
        </div>

        {currentUserId && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => fetchWallet(currentUserId)}
            disabled={loading}
            startIcon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />}
          >
            Refresh
          </Button>
        )}
      </div>

      {/* User Search / Change User Bar */}
      <div className="mb-6 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800 space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Enter User MongoDB ID (e.g. 68f123456789abcdef123456)"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-800 dark:text-white placeholder:text-gray-400 focus:outline-hidden focus:border-brand-500"
              value={searchUserId}
              onChange={(e) => setSearchUserId(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={loading || !searchUserId.trim()}>
            {loading ? "Searching..." : "Lookup"}
          </Button>
        </form>

        {/* Or find user by name/email */}
        <div className="relative">
          <input
            type="text"
            placeholder="Or search customer by name/email/phone..."
            className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900 text-gray-700 dark:text-gray-300 placeholder:text-gray-400 focus:outline-hidden"
            value={userQuery}
            onChange={(e) => handleSearchUsers(e.target.value)}
          />
          {foundUsers.length > 0 && (
            <div className="absolute z-20 left-0 right-0 mt-1 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg max-h-40 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
              {foundUsers.map((u) => {
                const name = [u.firstName, u.lastName].filter(Boolean).join(" ") || u.name || "Customer";
                return (
                  <div
                    key={u._id}
                    onClick={() => selectUser(u)}
                    className="p-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-semibold text-gray-800 dark:text-white">{name}</span>
                      <span className="text-gray-400 ml-2">{u.email || u.phone}</span>
                    </div>
                    <span className="text-[10px] text-brand-500 font-mono">View Wallet</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center text-gray-400">
          <RefreshCw className="w-8 h-8 animate-spin text-brand-500 mb-2" />
          <p className="text-sm">Fetching wallet details...</p>
        </div>
      ) : walletData ? (
        <div className="space-y-6">
          {/* Wallet Balance Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-lg relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none"></div>

            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-wider text-emerald-100 font-medium flex items-center gap-1.5">
                <Wallet className="w-4 h-4" />
                Current Wallet Balance
              </span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1 ${
                  isActive ? "bg-emerald-400/20 text-white" : "bg-red-400/20 text-red-100"
                }`}
              >
                {isActive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                {isActive ? "Active Wallet" : "Inactive"}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold">{balance.toLocaleString()}</span>
              <span className="text-lg font-bold text-emerald-100">{currency}</span>
            </div>

            <div className="mt-4 pt-3 border-t border-emerald-500/40 text-xs text-emerald-100 flex items-center justify-between flex-wrap gap-2">
              <span className="font-mono text-[11px] truncate max-w-xs">User ID: {currentUserId}</span>
              <span>Updated in Realtime</span>
            </div>
          </div>

          {/* Associated Gift Cards (if any) */}
          {associatedGiftCards && associatedGiftCards.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <Gift className="w-4 h-4 text-brand-500" />
                Associated Gift Cards
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {associatedGiftCards.map((gc, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-between shadow-2xs"
                  >
                    <div>
                      <p className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400">
                        {gc.code || "GIFT CARD"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {gc.title || "Voucher"}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-gray-800 dark:text-white">
                      {formatCurrency(gc.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Transactions List */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <History className="w-4 h-4 text-purple-500" />
              Recent Transactions ({transactions.length})
            </h3>

            {transactions.length > 0 ? (
              <div className="border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900">
                {transactions.map((tx, idx) => {
                  const isCredit =
                    tx.type === "CREDIT" ||
                    tx.type === "GIFT_CARD_REDEMPTION" ||
                    tx.type === "REFUND" ||
                    Number(tx.amount) > 0;
                  return (
                    <div
                      key={tx._id || idx}
                      className="p-3.5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                            isCredit
                              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                              : "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400"
                          }`}
                        >
                          {isCredit ? (
                            <ArrowDownLeft className="w-4 h-4" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-800 dark:text-white">
                            {tx.description || tx.type || "Transaction"}
                          </p>
                          <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            {tx.createdAt ? new Date(tx.createdAt).toLocaleString() : "Recent"}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span
                          className={`text-sm font-bold ${
                            isCredit ? "text-emerald-600 dark:text-emerald-400" : "text-gray-800 dark:text-white"
                          }`}
                        >
                          {isCredit ? "+" : "-"}
                          {formatCurrency(Math.abs(tx.amount || 0))}
                        </span>
                        {tx.balanceAfter !== undefined && (
                          <p className="text-[10px] text-gray-400">
                            Bal: {formatCurrency(tx.balanceAfter)}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 text-gray-400 text-xs">
                No recent transactions recorded in this user wallet.
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="py-12 text-center text-gray-400">
          <Wallet className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium">No user selected</p>
          <p className="text-xs text-gray-500 mt-1">
            Search or enter a User ID above to inspect their wallet and ledger
          </p>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    </Modal>
  );
}
