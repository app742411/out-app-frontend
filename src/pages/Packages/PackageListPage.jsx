
import React from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PackageListComp from "../../components/Packages/PackageListComp";

export default function PackageListPage() {
    return (
        <>
            <PageMeta title="Package Management | Out Admin" />
            <PageBreadcrumb pageTitle="Package Management" />


            <div className="space-y-6 mt-6">
                <PackageListComp />
            </div>
        </>
    );
}
