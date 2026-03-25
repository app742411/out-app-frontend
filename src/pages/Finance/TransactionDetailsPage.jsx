import React from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import TransactionDetailsComp from "../../components/Finance/TransactionDetailsComp";

export default function TransactionDetailsPage() {
  return (
    <>
      <PageMeta
        title="Transaction Details | Out Admin"
        description="Detailed view of payment transaction."
      />
      <PageBreadcrumb pageTitle="Transaction Details" />
      <div className="space-y-6">
        <TransactionDetailsComp />
      </div>
    </>
  );
}
