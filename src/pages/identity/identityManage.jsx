import React from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import IdentityListComp from "../../components/identity/identityListComp";

export default function IdentityManage() {
  return (
    <>
      <PageMeta title="Identity Management" />
      <PageBreadcrumb pageTitle="Identity Verifications" />
      <div className="w-full">
        <IdentityListComp />
      </div>
    </>
  );
}
