import React from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import IdentityDetailsComp from "../../components/identity/identityDetailsComp";

export default function IdentityDetails() {
  return (
    <>
      <PageMeta title="Identity Details" />
      <PageBreadcrumb pageTitle="Verification Details" />
      <div className="w-full">
        <IdentityDetailsComp />
      </div>
    </>
  );
}
