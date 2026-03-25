// src/components/Restroom_Amenities/DeleteRestroomModal.jsx
import React, { useState } from "react";
import Button from "../ui/button/Button";
import { X, AlertTriangle } from "lucide-react";

export default function DeleteRestroomModal({ open, onClose, onConfirm }) {
    const [loading, setLoading] = useState(false);

    if (!open) return null;

    const handleConfirm = async () => {
        setLoading(true);
        await onConfirm();
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <AlertTriangle className="text-red-500" size={24} />
                        Delete Amenity
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-6 font-medium">
                    Are you sure you want to delete this amenity? This action cannot be undone.
                </p>

                <div className="flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        disabled={loading}
                        className="bg-red-500 text-white hover:bg-red-600"
                        onClick={handleConfirm}
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
