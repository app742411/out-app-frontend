import React, { useState, useEffect } from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { createGiftCard } from "../../api/giftCardApi";
import { getAllUsers } from "../../api/authApi";
import toast from "react-hot-toast";
import { Gift, Sparkles, User, Users, Calendar, ShieldCheck, Check, Search, X, Mail, Phone } from "lucide-react";
import { formatCurrency } from "../../utils/currency";

export default function CreateGiftCardModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    codeLength: 12,
    amount: "",
    title: "",
    description: "",
    currency: "SAR",
    targetType: "ALL",
    applicableUser: "",
    selectedUserName: "",
    selectedUserEmail: "",
    selectedUserPhone: "",
    usageLimit: 1,
    isUnlimitedUsage: false,
    startDate: "",
    expiryDate: "",
    isActive: true,
  });

  // Fetch users when modal opens or when targetType is SPECIFIC_USER
  useEffect(() => {
    if (isOpen && formData.targetType === "SPECIFIC_USER") {
      fetchUsers();
    }
  }, [isOpen, formData.targetType]);

  const fetchUsers = async (search = "") => {
    try {
      setLoadingUsers(true);
      const res = await getAllUsers({ page: 1, limit: 100, search });
      if (res && res.data) {
        setUsers(res.data);
      } else if (Array.isArray(res)) {
        setUsers(res);
      }
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleUserSearch = (e) => {
    const val = e.target.value;
    setUserSearch(val);
    fetchUsers(val);
  };

  const handleSelectUser = (u) => {
    const name = [u.firstName, u.lastName].filter(Boolean).join(" ") || u.name || "Customer";
    setFormData((prev) => ({
      ...prev,
      applicableUser: u._id,
      selectedUserName: name,
      selectedUserEmail: u.email || "",
      selectedUserPhone: u.phone || "",
    }));
  };

  // Client-side multi-field filter by name, phone no, and email
  const filteredUsers = users.filter((u) => {
    if (!userSearch.trim()) return true;
    const q = userSearch.toLowerCase().trim();
    const fullName = [u.firstName, u.lastName].filter(Boolean).join(" ").toLowerCase();
    const altName = (u.name || "").toLowerCase();
    const email = (u.email || "").toLowerCase();
    const phone = (u.phone || "").toLowerCase();
    return fullName.includes(q) || altName.includes(q) || email.includes(q) || phone.includes(q);
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const amt = parseFloat(formData.amount);
    if (!amt || isNaN(amt) || amt <= 0) {
      toast.error("Please enter a valid gift card amount greater than 0");
      return;
    }

    if (formData.targetType === "SPECIFIC_USER" && !formData.applicableUser.trim()) {
      toast.error("Please select an applicable user for this gift card");
      return;
    }

    const payload = {
      amount: amt,
      currency: formData.currency || "SAR",
      targetType: formData.targetType,
      isActive: Boolean(formData.isActive),
    };

    if (formData.codeLength) {
      const len = parseInt(formData.codeLength, 10);
      if (len >= 8 && len <= 16) {
        payload.codeLength = len;
      }
    }

    if (formData.title.trim()) payload.title = formData.title.trim();
    if (formData.description.trim()) payload.description = formData.description.trim();

    if (formData.targetType === "SPECIFIC_USER") {
      payload.applicableUser = formData.applicableUser.trim();
    }

    if (!formData.isUnlimitedUsage && formData.usageLimit) {
      payload.usageLimit = parseInt(formData.usageLimit, 10);
    }

    if (formData.startDate) {
      payload.startDate = new Date(formData.startDate).toISOString();
    }
    if (formData.expiryDate) {
      payload.expiryDate = new Date(formData.expiryDate).toISOString();
    }

    try {
      setLoading(true);
      await createGiftCard(payload);
      toast.success("Gift Card created successfully!");
      onSuccess?.();
      handleClose();
    } catch (error) {
      const msg = error?.message || error?.error || "Failed to create gift card";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      codeLength: 12,
      amount: "",
      title: "",
      description: "",
      currency: "SAR",
      targetType: "ALL",
      applicableUser: "",
      selectedUserName: "",
      selectedUserEmail: "",
      selectedUserPhone: "",
      usageLimit: 1,
      isUnlimitedUsage: false,
      startDate: "",
      expiryDate: "",
      isActive: true,
    });
    setUserSearch("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-4xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
        <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center text-brand-600 dark:text-brand-400">
          <Gift className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create New Gift Card</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Generate customized gift vouchers for all customers or specific users
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column: Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-5">
          {/* Amount & Currency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Amount *</Label>
              <Input
                type="number"
                min="1"
                step="any"
                placeholder="e.g. 100"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
              <span className="text-[11px] text-gray-400 mt-1 block">Value to be credited to customer wallet</span>
            </div>
            <div>
              <Label>Currency</Label>
              <Input
                type="text"
                value={formData.currency}
                disabled
                className="bg-gray-50 dark:bg-gray-800 cursor-not-allowed font-semibold"
              />
              <span className="text-[11px] text-gray-400 mt-1 block">Default currency is SAR</span>
            </div>
          </div>

          {/* Title & Description */}
          <div>
            <Label>Title (Optional)</Label>
            <Input
              type="text"
              placeholder="e.g. Welcome Gift Voucher"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div>
            <Label>Description (Optional)</Label>
            <textarea
              rows={2}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:text-white dark:bg-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:border-brand-500"
              placeholder="e.g. Special gift voucher for exclusive launch customers"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Target Audience */}
          <div>
            <Label>Target Audience *</Label>
            <div className="grid grid-cols-2 gap-3 mt-1">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, targetType: "ALL", applicableUser: "", selectedUserName: "" })}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-sm font-medium transition-all ${
                  formData.targetType === "ALL"
                    ? "border-brand-500 bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400 shadow-xs"
                    : "border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-300"
                }`}
              >
                <Users className="w-4 h-4" />
                All Users (Public)
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, targetType: "SPECIFIC_USER" })}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-sm font-medium transition-all ${
                  formData.targetType === "SPECIFIC_USER"
                    ? "border-brand-500 bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400 shadow-xs"
                    : "border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-300"
                }`}
              >
                <User className="w-4 h-4" />
                Specific User
              </button>
            </div>
          </div>

          {/* If specific user, select user */}
          {formData.targetType === "SPECIFIC_USER" && (
            <div className="p-4 rounded-xl border border-dashed border-brand-300 dark:border-brand-700/60 bg-brand-50/30 dark:bg-brand-900/10 space-y-3">
              <Label>Select User *</Label>
              {formData.selectedUserName ? (
                <div className="flex items-center justify-between p-3.5 bg-white dark:bg-gray-800 rounded-xl border border-brand-200 dark:border-brand-800 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/50 text-brand-600 dark:text-brand-400 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        {formData.selectedUserName}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex-wrap">
                        {formData.selectedUserEmail && (
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3 text-gray-400" />
                            {formData.selectedUserEmail}
                          </span>
                        )}
                        {formData.selectedUserPhone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-gray-400" />
                            {formData.selectedUserPhone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        applicableUser: "",
                        selectedUserName: "",
                        selectedUserEmail: "",
                        selectedUserPhone: "",
                      })
                    }
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    title="Change user"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white placeholder:text-gray-400 focus:outline-hidden focus:border-brand-500"
                      placeholder="Search user by name, phone no, or email..."
                      value={userSearch}
                      onChange={handleUserSearch}
                    />
                  </div>

                  {/* Quick User List Dropdown */}
                  <div className="max-h-56 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
                    {loadingUsers ? (
                      <div className="p-4 text-center text-xs text-gray-400">Loading users...</div>
                    ) : filteredUsers.length > 0 ? (
                      filteredUsers.map((u) => {
                        const displayName =
                          [u.firstName, u.lastName].filter(Boolean).join(" ") || u.name || "Customer";
                        return (
                          <div
                            key={u._id}
                            onClick={() => handleSelectUser(u)}
                            className="p-3 hover:bg-brand-50/50 dark:hover:bg-gray-800/60 cursor-pointer flex items-center justify-between gap-3 text-xs transition-colors"
                          >
                            <div className="space-y-0.5">
                              <span className="font-bold text-gray-900 dark:text-white text-sm block">
                                {displayName}
                              </span>
                              <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 flex-wrap">
                                {u.email && (
                                  <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                                    <Mail className="w-3 h-3 text-gray-400" />
                                    {u.email}
                                  </span>
                                )}
                                {u.phone && (
                                  <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                                    <Phone className="w-3 h-3 text-gray-400" />
                                    {u.phone}
                                  </span>
                                )}
                              </div>
                            </div>
                            <span className="px-2.5 py-1 rounded-md bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400 font-medium text-xs flex-shrink-0">
                              Select
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-4 text-center text-xs text-gray-400">
                        No users found matching "{userSearch}".
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Code Length & Usage Limit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Code Length (8 - 16)</Label>
              <Input
                type="number"
                min="8"
                max="16"
                value={formData.codeLength}
                onChange={(e) => setFormData({ ...formData, codeLength: e.target.value })}
              />
              <span className="text-[11px] text-gray-400 mt-1 block">Default 12 alphanumeric characters</span>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label>Usage Limit</Label>
                <label className="flex items-center gap-1.5 cursor-pointer text-xs text-brand-600 dark:text-brand-400">
                  <input
                    type="checkbox"
                    checked={formData.isUnlimitedUsage}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isUnlimitedUsage: e.target.checked,
                        usageLimit: e.target.checked ? "" : 1,
                      })
                    }
                    className="rounded text-brand-500 focus:ring-brand-400"
                  />
                  Unlimited
                </label>
              </div>
              <Input
                type="number"
                min="1"
                disabled={formData.isUnlimitedUsage}
                placeholder={formData.isUnlimitedUsage ? "Unlimited redemptions" : "e.g. 1"}
                value={formData.isUnlimitedUsage ? "" : formData.usageLimit}
                onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
              />
              <span className="text-[11px] text-gray-400 mt-1 block">
                {formData.isUnlimitedUsage ? "Can be redeemed multiple times" : "Max redemptions allowed"}
              </span>
            </div>
          </div>

          {/* Dates: Start & Expiry */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Start Date (Optional)</Label>
              <Input
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
            <div>
              <Label>Expiry Date (Optional)</Label>
              <Input
                type="datetime-local"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              />
            </div>
          </div>

          {/* Is Active Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40">
            <div>
              <p className="text-sm font-semibold text-gray-800 dark:text-white">Active Status</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Enable immediately upon creation</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-hidden rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-500"></div>
            </label>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="min-w-[130px]">
              {loading ? "Creating..." : "Create Gift Card"}
            </Button>
          </div>
        </form>

        {/* Right column: Card Preview */}
        <div className="lg:col-span-5 flex flex-col justify-start space-y-4">
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-500" />
            Live Voucher Preview
          </div>

          {/* Realistic Gift Voucher Card */}
          <div className="relative overflow-hidden rounded-3xl p-6 text-white shadow-xl bg-gradient-to-br from-gray-900 via-indigo-950 to-brand-900 border border-white/10">
            {/* Background Pattern */}
            <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-brand-500/20 blur-2xl pointer-events-none"></div>
            <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-purple-500/20 blur-2xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col justify-between h-56">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center">
                    <Gift className="w-4 h-4 text-brand-300" />
                  </div>
                  <span className="text-xs font-bold tracking-widest text-brand-200 uppercase">OUT VOUCHER</span>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md font-semibold text-white">
                  {formData.targetType === "ALL" ? "Public" : "Exclusive"}
                </span>
              </div>

              <div>
                <p className="text-xs text-gray-300 font-medium">
                  {formData.title || "Special Gift Voucher"}
                </p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-extrabold tracking-tight">
                    {formData.amount ? Number(formData.amount).toLocaleString() : "0"}
                  </span>
                  <span className="text-sm font-semibold text-brand-300">
                    {formData.currency || "SAR"}
                  </span>
                </div>
                <p className="text-[11px] text-gray-300 line-clamp-1 mt-1">
                  {formData.description || "Valid on all OUT platform bookings and services."}
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase text-gray-400 block tracking-wider">CODE (AUTO-GEN)</span>
                  <span className="font-mono text-xs font-bold tracking-widest text-brand-200">
                    {"•".repeat(Math.min(formData.codeLength || 12, 12))}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase text-gray-400 block tracking-wider">EXPIRY</span>
                  <span className="text-[11px] text-gray-200 font-medium">
                    {formData.expiryDate ? new Date(formData.expiryDate).toLocaleDateString() : "No Expiry"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Info Box */}
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400 space-y-2">
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Gift Card Rules & Security
            </div>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-gray-500 dark:text-gray-400">
              <li>System automatically generates unique cryptographically secure codes.</li>
              <li>Once created, amount, currency, and code cannot be altered.</li>
              <li>When redeemed by a user, the balance is added directly into their wallet.</li>
            </ul>
          </div>
        </div>
      </div>
    </Modal>
  );
}
