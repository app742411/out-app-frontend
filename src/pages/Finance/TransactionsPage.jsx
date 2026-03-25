import React, { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import TransactionListComp from "../../components/Finance/TransactionListComp";
import WalletTransactionListComp from "../../components/Finance/WalletTransactionListComp";
import { CreditCard, Wallet } from "lucide-react";

export default function TransactionsPage() {
  const [activeTab, setActiveTab] = useState("payment");

  return (
    <>
      <PageMeta
        title="Transaction Logs | Out Admin"
        description="View and manage all payment and wallet transactions."
      />
      <PageBreadcrumb pageTitle="Transaction Logs" />
      
      <div className="space-y-6">
        {/* Tab Selection */}
        <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab("payment")}
            className={`flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-lg transition-all ${
              activeTab === "payment"
                ? "bg-white dark:bg-gray-700 shadow-sm text-brand-500"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <CreditCard size={18} />
            Payment Transactions
          </button>
          <button
            onClick={() => setActiveTab("wallet")}
            className={`flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-lg transition-all ${
              activeTab === "wallet"
                ? "bg-white dark:bg-gray-700 shadow-sm text-brand-500"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <Wallet size={18} />
            Wallet Transactions
          </button>
        </div>

        {/* Dynamic Content */}
        <div className="transition-all duration-300">
          {activeTab === "payment" ? (
            <TransactionListComp />
          ) : (
            <WalletTransactionListComp />
          )}
        </div>
      </div>
    </>
  );
}
