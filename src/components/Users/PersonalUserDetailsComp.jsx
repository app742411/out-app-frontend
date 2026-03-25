import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getUser } from "../../api/authApi";
import ComponentCard from "../common/ComponentCard";
import toast from "react-hot-toast";

export default function PersonalUserDetailsComp() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const baseURL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                setLoading(true);
                const res = await getUser(id);
                setUser(res.data);
            } catch (error) {
                toast.error("Failed to load user details");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchUserDetails();
    }, [id]);

    if (loading) {
        return <div className="p-6 text-center text-gray-500">Loading user details...</div>;
    }

    if (!user) {
        return <div className="p-6 text-center text-gray-500">User not found.</div>;
    }

    return (
        <div className="space-y-6">
            <ComponentCard title="Personal Information">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    {/* Profile Picture */}
                    <div className="w-32 h-32 flex-shrink-0 rounded-full border-4 border-gray-100 overflow-hidden shadow-sm">
                        {user.profile ? (
                            <img
                                src={
                                    user.profile
                                        ? `${baseURL?.replace(/\/$/, "")}/uploads/users/${user.profile}`
                                        : "/images/user/user-01.jpg"
                                }
                                alt={user.firstName}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = "/images/user/user-01.jpg";
                                }}
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 text-3xl font-bold uppercase">
                                {user.firstName?.charAt(0)}
                                {user.lastName?.charAt(0)}
                            </div>
                        )}
                    </div>

                    {/* Details Grid */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">User ID</p>
                            <p className="font-semibold text-gray-900 dark:text-white">{user.userId || "-"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                            <p className="font-semibold text-gray-900 dark:text-white capitalize">
                                {user.salutation ? `${user.salutation} ` : ""}
                                {user.firstName} {user.lastName}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Email Address</p>
                            <p className="font-semibold text-gray-900 dark:text-white">{user.email || "-"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Phone Number</p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                                {user.phone ? `${user.phoneCode || ""} ${user.phone}` : "-"}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
                            <p className="font-semibold text-gray-900 dark:text-white capitalize">
                                {user.role || "-"}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                            <div className="mt-1 flex items-center gap-2">
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${user.isDeleted === false
                                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                        : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                                        }`}
                                >
                                    {user.isDeleted ? "Deleted" : "Active"}
                                </span>

                                {user.isVerified && (
                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                                        Verified
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </ComponentCard>
        </div>
    );
}
