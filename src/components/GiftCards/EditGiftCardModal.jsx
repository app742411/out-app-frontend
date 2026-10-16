import React, { useState, useEffect } from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { updateGiftCard } from "../../api/giftCardApi";
import toast from "react-hot-toast";
import { Edit3, Lock, Info, Calendar } from "lucide-react";
import { formatCurrency } from "../../utils/currency";

export default function EditGiftCardModal({ isOpen, onClose, giftCard, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    usageLimit: "",
    isUnlimitedUsage: false,
    startDate: "",
    expiryDate: "",
    isActive: true,
  });

  const formatDateForInput = (isoDate) => {
    if (!isoDate) return "";
    try {
      const d = new Date(isoDate);
      return d.toISOString().slice(0, 16);
    } catch {
      return "";
    }
  };

  useEffect(() => {
    if (giftCard) {
      setFormData({
        title: giftCard.title || "",
        description: giftCard.description || "",
        usageLimit: giftCard.usageLimit !== null && giftCard.usageLimit !== undefined ? giftCard.usageLimit : "",
        isUnlimitedUsage: giftCard.usageLimit === null || giftCard.usageLimit === undefined,
        startDate: formatDateForInput(giftCard.startDate),
        expiryDate: formatDateForInput(giftCard.expiryDate),
        isActive: giftCard.isActive !== false,
      });
    }
  }, [giftCard]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!giftCard?._id) return;

    const payload = {
      isActive: Boolean(formData.isActive),
    };

    if (formData.title !== undefined) payload.title = formData.title.trim();
    if (formData.description !== undefined) payload.description = formData.description.trim();

    if (formData.isUnlimitedUsage) {
      payload.usageLimit = null;
    } else if (formData.usageLimit !== "") {
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
      await updateGiftCard(giftCard._id, payload);
      toast.success("Gift Card updated successfully!");
      onSuccess?.();
      onClose();
    } catch (error) {
      const msg = error?.message || error?.error || "Failed to update gift card";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!giftCard) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
          <Edit3 className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Gift Card</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
            Code: <span className="font-bold text-brand-600 dark:text-brand-400">{giftCard.code}</span>
          </p>
        </div>
      </div>

      {/* Read-Only Notice and Core Details */}
      <div className="p-4 mb-6 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60 flex items-start gap-3">
        <Lock className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
        <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
          <div className="flex items-center gap-4 flex-wrap">
            <span>
              <strong>Amount:</strong> {formatCurrency(giftCard.amount)}
            </span>
            <span>
              <strong>Target:</strong> {giftCard.targetType === "SPECIFIC_USER" ? "Specific User" : "All Users"}
            </span>
            <span>
              <strong>Times Used:</strong> {giftCard.timesUsed || (Array.isArray(giftCard.usedBy) ? giftCard.usedBy.length : 0)}
            </span>
          </div>
          <p className="text-[11px] text-gray-400">
            Amount, code, currency, and audience type cannot be modified after issuance.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label>Title</Label>
          <Input
            type="text"
            placeholder="e.g. Ramadan Special Gift Card"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        <div>
          <Label>Description</Label>
          <textarea
            rows={2}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:text-white dark:bg-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:border-brand-500"
            placeholder="Gift card description..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        {/* Usage Limit */}
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
              Unlimited Limit (No cap)
            </label>
          </div>
          <Input
            type="number"
            min="1"
            disabled={formData.isUnlimitedUsage}
            placeholder={formData.isUnlimitedUsage ? "Unlimited redemptions" : "e.g. 5"}
            value={formData.isUnlimitedUsage ? "" : formData.usageLimit}
            onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Start Date</Label>
            <Input
              type="datetime-local"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />
          </div>
          <div>
            <Label>Expiry Date</Label>
            <Input
              type="datetime-local"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
            />
          </div>
        </div>

        {/* Active Switch */}
        <div className="flex items-center justify-between p-3.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40">
          <div>
            <p className="text-sm font-semibold text-gray-800 dark:text-white">Active Status</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formData.isActive ? "Card is enabled for redemption" : "Card is currently disabled"}
            </p>
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

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading} className="min-w-[120px]">
            {loading ? "Updating..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
