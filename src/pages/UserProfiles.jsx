import React from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import UserMetaCard from "../components/UserProfile/UserMetaCard";
import UserInfoCard from "../components/UserProfile/UserInfoCard";
import UserAddressCard from "../components/UserProfile/UserAddressCard";
import PageMeta from "../components/common/PageMeta";
import { useUser } from "../context/UserContext.jsx";
import { Link } from "react-router";


export default function UserProfiles() {
  const { user, loading, fetchDashboard } = useUser();

  return (
    <>
      <PageMeta
        title="Out Profile Dashboard"
        description="Manage your profile and account settings on Out."
      />
      <PageBreadcrumb pageTitle="Profile" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        </h3>
        {loading ? (
          <div className="p-5 text-center text-gray-500 dark:text-gray-400">
            Loading profile...
          </div>
        ) : (
          <div className="space-y-6">
            <UserMetaCard user={user} />
            <UserInfoCard user={user} onProfileUpdate={fetchDashboard} />
            
            {/* Account Security / Change Password */}
            <div className="rounded-2xl border border-gray-200 bg-gray-50/50 p-5 dark:border-gray-800 dark:bg-white/[0.02] lg:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
              <div>
                <h4 className="text-base font-semibold text-gray-800 dark:text-white/90">
                  Account Security
                </h4>
                <p className="mt-1 text-sm text-gray-500">
                  Ensure your account is using a strong, secure password.
                </p>
              </div>
              <Link
                to="/change-password"
                className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white shadow-theme-xs transition-all hover:bg-brand-600 dark:bg-brand-500 dark:hover:bg-brand-600 shrink-0"
              >
                Change Password
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
