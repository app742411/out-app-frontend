import React from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import WithdrawRequestsList from "../../components/Finance/WithdrawRequestsList";
import { HandCoins } from "lucide-react";

export default function VendorPayoutsPage() {
    return (
        <>
            <PageMeta
                title="Vendor Withdraw Requests | Out Admin"
                description="Manage and process service provider withdrawal requests."
            />

            <PageBreadcrumb pageTitle="Service Provider Payouts" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between -mt-2 mb-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Review and approve vendor fund withdrawal requests from their wallets.</p>
                </div>

                {/* Dashboard Stats for Withdrawals (Optional) */}
                {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-5 rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center text-orange-600">
                            <HandCoins size={24} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Pending Requests</p>
                            <h4 className="text-xl font-bold text-gray-900 dark:text-white">Active Management</h4>
                        </div>
                    </div>
                </div> */}

                {/* Main List */}
                <WithdrawRequestsList />
            </div>
        </>
    );
}
