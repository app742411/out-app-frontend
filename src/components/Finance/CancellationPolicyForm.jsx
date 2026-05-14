import React, { useState, useEffect } from "react";
import ComponentCard from "../common/ComponentCard";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { PlusIcon, TrashBinIcon } from "../../icons";
import Select from "../ui/select/Select";

const CancellationPolicyForm = ({ initialPolicies = [], onSave, loading, saving }) => {
    const [policies, setPolicies] = useState([]);

    useEffect(() => {
        if (initialPolicies && initialPolicies.length > 0) {
            setPolicies(initialPolicies);
        } else if (policies.length === 0) {
            setPolicies([
                {
                    name: "",
                    description: "",
                    rules: [{ from: 0, unit: "days", refundPercentage: 0 }],
                    cancellationFee: 0
                }
            ]);
        }
    }, [initialPolicies]);

    const handleAddPolicy = () => {
        if (policies.length >= 3) return;
        setPolicies([
            ...policies,
            {
                name: "",
                description: "",
                rules: [{ from: 0, unit: "days", refundPercentage: 0 }],
                cancellationFee: 0
            }
        ]);
    };

    const handleRemovePolicy = (index) => {
        const updated = [...policies];
        updated.splice(index, 1);
        setPolicies(updated);
    };

    const handlePolicyChange = (index, field, value) => {
        const updated = [...policies];
        updated[index][field] = value;
        setPolicies(updated);
    };

    const handleRuleChange = (policyIndex, ruleIndex, field, value) => {
        const updated = [...policies];
        updated[policyIndex].rules[ruleIndex][field] = field === "unit" ? value : Number(value);
        setPolicies(updated);
    };

    const handleAddRule = (policyIndex) => {
        const updated = [...policies];
        updated[policyIndex].rules.push({ from: 0, unit: "days", refundPercentage: 0 });
        setPolicies(updated);
    };

    const handleRemoveRule = (policyIndex, ruleIndex) => {
        const updated = [...policies];
        updated[policyIndex].rules.splice(ruleIndex, 1);
        setPolicies(updated);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(policies);
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading cancellation policies...</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {policies.map((policy, pIdx) => (
                <ComponentCard
                    key={pIdx}
                    title={
                        <div className="flex justify-between items-center w-full">
                            <span>Policy #{pIdx + 1}: {policy.name || "Unnamed Policy"}</span>
                            {policies.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => handleRemovePolicy(pIdx)}
                                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <TrashBinIcon className="size-5" />
                                </button>
                            )}
                        </div>
                    }
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 pt-4">
                        <div className="space-y-2">
                            <Label>Policy Name</Label>
                            <Select
                                value={policy.name}
                                onChange={(e) => handlePolicyChange(pIdx, "name", e.target.value)}
                            >
                                <option value="">Select Policy</option>
                                <option value="Flexible">Flexible</option>
                                <option value="Moderate">Moderate</option>
                                <option value="Strict">Strict</option>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Cancellation Fee (Optional)</Label>
                            <Input
                                type="number"
                                placeholder="Enter fee"
                                value={policy.cancellationFee}
                                onChange={(e) => handlePolicyChange(pIdx, "cancellationFee", Number(e.target.value))}
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <Label>Description</Label>
                            <Input
                                placeholder="Description of the policy"
                                value={policy.description}
                                onChange={(e) => handlePolicyChange(pIdx, "description", e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="mt-8 border-t border-gray-100 dark:border-gray-800 pt-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-md font-semibold text-gray-800 dark:text-white/90">Rules</h3>
                            <button
                                type="button"
                                onClick={() => handleAddRule(pIdx)}
                                className="flex items-center gap-1 text-sm font-medium text-brand-500 hover:text-brand-600 transition-colors"
                            >
                                <PlusIcon className="size-4" />
                                Add Rule
                            </button>
                        </div>

                        <div className="space-y-4">
                            {policy.rules.map((rule, rIdx) => (
                                <div key={rIdx} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl relative">
                                    {policy.rules.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveRule(pIdx, rIdx)}
                                            className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <TrashBinIcon className="size-4" />
                                        </button>
                                    )}

                                    <div className="space-y-2">
                                        <Label>From</Label>
                                        <Input
                                            type="number"
                                            value={rule.from}
                                            onChange={(e) => handleRuleChange(pIdx, rIdx, "from", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Unit</Label>
                                        <Select
                                            value={rule.unit}
                                            onChange={(e) => handleRuleChange(pIdx, rIdx, "unit", e.target.value)}
                                        >
                                            <option value="days">Days</option>
                                            <option value="hours">Hours</option>
                                        </Select>
                                    </div>
                                    <div className="md:col-span-1 space-y-2">
                                        <Label>Refund (%)</Label>
                                        <Input
                                            type="number"
                                            value={rule.refundPercentage}
                                            onChange={(e) => handleRuleChange(pIdx, rIdx, "refundPercentage", e.target.value)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </ComponentCard>
            ))}

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
                {policies.length < 3 ? (
                    <button
                        type="button"
                        onClick={handleAddPolicy}
                        className="flex items-center gap-2 px-6 py-2.5 border-2 border-brand-500 text-brand-500 font-semibold rounded-lg hover:bg-brand-50 transition-colors"
                    >
                        <PlusIcon className="size-5" />
                        Add Another Policy
                    </button>
                ) : (
                    <div />
                )}
                <Button type="submit" disabled={saving} size="lg" className="w-full sm:w-auto">
                    {saving ? "Saving Changes..." : "Save All Policies"}
                </Button>
            </div>
        </form>
    );
};

export default CancellationPolicyForm;
