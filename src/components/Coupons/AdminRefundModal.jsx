import React, { useState } from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { adminOverrideRefund } from "../../api/authApi";
import toast from "react-hot-toast";
import { RotateCcw, AlertTriangle, ShieldAlert, CheckCircle, Info } from "lucide-react";

export default function AdminRefundModal({
  isOpen,
  onClose,
  bookingId: initialBookingId = "",
  onSuccess,
}) {
  const [bookingId, setBookingId] = useState(initialBookingId);
  const [refundAmount, setRefundAmount] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  React.useEffect(() => {
    if (initialBookingId) setBookingId(initialBookingId);
    if (!isOpen) {
      setResult(null);
    }
  }, [initialBookingId, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bookingId.trim()) {
      toast.error("Please enter a valid Booking ID");
      return;
    }
    if (!refundAmount || Number(refundAmount) <= 0) {
      toast.error("Please enter a valid refund amount (SAR)");
      return;
    }
    if (!reason.trim()) {
      toast.error("Please provide a reason for the override refund");
      return;
    }

    try {
      setLoading(true);
      const res = await adminOverrideRefund(bookingId.trim(), {
        refundAmount: Number(refundAmount),
        reason: reason.trim(),
      });
      toast.success("Admin refund and cashback reversal processed!");
      setResult(res?.data || res);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      toast.error(err?.message || err?.error || "Failed to process admin override refund");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setBookingId(initialBookingId || "");
    setRefundAmount("");
    setReason("");
    setResult(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-xl p-6 sm:p-7 max-h-[90vh] overflow-y-auto">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-gray-800 mb-5 pr-8">
        <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
          <RotateCcw className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Admin Override Refund & Cashback Reversal
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Cancel booking, process refund, and reverse any credited cashback
          </p>
        </div>
      </div>

      {/* Rules Notice */}
      <div className="mb-5 p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 text-xs text-amber-800 dark:text-amber-300 space-y-1.5">
        <div className="flex items-center gap-1.5 font-semibold">
          <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>Automatic System Actions:</span>
        </div>
        <ul className="list-disc pl-5 space-y-1 text-[11px] text-amber-700 dark:text-amber-400">
          <li>Deducts/reverses credited cashback from customer wallet (<code>cashback_reversal</code>).</li>
          <li>Sets <code>cashbackStatus: &ldquo;REVERSED&rdquo;</code> (or <code>&ldquo;CANCELLED&rdquo;</code> if pending).</li>
          <li>Restores customer coupon eligibility and decrements coupon usage count.</li>
        </ul>
      </div>

      {result ? (
        <div className="space-y-4 py-2">
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300 text-xs flex items-start gap-2.5">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Refund & Reversal Completed Successfully</p>
              <p className="mt-1">
                Booking ID <strong>{bookingId}</strong> has been refunded <strong>{refundAmount} SAR</strong>. Associated cashback status and wallet records have been updated.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={handleReset}>
              Refund Another
            </Button>
            <Button variant="primary" onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Booking ID (MongoDB _id)</Label>
            <Input
              type="text"
              placeholder="e.g. 67174bb09e25bb883b28b7a1"
              value={bookingId}
              onChange={(e) => setBookingId(e.target.value)}
              required
            />
          </div>

          <div>
            <Label>Refund Amount (SAR)</Label>
            <Input
              type="number"
              step="any"
              min="0"
              placeholder="e.g. 1200"
              value={refundAmount}
              onChange={(e) => setRefundAmount(e.target.value)}
              required
            />
          </div>

          <div>
            <Label>Reason for Override Refund</Label>
            <textarea
              className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-xs text-gray-800 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              rows={3}
              placeholder="e.g. Host maintenance issue; full refund approved with cashback reversal"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>

          <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              {loading ? "Processing Reversal..." : "Confirm Override Refund"}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
