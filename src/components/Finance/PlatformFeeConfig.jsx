import React, { useState, useEffect } from "react";
import ComponentCard from "../common/ComponentCard";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { updatePlatformFee } from "../../api/authApi";
import toast from "react-hot-toast";
import { Select } from "../ui/select/Select";

const PlatformFeeConfig = ({ initialData, onUpdate }) => {
    const [feeType, setFeeType] = useState("PERCENTAGE");
    const [value, setValue] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFeeType(initialData.feeType || "PERCENTAGE");
            setValue(initialData.value || "");
        }
    }, [initialData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!value) return toast.error("Fee value is required");

        try {
            setLoading(true);
            await updatePlatformFee({ feeType, value: Number(value) });
            toast.success("Platform fee updated successfully");
            onUpdate?.();
        } catch (error) {
            toast.error(error.message || "Failed to update platform fee");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ComponentCard title="Platform Fee Configuration">
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <Label>Fee Type</Label>
                    <Select
                        className="mt-1"
                        value={feeType}
                        onChange={(e) => setFeeType(e.target.value)}
                    >
                        <option value="PERCENTAGE">Percentage (%)</option>
                        <option value="FLAT">Flat Amount</option>
                    </Select>
                </div>

                <div>
                    <Label>Value</Label>
                    <Input
                        type="number"
                        placeholder={feeType === "PERCENTAGE" ? "Enter percentage" : "Enter amount"}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
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

export default PlatformFeeConfig;
