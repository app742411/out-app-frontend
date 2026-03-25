import React, { useState, useEffect } from "react";
import ComponentCard from "../common/ComponentCard";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { updateTax } from "../../api/authApi";
import toast from "react-hot-toast";

const TaxConfig = ({ initialData, onUpdate }) => {
    const [percentage, setPercentage] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setPercentage(initialData.percentage || "");
        }
    }, [initialData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!percentage) return toast.error("Tax percentage is required");

        try {
            setLoading(true);
            await updateTax({ percentage: Number(percentage) });
            toast.success("Tax configuration updated successfully");
            onUpdate?.();
        } catch (error) {
            toast.error(error.message || "Failed to update tax");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ComponentCard title="Tax Configuration">
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <Label>Tax Percentage (%)</Label>
                    <Input
                        type="number"
                        placeholder="Enter tax percentage"
                        value={percentage}
                        onChange={(e) => setPercentage(e.target.value)}
                    />
                </div>

                <div className="flex justify-end">
                    <Button type="submit" disabled={loading}>
                        {loading ? "Updating..." : "Save Changes"}
                    </Button>
                </div>
            </form>
        </ComponentCard>
    );
};

export default TaxConfig;
