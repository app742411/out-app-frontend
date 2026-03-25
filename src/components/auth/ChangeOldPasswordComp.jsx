import React, { useState } from "react";
import ComponentCard from "../common/ComponentCard";
import Button from "../ui/button/Button";
import { changePassword } from "../../api/authApi";
import toast from "react-hot-toast";

export default function ChangeOldPasswordComp() {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!oldPassword || !newPassword || !confirmPassword) {
            toast.error("Please fill in all fields.");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("New password and confirm password do not match.");
            return;
        }

        try {
            setLoading(true);
            await changePassword(oldPassword, newPassword, confirmPassword);
            toast.success("Password changed successfully!");
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            toast.error(error.message || "Failed to change password. Please check your old password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto w-full max-w-2xl">
            <ComponentCard title="Change Password">
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                            Old Password
                        </label>
                        <input
                            type="password"
                            placeholder="Enter old password"
                            className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 outline-none transition dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                            New Password
                        </label>
                        <input
                            type="password"
                            placeholder="Enter new password"
                            className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 outline-none transition dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            placeholder="Confirm new password"
                            className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 outline-none transition dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="pt-2">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brand-500 hover:bg-brand-600 text-white"
                        >
                            {loading ? "Changing Password..." : "Update Password"}
                        </Button>
                    </div>
                </form>
            </ComponentCard>
        </div>
    );
}
