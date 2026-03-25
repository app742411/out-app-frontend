import React, { useState, useEffect } from "react";
import Button from "../ui/button/Button";
import { addFeature, updateFeature } from "../../api/authApi";
import toast from "react-hot-toast";
import Label from "../form/Label";
import Input from "../form/input/InputField";

export default function AddFeature({ onFeatureAdded, editData, onCancel }) {
    const [featureName, setFeatureName] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (editData) {
            setFeatureName(editData.name || "");
        } else {
            setFeatureName("");
        }
    }, [editData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!featureName.trim()) {
            toast.error("Please enter a feature name");
            return;
        }

        try {
            setLoading(true);
            if (editData) {
                await updateFeature(editData._id, featureName);
                toast.success("Feature updated successfully");
            } else {
                await addFeature(featureName);
                toast.success("Feature added successfully");
            }
            
            setFeatureName("");
            onFeatureAdded?.();
        } catch (error) {
            toast.error(error.message || "Failed to save feature");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h4 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white/90">
                {editData ? "Update Feature" : "Add New Feature"}
            </h4>

            <div>
                <Label>Feature Name</Label>
                <Input
                    type="text"
                    placeholder="e.g. WiFi, Pool, Room Heater"
                    value={featureName}
                    onChange={(e) => setFeatureName(e.target.value)}
                />
            </div>

            <div className="flex items-center gap-3 mt-4">
                {editData && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                )}
                <Button
                    type="submit"
                    disabled={loading}
                    className={`flex-1 ${editData ? '' : 'w-full'}`}
                >
                    {loading ? "Saving..." : editData ? "Update Feature" : "Add Feature"}
                </Button>
            </div>
        </form>
    );
}
