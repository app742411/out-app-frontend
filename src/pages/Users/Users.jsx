import React from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import AllUserListComp from "../../components/Users/AllUserListComp";

export default function Users() {
  return (
    <>
      <PageMeta title="Registered Service Providers" />
      <PageBreadcrumb pageTitle="All Users" />
      <div className="w-full">
        <AllUserListComp />
      </div>
    </>
  );
}
