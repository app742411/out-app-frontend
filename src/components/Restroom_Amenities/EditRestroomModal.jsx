// src/components/Restroom_Amenities/EditRestroomModal.jsx
import React, { useState, useEffect } from "react";
import Button from "../ui/button/Button";
import { X } from "lucide-react";

export default function EditRestroomModal({ open, onClose, amenity, onSave }) {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (amenity) {
            setName(amenity.name || "");
        }
    }, [amenity, open]);

    if (!open) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        setLoading(true);
        await onSave(name);
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900">
                <div className="mb-5 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Edit Restroom Amenity
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                            Amenity Name
                        </label>
                        <input
                            type="text"
                            required
                            className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 outline-none transition dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-brand-500 text-white hover:bg-brand-600"
                        >
                            {loading ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
