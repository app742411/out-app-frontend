import React, { useState, useEffect } from "react";
import Button from "../ui/button/Button";
import { addRestroom, updateRestroom } from "../../api/authApi";
import toast from "react-hot-toast";

import Label from "../form/Label";
import Input from "../form/input/InputField";

export default function AddRestroomAmenitiesComp({ onAmenitiesAdded, editData, onCancel }) {
    const [amenityName, setAmenityName] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (editData) {
            setAmenityName(editData.name || "");
        } else {
            setAmenityName("");
        }
    }, [editData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!amenityName.trim()) {
            toast.error("Please enter an amenity name");
            return;
        }

        try {
            setLoading(true);
            if (editData) {
                await updateRestroom(editData._id, amenityName);
                toast.success("Restroom amenity updated successfully");
            } else {
                await addRestroom(amenityName);
                toast.success("Restroom amenity added successfully");
            }
            
            setAmenityName("");
            onAmenitiesAdded?.();
        } catch (error) {
            toast.error(error.message || "Failed to save restroom amenity");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h4 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white/90">
                {editData ? "Update Restroom Amenity" : "Add New Restroom Amenity"}
            </h4>
            
            <div>
                <Label>Amenity Name</Label>
                <Input
                    type="text"
                    placeholder="e.g. Washroom Heater, Shower"
                    value={amenityName}
                    onChange={(e) => setAmenityName(e.target.value)}
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
                        {loading ? "Saving..." : editData ? "Update Amenity" : "Add Amenity"}
                    </Button>
                </div>
            </form>
    );
}
