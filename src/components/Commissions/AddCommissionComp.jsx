import React, { useState, useEffect, useRef } from "react";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { createCommission, updateCommission, getCategories, getAllServiceCategories, getAllServicesAdmin } from "../../api/authApi";
import toast from "react-hot-toast";
import { Select } from "../ui/select/Select";

export default function AddCommissionComp({ fetchCommissions, editCommission = null, setEditCommission = null }) {
    const [loading, setLoading] = useState(false);

    // Property Category States
    const [categories, setCategories] = useState([]);
    const [searchCategory, setSearchCategory] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);

    // Service Category States
    const [serviceCategories, setServiceCategories] = useState([]);
    const [searchServiceCategory, setSearchServiceCategory] = useState("");
    const [showServiceCategoryDropdown, setShowServiceCategoryDropdown] = useState(false);

    // Service States
    const [services, setServices] = useState([]);
    const [searchService, setSearchService] = useState("");
    const [showServiceDropdown, setShowServiceDropdown] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        scope: "GLOBAL",
        type: "PROPERTY",
        categoryId: "",
        serviceCategoryId: "",
        serviceId: "",
        commissionType: "PERCENTAGE",
        value: 0,
        isActive: true,
    });

    const propertyCatRef = useRef(null);
    const serviceCatRef = useRef(null);
    const serviceRef = useRef(null);

    // Handle click outside to close autocomplete lists
    useEffect(() => {
        function handleClickOutside(event) {
            if (propertyCatRef.current && !propertyCatRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
            if (serviceCatRef.current && !serviceCatRef.current.contains(event.target)) {
                setShowServiceCategoryDropdown(false);
            }
            if (serviceRef.current && !serviceRef.current.contains(event.target)) {
                setShowServiceDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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

    // Fetch Service Categories for dropdown
    const fetchServiceCategoryData = async (search = "") => {
        try {
            const res = await getAllServiceCategories({ limit: 100, search });
            if (res.data) {
                setServiceCategories(res.data);
            } else if (Array.isArray(res)) {
                setServiceCategories(res);
            }
        } catch (error) {
            console.error("Failed fetching service categories:", error);
        }
    };

    // Fetch Services for dropdown
    const fetchServiceData = async (search = "") => {
        try {
            const res = await getAllServicesAdmin({ limit: 100, search });
            if (res.data) {
                setServices(res.data);
            } else if (Array.isArray(res)) {
                setServices(res);
            }
        } catch (error) {
            console.error("Failed fetching services:", error);
        }
    };

    useEffect(() => {
        fetchCategoryData();
        fetchServiceCategoryData();
        fetchServiceData();
    }, []);

    // Filter Categories dropdown based on search
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchCategoryData(searchCategory);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchCategory]);

    // Filter Service Categories dropdown based on search
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchServiceCategoryData(searchServiceCategory);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchServiceCategory]);

    // Filter Services dropdown based on search
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchServiceData(searchService);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchService]);

    // Update form if editing
    useEffect(() => {
        if (editCommission) {
            setFormData({
                scope: editCommission.scope || "GLOBAL",
                type: editCommission.type || "PROPERTY",
                categoryId: editCommission.categoryId?._id || editCommission.categoryId || "",
                serviceCategoryId: editCommission.serviceCategoryId?._id || editCommission.serviceCategoryId || "",
                serviceId: editCommission.serviceId?._id || editCommission.serviceId || "",
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

    const handleReset = () => {
        setFormData({
            scope: "GLOBAL",
            type: "PROPERTY",
            categoryId: "",
            serviceCategoryId: "",
            serviceId: "",
            commissionType: "PERCENTAGE",
            value: 0,
            isActive: true,
        });
        setSearchCategory("");
        setSearchServiceCategory("");
        setSearchService("");
        if (setEditCommission) setEditCommission(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                scope: formData.scope,
                type: formData.type,
                commissionType: formData.commissionType,
                value: Number(formData.value),
                isActive: formData.isActive
            };

            if (formData.scope === "CATEGORY") {
                if (formData.type === "PROPERTY") {
                    if (!formData.categoryId) {
                        toast.error("Please select a category");
                        setLoading(false);
                        return;
                    }
                    payload.categoryId = formData.categoryId;
                } else if (formData.type === "SERVICE") {
                    if (!formData.serviceCategoryId) {
                        toast.error("Please select a service category");
                        setLoading(false);
                        return;
                    }
                    payload.serviceCategoryId = formData.serviceCategoryId;
                    if (formData.serviceId) {
                        payload.serviceId = formData.serviceId;
                    }
                }
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
                    <Select
                        name="scope"
                        value={formData.scope}
                        onChange={handleChange}
                        disabled={!!editCommission}
                        className="mt-1"
                    >
                        <option value="GLOBAL">Global</option>
                        <option value="CATEGORY">Category Specific</option>
                    </Select>
                </div>

                <div>
                    <Label>Applicable To</Label>
                    <Select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        disabled={!!editCommission}
                        className="mt-1"
                    >
                        <option value="PROPERTY">Property</option>
                        <option value="SERVICE">Service</option>
                    </Select>
                </div>

                {formData.scope === "CATEGORY" && formData.type === "PROPERTY" && (
                    <div ref={propertyCatRef} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50 relative">
                        <Label className="mb-2 block">Choose Category</Label>

                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Choose Category"
                                value={
                                    categories.find((c) => c._id === formData.categoryId)?.category ||
                                    categories.find((c) => c._id === formData.categoryId)?.name ||
                                    categories.find((c) => c._id === formData.categoryId)?.title ||
                                    editCommission?.categoryId?.category ||
                                    editCommission?.categoryId?.name ||
                                    editCommission?.categoryId?.title ||
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

                {formData.scope === "CATEGORY" && formData.type === "SERVICE" && (
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50 space-y-4">
                        <div ref={serviceCatRef} className="relative">
                            <Label className="mb-2 block">Choose Service Category</Label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search Service Category"
                                    value={
                                        serviceCategories.find((c) => c._id === formData.serviceCategoryId)?.name ||
                                        editCommission?.serviceCategoryId?.name ||
                                        searchServiceCategory
                                    }
                                    onChange={(e) => {
                                        setSearchServiceCategory(e.target.value);
                                        setFormData(prev => ({ ...prev, serviceCategoryId: "", serviceId: "" }));
                                    }}
                                    onFocus={() => setShowServiceCategoryDropdown(true)}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                    disabled={!!editCommission}
                                />

                                {showServiceCategoryDropdown && (
                                    <div className="absolute z-20 mt-1 w-full max-h-48 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                                        {serviceCategories
                                            .filter((cat) =>
                                                (cat.name || "")
                                                    .toLowerCase()
                                                    .includes(searchServiceCategory.toLowerCase())
                                            )
                                            .map((cat) => (
                                                <div
                                                    key={cat._id}
                                                    onClick={() => {
                                                        setFormData(prev => ({ ...prev, serviceCategoryId: cat._id }));
                                                        setSearchServiceCategory("");
                                                        setShowServiceCategoryDropdown(false);
                                                    }}
                                                    className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                                                >
                                                    {cat.name || "Unnamed Category"}
                                                </div>
                                            ))}

                                        {serviceCategories.filter((cat) =>
                                            (cat.name || "")
                                                .toLowerCase()
                                                .includes(searchServiceCategory.toLowerCase())
                                        ).length === 0 && (
                                                <div className="px-4 py-2 text-gray-400 text-sm">
                                                    No service categories found
                                                </div>
                                            )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* <div ref={serviceRef} className="relative">
                            <Label className="mb-2 block">Choose Specific Service (Optional)</Label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search Specific Service"
                                    value={
                                        services.find((s) => s._id === formData.serviceId)?.name ||
                                        editCommission?.serviceId?.name ||
                                        searchService
                                    }
                                    onChange={(e) => {
                                        setSearchService(e.target.value);
                                        setFormData(prev => ({ ...prev, serviceId: "" }));
                                    }}
                                    onFocus={() => setShowServiceDropdown(true)}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                    disabled={!!editCommission}
                                />

                                {showServiceDropdown && (
                                    <div className="absolute z-20 mt-1 w-full max-h-48 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                                        {services
                                            .filter((s) => {
                                                const matchesSearch = (s.name || "")
                                                    .toLowerCase()
                                                    .includes(searchService.toLowerCase());
                                                const matchesCategory = formData.serviceCategoryId
                                                    ? (s.category?._id === formData.serviceCategoryId || s.category === formData.serviceCategoryId)
                                                    : true;
                                                return matchesSearch && matchesCategory;
                                            })
                                            .map((s) => (
                                                <div
                                                    key={s._id}
                                                    onClick={() => {
                                                        setFormData(prev => ({ ...prev, serviceId: s._id }));
                                                        setSearchService("");
                                                        setShowServiceDropdown(false);
                                                    }}
                                                    className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                                                >
                                                    {s.name || "Unnamed Service"}
                                                </div>
                                            ))}

                                        {services.filter((s) => {
                                            const matchesSearch = (s.name || "")
                                                .toLowerCase()
                                                .includes(searchService.toLowerCase());
                                            const matchesCategory = formData.serviceCategoryId
                                                ? (s.category?._id === formData.serviceCategoryId || s.category === formData.serviceCategoryId)
                                                : true;
                                            return matchesSearch && matchesCategory;
                                        }).length === 0 && (
                                                <div className="px-4 py-2 text-gray-400 text-sm">
                                                    No matching services found
                                                </div>
                                            )}
                                    </div>
                                )}
                            </div>
                        </div> */}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>Commission Type</Label>
                        <Select
                            name="commissionType"
                            value={formData.commissionType}
                            onChange={handleChange}
                            className="mt-1"
                        >
                            <option value="PERCENTAGE">Percentage (%)</option>
                            <option value="FLAT">Flat Amount</option>
                        </Select>
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
