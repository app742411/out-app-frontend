import React, { useState, useEffect, useRef } from "react";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import { createCoupon, getCategories, getAllProperties, updateCoupon } from "../../api/authApi";
import toast from "react-hot-toast";

export default function AddCouponComp({ fetchCoupons, editCoupon = null, setEditCoupon = null }) {
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [properties, setProperties] = useState([]);

    const startDatePickerRef = useRef(null);
    const expiryDatePickerRef = useRef(null);

    const [formData, setFormData] = useState({
        code: "",
        discountType: "PERCENTAGE",
        discountValue: 0,
        minAmount: 0,
        maxDiscount: 0,
        usageLimit: 0,
        firstTimeUserOnly: false,
        applicableCategories: [],
        applicableProperties: [],
        startDate: "",
        expiryDate: "",
        isActive: true,
    });

    // Fetch dropdown data
    // useEffect(() => {
    //     const fetchDropdowns = async () => {
    //         try {
    //             const catRes = await getCategories({ limit: 100 });
    //             if (catRes.data && catRes.data.categories) setCategories(catRes.data.categories);

    //             const propRes = await getAllProperties({ limit: 100 });
    //             if (propRes.data) setProperties(propRes.data);
    //         } catch (error) {
    //             console.error("Failed fetching dropdowns:", error);
    //         }
    //     };
    //     fetchDropdowns();
    // }, []);

    // Update form if editing
    useEffect(() => {
        if (editCoupon) {
            setFormData({
                code: editCoupon.code || "",
                discountType: editCoupon.discountType || "PERCENTAGE",
                discountValue: editCoupon.discountValue || 0,
                minAmount: editCoupon.minAmount || 0,
                maxDiscount: editCoupon.maxDiscount || 0,
                usageLimit: editCoupon.usageLimit || 0,
                firstTimeUserOnly: editCoupon.firstTimeUserOnly || false,
                applicableCategories: editCoupon.applicableCategories?.map(c => c._id || c) || [],
                applicableProperties: editCoupon.applicableProperties?.map(p => p._id || p) || [],
                startDate: editCoupon.startDate ? new Date(editCoupon.startDate).toISOString() : "",
                expiryDate: editCoupon.expiryDate ? new Date(editCoupon.expiryDate).toISOString() : "",
                isActive: editCoupon.isActive ?? true,
            });
            if (editCoupon.startDate && startDatePickerRef.current) {
                startDatePickerRef.current.setDate(new Date(editCoupon.startDate));
            }
            if (editCoupon.expiryDate && expiryDatePickerRef.current) {
                expiryDatePickerRef.current.setDate(new Date(editCoupon.expiryDate));
            }
        } else {
            handleReset();
            startDatePickerRef.current?.clear();
            expiryDatePickerRef.current?.clear();
        }
    }, [editCoupon]);

    useEffect(() => {
        startDatePickerRef.current = flatpickr("#couponStartDate", {
            enableTime: true,
            dateFormat: "d/m/Y H:i",
            minDate: "today",
            onChange: (selectedDates) => {
                if (selectedDates.length > 0) {
                    setFormData(prev => ({ ...prev, startDate: selectedDates[0].toISOString() }));
                } else {
                    setFormData(prev => ({ ...prev, startDate: "" }));
                }
            }
        });

        expiryDatePickerRef.current = flatpickr("#couponExpiryDate", {
            enableTime: true,
            dateFormat: "d/m/Y H:i",
            onChange: (selectedDates) => {
                if (selectedDates.length > 0) {
                    setFormData(prev => ({ ...prev, expiryDate: selectedDates[0].toISOString() }));
                } else {
                    setFormData(prev => ({ ...prev, expiryDate: "" }));
                }
            }
        });

        return () => {
            startDatePickerRef.current?.destroy();
            expiryDatePickerRef.current?.destroy();
        };
    }, []);


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleMultiSelect = (e, field) => {
        const options = Array.from(e.target.selectedOptions, option => option.value);
        setFormData(prev => ({
            ...prev,
            [field]: options
        }));
    };

    const handleReset = () => {
        setFormData({
            code: "",
            discountType: "PERCENTAGE",
            discountValue: 0,
            minAmount: 0,
            maxDiscount: 0,
            usageLimit: 0,
            firstTimeUserOnly: false,
            applicableCategories: [],
            applicableProperties: [],
            startDate: "",
            expiryDate: "",
            isActive: true,
        });
        startDatePickerRef.current?.clear();
        expiryDatePickerRef.current?.clear();
        if (setEditCoupon) setEditCoupon(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...formData,
                discountValue: Number(formData.discountValue),
                minAmount: Number(formData.minAmount),
                maxDiscount: Number(formData.maxDiscount),
                usageLimit: Number(formData.usageLimit),
                // Ensure valid date formatting for backend 
                startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
                expiryDate: formData.expiryDate ? new Date(formData.expiryDate).toISOString() : null,
            };

            if (editCoupon) {
                await updateCoupon(editCoupon._id, payload);
                toast.success("Coupon updated successfully");
            } else {
                await createCoupon(payload);
                toast.success("Coupon created successfully");
            }

            handleReset();
            if (fetchCoupons) fetchCoupons();
        } catch (error) {
            toast.error(error.message || "Operation failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
            <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">
                {editCoupon ? "Edit Coupon" : "Add New Coupon"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label>Coupon Code</Label>
                    <Input
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                        placeholder="e.g. WELCOME50"
                        required
                        className="uppercase"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>Discount Type</Label>
                        <select
                            name="discountType"
                            value={formData.discountType}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        >
                            <option value="PERCENTAGE">Percentage</option>
                            <option value="FLAT">Flat Amount</option>
                        </select>
                    </div>
                    <div>
                        <Label>Discount Value</Label>
                        <Input
                            type="number"
                            name="discountValue"
                            value={formData.discountValue}
                            onChange={handleChange}
                            min="0"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>Min Order Amount</Label>
                        <Input type="number" name="minAmount" value={formData.minAmount} onChange={handleChange} min="0" />
                    </div>
                    <div>
                        <Label>Max Discount Limit</Label>
                        <Input type="number" name="maxDiscount" value={formData.maxDiscount} onChange={handleChange} min="0" />
                    </div>
                </div>

                <div>
                    <Label>Usage Limit (Total)</Label>
                    <Input type="number" name="usageLimit" value={formData.usageLimit} onChange={handleChange} min="0" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>Start Date</Label>
                        <Input id="couponStartDate" type="text" name="startDate" placeholder="DD/MM/YYYY HH:MM" required />
                    </div>
                    <div>
                        <Label>Expiry Date</Label>
                        <Input id="couponExpiryDate" type="text" name="expiryDate" placeholder="DD/MM/YYYY HH:MM" required />
                    </div>
                </div>

                {/* <div>
                    <Label>Applicable Categories (Multi-select)</Label>
                    <select
                        multiple
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm h-24 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        value={formData.applicableCategories}
                        onChange={(e) => handleMultiSelect(e, 'applicableCategories')}
                    >
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>{cat.category}</option>
                        ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Hold CTRL / CMD to select multiple</p>
                </div>

                <div>
                    <Label>Applicable Properties (Multi-select)</Label>
                    <select
                        multiple
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm h-32 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        value={formData.applicableProperties}
                        onChange={(e) => handleMultiSelect(e, 'applicableProperties')}
                    >
                        {properties.map((prop) => (
                            <option key={prop._id} value={prop._id}>{prop.name} - ${prop.price}</option>
                        ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Hold CTRL / CMD to select multiple</p>
                </div> */}

                <div className="flex items-center gap-4 pt-2">
                    <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                        <input
                            type="checkbox"
                            name="firstTimeUserOnly"
                            checked={formData.firstTimeUserOnly}
                            onChange={handleChange}
                            className="w-4 h-4 rounded text-brand-500 focus:ring-brand-500"
                        />
                        First Time User Only
                    </label>
                </div>

                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                        <input
                            type="checkbox"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleChange}
                            className="w-4 h-4 rounded text-brand-500 focus:ring-brand-500"
                        />
                        Active Status
                    </label>
                </div>

                <div className="pt-4 flex gap-3">
                    <Button type="button" variant="outline" onClick={handleReset} className="flex-1">
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading} className="flex-1 bg-brand-500 text-white hover:bg-brand-600">
                        {loading ? "Saving..." : editCoupon ? "Update Coupon" : "Create Coupon"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
