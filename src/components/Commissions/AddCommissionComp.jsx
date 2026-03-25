import React, { useState, useEffect } from "react";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { createCommission, updateCommission, getCategories } from "../../api/authApi";
import toast from "react-hot-toast";

export default function AddCommissionComp({ fetchCommissions, editCommission = null, setEditCommission = null }) {
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [searchCategory, setSearchCategory] = useState("");

    const [showDropdown, setShowDropdown] = useState(false);

    const [formData, setFormData] = useState({
        scope: "GLOBAL",
        categoryId: "",
        commissionType: "PERCENTAGE",
        value: 0,
        isActive: true,
    });

    // Fetch Categories for dropdown
    const fetchCategoryData = async (search = "") => {
        try {
            const res = await getCategories({ limit: 100, search });
            if (res.data && res.data.categories) {
                setCategories(res.data.categories);
            } else if (res.categories) {
                setCategories(res.categories);
            } else if (Array.isArray(res.data)) {
                setCategories(res.data);
            }
        } catch (error) {
            console.error("Failed fetching categories:", error);
        }
    };

    useEffect(() => {
        fetchCategoryData();
    }, []);

    // Filter Categories dropdown based on search
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchCategoryData(searchCategory);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchCategory]);

    // Update form if editing
    useEffect(() => {
        if (editCommission) {
            setFormData({
                scope: editCommission.scope || "GLOBAL",
                categoryId: editCommission.categoryId?._id || editCommission.categoryId || "",
                commissionType: editCommission.commissionType || "PERCENTAGE",
                value: editCommission.value || 0,
                isActive: editCommission.isActive ?? true,
            });
        } else {
            handleReset();
        }
    }, [editCommission]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSearchChange = (e) => {
        setSearchCategory(e.target.value);
    };

    const handleReset = () => {
        setFormData({
            scope: "GLOBAL",
            categoryId: "",
            commissionType: "PERCENTAGE",
            value: 0,
            isActive: true,
        });
        if (setEditCommission) setEditCommission(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                scope: formData.scope,
                commissionType: formData.commissionType,
                value: Number(formData.value),
                isActive: formData.isActive
            };

            if (formData.scope === "CATEGORY") {
                if (!formData.categoryId) {
                    toast.error("Please select a category");
                    setLoading(false);
                    return;
                }
                payload.categoryId = formData.categoryId;
            }

            if (editCommission) {
                await updateCommission(editCommission._id, payload);
                toast.success("Commission updated successfully");
            } else {
                await createCommission(payload);
                toast.success("Commission created successfully");
            }

            handleReset();
            if (fetchCommissions) fetchCommissions();
        } catch (error) {
            toast.error(error.message || "Operation failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
            <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">
                {editCommission ? "Edit Commission" : "Add New Commission"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label>Scope</Label>
                    <select
                        name="scope"
                        value={formData.scope}
                        onChange={handleChange}
                        disabled={!!editCommission} // Often scope shouldn't change on edit, but if it can, remove this
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white disabled:opacity-50"
                    >
                        <option value="GLOBAL">Global</option>
                        <option value="CATEGORY">Category Specific</option>
                    </select>
                </div>

                {formData.scope === "CATEGORY" && (
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50 relative">
                        <Label className="mb-2 block">Choose Category</Label>

                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Choose Category"
                                value={
                                    categories.find((c) => c._id === formData.categoryId)?.category ||
                                    categories.find((c) => c._id === formData.categoryId)?.name ||
                                    categories.find((c) => c._id === formData.categoryId)?.title ||
                                    searchCategory
                                }
                                onChange={(e) => {
                                    setSearchCategory(e.target.value);
                                    setFormData({ ...formData, categoryId: "" });
                                }}
                                onFocus={() => setShowDropdown(true)}
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                disabled={!!editCommission}
                            />

                            {showDropdown && (
                                <div className="absolute z-20 mt-1 w-full max-h-48 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                                    {categories
                                        .filter((cat) =>
                                            (cat.category || cat.name || cat.title || "")
                                                .toLowerCase()
                                                .includes(searchCategory.toLowerCase())
                                        )
                                        .map((cat) => (
                                            <div
                                                key={cat._id}
                                                onClick={() => {
                                                    setFormData({ ...formData, categoryId: cat._id });
                                                    setSearchCategory("");
                                                    setShowDropdown(false);
                                                }}
                                                className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                                {cat.category || cat.name || cat.title || "Unnamed Category"}
                                            </div>
                                        ))}

                                    {categories.filter((cat) =>
                                        (cat.category || cat.name || cat.title || "")
                                            .toLowerCase()
                                            .includes(searchCategory.toLowerCase())
                                    ).length === 0 && (
                                            <div className="px-4 py-2 text-gray-400 text-sm">
                                                No categories found
                                            </div>
                                        )}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>Commission Type</Label>
                        <select
                            name="commissionType"
                            value={formData.commissionType}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        >
                            <option value="PERCENTAGE">Percentage (%)</option>
                            <option value="FLAT">Flat Amount</option>
                        </select>
                    </div>
                    <div>
                        <Label>Commission Value</Label>
                        <Input
                            type="number"
                            name="value"
                            value={formData.value}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4 pt-2">
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
                        {loading ? "Saving..." : editCommission ? "Update Commission" : "Create Commission"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
