import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { createBanner, updateBanner } from "../../api/authApi";
import Button from "../ui/button/Button";

const BANNER_TYPES = ["OFFER", "PROMOTION", "ANNOUNCEMENT"];

export default function AddBannerComp({ fetchBanners, editBanner, setEditBanner }) {
    const [title, setTitle] = useState("");
    const [bannerType, setBannerType] = useState("OFFER");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (editBanner) {
            setTitle(editBanner.title || "");
            setBannerType(editBanner.bannerType || "OFFER");
            setImagePreview(editBanner.bannerImg || null);
            setImageFile(null);
        } else {
            resetForm();
        }
    }, [editBanner]);

    const resetForm = () => {
        setTitle("");
        setBannerType("OFFER");
        setImageFile(null);
        setImagePreview(null);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            toast.error("Title is required");
            return;
        }

        if (!editBanner && !imageFile && !imagePreview) {
            toast.error("Banner image is required");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("bannerType", bannerType);
            if (imageFile) {
                formData.append("bannerImg", imageFile);
            }

            if (editBanner) {
                await updateBanner(editBanner._id || editBanner.id, formData);
                toast.success("Banner updated successfully");
            } else {
                await createBanner(formData);
                toast.success("Banner created successfully");
            }

            resetForm();
            setEditBanner(null);
            if (fetchBanners) fetchBanners();
        } catch (error) {
            toast.error(error.message || `Failed to ${editBanner ? "update" : "create"} banner`);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="p-5 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {editBanner ? "Edit Banner" : "Add New Banner"}
                </h3>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Title
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        placeholder="Enter banner title"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Banner Type
                    </label>
                    <select
                        value={bannerType}
                        onChange={(e) => setBannerType(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    >
                        {BANNER_TYPES.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Banner Image
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg">
                        <div className="space-y-1 text-center">
                            {imagePreview ? (
                                <div className="relative">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="mx-auto h-32 w-auto rounded-lg object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setImageFile(null);
                                            setImagePreview(null);
                                        }}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center hover:bg-red-600"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="flex text-sm text-gray-600 dark:text-gray-400 justify-center">
                                        <label
                                            htmlFor="file-upload"
                                            className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-brand-600 hover:text-brand-500 focus-within:outline-none"
                                        >
                                            <span>Upload a file</span>
                                            <input
                                                id="file-upload"
                                                name="file-upload"
                                                type="file"
                                                className="sr-only"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                            />
                                        </label>
                                        <p className="pl-1 mx-2">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        PNG, JPG, GIF up to 5MB
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    {editBanner && (
                        <button
                            type="button"
                            className="flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
                            onClick={() => {
                                setEditBanner(null);
                                resetForm();
                            }}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                    )}
                    <Button
                        type="submit"
                        className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        disabled={loading}
                    >
                        {loading ? "Saving..." : (editBanner ? "Update Banner" : "Create Banner")}
                    </Button>
                </div>
            </form>
        </div>
    );
}
