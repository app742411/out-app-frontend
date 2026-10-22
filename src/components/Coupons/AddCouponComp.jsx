import React, { useState, useEffect, useRef } from "react";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import { createCoupon, updateCoupon, getCouponById } from "../../api/authApi";
import toast from "react-hot-toast";
import UserSearchMultiSelect from "./UserSearchMultiSelect";
import {
  Tag,
  Sparkles,
  Percent,
  Coins,
  Users,
  Globe,
  Calendar,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  X,
  FileEdit,
  PlusCircle,
} from "lucide-react";

export default function AddCouponComp({ fetchCoupons, editCoupon = null, setEditCoupon = null }) {
  const [loading, setLoading] = useState(false);
  const [fetchingDetails, setFetchingDetails] = useState(false);

  const startDatePickerRef = useRef(null);
  const expiryDatePickerRef = useRef(null);

  const [formData, setFormData] = useState({
    code: "",
    couponType: "DISCOUNT", // "DISCOUNT" | "CASHBACK"
    discountType: "PERCENTAGE", // "PERCENTAGE" | "FLAT"
    discountValue: "",
    maxDiscount: "",
    minAmount: "",
    userRestriction: "ALL", // "ALL" | "SPECIFIC"
    applicableUsers: [], // Array of User objects / ids
    startDate: "",
    expiryDate: "",
    usageLimit: "",
    firstTimeUserOnly: false,
    isActive: true,
  });

  const [formErrors, setFormErrors] = useState({});

  // Populate form if editing
  useEffect(() => {
    if (editCoupon) {
      // Check if we need to fetch populated user details from getCouponById
      const loadEditCoupon = async () => {
        try {
          let couponData = editCoupon;
          // If applicableUsers are just string IDs or missing populated data, fetch from getCouponById
          if (
            editCoupon._id &&
            editCoupon.userRestriction === "SPECIFIC" &&
            Array.isArray(editCoupon.applicableUsers) &&
            editCoupon.applicableUsers.length > 0 &&
            typeof editCoupon.applicableUsers[0] === "string"
          ) {
            setFetchingDetails(true);
            const res = await getCouponById(editCoupon._id);
            if (res?.data) {
              couponData = res.data;
            }
          }

          setFormData({
            code: couponData.code || "",
            couponType: couponData.couponType || "DISCOUNT",
            discountType: couponData.discountType || "PERCENTAGE",
            discountValue: couponData.discountValue !== undefined ? couponData.discountValue : "",
            minAmount: couponData.minAmount !== undefined ? couponData.minAmount : "",
            maxDiscount: couponData.maxDiscount !== undefined ? couponData.maxDiscount : "",
            usageLimit: couponData.usageLimit !== undefined ? couponData.usageLimit : "",
            userRestriction: couponData.userRestriction || "ALL",
            applicableUsers: Array.isArray(couponData.applicableUsers) ? couponData.applicableUsers : [],
            firstTimeUserOnly: Boolean(couponData.firstTimeUserOnly),
            startDate: couponData.startDate ? new Date(couponData.startDate).toISOString() : "",
            expiryDate: couponData.expiryDate ? new Date(couponData.expiryDate).toISOString() : "",
            isActive: couponData.isActive !== false,
          });

          if (couponData.startDate && startDatePickerRef.current) {
            startDatePickerRef.current.setDate(new Date(couponData.startDate));
          }
          if (couponData.expiryDate && expiryDatePickerRef.current) {
            expiryDatePickerRef.current.setDate(new Date(couponData.expiryDate));
          }
        } catch (err) {
          console.error("Failed loading coupon for edit:", err);
        } finally {
          setFetchingDetails(false);
        }
      };

      loadEditCoupon();
    } else {
      handleReset();
    }
  }, [editCoupon]);

  // Initialize flatpickr date pickers
  useEffect(() => {
    startDatePickerRef.current = flatpickr("#couponStartDate", {
      enableTime: true,
      dateFormat: "d/m/Y H:i",
      minDate: "today",
      onChange: (selectedDates) => {
        if (selectedDates.length > 0) {
          setFormData((prev) => ({ ...prev, startDate: selectedDates[0].toISOString() }));
          setFormErrors((prev) => ({ ...prev, startDate: null }));
        } else {
          setFormData((prev) => ({ ...prev, startDate: "" }));
        }
      },
    });

    expiryDatePickerRef.current = flatpickr("#couponExpiryDate", {
      enableTime: true,
      dateFormat: "d/m/Y H:i",
      onChange: (selectedDates) => {
        if (selectedDates.length > 0) {
          setFormData((prev) => ({ ...prev, expiryDate: selectedDates[0].toISOString() }));
          setFormErrors((prev) => ({ ...prev, expiryDate: null }));
        } else {
          setFormData((prev) => ({ ...prev, expiryDate: "" }));
        }
      },
    });

    return () => {
      startDatePickerRef.current?.destroy();
      expiryDatePickerRef.current?.destroy();
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let finalValue = type === "checkbox" ? checked : value;
    if (name === "code") {
      finalValue = value.toUpperCase().trim();
    }
    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleReset = () => {
    setFormData({
      code: "",
      couponType: "DISCOUNT",
      discountType: "PERCENTAGE",
      discountValue: "",
      minAmount: "",
      maxDiscount: "",
      usageLimit: "",
      userRestriction: "ALL",
      applicableUsers: [],
      startDate: "",
      expiryDate: "",
      firstTimeUserOnly: false,
      isActive: true,
    });
    setFormErrors({});
    startDatePickerRef.current?.clear();
    expiryDatePickerRef.current?.clear();
    if (setEditCoupon) setEditCoupon(null);
  };

  // Client-side validations
  const validateForm = () => {
    const errors = {};
    if (!formData.code || !formData.code.trim()) {
      errors.code = "Coupon code is required";
    }

    const val = Number(formData.discountValue);
    if (!formData.discountValue || isNaN(val) || val <= 0) {
      errors.discountValue = "Value must be greater than 0";
    } else if (formData.discountType === "PERCENTAGE" && val > 100) {
      errors.discountValue = "Percentage discount/cashback cannot exceed 100%";
    }

    if (!formData.startDate) {
      errors.startDate = "Start date is required";
    }

    if (!formData.expiryDate) {
      errors.expiryDate = "Expiry date is required";
    } else if (formData.startDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.expiryDate);
      if (end <= start) {
        errors.expiryDate = "Expiry date must be after start date";
      }
    }

    if (formData.userRestriction === "SPECIFIC") {
      if (!formData.applicableUsers || formData.applicableUsers.length === 0) {
        errors.applicableUsers =
          "At least one user must be selected when userRestriction is SPECIFIC";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      const firstError = Object.values(formErrors)[0];
      if (firstError) toast.error(firstError);
      return;
    }

    setLoading(true);

    try {
      // Extract array of ObjectId strings for applicableUsers
      const userIds =
        formData.userRestriction === "SPECIFIC"
          ? formData.applicableUsers.map((u) => (typeof u === "string" ? u : u._id))
          : [];

      const payload = {
        code: formData.code.toUpperCase().trim(),
        couponType: formData.couponType,
        discountType: formData.discountType,
        discountValue: Number(formData.discountValue),
        minAmount: formData.minAmount ? Number(formData.minAmount) : 0,
        userRestriction: formData.userRestriction,
        applicableUsers: userIds,
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
        expiryDate: formData.expiryDate ? new Date(formData.expiryDate).toISOString() : null,
        firstTimeUserOnly: Boolean(formData.firstTimeUserOnly),
        isActive: Boolean(formData.isActive),
      };

      // Max discount is only applicable if PERCENTAGE
      if (formData.discountType === "PERCENTAGE" && formData.maxDiscount) {
        payload.maxDiscount = Number(formData.maxDiscount);
      }

      // Usage limit
      if (formData.usageLimit && Number(formData.usageLimit) > 0) {
        payload.usageLimit = Number(formData.usageLimit);
      }

      if (editCoupon) {
        await updateCoupon(editCoupon._id, payload);
        toast.success("Coupon updated successfully!");
      } else {
        await createCoupon(payload);
        toast.success("Coupon created successfully!");
      }

      handleReset();
      if (fetchCoupons) fetchCoupons();
    } catch (error) {
      console.error(error);
      const msg =
        error?.message ||
        error?.response?.data?.message ||
        error?.error ||
        "Failed to save coupon";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Dynamic preview calculation description
  const getPreviewSummary = () => {
    const typeLabel = formData.couponType === "CASHBACK" ? "Cashback" : "Instant Discount";
    const val = formData.discountValue ? Number(formData.discountValue) : 0;
    const isPerc = formData.discountType === "PERCENTAGE";
    const cap =
      isPerc && formData.maxDiscount ? ` (capped at ${formData.maxDiscount} SAR)` : "";
    const min = formData.minAmount && Number(formData.minAmount) > 0
      ? ` on bookings above ${formData.minAmount} SAR`
      : "";
    const audience =
      formData.userRestriction === "SPECIFIC"
        ? ` for ${formData.applicableUsers.length} whitelisted user(s)`
        : " for all platform users";
    const payout =
      formData.couponType === "CASHBACK"
        ? " credited to Customer Wallet upon checkout"
        : " deducted immediately at checkout";

    if (!val) return "Configure the coupon fields above to preview the customer incentive.";
    return `Customers receive ${val}${isPerc ? "%" : " SAR"} ${typeLabel}${cap}${min}${audience}, ${payout}.`;
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-white/[0.03] lg:p-6 transition-all">
      {/* Form Title & Indicator */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800 mb-5">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              editCoupon
                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                : "bg-brand-500/10 text-brand-600 dark:text-brand-400"
            }`}
          >
            {editCoupon ? <FileEdit className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              {editCoupon ? "Edit Coupon" : "Create Enhanced Coupon"}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {editCoupon
                ? `Updating code: ${editCoupon.code}`
                : "Discount & Cashback coupons with audience targeting"}
            </p>
          </div>
        </div>

        {editCoupon && (
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" /> Cancel Edit
          </button>
        )}
      </div>

      {fetchingDetails && (
        <div className="mb-4 p-2.5 rounded-lg bg-blue-50 text-blue-700 text-xs text-center animate-pulse">
          Loading whitelisted customer details...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 1. Coupon Code */}
        <div>
          <div className="flex items-center justify-between">
            <Label>Coupon Code <span className="text-red-500">*</span></Label>
            <span className="text-[11px] text-gray-400">Auto uppercase & trimmed</span>
          </div>
          <Input
            name="code"
            value={formData.code}
            onChange={handleChange}
            placeholder="e.g. VIPCASH15 or SAVE20"
            required
            className="uppercase font-mono font-bold tracking-wider"
          />
          {formErrors.code && <p className="text-xs text-red-500 mt-1">{formErrors.code}</p>}
        </div>

        {/* 2. Coupon Type: DISCOUNT vs CASHBACK */}
        <div>
          <Label className="mb-1.5 block">
            Coupon Type <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-2 gap-2.5">
            <label
              className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                formData.couponType === "DISCOUNT"
                  ? "border-brand-500 bg-brand-50/40 dark:bg-brand-500/10 ring-1 ring-brand-500 text-brand-900 dark:text-white"
                  : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="couponType"
                value="DISCOUNT"
                checked={formData.couponType === "DISCOUNT"}
                onChange={handleChange}
                className="mt-0.5 text-brand-500 focus:ring-brand-500"
              />
              <div className="text-xs">
                <span className="font-bold flex items-center gap-1.5 text-gray-900 dark:text-white">
                  <Tag className="w-3.5 h-3.5 text-brand-500" /> DISCOUNT
                </span>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                  Reduces booking price immediately at checkout.
                </p>
              </div>
            </label>

            <label
              className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                formData.couponType === "CASHBACK"
                  ? "border-emerald-500 bg-emerald-50/40 dark:bg-emerald-500/10 ring-1 ring-emerald-500 text-emerald-900 dark:text-white"
                  : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="couponType"
                value="CASHBACK"
                checked={formData.couponType === "CASHBACK"}
                onChange={handleChange}
                className="mt-0.5 text-emerald-500 focus:ring-emerald-500"
              />
              <div className="text-xs">
                <span className="font-bold flex items-center gap-1.5 text-gray-900 dark:text-white">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> CASHBACK
                </span>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                  Credits to customer wallet post-stay completion.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* 3. Calculation Mode & Value */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label className="mb-1.5 block">Calculation Mode <span className="text-red-500">*</span></Label>
            <div className="grid grid-cols-2 gap-2">
              <label
                className={`flex items-center justify-center gap-1.5 p-2 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                  formData.discountType === "PERCENTAGE"
                    ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300 ring-1 ring-brand-500"
                    : "border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="discountType"
                  value="PERCENTAGE"
                  checked={formData.discountType === "PERCENTAGE"}
                  onChange={handleChange}
                  className="sr-only"
                />
                <Percent className="w-3.5 h-3.5" /> Percentage (%)
              </label>

              <label
                className={`flex items-center justify-center gap-1.5 p-2 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                  formData.discountType === "FLAT"
                    ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300 ring-1 ring-brand-500"
                    : "border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="discountType"
                  value="FLAT"
                  checked={formData.discountType === "FLAT"}
                  onChange={handleChange}
                  className="sr-only"
                />
                <Coins className="w-3.5 h-3.5" /> Flat (SAR)
              </label>
            </div>
          </div>

          <div>
            <Label>
              Value ({formData.discountType === "PERCENTAGE" ? "%" : "SAR"}){" "}
              <span className="text-red-500">*</span>
            </Label>
            <Input
              type="number"
              step="any"
              name="discountValue"
              value={formData.discountValue}
              onChange={handleChange}
              min="0.1"
              max={formData.discountType === "PERCENTAGE" ? "100" : undefined}
              placeholder={formData.discountType === "PERCENTAGE" ? "e.g. 15" : "e.g. 50"}
              required
            />
            {formErrors.discountValue && (
              <p className="text-xs text-red-500 mt-1">{formErrors.discountValue}</p>
            )}
          </div>
        </div>

        {/* 4. Conditional Cap & Minimum Spend */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {formData.discountType === "PERCENTAGE" ? (
            <div>
              <div className="flex items-center justify-between">
                <Label>Max Discount Cap (SAR)</Label>
                <span className="text-[10px] text-gray-400">Optional</span>
              </div>
              <Input
                type="number"
                step="any"
                name="maxDiscount"
                value={formData.maxDiscount}
                onChange={handleChange}
                min="0"
                placeholder="e.g. 200 (SAR cap)"
              />
              <p className="text-[10px] text-gray-500 mt-1">Limits max saving for percentage rate</p>
            </div>
          ) : (
            <div className="opacity-50">
              <Label>Max Discount Cap (SAR)</Label>
              <Input
                type="text"
                disabled
                placeholder="Not applicable for Flat Amount"
                className="bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
              />
              <p className="text-[10px] text-gray-400 mt-1">Disabled when Flat SAR is selected</p>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between">
              <Label>Minimum Spend (SAR)</Label>
              <span className="text-[10px] text-gray-400">Optional</span>
            </div>
            <Input
              type="number"
              step="any"
              name="minAmount"
              value={formData.minAmount}
              onChange={handleChange}
              min="0"
              placeholder="e.g. 500 (default 0)"
            />
            <p className="text-[10px] text-gray-500 mt-1">Minimum subtotal required to apply</p>
          </div>
        </div>

        {/* 5. Target Audience: ALL vs SPECIFIC */}
        <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
          <Label className="mb-1.5 block">
            Target Audience <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-2 gap-2.5">
            <label
              className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                formData.userRestriction === "ALL"
                  ? "border-brand-500 bg-brand-50/40 dark:bg-brand-500/10 ring-1 ring-brand-500 text-brand-900 dark:text-white"
                  : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="userRestriction"
                value="ALL"
                checked={formData.userRestriction === "ALL"}
                onChange={handleChange}
                className="mt-0.5 text-brand-500 focus:ring-brand-500"
              />
              <div className="text-xs">
                <span className="font-bold flex items-center gap-1.5 text-gray-900 dark:text-white">
                  <Globe className="w-3.5 h-3.5 text-blue-500" /> All Users
                </span>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                  Any customer on the platform can use this coupon.
                </p>
              </div>
            </label>

            <label
              className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                formData.userRestriction === "SPECIFIC"
                  ? "border-purple-500 bg-purple-50/40 dark:bg-purple-500/10 ring-1 ring-purple-500 text-purple-900 dark:text-white"
                  : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="userRestriction"
                value="SPECIFIC"
                checked={formData.userRestriction === "SPECIFIC"}
                onChange={handleChange}
                className="mt-0.5 text-purple-500 focus:ring-purple-500"
              />
              <div className="text-xs">
                <span className="font-bold flex items-center gap-1.5 text-gray-900 dark:text-white">
                  <Users className="w-3.5 h-3.5 text-purple-500" /> Specific Users
                </span>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                  Restricted to whitelisted users only.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* 6. Whitelisted Users Autocomplete (Visible only when SPECIFIC) */}
        {formData.userRestriction === "SPECIFIC" && (
          <div className="p-3.5 rounded-xl border border-purple-200 dark:border-purple-800/40 bg-purple-50/30 dark:bg-purple-950/10 space-y-2">
            <Label className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-purple-900 dark:text-purple-300 font-bold">
                <Users className="w-4 h-4 text-purple-500" />
                Whitelisted Customers <span className="text-red-500">*</span>
              </span>
              <span className="text-[10px] text-purple-600 dark:text-purple-400 font-normal">
                Search by name, phone or email
              </span>
            </Label>

            <UserSearchMultiSelect
              selectedUsers={formData.applicableUsers}
              onChange={(users) => {
                setFormData((prev) => ({ ...prev, applicableUsers: users }));
                if (formErrors.applicableUsers) {
                  setFormErrors((prev) => ({ ...prev, applicableUsers: null }));
                }
              }}
              error={formErrors.applicableUsers}
            />
          </div>
        )}

        {/* 7. Start & Expiry Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div>
            <Label>Start Date & Time <span className="text-red-500">*</span></Label>
            <Input
              id="couponStartDate"
              type="text"
              name="startDate"
              placeholder="DD/MM/YYYY HH:MM"
              required
            />
            {formErrors.startDate && (
              <p className="text-xs text-red-500 mt-1">{formErrors.startDate}</p>
            )}
          </div>

          <div>
            <Label>Expiry Date & Time <span className="text-red-500">*</span></Label>
            <Input
              id="couponExpiryDate"
              type="text"
              name="expiryDate"
              placeholder="DD/MM/YYYY HH:MM"
              required
            />
            {formErrors.expiryDate && (
              <p className="text-xs text-red-500 mt-1">{formErrors.expiryDate}</p>
            )}
          </div>
        </div>

        {/* 8. Total Usage Limit */}
        <div>
          <div className="flex items-center justify-between">
            <Label>Total Usage Limit (Platform-wide)</Label>
            <span className="text-[10px] text-gray-400">0 or empty = unlimited</span>
          </div>
          <Input
            type="number"
            name="usageLimit"
            value={formData.usageLimit}
            onChange={handleChange}
            min="0"
            placeholder="e.g. 100 (Leave empty for unlimited)"
          />
        </div>

        {/* 9. Checkboxes: First Time User Only & Active Status */}
        <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-800">
          <label className="flex items-center gap-2.5 text-xs text-gray-700 dark:text-gray-300 cursor-pointer select-none">
            <input
              type="checkbox"
              name="firstTimeUserOnly"
              checked={formData.firstTimeUserOnly}
              onChange={handleChange}
              className="w-4 h-4 rounded text-brand-500 focus:ring-brand-500"
            />
            <span>
              <strong>First-time Users Only:</strong> Restrict to customers with 0 previous confirmed bookings
            </span>
          </label>

          <label className="flex items-center gap-2.5 text-xs text-gray-700 dark:text-gray-300 cursor-pointer select-none">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-4 h-4 rounded text-brand-500 focus:ring-brand-500"
            />
            <span>
              <strong>Active Coupon Status:</strong> Allow customers to view and redeem this coupon immediately
            </span>
          </label>
        </div>

        {/* Live Preview Card */}
        <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800 text-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1 mb-1">
            <HelpCircle className="w-3 h-3 text-brand-500" /> Live Coupon Rule Preview
          </span>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
            {getPreviewSummary()}
          </p>
        </div>

        {/* Form Actions */}
        <div className="pt-3 flex gap-3">
          <Button type="button" variant="outline" onClick={handleReset} className="flex-1">
            {editCoupon ? "Cancel" : "Reset"}
          </Button>
          <Button
            type="submit"
            disabled={loading || fetchingDetails}
            className={`flex-1 text-white ${
              formData.couponType === "CASHBACK"
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-brand-500 hover:bg-brand-600"
            }`}
          >
            {loading ? "Saving..." : editCoupon ? "Update Coupon" : "Create Coupon"}
          </Button>
        </div>
      </form>
    </div>
  );
}
